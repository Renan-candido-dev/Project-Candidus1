/**
 * Utilitário da série (rode com `npx tsx scripts/series.ts <comando> <id|all>`):
 *   lines   gera build/<id>.lines.json com o texto falado de cada frase
 *   layout  gera public/<id>/layout.json (tempos de cena, falas, acentos da trilha)
 *   list    lista os vídeos e composições
 */
import fs from 'node:fs';
import path from 'node:path';
import {computeLayout, FPS, VoiceLine} from '../src/series/layout';
import {linesOf, spoken} from '../src/series/types';
import {SERIES} from '../src/videos';

const root = path.resolve(__dirname, '..');
const [cmd, which = 'all'] = process.argv.slice(2);
const specs = which === 'all' ? SERIES : SERIES.filter((s) => s.id === which);
if (!specs.length) throw new Error(`Vídeo não encontrado: ${which}`);

for (const spec of specs) {
  if (cmd === 'lines') {
    const lines = spec.beats.flatMap(linesOf).map((text, i) => ({
      file: `${spec.id}/voice/l${String(i + 1).padStart(2, '0')}.wav`,
      text,
      spoken: spoken(text),
    }));
    fs.mkdirSync(path.join(root, 'build'), {recursive: true});
    fs.writeFileSync(path.join(root, 'build', `${spec.id}.lines.json`), JSON.stringify(lines, null, 2));
    console.log(`${spec.id}: ${lines.length} frases`);
  } else if (cmd === 'layout') {
    const vf = path.join(root, 'public', spec.id, 'voice.json');
    const voice: VoiceLine[] = fs.existsSync(vf) ? JSON.parse(fs.readFileSync(vf, 'utf8')) : [];
    const layout = computeLayout(spec, voice);
    // acentos para a trilha: impactos nas transições "flood" e acorde final na assinatura
    const accents: {t: number; kind: string}[] = [];
    layout.beats.forEach((b, i) => {
      if (b.enter === 'flood') accents.push({t: b.from / FPS, kind: 'impact'});
      if (spec.beats[i].scene.type === 'closing') {
        const hasLines = !!spec.beats[i].scene.lines;
        const logo = hasLines ? (b.cues[1] ? b.cues[1].at - 6 : (b.cues[0]?.end ?? 40) + 8) : 8;
        accents.push({t: (b.from + logo) / FPS, kind: 'logo'});
      }
    });
    const out = {
      id: spec.id,
      seconds: layout.total / FPS,
      music: spec.music,
      segments: layout.beats.map((b) => ({start: b.from / FPS, end: (b.from + b.dur) / FPS, mood: b.mood, enter: b.enter})),
      accents,
      layout,
    };
    fs.writeFileSync(path.join(root, 'public', spec.id, 'layout.json'), JSON.stringify(out, null, 2));
    console.log(`${spec.id}: ${(layout.total / FPS).toFixed(1)} s, ${layout.beats.length} cenas`);
  } else if (cmd === 'list') {
    console.log(`${spec.id}\tV${String(spec.num).padStart(2, '0')}-${spec.slug}\t${spec.format}\t${spec.title}`);
  } else {
    throw new Error('Comandos: lines | layout | list');
  }
}
