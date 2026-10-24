/**
 * DERIVAS
 * Estructura del sitio: los cursos, sus subcursos y los islotes, cómo se
 * relacionan entre sí (padre-hijo), su carpeta y URL, y dónde se ubican en el
 * lienzo. El contenido de cada tarjeta está en src/data/ (insulas.ts,
 * islas.ts e islotes.ts) y se vincula con esta estructura por el id.
 */

/**
 * DerivaInsula
 * Son las derivas del nivel superior, es decir, cada uno
 * de los cursos que se muestran en el canvas principal.
 * `curso` es su carpeta en public/ y el primer tramo de sus URLs.
 */
export interface DerivaInsula {
  id: string;
  curso: string;
  x: number;
  y: number;
  ancho: number;
  alto: number;
  subcursos: DerivaIsla[];
}

/**
 * DerivaIsla
 * Son las derivas de segundo nivel, es decir, cada uno
 * de los subcursos que se muestran al navegar dentro de
 * alguna de las derivas principales.
 * `subcurso` es su carpeta (/{curso}/subcursos/{subcurso}/) y
 * el segundo tramo de la URL de su página (/{curso}/{subcurso}/).
 */
export interface DerivaIsla {
  id: string;
  subcurso: string;
  x: number;
  y: number;
  ancho: number;
  alto: number;
}

/**
 * DerivaIslote
 * Son un tipo especial de derivas, similares al "DerivaIsla" pero
 * con una representación más simple y aislada (un islote).
 * Pueden asociarse a una deriva del primer nivel o a una subderiva
 * (a un curso principal o a un subcurso), pero se dibujan en el
 * mismo lienzo que estos, no abren nuevos subcursos o lienzos.
 * `subcurso` es el segundo tramo de la URL de su página, si la tiene.
 */
export interface DerivaIslote {
  id: string;
  idSuperior: string;
  subcurso: string;
  x: number;
  y: number;
  ancho: number;
  alto: number;
}


/**
 * Ubicacion
 * Dónde está un curso, subcurso o islote dentro de la estructura: el curso de
 * primer nivel que lo contiene (o que es), su carpeta, la URL de su página y
 * su posición y tamaño en el lienzo. Las rutas de imágenes y Markdown que no
 * empiezan con "/" se buscan en carpetaMedios y carpetaContenidos:
 *   curso    → /{curso}/imagenes/ y /{curso}/contenidos/
 *   subcurso → /{curso}/subcursos/{subcurso}/medios/ y .../contenidos/
 *   islote   → las carpetas de su curso
 */
export interface Ubicacion {
  idDeriva: string;
  curso: string;
  subcurso?: string;
  carpetaMedios: string;
  carpetaContenidos: string;
  urlPagina?: string;
  x: number;
  y: number;
  ancho: number;
  alto: number;
}

export function ubicar(id: string): Ubicacion {
  for (const deriva of DERIVAS_INSULAS) {
    const base = { idDeriva: deriva.id, curso: deriva.curso };

    if (deriva.id === id) {
      const { x, y, ancho, alto } = deriva;
      return {
        ...base,
        carpetaMedios: `/${deriva.curso}/imagenes`,
        carpetaContenidos: `/${deriva.curso}/contenidos`,
        x, y, ancho, alto,
      };
    }

    const isla = deriva.subcursos.find((entrada) => entrada.id === id);
    if (isla) {
      const { x, y, ancho, alto } = isla;
      const carpeta = `/${deriva.curso}/subcursos/${isla.subcurso}`;
      return {
        ...base,
        subcurso: isla.subcurso,
        carpetaMedios: `${carpeta}/medios`,
        carpetaContenidos: `${carpeta}/contenidos`,
        urlPagina: `/${deriva.curso}/${isla.subcurso}/`,
        x, y, ancho, alto,
      };
    }
  }

  const islote = DERIVAS_ISLOTES.find((entrada) => entrada.id === id);
  if (islote) {
    const superior = ubicar(islote.idSuperior);
    const { x, y, ancho, alto } = islote;
    return {
      idDeriva: superior.idDeriva,
      curso: superior.curso,
      subcurso: islote.subcurso,
      carpetaMedios: `/${superior.curso}/imagenes`,
      carpetaContenidos: `/${superior.curso}/contenidos`,
      urlPagina: `/${superior.curso}/${islote.subcurso}/`,
      x, y, ancho, alto,
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

export const DERIVAS_INSULAS: DerivaInsula[] = [
  {
    id: 'en-curso',
    curso: 'curso00',
    x: 200,
    y: 20,
    ancho: 740,
    alto: 730,
    subcursos: [
      {
        id: 'bitacora-01',
        subcurso: 'curso001',
        x: -720,
        y: 20,
        ancho: 640,
        alto: 660,
      },
      {
        id: 'bitacora-02',
        subcurso: 'curso002',
        x: -20,
        y: -250,
        ancho: 640,
        alto: 660,
      },
      {
        id: 'bitacora-03',
        subcurso: 'curso003',
        x: 710,
        y: -190,
        ancho: 640,
        alto: 660,
      },
      {
        id: 'bitacora-04',
        subcurso: 'curso004',
        x: -780,
        y: 840,
        ancho: 640,
        alto: 660,
      },
      {
        id: 'bitacora-05',
        subcurso: 'curso005',
        x: 22,
        y: 600,
        ancho: 640,
        alto: 660,
      },
      {
        id: 'bitacora-06',
        subcurso: 'curso006',
        x: 750,
        y: 620,
        ancho: 640,
        alto: 660,
      },
      {
        id: 'bitacora-07',
        subcurso: 'curso007',
        x: 1450,
        y: 120,
        ancho: 640,
        alto: 660,
      },
      {
        id: 'bitacora-08',
        subcurso: 'curso008',
        x: 2186,
        y: -126,
        ancho: 640,
        alto: 660,
      },
    ]
  },
  {
    id: 'untref',
    curso: 'curso01',
    x: -641,
    y: -270,
    ancho: 760,
    alto: 730,
    subcursos: [
      {
        id: 'untref-obra-01',
        subcurso: 'curso001',
        x: -720,
        y: -30,
        ancho: 640,
        alto: 660,
      },
      {
        id: 'untref-obra-02',
        subcurso: 'curso002',
        x: 0,
        y: -220,
        ancho: 640,
        alto: 660,
      },
      {
        id: 'untref-obra-03',
        subcurso: 'curso003',
        x: 720,
        y: -260,
        ancho: 640,
        alto: 660,
      },
      {
        id: 'untref-obra-04',
        subcurso: 'curso004',
        x: -20,
        y: 560,
        ancho: 560,
        alto: 580,
      },
      {
        id: 'untref-obra-05',
        subcurso: 'curso005',
        x: 660,
        y: 860,
        ancho: 560,
        alto: 580,
      }
    ]
  },
  {
    id: 'generativa',
    curso: 'curso02',
    x: -1511,
    y: -11,
    ancho: 760,
    alto: 730,

    subcursos: [
      {
        id: 'gen-serie-01',
        subcurso: 'curso001',
        x: -2000,
        y: -60,
        ancho: 640,
        alto: 660,
      },
      {
        id: 'gen-serie-02',
        subcurso: 'curso002',
        x: -1200,
        y: 80,
        ancho: 640,
        alto: 660,
      },
      {
        id: 'gen-serie-03',
        subcurso: 'curso003',
        x: -400,
        y: -40,
        ancho: 640,
        alto: 660,
      },
      {
        id: 'gen-serie-04',
        subcurso: 'curso004',
        x: 400,
        y: 100,
        ancho: 640,
        alto: 660,
      },
      {
        id: 'gen-serie-05',
        subcurso: 'curso005',
        x: 1200,
        y: -20,
        ancho: 640,
        alto: 660,
      },
      {
        id: 'gen-serie-06',
        subcurso: 'curso006',
        x: 2000,
        y: 70,
        ancho: 640,
        alto: 660,
      }
    ]
  },
  {
    id: 'pensamiento',
    curso: 'curso03',
    x: 1041,
    y: -110,
    ancho: 760,
    alto: 730,
    subcursos: [
      {
        id: 'dis-ensayo-01',
        subcurso: 'curso001',
        x: -720,
        y: 50,
        ancho: 640,
        alto: 660,
      },
      {
        id: 'dis-ensayo-02',
        subcurso: 'curso002',
        x: 0,
        y: 120,
        ancho: 640,
        alto: 660,
      },
      {
        id: 'dis-ensayo-03',
        subcurso: 'curso003',
        x: 720,
        y: 70,
        ancho: 640,
        alto: 660,
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
export const DERIVAS_ISLOTES: DerivaIslote[] = [
    
  // ISLOTES DEL CURSO:00 / NIVEL 1 / "EN CURSO"
  // Se muestra junto con los cursos del nivel superior
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  {
    id: 'islote-en-curso-01',
    idSuperior: 'en-curso',
    subcurso: 'islote001',
    x: -490,
    y: 510,
    ancho: 420,
    alto: 320,
  },

    
  // ISLOTES DEL CURSO:00 / NIVEL 2 / SUBDERIVAS "EN CURSO"
  // Se muestran asociados a las subderivas de la deriva "En Curso",
  // es decir, en la carta de navegación de segundo nivel (subcurso).
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  {
    id: 'islote-bitacora-01-01',
    idSuperior: 'bitacora-01',
    subcurso: 'islote006',
    x: -1331,
    y: -22,
    ancho: 420,
    alto: 320,
  },
  {
    id: 'islote-bitacora-01-02',
    idSuperior: 'bitacora-01',
    subcurso: 'islote013',
    x: -720,
    y: -641,
    ancho: 386,
    alto: 320,
  },
  {
    id: 'islote-bitacora-05-01',
    idSuperior: 'bitacora-05',
    subcurso: 'islote003',
    x: -190,
    y: 1380,
    ancho: 400,
    alto: 300,
  },
  {
    id: 'islote-bitacora-05-02',
    idSuperior: 'bitacora-05',
    subcurso: 'islote004',
    x: 270,
    y: 1466,
    ancho: 400,
    alto: 300,
  },
  {
    id: 'islote-bitacora-05-03',
    idSuperior: 'bitacora-05',
    subcurso: 'islote005',
    x: 720,
    y: 1260,
    ancho: 400,
    alto: 300,
  },
  {
    id: 'islote-bitacora-08-01',
    idSuperior: 'bitacora-08',
    subcurso: 'islote014',
    x: 1540,
    y: -596 ,
    ancho: 400 ,
    alto: 300,
  },
    
  // ISLOTES DEL CURSO:01 / NIVEL 1 / "ARTE ELECTRÓNICO"
  // Se muestra junto con los cursos del nivel superior
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  {
    id: 'islote-obra-00',
    idSuperior: 'untref-obra-01',
    subcurso: 'islote007',
    x: -1440,
    y: -61,
    ancho: 580,
    alto: 800, 
  },
    
  // ISLOTES DEL CURSO:01 / NIVEL 2 / SUBDERIVAS "ARTE ELECTRÓNICO"
  // Se muestran asociados a las subderivas de la deriva "Arte Electrónico",
  // es decir, en la carta de navegación de segundo nivel (subcurso).
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  {
    id: 'islote-obra-01',
    idSuperior: 'untref-obra-01',
    subcurso: 'islote008',
    x: -726,
    y: -766,
    ancho: 220,
    alto: 220,
  },
  {
    id: 'islote-obra-02',
    idSuperior: 'untref-obra-02',
    subcurso: 'islote009',
    x: 0,
    y: -766,
    ancho: 340,
    alto: 190,
  },
  {
    id: 'islote-obra-03',
    idSuperior: 'untref-obra-03',
    subcurso: 'islote010',
    x: 1236,
    y: -266,
    ancho: 220,
    alto: 220,
  },
  {
    id: 'islote-obra-04',
    idSuperior: 'untref-obra-04',
    subcurso: 'islote011',
    x: -480,
    y: 732,
    ancho: 144,
    alto: 144,
  },
  {
    id: 'islote-obra-05',
    idSuperior: 'untref-obra-05',
    subcurso: 'islote012',
    x: 1100,
    y: 830,
    ancho: 160,
    alto: 160,
  },
    

  // ISLOTES DEL CURSO:02 / NIVEL 2 / SUBDERIVAS "GENERATIVA"
  // Se muestran asociados a las subderivas de la deriva "Generativa",
  // es decir, en la carta de navegación de segundo nivel (subcurso).
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  {
    id: 'islote-generativa-01',
    idSuperior: 'gen-serie-01',
    subcurso: 'islote002',
    x: 286,
    y: -841,
    ancho: 420,
    alto: 320,
  },
];



