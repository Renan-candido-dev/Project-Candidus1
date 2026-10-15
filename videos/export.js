/* Exporta os vídeos para MP4 (1080x1920, 30 fps, H.264).
   Uso:  node export.js 1          -> out/candidus-apresentacao.mp4
         node export.js 2          -> out/candidus-proposta.mp4
         node export.js 2 --music trilha.mp3   (troca a trilha gerada por outra)
         node export.js 1 --sem-audio          (vídeo mudo)
   Áudio: rode antes `python3 gerar_audio.py` (narração + trilha em audio/).
   Requisitos: Node 18+, playwright (npm i playwright) e ffmpeg no PATH. */
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const v = process.argv[2] === '2' ? '2' : '1';
const mi = process.argv.indexOf('--music');
const music = mi > 0 ? process.argv[mi + 1] : path.join(ROOT, 'audio', 'musica.mp3');
const semAudio = process.argv.includes('--sem-audio');
const FPS = 30;
const OUT = path.join(ROOT, 'out', v === '2' ? 'candidus-proposta.mp4' : 'candidus-apresentacao.mp4');

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png',
               '.jpg': 'image/jpeg', '.woff2': 'font/woff2' };

(async () => {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  const server = http.createServer((req, res) => {
    const f = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
    if (!f.startsWith(ROOT) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  }).listen(0);
  const port = server.address().port;

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto(`http://127.0.0.1:${port}/player.html?v=${v}&export=1`);
  await page.evaluate(() => window.ready);
  const duration = await page.evaluate(() => window.DURATION);
  const frames = Math.round(duration * FPS);

  const starts = await page.evaluate(() => TL.scenes.map(s => s.start));
  const VIDEO_TMP = OUT.replace(/\.mp4$/, '.video.mp4');
  const args = ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
                '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'slow', '-crf', '18', '-movflags', '+faststart', VIDEO_TMP];
  const ff = spawn('ffmpeg', args, { stdio: ['pipe', 'inherit', 'inherit'] });

  for (let f = 0; f < frames; f++) {
    const b64 = await page.evaluate(t => { window.renderAt(t); return document.getElementById('cv').toDataURL('image/jpeg', .95).split(',')[1]; }, f / FPS);
    if (!ff.stdin.write(Buffer.from(b64, 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 60 === 0) process.stdout.write(`\r${v === '2' ? 'Proposta' : 'Apresentação'}: ${f}/${frames}`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await browser.close(); server.close();
  mixAudio(VIDEO_TMP, starts, duration);
  fs.unlinkSync(VIDEO_TMP);
  console.log(`\nOK -> ${OUT} (${duration.toFixed(1)}s)`);
})();

/* Mixagem: trilha de fundo + narração de cada cena, com a música
   abaixando automaticamente (sidechain) quando a voz entra. */
function mixAudio(videoTmp, starts, duration) {
  const VO_DELAY = .3;
  const voices = starts.map((st, i) => ({ f: path.join(ROOT, 'audio', 'v' + v, String(i).padStart(2, '0') + '.wav'), at: st + VO_DELAY }))
                       .filter(x => fs.existsSync(x.f));
  const hasMusic = music && fs.existsSync(music);
  if (semAudio || (!hasMusic && !voices.length)) { fs.copyFileSync(videoTmp, OUT); return; }
  const inputs = ['-i', videoTmp]; const fl = []; let n = 1;
  const fmt = 'aformat=sample_rates=44100:channel_layouts=stereo';
  let mus = null;
  if (hasMusic) {
    inputs.push('-stream_loop', '-1', '-i', music);
    fl.push(`[${n}]${fmt},atrim=0:${duration.toFixed(3)},afade=t=in:d=0.8,afade=t=out:st=${(duration - 2).toFixed(3)}:d=2,volume=0.30[mus]`);
    mus = '[mus]'; n++;
  }
  const vl = voices.map(x => {
    inputs.push('-i', x.f); const ms = Math.round(x.at * 1000);
    fl.push(`[${n}]${fmt},adelay=${ms}|${ms}[v${n}]`); return `[v${n++}]`;
  });
  if (vl.length) fl.push(`${vl.join('')}amix=inputs=${vl.length}:normalize=0:duration=longest,apad=whole_dur=${duration.toFixed(3)}[vo]`);
  if (mus && vl.length) {
    fl.push('[vo]asplit[vo1][vo2]');
    fl.push(`${mus}[vo1]sidechaincompress=threshold=0.02:ratio=5:attack=30:release=500[duck]`);
    fl.push('[duck][vo2]amix=inputs=2:normalize=0,loudnorm=I=-15:TP=-1.5:LRA=11,aresample=44100[a]');
  } else fl.push(`${mus || '[vo]'}loudnorm=I=-15:TP=-1.5:LRA=11,aresample=44100[a]`);
  const r = require('child_process').spawnSync('ffmpeg', ['-y', '-loglevel', 'error', ...inputs, '-filter_complex', fl.join(';'),
    '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-t', duration.toFixed(3), '-movflags', '+faststart', OUT],
    { stdio: 'inherit' });
  if (r.status !== 0) throw new Error('falha na mixagem de áudio');
}
