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

// URL de la página de un subcurso o islote. Tiene que coincidir con la ruta
// que genera src/pages/[curso]/[subcurso].astro: una página por cada ítem
// que tiene pageMarkdownFile.
export function pageHref(item: { course: string; subcurso: string; pageMarkdownFile?: string | null }) {
  return item.pageMarkdownFile ? `/${item.course}/${item.subcurso}/` : undefined;
}
