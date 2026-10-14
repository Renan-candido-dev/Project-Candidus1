import sys, json, wave, difflib, unicodedata, re, numpy as np, sherpa_onnx, torch, torchaudio
sp = sys.argv[1]
sys.path.insert(0, sp + '/vc/knnvc')
SR = 16000
def wsave(path, x, sr=SR):
    x = np.clip(np.asarray(x, np.float32), -1, 1)
    f = wave.open(path, 'wb'); f.setnchannels(1); f.setsampwidth(2); f.setframerate(sr); f.writeframes((x * 32767).astype(np.int16).tobytes()); f.close()
def wload(path):
    f = wave.open(path); return np.frombuffer(f.readframes(f.getnframes()), np.int16).astype(np.float32) / 32768
def norm(s):
    s = unicodedata.normalize('NFD', s.lower()); s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^a-z ]', '', s).split()
LINES = json.load(open(sp + '/script.json'))  # [texto falado, pausa, texto esperado opcional]
m = sp + '/vits-piper-pt_BR-faber-medium/'
tts = sherpa_onnx.OfflineTts(sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(
    vits=sherpa_onnx.OfflineTtsVitsModelConfig(model=m + 'pt_BR-faber-medium.onnx', tokens=m + 'tokens.txt', data_dir=m + 'espeak-ng-data'), num_threads=4)))
a_ = sp + '/asr/sherpa-onnx-whisper-small/small-'
rec = sherpa_onnx.OfflineRecognizer.from_whisper(encoder=a_ + 'encoder.int8.onnx', decoder=a_ + 'decoder.int8.onnx', tokens=a_ + 'tokens.txt', language='pt', task='transcribe', num_threads=4)
import hubconf
knn = hubconf.knn_vc(pretrained=True, progress=False, prematched=True, device='cpu')
matching = knn.get_matching_set([torch.tensor(wload(sp + '/ref_voice.wav'))[None]], vad_trigger_level=0)

def synth(txt, speed):
    a = tts.generate(txt, sid=0, speed=speed)
    x = torchaudio.functional.resample(torch.tensor(a.samples)[None], a.sample_rate, SR)[0].numpy()
    idx = np.where(np.abs(x) > 0.01)[0]
    return x[max(0, idx[0] - 400): idx[-1] + 800]

pieces, times, t = [], [], 0.0
for line in LINES:
    txt, pause = line[0], line[1]
    target = norm(line[2] if len(line) > 2 else txt)
    best = None
    for speed in (1.0, 1.05, 1.1):
        src = synth(txt, speed)
        q = knn.get_features(torch.tensor(src)[None], vad_trigger_level=0)
        for k in (4, 6, 8):
            out = knn.match(q, matching, topk=k).numpy()
            st = rec.create_stream(); st.accept_waveform(SR, np.concatenate([out, np.zeros(8000, np.float32)])); rec.decode_stream(st)
            hyp = norm(st.result.text)
            score = difflib.SequenceMatcher(None, ' '.join(target), ' '.join(hyp)).ratio() + 0.01 * speed
            if best is None or score > best[0]:
                best = (score, out, speed, k, st.result.text.strip())
    score, out, speed, k, hyp = best
    print(f"{score:.2f} v{speed} k{k} | {hyp}", flush=True)
    times.append((t, t + len(out) / SR, txt))
    pieces += [out, np.zeros(int(pause * SR), np.float32)]
    t += len(out) / SR + pause
wsave(sp + '/vc_out.wav', np.concatenate(pieces))
json.dump(times, open(sp + '/tts_times.json', 'w'), ensure_ascii=False, indent=1)
print('total', round(t, 2))
