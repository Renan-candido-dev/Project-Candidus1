import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {C, SANS} from '../theme';

/** Efeito sonoro posicionado no frame local `at`. */
export const Sfx: React.FC<{name: string; at: number; volume?: number}> = ({name, at, volume = 0.5}) => (
  <Sequence from={Math.round(at)} durationInFrames={90} layout="none">
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />
  </Sequence>
);

export type Tone = 'in' | 'out' | 'alert';

/** Ícone redondo de transação: entrada, saída ou alerta. */
export const TxIcon: React.FC<{tone: Tone; size?: number}> = ({tone, size = 64}) => {
  const bg = tone === 'in' ? C.green : tone === 'alert' ? C.coral : C.ivoryDeep;
  const fg = tone === 'out' ? C.green : '#fff';
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.3,
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24">
        {tone === 'in' && <path d="M6 18 L18 6 M9 6 H18 V15" stroke={fg} strokeWidth={2.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
        {tone === 'out' && <path d="M6 6 L18 18 M18 9 V18 H9" stroke={fg} strokeWidth={2.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
        {tone === 'alert' && (
          <>
            <path d="M12 5 V14" stroke={fg} strokeWidth={3} strokeLinecap="round" />
            <circle cx={12} cy={19} r={1.8} fill={fg} />
          </>
        )}
      </svg>
    </div>
  );
};

/** Card de notificação (estilo celular). */
export const Notif: React.FC<{title: string; sub: string; amount: string; tone: Tone; style?: React.CSSProperties}> = ({
  title,
  sub,
  amount,
  tone,
  style,
}) => (
  <div
    style={{
      width: 500,
      display: 'flex',
      alignItems: 'center',
      gap: 18,
      padding: '20px 26px 20px 22px',
      borderRadius: 30,
      background: 'rgba(255,255,255,0.96)',
      boxShadow: '0 18px 40px rgba(10,46,35,0.14), 0 2px 6px rgba(10,46,35,0.06)',
      fontFamily: SANS,
      ...style,
    }}
  >
    <TxIcon tone={tone} />
    <div style={{flex: 1, minWidth: 0}}>
      <div style={{fontSize: 26, fontWeight: 700, color: C.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{title}</div>
      <div style={{fontSize: 21, fontWeight: 500, color: C.muted, marginTop: 2, whiteSpace: 'nowrap'}}>{sub}</div>
    </div>
    <div
      style={{
        fontSize: 24,
        fontWeight: 800,
        marginLeft: 8,
        color: tone === 'in' ? C.greenMid : tone === 'alert' ? C.coral : C.ink,
        whiteSpace: 'nowrap',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {amount}
    </div>
  </div>
);

/** Selo pequeno exigido para deixar claro que os números são de demonstração. */
export const Illustrative: React.FC<{color?: string; style?: React.CSSProperties}> = ({color = C.muted, style}) => (
  <div
    style={{
      fontFamily: SANS,
      fontSize: 20,
      fontWeight: 600,
      letterSpacing: '0.08em',
      color,
      textTransform: 'uppercase',
      ...style,
    }}
  >
    * Dados ilustrativos
  </div>
);

export const Check: React.FC<{size?: number; p?: number; color?: string}> = ({size = 40, p = 1, color = C.green}) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={{transform: `scale(${0.6 + 0.4 * p})`, opacity: p}}>
    <circle cx={20} cy={20} r={19} fill={color} />
    <path
      d="M12 20.5 L17.5 26 L28.5 14.5"
      stroke="#fff"
      strokeWidth={3.6}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray="1 1"
      strokeDashoffset={1 - p}
    />
  </svg>
);
