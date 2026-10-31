/**
 * ÍNSULAS
 * Contenido de las tarjetas de los cursos de primer nivel: lo que se muestra
 * en cada ínsula del lienzo principal. La estructura (su carpeta, posición,
 * tamaño y subcursos) se define en src/motor/Derivas.ts, y cada ínsula se
 * vincula con su curso por el id.
 */
export interface InsulaDefinition {
  id: string;
  code: string;
  // Nombre corto del curso, para el HUD y el menú.
  name: string;
  headerTypeLabel: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  tag: string;
  accentColor: string;
  categoryLabel?: string | null;
  imageMaxHeight?: number;
  imageBackgroundColor?: string | null;

  // imageUrl y markdownFile se escriben solo con el nombre del archivo, que
  // se busca en la carpeta del curso (ver Derivas.ts):
  //   imageUrl     → /{curso}/imagenes/
  //   markdownFile → /{curso}/contenidos/
  // Una ruta que empieza con "/" se toma tal cual (archivo de otra carpeta).
  imageUrl?: string | null;
  markdownFile?: string | null;

  // Imágenes del curso fuera del lienzo, con la misma regla de rutas que
  // imageUrl (/{curso}/imagenes/):
  //   coverImageUrl     → la portada, la imagen grande que lo representa;
  //   thumbnailImageUrl → la miniatura, para las grillas (como la del
  //                       Derrotero). Conviene una imagen liviana y cuadrada.
  coverImageUrl?: string | null;
  thumbnailImageUrl?: string | null;

  // Destacado (true) o no (false, o sin definir).
  featured?: boolean;
}

export const INSULAS: InsulaDefinition[] = [
  {
    id: 'en-curso',
    code: 'CURSO:00',
    name: 'En Curso...',
    headerTypeLabel: '// BITÁCORA',
    title: 'En Curso...',
    subtitle: 'Bitácora y exploraciones vivas',
    tag: 'TFIC / MAE',
    accentColor: '#E03E2D',
    imageUrl: 'curso00-inicio.jpg',
    markdownFile: 'curso00-inicio.md',
    categoryLabel: 'BITÁCORA / TFIC / MAE',
    imageMaxHeight: 380,
  },
  {
    id: 'untref',
    code: 'CURSO:01',
    name: 'Artes Electrónicas',
    headerTypeLabel: '// ARTES ELECTRÓNICAS',
    title: 'Nubes infames, granjas turbias y una hominización especulativa',
    subtitle: 'Producción - 2025-2026',
    tag: 'TECNOPOÉTICAS',
    accentColor: '#0038A8',
    imageUrl: 'curso01-inicio.jpg',
    imageBackgroundColor: '#ffffff',
    markdownFile: 'curso01-inicio.md',
    categoryLabel: 'EJES: TIEMPO / ESPACIO / MOVIMIENTO',
    imageMaxHeight: 440,
  },
  {
    id: 'generativa',
    code: 'CURSO:02',
    name: 'Gráfica Generativa',
    headerTypeLabel: '// GENERATIVA',
    title: 'Gráfica generativa en p5js',
    subtitle: 'Las abstracciones digitales también pueden producir fricción.',
    description: 'El código construye formas que escapan a la representación literal, pero que pueden cargar tensiones, conflictos y sentidos. Imágenes que, en apariencia, no dicen nada y, sin embargo, están diciendo algo. Imágenes que no ilustran consignas, sino que las infiltran.',
    tag: 'ALGORITMOS & TRAMAS',
    accentColor: '#16253D',
    imageUrl: 'portada-generativa.gif',
    categoryLabel: 'PROCESSING / P5.JS',
    imageMaxHeight: 440,
  },
  {
    id: 'pensamiento',
    code: 'CURSO:03',
    name: 'Pensamiento & Diseño',
    headerTypeLabel: '// DISEÑO',
    title: 'Pensamiento & Diseño',
    subtitle: 'El giro UX. Al encuentro de otro diseño',
    tag: 'INTERFACES & INTERACCIONES INTELIGENTES',
    accentColor: '#002FA7',
    imageUrl: 'curso03-inicio.jpg',
    markdownFile: 'curso03-inicio.md',
    categoryLabel: 'REFLEXIÓN / ENSAYO',
    imageMaxHeight: 440,
  },
];

