// El sitio se publica en una subcarpeta (gastonmartino.github.io/cursario/),
// definida como `base` en astro.config.mjs. Los datos y los archivos Markdown
// siguen usando rutas desde la raíz ("/curso00/..."), y se les agrega el
// prefijo recién al generar el HTML.
const BASE = (import.meta.env?.BASE_URL ?? '/').replace(/\/+$/, '');

export function withBase<T extends string | null | undefined>(path: T): T {
  if (!path || !path.startsWith('/') || path.startsWith('//')) return path;
  if (BASE && (path === BASE || path.startsWith(`${BASE}/`))) return path;
  return `${BASE}${path}` as T;
}

// Completa la ruta de un archivo escrito solo con su nombre, buscándolo en la
// carpeta indicada. Una ruta que empieza con "/" se devuelve tal cual.
export function resolveFile(folder: string, file?: string | null) {
  return file && !file.startsWith('/') ? `${folder}/${file}` : file;
}
