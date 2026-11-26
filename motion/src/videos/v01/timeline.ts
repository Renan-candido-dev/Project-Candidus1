// Timeline do vídeo (30 fps). Toda a sincronia com a narração parte daqui.

export const SCENES = {
  hook: {from: 0, dur: 165}, //        0,0s – 5,5s  Gancho
  problem: {from: 165, dur: 165}, //   5,5s – 11,0s Problema
  solution: {from: 330, dur: 150}, //  11,0s – 16,0s Solução
  benefits: {from: 480, dur: 225}, //  16,0s – 23,5s Benefícios
  closing: {from: 705, dur: 270}, //   23,5s – 32,5s Encerramento
};

export const TOTAL_FRAMES = 975;

// Início e duração falada de cada frase (frames), na ordem de public/voice/lines.json.
export const VOICE = [
  {file: 'v01/voice/line1.wav', at: 12, frames: 160},
  {file: 'v01/voice/line2.wav', at: 180, frames: 53},
  {file: 'v01/voice/line3.wav', at: 243, frames: 56},
  {file: 'v01/voice/line4.wav', at: 342, frames: 105},
  {file: 'v01/voice/line5.wav', at: 486, frames: 117},
  {file: 'v01/voice/line6.wav', at: 720, frames: 45},
  {file: 'v01/voice/line7.wav', at: 777, frames: 57},
];

// Legendas (frames absolutos), alinhadas às pausas medidas nos áudios.
export const CAPTIONS = [
  {from: 12, to: 31, text: 'Você vende,'},
  {from: 35, to: 71, text: 'trabalha o mês inteiro e,'},
  {from: 77, to: 116, text: 'quando vai olhar o caixa,'},
  {from: 116, to: 171, text: 'não sabe para onde o dinheiro foi?'},
  {from: 180, to: 233, text: 'O problema pode não ser vender pouco.'},
  {from: 243, to: 299, text: 'Pode ser não ter controle financeiro.'},
  {from: 342, to: 398, text: 'A Candidus organiza suas contas,'},
  {from: 398, to: 447, text: 'acompanha seu fluxo de caixa'},
  {from: 486, to: 545, text: 'e transforma números em informações'},
  {from: 545, to: 602, text: 'para você tomar decisões melhores.'},
];
