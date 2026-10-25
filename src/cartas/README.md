# Cartas

Las **cartas** son las plantillas con las que se arman las páginas de contenido
del Cursario: las de los subcursos e islotes que tienen `pageMarkdownFile` y las
páginas sueltas (como "Acerca de"). Cada carta decide por completo cómo se
muestra el contenido de su archivo Markdown: su estructura, sus estilos, sus
tipografías y sus scripts. Varias páginas pueden compartir una misma carta.

## Cómo elige una página su carta

En el encabezado de datos del archivo Markdown, entre dos líneas `---` al
comienzo:

```markdown
---
carta: cartulario
---
# Título

Texto…
```

Sin encabezado, o sin el dato `carta`, se usa el **cartulario**, la carta
estándar. Si el nombre no corresponde a ninguna carta, el build falla con un
mensaje que lista las disponibles.

El encabezado puede tener otros datos (una línea `clave: valor` por dato), que
la carta recibe y puede usar como opciones propias: un color de fondo, una
cantidad de columnas, una variante…

## Estructura

```
src/cartas/
├── index.ts            ← registro de cartas y tipos (PropsCarta)
├── README.md
└── cartulario/         ← una carpeta por carta; su nombre es el de la carta
    ├── Carta.astro     ← componente principal (obligatorio)
    └── clases.ts       ← archivos propios de la carta (opcionales)
```

Para crear una carta nueva alcanza con crear su carpeta con un `Carta.astro`:
`src/cartas/index.ts` las encuentra solas. Dentro de la carpeta puede haber
todo lo que la carta necesite: subcomponentes, hojas de estilo, scripts,
datos.

## Qué recibe una carta (`PropsCarta`)

- **`pagina`**: `titulo`, `subtitulo`, `codigo`, `etiqueta` y `color`. En los
  subcursos e islotes salen de `src/data/islas.ts` o `islotes.ts`; en las
  páginas sueltas, del encabezado de datos.
- **`documento`**: el Markdown interpretado por MIMO (`src/utils/markdown.ts`):
  - `datos`: el encabezado de datos, incluidas las opciones de la carta.
  - `bloques`: la lista de bloques en orden (`titulo`, `parrafo`, `lista`,
    `cita`, `imagen`, `video`, `separador`).
  - `secciones`: los bloques agrupados en secciones, una por cada título `##`.
- **`volver`**: la ruta a la que lleva VOLVER.
- **`vistas`**: solo en las páginas con modo lectura (ver más abajo). La carta
  se lo pasa a `LayoutCarta` (`<LayoutCarta vistas={vistas} …>`).

Con los bloques y las secciones una carta puede recomponer el contenido: usar
la primera imagen como portada, reunir todas las imágenes en una galería,
mostrar cada sección como una columna o una lámina, sacar las citas al margen…
Para convertir bloques en HTML, MIMO ofrece:

- `renderizarBloques(bloques, clases?)` y `renderizarBloque(bloque, clases?)`.
- `renderizarEnLinea(texto, clases?)`, para el texto de un bloque (negritas,
  itálicas, enlaces, código).

El parámetro `clases` (`ClasesMimo`) indica la clase CSS de cada elemento. Sin
él, el HTML sale limpio, sin clases, para estilizarlo con el CSS de la carta.

## Lo común a todas las cartas

Toda carta usa `src/layouts/LayoutCarta.astro`, que aporta solo lo
indispensable y no impone fondo, tipografías ni colores:

- los metadatos de la página (`title`, `description`);
- la **transición** entre páginas;
- el **Aparejo**: un panel, desde la derecha, con atajos a otras páginas
  (`src/components/Aparejo.astro`);
- el **Derrotero** (el panel "Gastón Martino // Currículum") y su manija, con
  el aspecto del sitio, fuera de la carta.

La carta ubica y estiliza los dos elementos de navegación obligatorios:

- `Volver` (`src/components/navegacion/Volver.astro`): el enlace para volver,
  arriba a la izquierda.
- `BotonAparejo` (`src/components/navegacion/BotonAparejo.astro`): el botón que
  abre el Aparejo, arriba a la derecha. Su ícono es un índice.

Los dos aceptan `class` (y `Volver`, también `style`), y su contenido se puede
reemplazar: otro texto para VOLVER, otro ícono para el Aparejo.

### El lugar de la página

Con **vista compartida** (desde 1024 px de ancho), la página comparte la
pantalla con el Derrotero, separados por la costura: ocupa el lugar del Mapa,
a la izquierda, y la manija permite ensanchar o cerrar el Derrotero. Sin vista
compartida, la página ocupa toda la pantalla y no hay Derrotero ni manija.

`LayoutCarta` dibuja la carta dentro de `.vista-pagina`, cuyo ancho es el de
ese lugar. Por eso una carta:

- **no mide con la ventana**: en lugar de `vw` usa porcentajes del ancho de su
  contenedor, y en lugar de media queries por ancho de ventana elige su
  composición según el ancho de `.vista-pagina` (la carta "cursario" lo hace
  con un script en el `<head>`, que anota `data-composicion` en `<html>`);
- **corre lo que fija a la derecha de la ventana** con la variable
  `--derecha-pagina` (lo que le quita el Derrotero), por ejemplo
  `right: calc(var(--derecha-pagina, 0px) + 20px)`.

## Estilos de cada carta

Los estilos de una carta se escriben dentro de su carpeta. Como el registro
de cartas importa todas las cartas, **el CSS de todas llega a todas las páginas
de cartas**: lo que evita que una carta afecte a las demás es cómo se escriben
sus reglas.

- **Un `<style>` en `Carta.astro`** (o en sus subcomponentes): Astro lo limita
  automáticamente a ese componente, así que no afecta a otras cartas.
- **Estilos globales de la página** (el `body`, el HTML que genera MIMO, la
  barra de desplazamiento, `#page-transition`): un `<style is:global>` en
  `Carta.astro`, con **cada regla bajo una clase propia de la carta** en
  `<html>` o `<body>` (las que la carta pasa a `LayoutCarta` como `claseHtml` y
  `claseCuerpo`). Por ejemplo, `html.html-cursario ::selection { … }`, nunca
  `::selection { … }` solo. Lo mismo vale para una hoja de estilos propia
  importada desde `Carta.astro`.
- **Tipografías**: la carta las carga en el `<head>` con
  `<Fragment slot="head">…</Fragment>` dentro de `LayoutCarta`.
- **Scripts**: un `<script>` en la carta se incluye solo en sus páginas.
- **Transición**: para cambiar su aspecto, la carta redefine `#page-transition`
  en sus estilos globales, bajo su clase (`html.html-cursario #page-transition`).

**Tamaños de letra**: los textos de lectura (párrafos, descripciones) van en
cuerpos de más de 12 px, también en escritorio, y nunca por debajo de 12 px en
el celular. Los rótulos breves en mayúsculas y en una tipografía condensada
(pies, filas de un cartucho) pueden ir más chicos.

Del sitio, a toda página llegan dos cosas, que la carta puede usar o pisar:

- **Tailwind**: sus clases solo se aplican donde se usan, y su restablecimiento
  de estilos base (márgenes en cero, títulos sin tamaño propio, listas sin
  viñetas…) se aplica a todas las páginas. Una carta que quiera otros estilos
  base los declara en su CSS.
- **El Aparejo y el Derrotero**, que conservan el aspecto del sitio.

## Modo lectura

Toda página que usa una carta distinta del cartulario tiene una segunda
versión, armada con el cartulario, en `{URL de la página}cartulario/` (por
ejemplo `/acerca-de-cursario/cartulario/`). Las genera
`src/cartas/rutas.ts`.

- `LayoutCarta` agrega en las dos versiones un control flotante, abajo a la
  derecha, para pasar de una a otra (`src/components/navegacion/CambioVista.astro`).
  Su aspecto es siempre el del sitio, sea cual sea la carta.
- La elección se recuerda por página en el navegador: quien eligió el modo
  lectura en una página entra directamente a esa versión la próxima vez, hasta
  que elija "Ver la carta original".

En el Markdown se indica qué imágenes aparecen en modo lectura (la carta
original las usa siempre todas):

- Sin marcas, se muestran todas.
- Si alguna imagen tiene la marca `{lectura}` al final de su línea, se
  muestran solo las marcadas:

  ```markdown
  ![Velero](/paginas/acerca-de-cursario/medios/barco-grabado.png) *LÁMINA I* {lectura}
  ```

- Con `lectura-imagenes: ninguna` en el encabezado de datos, no se muestra
  ninguna.

## Páginas sueltas

Cada archivo `.md` de `public/paginas/` se publica en `/{nombre-del-archivo}/`
(lo hace `src/pages/[pagina].astro`). Sus datos van en el encabezado:

```markdown
---
carta: cartulario
titulo: Gastón Martino
codigo: ACERCA DE
etiqueta: BIO
color: #0038A8
descripcion: Acerca de Gastón Martino.
---
```

VOLVER lleva a la portada.

## El cartulario

La carta estándar: el aspecto del Cursario (papel, paleta, Geist), una barra
superior con VOLVER, INICIO, la etiqueta del curso y el botón del Aparejo, y el
contenido en una hoja blanca centrada. En pantallas de menos de 768 px, el
contenido va directo sobre un fondo blanco, sin el marco de la hoja, y la barra
no muestra la etiqueta del curso, para quedar en una sola fila. Las clases con que muestra cada elemento
del Markdown están en `cartulario/clases.ts`.

## Cursario

Una carta experimental con forma de carta náutica. La gráfica vectorial
(marco graduado, sondeos, curvas de profundidad, rosas de los vientos,
recuadros negros) se genera en cada build (`cursario/grafica.ts`).

Tiene una composición por rango de ancho de ventana, en
`cursario/composicion.ts`:

- **xl** (desde 1280 px): la hoja con marco sobre un fondo más oscuro;
- **lg** (de 930 a 1279 px): el papel como fondo, sin marco, con textos y
  láminas en una columna central de 920 px y VOLVER y el Aparejo fijos en la
  ventana. Muestra solo algunas láminas (las que tienen lugar).
- **md** (de 620 a 929 px): como lg, con una columna de
  600 px y el texto siempre de un solo lado en cada franja (del otro lado,
  gráficos).
- **sm** (de 420 a 619 px): una sola columna de 400 px,
  quebrada por las láminas y los recuadros, con los textos alternando entre
  izquierda y derecha; VOLVER y el Aparejo en las esquinas de la ventana.
- **xs** (hasta 419 px): una columna de 300 px que entra completa desde los
  320 px, con varias láminas y recuadros al corte a un lado o al otro.

Las láminas al corte pueden quedar recortadas por la ventana, pero los textos
no: si una va al corte por la izquierda, `sangriaPie` corre su pie hacia
adentro.

Los nombres siguen la escala de Bootstrap y Tailwind (xl, lg, md, sm, xs),
pero los cortes son los de la carta.

El contenido se escribe una sola vez en el HTML, con su lugar en cada
composición, y el CSS de `Carta.astro` elige cuál usar; la gráfica sí se
genera una vez por composición. El contenido del Markdown se reparte así:

- el título `#`, en la cabecera;
- las imágenes, en los lugares de `imagenes` de cada composición, en orden (el texto en
  itálica que sigue a cada una es su pie);
- los párrafos anteriores al primer `##`, como notas en los recuadros;
- cada `##`, escrito en curva alrededor de una rosa, o como título recto en
  bermellón en las composiciones que le dan lugar (`encabezados`);
- los ítems de las listas, como topónimos (la parte en negrita es el nombre);
- los párrafos después de un `---`, en el cartucho.
