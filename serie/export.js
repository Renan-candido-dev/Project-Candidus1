/* Exporta a série para MP4 (1080x1920, 30 fps) com trilha e efeitos.
   Uso:  node export.js 1          -> um vídeo (dia 1)
         node export.js 1-10       -> intervalo
         node export.js todos      -> os 30
   Antes: python3 gerar_musicas.py (trilhas em audio/). Requer playwright e ffmpeg. */
const { chromium } = require('playwright');
const { spawn, spawnSync } = require('child_process');
const http = require('http'), fs = require('fs'), path = require('path');

const ROOT = path.resolve(__dirname, '..'), SERIE = __dirname, FPS = 30;
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg' };
const arg = process.argv[2] || '1';
const dias = arg === 'todos' ? [...Array(30)].map((_, i) => i + 1)
  : arg.includes('-') ? (([a, b]) => [...Array(b - a + 1)].map((_, i) => a + i))(arg.split('-').map(Number)) : arg.split(',').map(Number);

(async () => {
  const server = http.createServer((q, r) => {
    const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
    if (!f.startsWith(ROOT) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); }
    r.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r);
  }).listen(0);
  const port = server.address().port, browser = await chromium.launch();
  for (const n of dias) {
    const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
    page.on('pageerror', e => console.error('ERRO na página:', e.message));
    await page.goto(`http://127.0.0.1:${port}/serie/player.html?n=${n}&export=1`);
    await page.evaluate(() => window.ready);
    const info = await page.evaluate(() => ({ d: DURATION, slug: VID.slug, trilha: VID.trilha, cortes: VID.blocos.map(b => b.start) }));
    const nome = `dia-${String(n).padStart(2, '0')}-${info.slug}`, tmp = path.join(SERIE, 'out', nome + '.video.mp4'), out = path.join(SERIE, 'out', nome + '.mp4');
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'medium', '-crf', '21', '-maxrate', '6M', '-bufsize', '12M', '-movflags', '+faststart', tmp], { stdio: ['pipe', 'inherit', 'inherit'] });
    const frames = Math.round(info.d * FPS);
    for (let f = 0; f < frames; f++) {
      const b64 = await page.evaluate(t => { renderAt(t); return document.getElementById('cv').toDataURL('image/jpeg', .93).split(',')[1]; }, f / FPS);
      if (!ff.stdin.write(Buffer.from(b64, 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r)); await page.close();
    // áudio: trilha + whoosh suave em cada corte + assinatura na logo
    const A = f => path.join(SERIE, 'audio', f), D = info.d.toFixed(3);
    const inputs = ['-i', tmp, '-i', A(`trilha-${info.trilha}.mp3`)], fl = [`[1]atrim=0:${D},afade=t=in:d=0.3,afade=t=out:st=${(info.d - 1.2).toFixed(3)}:d=1.2,volume=0.85[m]`];
    const fx = info.cortes.slice(1).map((s, i, arr) => [i === arr.length - 1 ? 'sfx-logo.mp3' : 'sfx-whoosh.mp3', i === arr.length - 1 ? s : Math.max(0, s - .25)]);
    const labels = ['[m]'];
    fx.forEach(([f, at], k) => { inputs.push('-i', A(f)); const ms = Math.round(at * 1000); fl.push(`[${k + 2}]adelay=${ms}|${ms},volume=${f.includes('logo') ? .7 : .35}[f${k}]`); labels.push(`[f${k}]`); });
    fl.push(`${labels.join('')}amix=inputs=${labels.length}:normalize=0:duration=first,loudnorm=I=-14:TP=-1.5:LRA=11,aresample=44100[a]`);
    const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', ...inputs, '-filter_complex', fl.join(';'), '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-t', D, '-movflags', '+faststart', out], { stdio: 'inherit' });
    fs.unlinkSync(tmp);
    console.log(r.status === 0 ? `OK ${nome}.mp4 (${info.d.toFixed(1)}s)` : `FALHOU ${nome}`);
  }
  await browser.close(); server.close();
})();
