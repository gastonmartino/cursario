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
  const pageUrl = (ISLAS.find((isla) => isla.id === id) ?? INSULAS.find((insula) => insula.id === id))?.pageUrl;
  if (!pageUrl) return undefined;
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(pageUrl)) {
    throw new Error(`La pageUrl "${pageUrl}" de "${id}" (src/data/) solo puede tener minúsculas, números y guiones, sin barras`);
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
        // La página editorial de la ínsula, si tiene (pageMarkdownFile).
        urlPagina: urlPropia(id) ?? `/${deriva.curso}/`,
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
    y: 1487,
    ancho: 740,
    alto: 805,
    subcursos: [
      {
        id: 'bitacora-01',
        subcurso: 'curso001',
        x: -720,
        y: 90,
        ancho: 640,
        alto: 811,
      },
      {
        id: 'bitacora-02',
        subcurso: 'curso002',
        x: -20,
        y: -250,
        ancho: 640,
        alto: 688,
      },
      {
        id: 'bitacora-03',
        subcurso: 'curso003',
        x: 710,
        y: -190,
        ancho: 640,
        alto: 916,
      },
      {
        id: 'bitacora-04',
        subcurso: 'curso004',
        x: -780,
        y: 957,
        ancho: 640,
        alto: 764,
      },
      {
        id: 'bitacora-05',
        subcurso: 'curso005',
        x: 10,
        y: 775,
        ancho: 640,
        alto: 1201,
      },
      {
        id: 'bitacora-06',
        subcurso: 'curso006',
        x: 750,
        y: 754,
        ancho: 640,
        alto: 812,
      },
      {
        id: 'bitacora-07',
        subcurso: 'curso007',
        x: 1450,
        y: 134,
        ancho: 640,
        alto: 863,
      },
      {
        id: 'bitacora-08',
        subcurso: 'curso008',
        x: 2186,
        y: -126,
        ancho: 640,
        alto: 995,
      },
      {
        id: 'bitacora-09',
        subcurso: 'curso009',
        x: 1450,
        y: 1186,
        ancho: 640,
        alto: 1082,
      },
      {
        id: 'bitacora-10',
        subcurso: 'curso010',
        x: 2186,
        y: 960,
        ancho: 640,
        alto: 1017,
      },
      {
        id: 'bitacora-11',
        subcurso: 'curso011',
        x: 2922,
        y: 11,
        ancho: 640,
        alto: 840,
      },
      {
        id: 'bitacora-12',
        subcurso: 'curso012',
        x: 2922,
        y: 1202,
        ancho: 640,
        alto: 1382,
      },
      {
        id: 'bitacora-13',
        subcurso: 'curso013',
        x: 3658,
        y: 180,
        ancho: 640,
        alto: 1018,
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
    alto: 1065,
    subcursos: [
      {
        // Debajo de Nueva Toninas (Expediente 11/26). Va primera para que el
        // recorrido desde la ínsula no cruce todo el lienzo.
        id: 'arte-electronico-06',
        subcurso: 'curso006',
        x: 900,
        y: 1335,
        ancho: 640,
        alto: 842,
      },
      {
        id: 'arte-electronico-01',
        subcurso: 'curso001',
        x: -840,
        y: 424,
        ancho: 640,
        alto: 1161,
      },
      {
        id: 'arte-electronico-02',
        subcurso: 'curso002',
        x: -1620,
        y: 20,
        ancho: 640,
        alto: 744,
      },
      {
        id: 'arte-electronico-03',
        subcurso: 'curso003',
        x: -2400,
        y: 343,
        ancho: 640,
        alto: 1061,
      },
      {
        id: 'arte-electronico-04',
        subcurso: 'curso004',
        x: -3200,
        y: 788,
        ancho: 560,
        alto: 679,
      },
      {
        id: 'arte-electronico-05',
        subcurso: 'curso005',
        x: -3100,
        y: -172,
        ancho: 560,
        alto: 1042,
      }
    ]
  },
  {
    id: 'generativa',
    curso: 'curso02',
    x: -1620,
    y: 1004,
    ancho: 760,
    alto: 1082,

    subcursos: [
      // Generado por la disposición del lienzo de la DERIVA:02: partes en filas,
      // capítulos de izquierda a derecha (ver la página editorial).
      {
        id: 'gen-cap01',
        subcurso: 'curso007',
        x: -2693,
        y: -2042,
        ancho: 400,
        alto: 901,
      },
      {
        id: 'gen-cap02-haemolacria',
        subcurso: 'curso008',
        x: -2173,
        y: -2030,
        ancho: 400,
        alto: 927,
      },
      {
        id: 'gen-serie-03',
        subcurso: 'curso003',
        x: -1733,
        y: -1979,
        ancho: 400,
        alto: 1028,
      },
      {
        id: 'gen-cap02-aigrette',
        subcurso: 'curso009',
        x: -1293,
        y: -2030,
        ancho: 400,
        alto: 926,
      },
      {
        id: 'gen-cap02-three-body',
        subcurso: 'curso010',
        x: -853,
        y: -2030,
        ancho: 400,
        alto: 927,
      },
      {
        id: 'gen-serie-04',
        subcurso: 'curso004',
        x: -2173,
        y: -911,
        ancho: 400,
        alto: 1028,
      },
      {
        id: 'gen-cap02-battle',
        subcurso: 'curso011',
        x: -1733,
        y: -962,
        ancho: 400,
        alto: 926,
      },
      {
        id: 'gen-cap02-ointment',
        subcurso: 'curso012',
        x: -1293,
        y: -948,
        ancho: 400,
        alto: 955,
      },
      {
        id: 'gen-cap02-neural-rhythm',
        subcurso: 'curso013',
        x: -853,
        y: -934,
        ancho: 400,
        alto: 982,
      },
      {
        id: 'gen-cap03',
        subcurso: 'curso014',
        x: -333,
        y: -2002,
        ancho: 400,
        alto: 983,
      },
      {
        id: 'gen-cap04-blood-moon',
        subcurso: 'curso015',
        x: 187,
        y: -2007,
        ancho: 400,
        alto: 972,
      },
      {
        id: 'gen-cap04-inequalities',
        subcurso: 'curso016',
        x: 627,
        y: -2022,
        ancho: 400,
        alto: 943,
      },
      {
        id: 'gen-cap04-false-northing',
        subcurso: 'curso017',
        x: 187,
        y: -1009,
        ancho: 400,
        alto: 944,
      },
      {
        id: 'gen-cap04-mboi-tata',
        subcurso: 'curso018',
        x: 627,
        y: -1032,
        ancho: 400,
        alto: 897,
      },
      {
        id: 'gen-serie-01',
        subcurso: 'curso001',
        x: 1147,
        y: -1974,
        ancho: 400,
        alto: 1038,
      },
      {
        id: 'gen-serie-05',
        subcurso: 'curso005',
        x: 1667,
        y: -1942,
        ancho: 400,
        alto: 1101,
      },
      {
        id: 'gen-cap07',
        subcurso: 'curso019',
        x: 2693,
        y: -2038,
        ancho: 400,
        alto: 910,
      },
      {
        id: 'gen-cap08-pormenores',
        subcurso: 'curso020',
        x: -2693,
        y: 665,
        ancho: 400,
        alto: 992,
      },
      {
        id: 'gen-cap08-green-velvet',
        subcurso: 'curso021',
        x: -2253,
        y: 609,
        ancho: 400,
        alto: 880,
      },
      {
        id: 'gen-cap09',
        subcurso: 'curso022',
        x: -1733,
        y: 638,
        ancho: 400,
        alto: 937,
      },
      {
        id: 'gen-cap10',
        subcurso: 'curso023',
        x: -1213,
        y: 638,
        ancho: 400,
        alto: 937,
      },
      {
        id: 'gen-cap11-windowsill',
        subcurso: 'curso024',
        x: -7,
        y: 679,
        ancho: 400,
        alto: 1020,
      },
      {
        id: 'gen-serie-06',
        subcurso: 'curso006',
        x: 433,
        y: 660,
        ancho: 400,
        alto: 982,
      },
      {
        id: 'gen-cap12',
        subcurso: 'curso025',
        x: 953,
        y: 610,
        ancho: 400,
        alto: 882,
      },
      {
        id: 'gen-cap13',
        subcurso: 'curso026',
        x: 2145,
        y: 638,
        ancho: 400,
        alto: 937,
      },
      {
        id: 'gen-cap14-la-noria',
        subcurso: 'curso027',
        x: -2693,
        y: 2210,
        ancho: 400,
        alto: 909,
      },
      {
        id: 'gen-cap14-struggle',
        subcurso: 'curso028',
        x: -2253,
        y: 2223,
        ancho: 400,
        alto: 936,
      },
      {
        id: 'gen-cap15',
        subcurso: 'curso029',
        x: -1733,
        y: 2224,
        ancho: 400,
        alto: 937,
      },
      {
        id: 'gen-cap16-scaffolded',
        subcurso: 'curso030',
        x: -1033,
        y: 2210,
        ancho: 400,
        alto: 909,
      },
      {
        id: 'gen-cap16-kite',
        subcurso: 'curso031',
        x: -593,
        y: 2225,
        ancho: 400,
        alto: 940,
      },
      {
        id: 'gen-serie-02',
        subcurso: 'curso002',
        x: -153,
        y: 2277,
        ancho: 400,
        alto: 1044,
      },
      {
        id: 'gen-cap17',
        subcurso: 'curso032',
        x: 367,
        y: 2196,
        ancho: 400,
        alto: 882,
      },
      {
        id: 'gen-cap18',
        subcurso: 'curso033',
        x: 1393,
        y: 2196,
        ancho: 400,
        alto: 882,
      }
    ]
  },
  {
    id: 'pensamiento',
    curso: 'curso03',
    x: -2460,
    y: 1397,
    ancho: 760,
    alto: 888,
    subcursos: [
      {
        id: 'dis-ensayo-01',
        subcurso: 'curso001',
        x: -720,
        y: 50,
        ancho: 640,
        alto: 661,
      },
      {
        id: 'dis-ensayo-02',
        subcurso: 'curso002',
        x: 0,
        y: 120,
        ancho: 640,
        alto: 1161,
      },
      {
        id: 'dis-ensayo-03',
        subcurso: 'curso003',
        x: 720,
        y: 70,
        ancho: 640,
        alto: 773,
      }
    ]
  },
  {
    // Expediente 11/26 (Nueva Toninas): a la derecha de la Deriva 01, un poco
    // más abajo.
    id: 'expediente-1126',
    curso: 'curso04',
    x: 900,
    y: 204,
    ancho: 760,
    alto: 1260,
    // Una isla por diligencia, en orden cronológico: seis por fila, en
    // serpentina (las filas pares van de derecha a izquierda), para que la línea
    // de recorrido siga de una fila a la siguiente sin cruzar el lienzo.
    subcursos: [
      {
        id: 'expediente-1126-01',
        subcurso: 'curso001',
        x: -380,
        y: 0,
        ancho: 640,
        alto: 688,
      },
      {
        id: 'expediente-1126-02',
        subcurso: 'curso002',
        x: 380,
        y: 160,
        ancho: 640,
        alto: 636,
      },
      {
        id: 'expediente-1126-03',
        subcurso: 'curso003',
        x: 1140,
        y: -20,
        ancho: 640,
        alto: 660,
      },
      {
        id: 'expediente-1126-04',
        subcurso: 'curso004',
        x: 1900,
        y: 120,
        ancho: 640,
        alto: 656,
      },
      {
        id: 'expediente-1126-05',
        subcurso: 'curso005',
        x: 2660,
        y: -40,
        ancho: 640,
        alto: 661,
      },
      {
        id: 'expediente-1126-06',
        subcurso: 'curso006',
        x: 3420,
        y: 100,
        ancho: 640,
        alto: 661,
      },
      {
        id: 'expediente-1126-07',
        subcurso: 'curso007',
        x: 3420,
        y: 940,
        ancho: 640,
        alto: 633,
      },
      {
        id: 'expediente-1126-08',
        subcurso: 'curso008',
        x: 2660,
        y: 800,
        ancho: 640,
        alto: 633,
      },
      {
        id: 'expediente-1126-09',
        subcurso: 'curso009',
        x: 1900,
        y: 960,
        ancho: 640,
        alto: 661,
      },
      {
        id: 'expediente-1126-10',
        subcurso: 'curso010',
        x: 1140,
        y: 820,
        ancho: 640,
        alto: 633,
      },
      {
        id: 'expediente-1126-11',
        subcurso: 'curso011',
        x: 380,
        y: 1000,
        ancho: 640,
        alto: 661,
      },
      {
        id: 'expediente-1126-12',
        subcurso: 'curso012',
        x: -380,
        y: 840,
        ancho: 640,
        alto: 609,
      },
      {
        id: 'expediente-1126-13',
        subcurso: 'curso013',
        x: -380,
        y: 1680,
        ancho: 640,
        alto: 605,
      },
      {
        id: 'expediente-1126-14',
        subcurso: 'curso014',
        x: 380,
        y: 1840,
        ancho: 640,
        alto: 600,
      },
      {
        id: 'expediente-1126-15',
        subcurso: 'curso015',
        x: 1140,
        y: 1660,
        ancho: 640,
        alto: 656,
      },
      {
        id: 'expediente-1126-16',
        subcurso: 'curso016',
        x: 1900,
        y: 1800,
        ancho: 640,
        alto: 633,
      },
      {
        id: 'expediente-1126-17',
        subcurso: 'curso017',
        x: 2660,
        y: 1640,
        ancho: 640,
        alto: 661,
      },
      {
        id: 'expediente-1126-18',
        subcurso: 'curso018',
        x: 3420,
        y: 1780,
        ancho: 640,
        alto: 633,
      },
      {
        id: 'expediente-1126-19',
        subcurso: 'curso019',
        x: 3420,
        y: 2620,
        ancho: 640,
        alto: 636,
      },
      {
        id: 'expediente-1126-20',
        subcurso: 'curso020',
        x: 2660,
        y: 2480,
        ancho: 640,
        alto: 605,
      },
      {
        id: 'expediente-1126-21',
        subcurso: 'curso021',
        x: 1900,
        y: 2640,
        ancho: 640,
        alto: 633,
      },
      {
        id: 'expediente-1126-22',
        subcurso: 'curso022',
        x: 1140,
        y: 2500,
        ancho: 640,
        alto: 605,
      },
      {
        id: 'expediente-1126-23',
        subcurso: 'curso023',
        x: 380,
        y: 2680,
        ancho: 640,
        alto: 609,
      },
      {
        id: 'expediente-1126-24',
        subcurso: 'curso024',
        x: -380,
        y: 2520,
        ancho: 640,
        alto: 636,
      },
    ],
  },
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

// La página editorial de una ínsula (pageMarkdownFile en src/data/insulas.ts),
// o null si no tiene. Desde el lienzo principal, la ínsula abre esta página
// en lugar de su lienzo; al lienzo se llega desde la página (VER EL MAPA).
export function paginaDeInsula(idInsula: string): string | null {
  const insula = INSULAS.find((entrada) => entrada.id === idInsula);
  return insula?.pageMarkdownFile ? ubicar(idInsula).urlPagina ?? null : null;
}

// Si se puede incursionar en un curso: tiene lienzo propio (no está
// reflotado) y algo para mostrar en él (al menos una isla).
export function tieneLienzo(idInsula: string): boolean {
  const deriva = DERIVAS_INSULAS.find((entrada) => entrada.id === idInsula);
  return Boolean(deriva && deriva.subcursos.length > 0 && !estaReflotada(idInsula));
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
    y: 1868,
    ancho: 420,
    alto: 403,
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
    alto: 1363,
  },
  {
    id: 'islote-bitacora-01-02',
    idSuperior: 'bitacora-01',
    subcurso: 'islote013',
    x: -720,
    y: -699,
    ancho: 386,
    alto: 606,
  },
  {
    id: 'islote-bitacora-05-01',
    idSuperior: 'bitacora-05',
    subcurso: 'islote003',
    x: -200,
    y: 1697,
    ancho: 400,
    alto: 484,
  },
  {
    id: 'islote-bitacora-05-02',
    idSuperior: 'bitacora-05',
    subcurso: 'islote004',
    x: 260,
    y: 1687,
    ancho: 400,
    alto: 464,
  },
  {
    id: 'islote-bitacora-05-03',
    idSuperior: 'bitacora-05',
    subcurso: 'islote005',
    x: 720,
    y: 1475,
    ancho: 400,
    alto: 470,
  },
  {
    id: 'islote-bitacora-07-01',
    idSuperior: 'bitacora-07',
    subcurso: 'islote018',
    x: 1450,
    y: -627,
    ancho: 640,
    alto: 498,
  },
  {
    id: 'islote-bitacora-08-01',
    idSuperior: 'bitacora-08',
    subcurso: 'islote014',
    x: 2922,
    y: -803,
    ancho: 400 ,
    alto: 628,
  },
  {
    id: 'islote-bitacora-10-01',
    idSuperior: 'bitacora-10',
    subcurso: 'islote017',
    x: 2186,
    y: 1780,
    ancho: 400,
    alto: 463,
  },
  {
    id: 'islote-bitacora-12-01',
    idSuperior: 'bitacora-12',
    subcurso: 'islote019',
    x: 3658,
    y: 1652,
    ancho: 600,
    alto: 663,
  },
  {
    id: 'islote-bitacora-13-01',
    idSuperior: 'bitacora-13',
    subcurso: 'islote020',
    x: 3658,
    y: 1004,
    ancho: 600,
    alto: 470,
  },
  {
    id: 'islote-bitacora-13-02',
    idSuperior: 'bitacora-13',
    subcurso: 'islote021',
    x: 4394,
    y: 949,
    ancho: 600,
    alto: 359,
  },
    
  // ISLOTES DEL CURSO:01 / NIVEL 1 / "ARTE ELECTRÓNICO"
  // Se muestra junto con los cursos del nivel superior
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  {
    id: 'islote-obra-00',
    idSuperior: 'arte-electronico-01',
    subcurso: 'islote007',
    x: 0,
    y: 1216,
    ancho: 580,
    alto: 1207, 
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
    x: -3200,
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
  {
    // A la derecha de Fuera de temporada (arriba está Nueva Toninas).
    id: 'islote-obra-06',
    idSuperior: 'arte-electronico-06',
    subcurso: 'islote022',
    x: 1500,
    y: 1086,
    ancho: 400,
    alto: 343,
  },
    

  // ISLOTES DEL CURSO:02 / NIVEL 2 / SUBDERIVAS "GENERATIVA"
  // Carteles de las partes y de los capítulos de varias obras, las demás
  // imágenes de cada serie y el excurso "Max Extract".
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  {
    id: 'islote-gen-cap02',
    idSuperior: 'gen-cap02-haemolacria',
    subcurso: 'islote023',
    x: -1513,
    y: -2584,
    ancho: 1720,
    alto: 123,
  },
  {
    id: 'islote-gen-cap04',
    idSuperior: 'gen-cap04-blood-moon',
    subcurso: 'islote024',
    x: 407,
    y: -2584,
    ancho: 840,
    alto: 123,
  },
  {
    id: 'islote-gen-serie-05-01',
    idSuperior: 'gen-serie-05',
    subcurso: 'islote025',
    x: 1966,
    y: -2370,
    ancho: 150,
    alto: 246,
  },
  {
    id: 'islote-gen-serie-05-02',
    idSuperior: 'gen-serie-05',
    subcurso: 'islote026',
    x: 1966,
    y: -2110,
    ancho: 150,
    alto: 245,
  },
  {
    id: 'islote-gen-serie-05-03',
    idSuperior: 'gen-serie-05',
    subcurso: 'islote027',
    x: 1966,
    y: -1848,
    ancho: 150,
    alto: 245,
  },
  {
    id: 'islote-gen-serie-05-04',
    idSuperior: 'gen-serie-05',
    subcurso: 'islote028',
    x: 2132,
    y: -2370,
    ancho: 150,
    alto: 246,
  },
  {
    id: 'islote-gen-serie-05-05',
    idSuperior: 'gen-serie-05',
    subcurso: 'islote029',
    x: 2132,
    y: -2110,
    ancho: 150,
    alto: 245,
  },
  {
    id: 'islote-gen-serie-05-06',
    idSuperior: 'gen-serie-05',
    subcurso: 'islote030',
    x: 2132,
    y: -1848,
    ancho: 150,
    alto: 245,
  },
  {
    id: 'islote-gen-serie-05-07',
    idSuperior: 'gen-serie-05',
    subcurso: 'islote031',
    x: 2298,
    y: -2370,
    ancho: 150,
    alto: 246,
  },
  {
    id: 'islote-gen-serie-05-08',
    idSuperior: 'gen-serie-05',
    subcurso: 'islote032',
    x: 2298,
    y: -2110,
    ancho: 150,
    alto: 245,
  },
  {
    id: 'islote-gen-serie-05-09',
    idSuperior: 'gen-serie-05',
    subcurso: 'islote033',
    x: 2298,
    y: -1848,
    ancho: 150,
    alto: 245,
  },
  {
    id: 'islote-gen-parte1',
    idSuperior: 'gen-cap01',
    subcurso: 'islote034',
    x: 0,
    y: -2738,
    ancho: 5786,
    alto: 123,
  },
  {
    id: 'islote-gen-cap08',
    idSuperior: 'gen-cap08-pormenores',
    subcurso: 'islote035',
    x: -2473,
    y: 78,
    ancho: 840,
    alto: 123,
  },
  {
    id: 'islote-gen-cap10-01',
    idSuperior: 'gen-cap10',
    subcurso: 'islote036',
    x: -914,
    y: 292,
    ancho: 150,
    alto: 245,
  },
  {
    id: 'islote-gen-cap10-02',
    idSuperior: 'gen-cap10',
    subcurso: 'islote037',
    x: -914,
    y: 552,
    ancho: 150,
    alto: 245,
  },
  {
    id: 'islote-gen-cap10-03',
    idSuperior: 'gen-cap10',
    subcurso: 'islote038',
    x: -914,
    y: 816,
    ancho: 150,
    alto: 246,
  },
  {
    id: 'islote-gen-cap10-04',
    idSuperior: 'gen-cap10',
    subcurso: 'islote039',
    x: -748,
    y: 292,
    ancho: 150,
    alto: 245,
  },
  {
    id: 'islote-gen-cap10-05',
    idSuperior: 'gen-cap10',
    subcurso: 'islote040',
    x: -748,
    y: 552,
    ancho: 150,
    alto: 245,
  },
  {
    id: 'islote-gen-cap10-06',
    idSuperior: 'gen-cap10',
    subcurso: 'islote041',
    x: -748,
    y: 816,
    ancho: 150,
    alto: 246,
  },
  {
    id: 'islote-gen-cap10-07',
    idSuperior: 'gen-cap10',
    subcurso: 'islote042',
    x: -582,
    y: 292,
    ancho: 150,
    alto: 245,
  },
  {
    id: 'islote-gen-cap10-08',
    idSuperior: 'gen-cap10',
    subcurso: 'islote043',
    x: -582,
    y: 552,
    ancho: 150,
    alto: 245,
  },
  {
    id: 'islote-gen-parte2',
    idSuperior: 'gen-cap08-pormenores',
    subcurso: 'islote044',
    x: -1700,
    y: -76,
    ancho: 2386,
    alto: 123,
  },
  {
    id: 'islote-gen-cap11',
    idSuperior: 'gen-cap11-windowsill',
    subcurso: 'islote045',
    x: 213,
    y: 78,
    ancho: 840,
    alto: 123,
  },
  {
    id: 'islote-gen-cap12-01',
    idSuperior: 'gen-cap12',
    subcurso: 'islote046',
    x: 1252,
    y: 292,
    ancho: 150,
    alto: 246,
  },
  {
    id: 'islote-gen-cap12-02',
    idSuperior: 'gen-cap12',
    subcurso: 'islote047',
    x: 1252,
    y: 554,
    ancho: 150,
    alto: 246,
  },
  {
    id: 'islote-gen-cap12-03',
    idSuperior: 'gen-cap12',
    subcurso: 'islote048',
    x: 1252,
    y: 816,
    ancho: 150,
    alto: 246,
  },
  {
    id: 'islote-gen-cap12-04',
    idSuperior: 'gen-cap12',
    subcurso: 'islote049',
    x: 1418,
    y: 292,
    ancho: 150,
    alto: 246,
  },
  {
    id: 'islote-gen-cap12-05',
    idSuperior: 'gen-cap12',
    subcurso: 'islote050',
    x: 1418,
    y: 552,
    ancho: 150,
    alto: 245,
  },
  {
    id: 'islote-gen-cap12-06',
    idSuperior: 'gen-cap12',
    subcurso: 'islote051',
    x: 1418,
    y: 814,
    ancho: 150,
    alto: 245,
  },
  {
    id: 'islote-gen-cap12-07',
    idSuperior: 'gen-cap12',
    subcurso: 'islote052',
    x: 1584,
    y: 292,
    ancho: 150,
    alto: 246,
  },
  {
    id: 'islote-gen-cap12-08',
    idSuperior: 'gen-cap12',
    subcurso: 'islote053',
    x: 1584,
    y: 552,
    ancho: 150,
    alto: 245,
  },
  {
    id: 'islote-gen-cap12-09',
    idSuperior: 'gen-cap12',
    subcurso: 'islote054',
    x: 1584,
    y: 814,
    ancho: 150,
    alto: 245,
  },
  {
    id: 'islote-gen-cap12-10',
    idSuperior: 'gen-cap12',
    subcurso: 'islote055',
    x: 1750,
    y: 292,
    ancho: 150,
    alto: 246,
  },
  {
    id: 'islote-gen-cap12-11',
    idSuperior: 'gen-cap12',
    subcurso: 'islote056',
    x: 1750,
    y: 552,
    ancho: 150,
    alto: 245,
  },
  {
    id: 'islote-gen-cap12-12',
    idSuperior: 'gen-cap12',
    subcurso: 'islote057',
    x: 1750,
    y: 814,
    ancho: 150,
    alto: 245,
  },
  {
    id: 'islote-gen-parte3',
    idSuperior: 'gen-cap11-windowsill',
    subcurso: 'islote058',
    x: 1069,
    y: -76,
    ancho: 2552,
    alto: 123,
  },
  {
    id: 'islote-gen-cap14',
    idSuperior: 'gen-cap14-la-noria',
    subcurso: 'islote059',
    x: -2473,
    y: 1664,
    ancho: 840,
    alto: 123,
  },
  {
    id: 'islote-gen-parte4',
    idSuperior: 'gen-cap14-la-noria',
    subcurso: 'islote060',
    x: -2213,
    y: 1510,
    ancho: 1360,
    alto: 123,
  },
  {
    id: 'islote-gen-cap16',
    idSuperior: 'gen-cap16-scaffolded',
    subcurso: 'islote061',
    x: -593,
    y: 1664,
    ancho: 1280,
    alto: 123,
  },
  {
    id: 'islote-gen-cap17-01',
    idSuperior: 'gen-cap17',
    subcurso: 'islote062',
    x: 666,
    y: 1878,
    ancho: 150,
    alto: 245,
  },
  {
    id: 'islote-gen-cap17-02',
    idSuperior: 'gen-cap17',
    subcurso: 'islote063',
    x: 666,
    y: 2138,
    ancho: 150,
    alto: 245,
  },
  {
    id: 'islote-gen-cap17-03',
    idSuperior: 'gen-cap17',
    subcurso: 'islote064',
    x: 666,
    y: 2402,
    ancho: 150,
    alto: 246,
  },
  {
    id: 'islote-gen-cap17-04',
    idSuperior: 'gen-cap17',
    subcurso: 'islote065',
    x: 832,
    y: 1878,
    ancho: 150,
    alto: 245,
  },
  {
    id: 'islote-gen-cap17-05',
    idSuperior: 'gen-cap17',
    subcurso: 'islote066',
    x: 832,
    y: 2138,
    ancho: 150,
    alto: 245,
  },
  {
    id: 'islote-gen-cap17-06',
    idSuperior: 'gen-cap17',
    subcurso: 'islote067',
    x: 832,
    y: 2402,
    ancho: 150,
    alto: 246,
  },
  {
    id: 'islote-gen-cap17-07',
    idSuperior: 'gen-cap17',
    subcurso: 'islote068',
    x: 998,
    y: 1878,
    ancho: 150,
    alto: 245,
  },
  {
    id: 'islote-gen-cap17-08',
    idSuperior: 'gen-cap17',
    subcurso: 'islote069',
    x: 998,
    y: 2138,
    ancho: 150,
    alto: 245,
  },
  {
    id: 'islote-gen-cap18-01',
    idSuperior: 'gen-cap18',
    subcurso: 'islote070',
    x: 1692,
    y: 1878,
    ancho: 150,
    alto: 245,
  },
  {
    id: 'islote-gen-cap18-02',
    idSuperior: 'gen-cap18',
    subcurso: 'islote071',
    x: 1692,
    y: 2138,
    ancho: 150,
    alto: 245,
  },
  {
    id: 'islote-gen-cap18-03',
    idSuperior: 'gen-cap18',
    subcurso: 'islote072',
    x: 1692,
    y: 2402,
    ancho: 150,
    alto: 246,
  },
  {
    id: 'islote-gen-cap18-04',
    idSuperior: 'gen-cap18',
    subcurso: 'islote073',
    x: 1858,
    y: 1878,
    ancho: 150,
    alto: 245,
  },
  {
    id: 'islote-gen-cap18-05',
    idSuperior: 'gen-cap18',
    subcurso: 'islote074',
    x: 1858,
    y: 2138,
    ancho: 150,
    alto: 245,
  },
  {
    id: 'islote-gen-cap18-06',
    idSuperior: 'gen-cap18',
    subcurso: 'islote075',
    x: 1858,
    y: 2402,
    ancho: 150,
    alto: 246,
  },
  {
    id: 'islote-gen-cap18-07',
    idSuperior: 'gen-cap18',
    subcurso: 'islote076',
    x: 2024,
    y: 1878,
    ancho: 150,
    alto: 245,
  },
  {
    id: 'islote-gen-cap18-08',
    idSuperior: 'gen-cap18',
    subcurso: 'islote077',
    x: 2024,
    y: 2138,
    ancho: 150,
    alto: 245,
  },
  {
    id: 'islote-gen-parte5',
    idSuperior: 'gen-cap16-scaffolded',
    subcurso: 'islote078',
    x: 433,
    y: 1510,
    ancho: 3332,
    alto: 123,
  },
  {
    id: 'islote-generativa-01',
    idSuperior: 'gen-serie-01',
    subcurso: 'islote002',
    x: 1157,
    y: -1179,
    ancho: 420,
    alto: 431,
  },

  // ISLOTES DEL CURSO:04 / SUBDERIVAS "EXPEDIENTE 11/26"
  {
    id: 'islote-expediente-01',
    idSuperior: 'expediente-1126-01',
    subcurso: 'islote015',
    x: -930,
    y: -180,
    ancho: 220,
    alto: 220,
  },
  {
    id: 'islote-expediente-02',
    idSuperior: 'expediente-1126-03',
    subcurso: 'islote016',
    x: 1140,
    y: -819,
    ancho: 600,
    alto: 692,
  },
];



