/**
 * CARTAS
 * Las cartas son las plantillas con las que se arman las páginas de contenido
 * (las de los subcursos e islotes que tienen pageMarkdownFile, y las páginas
 * sueltas como "Acerca de"). Cada una decide por completo cómo se muestra el
 * contenido de su archivo Markdown.
 *
 * Cada carta es una carpeta dentro de src/cartas/ con su componente principal
 * en Carta.astro; el nombre de la carpeta es el nombre de la carta. Un archivo
 * Markdown elige su carta en el encabezado de datos:
 *
 *   ---
 *   carta: cartulario
 *   ---
 *
 * Sin encabezado (o sin el dato "carta"), se usa la carta CARTA_PREDETERMINADA.
 */
import fs from 'node:fs';
import path from 'node:path';
import { leerDocumento, type DocumentoMimo } from '../utils/markdown';

export const CARTA_PREDETERMINADA = 'cartulario';

// Lo que recibe toda carta.
export interface PropsCarta {
  // Datos de la página: los de la isla o islote, o los del encabezado de
  // datos en las páginas sueltas.
  pagina: {
    titulo: string;
    subtitulo: string;
    codigo: string;
    etiqueta: string;
    color: string;
  };
  // El Markdown interpretado: el encabezado de datos (incluidas las opciones
  // propias de la carta), los bloques y las secciones.
  documento: DocumentoMimo;
  // Ruta a la que lleva VOLVER (sin el prefijo del sitio; ver Volver.astro).
  volver: string;
}

type ComponenteCarta = (props: PropsCarta) => unknown;

const componentes = import.meta.glob<{ default: ComponenteCarta }>('./*/Carta.astro', { eager: true });

export const CARTAS: Record<string, ComponenteCarta> = Object.fromEntries(
  Object.entries(componentes).map(([ruta, modulo]) => [ruta.split('/')[1], modulo.default])
);

export function obtenerCarta(nombre: string = CARTA_PREDETERMINADA): ComponenteCarta {
  const carta = CARTAS[nombre];
  if (!carta) {
    throw new Error(`No existe la carta "${nombre}". Cartas disponibles: ${Object.keys(CARTAS).join(', ')}`);
  }
  return carta;
}

// Lee e interpreta un archivo Markdown de public/ (ruta desde la raíz del sitio).
export function cargarDocumento(rutaPublica: string): DocumentoMimo {
  const ruta = path.join(process.cwd(), 'public', rutaPublica.replace(/^\/+/, ''));
  return leerDocumento(fs.readFileSync(ruta, 'utf-8'));
}
