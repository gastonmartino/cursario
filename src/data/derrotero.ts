/**
 * ORDEN DEL DERROTERO
 * En qué orden se muestran los trabajos en el Derrotero
 * (src/components/Derrotero.astro). Qué trabajos aparecen y en qué sección
 * se sigue definiendo en src/data/ (featured y derroteroSection); acá solo se
 * define el orden, con los ids de las ínsulas e islas.
 *
 * Lo que no está en una lista se muestra igual, después de lo listado y en el
 * orden de siempre (por curso, y dentro de cada curso, en el orden de
 * src/data/islas.ts). Una lista vacía deja el orden de siempre.
 *
 * Si un id no existe, o no corresponde a lo que se muestra en esa lista, el
 * build se detiene y lo avisa.
 */
export const ORDEN_DERROTERO: {
  inicio: string[];
  obras: string[];
  bitacora: string[];
  escritos: string[];
} = {
  // INICIO: los cursos destacados (featured en src/data/insulas.ts), cada uno
  // con su portada y sus islas destacadas, y al final las islas destacadas de
  // otros cursos. El orden de los cursos de esta lista es el de sus bloques;
  // el de las islas, el de cada bloque.
  inicio: [
    'arte-electronico',
    'arte-electronico-01',
    'arte-electronico-02',
    'arte-electronico-03',
    'arte-electronico-04',

    'generativa',
    'gen-serie-01',
    'gen-serie-02',
    'gen-serie-03',
    'gen-serie-04',
  ],

  // OBRAS, BITÁCORA y ESCRITOS: los trabajos de cada sección
  // (derroteroSection), islas o ínsulas, en cualquier orden y mezclando
  // cursos.
  obras: [],
  bitacora: [],
  escritos: [],
};
