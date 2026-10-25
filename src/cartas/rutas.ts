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
import { ubicar } from '../motor/Derivas';
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
// urlPagina de su ubicación (src/motor/Derivas.ts).
export function rutasSubcursos(): RutaCarta<{ curso: string; subcurso: string | undefined }>[] {
  return [...ISLAS, ...ISLOTES].filter((data) => data.pageMarkdownFile).map((data) => {
    const ubicacion = ubicar(data.id);
    const documento = cargarDocumento(resolveFile(ubicacion.carpetaContenidos, data.pageMarkdownFile)!);
    return conVistas({
      params: { curso: ubicacion.curso, subcurso: ubicacion.subcurso },
      props: {
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
      },
    }, `/${ubicacion.curso}/${ubicacion.subcurso}/`);
  });
}
