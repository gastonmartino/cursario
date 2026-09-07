export interface IsloteDefinition {
  course: 'curso00' | 'curso01' | 'curso02' | 'curso03';
  parentDerivaId: string;
  subcurso: string;
  itemId: string;
  imageUrl?: string | null;
  markdownFile?: string | null;
  pageMarkdownFile?: string | null;
  actionHref?: string | null;
  detailHref?: string | null;
  showAction?: boolean;
  actionLabel?: string;
  showHeader?: boolean;
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

export const ISLOTES: IsloteDefinition[] = [
  {
    course: 'curso00',
    parentDerivaId: 'en-curso',
    subcurso: 'islote001',
    itemId: 'islote-en-curso-01',
    showHeader: false,
    imageUrl: '/curso00/imagenes/islote00-inicio.jpg',
    markdownFile: '/curso00/contenidos/islote-01.md',
    code: 'ISLOTE:00.1',
    title: 'Bitácora del trabajo práctico final / MAE',
    subtitle: 'EJE INVESTIGACIÓN-CREACIÓN',
    tag: 'EXCURSO',
    timeReference: '2026', 
    accentColor: '#E03E2D',
    categoryLabel: 'UNTREF / MAE / TFIC / EN CURSO',
    captionLabel: 'EXCURSO 01',
  },
  {
    course: 'curso00',
    parentDerivaId: 'bitacora-01',
    subcurso: 'islote006',
    itemId: 'islote-bitacora-01-01',
    imageUrl: '/curso00/imagenes/cursario-cartografia.svg',
    showHeader: false,
    code: 'CURSARIO:00.1',
    title: 'Cursario, un proyecto en sí mismo',
    subtitle: 'Registro dinámico de cursos y derivas (desarrollado con IA)',
    description: `Este sitio en sí mismo nació como una necesidad de la propia investigación: un lugar para registrar, reunir y hacer circular las exploraciones que acompañan el “Trabajo Final de Investigación-Creación” (TFIC) para la Maestría en Artes Electrónicas de la UNTREF. ***Cursario*** es, entonces, un proyecto paralelo pero indivisible del trabajo en curso: una cartografía que crece con la investigación, recoge rastros y abre nuevos desvíos.

Como los antiguos *Bestiarios*, que reunían criaturas, relatos y saberes diversos, ***Cursario*** es un compendio en movimiento: un mapa de las líneas de investigación, las derivas activas, los hallazgos y los fragmentos del trabajo que está ocurriendo. Porque la investigación parte de seguir el rastro de un curso de agua —el Arroyo del Rey— y porque de un curso pueden surgir otros cursos, y también innumerables excursos: desvíos, rodeos y desvaríos fértiles.

***Cursario*** recupera ese antiguo sentido de la palabra: quien incursiona en aguas ajenas, se aparta de las rutas establecidas y navega hacia aquello que el mapa no alcanza a señalar. Porque seguir un curso no significa necesariamente llegar a destino. El mapa no busca clausurar el territorio, sino provocar nuevas incursiones.`,
    actionHref: '/acerca-de-cursario/',
    actionLabel: 'Ver más...',
    showAction: true,
    tag: 'EXCURSO',
    accentColor: '#E03E2D',
    captionLabel: 'EXCURSO 04',
  },
  {
    course: 'curso02',
    parentDerivaId: 'gen-serie-01',
    subcurso: 'islote002',
    itemId: 'islote-generativa-01',
    showHeader: true,
    imageUrl: '/curso02/imagenes/serie-generativa-01.jpg',
    markdownFile: '/curso02/contenidos/islote-01.md',
    code: 'SERIE GENERATIVA 01',
    tag: 'P5JS',
    accentColor: '#16253D',
    categoryLabel: 'GENERATIVA',
    captionLabel: 'EXCURSO 01',
    timeReference: '2024-2025', 
  },
  {
    course: 'curso00',
    parentDerivaId: 'bitacora-05',
    subcurso: 'islote003',
    itemId: 'islote-bitacora-05-01',
    showHeader: false,
    imageUrl: '/curso00/subcursos/curso005/medios/naturaleza-muerta-01.jpg',
    code: 'ISLOTE:00.3',
    subtitle: 'Naturaleza muerta / Ejercicio de escritura #1',
    description: 'Una pelota de cuero, descosida y sucia, asomándose desde el verdín y a punto de ahogarse. Un enjambre de bichos en la cara y zumbando en los oídos. Una pisada en falso que empuja unas piedritas al agua. Las ondas en la superficie verde sacuden la pelota que espera el rescate. Un pájaron sobrevuela indiferente la escena buscando comida.',
    tag: 'EXCURSO',
    accentColor: '#E03E2D',
    categoryLabel: 'ARROYO DEL REY / LONGCHAMPS',
    captionLabel: 'RECORRIDO 01',
    timeReference: '1-SEP-2026', 
  },
  {
    course: 'curso00',
    parentDerivaId: 'bitacora-05',
    subcurso: 'islote004',
    itemId: 'islote-bitacora-05-02',
    showHeader: false,
    imageUrl: '/curso00/subcursos/curso005/medios/naturaleza-muerta-02.jpg',
    code: 'ISLOTE:00.4',
    subtitle: 'Naturaleza muerta / Ejercicio de escritura #2',
    description: 'Una fogata a orillas del arroyo, a orillas de la ruta. Los plásticos achicharrándose y desprendiendo nubes negras que se arrojan sobre los vehículos. Bocinazos mezclados con música country de fondo y el olor penetrante de los neumáticos quemados. Un nene corre para cruzar la ruta, adelantándose a la camioneta roja.',
    tag: 'EXCURSO',
    accentColor: '#E03E2D',
    categoryLabel: 'ARROYO DEL REY / LONGCHAMPS',
    captionLabel: 'RECORRIDO 02',
    timeReference: '1-SEP-2026', 
  },
  {
    course: 'curso00',
    parentDerivaId: 'bitacora-05',
    subcurso: 'islote005',
    itemId: 'islote-bitacora-05-03',
    showHeader: false,
    imageUrl: '/curso00/subcursos/curso005/medios/naturaleza-muerta-03.jpg',
    code: 'ISLOTE:00.5',
    subtitle: 'Naturaleza muerta / Ejercicio de escritura #3',
    description: 'Un caño que brota de la tierra escupe baba perfumada en la zanja donde bucea la reencarnación plástica y naranja del pececito dorado. La espuma flota inmaculada, apenas agitada por una brisa que desafía el estancamiento del agua. El surco sigue empeñado en mantener a la corriente en cautiverio.',
    tag: 'EXCURSO',
    accentColor: '#E03E2D',
    categoryLabel: 'ARROYO DEL REY / LONGCHAMPS',
    captionLabel: 'RECORRIDO 03',
    timeReference: '1-SEP-2026', 
  },
];
