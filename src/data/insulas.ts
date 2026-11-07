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
  // Pie de la imagen; sin imagen, no se muestra.
  imageCaption?: string | null;
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

  // Reflotada (true): sus islas, con sus islotes, salen a flote en el lienzo
  // principal junto a la ínsula, y el curso no tiene lienzo propio (no se
  // incursiona). Sus coordenadas, en src/motor/Derivas.ts, pasan a ser
  // relativas a la ínsula: al moverla, se mueve el conjunto. Por defecto, false.
  refloated?: boolean;

  // Sección del Derrotero en la que aparece la ínsula, en representación de
  // todo su curso (obras, bitacora o escritos). Sin definir, no aparece. Es
  // independiente del derroteroSection de sus islas.
  derroteroSection?: 'obras' | 'bitacora' | 'escritos';

  // Página editorial de la ínsula (Markdown en /{curso}/contenidos/), a la que
  // se llega desde el Derrotero, el Aparejo y el lienzo principal: el click,
  // Enter y el botón INCURSIONAR de su tarjeta abren esta página en lugar del
  // lienzo del curso, al que se llega desde la página (VER EL MAPA).
  // Va en /{pageUrl}/ o, sin pageUrl, en /{curso}/. VOLVER lleva al lienzo
  // principal.
  pageMarkdownFile?: string | null;
  pageUrl?: string | null;
}

export const INSULAS: InsulaDefinition[] = [
  {
    id: 'en-curso',
    code: 'DERIVA:00',
    name: 'En Curso...',
    headerTypeLabel: '// BITÁCORA',
    title: 'En Curso...',
    subtitle: 'Bitácora y exploraciones vivas',
    tag: 'TFIC / MAE',
    accentColor: '#E03E2D',
    imageUrl: 'curso00-inicio.jpg',
    markdownFile: 'curso00-inicio.md',
    imageCaption: 'BITÁCORA / TFIC / MAE',
    imageMaxHeight: 380,
  },
  {
    id: 'arte-electronico',
    refloated: true,
    code: 'DERIVA:01',
    name: 'Artes Electrónicas',
    headerTypeLabel: '// ARTES ELECTRÓNICAS',
    title: 'Nubes infames, granjas turbias y una hominización especulativa',
    subtitle: 'Producción - 2025-2026',
    tag: 'TECNOPOÉTICAS',
    accentColor: '#0038A8',
    imageUrl: 'curso01-inicio.jpg',
    imageBackgroundColor: '#ffffff',
    markdownFile: 'curso01-inicio.md',
    coverImageUrl: 'portada-seccion.jpg',
    featured: true,
    imageCaption: 'EJES: TIEMPO / ESPACIO / MOVIMIENTO',
    imageMaxHeight: 440,
  },
  {
    id: 'generativa',
    code: 'DERIVA:02',
    name: 'Gráfica Generativa',
    headerTypeLabel: '// GENERATIVA',
    title: 'Gráfica generativa en p5js',
    subtitle: 'Las abstracciones digitales también pueden producir fricción.',
    description: 'El código construye formas que escapan a la representación literal, pero que pueden cargar tensiones, conflictos y sentidos. Imágenes que, en apariencia, no dicen nada y, sin embargo, están diciendo algo. Imágenes que no ilustran consignas, sino que las infiltran.',
    tag: 'ALGORITMOS & TRAMAS',
    accentColor: '#16253D',
    imageUrl: 'portada-generativa.gif',
    coverImageUrl: 'portada-seccion.webp',
    featured: true,
    imageCaption: 'PROCESSING / P5.JS',
    imageMaxHeight: 440,
  },
  {
    id: 'pensamiento',
    code: 'DERIVA:03',
    name: 'Pensamiento & Diseño',
    headerTypeLabel: '// DISEÑO',
    title: 'Pensamiento & Diseño',
    subtitle: 'El giro UX. Al encuentro de otro diseño',
    tag: 'INTERFACES & INTERACCIONES INTELIGENTES',
    accentColor: '#002FA7',
    imageUrl: 'curso03-inicio.jpg',
    markdownFile: 'curso03-inicio.md',
    imageCaption: 'REFLEXIÓN / ENSAYO',
    imageMaxHeight: 440,
  },
  {
    id: 'expediente-1126',
    code: 'DERIVA:04',
    name: 'Expediente 11/26',
    headerTypeLabel: '// ANARQUEOLOGÍA PROSPECTIVA',
    title: 'Expte. 11/26 s/ Tendidos sobrentendidos',
    subtitle: 'Causa de fondo',
    description: `El presente expediente tiene por objeto reunir y examinar actuaciones, testimonios y evidencias relativas a las relaciones entre infraestructura y territorio, así como establecer sus posibles vínculos con el proyecto denominado **Nueva Toninas**.

La documentación incorporada permite advertir indicios de una trama secreta de relaciones cuya naturaleza, alcance y jurisdicción permanecen indeterminados, y en la que se reitera una misma referencia: **Los del Fondo**. Entre las líneas de investigación se contempla la posible existencia de un propósito subversivo orientado a la apropiación, recuperación y reutilización de recursos tecnológicos obsoletos, así como al desarrollo de dispositivos, artefactos y sistemas al margen de toda autorización. La investigación continúa.`,
    tag: 'ANARQUEOLOGÍAS',
    // Violeta eléctrico: se distingue del cobalto de las demás derivas.
    accentColor: '#3F14DB',
    imageUrl: 'nueva-toninas.jpg',
    thumbnailImageUrl: 'miniatura.jpg',
    imageCaption: 'Anteproyecto anarqueológico especulativo',
    derroteroSection: 'obras',
    pageMarkdownFile: 'expediente.md',
    pageUrl: 'expediente-11-26',
    imageMaxHeight: 440,
  },
];


