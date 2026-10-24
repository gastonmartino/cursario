import { withBase } from './paths';

/**
 *
 * MIMO - Markdown In. Markup Out
 * Intérprete simplificado de código markdown para generar el código markup del sitio.
 * Como todo "mimo" imita y reproduce el lenguaje altamente simplificado del markdown
 * (creado en 2004 por John Gruber and Aaron Swartz) con su absurda simetría.
 *
 * Trabaja en tres pasos, para que quien lo usa decida cómo se ve el resultado:
 *   1. leerDocumento: separa el encabezado de datos (entre líneas "---" al
 *      comienzo del archivo) del cuerpo.
 *   2. interpretarBloques / agruparSecciones: convierte el cuerpo en bloques
 *      (títulos, párrafos, listas, citas, imágenes, videos, separadores) y los
 *      agrupa en secciones, una por cada título "##".
 *   3. renderizarBloques: arma el HTML de los bloques con las clases que se le
 *      indiquen. Sin clases, el HTML sale limpio, para estilizarlo con CSS.
 *
 */

export type MarcaSeparador = '---' | '___' | '***' | '===' | '+++';

export type BloqueMimo =
  | { tipo: 'titulo'; nivel: 1 | 2 | 3; texto: string }
  | { tipo: 'parrafo'; texto: string }
  | { tipo: 'lista'; items: string[] }
  | { tipo: 'cita'; partes: Array<{ tipo: 'texto'; texto: string } | { tipo: 'separador'; marca: MarcaSeparador }> }
  | { tipo: 'imagen'; src: string; alt: string; pie?: string }
  | { tipo: 'video'; youtube: string }
  | { tipo: 'separador'; marca: MarcaSeparador };

// Los textos de los bloques conservan su Markdown en línea (negritas,
// itálicas, enlaces, código); renderizarEnLinea los convierte en HTML.

export interface SeccionMimo {
  // El título "##" que abre la sección (la primera sección puede no tenerlo).
  titulo: Extract<BloqueMimo, { tipo: 'titulo' }> | null;
  bloques: BloqueMimo[];
}

export interface DocumentoMimo {
  datos: Record<string, string>;
  bloques: BloqueMimo[];
  secciones: SeccionMimo[];
}

// Clases CSS para cada elemento del HTML. Un elemento sin clase se genera sin
// el atributo class.
export interface ClasesMimo {
  h1?: string;
  h2?: string;
  h3?: string;
  parrafo?: string;
  lista?: string;
  cita?: string;
  negrita?: string;
  italica?: string;
  enlace?: string;
  codigo?: string;
  figura?: string;
  imagen?: string;
  pie?: string;
  video?: string;
  marcoVideo?: string;
  separadores?: Partial<Record<MarcaSeparador, string>>;
  separadoresEnCita?: Partial<Record<MarcaSeparador, string>>;
}

const MARCAS: MarcaSeparador[] = ['---', '___', '***', '===', '+++'];
const esMarca = (linea: string): linea is MarcaSeparador => (MARCAS as string[]).includes(linea);
const atributoClase = (clase?: string) => (clase ? ` class="${clase}"` : '');

/* -------------------------------------------------------------
   1. ENCABEZADO DE DATOS
------------------------------------------------------------- */
export function leerDocumento(markdown: string): DocumentoMimo {
  const texto = markdown ?? '';
  const datos: Record<string, string> = {};
  let cuerpo = texto;

  // El encabezado va al comienzo del archivo, entre dos líneas "---", con una
  // línea "clave: valor" por dato.
  const encabezado = texto.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (encabezado) {
    const lineas = encabezado[1].split(/\r?\n/).filter((linea) => linea.trim());
    const pares = lineas.map((linea) => linea.match(/^\s*([\w-]+)\s*:\s*(.*?)\s*$/));
    if (pares.every(Boolean)) {
      for (const par of pares) {
        const [, clave, valor] = par!;
        datos[clave] = valor.replace(/^(['"])(.*)\1$/, '$2');
      }
      cuerpo = texto.slice(encabezado[0].length);
    }
  }

  const bloques = interpretarBloques(cuerpo);
  return { datos, bloques, secciones: agruparSecciones(bloques) };
}

/* -------------------------------------------------------------
   2. BLOQUES Y SECCIONES
------------------------------------------------------------- */
export function interpretarBloques(markdown: string): BloqueMimo[] {
  if (!markdown) return [];

  const bloques: BloqueMimo[] = [];
  let cita: Extract<BloqueMimo, { tipo: 'cita' }> | null = null;
  let lista: string[] = [];

  const cerrarLista = () => {
    if (lista.length > 0) {
      bloques.push({ tipo: 'lista', items: lista });
      lista = [];
    }
  };

  const cerrarCita = () => {
    if (cita) {
      bloques.push(cita);
      cita = null;
    }
  };

  for (const lineaOriginal of markdown.split(/\r?\n/)) {
    const linea = lineaOriginal.trim();

    if (linea.startsWith('>')) {
      cerrarLista();
      cita ??= { tipo: 'cita', partes: [] };
      const citada = linea.replace(/^>\s*/, '').trim();
      cita.partes.push(esMarca(citada) ? { tipo: 'separador', marca: citada } : { tipo: 'texto', texto: citada });
      continue;
    }
    cerrarCita();

    if (!linea) continue;

    // Una línea que empieza con "- " o "* " es un ítem de lista sin orden.
    // Las líneas en blanco no cortan la lista; cualquier otro bloque sí.
    const item = linea.match(/^[-*]\s+(.+)$/);
    if (item && !esMarca(linea)) {
      lista.push(item[1]);
      continue;
    }
    cerrarLista();

    const youtube = linea.match(/^\[youtube:([A-Za-z0-9_-]{11})\]$/i);
    const imagen = linea.match(/^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)(?:\s+\*([^*]+)\*)?$/);

    if (esMarca(linea)) {
      bloques.push({ tipo: 'separador', marca: linea });
    } else if (youtube) {
      bloques.push({ tipo: 'video', youtube: youtube[1] });
    } else if (imagen) {
      bloques.push({ tipo: 'imagen', alt: imagen[1], src: imagen[2], pie: imagen[3]?.trim() });
    } else if (linea.startsWith('# ')) {
      bloques.push({ tipo: 'titulo', nivel: 1, texto: linea.slice(2) });
    } else if (linea.startsWith('## ')) {
      bloques.push({ tipo: 'titulo', nivel: 2, texto: linea.slice(3) });
    } else if (linea.startsWith('### ')) {
      bloques.push({ tipo: 'titulo', nivel: 3, texto: linea.slice(4) });
    } else {
      bloques.push({ tipo: 'parrafo', texto: linea });
    }
  }

  cerrarCita();
  cerrarLista();
  return bloques;
}

export function agruparSecciones(bloques: BloqueMimo[]): SeccionMimo[] {
  const secciones: SeccionMimo[] = [];
  let actual: SeccionMimo = { titulo: null, bloques: [] };

  for (const bloque of bloques) {
    if (bloque.tipo === 'titulo' && bloque.nivel === 2) {
      if (actual.titulo || actual.bloques.length > 0) secciones.push(actual);
      actual = { titulo: bloque, bloques: [] };
    } else {
      actual.bloques.push(bloque);
    }
  }
  if (actual.titulo || actual.bloques.length > 0) secciones.push(actual);

  return secciones;
}

/* -------------------------------------------------------------
   3. HTML
------------------------------------------------------------- */
export function renderizarEnLinea(texto: string, clases: ClasesMimo = {}): string {
  const enlaces: string[] = [];
  const marcarEnlace = (etiqueta: string, href: string) => {
    const marca = `__CURSARIO_LINK_${enlaces.length}__`;
    enlaces.push(`<a href="${withBase(href)}"${atributoClase(clases.enlace)} target="_blank" rel="noopener noreferrer">${etiqueta}</a>`);
    return marca;
  };

  const conEnlaces = texto.replace(
    /\[([^\]]+)\]\((https?:\/\/[^)\s]+|\/[^)\s]+)\)/g,
    (_coincidencia, etiqueta: string, href: string) => marcarEnlace(etiqueta, href)
  );
  const conEnlacesSueltos = conEnlaces.replace(
    /(^|\s)(https?:\/\/[^\s<]+)/g,
    (_coincidencia, prefijo: string, direccion: string) => {
      const puntuacion = direccion.match(/[.,;:!?]+$/)?.[0] ?? '';
      const href = puntuacion ? direccion.slice(0, -puntuacion.length) : direccion;
      return `${prefijo}${marcarEnlace(href, href)}${puntuacion}`;
    }
  );

  const negrita = atributoClase(clases.negrita);
  const italica = atributoClase(clases.italica);
  return conEnlacesSueltos
    .replace(/\*\*\*(.+?)\*\*\*/g, `<strong${negrita}><em${italica}>$1</em></strong>`)
    .replace(/\*\*(.*?)\*\*/g, `<strong${negrita}>$1</strong>`)
    .replace(/\*(.*?)\*/g, `<em${italica}>$1</em>`)
    .replace(/`([^`]+)`/g, `<code${atributoClase(clases.codigo)}>$1</code>`)
    .replace(/__CURSARIO_LINK_(\d+)__/g, (_coincidencia, indice: string) => enlaces[Number(indice)]);
}

const renderizarSeparador = (marca: MarcaSeparador, clase?: string) =>
  marca === '+++'
    ? `<div${atributoClase(clase)} aria-hidden="true"></div>`
    : `<div${atributoClase(clase)} role="separator" aria-hidden="true"></div>`;

export function renderizarBloque(bloque: BloqueMimo, clases: ClasesMimo = {}): string {
  const enLinea = (texto: string) => renderizarEnLinea(texto, clases);

  switch (bloque.tipo) {
    case 'titulo': {
      const etiqueta = `h${bloque.nivel}` as const;
      return `<${etiqueta}${atributoClase(clases[etiqueta])}>${enLinea(bloque.texto)}</${etiqueta}>`;
    }
    case 'parrafo':
      return `<p${atributoClase(clases.parrafo)}>${enLinea(bloque.texto)}</p>`;
    case 'lista':
      return `<ul${atributoClase(clases.lista)}>${bloque.items.map((item) => `<li>${enLinea(item)}</li>`).join('')}</ul>`;
    case 'cita': {
      const contenido = bloque.partes
        .map((parte) => parte.tipo === 'separador'
          ? renderizarSeparador(parte.marca, clases.separadoresEnCita?.[parte.marca])
          : enLinea(parte.texto))
        .join(' ');
      return `<blockquote${atributoClase(clases.cita)}>${contenido}</blockquote>`;
    }
    case 'separador':
      return renderizarSeparador(bloque.marca, clases.separadores?.[bloque.marca]);
    case 'video':
      return `
        <div${atributoClase(clases.video)}>
          <iframe
           ${atributoClase(clases.marcoVideo)}
            src="https://www.youtube-nocookie.com/embed/${bloque.youtube}"
            title="Video embebido de YouTube"
            loading="lazy"
            referrerpolicy="strict-origin-when-cross-origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen>
          </iframe>
        </div>
      `;
    case 'imagen':
      return `
        <figure${atributoClase(clases.figura)}>
          <img
            src="${withBase(bloque.src)}"
            alt="${bloque.alt}"
            loading="lazy"
            decoding="async"
           ${atributoClase(clases.imagen)}>
          ${bloque.pie ? `<figcaption${atributoClase(clases.pie)}>${bloque.pie}</figcaption>` : ''}
        </figure>
      `;
  }
}

export function renderizarBloques(bloques: BloqueMimo[], clases: ClasesMimo = {}): string {
  return bloques.map((bloque) => renderizarBloque(bloque, clases)).join('\n');
}

/* -------------------------------------------------------------
   TARJETAS
   El Markdown dentro de las ínsulas, islas e islotes del lienzo.
------------------------------------------------------------- */
const CLASES_SEPARADORES: ClasesMimo['separadores'] = {
  '---': 'my-6 h-px w-full bg-ink-border/80',
  '___': 'my-3 h-px w-full bg-ink-border/55',
  '***': 'my-8 h-0.5 w-full bg-ink-primary',
  '===': 'my-0 h-2 w-full border-y border-ink-border/80',
  '+++': 'my-2 h-4 w-full',
};

export const CLASES_TARJETA: ClasesMimo = {
  cita: 'border-l-2 border-cobalt pl-3 py-1 my-2 italic text-ink-muted bg-river-mist/30 text-[11px] font-sans',
  negrita: 'font-bold text-ink-primary',
  italica: 'italic',
  enlace: 'font-semibold text-cobalt underline decoration-cobalt/40 underline-offset-2 hover:text-cobalt-dark',
  codigo: 'font-mono text-[10px] bg-paper-sheet px-1 py-0.5 rounded text-cobalt',
  h1: 'font-sans font-bold text-sm text-ink-primary mt-2 mb-1',
  h2: 'font-sans font-bold text-xs text-ink-primary mt-2 mb-1',
  h3: 'font-sans font-semibold text-xs text-ink-primary mt-1 mb-1',
  parrafo: 'text-xs text-ink-muted leading-relaxed my-1 font-sans',
  lista: 'list-disc pl-4 my-1 space-y-0.5 text-xs text-ink-muted leading-relaxed font-sans marker:text-ink-faint',
  figura: 'my-8 w-full',
  imagen: 'h-auto w-full object-contain',
  pie: 'mt-1 text-[10px] text-ink-faint italic leading-relaxed font-sans',
  video: 'my-8 aspect-video w-full overflow-hidden rounded-sm border border-ink-border/60 bg-black',
  marcoVideo: 'h-full w-full',
  separadores: CLASES_SEPARADORES,
  separadoresEnCita: { ...CLASES_SEPARADORES, '+++': 'my-1 h-2 w-full' },
};

export function renderMarkdownToHtml(markdown: string): string {
  return renderizarBloques(interpretarBloques(markdown), CLASES_TARJETA);
}
