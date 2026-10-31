/**
 * RUTAS DE LAS PÁGINAS DE CONTENIDO
 * Arma, para cada página, los parámetros de su ruta y lo que recibe su carta.
 * Las usan las páginas de src/pages/ para generar la versión original de cada
 * página y, si tiene modo lectura, la versión del cartulario en {URL}cartulario/.
 */
import fs from 'node:fs';
import path from 'node:path';
import { ISLAS } from '../data/islas';
import { ISLOTES } from '../data/islotes';
import { ubicar, urlPropia } from '../motor/Derivas';
import { resolveFile } from '../utils/paths';
import { cargarDocumento, documentoDeLectura, tieneModoLectura, type PropsCarta } from './index';

interface RutaCarta<P> {
  params: P;
  props: PropsCarta;
}

// Agrega las vistas a una página que tiene modo lectura.
function conVistas<P>(ruta: RutaCarta<P>, url: string): RutaCarta<P> {
  if (!tieneModoLectura(ruta.props.documento)) return ruta;
  const vistas = { original: url, lectura: `${url}cartulario/`, actual: 'original' as const };
  return { ...ruta, props: { ...ruta.props, vistas } };
}

// La versión de modo lectura de cada página que la tiene.
export function rutasDeLectura<P>(rutas: RutaCarta<P>[]): RutaCarta<P>[] {
  return rutas.filter(({ props }) => props.vistas).map((ruta) => ({
    ...ruta,
    props: {
      ...ruta.props,
      documento: documentoDeLectura(ruta.props.documento),
      vistas: { ...ruta.props.vistas!, actual: 'lectura' },
    },
  }));
}

// Páginas sueltas: cada archivo .md de public/paginas/ se publica en
// /{nombre-del-archivo}/, con sus datos en el encabezado del archivo. Los que
// dicen "publicar: no" (como bio.md y contacto.md, que usa el Derrotero) no
// se publican como página.
export function rutasPaginasSueltas(): RutaCarta<{ pagina: string }>[] {
  const carpeta = path.join(process.cwd(), 'public', 'paginas');
  return fs.readdirSync(carpeta)
    .filter((archivo) => archivo.endsWith('.md'))
    .map((archivo) => ({ archivo, documento: cargarDocumento(`/paginas/${archivo}`) }))
    .filter(({ documento }) => documento.datos.publicar !== 'no')
    .map(({ archivo, documento }) => {
      const pagina = archivo.replace(/\.md$/, '');
      const { titulo = '', subtitulo = '', codigo = '', etiqueta = '', color = '#0038A8' } = documento.datos;
      return conVistas({
        params: { pagina },
        props: { pagina: { titulo, subtitulo, codigo, etiqueta, color }, documento, volver: '/' },
      }, `/${pagina}/`);
    });
}

// Subcursos e islotes: solo los que tienen un archivo de página. La URL es la
// urlPagina de su ubicación (src/motor/Derivas.ts): /{curso}/{subcurso}/ o,
// si la isla tiene pageUrl (src/data/islas.ts), /{pageUrl}/.
function paginasDeSubcursos() {
  return [...ISLAS, ...ISLOTES].filter((data) => data.pageMarkdownFile).map((data) => {
    const ubicacion = ubicar(data.id);
    const documento = cargarDocumento(resolveFile(ubicacion.carpetaContenidos, data.pageMarkdownFile)!);
    const props: PropsCarta = {
      pagina: {
        titulo: data.title ?? '',
        subtitulo: data.subtitle ?? '',
        codigo: data.code,
        etiqueta: data.tag,
        color: data.accentColor,
      },
      documento,
      // VOLVER abre el lienzo del curso de primer nivel que contiene el ítem.
      volver: `/?deriva=${ubicacion.idDeriva}`,
    };
    return { id: data.id, ubicacion, url: ubicacion.urlPagina!, props };
  });
}

// Las de /{curso}/{subcurso}/ (src/pages/[curso]/[subcurso].astro).
export function rutasSubcursos(): RutaCarta<{ curso: string; subcurso: string | undefined }>[] {
  return paginasDeSubcursos()
    .filter(({ id }) => !urlPropia(id))
    .map(({ ubicacion, url, props }) => conVistas({ params: { curso: ubicacion.curso, subcurso: ubicacion.subcurso }, props }, url));
}

// Las de URL propia, de un solo tramo, como las páginas sueltas.
function rutasConUrlPropia(): RutaCarta<{ pagina: string }>[] {
  return paginasDeSubcursos()
    .filter(({ id }) => urlPropia(id))
    .map(({ url, props }) => conVistas({ params: { pagina: url.slice(1, -1) }, props }, url));
}

// Todas las páginas de un solo tramo (src/pages/[pagina].astro): las sueltas y
// las de URL propia. Si una URL se repite, o coincide con una carpeta de
// public/ (como /curso01/), el build se detiene.
export function rutasDeUnTramo(): RutaCarta<{ pagina: string }>[] {
  const rutas = [...rutasPaginasSueltas(), ...rutasConUrlPropia()];
  const enPublic = new Set(fs.readdirSync(path.join(process.cwd(), 'public')));
  const usadas = new Set<string>();
  for (const { params: { pagina } } of rutas) {
    if (usadas.has(pagina) || enPublic.has(pagina)) {
      throw new Error(`La URL /${pagina}/ ya está en uso (otra página suelta, una pageUrl de src/data/islas.ts o una carpeta de public/)`);
    }
    usadas.add(pagina);
  }
  return rutas;
}
