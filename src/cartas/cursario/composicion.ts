// Composiciones de la carta "cursario": dónde va cada elemento sobre la hoja.
// Las comparten la gráfica vectorial (grafica.ts) y el HTML (Carta.astro), para
// que el texto y las imágenes caigan sobre los recuadros, las aguas y las rosas
// que les corresponden. Medidas en píxeles de la hoja.
//
// Hay una composición por rango de ancho de ventana. El contenido del Markdown
// se escribe una sola vez en el HTML, con su lugar en cada composición, y el
// CSS de Carta.astro elige cuál usar (los cortes están en sus media queries).

export type Rect = [x: number, y: number, ancho: number, alto: number];
export type Circulo = { x: number; y: number; r: number };
export type ModoImagen = 'recuadro' | 'papel' | 'transparencia';

export interface Composicion {
  // marco: el borde graduado con franjas y coordenadas.
  hoja: { ancho: number; alto: number; margen: number; banda: number; marco: boolean };
  // Posición de VOLVER (desde la izquierda) y del menú (desde la derecha): en
  // la hoja o, si son fijos, en la ventana (siempre visibles).
  navegacion: { arriba: number; izquierda: number; derecha: number; fija: boolean };
  // Recuadros negros escalonados; cada uno es la unión de varios rectángulos.
  recuadros: Rect[][];
  rosas: Circulo[];
  // Aguas poco profundas (fuera de los recuadros) e islas (dentro de ellos).
  aguas: Circulo[];
  islas: Circulo[];
  sondeos: number;
  // Lugares para el contenido del Markdown, en orden de aparición. Las
  // imágenes que no tienen lugar no se muestran en esta composición.
  imagenes: Array<{ x: number; y: number; ancho: number; alto: number; modo: ModoImagen } | null>;
  notas: Array<{ x: number; y: number; ancho: number; enRecuadro: boolean }>;
  toponimos: Array<{ x: number; y: number; ancho: number }>;
  titulo: Rect;
  cartucho: Rect;
  // Rótulos sueltos, como "PROFUNDIDADES EN METROS".
  rotulos: Array<{ arriba: number; izquierda?: number; derecha?: number }>;
}

// Ventanas de 1280 px o más: la hoja con marco, sobre un fondo más oscuro.
const XL: Composicion = {
  hoja: { ancho: 1400, alto: 2400, margen: 44, banda: 8, marco: true },
  navegacion: { arriba: 66, izquierda: 74, derecha: 76, fija: false },
  recuadros: [
    [[760, 250, 540, 250], [700, 500, 600, 240], [860, 740, 300, 60]],
    [[150, 930, 560, 300], [150, 1230, 430, 230], [580, 1230, 180, 90]],
    [[90, 1560, 450, 380], [90, 1940, 340, 300]],
    // píxeles sueltos
    [[1180, 1440, 80, 80]], [[1260, 1520, 50, 50]], [[850, 1600, 50, 50]], [[1310, 300, 40, 40]],
  ],
  rosas: [
    { x: 400, y: 460, r: 150 },
    { x: 1070, y: 1180, r: 175 },
    { x: 1180, y: 1890, r: 125 },
    { x: 490, y: 2290, r: 45 },
  ],
  aguas: [
    { x: 330, y: 1500, r: 105 },
    { x: 770, y: 1640, r: 85 },
    { x: 170, y: 500, r: 70 },
    { x: 1240, y: 1020, r: 60 },
    { x: 560, y: 820, r: 55 },
  ],
  islas: [
    { x: 1235, y: 400, r: 36 },
    { x: 650, y: 1275, r: 30 },
    { x: 470, y: 2120, r: 48 },
    { x: 1130, y: 330, r: 26 },
  ],
  sondeos: 1500,
  // Cada imagen se recorta al alto de su lugar.
  imagenes: [
    { x: 790, y: 270, ancho: 300, alto: 240, modo: 'recuadro' },
    { x: 170, y: 950, ancho: 380, alto: 236, modo: 'recuadro' },
    { x: 110, y: 1580, ancho: 300, alto: 234, modo: 'recuadro' },
    { x: 920, y: 1500, ancho: 330, alto: 180, modo: 'papel' },
    { x: 540, y: 1960, ancho: 340, alto: 300, modo: 'transparencia' },
    { x: 1050, y: 540, ancho: 230, alto: 190, modo: 'recuadro' },
  ],
  notas: [
    { x: 730, y: 560, ancho: 290, enRecuadro: true },
    { x: 170, y: 1210, ancho: 390, enRecuadro: true },
    { x: 110, y: 2000, ancho: 300, enRecuadro: true },
  ],
  toponimos: [
    { x: 90, y: 680, ancho: 230 },
    { x: 430, y: 690, ancho: 240 },
    { x: 800, y: 850, ancho: 230 },
    { x: 1100, y: 860, ancho: 230 },
    { x: 800, y: 1420, ancho: 220 },
    { x: 560, y: 1460, ancho: 220 },
    { x: 600, y: 1790, ancho: 230 },
    { x: 880, y: 1980, ancho: 220 },
  ],
  titulo: [300, 78, 800, 150],
  cartucho: [990, 2060, 330, 250],
  rotulos: [{ derecha: 70, arriba: 230 }, { izquierda: 70, arriba: 2304 }],
};

// Ventanas de 930 a 1279 px: el papel es el fondo de la página, sin marco. La
// gráfica ocupa 1280 px y se recorta a los costados; textos y láminas quedan en
// la columna central, de x = 180 a x = 1100 (920 px), que entra completa desde
// los 930 px de ancho. VOLVER y el menú quedan fijos en la ventana.
const LG: Composicion = {
  hoja: { ancho: 1280, alto: 2360, margen: 0, banda: 0, marco: false },
  navegacion: { arriba: 24, izquierda: 20, derecha: 20, fija: true },
  recuadros: [
    [[640, 240, 460, 260], [600, 500, 500, 280]],
    [[180, 830, 460, 280], [180, 1110, 380, 210]],
    [[680, 1660, 360, 170], [820, 1830, 220, 90]],
    // píxeles sueltos
    [[1120, 260, 40, 40]], [[1130, 1500, 50, 50]], [[560, 1600, 36, 36]], [[110, 1210, 44, 44]],
  ],
  rosas: [
    { x: 370, y: 450, r: 130 },
    { x: 880, y: 1060, r: 150 },
    { x: 380, y: 1790, r: 110 },
    { x: 330, y: 2240, r: 50 },
  ],
  aguas: [
    { x: 90, y: 700, r: 70 },
    { x: 1200, y: 1000, r: 70 },
    { x: 110, y: 1520, r: 80 },
    { x: 1190, y: 2120, r: 65 },
    { x: 610, y: 2250, r: 55 },
  ],
  islas: [
    { x: 1030, y: 340, r: 30 },
    { x: 1030, y: 660, r: 24 },
    { x: 930, y: 1745, r: 30 },
  ],
  sondeos: 1200,
  // Quedan tres de las seis láminas: el velero, los juncos y el relieve ocre.
  imagenes: [
    { x: 660, y: 260, ancho: 290, alto: 230, modo: 'recuadro' },
    { x: 200, y: 850, ancho: 330, alto: 205, modo: 'recuadro' },
    null,
    { x: 200, y: 1360, ancho: 300, alto: 163, modo: 'papel' },
    null,
    null,
  ],
  notas: [
    { x: 620, y: 590, ancho: 310, enRecuadro: true },
    { x: 200, y: 1095, ancho: 340, enRecuadro: true },
    { x: 700, y: 1680, ancho: 300, enRecuadro: true },
  ],
  toponimos: [
    { x: 200, y: 650, ancho: 190 },
    { x: 410, y: 660, ancho: 180 },
    { x: 640, y: 1290, ancho: 210 },
    { x: 880, y: 1300, ancho: 210 },
    { x: 660, y: 1450, ancho: 210 },
    { x: 890, y: 1470, ancho: 200 },
    { x: 200, y: 1990, ancho: 220 },
    { x: 450, y: 2010, ancho: 220 },
  ],
  titulo: [340, 60, 600, 140],
  cartucho: [770, 2010, 330, 250],
  rotulos: [{ derecha: 180, arriba: 196 }, { izquierda: 200, arriba: 2300 }],
};

// Los nombres siguen la escala de tamaños de Bootstrap y Tailwind (xl, lg, md,
// sm, xs), pero los cortes son los de esta carta.
export const COMPOSICIONES = { xl: XL, lg: LG };
export type NombreComposicion = keyof typeof COMPOSICIONES;

// Zonas donde no se dibujan sondeos, para que el texto se lea.
export function zonasDespejadas(composicion: Composicion): Rect[] {
  return [
    composicion.titulo,
    composicion.cartucho,
    ...composicion.toponimos.map(({ x, y, ancho }): Rect => [x - 8, y - 8, ancho + 16, 120]),
    ...composicion.notas.map(({ x, y, ancho }): Rect => [x - 8, y - 8, ancho + 16, 250]),
  ];
}
