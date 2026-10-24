import { SUBCURSOS } from '../data/subcursos';

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
  x: number;
  y: number;
  width: number;
  height: number;
  accentColor: string;
  items: DerivaItem[];
}

export interface IsloteSpatial {
  id: string;
  parentId: string;
  x: number;
  y: number;
  width: number;
  height: number;
}


// Posición y tamaño de una subderiva en el lienzo local de su deriva.
// Los textos y el color se toman de SUBCURSOS (src/data/subcursos.ts),
// que es la única fuente del contenido de cada subderiva.
type DerivaItemPosition = Pick<DerivaItem, 'id' | 'x' | 'y' | 'width' | 'height'>;
type SpatialDerivaDefinition = Omit<SpatialDeriva, 'items'> & { items: DerivaItemPosition[] };

const withSubcursoContent = (item: DerivaItemPosition): DerivaItem => {
  const subcurso = SUBCURSOS.find((entry) => entry.itemId === item.id);

  return {
    ...item,
    code: subcurso?.code ?? item.id,
    title: subcurso?.title || subcurso?.captionLabel || '',
    subtitle: subcurso?.subtitle ?? '',
    summary: subcurso?.description ?? '',
    tag: subcurso?.tag ?? '',
    accentColor: subcurso?.accentColor ?? '#0038A8',
  };
};


// =====================================================================================
//
// DERIVAS
// Las derivas son los cursos en los que se organizan los contenidos del sitio.
// Se trata de ítems dispuestos en un "lienzo infinito" —de ahí el nombre de
// "Derivas Espaciales"—. Cada deriva o curso de nivel superior puede tener una
// o múltiples subderivas o subcursos que son dibujadas en su propio lienzo, 
// y vinculadas entre sí por una línea que representa el flujo.
//
// =====================================================================================

const DERIVAS_DEFINITIONS: SpatialDerivaDefinition[] = [
  {
    id: 'en-curso',
    code: 'CURSO:00',
    name: 'En Curso...',
    x: 200,
    y: 20,
    width: 740,
    height: 730,
    accentColor: '#E03E2D', // Vermilion
    items: [
      {
        id: 'bitacora-01',
        x: -720,
        y: 20,
        width: 640,
        height: 660,
      },
      {
        id: 'bitacora-02',
        x: -20,
        y: -250,
        width: 640,
        height: 660,
      },
      {
        id: 'bitacora-03',
        x: 710,
        y: -190,
        width: 640,
        height: 660,
      },
      {
        id: 'bitacora-04',
        x: -780,
        y: 840,
        width: 640,
        height: 660,
      },
      {
        id: 'bitacora-05',
        x: 22,
        y: 600,
        width: 640,
        height: 660,
      },
      {
        id: 'bitacora-06',
        x: 750,
        y: 620,
        width: 640,
        height: 660,
      },
      {
        id: 'bitacora-07',
        x: 1450,
        y: 120,
        width: 640,
        height: 660,
      },
      {
        id: 'bitacora-08',
        x: 2186,
        y: -126,
        width: 640,
        height: 660,
      },
    ]
  },
  {
    id: 'untref',
    code: 'CURSO:01',
    name: 'Artes Electrónicas',
    x: -641,
    y: -270,
    width: 760,
    height: 730,
    accentColor: '#0038A8', // Cobalt
    items: [
      {
        id: 'untref-obra-01',
        x: -720,
        y: -30,
        width: 640,
        height: 660,
      },
      {
        id: 'untref-obra-02',
        x: 0,
        y: -220,
        width: 640,
        height: 660,
      },
      {
        id: 'untref-obra-03',
        x: 720,
        y: -260,
        width: 640,
        height: 660,
      },
      {
        id: 'untref-obra-04',
        x: -20,
        y: 560,
        width: 560,
        height: 580,
      },
      {
        id: 'untref-obra-05',
        x: 660,
        y: 860,
        width: 560,
        height: 580,
      }
    ]
  },
  {
    id: 'generativa',
    code: 'CURSO:02',
    name: 'Gráfica Generativa',
    x: -1511,
    y: -11,
    width: 760,
    height: 730,
    accentColor: '#16253D', // Cyanotype

    items: [
      {
        id: 'gen-serie-01',
        x: -2000,
        y: -60,
        width: 640,
        height: 660,
      },
      {
        id: 'gen-serie-02',
        x: -1200,
        y: 80,
        width: 640,
        height: 660,
      },
      {
        id: 'gen-serie-03',
        x: -400,
        y: -40,
        width: 640,
        height: 660,
      },
      {
        id: 'gen-serie-04',
        x: 400,
        y: 100,
        width: 640,
        height: 660,
      },
      {
        id: 'gen-serie-05',
        x: 1200,
        y: -20,
        width: 640,
        height: 660,
      },
      {
        id: 'gen-serie-06',
        x: 2000,
        y: 70,
        width: 640,
        height: 660,
      }
    ]
  },
  {
    id: 'pensamiento',
    code: 'CURSO:03',
    name: 'Pensamiento & Diseño',
    x: 1041,
    y: -110,
    width: 760,
    height: 730,
    accentColor: '#002FA7', // Klein blue
    items: [
      {
        id: 'dis-ensayo-01',
        x: -720,
        y: 50,
        width: 640,
        height: 660,
      },
      {
        id: 'dis-ensayo-02',
        x: 0,
        y: 120,
        width: 640,
        height: 660,
      },
      {
        id: 'dis-ensayo-03',
        x: 720,
        y: 70,
        width: 640,
        height: 660,
      }
    ]
  }
];

export const SPATIAL_DERIVAS: SpatialDeriva[] = DERIVAS_DEFINITIONS.map((deriva) => ({
  ...deriva,
  items: deriva.items.map(withSubcursoContent),
}));


// =====================================================================================
//
// ISLOTES
// Los islotes flotan siempre asociados a una deriva/curso. Son item mucho más simples
// que las derivas. Contienen menos información y no pueden incluir subderivas.
// Los islotes comparten el sistema de coordenadas de las derivas a las que están
// asociadas. Las derivas (cursos) de nivel superior utilizan coordenadas macros,
// mientras que las subderivas (subcursos) usan coodenadas locales.
// 
// =====================================================================================
export const ISLOTES_SPATIAL: IsloteSpatial[] = [
    
  // ISLOTES DEL CURSO:00 / NIVEL 1 / "EN CURSO"
  // Se muestra junto con los cursos del nivel superior
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  {
    id: 'islote-en-curso-01',
    parentId: 'en-curso',
    x: -490,
    y: 510,
    width: 420,
    height: 320,
  },

    
  // ISLOTES DEL CURSO:00 / NIVEL 2 / SUBDERIVAS "EN CURSO"
  // Se muestran asociados a las subderivas de la deriva "En Curso",
  // es decir, en la carta de navegación de segundo nivel (subcurso).
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  {
    id: 'islote-bitacora-01-01',
    parentId: 'bitacora-01',
    x: -1331,
    y: -22,
    width: 420,
    height: 320,
  },
  {
    id: 'islote-bitacora-01-02',
    parentId: 'bitacora-01',
    x: -720,
    y: -641,
    width: 386,
    height: 320,
  },
  {
    id: 'islote-bitacora-05-01',
    parentId: 'bitacora-05',
    x: -190,
    y: 1380,
    width: 400,
    height: 300,
  },
  {
    id: 'islote-bitacora-05-02',
    parentId: 'bitacora-05',
    x: 270,
    y: 1466,
    width: 400,
    height: 300,
  },
  {
    id: 'islote-bitacora-05-03',
    parentId: 'bitacora-05',
    x: 720,
    y: 1260,
    width: 400,
    height: 300,
  },
  {
    id: 'islote-bitacora-08-01',
    parentId: 'bitacora-08',
    x: 1540,
    y: -596 ,
    width: 400 ,
    height: 300,
  },
    
  // ISLOTES DEL CURSO:01 / NIVEL 1 / "ARTE ELECTRÓNICO"
  // Se muestra junto con los cursos del nivel superior
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  {
    id: 'islote-obra-00',
    parentId: 'untref-obra-01',
    x: -1440,
    y: -61,
    width: 580,
    height: 800, 
  },
    
  // ISLOTES DEL CURSO:01 / NIVEL 2 / SUBDERIVAS "ARTE ELECTRÓNICO"
  // Se muestran asociados a las subderivas de la deriva "Arte Electrónico",
  // es decir, en la carta de navegación de segundo nivel (subcurso).
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  {
    id: 'islote-obra-01',
    parentId: 'untref-obra-01',
    x: -726,
    y: -766,
    width: 220,
    height: 220,
  },
  {
    id: 'islote-obra-02',
    parentId: 'untref-obra-02',
    x: 0,
    y: -766,
    width: 340,
    height: 190,
  },
  {
    id: 'islote-obra-03',
    parentId: 'untref-obra-03',
    x: 1236,
    y: -266,
    width: 220,
    height: 220,
  },
  {
    id: 'islote-obra-04',
    parentId: 'untref-obra-04',
    x: -480,
    y: 732,
    width: 144,
    height: 144,
  },
  {
    id: 'islote-obra-05',
    parentId: 'untref-obra-05',
    x: 1100,
    y: 830,
    width: 160,
    height: 160,
  },
    

  // ISLOTES DEL CURSO:02 / NIVEL 2 / SUBDERIVAS "GENERATIVA"
  // Se muestran asociados a las subderivas de la deriva "Generativa",
  // es decir, en la carta de navegación de segundo nivel (subcurso).
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  {
    id: 'islote-generativa-01',
    parentId: 'gen-serie-01',
    x: 286,
    y: -841,
    width: 420,
    height: 320,
  },
];


