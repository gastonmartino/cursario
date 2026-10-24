// Composición de la carta "cursario": dónde va cada elemento sobre la hoja.
// La comparten la gráfica vectorial (grafica.ts) y el HTML (Carta.astro), para
// que el texto y las imágenes caigan sobre los recuadros, las aguas y las rosas
// que les corresponden. Medidas en píxeles de la hoja, pensada para escritorio.

export type Rect = [x: number, y: number, ancho: number, alto: number];

export const HOJA = { ancho: 1400, alto: 2400, margen: 44, banda: 12 };

// Recuadros negros escalonados, como los de las cartas náuticas recortadas.
// Cada recuadro es la unión de varios rectángulos.
export const RECUADROS: Rect[][] = [
  [[760, 250, 540, 250], [700, 500, 600, 240], [860, 740, 300, 60]],
  [[150, 930, 560, 300], [150, 1230, 430, 230], [580, 1230, 180, 90]],
  [[90, 1560, 450, 380], [90, 1940, 340, 300]],
  // píxeles sueltos
  [[1180, 1440, 80, 80]], [[1260, 1520, 50, 50]], [[850, 1600, 50, 50]], [[1310, 300, 40, 40]],
];

// Rosas de los vientos: centro y radio.
export const ROSAS: Array<{ x: number; y: number; r: number }> = [
  { x: 400, y: 460, r: 150 },
  { x: 1070, y: 1180, r: 175 },
  { x: 1180, y: 1890, r: 125 },
  { x: 490, y: 2290, r: 45 },
];

// Aguas poco profundas (fuera de los recuadros) e islas (dentro de ellos).
export const AGUAS: Array<{ x: number; y: number; r: number }> = [
  { x: 330, y: 1500, r: 105 },
  { x: 770, y: 1640, r: 85 },
  { x: 170, y: 500, r: 70 },
  { x: 1240, y: 1020, r: 60 },
  { x: 560, y: 820, r: 55 },
];
export const ISLAS: Array<{ x: number; y: number; r: number }> = [
  { x: 1235, y: 400, r: 36 },
  { x: 650, y: 1275, r: 30 },
  { x: 470, y: 2120, r: 48 },
  { x: 1130, y: 330, r: 26 },
];

// Lugares para el contenido del Markdown, en orden de aparición.
// Cada imagen se recorta al alto de su lugar.
export const LUGARES_IMAGEN: Array<{ x: number; y: number; ancho: number; alto: number; modo: 'recuadro' | 'papel' | 'transparencia' }> = [
  { x: 790, y: 270, ancho: 300, alto: 240, modo: 'recuadro' },
  { x: 170, y: 950, ancho: 380, alto: 236, modo: 'recuadro' },
  { x: 110, y: 1580, ancho: 300, alto: 234, modo: 'recuadro' },
  { x: 920, y: 1500, ancho: 330, alto: 180, modo: 'papel' },
  { x: 540, y: 1960, ancho: 340, alto: 300, modo: 'transparencia' },
  { x: 1050, y: 540, ancho: 230, alto: 190, modo: 'recuadro' },
];

export const LUGARES_NOTA: Array<{ x: number; y: number; ancho: number; enRecuadro: boolean }> = [
  { x: 730, y: 560, ancho: 290, enRecuadro: true },
  { x: 170, y: 1210, ancho: 390, enRecuadro: true },
  { x: 110, y: 2000, ancho: 300, enRecuadro: true },
];

export const LUGARES_TOPONIMO: Array<{ x: number; y: number; ancho: number }> = [
  { x: 90, y: 680, ancho: 230 },
  { x: 430, y: 690, ancho: 240 },
  { x: 800, y: 850, ancho: 230 },
  { x: 1100, y: 860, ancho: 230 },
  { x: 800, y: 1420, ancho: 220 },
  { x: 560, y: 1460, ancho: 220 },
  { x: 600, y: 1790, ancho: 230 },
  { x: 880, y: 1980, ancho: 220 },
];

export const LUGAR_TITULO: Rect = [300, 78, 800, 150];
export const LUGAR_CARTUCHO: Rect = [990, 2060, 330, 250];

// Zonas donde no se dibujan sondeos, para que el texto se lea.
export function zonasDespejadas(): Rect[] {
  return [
    LUGAR_TITULO,
    LUGAR_CARTUCHO,
    ...LUGARES_TOPONIMO.map(({ x, y, ancho }): Rect => [x - 8, y - 8, ancho + 16, 120]),
    ...LUGARES_NOTA.map(({ x, y, ancho }): Rect => [x - 8, y - 8, ancho + 16, 250]),
  ];
}
