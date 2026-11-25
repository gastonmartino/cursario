/**
 * DERROTERO
 * Qué trabajos aparecen en el Derrotero (src/components/Derrotero.astro), en
 * qué sección y en qué orden. Cada lista nombra ínsulas e islas por su id; el
 * contenido de cada trabajo (títulos, textos, miniatura, portada, página)
 * sigue en src/data/insulas.ts e islas.ts.
 *
 * Lo que no está en una lista no aparece en esa sección. Si una lista nombra
 * un id que no existe, o lo repite, el build se detiene y lo avisa. Si una
 * isla con página no está en ninguna sección (ni la ínsula de su curso), el
 * build lo avisa, sin detenerse, por si es un olvido.
 */
export const DERROTERO: {
  inicio: string[];
  obras: string[];
  bitacora: string[];
  escritos: string[];
} = {
  // INICIO, por posición: una ínsula con portada (coverImageUrl) abre un
  // bloque, con su portada y su título; lo que sigue (islas, o ínsulas sin
  // portada) va en ese bloque, en el orden de la lista y aunque sea de otro
  // curso. Lo que está antes del primer bloque va suelto, al final.
  inicio: [
    'arte-electronico',       // CURSO: Artes Electrónicas
      'arte-electronico-01',  // Siervos del Obnubilante Scrolling (S.O.S)
      'arte-electronico-02',  // Rebelión en la Granja de Clics
      'arte-electronico-03',  // Homo Hamatus. Fenomenología de la vulnerabilidad
      'arte-electronico-04',  // GPS (Goce Positioning System)
      'arte-electronico-06',  // Fuera de temporada
      'expediente-1126',      // Expte. 11/26 (Nueva Toninas): una obra más del bloque

    'generativa',             // CURSO: Gráfica Generativa
      'gen-serie-01',         // Sarandí Revelation
      'gen-serie-02',         // Meticulously Unplanned
      'gen-serie-03',         // Plastic Natianta
      'gen-serie-04',         // Diasporas
  ],

  // OBRAS, BITÁCORA y ESCRITOS: los trabajos de cada sección, en el orden de
  // la lista y mezclando cursos si hace falta. Una ínsula aparece como un
  // trabajo más, en representación de todo su curso (como el Expediente
  // 11/26), y enlaza a su página editorial.
  obras: [
    // DERIVA:01 · Artes Electrónicas
    'arte-electronico-01',    // Siervos del Obnubilante Scrolling (S.O.S)
    'arte-electronico-02',    // Rebelión en la Granja de Clics
    'arte-electronico-03',    // Homo Hamatus. Fenomenología de la vulnerabilidad
    'arte-electronico-04',    // GPS (Goce Positioning System)
    'arte-electronico-05',    // Diálogos Desavenidos
    'arte-electronico-06',    // Fuera de temporada

    // DERIVA:02 · Gráfica Generativa
    'gen-serie-01',           // Sarandí Revelation
    'gen-serie-02',           // Meticulously Unplanned
    'gen-serie-03',           // Plastic Natianta
    'gen-serie-04',           // Diasporas
    'gen-serie-05',           // Meanwhile, in the Southern Hemisphere, a lymphatic summer
    'gen-serie-06',           // Regolito fértil

    // DERIVA:04 · Expediente 11/26
    'expediente-1126',        // [ÍNSULA] Expte. 11/26 s/ Tendidos sobrentendidos
  ],

  // De lo más reciente a lo más antiguo.
  bitacora: [
    'bitacora-13',            // TFIC:12 · Acerca de la impropiedad
    'bitacora-12',            // TFIC:11 · Marca de agua
    'bitacora-11',            // TFIC:10 · Registro Cromático de Emergencias (RCE)
    'bitacora-10',            // TFIC:09 · Descarga en curso
    'bitacora-09',            // TFIC:08 · Fragmentos de un discurso amoroso
    'bitacora-08',            // TFIC:07 · Estrategias estéticas, cruces y agrupamientos
    'bitacora-07',            // TFIC:06 · Emergencias del Territorio
    'bitacora-06',            // TFIC:05 · Macrófitas - Visualización de un territorio generativo
    'bitacora-05',            // TFIC:04 · Ejercicio de Recorrido
    'bitacora-04',            // TFIC:03 · Camino de las Flores
    'bitacora-03',            // TFIC:02 · Statement de Artista
    'bitacora-02',            // TFIC:01 · Intereses, objetos, amuletos y miedos
  ],

  escritos: [
    'dis-ensayo-01',          // ¿Qué sostiene la experiencia del usuario?
    'dis-ensayo-02',          // Interacción: ¿cita entre dos?
  ],
};
