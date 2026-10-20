/* Gera CALENDARIO.md (dia, tema, legenda pronta e hashtags) a partir de videos.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const ctx = {}; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname, 'videos.js'), 'utf8').replace(/^const /gm, 'var '), ctx);
let md = '# Calendário de conteúdo — 30 dias\n\nUm vídeo por dia. Arquivos em `out/`. Legenda pronta para copiar e colar.\n\n';
md += '| Dia | Tema | Arquivo |\n|---|---|---|\n';
ctx.VIDEOS.forEach(v => { md += `| ${v.dia} | ${v.titulo} | \`out/dia-${String(v.dia).padStart(2, '0')}-${v.slug}.mp4\` |\n`; });
md += '\n## Legendas\n\n';
ctx.VIDEOS.forEach(v => {
  md += `### Dia ${v.dia} · ${v.titulo}\n\n${v.legenda}\n\n👉 Quer organizar o financeiro da sua empresa? Envie GESTÃO no direct.\n\n${v.hashtags}\n\n`;
});
fs.writeFileSync(path.join(__dirname, 'CALENDARIO.md'), md);
console.log('CALENDARIO.md gerado com', ctx.VIDEOS.length, 'vídeos');
