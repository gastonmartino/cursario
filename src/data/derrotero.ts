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
      'gen-cap04-mboi-tata',  // Mbói Tatá
      'gen-serie-03',         // Plastic Natianta
      'gen-serie-04',         // Diasporas
      'gen-cap01',            // Stochastic Parrots
      'gen-cap07',            // Blue Prowess
      'gen-cap10',            // Yabotí Lowlands
      'gen-cap12',            // Fire Season
      'gen-cap13',            // The Ostrich Evidence
      'gen-cap15',            // Eardrum Negentropy
      'gen-cap17',            // Astralium
      'gen-cap02-haemolacria', // Haemolacria
      'gen-cap03',            // Orchestrion
      'gen-cap04-blood-moon', // Blood Moon Turban
      'gen-serie-05',         // Meanwhile, in the Southern Hemisphere, a lymphatic summer
      'gen-cap08-green-velvet', // Green Velvet Reward
      'gen-serie-06',         // Fertile Regolith
      'gen-cap14-la-noria',   // La Noria
      'gen-cap16-kite',       // Kite Festival Above, But Temple Below
      'gen-cap18',            // Lombrela
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
    'expediente-1126',        // [ÍNSULA] Expte. 11/26 s/ Tendidos sobrentendidos (Nueva Toninas)

    // DERIVA:02 · Gráfica Generativa, en el orden de la página editorial
    'gen-cap01',              // Stochastic Parrots
    'gen-cap02-haemolacria',  // Haemolacria
    'gen-serie-03',           // Plastic Natianta
    'gen-cap02-aigrette',     // The Marshal's Queer Aigrette
    'gen-cap02-three-body',   // The Three-Body Problem
    'gen-serie-04',           // Diaspores
    'gen-cap02-battle',       // The Battle
    'gen-cap02-ointment',     // Fly in the Ointment
    'gen-cap02-neural-rhythm', // Neural Rhythm
    'gen-cap03',              // Orchestrion
    'gen-cap04-suspended-angel', // Suspended Angel Dance
    'gen-cap04-blood-moon',   // Blood Moon Turban
    'gen-cap04-inequalities', // Systems of Inequalities
    'gen-cap04-false-northing', // False Northing
    'gen-cap04-mboi-tata',    // Mbói Tatá
    'gen-serie-01',           // Sarandí Revelation
    'gen-serie-05',           // Meanwhile, in the Southern Hemisphere, a lymphatic summer
    'gen-cap07',              // Blue Prowess
    'gen-cap08-pormenores',   // Pormenores
    'gen-cap08-green-velvet', // Green Velvet Reward
    'gen-cap09',              // Dispensable Treasure Maps
    'gen-cap10',              // Yabotí Lowlands
    'gen-cap11-windowsill',   // Windowsill Ill Sprouts
    'gen-serie-06',           // Fertile Regolith
    'gen-cap12',              // Fire Season
    'gen-cap13',              // The Ostrich Evidence
    'gen-cap14-la-noria',     // La Noria
    'gen-cap14-struggle',     // The Order of the Struggle
    'gen-cap15',              // Eardrum Negentropy
    'gen-cap16-scaffolded',   // Scaffolded Whole
    'gen-cap16-kite',         // Kite Festival Above, But Temple Below
    'gen-serie-02',           // Meticulously Unplanned
    'gen-cap17',              // Astralium
    'gen-cap18',              // Lombrela
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
