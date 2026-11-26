import React from 'react';

// Ícones de traço (24×24), desenhados com animação de "caneta".
const PATHS: Record<string, string[]> = {
  calendar: ['M4 6 H20 V20 H4 Z', 'M4 10 H20', 'M8 3 V7', 'M16 3 V7', 'M8 14 H10', 'M14 14 H16'],
  alert: ['M12 3 L22 20 H2 Z', 'M12 9 V14', 'M12 17 V17.2'],
  chart: ['M4 20 H20', 'M6 16 V12', 'M10 16 V9', 'M14 16 V11', 'M18 16 V6'],
  trend: ['M3 17 L9 11 L13 15 L21 7', 'M15 7 H21 V13'],
  coins: ['M12 6 C 16 6 19 7 19 8.5 C 19 10 16 11 12 11 C 8 11 5 10 5 8.5 C 5 7 8 6 12 6 Z', 'M5 8.5 V15.5 C5 17 8 18 12 18 C16 18 19 17 19 15.5 V8.5', 'M5 12 C5 13.5 8 14.5 12 14.5 C16 14.5 19 13.5 19 12'],
  store: ['M3 9 L5 4 H19 L21 9', 'M3 9 Q5.5 12 8 9 Q10.5 12 13 9 Q15.5 12 18 9 Q20 12 21 9', 'M5 11 V20 H19 V11', 'M10 20 V15 H14 V20'],
  doc: ['M6 3 H14 L19 8 V21 H6 Z', 'M14 3 V8 H19', 'M9 12 H16', 'M9 16 H16'],
  bank: ['M3 9 L12 4 L21 9', 'M5 10 V17', 'M9.5 10 V17', 'M14.5 10 V17', 'M19 10 V17', 'M3 20 H21'],
  card: ['M3 6 H21 V18 H3 Z', 'M3 10 H21', 'M6 14 H10'],
  check: ['M4 12.5 L9.5 18 L20 7'],
  scale: ['M12 4 V20', 'M6 20 H18', 'M5 8 H19', 'M5 8 L2.5 14 H7.5 Z', 'M19 8 L16.5 14 H21.5 Z'],
  clock: ['M12 3 A9 9 0 1 1 11.99 3', 'M12 7 V12 L15.5 14'],
  target: ['M12 3 A9 9 0 1 1 11.99 3', 'M12 7 A5 5 0 1 1 11.99 7', 'M12 11 A1 1 0 1 1 11.99 11'],
  search: ['M10.5 4 A6.5 6.5 0 1 1 10.49 4', 'M15.5 15.5 L21 21'],
  repeat: ['M4 12 A8 8 0 0 1 18 7', 'M18 3 V7 H14', 'M20 12 A8 8 0 0 1 6 17', 'M6 21 V17 H10'],
  user: ['M12 4 A4 4 0 1 1 11.99 4', 'M4 21 C4 16 8 14 12 14 C16 14 20 16 20 21'],
  split: ['M12 3 V21', 'M4 8 H9', 'M15 8 H20', 'M4 14 H9', 'M15 14 H20'],
  layers: ['M12 3 L21 8 L12 13 L3 8 Z', 'M3 12 L12 17 L21 12', 'M3 16 L12 21 L21 16'],
  handshake: ['M3 11 L7 7 L11 9 L14 7 L21 11', 'M7 13 L10 16 C11 17 12 17 13 16 L17 12', 'M3 11 L7 15', 'M21 11 L17 15'],
  receipt: ['M6 3 H18 V21 L15 19 L12 21 L9 19 L6 21 Z', 'M9 8 H15', 'M9 12 H15', 'M9 16 H13'],
  box: ['M3 7 L12 3 L21 7 L12 11 Z', 'M3 7 V17 L12 21 V11', 'M21 7 V17 L12 21'],
  chat: ['M4 5 H20 V16 H10 L5 20 V16 H4 Z', 'M8 10 H16'],
};

export type IconName = keyof typeof PATHS;

export const Icon: React.FC<{name: string; size?: number; p?: number; color?: string; width?: number}> = ({
  name,
  size = 96,
  p = 1,
  color = '#D6B05A',
  width = 1.8,
}) => {
  const paths = PATHS[name] ?? PATHS.chart;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{overflow: 'visible'}}>
      {paths.map((d, i) => {
        const local = Math.min(1, Math.max(0, p * (1 + paths.length * 0.25) - i * 0.25));
        return (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={color}
            strokeWidth={width}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - local}
          />
        );
      })}
    </svg>
  );
};
