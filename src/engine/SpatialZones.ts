export interface DerivaItem {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  summary: string;
  x: number;
  y: number;
  width: number;
  height: number;
  accentColor: string;
  tag: string;
}

export interface SpatialDeriva {
  id: string;
  code: string;
  name: string;
  subtitle: string;
  description: string;
  x: number;
  y: number;
  width: number;
  height: number;
  accentColor: string;
  tag: string;
  type: 'inprogress' | 'electronics' | 'generative' | 'discourse';
  image?: string;
  customHtml?: string;
  items: DerivaItem[];
}

export type SpatialZone = SpatialDeriva; // Alias for backward compatibility

export const SPATIAL_DERIVAS: SpatialDeriva[] = [
  {
    id: 'en-curso',
    code: 'CURSO:00',
    name: 'En Curso...',
    subtitle: 'Bitácora y exploraciones vivas',
    description: 'Espacio de trabajo activo. Registro continuo de investigaciones en desarrollo, bocetos de taller y derivas en proceso.',
    x: 200,
    y: 20,
    width: 740,
    height: 730,
    accentColor: '#E03E2D', // Vermilion
    tag: 'EN PROGRESO',
    type: 'inprogress',
    image: '/curso00/imagenes/curso00-inicio.png',
    items: [
      {
        id: 'bitacora-01',
        code: 'BIT-01',
        title: 'Inicio del recorrido',
        subtitle: 'Registro de Taller #01',
        summary: 'Ensayos con papel de algodón, pátinas de risografía y pruebas de pigmento azul cobalto para la superficie háptica.',
        x: -720,
        y: -60,
        width: 640,
        height: 660,
        accentColor: '#E03E2D',
        tag: 'REGISTRO'
      },
      {
        id: 'bitacora-02',
        code: 'BIT-02',
        title: 'Statement de Artista',
        subtitle: 'Por Diego Flores',
        summary: 'Ejercicio del taller de trabajo final.',
        x: 0,
        y: 110,
        width: 640,
        height: 660,
        accentColor: '#E03E2D',
        tag: 'EJERCICIO'
      },
      {
        id: 'bitacora-03',
        code: 'BIT-03',
        title: 'Cuestionario / preguntas',
        subtitle: 'Registro de Taller #03',
        summary: 'Nuevos scripts de simulación de campos de fuerza y bifurcaciones hidráulicas en tiempo real.',
        x: 710,
        y: -170,
        width: 640,
        height: 660,
        accentColor: '#E03E2D',
        tag: 'CÓDIGO EN PROCESO'
      },
      {
        id: 'bitacora-04',
        code: 'BIT-04',
        title: 'Arroyo del Rey',
        subtitle: 'Registro de Taller #03',
        summary: 'Nuevos scripts de simulación de campos de fuerza y bifurcaciones hidráulicas en tiempo real.',
        x: -760,
        y: 840,
        width: 640,
        height: 660,
        accentColor: '#E03E2D',
        tag: 'CÓDIGO EN PROCESO'
      },
      {
        id: 'bitacora-05',
        code: 'BIT-05',
        title: 'Ejercicio de recorrido',
        subtitle: 'Registro de Taller #03',
        summary: 'Nuevos scripts de simulación de campos de fuerza y bifurcaciones hidráulicas en tiempo real.',
        x: 760,
        y: 840,
        width: 640,
        height: 660,
        accentColor: '#E03E2D',
        tag: 'CÓDIGO EN PROCESO'
      }
    ]
  },
  {
    id: 'untref',
    code: 'CURSO:01',
    name: 'Artes Electrónicas',
    subtitle: 'Maestría UNTREF • Producción',
    description: 'Dispositivos, instalaciones sensibles, circuitos y espacialidad física. Hibridación de hardware, materia y poética electromagnética.',
    x: -641,
    y: -260,
    width: 760,
    height: 730,
    accentColor: '#0038A8', // Cobalt
    tag: 'ARTES ELECTRÓNICAS',
    type: 'electronics',
    items: [
      {
        id: 'untref-obra-01',
        code: 'OBRA:01',
        title: 'Ficha de obra',
        subtitle: 'MAE, obra #01',
        summary: 'Memoria técnica, registros sonoros, diagramas de circuitos y documentación audiovisual de la primera obra de maestría.',
        x: -720,
        y: -30,
        width: 640,
        height: 660,
        accentColor: '#0038A8',
        tag: 'MAESTRÍA UNTREF'
      },
      {
        id: 'untref-obra-02',
        code: 'OBRA:02',
        title: 'Ficha de obra',
        subtitle: 'MAE, obra #02',
        summary: 'Sistema interactivo de transducción electromagnética y espacialización en tiempo real.',
        x: 0,
        y: -220,
        width: 640,
        height: 660,
        accentColor: '#0038A8',
        tag: 'MAESTRÍA UNTREF'
      },
      {
        id: 'untref-obra-03',
        code: 'OBRA:03',
        title: 'Ficha de obra',
        subtitle: 'MAE, obra #03',
        summary: 'Dispositivo escultórico con respuesta a variaciones ambientales y memoria física de la corriente.',
        x: 720,
        y: -260,
        width: 640,
        height: 660,
        accentColor: '#0038A8',
        tag: 'MAESTRÍA UNTREF'
      },
      {
        id: 'untref-obra-04',
        code: 'OBRA:04',
        title: 'Ficha de obra',
        subtitle: 'MAE, obra #03',
        summary: 'Dispositivo escultórico con respuesta a variaciones ambientales y memoria física de la corriente.',
        x: -20,
        y: 560,
        width: 560,
        height: 580,
        accentColor: '#0038A8',
        tag: 'MAESTRÍA UNTREF'
      },
      {
        id: 'untref-obra-05',
        code: 'OBRA:05',
        title: 'Ficha de obra',
        subtitle: 'MAE, obra #03',
        summary: 'Dispositivo escultórico con respuesta a variaciones ambientales y memoria física de la corriente.',
        x: 660,
        y: 860,
        width: 560,
        height: 580,
        accentColor: '#0038A8',
        tag: 'MAESTRÍA UNTREF'
      }
    ]
  },
  {
    id: 'generativa',
    code: 'CURSO:02',
    name: 'Gráfica Generativa',
    subtitle: 'Gráfica Generativa con p5js',
    description: 'Exploraciones algorítmicas, campos de flujo, sistemas de partículas y morfologías computacionales autónomas.',
    x: -1511,
    y: -11,
    width: 760,
    height: 730,
    accentColor: '#16253D', // Cyanotype
    tag: 'ALGORITMOS & TRAMAS',
    type: 'generative',
    image: '/curso02/imagenes/sarandi-revelation.jpg',

    items: [
      {
        id: 'gen-serie-01',
        code: 'SERIE:01',
        title: 'Gráfica generativa con p5js',
        subtitle: 'Estudio en Processing / Java',
        summary: 'NO SUMMARY',
        x: -2000,
        y: -60,
        width: 640,
        height: 660,
        accentColor: '#16253D',
        tag: 'PROCESSING'
      },
      {
        id: 'gen-serie-02',
        code: 'SERIE:02',
        title: 'Gráfica generativa con p5js',
        subtitle: 'Gráfica Algorítmica',
        summary: 'Superposiciones de retículas geométricas deformadas proceduralmente que generan vibración visual y patrones moiré.',
        x: -1200,
        y: 80,
        width: 640,
        height: 660,
        accentColor: '#16253D',
        tag: 'PROCESSING'
      },
      {
        id: 'gen-serie-03',
        code: 'SERIE:03',
        title: 'Gráfica generativa con p5js',
        subtitle: 'Piezas audiovisuales',
        summary: 'Sistemas dinámicos de partículas atraídas por campos magnéticos simulados, con captura y renderizado en video HD.',
        x: -400,
        y: -40,
        width: 640,
        height: 660,
        accentColor: '#16253D',
        tag: 'VIDEO GENERATIVO'
      },
      {
        id: 'gen-serie-04',
        code: 'SERIE:04',
        title: 'Gráfica generativa con p5js',
        subtitle: 'Piezas audiovisuales',
        summary: 'Sistemas dinámicos de partículas atraídas por campos magnéticos simulados, con captura y renderizado en video HD.',
        x: 400,
        y: 100,
        width: 640,
        height: 660,
        accentColor: '#16253D',
        tag: 'VIDEO GENERATIVO'
      },
      {
        id: 'gen-serie-05',
        code: 'SERIE:05',
        title: 'Gráfica generativa con p5js',
        subtitle: 'Piezas audiovisuales',
        summary: 'Sistemas dinámicos de partículas atraídas por campos magnéticos simulados, con captura y renderizado en video HD.',
        x: 1200,
        y: -20,
        width: 640,
        height: 660,
        accentColor: '#16253D',
        tag: 'VIDEO GENERATIVO'
      },
      {
        id: 'gen-serie-06',
        code: 'SERIE:06',
        title: 'Gráfica generativa con p5js',
        subtitle: 'Piezas audiovisuales',
        summary: 'Sistemas dinámicos de partículas atraídas por campos magnéticos simulados, con captura y renderizado en video HD.',
        x: 2000,
        y: 70,
        width: 640,
        height: 660,
        accentColor: '#16253D',
        tag: 'VIDEO GENERATIVO'
      }
    ]
  },
  {
    id: 'pensamiento',
    code: 'CURSO:03',
    name: 'Pensamiento & Diseño',
    subtitle: 'Al Encuentro de Otro Diseño',
    description: 'Ensayos, notas críticas, pedagogía proyectual y apuntes teóricos sobre técnica, materia e interfaces.',
    x: 1041,
    y: -110,
    width: 760,
    height: 730,
    accentColor: '#002FA7', // Klein blue
    tag: 'INTERFACES & INTERACCIONES INTELIGENTES',
    type: 'discourse',
    items: [
      {
        id: 'dis-ensayo-01',
        code: 'TXT:01',
        title: 'Diseño UX',
        subtitle: 'Ensayo Crítico',
        summary: 'Reflexión sobre el rol del diseño en la era de los agentes algorítmicos y la necesidad de interfaces sensibles y no higienizadas.',
        x: -720,
        y: 50,
        width: 640,
        height: 660,
        accentColor: '#002FA7',
        tag: 'ENSAYO EDITORIAL'
      },
      {
        id: 'dis-ensayo-02',
        code: 'TXT:02',
        title: 'Diseño UX',
        subtitle: 'Apuntes de cátedra y pedagogía',
        summary: 'Notas sobre la enseñanza del diseño proyectual cuando el píxel se concibe como materia y no como abstracción.',
        x: 0,
        y: 120,
        width: 640,
        height: 660,
        accentColor: '#002FA7',
        tag: 'PEDAGOGÍA DEL DISEÑO'
      },
      {
        id: 'dis-ensayo-03',
        code: 'TXT:03',
        title: 'Diseño UX',
        subtitle: 'Manifiesto & Derivas Disciplinares',
        summary: 'Bases para una práctica del diseño descentrada del consumo inmediato y abierta a la investigación experimental y el arte.',
        x: 720,
        y: 70,
        width: 640,
        height: 660,
        accentColor: '#002FA7',
        tag: 'CRÍTICA DISCIPLINAR'
      }
    ]
  }
];

export const SPATIAL_ZONES = SPATIAL_DERIVAS; // Backward compatibility
