export interface SubcursoDefinition {
  course: 'curso00' | 'curso01' | 'curso02' | 'curso03';
  parentDerivaId: 'en-curso' | 'untref' | 'generativa' | 'pensamiento';
  subcurso: string;
  itemId: string;
  imageUrl?: string | null;
  markdownFile?: string | null;
  pageMarkdownFile?: string | null;
  cardWidth?: number;
  cardHeight?: number;
  code: string;
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
  keywords?: string | null;
  tag: string;
  timeReference?: string | null;
  accentColor: string;
  categoryLabel?: string | null;
  captionLabel: string;
}

export const SUBCURSOS: SubcursoDefinition[] = [
    
 //
 // CURSO:00 - EN CURSO... (BITÁCORA)
 //
  {
    course: 'curso00', parentDerivaId: 'en-curso', subcurso: 'curso001', itemId: 'bitacora-01',
    imageUrl: '/curso00/subcursos/curso001/medios/portada-curso.jpg',
    code: 'SUBCURSO:00.1', 
    tag: 'BITÁCORA VIVA', accentColor: '#E03E2D', categoryLabel: '', captionLabel: 'INICIO BITÁCORA'
  },
  {
    course: 'curso00', parentDerivaId: 'en-curso', subcurso: 'curso002', itemId: 'bitacora-02',
    markdownFile: '/curso00/subcursos/curso002/contenidos/contenido-curso.md', pageMarkdownFile: '/curso00/subcursos/curso002/contenidos/pagina-curso.md',
    code: 'SUBCURSO:00.2', title: 'Statement de Artista', subtitle: 'Por Diego Flores',
    tag: 'EJERCICIO #1', accentColor: '#E03E2D', categoryLabel: '', captionLabel: 'STATEMENT',
  },
  {
    course: 'curso00', parentDerivaId: 'en-curso', subcurso: 'curso003', itemId: 'bitacora-03',
    imageUrl: '/curso00/subcursos/curso003/medios/portada-curso.jpg', markdownFile: '/curso00/subcursos/curso003/contenidos/contenido-curso.md', pageMarkdownFile: '/curso00/subcursos/curso003/contenidos/pagina-curso.md',
    code: 'SUBCURSO:00.3', title: 'Intereses, objetos, amuletos y miedos',
    tag: 'EJERCICIO #2', accentColor: '#E03E2D', categoryLabel: 'OBJETOS / AMULETOS', captionLabel: 'CUESTIONARIO',
  },
  {
    course: 'curso00', parentDerivaId: 'en-curso', subcurso: 'curso004', itemId: 'bitacora-04',
    imageUrl: '/curso00/subcursos/curso004/medios/portada-curso.jpg', markdownFile: '/curso00/subcursos/curso004/contenidos/contenido-curso.md', pageMarkdownFile: '/curso00/subcursos/curso004/contenidos/pagina-curso.md',
    code: 'SUBCURSO:00.4', title: 'Derivas Algorítmicas Recientes', subtitle: 'Registro de Taller #03',
    tag: 'CÓDIGO EN PROCESO', accentColor: '#E03E2D', categoryLabel: 'SIMULACIÓN / CÓDIGO', captionLabel: 'ARROYO DEL REY',
  },
  {
    course: 'curso00', parentDerivaId: 'en-curso', subcurso: 'curso005', itemId: 'bitacora-05',
    imageUrl: '/curso00/subcursos/curso005/medios/portada-curso.jpg', markdownFile: '/curso00/subcursos/curso005/contenidos/contenido-curso.md', pageMarkdownFile: '/curso00/subcursos/curso005/contenidos/pagina-curso.md',
    code: 'SUBCURSO:00.5', title: 'Derivas Algorítmicas Recientes', subtitle: 'Registro de Taller #03',
    tag: 'CÓDIGO EN PROCESO', accentColor: '#E03E2D', categoryLabel: 'SIMULACIÓN / CÓDIGO', captionLabel: 'ARROYO DEL REY',
  },
    

 //
 // CURSO:01 - MAE UNTREF
 //
  {
    course: 'curso01', parentDerivaId: 'untref', subcurso: 'curso001', itemId: 'untref-obra-01',
    imageUrl: '/curso01/subcursos/curso001/medios/portada-curso.gif', 
    pageMarkdownFile: '/curso01/subcursos/curso001/contenidos/pagina-curso.md',
    code: 'SUBCURSO:01.1', 
    title: 'Siervos del Obnubilante Scrolling', 
    subtitle: 'Trabajo final del primer cuatrimestre, 2025',
    tag: 'MAESTRÍA UNTREF', 
    accentColor: '#0038A8', 
    categoryLabel: 'EJE TIEMPO', captionLabel: 'MAE-OBRA#1',
    timeReference: '1C 2025', 
  },
  {
    course: 'curso01', parentDerivaId: 'untref', subcurso: 'curso002', itemId: 'untref-obra-02',
    imageUrl: '/curso01/subcursos/curso002/medios/portada-curso.png', 
    pageMarkdownFile: '/curso01/subcursos/curso002/contenidos/pagina-curso.md',
    code: 'SUBCURSO:01.2', 
    title: 'Rebelión en la Granja de Clics', 
    subtitle: 'Trabajo final del segundo cuatrimestre, 2025',
    description: 'Realizado junto con Diego Flores',
    tag: 'MAESTRÍA UNTREF', 
    accentColor: '#0038A8', 
    categoryLabel: 'EJE ESPACIO', captionLabel: 'MAE-OBRA#2',
  },
  {
    course: 'curso01', parentDerivaId: 'untref', subcurso: 'curso003', itemId: 'untref-obra-03',
    imageUrl: '/curso01/subcursos/curso003/medios/portada-curso.jpg', 
    pageMarkdownFile: '/curso01/subcursos/curso003/contenidos/pagina-curso.md',
    code: 'SUBCURSO:01.3', 
    title: 'Homo Hamatus', 
    subtitle: 'Trabajo final del primer cuatrimestre, 2026',
    tag: 'MAESTRÍA UNTREF', 
    accentColor: '#0038A8', 
    categoryLabel: 'EJE MOVIMIENTO', captionLabel: 'MAE-OBRA#3',
  },
  {
    course: 'curso01', parentDerivaId: 'untref', subcurso: 'curso004', itemId: 'untref-obra-04',
    imageUrl: '/curso01/subcursos/curso004/medios/portada-curso.jpg', 
    pageMarkdownFile: '/curso01/subcursos/curso004/contenidos/pagina-curso.md',
    cardWidth: 560, cardHeight: 580,
    code: 'SUBCURSO:01.4', 
    title: 'GPS (Goce Positioning System)', 
    subtitle: 'Lenguaje de las Artes Electrónicas I. Primer cuatrimestre, 2025',
    description: 'Trabajo realizado con Germán Anido y Diego Flores', 
    tag: 'MAESTRÍA UNTREF', 
    accentColor: '#0038A8', 
    categoryLabel: 'VIDEO', captionLabel: 'MAE-OBRA#4',
  },
  {
    course: 'curso01', parentDerivaId: 'untref', subcurso: 'curso005', itemId: 'untref-obra-05',
    imageUrl: '/curso01/subcursos/curso005/medios/portada-curso.jpg', 
    pageMarkdownFile: '/curso01/subcursos/curso005/contenidos/pagina-curso.md',
    cardWidth: 560, cardHeight: 580,
    code: 'SUBCURSO:01.5', 
    title: 'Diálogos Desavenidos', 
    subtitle: 'Programación de Entornos Sensoriales II. Primer cuatrimestre, 2026',
    description: 'Trabajo realizado con Diego Flores, Ángel Aberbach y Gianfranco Chiappe', 
    tag: 'MAESTRÍA UNTREF', accentColor: '#0038A8', 
    categoryLabel: 'HÁPTICA', captionLabel: 'MAR-OBRA#5',
  },
    
    
 //
 // CURSO:02 - GENERATIVA
 //
  {
    course: 'curso02', parentDerivaId: 'generativa', subcurso: 'curso001', itemId: 'gen-serie-01',
    imageUrl: '/curso02/subcursos/curso001/medios/portada-curso.jpg',
    code: 'SUBCURSO:02.1', 
    title: 'Sarandí Revelation', 
    description: 'Entonces el ángel derramó su copa en el río y a la bestia se le permitió azotar a los pobres con dispensa.',
    tag: 'PROCESSING / P5JS', 
    timeReference: '2025', 
    accentColor: '#16253D', 
    categoryLabel: 'PNG: 4320 x 7680', captionLabel: 'GEN #01',
    keywords: 'agua, contaminación, polución, río, sarandí, avellaneda, residuos',
  },
  {
    course: 'curso02', parentDerivaId: 'generativa', subcurso: 'curso002', itemId: 'gen-serie-02',
    imageUrl: '/curso02/subcursos/curso002/medios/portada-curso.gif', 
    code: 'SUBCURSO:02.2', 
    title: 'Meticulously Unplanned', 
    description: 'Temporada de floración de ciudades vulnerables.',
    tag: 'PROCESSING / P5JS', 
    timeReference: '2024', 
    accentColor: '#16253D', 
    categoryLabel: 'GIF ANIMADO', captionLabel: 'GEN #02',
    keywords: 'urbanización, degradación, urbanización no planificada, gentrificación, abandono',
  },
  {
    course: 'curso02', parentDerivaId: 'generativa', subcurso: 'curso003', itemId: 'gen-serie-03',
    imageUrl: '/curso02/subcursos/curso003/medios/portada-curso.jpg', 
    code: 'SUBCURSO:02.3', 
    title: 'Plastic Natianta', 
    description: 'Inevitablemente, los fondos marinos plastificados terminan abriéndose paso hacia la superficie por la cadena alimentaria.',
    tag: 'PROCESSING / P5JS',
    timeReference: '2025', 
    accentColor: '#16253D', 
    categoryLabel: 'PNG: 4320 x 7680', captionLabel: 'GEN #03',
    keywords: 'microplásticos, mar, océanos, polución, krill, ecosistema, medioambiente',
  },
  {
    course: 'curso02', parentDerivaId: 'generativa', subcurso: 'curso004', itemId: 'gen-serie-04',
    imageUrl: '/curso02/subcursos/curso004/medios/portada-curso.jpg', 
    code: 'SUBCURSO:02.4', 
    title: 'Diasporas', 
    description: 'La diáspora comienza justo después del grito vibrante de los líquenes.',
    tag: 'PROCESSING / P5JS',
    timeReference: '2025', 
    accentColor: '#16253D', 
    categoryLabel: 'PNG: 4320 x 7680', captionLabel: 'GEN #04',
    keywords: 'advertencia, alerta, liquen, medioambiente, polución',
  },
  {
    course: 'curso02', parentDerivaId: 'generativa', subcurso: 'curso005', itemId: 'gen-serie-05',
    imageUrl: '/curso02/subcursos/curso005/medios/portada-curso.gif', 
    code: 'SUBCURSO:02.5', 
    title: 'Meanwhile, in the Southern Hemisphere, a lymphatic summer',
    description: 'Mientras los ojos del mundo están puestos en la sangre, la linfa fluye inadvertidamente, siempre en la misma dirección.',
    tag: 'PROCESSING / P5JS',
    timeReference: '2024', 
    accentColor: '#16253D', 
    categoryLabel: 'PNG: 1920 x 3414', captionLabel: 'GEN #05',
    keywords: 'decolonialidad , sur global, crisis de occidente, cooperación sur-sur',
  },
  {
    course: 'curso02', parentDerivaId: 'generativa', subcurso: 'curso006', itemId: 'gen-serie-06',
    imageUrl: '/curso02/subcursos/curso006/medios/portada-curso.jpg', 
    code: 'SUBCURSO:02.6', 
    title: 'Regolito fértil', 
    description: 'Sólo sesenta lunas más de cosecha por delante.',
    tag: 'PROCESSING / P5JS',
    timeReference: '2024', 
    accentColor: '#16253D', 
    categoryLabel: 'PNG: 2160 x 3840', captionLabel: 'GEN #06',
    keywords: 'suelo, erosión, agotamiento, monicultivos, degradación, frontera agrícola',
  },
    
 //
 // CURSO:03 - DISEÑO
 //
  {
    course: 'curso03', parentDerivaId: 'pensamiento', subcurso: 'curso001', itemId: 'dis-ensayo-01',
    imageUrl: '/curso03/subcursos/curso001/medios/portada-curso.jpg', 
    code: 'SUBCURSO:03.1', 
    title: '¿Qué sostiene la experiencia del usuario?', 
    description: '¿Qué hay debajo de cada interacción que hace posible que ésta tenga lugar. El teléfono celular no es más que la extremidad visible (y táctil) de una descomunal infrastrucutra a nivel planetario.',
    tag: 'GIRO UX', 
    accentColor: '#002FA7', categoryLabel: 'INTERFACES / DISEÑO UX', captionLabel: 'DIS#01',
  },
  {
    course: 'curso03', parentDerivaId: 'pensamiento', subcurso: 'curso002', itemId: 'dis-ensayo-02',
    imageUrl: '/curso03/subcursos/curso002/medios/portada-curso.jpg', 
    code: 'SUBCURSO:03.2', 
    title: 'Interacción: ¿cita entre dos?', 
    description: '¿Cuántas voces y agencias están presentes en cada encuentro digital',
    tag: 'GIRO UX', 
    accentColor: '#002FA7', 
    categoryLabel: 'DISEÑO DE INTERACCIÓN / IxD', captionLabel: 'DIS#02',
  },
  {
    course: 'curso03', parentDerivaId: 'pensamiento', subcurso: 'curso003', itemId: 'dis-ensayo-03',
    imageUrl: '/curso03/subcursos/curso003/medios/portada-curso.jpg', 
    code: 'SUBCURSO:03.3', 
    accentColor: '#002FA7', 
    categoryLabel: 'AL ENCUENTRO DE OTRO DISEÑO', captionLabel: 'DIS#03',
  },
];

export const getSubcursosByDeriva = (derivaId: SubcursoDefinition['parentDerivaId']) =>
  SUBCURSOS.filter((subcurso) => subcurso.parentDerivaId === derivaId);




