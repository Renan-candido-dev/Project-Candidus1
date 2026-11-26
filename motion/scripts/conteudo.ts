/**
 * Gera a documentação de conteúdo a partir das specs (fonte única da verdade):
 *   ../conteudo/videos/VNN-*.md     fichas dos vídeos de motion e demonstração (storyboard com tempos reais)
 *   ../conteudo/fundador/VNN-*.md   roteiro e direção dos vídeos do fundador
 *   ../conteudo/fundador/VNN-*.srt  legendas estimadas (ajustar depois da gravação)
 *   ../conteudo/calendario.md       calendário de 12 semanas
 * Uso: npx tsx scripts/conteudo.ts
 */
import fs from 'node:fs';
import path from 'node:path';
import {FOUNDER, FounderVideo} from '../src/founder/data';
import {chunk, FPS} from '../src/series/layout';
import {linesOf, SceneSpec, VideoSpec} from '../src/series/types';
import {SERIES} from '../src/videos';
import {INSERTS} from '../src/videos/inserts';

const ROOT = path.resolve(__dirname, '..');
const OUT = path.resolve(ROOT, '..', 'conteudo');
fs.mkdirSync(path.join(OUT, 'videos'), {recursive: true});
fs.mkdirSync(path.join(OUT, 'fundador'), {recursive: true});

const pad = (n: number) => String(n).padStart(2, '0');
const ts = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const clean = (t: string) => t.replace(/[*_]/g, '');
const MONTH = {1: 'Mês 1 · Reconhecimento dos problemas', 2: 'Mês 2 · Educação e autoridade', 3: 'Mês 3 · Confiança e conversão'};
const FORMAT = {motion: 'Motion design', demo: 'Demonstração prática', insert: 'Inserto', founder: 'Fundador para a câmera'};

// ---------------------------------------------------------------- descrição das cenas
const TRANS: Record<string, string> = {
  cut: 'corte seco',
  whipUp: 'chicote vertical com desfoque de movimento',
  whipLeft: 'chicote lateral com desfoque',
  zoom: 'zoom através (a cena anterior cresce e desfoca, a nova chega de trás)',
  blur: 'dissolução com desfoque',
  flood: 'círculo que se expande do centro e “inunda” a tela',
};

const onScreen = (sc: SceneSpec): string[] => {
  const out: string[] = [];
  const add = (v: unknown) => {
    if (Array.isArray(v)) out.push(...(v as string[]).map(clean));
  };
  if (sc.kicker) out.push(String(sc.kicker));
  if ((sc as {big?: {value: number; money?: boolean; label?: string}}).big) {
    const b = (sc as {big: {value: number; money?: boolean; label?: string}}).big;
    out.push(`${b.label ? b.label + ': ' : ''}${b.money ? 'R$ ' + b.value.toLocaleString('pt-BR') : b.value}`);
  }
  add(sc.lines);
  add(sc.headline);
  if (sc.sub) out.push(String(sc.sub));
  if (sc.footer) out.push(String(sc.footer));
  if ((sc as {verdict?: {text: string}}).verdict) out.push((sc as {verdict: {text: string}}).verdict.text);
  if (sc.cta) out.push(`CTA: ${sc.cta}`);
  const steps = (sc as {steps?: {type: string; text?: string}[]}).steps;
  steps?.filter((s) => s.type === 'badge').forEach((s) => out.push(String(s.text)));
  return out;
};

const describe = (sc: SceneSpec): string => {
  const p = sc as Record<string, unknown> & {type: string};
  switch (p.type) {
    case 'title':
      return `Tipografia cinética: palavras sobem de máscaras, palavra-chave em serifada itálica dourada${p.icon ? `; ícone "${p.icon}" desenhado a traço` : ''}${p.big ? '; número grande contando até o valor' : ''}; anéis dourados se expandem; leve empurrão de câmera.`;
    case 'notif':
      return 'Rajada de notificações financeiras (vendas, Pix, boletos) chegando dos lados, cada vez mais rápido, em volta de um ícone central; câmera treme levemente.';
    case 'stream':
      return 'Faixas de entradas (dourado) e saídas (coral) cruzando a tela em velocidades diferentes, com profundidade; alertas pulando; câmera instável.' + (p.panel ? ' Painel de saldo despencando com gráfico descendente.' : '');
    case 'ledger':
      return `Tabela "${p.title}": lançamentos ${p.mode === 'sort' ? 'chegam espalhados, girando, e se encaixam em ordem' : 'entram em cascata'}${p.tagCue !== undefined ? '; categorias coloridas aparecem' : ''}${p.flags ? '; linhas problemáticas ganham destaque e selo' : ''}${p.checkCue !== undefined ? '; checks de conferência' : ''}${p.total ? '; total recalculado' : ''}.`;
    case 'chart':
      return `Gráfico "${p.title}": barras crescem com mola, linhas são desenhadas${p.threshold ? '; linha de referência tracejada' : ''}${p.highlight ? '; ponto destacado com selo' : ''}.`;
    case 'waterfall':
      return `Cascata "${p.title}": cada degrau entra junto com a fala, mostrando o que sobra no final.`;
    case 'steps':
      return p.layout === 'cycle'
        ? 'Ciclo: etapas surgem em volta do símbolo da Candidus, um arco dourado percorre o círculo e a etapa falada fica em destaque.'
        : 'Cards de etapas entram alternando os lados, com ícones desenhados a traço.';
    case 'balance':
      return 'Cartão de saldo: o número começa grande e vai sendo consumido por cada compromisso que entra na lista (valores riscados); veredito final em selo.';
    case 'calendar':
      return `Calendário do mês com pagamentos (coral) e recebimentos (verde) surgindo nas datas; abaixo, a linha de saldo dia a dia${p.fix ? '; depois, as datas renegociadas mudam de lugar e a nova linha (verde) fica toda positiva' : ' com o primeiro dia negativo marcado'}.`;
    case 'report':
      return `Painel "${p.title}" montado em seções (indicadores, categorias, contas em aberto, projeção) que entram junto com a fala.`;
    case 'split':
      return 'Comparação lado a lado: dois cards entram de baixo com leve rotação, itens em cascata e selo central; rodapé com a conclusão.';
    case 'reconcile':
      return 'Registros internos × extrato bancário: linhas conferidas são ligadas por curvas verdes; a divergência ganha linha tracejada coral e selo com a diferença.';
    case 'sheet':
      return `Planilha "${p.file}" ao vivo: cursor clica, colunas são preenchidas, linhas destacadas/filtradas e fórmulas digitadas na barra de fórmulas, com o resultado piscando em dourado.`;
    case 'breakeven':
      return 'Gráfico de ponto de equilíbrio: linha de despesas fixas, custo total e receita sendo desenhados; áreas de prejuízo/lucro e o ponto de cruzamento destacado.';
    case 'closing':
      return 'Encerramento: frase final cinética sobre verde; assinatura da Candidus se monta (barras crescem, seta desenhada, "Candidus" sobe letra a letra) com anéis dourados; CTA entra com mola' + (p.ctaStyle === 'button' ? ' e o cursor clica no botão.' : '.');
    default:
      return '';
  }
};

const SCENE_NAME: Record<string, string> = {
  title: 'Título cinético',
  notif: 'Notificações',
  stream: 'Movimento caótico',
  ledger: 'Tabela de lançamentos',
  chart: 'Gráfico',
  waterfall: 'Cascata',
  steps: 'Etapas',
  balance: 'Saldo × compromissos',
  calendar: 'Calendário',
  report: 'Painel gerencial',
  split: 'Comparação',
  reconcile: 'Conciliação',
  sheet: 'Planilha ao vivo',
  breakeven: 'Ponto de equilíbrio',
  closing: 'Encerramento + CTA',
};

const SFX: Record<string, string> = {
  whipUp: 'whoosh',
  whipLeft: 'swish',
  zoom: 'whoosh descendente',
  blur: 'swish suave',
  flood: 'impacto grave',
};

// ---------------------------------------------------------------- fichas motion/demo
type LayoutJson = {seconds: number; layout: {beats: {from: number; dur: number; cues: {at: number; end: number; text: string}[]; enter: string; mood: string}[]}};

const fileName = (v: {num: number; slug: string}) => `candidus-v${pad(v.num)}-${v.slug}.mp4`;

const ficha = (spec: VideoSpec) => {
  const lj: LayoutJson | null = fs.existsSync(path.join(ROOT, 'public', spec.id, 'layout.json'))
    ? JSON.parse(fs.readFileSync(path.join(ROOT, 'public', spec.id, 'layout.json'), 'utf8'))
    : null;
  const narr = spec.beats.flatMap(linesOf).join(' ');
  const rows = spec.beats
    .map((b, i) => {
      const l = lj?.layout.beats[i];
      const t0 = l ? l.from / FPS : 0;
      const t1 = l ? (l.from + l.dur) / FPS : 0;
      const said = linesOf(b).join(' ') || '(sem fala)';
      return `| ${ts(t0)}–${ts(t1)} | **${i + 1}. ${SCENE_NAME[b.scene.type] ?? b.scene.type}**${i ? `<br>entra: ${TRANS[b.enter ?? 'whipUp']}` : ''} | ${describe(b.scene)} | ${onScreen(b.scene).join('<br>') || '—'} | ${said} |`;
    })
    .join('\n');
  const moods = lj ? [...new Set(lj.layout.beats.map((b) => b.mood))].join(' → ') : '';
  const sfx = [...new Set(spec.beats.slice(1).map((b) => SFX[b.enter ?? 'whipUp']).filter(Boolean))].join(', ');
  return `# V${pad(spec.num)} · ${spec.title}

| | |
|---|---|
| **Título interno** | V${pad(spec.num)}-${spec.slug} |
| **Formato** | ${FORMAT[spec.format]} |
| **Semana / mês** | Semana ${spec.week} · ${MONTH[spec.month]} |
| **Duração** | ${lj ? lj.seconds.toFixed(1).replace('.', ',') + ' s' : 'gerar com build-video.sh'} |
| **Objetivo de marketing** | ${spec.meta.objetivo} |
| **Público-alvo** | ${spec.meta.publico} |
| **Gancho (0–2 s)** | ${spec.meta.gancho} |
| **CTA** | ${spec.meta.cta} |
| **Arquivo final** | \`motion/out/final/${fileName(spec)}\` |
| **Composição Remotion** | \`V${pad(spec.num)}-${spec.slug}\` |

## Narração completa

> ${narr}

## Storyboard (tempos reais da renderização)

| Tempo | Cena / transição | Animação | Texto na tela | Narração |
|---|---|---|---|---|
${rows}

## Áudio

- **Voz:** narração pt-BR, frase a frase, sincronizada com as cenas (Piper TTS \`pt_BR-faber-medium\`; troque por locução profissional se desejar, ver README do projeto).
- **Trilha:** original, ${spec.music.bpm} bpm, clima ${moods}; abaixa automaticamente sob a voz (ducking).
- **Efeitos:** ${sfx || '—'}; cliques, pops e pings nas interações; acorde final com sinos na assinatura.
- **Mixagem final:** −14 LUFS (padrão Reels/TikTok/Shorts).

## Legenda para o Instagram

${spec.meta.legenda}

${spec.meta.hashtags.join(' ')}

**Texto da capa:** ${spec.meta.capa}
`;
};

// ---------------------------------------------------------------- fundador
const WPS = 2.5; // ritmo natural de fala (palavras por segundo)

const founderTiming = (v: FounderVideo) => {
  let t = 0.3;
  const cues: {from: number; to: number; text: string}[] = [];
  v.roteiro.forEach((para) => {
    const parts = para.split(/(\[pausa\]|\[corte\])/);
    parts.forEach((p) => {
      if (p === '[pausa]') return void (t += 0.6);
      if (p === '[corte]') return void (t += 0.15);
      const text = clean(p).trim();
      if (!text) return;
      chunk(text).forEach((c) => {
        const d = Math.max(0.7, c.split(/\s+/).length / WPS);
        cues.push({from: t, to: t + d, text: c});
        t += d + 0.05;
      });
    });
    t += 0.2;
  });
  return {cues, total: t + 0.5};
};

const srtTime = (s: number) => {
  const ms = Math.round(s * 1000);
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  return `${pad(h)}:${pad(m)}:${pad(sec)},${String(ms % 1000).padStart(3, '0')}`;
};

const founderDoc = (v: FounderVideo) => {
  const {cues, total} = founderTiming(v);
  const srt = cues.map((c, i) => `${i + 1}\n${srtTime(c.from)} --> ${srtTime(c.to)}\n${c.text}\n`).join('\n');
  fs.writeFileSync(path.join(OUT, 'fundador', `V${pad(v.num)}-${v.slug}.srt`), srt);
  const fmt = (p: string) =>
    p
      .replace(/\[pausa\]/g, ' ⏸ ')
      .replace(/\[corte\]/g, '✂️ ')
      .replace(/\s+/g, ' ')
      .trim();
  return `# V${pad(v.num)} · ${v.title}

> **Formato:** fundador falando para a câmera · **Semana ${v.week}** · ${MONTH[v.month]}
> Este vídeo depende de gravação real. Abaixo estão o roteiro e a direção; nenhuma pessoa artificial foi gerada.

| | |
|---|---|
| **Objetivo** | ${v.objetivo} |
| **Público** | ${v.publico} |
| **Gancho (0–2 s)** | ${v.gancho} |
| **Duração estimada** | ${Math.round(total)} s (ritmo natural, ~150 palavras/min) |
| **Texto da capa** | ${v.capa} |
| **CTA** | ${v.cta} |
| **Arquivo final sugerido** | \`${fileName(v)}\` |
${v.inserto ? `| **Inserto animado** | \`motion/out/inserts/${v.inserto.toLowerCase()}.mp4\` (composição \`${v.inserto}\`) |\n` : ''}
## Roteiro falado

Legenda: **negrito** = ênfase · ⏸ = pausa curta · ✂️ = sugestão de corte seco.

${v.roteiro.map((p, i) => `${i + 1}. ${fmt(p)}`).join('\n')}

## Direção de gravação

- **Enquadramento:** ${v.enquadramento}
- **Iluminação:** ${v.iluminacao}
- **Cenário:** ${v.cenario}
- **Áudio:** microfone de lapela (com fio ou sem fio) ou gravar em ambiente pequeno e sem eco; fale um pouco mais devagar do que no dia a dia.
- **Takes:** grave cada parágrafo do roteiro separado (2–3 takes). Facilita os cortes e reduz a pressão de decorar.

## Cortes e inserções visuais

${v.cortes.map((c) => `- ${c}`).join('\n')}
- Encerrar com a assinatura da Candidus (2–3 s), usando o final de qualquer vídeo de motion da série ou o logo oficial.

## Legendas sincronizadas

O arquivo \`V${pad(v.num)}-${v.slug}.srt\` tem as legendas com tempos **estimados** pelo ritmo de fala. Depois de gravar, importe no editor e ajuste os tempos (ou use a legenda automática do CapCut/Instagram e corrija o texto com base no roteiro).

## Legenda da publicação

${v.legenda}

${v.hashtags.join(' ')}
`;
};

// ---------------------------------------------------------------- calendário
type Entry = {num: number; week: number; month: 1 | 2 | 3; title: string; format: string; objetivo: string; cta: string; material: string; legenda: string; arquivo: string; ficha: string};

const V01: Entry = {
  num: 1,
  week: 1,
  month: 1,
  title: 'Sua empresa vende, mas o dinheiro desaparece?',
  format: FORMAT.motion,
  objetivo: 'Despertar a atenção: o empresário vende, mas não acompanha entradas e saídas.',
  cta: 'Você sabe para onde vai o dinheiro da sua empresa?',
  material: 'Pronto: MP4 renderizado.',
  legenda:
    'Você vende, trabalha o mês inteiro e, quando vai olhar o caixa, não sabe para onde o dinheiro foi?\n\nO problema pode não ser vender pouco. Pode ser não acompanhar as entradas e saídas. Vender é só metade da história; a outra metade é saber para onde o dinheiro vai.\n\nVocê sabe para onde vai o dinheiro da sua empresa? 👇',
  arquivo: 'candidus-v01-sua-empresa-vende.mp4',
  ficha: 'videos/V01-sua-empresa-vende.md',
};

const entries: Entry[] = [
  V01,
  ...SERIES.map((s) => ({
    num: s.num,
    week: s.week,
    month: s.month,
    title: s.title,
    format: FORMAT[s.format],
    objetivo: s.meta.objetivo,
    cta: s.meta.cta,
    material: s.format === 'demo' ? `Pronto: MP4 renderizado + planilha \`planilhas/v${pad(s.num)}-*.xlsx\`.` : 'Pronto: MP4 renderizado.',
    legenda: `${s.meta.legenda}\n\n${s.meta.hashtags.join(' ')}`,
    arquivo: fileName(s),
    ficha: `videos/V${pad(s.num)}-${s.slug}.md`,
  })),
  ...FOUNDER.map((f) => ({
    num: f.num,
    week: f.week,
    month: f.month,
    title: f.title,
    format: FORMAT.founder,
    objetivo: f.objetivo,
    cta: f.cta,
    material: `Gravação do fundador (celular, tripé, lapela). Roteiro, legendas .srt e inserto animado prontos.`,
    legenda: `${f.legenda}\n\n${f.hashtags.join(' ')}`,
    arquivo: fileName(f),
    ficha: `fundador/V${pad(f.num)}-${f.slug}.md`,
  })),
].sort((a, b) => a.num - b.num);

const calendar = `# Calendário editorial · 12 semanas (24 publicações)

Duas publicações por semana. Os dias e horários devem ser definidos e ajustados pelos dados reais da conta (alcance, retenção, salvamentos, comentários); nenhum dia ou horário garante alcance.

| Sem. | Nº | Tema | Formato | CTA | Status |
|---|---|---|---|---|---|
${entries
  .map((e) => `| ${e.week} | ${pad(e.num)} | [${e.title}](${e.ficha}) | ${e.format} | ${e.cta} | ${e.format === FORMAT.founder ? 'Roteiro pronto · gravar' : 'MP4 pronto'} |`)
  .join('\n')}

**Formatos:** ${entries.filter((e) => e.format === FORMAT.motion).length} motion design · ${entries.filter((e) => e.format === FORMAT.founder).length} fundador · ${entries.filter((e) => e.format === FORMAT.demo).length} demonstrações práticas (distribuição do calendário detalhado do briefing).

${[1, 2, 3]
  .map(
    (m) => `## ${MONTH[m as 1 | 2 | 3]}

${entries
  .filter((e) => e.month === m)
  .map(
    (e) => `### Semana ${e.week} · Vídeo ${pad(e.num)}: ${e.title}

- **Formato:** ${e.format}
- **Objetivo:** ${e.objetivo}
- **CTA:** ${e.cta}
- **Material necessário:** ${e.material}
- **Arquivo:** \`${e.arquivo}\` · [ficha completa](${e.ficha})

**Legenda final:**

${e.legenda
  .split('\n')
  .map((l) => `> ${l}`)
  .join('\n')}
`,
  )
  .join('\n')}`,
  )
  .join('\n')}
`;

// ---------------------------------------------------------------- V01 (feito à mão)
const v01Doc = `# V01 · Sua empresa vende, mas o dinheiro desaparece?

| | |
|---|---|
| **Título interno** | V01-sua-empresa-vende |
| **Formato** | Motion design (peça de abertura, feita à mão em \`src/videos/v01\`) |
| **Semana / mês** | Semana 1 · ${MONTH[1]} |
| **Duração** | 32,5 s |
| **Objetivo de marketing** | ${V01.objetivo} |
| **Público-alvo** | Pequenos empresários que vendem bem, mas não acompanham entradas e saídas. |
| **Gancho (0–2 s)** | “Sua empresa vende.” sobre um empresário cercado de notificações de vendas, Pix e boletos. |
| **CTA** | ${V01.cta} |
| **Arquivo final** | \`${V01.arquivo}\` |
| **Composição Remotion** | \`V01-sua-empresa-vende\` |

## Narração completa

> Você vende, trabalha o mês inteiro e, quando vai olhar o caixa, não sabe para onde o dinheiro foi? O problema pode não ser vender pouco. Pode ser não ter controle financeiro. A Candidus organiza suas contas, acompanha seu fluxo de caixa e transforma números em informações para você tomar decisões melhores. Você cuida do seu negócio. Nós ajudamos a cuidar dos números.

## Storyboard

| Tempo | Cena | Animação | Texto na tela |
|---|---|---|---|
| 0:00–5:30 | Gancho | Empresário em silhueta; 10 notificações chegando cada vez mais rápido; círculo verde engole a tela; saldo de R$ 48.720 despenca e se desfaz em moedas. | Sua empresa vende. / Mas o dinheiro desaparece? |
| 0:05–0:11 | Problema | Faixas de entradas e saídas, saldo do mês negativo, alertas; luzes se apagam e uma lanterna revela o texto. | Sem controle financeiro, você trabalha no escuro. |
| 0:11–0:16 | Solução | A luz acende; lançamentos se encaixam num painel, ganham categoria; cursor clica em “Conciliar” → “Tudo em dia ✓”. | A Candidus organiza seu financeiro. |
| 0:16–0:23 | Benefícios | Fluxo de caixa, contas a pagar e receber, meta e indicadores; resumo com três checks. | Mais controle. Mais clareza. Decisões melhores. |
| 0:23–0:32 | Encerramento | Frase sobre dígitos rolando; assinatura da Candidus se monta; CTA em forma de pergunta. | Você cuida do negócio. Nós cuidamos dos números. / ${V01.cta} |

## Áudio

Narração pt-BR (Piper TTS), trilha original em quatro climas (tensão → escuro → claro → final), 13 efeitos sincronizados; −14 LUFS.

## Legenda para o Instagram

${V01.legenda}

#gestaofinanceira #fluxodecaixa #pequenasempresas #empreendedorismo #candidus

**Texto da capa:** Sua empresa vende. Mas para onde vai o dinheiro?
`;

// ---------------------------------------------------------------- escreve tudo
fs.writeFileSync(path.join(OUT, 'videos', 'V01-sua-empresa-vende.md'), v01Doc);
for (const s of SERIES) fs.writeFileSync(path.join(OUT, 'videos', `V${pad(s.num)}-${s.slug}.md`), ficha(s));
for (const f of FOUNDER) fs.writeFileSync(path.join(OUT, 'fundador', `V${pad(f.num)}-${f.slug}.md`), founderDoc(f));
fs.writeFileSync(path.join(OUT, 'calendario.md'), calendar);
console.log(`ok: ${SERIES.length} fichas, ${FOUNDER.length} roteiros do fundador, ${INSERTS.length} insertos, calendário com ${entries.length} vídeos`);
