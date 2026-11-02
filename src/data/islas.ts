/**
 * ISLAS
 * Contenido de las tarjetas de los subcursos: lo que se muestra en cada isla
 * del lienzo de un curso y en su página. La estructura (a qué curso pertenece,
 * su carpeta, su URL, su posición y su tamaño) se define en
 * src/motor/Derivas.ts, y cada isla se vincula con su subcurso por el id.
 */
export interface IslaDefinition {
  id: string;
  imageUrl?: string | null;
  imageBackgroundColor?: string | null;
  code: string;
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
  keywords?: string | null;
  tag: string;
  // Pie de la imagen: imageCaption a la izquierda, imageDate a la derecha.
  // Sin imagen, no se muestran. El Derrotero toma de imageDate el año de la
  // pieza si no lo encuentra en el subtítulo ni en la etiqueta.
  imageDate?: string | null;
  accentColor: string;
  imageCaption?: string | null;
  // Etiqueta del encabezado de la tarjeta; también es el título de respaldo
  // si no hay title.
  headerLabel: string;
    
  // DETALLE DE LA SUBDERIVA
  // imageUrl, markdownFile y pageMarkdownFile se escriben solo con el nombre
  // del archivo, que se busca en la carpeta del subcurso (ver Derivas.ts):
  //   imageUrl      → /{curso}/subcursos/{subcurso}/medios/
  //   *MarkdownFile → /{curso}/subcursos/{subcurso}/contenidos/
  // Una ruta que empieza con "/" se toma tal cual (archivo de otra carpeta).
  markdownFile?: string | null;
  pageMarkdownFile?: string | null;
  // URL propia de la página (pageMarkdownFile), escrita a mano y de un solo
  // tramo: 'rebelion-en-la-granja-de-clics' → /rebelion-en-la-granja-de-clics/.
  // Solo minúsculas, números y guiones. Sin ella, la página va en
  // /{curso}/{subcurso}/. Los archivos se siguen buscando en su carpeta.
  pageUrl?: string | null;
  actionHref?: string | null;
  detailHref?: string | null;
  showAction?: boolean;

  // Imágenes del subcurso fuera del lienzo, con la misma regla de rutas que
  // imageUrl (/{curso}/subcursos/{subcurso}/medios/):
  //   coverImageUrl     → la portada, la imagen grande que lo representa;
  //   thumbnailImageUrl → la miniatura, para las grillas (como la del
  //                       Derrotero). Conviene una imagen liviana y cuadrada.
  // Sin miniatura, el Derrotero muestra un recuadro gris con el código.
  coverImageUrl?: string | null;
  thumbnailImageUrl?: string | null;

  // Destacado (true) o no (false, o sin definir): aparece en INICIO, en el
  // Derrotero. Es independiente de derroteroSection.
  featured?: boolean;

  // Sección del Derrotero en la que aparece la isla: obras, bitacora o
  // escritos. Sin definir, no aparece en ninguna (puede aparecer igual en
  // INICIO si es featured).
  derroteroSection?: 'obras' | 'bitacora' | 'escritos';
}

export const ISLAS: IslaDefinition[] = [
    
 //
 // CURSO:00 - EN CURSO... (BITÁCORA)
 //
  {
    id: 'bitacora-01',
    imageUrl: 'mapa-cuenca.jpg',
    thumbnailImageUrl: 'miniatura.jpg',
    description: 'La cuenca Matanza-Riachuelo: En una cuenca tan extensa, empezar por lo que está cerca.',
    code: 'TFIC:00', 
    tag: '04:AGOSTO:26', 
    accentColor: '#E03E2D', 
    imageCaption: '', 
    headerLabel: 'INICIO BITÁCORA'
  },
  {
    id: 'bitacora-02',
    derroteroSection: 'bitacora',
    imageUrl: 'portada-curso.jpg',
    thumbnailImageUrl: 'miniatura.jpg',
    markdownFile: 'contenido-curso.md',
    pageMarkdownFile: 'pagina-curso.md',
    code: 'TFIC:01', 
    title: 'Intereses, objetos, amuletos y miedos',
    tag: '04:AGOSTO:26', 
    accentColor: '#E03E2D', 
    imageCaption: 'OBJETOS / AMULETOS', 
    headerLabel: 'EJERCICIO #1 / CUESTIONARIO',
  },
  {
    id: 'bitacora-03',
    derroteroSection: 'bitacora',
    thumbnailImageUrl: 'miniatura.jpg',
    markdownFile: 'contenido-curso.md',
    pageMarkdownFile: 'pagina-curso.md',
    code: 'TFIC:02', 
    title: 'Statement de Artista', 
    subtitle: 'Por Diego Flores',
    tag: '11:AGOSTO:26', 
    accentColor: '#E03E2D', 
    imageCaption: '', 
    headerLabel: 'EJERCICIO #2 / STATEMENT',
  },
  {
    id: 'bitacora-04',
    derroteroSection: 'bitacora',
    imageUrl: 'portada-curso.jpg',
    thumbnailImageUrl: 'miniatura.jpg',
    code: 'TFIC:03', 
    title: 'Camino de las Flores', 
    subtitle: 'Un área protegida al sur del conurbano bonaerense',
    description: 'Ubicado dentro de la Cuenca Matanza Riachuelo, es un área natural de 160ha que conserva parte del ecosistema natural de la provincia de Buenos Aires. Es un gran mosaico de pastizales inmerso en una matriz urbana.  En esta área coexisten productores rurales de la agricultura familiar, barrios populares y el Sector Industrial Planificado de Almirante Brown (SIPAB) con más de 200 industrias instaladas.',
    tag: '22:AGOSTO:2026', 
    accentColor: '#E03E2D', 
    imageCaption: 'FOTOGRAFÍA', 
    headerLabel: 'ARROYO DEL REY / REGISTRO DE CAMPO',
  },
  {
    id: 'bitacora-05',
    derroteroSection: 'bitacora',
    imageUrl: 'portada-curso.jpg',
    thumbnailImageUrl: 'miniatura.jpg',
    markdownFile: 'contenido-curso.md',
    pageMarkdownFile: 'pagina-curso.md',
    code: 'TFIC:04', 
    title: 'Ejercicio de Recorrido', 
    subtitle: 'Visital al Arroyo del Rey / Rayo de Sol / Longchamps',
    tag: '31:AGOSTO:26', 
    accentColor: '#E03E2D', 
    imageCaption: 'REGISTRO', 
    headerLabel: 'EJERCICIO #3 / RECORRIDO',
    imageDate: '31 de agosto de 2026', 
  },
  {
    id: 'bitacora-06',
    derroteroSection: 'bitacora',
    imageUrl: 'arroyo-macrofitas-v01.jpg',
    thumbnailImageUrl: 'miniatura.jpg',
    pageMarkdownFile: 'macrofitas.md',
    code: 'TFIC:05',
    title: 'Macrófitas - Visualización de un territorio generativo',
    subtitle: 'Escalas visibles (MACRO) e invisibles (MICRO)',
    description: 'Las macrófitas (plantas acuáticas del arroyo) contienen de alguna manera el territorio. En su crecimiento quedan inscriptas las condiciones del lugar. Su cualidad de "macro" contiene, a su vez, lo "micro". Las macrófitas son una emergencia visible de procesos invisibles dentro del territorio. Pero al mismo tiempo que son su consecuencia, participan activamente de su transformación, siempre cambiante, siempre sujetas a las nuevas condiciones de generación.',
    tag: '06:SEPTIEMBRE:26',
    accentColor: '#E03E2D',
    headerLabel: 'REGISTRO DE CAMPO / GENERATIVA',
  },
  {
    id: 'bitacora-07',
    derroteroSection: 'bitacora',
    imageUrl: 'collage-emergencia-01.jpg',
    thumbnailImageUrl: 'miniatura.jpg',
    pageMarkdownFile: 'emergencia.md',
    code: 'TFIC:06',
    title: 'Emergencias del Territorio',
    subtitle: 'El territorio produce formas inesperadas. Las formas producen territorio',
    tag: '13:SEPTIEMBRE:26',
    accentColor: '#E03E2D',
    imageCaption: 'MICRO / MACRO',
    headerLabel: 'REFLEXIÓN',
  },
  {
    id: 'bitacora-08',
    derroteroSection: 'bitacora',
    imageUrl: 'stranger-visions.jpg',
    thumbnailImageUrl: 'miniatura.jpg',
    markdownFile: 'actividad-consigna.md',
    pageMarkdownFile: 'actividad-respuesta.md',
    code: 'TFIC:07',
    title: 'Estrategias estéticas, cruces y agrupamientos',
    subtitle: 'Actividad - Primer acercamiento al cuerpo de obra',
    tag: '22:SEPTIEMBRE:26',
    accentColor: '#E03E2D',
    imageCaption: 'STRANGER VISIONS / Heather Dewey-Hagborg',
    headerLabel: 'EJERCICIO #4 / CUERPO DE OBRA',
  },
  {
    id: 'bitacora-09',
    derroteroSection: 'bitacora',
    thumbnailImageUrl: 'miniatura.jpg',
    description: 'A partir del texto de Pérez Royo, pensar un sentimiento “amoroso” o positivo, que nutra y potencie su proyecto de TFIC en curso; pensar un sentimiento negativo (trabas, miedos, apatía, desorientación, etc) que dificulte el avance del mismo.',
    markdownFile: 'discurso-amoroso.md',
    pageMarkdownFile: 'discurso-amoroso.md',
    code: 'TFIC:08',
    title: 'Fragmentos de un discurso amoroso',
    subtitle: 'Actividad - Sobre la investigación en artes',
    tag: '06:OCTUBRE:26',
    accentColor: '#E03E2D',
    imageCaption: 'INVESTIGACIÓN EN ARTES / Victoria Pérez Royo',
    headerLabel: 'EJERCICIO #4 / V. PÉREZ ROYO',
  },

//
 // CURSO:01 - ARTES ELECTRÓNICAS
 //
  {
    id: 'arte-electronico-01',
    derroteroSection: 'obras',
    featured: true,
    imageUrl: 'portada-sos.gif',
    thumbnailImageUrl: 'miniatura.jpg',
    pageMarkdownFile: 'pagina-curso.md',
    pageUrl: 'sos',
    code: 'OBRA:01', 
    title: 'Siervos del Obnubilante Scrolling (S.O.S)', 
    subtitle: 'Julio de 2025',
    description: 'Un culto a la obnubilación, con tecnoliturgias obscenas, maquinales actos de fe y profecías de autosatisfacción. Una historia apócrifa sobre el arrobamiento del Antropobsceno tardío',
    tag: 'ARTES ELECTRÓNICAS', 
    accentColor: '#0038A8', 
    imageCaption: 'EJE TIEMPO: METÁFORAS TECNOLÓGICAS / LA NUBE / ANTROPOBSCENO TARDÍO', 
    headerLabel: 'SOS',
    imageDate: '1C 2025', 
  },
  {
    id: 'arte-electronico-02',
    derroteroSection: 'obras',
    featured: true,
    imageUrl: 'portada-granja.jpg',
    thumbnailImageUrl: 'miniatura.jpg',
    pageMarkdownFile: 'pagina-curso.md',
    pageUrl: 'rebelion-en-la-granja-de-clics',
    code: 'OBRA:02', 
    title: 'Rebelión en la Granja de Clics', 
    subtitle: 'Noviembre de 2025',
    description: 'Realizado junto con Diego Flores',
    tag: 'ARTES ELECTRÓNICAS', 
    accentColor: '#0038A8', 
    imageCaption: 'EJE ESPACIO: ENTURBIAMIENTO / PANTALLAS EMPAÑADAS / MUNDOS DIGITALES', 
    headerLabel: 'TURBIO',
    imageDate: '2C 2025', 
  },
  {
    id: 'arte-electronico-03',
    derroteroSection: 'obras',
    featured: true,
    imageUrl: 'portada-curso.jpg',
    thumbnailImageUrl: 'miniatura.jpg',
    pageMarkdownFile: 'pagina-curso.md',
    pageUrl: 'homo-hamatus',
    code: 'OBRA:03', 
    title: 'Homo Hamatus. Fenomenología de la vulnerabilidad', 
    subtitle: 'Julio de 2026',
    tag: 'ARTES ELECTRÓNICAS', 
    accentColor: '#0038A8', 
    imageCaption: 'EJE MOVIMIENTO: REDES DE CUIDADO / IDENTIDADES ASIDERO', 
    headerLabel: 'HAMATUS',
    imageDate: '1C 2026', 
  },
  {
    id: 'arte-electronico-04',
    derroteroSection: 'obras',
    featured: true,
    imageUrl: 'portada-gps.jpg',
    thumbnailImageUrl: 'miniatura.jpg',
    pageMarkdownFile: 'pagina-curso.md',
    pageUrl: 'gps',
    code: 'OBRA:04', 
    title: 'GPS (Goce Positioning System)', 
    subtitle: 'Mayo de 2025',
    description: 'Trabajo realizado con Germán Anido y Diego Flores', 
    tag: 'ARTES ELECTRÓNICAS', 
    accentColor: '#0038A8', 
    imageCaption: 'VIDEO / DISPOSITIVOS INSUMISOS / CARTOGRAFÍAS DEL DESEO', 
    headerLabel: 'GPS',
    imageDate: '1C 2025', 
  },
  {
    id: 'arte-electronico-05',
    derroteroSection: 'obras',
    imageUrl: 'portada-curso.jpg',
    thumbnailImageUrl: 'miniatura.jpg',
    pageMarkdownFile: 'pagina-curso.md',
    pageUrl: 'dialogos-desavenidos',
    code: 'OBRA:05', 
    title: 'Diálogos Desavenidos', 
    subtitle: 'Junio de 2026',
    description: 'Trabajo realizado con Diego Flores, Ángel Aberbach y Gianfranco Chiappe', 
    tag: 'ARTES ELECTRÓNICAS', 
    accentColor: '#0038A8', 
    imageCaption: 'HÁPTICA / PROXEMIA / AFFORDANCE', 
    headerLabel: 'HÁPTICA',
    imageDate: '1C 2026', 
  },
    
    
 //
 // CURSO:02 - GENERATIVA
 //
  {
    id: 'gen-serie-01',
    derroteroSection: 'obras',
    imageUrl: 'portada-curso.jpg',
    thumbnailImageUrl: 'miniatura.jpg',
    code: 'GEN:01', 
    title: 'Sarandí Revelation', 
    description: 'Entonces el ángel derramó su copa en el río y a la bestia se le permitió azotar a los pobres con dispensa.',
    tag: 'PROCESSING / P5JS', 
    imageDate: '2025', 
    accentColor: '#16253D', 
    imageCaption: 'PNG: 4320 x 7680', 
    headerLabel: '1 EDITION',
    keywords: 'agua, contaminación, polución, río, sarandí, avellaneda, residuos',
  },
  {
    id: 'gen-serie-02',
    derroteroSection: 'obras',
    imageUrl: 'portada-curso.gif',
    thumbnailImageUrl: 'miniatura.jpg',
    code: 'GEN:02', 
    title: 'Meticulously Unplanned', 
    description: 'Temporada de floración de ciudades vulnerables.',
    tag: 'PROCESSING / P5JS', 
    imageDate: '2024', 
    accentColor: '#16253D', 
    imageCaption: 'GIF ANIMADO', 
    headerLabel: '15 EDITIONS',
    keywords: 'urbanización, degradación, urbanización no planificada, gentrificación, abandono',
  },
  {
    id: 'gen-serie-03',
    derroteroSection: 'obras',
    imageUrl: 'portada-curso.jpg',
    thumbnailImageUrl: 'miniatura.jpg',
    code: 'GEN:03', 
    title: 'Plastic Natianta', 
    description: 'Inevitablemente, los fondos marinos plastificados terminan abriéndose paso hacia la superficie por la cadena alimentaria.',
    tag: 'PROCESSING / P5JS',
    imageDate: '2025', 
    accentColor: '#16253D', 
    imageCaption: 'PNG: 4320 x 7680', 
    headerLabel: '1 EDITION',
    keywords: 'microplásticos, mar, océanos, polución, krill, ecosistema, medioambiente',
  },
  {
    id: 'gen-serie-04',
    derroteroSection: 'obras',
    imageUrl: 'portada-curso.jpg',
    thumbnailImageUrl: 'miniatura.jpg',
    code: 'GEN:04', 
    title: 'Diasporas', 
    description: 'La diáspora comienza justo después del grito vibrante de los líquenes.',
    tag: 'PROCESSING / P5JS',
    imageDate: '2025', 
    accentColor: '#16253D', 
    imageCaption: 'PNG: 4320 x 7680', 
    headerLabel: '1 EDITION',
    keywords: 'advertencia, alerta, liquen, medioambiente, polución',
  },
  {
    id: 'gen-serie-05',
    derroteroSection: 'obras',
    imageUrl: 'portada-curso.gif',
    thumbnailImageUrl: 'miniatura.jpg',
    code: 'GEN:05', 
    title: 'Meanwhile, in the Southern Hemisphere, a lymphatic summer',
    description: 'Mientras los ojos del mundo están puestos en la sangre, la linfa fluye inadvertidamente, siempre en la misma dirección.',
    tag: 'PROCESSING / P5JS',
    imageDate: '2024', 
    accentColor: '#16253D', 
    imageCaption: 'PNG: 1920 x 3414', 
    headerLabel: '1 EDITION',
    keywords: 'decolonialidad , sur global, crisis de occidente, cooperación sur-sur',
  },
  {
    id: 'gen-serie-06',
    derroteroSection: 'obras',
    imageUrl: 'portada-curso.jpg',
    thumbnailImageUrl: 'miniatura.jpg',
    code: 'GEN:06', 
    title: 'Regolito fértil', 
    description: 'Sólo sesenta lunas más de cosecha por delante.',
    tag: 'PROCESSING / P5JS',
    imageDate: '2024', 
    accentColor: '#16253D', 
    imageCaption: 'PNG: 2160 x 3840', 
    headerLabel: '1 EDITION',
    keywords: 'suelo, erosión, agotamiento, monicultivos, degradación, frontera agrícola',
  },
    
 //
 // CURSO:03 - DISEÑO
 //
  {
    id: 'dis-ensayo-01',
    derroteroSection: 'escritos',
    imageUrl: 'portada-interaccion.jpg',
    code: 'NOTA:01', 
    title: '¿Qué sostiene la experiencia del usuario?', 
    description: '¿Qué hay debajo de cada interacción que hace posible que ésta tenga lugar. El teléfono celular no es más que la extremidad visible (y táctil) de una descomunal infrastrucutra a nivel planetario.',
    tag: 'GIRO UX', 
    accentColor: '#002FA7', imageCaption: 'INTERFACES / DISEÑO UX', headerLabel: 'DIS#01',
  },
  {
    id: 'dis-ensayo-02',
    derroteroSection: 'escritos',
    imageUrl: 'portada-curso.jpg',
    code: 'NOTA:02', 
    title: 'Interacción: ¿cita entre dos?', 
    description: '¿Cuántas voces y agencias están presentes en cada encuentro digital?',
    tag: 'GIRO UX', 
    accentColor: '#002FA7', 
    imageCaption: 'DISEÑO DE INTERACCIÓN / IxD', headerLabel: 'DIS#02',
  },
  {
    id: 'dis-ensayo-03',
    subtitle: 'Patrones de Diseño Agéntico',
    description: '¿Qué nuevos patrones de diseño emergen al integrar la inteligencia artificial en las experiencias?',
    imageUrl: 'portada-experiencia.jpg',
    code: 'NOTA:03', 
    tag: 'GIRO UX',
    accentColor: '#002FA7', 
    imageCaption: 'AL ENCUENTRO DE OTRO DISEÑO', headerLabel: 'DIS#03',
  },

 //
 // DERIVA:04 - EXPEDIENTE 11/26 (CAUSA DE FONDO)
 //
  {
    id: 'expediente-1126-01',
    imageUrl: 'tarjeta.jpg',
    thumbnailImageUrl: 'miniatura.jpg',
    markdownFile: 'tarjeta.md',
    pageMarkdownFile: 'pagina.md',
    code: 'DILIGENCIA:01',
    title: 'Procedimiento policial en la playa',
    subtitle: 'Actuación N.º 018/2026 · Destacamento Costero Las Toninas',
    tag: '18:ENERO:26',
    accentColor: '#3F14DB',
    imageCaption: 'ACTA / CROQUIS / REGISTRO FOTOGRÁFICO',
    imageDate: '18/01/2026',
    headerLabel: 'PROCEDIMIENTO POLICIAL',
  },
  {
    id: 'expediente-1126-02',
    imageUrl: 'tarjeta.jpg',
    thumbnailImageUrl: 'miniatura.jpg',
    markdownFile: 'tarjeta.md',
    pageMarkdownFile: 'pagina.md',
    code: 'DILIGENCIA:03',
    title: 'Allanamiento del domicilio de Pereyra',
    subtitle: 'IPP 03-00-0047-26/00 · Folio 08',
    tag: '21:ENERO:26',
    accentColor: '#3F14DB',
    imageCaption: 'ACTA DE ALLANAMIENTO Y REGISTRO DOMICILIARIO',
    imageDate: '21/01/2026',
    headerLabel: 'ALLANAMIENTO',
  },
];


