/* Exporta os vídeos para MP4 (1080x1920, 30 fps, H.264).
   Uso:  node export.js 1          -> out/candidus-apresentacao.mp4
         node export.js 2          -> out/candidus-proposta.mp4
         node export.js 2 --music trilha.mp3   (opcional: adiciona trilha)
   Requisitos: Node 18+, playwright (npm i playwright) e ffmpeg no PATH. */
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const v = process.argv[2] === '2' ? '2' : '1';
const mi = process.argv.indexOf('--music');
const music = mi > 0 ? process.argv[mi + 1] : null;
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

  const args = ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-'];
  if (music) args.push('-i', music, '-map', '0:v', '-map', '1:a', '-c:a', 'aac', '-b:a', '192k', '-shortest',
                       '-af', `afade=t=out:st=${(duration - 1.5).toFixed(2)}:d=1.5`);
  args.push('-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'slow', '-crf', '18', '-movflags', '+faststart', OUT);
  const ff = spawn('ffmpeg', args, { stdio: ['pipe', 'inherit', 'inherit'] });

  for (let f = 0; f < frames; f++) {
    const b64 = await page.evaluate(t => { window.renderAt(t); return document.getElementById('cv').toDataURL('image/jpeg', .95).split(',')[1]; }, f / FPS);
    if (!ff.stdin.write(Buffer.from(b64, 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 60 === 0) process.stdout.write(`\r${v === '2' ? 'Proposta' : 'Apresentação'}: ${f}/${frames}`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await browser.close(); server.close();
  console.log(`\nOK -> ${OUT} (${duration.toFixed(1)}s)`);
})();
