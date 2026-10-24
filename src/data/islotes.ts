/**
 * ISLOTES
 * Contenido de las tarjetas de los islotes. La estructura (a qué curso o
 * subcurso pertenece, su URL, su posición y su tamaño) se define en
 * DERIVAS_ISLOTES, en src/engine/Derivas.ts, y cada islote se vincula con
 * su definición espacial por el id.
 */
export interface IsloteDefinition {
  id: string;
  imageUrl?: string | null;
  markdownFile?: string | null;
  pageMarkdownFile?: string | null;
  actionHref?: string | null;
  showAction?: boolean;
  actionLabel?: string;
  showHeader?: boolean;
  imageMaxHeight?: number;
  backgroundColor?: string | null;
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
    
  // ISLOTES DEL CURSO:00 / DERIVA "EN CURSO"
  // Se muestra junto con los cursos del nivel superior
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  {
    id: 'islote-en-curso-01',
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
    
    
  // ISLOTES DEL CURSO:00 / SUBDERIVAS "EN CURSO"
  // Se muestran asociados a las subderivas de la deriva "En Curso",
  // es decir, en la carta de navegación de segundo nivel (subcurso).
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  {
    id: 'islote-bitacora-01-01',
    imageUrl: '/curso00/imagenes/cursario-cartografia.svg',
    markdownFile: '/curso00/contenidos/islote-cursario.md',
    showHeader: false,
    code: 'CURSARIO:00.1',
    title: 'CURSARIO - Un proyecto en sí mismo',
    subtitle: 'Plataforma para registro dinámico de cursos y derivas (hecho con IA)',
    description: `La idea del desarrollo de este sitio nació como una necesidad de la propia investigación: un lugar para registrar, reunir y hacer circular las exploraciones que acompañan el “Trabajo Final de Investigación-Creación” (TFIC) para la Maestría en Artes Electrónicas de la UNTREF. ***Cursario*** es, entonces, un proyecto paralelo pero indivisible del trabajo en curso: una cartografía que crece con la investigación, recoge rastros y abre nuevos desvíos.

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
    id: 'islote-bitacora-01-02',
    imageUrl: '/curso00/subcursos/curso001/medios/arroyo.del.rey-mapa.jpg',
    showHeader: false,
    code: 'CURSARIO:00.1',
    title: 'ARROYO DEL REY / Donde empieza todo...',
    subtitle: 'Vestigios de la monarquía en el conurbano bonaerense',
    description: `El proyecto comienza con la intención de investigar un arroyo que nace en el barrio **Rayo de Sol**, en **Longchamps**, a pocas cuadras del lugar donde crecí. Allí se presenta como un curso de agua de poco caudal que atraviesa barrios vulnerables, parques industriales y áreas naturales protegidas del partido de Almirante Brown, para luego continuar su recorrido por el conurbano sur —por momentos entubado y por momentos a cielo abierto— hasta desembocar en el río **Matanza-Riachuelo**.`,
    tag: 'DISPARADOR',
    accentColor: '#E03E2D',
    captionLabel: 'EXCURSO 04',
  },
  {
    id: 'islote-bitacora-05-01',
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
    id: 'islote-bitacora-05-02',
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
    id: 'islote-bitacora-05-03',
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
  {
    id: 'islote-bitacora-08-01',
    showHeader: false ,
    imageUrl: '/curso00/subcursos/curso008/medios/marca-de-agua.jpg',
    code: 'ISLOTE:00.8',
    title: 'MARCA DE AGUA ©',
    subtitle: '© ARROYO DEL REY. Todos los derechos reservados.',
    description: `El **Arroyo del Rey** introduce otra genealogía posible: la de las marcas que se inscriben sobre un territorio para nombrarlo, delimitarlo, administrarlo y, eventualmente, apropiarlo. Pero, en este caso, la marca pertenece al propio territorio. ¿Quién tiene derecho a poner una marca sobre el agua? El título propone una ironía para tensionar diseño, propiedad, autoría y territorio, al mismo tiempo que abre una posible lectura sobre las formas históricas de inscripción y apropiación territorial vinculadas al colonialismo.`,
    tag: 'MARCAS / SURCOS',
    accentColor: '#E03E2D',
    categoryLabel: 'PROPIEDAD REAL / DOMINIO PÚBLICO',
    captionLabel: 'MARCA DE AGUA',
  },
    
    
  // ISLOTES DEL CURSO:01 / SUBDERIVAS "ARTE ELECTRÓNICO"
  // Se muestran asociados a las subderivas de la deriva "Arte Electrónico",
  // es decir, en la carta de navegación de segundo nivel (subcurso).
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  {
    id: 'islote-obra-00',
    showHeader: true,
    imageUrl: '/curso01/imagenes/instructivo-dominion.jpg',
    markdownFile: '/curso01/contenidos/dominion.md',
    code: 'EMPIRE LTD. / ROBOTICS & APPROPRIATION DEPARTMENT',
    tag: 'MANFIESTO v1.0',
    accentColor: '#0038A8',
    backgroundColor: '#ffffff',
    categoryLabel: '',
    captionLabel: 'Diagrama de dominación en tres capas',
    showAction: false,
    imageMaxHeight: 800,
  },    
  {
    id: 'islote-obra-01',
    showHeader: false,
    imageUrl: '/curso01/imagenes/curso01-sos-azul.png',
    code: 'SEAMOS TODOS ARROBADOS POR LA NUBE',
    tag: '',
    accentColor: '#0038A8',
    categoryLabel: '',
    captionLabel: '',
    showAction: false,
  },
  {
    id: 'islote-obra-02',
    showHeader: false,
    imageUrl: '/curso01/imagenes/curso01-turbio-azul.png',
    code: 'TURBIO',
    tag: '',
    accentColor: '#0038A8',
    categoryLabel: '',
    captionLabel: '',
    showAction: false,
  },
  {
    id: 'islote-obra-03',
    showHeader: false,
    imageUrl: '/curso01/imagenes/curso01-hamatus-azul.png',
    code: 'HOMO HAMATUS',
    tag: '',
    accentColor: '#0038A8',
    categoryLabel: '',
    captionLabel: '',
    showAction: false,
  }, 
  {
    id: 'islote-obra-04',
    showHeader: false,
    imageUrl: '/curso01/imagenes/curso01-gps-azul.png',
    code: 'GPS',
    tag: '',
    accentColor: '#0038A8',
    categoryLabel: '',
    captionLabel: '',
    showAction: false,
  },
  {
    id: 'islote-obra-05',
    showHeader: false,
    imageUrl: '/curso01/imagenes/curso01-haptica-azul.png',
    code: 'HAPTICA',
    tag: '',
    accentColor: '#0038A8',
    categoryLabel: '',
    captionLabel: '',
    showAction: false,
  }, 
    
    
  // ISLOTES DEL CURSO:02 / SUBDERIVAS "GENERATIVA"
  // Se muestran asociados a las subderivas de la deriva "Generativa",
  // es decir, en la carta de navegación de segundo nivel (subcurso).
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  {
    id: 'islote-generativa-01',
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

];
