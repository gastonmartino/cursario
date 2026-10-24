/**
 * Une la estructura del sitio (src/engine/Derivas.ts) con el contenido de las
 * tarjetas (insulas.ts, islas.ts e islotes.ts), vinculados por id, y entrega
 * cada elemento completo: al motor y al HUD, los cursos con su código, nombre
 * y color; a las páginas, las tarjetas con su carpeta, rutas y URL resueltas.
 */
import {
  SPATIAL_DERIVAS,
  ISLOTES_SPATIAL,
  type SpatialDeriva,
  type DerivaItem,
} from '../engine/Derivas';
import { INSULAS, type InsulaDefinition } from './insulas';
import { ISLAS, type IslaDefinition } from './islas';
import { ISLOTES, type IsloteDefinition } from './islotes';
import { pageHref } from '../utils/paths';

export { ISLOTES_SPATIAL };

const findOrFail = <T extends { id: string }>(list: T[], id: string, description: string): T => {
  const found = list.find((entry) => entry.id === id);
  if (!found) throw new Error(`No se encontró ${description} con id "${id}"`);
  return found;
};

const resolveFile = (folder: string, file?: string | null) =>
  file && !file.startsWith('/') ? `${folder}/${file}` : file;

// Curso de primer nivel que es, o contiene, el curso o subcurso con este id.
const findDerivaContaining = (id: string) => {
  const deriva = SPATIAL_DERIVAS.find((entry) => entry.id === id || entry.items.some((item) => item.id === id));
  if (!deriva) throw new Error(`No se encontró en Derivas.ts el curso o subcurso con id "${id}"`);
  return deriva;
};

/* -------------------------------------------------------------
   CURSOS PARA EL MOTOR, EL HUD Y EL MENÚ
------------------------------------------------------------- */
export interface Subcurso extends DerivaItem {
  code: string;
  title: string;
  accentColor: string;
}

export interface Curso extends Omit<SpatialDeriva, 'items'> {
  code: string;
  name: string;
  accentColor: string;
  items: Subcurso[];
}

export const CURSOS: Curso[] = SPATIAL_DERIVAS.map((deriva) => {
  const insula = findOrFail(INSULAS, deriva.id, 'la ínsula');

  return {
    ...deriva,
    code: insula.code,
    name: insula.name,
    accentColor: insula.accentColor,
    items: deriva.items.map((item) => {
      const isla = findOrFail(ISLAS, item.id, 'la isla');
      return {
        ...item,
        code: isla.code,
        title: isla.title || isla.captionLabel || '',
        accentColor: isla.accentColor,
      };
    }),
  };
});

/* -------------------------------------------------------------
   TARJETAS
------------------------------------------------------------- */
interface Placement {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface InsulaCard extends InsulaDefinition, Placement {
  course: string;
}

export interface IslaCard extends IslaDefinition, Placement {
  derivaId: string;
  course: string;
  subcurso: string;
  pageHref?: string;
}

export interface IsloteCard extends IsloteDefinition, Placement {
  derivaId: string;
  parentId: string;
  course: string;
  subcurso: string;
  pageHref?: string;
}

const placement = ({ x, y, width, height }: Placement): Placement => ({ x, y, width, height });

export const INSULA_CARDS: InsulaCard[] = INSULAS.map((insula) => {
  const deriva = findOrFail(SPATIAL_DERIVAS, insula.id, 'el curso');
  const folder = `/${deriva.course}`;

  return {
    ...insula,
    ...placement(deriva),
    course: deriva.course,
    imageUrl: resolveFile(`${folder}/imagenes`, insula.imageUrl),
    markdownFile: resolveFile(`${folder}/contenidos`, insula.markdownFile),
  };
});

export const ISLA_CARDS: IslaCard[] = ISLAS.map((isla) => {
  const deriva = findDerivaContaining(isla.id);
  const item = findOrFail(deriva.items, isla.id, 'el subcurso');
  const folder = `/${deriva.course}/subcursos/${item.subcurso}`;
  const pageMarkdownFile = resolveFile(`${folder}/contenidos`, isla.pageMarkdownFile);

  return {
    ...isla,
    ...placement(item),
    derivaId: deriva.id,
    course: deriva.course,
    subcurso: item.subcurso,
    imageUrl: resolveFile(`${folder}/medios`, isla.imageUrl),
    markdownFile: resolveFile(`${folder}/contenidos`, isla.markdownFile),
    pageMarkdownFile,
    pageHref: pageHref({ course: deriva.course, subcurso: item.subcurso, pageMarkdownFile }),
  };
});

export const ISLOTE_CARDS: IsloteCard[] = ISLOTES.map((islote) => {
  const spatial = findOrFail(ISLOTES_SPATIAL, islote.id, 'el islote');
  const deriva = findDerivaContaining(spatial.parentId);

  return {
    ...islote,
    ...placement(spatial),
    derivaId: deriva.id,
    parentId: spatial.parentId,
    course: deriva.course,
    subcurso: spatial.subcurso,
    pageHref: pageHref({ course: deriva.course, subcurso: spatial.subcurso, pageMarkdownFile: islote.pageMarkdownFile }),
  };
});
