/**
 * DERIVAS
 * Estructura del sitio: los cursos, sus subcursos y los islotes, cómo se
 * relacionan entre sí (padre-hijo), su carpeta y URL, y dónde se ubican en el
 * lienzo. El contenido de cada tarjeta está en src/data/ (insulas.ts,
 * islas.ts e islotes.ts) y se vincula con esta estructura por el id.
 */

/**
 * SpatialDeriva
 * Son las derivas del nivel superior, es decir, cada uno
 * de los cursos que se muestran en el canvas principal.
 * `course` es su carpeta en public/ y el primer tramo de sus URLs.
 */
export interface SpatialDeriva {
  id: string;
  course: string;
  x: number;
  y: number;
  width: number;
  height: number;
  items: DerivaItem[];
}

/**
 * DerivaItem
 * Son las derivas de segundo nivel, es decir, cada uno
 * de los subcursos que se muestran al navegar dentro de
 * alguna de las derivas principales.
 * `subcurso` es su carpeta (/{course}/subcursos/{subcurso}/) y
 * el segundo tramo de la URL de su página (/{course}/{subcurso}/).
 */
export interface DerivaItem {
  id: string;
  subcurso: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * IsloteSpatial
 * Son un tipo especial de derivas, similares al "DerivaItem" pero
 * con una representación más simple y aislada (un islote).
 * Pueden asociarse a una deriva del primer nivel o a una subderiva
 * (a un curso principal o a un subcurso), pero se dibujan en el
 * mismo lienzo que estos, no abren nuevos subcursos o lienzos.
 * `subcurso` es el segundo tramo de la URL de su página, si la tiene.
 */
export interface IsloteSpatial {
  id: string;
  parentId: string;
  subcurso: string;
  x: number;
  y: number;
  width: number;
  height: number;
}


/**
 * Ubicacion
 * Dónde está un curso, subcurso o islote dentro de la estructura: el curso de
 * primer nivel que lo contiene (o que es), su carpeta, la URL de su página y
 * su posición y tamaño en el lienzo. Las rutas de imágenes y Markdown que no
 * empiezan con "/" se buscan en mediaFolder y contentFolder:
 *   curso    → /{course}/imagenes/ y /{course}/contenidos/
 *   subcurso → /{course}/subcursos/{subcurso}/medios/ y .../contenidos/
 *   islote   → las carpetas de su curso
 */
export interface Ubicacion {
  derivaId: string;
  course: string;
  subcurso?: string;
  mediaFolder: string;
  contentFolder: string;
  pageUrl?: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export function ubicar(id: string): Ubicacion {
  for (const deriva of SPATIAL_DERIVAS) {
    const base = { derivaId: deriva.id, course: deriva.course };

    if (deriva.id === id) {
      const { x, y, width, height } = deriva;
      return { ...base, mediaFolder: `/${deriva.course}/imagenes`, contentFolder: `/${deriva.course}/contenidos`, x, y, width, height };
    }

    const item = deriva.items.find((entry) => entry.id === id);
    if (item) {
      const { x, y, width, height } = item;
      const folder = `/${deriva.course}/subcursos/${item.subcurso}`;
      return {
        ...base,
        subcurso: item.subcurso,
        mediaFolder: `${folder}/medios`,
        contentFolder: `${folder}/contenidos`,
        pageUrl: `/${deriva.course}/${item.subcurso}/`,
        x, y, width, height,
      };
    }
  }

  const islote = ISLOTES_SPATIAL.find((entry) => entry.id === id);
  if (islote) {
    const parent = ubicar(islote.parentId);
    const { x, y, width, height } = islote;
    return {
      derivaId: parent.derivaId,
      course: parent.course,
      subcurso: islote.subcurso,
      mediaFolder: `/${parent.course}/imagenes`,
      contentFolder: `/${parent.course}/contenidos`,
      pageUrl: `/${parent.course}/${islote.subcurso}/`,
      x, y, width, height,
    };
  }

  throw new Error(`No se encontró en Derivas.ts ningún curso, subcurso o islote con id "${id}"`);
}


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

export const SPATIAL_DERIVAS: SpatialDeriva[] = [
  {
    id: 'en-curso',
    course: 'curso00',
    x: 200,
    y: 20,
    width: 740,
    height: 730,
    items: [
      {
        id: 'bitacora-01',
        subcurso: 'curso001',
        x: -720,
        y: 20,
        width: 640,
        height: 660,
      },
      {
        id: 'bitacora-02',
        subcurso: 'curso002',
        x: -20,
        y: -250,
        width: 640,
        height: 660,
      },
      {
        id: 'bitacora-03',
        subcurso: 'curso003',
        x: 710,
        y: -190,
        width: 640,
        height: 660,
      },
      {
        id: 'bitacora-04',
        subcurso: 'curso004',
        x: -780,
        y: 840,
        width: 640,
        height: 660,
      },
      {
        id: 'bitacora-05',
        subcurso: 'curso005',
        x: 22,
        y: 600,
        width: 640,
        height: 660,
      },
      {
        id: 'bitacora-06',
        subcurso: 'curso006',
        x: 750,
        y: 620,
        width: 640,
        height: 660,
      },
      {
        id: 'bitacora-07',
        subcurso: 'curso007',
        x: 1450,
        y: 120,
        width: 640,
        height: 660,
      },
      {
        id: 'bitacora-08',
        subcurso: 'curso008',
        x: 2186,
        y: -126,
        width: 640,
        height: 660,
      },
    ]
  },
  {
    id: 'untref',
    course: 'curso01',
    x: -641,
    y: -270,
    width: 760,
    height: 730,
    items: [
      {
        id: 'untref-obra-01',
        subcurso: 'curso001',
        x: -720,
        y: -30,
        width: 640,
        height: 660,
      },
      {
        id: 'untref-obra-02',
        subcurso: 'curso002',
        x: 0,
        y: -220,
        width: 640,
        height: 660,
      },
      {
        id: 'untref-obra-03',
        subcurso: 'curso003',
        x: 720,
        y: -260,
        width: 640,
        height: 660,
      },
      {
        id: 'untref-obra-04',
        subcurso: 'curso004',
        x: -20,
        y: 560,
        width: 560,
        height: 580,
      },
      {
        id: 'untref-obra-05',
        subcurso: 'curso005',
        x: 660,
        y: 860,
        width: 560,
        height: 580,
      }
    ]
  },
  {
    id: 'generativa',
    course: 'curso02',
    x: -1511,
    y: -11,
    width: 760,
    height: 730,

    items: [
      {
        id: 'gen-serie-01',
        subcurso: 'curso001',
        x: -2000,
        y: -60,
        width: 640,
        height: 660,
      },
      {
        id: 'gen-serie-02',
        subcurso: 'curso002',
        x: -1200,
        y: 80,
        width: 640,
        height: 660,
      },
      {
        id: 'gen-serie-03',
        subcurso: 'curso003',
        x: -400,
        y: -40,
        width: 640,
        height: 660,
      },
      {
        id: 'gen-serie-04',
        subcurso: 'curso004',
        x: 400,
        y: 100,
        width: 640,
        height: 660,
      },
      {
        id: 'gen-serie-05',
        subcurso: 'curso005',
        x: 1200,
        y: -20,
        width: 640,
        height: 660,
      },
      {
        id: 'gen-serie-06',
        subcurso: 'curso006',
        x: 2000,
        y: 70,
        width: 640,
        height: 660,
      }
    ]
  },
  {
    id: 'pensamiento',
    course: 'curso03',
    x: 1041,
    y: -110,
    width: 760,
    height: 730,
    items: [
      {
        id: 'dis-ensayo-01',
        subcurso: 'curso001',
        x: -720,
        y: 50,
        width: 640,
        height: 660,
      },
      {
        id: 'dis-ensayo-02',
        subcurso: 'curso002',
        x: 0,
        y: 120,
        width: 640,
        height: 660,
      },
      {
        id: 'dis-ensayo-03',
        subcurso: 'curso003',
        x: 720,
        y: 70,
        width: 640,
        height: 660,
      }
    ]
  }
];


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
    subcurso: 'islote001',
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
    subcurso: 'islote006',
    x: -1331,
    y: -22,
    width: 420,
    height: 320,
  },
  {
    id: 'islote-bitacora-01-02',
    parentId: 'bitacora-01',
    subcurso: 'islote013',
    x: -720,
    y: -641,
    width: 386,
    height: 320,
  },
  {
    id: 'islote-bitacora-05-01',
    parentId: 'bitacora-05',
    subcurso: 'islote003',
    x: -190,
    y: 1380,
    width: 400,
    height: 300,
  },
  {
    id: 'islote-bitacora-05-02',
    parentId: 'bitacora-05',
    subcurso: 'islote004',
    x: 270,
    y: 1466,
    width: 400,
    height: 300,
  },
  {
    id: 'islote-bitacora-05-03',
    parentId: 'bitacora-05',
    subcurso: 'islote005',
    x: 720,
    y: 1260,
    width: 400,
    height: 300,
  },
  {
    id: 'islote-bitacora-08-01',
    parentId: 'bitacora-08',
    subcurso: 'islote014',
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
    subcurso: 'islote007',
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
    subcurso: 'islote008',
    x: -726,
    y: -766,
    width: 220,
    height: 220,
  },
  {
    id: 'islote-obra-02',
    parentId: 'untref-obra-02',
    subcurso: 'islote009',
    x: 0,
    y: -766,
    width: 340,
    height: 190,
  },
  {
    id: 'islote-obra-03',
    parentId: 'untref-obra-03',
    subcurso: 'islote010',
    x: 1236,
    y: -266,
    width: 220,
    height: 220,
  },
  {
    id: 'islote-obra-04',
    parentId: 'untref-obra-04',
    subcurso: 'islote011',
    x: -480,
    y: 732,
    width: 144,
    height: 144,
  },
  {
    id: 'islote-obra-05',
    parentId: 'untref-obra-05',
    subcurso: 'islote012',
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
    subcurso: 'islote002',
    x: 286,
    y: -841,
    width: 420,
    height: 320,
  },
];



