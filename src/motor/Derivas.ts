/**
 * DERIVAS
 * Estructura del sitio: los cursos, sus subcursos y los islotes, cómo se
 * relacionan entre sí (padre-hijo), su carpeta y URL, y dónde se ubican en el
 * lienzo. El contenido de cada tarjeta está en src/data/ (insulas.ts,
 * islas.ts e islotes.ts) y se vincula con esta estructura por el id.
 */
import { INSULAS } from '../data/insulas';
import { ISLAS } from '../data/islas';

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

// La URL propia de la página de una isla, si la tiene (pageUrl).
export function urlPropia(id: string): string | undefined {
  const pageUrl = ISLAS.find((isla) => isla.id === id)?.pageUrl;
  if (!pageUrl) return undefined;
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(pageUrl)) {
    throw new Error(`La pageUrl "${pageUrl}" de "${id}" (src/data/islas.ts) solo puede tener minúsculas, números y guiones, sin barras`);
  }
  return `/${pageUrl}/`;
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
        // La URL propia de la isla (pageUrl, en src/data/islas.ts), si tiene.
        urlPagina: urlPropia(id) ?? `/${deriva.curso}/${isla.subcurso}/`,
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
    x: -780,
    y: 1458,
    ancho: 740,
    alto: 759,
    subcursos: [
      {
        id: 'bitacora-01',
        subcurso: 'curso001',
        x: -720,
        y: 20,
        ancho: 640,
        alto: 801,
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
        alto: 801,
      },
      {
        id: 'bitacora-04',
        subcurso: 'curso004',
        x: -780,
        y: 840,
        ancho: 640,
        alto: 716,
      },
      {
        id: 'bitacora-05',
        subcurso: 'curso005',
        x: 10,
        y: 664,
        ancho: 640,
        alto: 1048,
      },
      {
        id: 'bitacora-06',
        subcurso: 'curso006',
        x: 750,
        y: 637,
        ancho: 640,
        alto: 732,
      },
      {
        id: 'bitacora-07',
        subcurso: 'curso007',
        x: 1450,
        y: 120,
        ancho: 640,
        alto: 860,
      },
      {
        id: 'bitacora-08',
        subcurso: 'curso008',
        x: 2186,
        y: -126,
        ancho: 640,
        alto: 863,
      },
      {
        id: 'bitacora-09',
        subcurso: 'curso009',
        x: 2216,
        y: 857,
        ancho: 640,
        alto: 982,
      },
    ]
  },
  {
    // Reflotada (src/data/insulas.ts): sus islas y los islotes de éstas están
    // en el lienzo principal, con coordenadas relativas a esta ínsula.
    id: 'arte-electronico',
    curso: 'curso01',
    x: 0,
    y: 0,
    ancho: 760,
    alto: 899,
    subcursos: [
      {
        id: 'arte-electronico-01',
        subcurso: 'curso001',
        x: -840,
        y: 424,
        ancho: 640,
        alto: 1148,
      },
      {
        id: 'arte-electronico-02',
        subcurso: 'curso002',
        x: -1620,
        y: 20,
        ancho: 640,
        alto: 738,
      },
      {
        id: 'arte-electronico-03',
        subcurso: 'curso003',
        x: -2400,
        y: 364,
        ancho: 640,
        alto: 1026,
      },
      {
        id: 'arte-electronico-04',
        subcurso: 'curso004',
        x: -3100,
        y: 788,
        ancho: 560,
        alto: 673,
      },
      {
        id: 'arte-electronico-05',
        subcurso: 'curso005',
        x: -3100,
        y: -172,
        ancho: 560,
        alto: 1008,
      }
    ]
  },
  {
    id: 'generativa',
    curso: 'curso02',
    x: -1620,
    y: 1004,
    ancho: 760,
    alto: 1069,

    subcursos: [
      {
        id: 'gen-serie-01',
        subcurso: 'curso001',
        x: -2000,
        y: -60,
        ancho: 640,
        alto: 1390,
      },
      {
        id: 'gen-serie-02',
        subcurso: 'curso002',
        x: -1200,
        y: 80,
        ancho: 640,
        alto: 1365,
      },
      {
        id: 'gen-serie-03',
        subcurso: 'curso003',
        x: -400,
        y: -40,
        ancho: 640,
        alto: 1390,
      },
      {
        id: 'gen-serie-04',
        subcurso: 'curso004',
        x: 400,
        y: 100,
        ancho: 640,
        alto: 1366,
      },
      {
        id: 'gen-serie-05',
        subcurso: 'curso005',
        x: 1200,
        y: -20,
        ancho: 640,
        alto: 1421,
      },
      {
        id: 'gen-serie-06',
        subcurso: 'curso006',
        x: 2000,
        y: 70,
        ancho: 640,
        alto: 1366,
      }
    ]
  },
  {
    id: 'pensamiento',
    curso: 'curso03',
    x: -2560,
    y: 1594,
    ancho: 760,
    alto: 780,
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
        alto: 1153,
      },
      {
        id: 'dis-ensayo-03',
        subcurso: 'curso003',
        x: 720,
        y: 70,
        ancho: 640,
        alto: 762,
      }
    ]
  }
];

// =====================================================================================
//
// ÍNSULAS REFLOTADAS
// Una ínsula con refloated: true (src/data/insulas.ts) no tiene lienzo propio:
// sus islas y los islotes de éstas se muestran en el lienzo principal, junto a
// ella. Sus coordenadas se escriben relativas al centro de la ínsula, así que
// al mover la ínsula se mueve todo el conjunto.
//
// =====================================================================================

export function estaReflotada(idInsula: string): boolean {
  return Boolean(INSULAS.find((insula) => insula.id === idInsula)?.refloated);
}


// Posición en el lienzo principal de una isla o un islote que salen a flote
// con una ínsula reflotada, o null si no salen a flote.
export function posicionReflotada(item: { id: string; x: number; y: number; idSuperior?: string }): { x: number; y: number } | null {
  const idIsla = item.idSuperior ?? item.id;
  const deriva = DERIVAS_REFLOTADAS.find((entrada) => entrada.subcursos.some((isla) => isla.id === idIsla));
  return deriva ? { x: deriva.x + item.x, y: deriva.y + item.y } : null;
}

// Todos los subcursos (islas) de todos los cursos, en una sola lista. Cada uno
// se define dentro de su curso, en el campo `subcursos` de DERIVAS_INSULAS.
export const DERIVAS_ISLAS: DerivaIsla[] = DERIVAS_INSULAS.flatMap((deriva) => deriva.subcursos);

export const DERIVAS_REFLOTADAS: DerivaInsula[] = DERIVAS_INSULAS.filter((deriva) => estaReflotada(deriva.id));


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
    x: -1470,
    y: 1948,
    ancho: 420,
    alto: 386,
  },

    
  // ISLOTES DEL CURSO:00 / NIVEL 2 / SUBDERIVAS "EN CURSO"
  // Se muestran asociados a las subderivas de la deriva "En Curso",
  // es decir, en la carta de navegación de segundo nivel (subcurso).
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  {
    id: 'islote-bitacora-01-01',
    idSuperior: 'bitacora-01',
    subcurso: 'islote006',
    x: -1370,
    y: -22,
    ancho: 420,
    alto: 1172,
  },
  {
    id: 'islote-bitacora-01-02',
    idSuperior: 'bitacora-01',
    subcurso: 'islote013',
    x: -720,
    y: -699,
    ancho: 386,
    alto: 516,
  },
  {
    id: 'islote-bitacora-05-01',
    idSuperior: 'bitacora-05',
    subcurso: 'islote003',
    x: -200,
    y: 1464,
    ancho: 400,
    alto: 431,
  },
  {
    id: 'islote-bitacora-05-02',
    idSuperior: 'bitacora-05',
    subcurso: 'islote004',
    x: 260,
    y: 1530,
    ancho: 400,
    alto: 410,
  },
  {
    id: 'islote-bitacora-05-03',
    idSuperior: 'bitacora-05',
    subcurso: 'islote005',
    x: 720,
    y: 1324,
    ancho: 400,
    alto: 393,
  },
  {
    id: 'islote-bitacora-08-01',
    idSuperior: 'bitacora-08',
    subcurso: 'islote014',
    x: 1540,
    y: -651 ,
    ancho: 400 ,
    alto: 561,
  },
    
  // ISLOTES DEL CURSO:01 / NIVEL 1 / "ARTE ELECTRÓNICO"
  // Se muestra junto con los cursos del nivel superior
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  {
    id: 'islote-obra-00',
    idSuperior: 'arte-electronico-01',
    subcurso: 'islote007',
    x: 0,
    y: 1122,
    ancho: 580,
    alto: 1105, 
  },
    
  // ISLOTES DEL CURSO:01 / NIVEL 2 / SUBDERIVAS "ARTE ELECTRÓNICO"
  // Se muestran asociados a las subderivas de la deriva "Arte Electrónico",
  // es decir, en la carta de navegación de segundo nivel (subcurso).
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  {
    id: 'islote-obra-01',
    idSuperior: 'arte-electronico-01',
    subcurso: 'islote008',
    x: -840,
    y: -380,
    ancho: 220,
    alto: 220,
  },
  {
    id: 'islote-obra-02',
    idSuperior: 'arte-electronico-02',
    subcurso: 'islote009',
    x: -1620,
    y: -575,
    ancho: 340,
    alto: 212,
  },
  {
    id: 'islote-obra-03',
    idSuperior: 'arte-electronico-03',
    subcurso: 'islote010',
    x: -2400,
    y: -379,
    ancho: 220,
    alto: 220,
  },
  {
    id: 'islote-obra-04',
    idSuperior: 'arte-electronico-04',
    subcurso: 'islote011',
    x: -3100,
    y: 1276,
    ancho: 144,
    alto: 144,
  },
  {
    id: 'islote-obra-05',
    idSuperior: 'arte-electronico-05',
    subcurso: 'islote012',
    x: -3560,
    y: -172,
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
    alto: 391,
  },
];



