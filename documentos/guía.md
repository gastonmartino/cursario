# Guía de instalación y mantenimiento de *Cursario*

Este documento explica cómo obtener, ejecutar, modificar y publicar *Cursario*. El proyecto genera un sitio estático: el navegador recibe los archivos HTML, CSS, JavaScript, imágenes y contenidos ya preparados durante la compilación.

## 1. Requisitos

Para trabajar localmente se necesita:

- Git.
- Node.js y npm. Se recomienda utilizar una versión LTS reciente compatible con Astro 5.
- Acceso al repositorio de GitHub.
- Para publicar: acceso al cPanel y al Administrador de archivos o a una cuenta FTP del hosting.

## 2. Instalación desde GitHub

En una terminal, clonar el repositorio y entrar en la carpeta del proyecto:

```bash
git clone URL_DEL_REPOSITORIO
cd cursario
```

Reemplazar `URL_DEL_REPOSITORIO` por la URL real del repositorio. Luego instalar las dependencias declaradas en `package.json`:

```bash
npm install
```

No es necesario subir ni instalar `node_modules`, `dist` o `.astro`: son carpetas generadas localmente y están excluidas del control de versiones.

## 3. Desarrollo local

Iniciar el servidor de desarrollo:

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000). El servidor está configurado para aceptar conexiones desde otros dispositivos de la red local, por lo que también puede probarse desde un teléfono o tablet usando la dirección IP de la computadora.

Comandos disponibles:

```bash
npm run dev       # servidor de desarrollo
npm run start     # alias del servidor de desarrollo
npm run build     # genera la versión estática en dist/
npm run preview   # sirve localmente la última compilación
```

Antes de publicar, ejecutar siempre:

```bash
npm run build
npm run preview
```

La previsualización permite revisar la salida final y detectar rutas, páginas o recursos faltantes antes de subirlos al hosting.

## 4. Deploy mediante cPanel

*Cursario* no necesita un servidor Node en producción si se publica como sitio estático. La compilación debe hacerse en una computadora local o en un entorno de integración continua, y luego se sube el contenido generado.

### 4.1. Generar la versión para producción

Desde la raíz del proyecto:

```bash
npm install
npm run build
```

Astro generará la carpeta `dist/`. Esa carpeta contiene la versión lista para publicar.

### 4.2. Subir los archivos

1. Ingresar al cPanel del proveedor.
2. Abrir **Administrador de archivos**.
3. Entrar en la carpeta pública del dominio, normalmente `public_html` o la carpeta asignada al dominio/subdominio.
4. Subir el contenido de `dist/`, no necesariamente la carpeta `dist` como contenedor.
5. Si existe una versión anterior, conservar una copia antes de reemplazarla.
6. Verificar que `index.html` quede directamente dentro de la carpeta pública correspondiente.
7. Confirmar que también se hayan subido las carpetas generadas para las rutas de cursos y todos los recursos estáticos.

También puede comprimirse `dist/` en un archivo ZIP, subirlo desde el Administrador de archivos, extraerlo dentro de la carpeta pública y eliminar el ZIP una vez verificado el resultado.

### 4.3. Verificación posterior

Después de publicar:

- Abrir la página principal en una ventana privada del navegador.
- Recorrer el Mapa: las cinco derivas desde el radar (o con las teclas `0` a `4`) y el ingreso a un curso con lienzo propio.
- Recorrer el Derrotero: Inicio, Obras, Bitácora, Escritos, Bio, Contacto y el buscador.
- Abrir una página de cada carta: una del cartulario (por ejemplo `/curso00/curso005/`), `/acerca-de-cursario/` (cursario) y `/grafica-generativa/` (generativa), y su modo lectura.
- Verificar imágenes, videos de YouTube, PDFs y los enlaces VOLVER, VER EL MAPA y el Aparejo.
- Confirmar que una URL profunda cargue correctamente al entrar directamente o al recargar.
- Si el hosting muestra un error 404 al actualizar una página profunda, revisar la configuración de reescritura del dominio o del servidor, según la configuración del proveedor.

La publicación no requiere ejecutar `npm run dev` ni `npm run preview` en el hosting. Esos comandos son para desarrollo y revisión local.

### 4.4. Publicación en GitHub Pages

Además del dominio propio, el sitio se publica en `https://gastonmartino.github.io/cursario/`. Esta segunda instancia se actualiza sola: el workflow `.github/workflows/deploy.yml` compila y publica el sitio en cada push a la rama `cursario-v2` (también se puede lanzar a mano desde la pestaña *Actions* del repositorio).

Como GitHub Pages sirve el sitio en una subcarpeta, el workflow compila con dos variables de entorno, que `astro.config.mjs` lee:

```text
SITE_URL=https://gastonmartino.github.io
BASE_PATH=/cursario
```

Sin esas variables (en desarrollo y en la compilación para cPanel) el sitio va en la raíz de `https://gastonmartino.xyz/`. Los datos y los Markdown se escriben **siempre** con rutas desde la raíz (`/curso00/...`): el prefijo `/cursario` se agrega solo al generar el HTML (`withBase`, en `src/utils/paths.ts`). Para probar localmente la versión de GitHub Pages:

```bash
SITE_URL=https://gastonmartino.github.io BASE_PATH=/cursario npm run build
npm run preview
```

Cuando `cursario-v2` se una a `main`, hay que cambiar en el workflow la rama que dispara la publicación.

## 5. Mapa del proyecto

### 5.1. Vocabulario

El territorio de *Cursario* se compone de tres tipos de elementos:

| Elemento | Qué es | Tarjeta |
| --- | --- | --- |
| **Ínsula** | Un curso de primer nivel (una DERIVA), en el lienzo principal | `src/components/Insula.astro` |
| **Isla** | Un subcurso, en el lienzo de su curso | `src/components/Isla.astro` |
| **Islote** | Una pieza menor asociada a una ínsula o a una isla, dibujada en el mismo lienzo que ella | `src/components/Islote.astro` |

Cada elemento se define en **dos archivos**, vinculados por el mismo `id`:

- **La estructura**, en `src/motor/Derivas.ts`: a qué curso pertenece, su carpeta en `public/`, su URL, su posición y su tamaño.
- **El contenido**, en `src/data/`: `insulas.ts`, `islas.ts` o `islotes.ts`. Allí están el código, los títulos, la etiqueta, el color, las imágenes, los Markdown y su presencia en el Derrotero.

Si un `id` de `src/data/` no existe en `Derivas.ts`, el build se detiene con un error que lo nombra.

### 5.2. Carpetas de contenido

```text
public/
├── curso00/                     ← carpeta de un curso (el "curso" de Derivas.ts)
│   ├── contenidos/              ← Markdown de la ínsula y de sus islotes
│   ├── imagenes/                ← imágenes de la ínsula y de sus islotes
│   └── subcursos/
│       └── curso001/            ← carpeta de una isla (el "subcurso" de Derivas.ts)
│           ├── contenidos/      ← Markdown de la isla
│           └── medios/          ← imágenes de la isla
├── paginas/                     ← páginas sueltas y textos del Derrotero
├── documentos/                  ← PDFs descargables
└── medios/                      ← imágenes generales (retrato)
```

En `src/data/`, las imágenes y los Markdown se escriben **solo con el nombre del archivo**, que se busca en la carpeta que corresponde:

| Elemento | Imágenes | Markdown |
| --- | --- | --- |
| Ínsula | `/{curso}/imagenes/` | `/{curso}/contenidos/` |
| Isla | `/{curso}/subcursos/{subcurso}/medios/` | `/{curso}/subcursos/{subcurso}/contenidos/` |
| Islote | `/{curso}/imagenes/` (las de su curso) | `/{curso}/contenidos/` (las de su curso) |

Una ruta que empieza con `/` se toma tal cual, para usar un archivo de otra carpeta:

```ts
imageUrl: 'portada-curso.jpg',                          // → /curso00/subcursos/curso002/medios/portada-curso.jpg
markdownFile: '/curso00/contenidos/islote-01.md',       // → tal cual
```

### 5.3. Componentes y archivos principales

| Archivo | Función |
| --- | --- |
| `src/pages/index.astro` | La portada: el Mapa y el Derrotero |
| `src/components/Mapa.astro` | El lienzo: combina el contenido (`src/data/`) con la estructura (`Derivas.ts`), dibuja las tarjetas y crea el motor |
| `src/components/Derrotero.astro` | La mitad ordenada del sitio: Inicio, Obras, Bitácora, Escritos, Bio, Contacto y buscador; incluye la costura y su manija |
| `src/components/Insula.astro`, `Isla.astro`, `Islote.astro` | Las tarjetas del lienzo |
| `src/components/HUD.astro` | Telemetría (coordenadas, escala, estado) y controles de zoom, centrado y VOLVER |
| `src/components/RadarMinimapa.astro` | El minimapa colapsable y los accesos rápidos a las derivas |
| `src/components/Aparejo.astro` | El panel de atajos de las páginas de contenido |
| `src/components/navegacion/` | Botones comunes de las páginas: VOLVER, Aparejo, menú del Derrotero, cambio de vista, volver arriba |
| `src/layouts/Layout.astro` | Documento base de la portada |
| `src/layouts/LayoutCarta.astro` | Documento base de las páginas de contenido: metadatos, transición, Aparejo, Derrotero y vista compartida |
| `src/cartas/` | Las plantillas de las páginas de contenido (ver `src/cartas/README.md`) |
| `src/cartas/rutas.ts` | Qué páginas se generan, con qué URL y qué recibe cada carta |
| `src/utils/markdown.ts` | MIMO, el intérprete de Markdown |
| `src/utils/paths.ts` | Rutas de archivos y prefijo de la subcarpeta de GitHub Pages |
| `src/motor/` | Estructura, cámara, motor, fondo generativo y cursor (ver `src/motor/README.md`) |

## 6. Atributos de contenido

### 6.1. Comunes a ínsulas, islas e islotes

| Atributo | Función |
| --- | --- |
| `id` | Vínculo con la estructura en `Derivas.ts` (obligatorio) |
| `code` | Código visible, por ejemplo `DERIVA:02`, `TFIC:04`, `OBRA:02` |
| `title`, `subtitle` | Título y subtítulo de la tarjeta y de su página |
| `description` | Texto breve de la tarjeta (admite negrita e itálica) |
| `tag` | Etiqueta del encabezado de la tarjeta (una fecha, una categoría) |
| `accentColor` | Color de acento: borde, línea de recorrido, conexiones de islotes, página |
| `imageUrl` | Imagen de la tarjeta |
| `imageCaption` | Pie de la imagen (sin imagen no se muestra) |
| `markdownFile` | Markdown breve que se muestra dentro de la tarjeta |
| `pageMarkdownFile` | Markdown de la página editorial. Sin él, el elemento no tiene página |

Una tarjeta puede tener imagen, Markdown o ambos: con los dos se muestran en columnas; con uno solo, ocupa todo el ancho.

### 6.2. Ínsulas (`src/data/insulas.ts`)

| Atributo | Función |
| --- | --- |
| `name` | Nombre corto del curso, para el HUD y los menús |
| `headerTypeLabel` | Rótulo del encabezado de la tarjeta, por ejemplo `// BITÁCORA` |
| `imageMaxHeight` | Altura máxima de la imagen de la tarjeta, en px |
| `imageBackgroundColor` | Fondo detrás de la imagen |
| `coverImageUrl` | Portada grande, usada en el Inicio del Derrotero cuando el curso es destacado |
| `thumbnailImageUrl` | Miniatura cuadrada y liviana, para las grillas del Derrotero |
| `featured` | `true`: el curso aparece destacado en el Inicio del Derrotero, con sus islas destacadas |
| `derroteroSection` | `obras`, `bitacora` o `escritos`: la ínsula aparece en esa sección del Derrotero en representación de todo su curso |
| `refloated` | `true`: el curso no tiene lienzo propio y sus islas salen a flote en el lienzo principal (ver 8.3) |
| `pageUrl` | URL propia de la página editorial, de un solo tramo (ver 6.5) |

Con `pageMarkdownFile`, el click, `Enter` e INCURSIONAR sobre la ínsula abren su página en lugar del lienzo del curso; al lienzo se llega desde la página con VER EL MAPA. La página va en `/{pageUrl}/` o, sin `pageUrl`, en `/{curso}/`.

### 6.3. Islas (`src/data/islas.ts`)

| Atributo | Función |
| --- | --- |
| `headerLabel` | Rótulo del encabezado de la tarjeta; también es el título de respaldo si no hay `title` |
| `keywords` | Palabras clave separadas por comas, que se muestran como etiquetas |
| `imageDate` | Fecha del pie de la imagen, a la derecha; el Derrotero toma de aquí el año si no lo encuentra en el subtítulo ni en la etiqueta |
| `imageBackgroundColor` | Fondo detrás de la imagen |
| `coverImageUrl`, `thumbnailImageUrl` | Portada y miniatura, fuera del lienzo. Sin miniatura, el Derrotero muestra un recuadro gris con el código |
| `featured` | `true`: aparece en el Inicio del Derrotero |
| `derroteroSection` | `obras`, `bitacora` o `escritos`: la sección del Derrotero en la que aparece. Sin definir, no aparece en ninguna (salvo en Inicio, si es destacada) |
| `pageUrl` | URL propia de la página (ver 6.5) |
| `actionHref` | Destino del botón INCURSIONAR, si debe ser distinto de la página |
| `detailHref` | Destino del click sobre toda la tarjeta, si debe ser distinto de la página |
| `showAction` | `false` oculta el botón INCURSIONAR (el click sobre la tarjeta sigue funcionando) |

El botón INCURSIONAR solo aparece si la isla tiene `pageMarkdownFile`.

### 6.4. Islotes (`src/data/islotes.ts`)

| Atributo | Función |
| --- | --- |
| `headerLabel` | Rótulo del encabezado |
| `showHeader` | `false` oculta el encabezado de la tarjeta |
| `imageMaxHeight` | Altura máxima de la imagen, en px (por defecto, 200) |
| `backgroundColor` | Color de fondo de la tarjeta |
| `keywords`, `imageDate` | Como en las islas |
| `actionHref` | Destino del botón y del click, si no es la página propia |
| `actionLabel` | Texto del botón (por defecto, `INCURSIONAR [ABRIR]`) |
| `showAction` | `false` oculta el botón |

Los islotes no aparecen en el Derrotero ni en el Aparejo.

### 6.5. URL de las páginas

| Elemento | URL |
| --- | --- |
| Isla | `/{curso}/{subcurso}/`, por ejemplo `/curso00/curso005/` |
| Islote | `/{curso}/{subcurso del islote}/`, por ejemplo `/curso00/islote003/` |
| Ínsula | `/{curso}/` |
| Isla o ínsula con `pageUrl` | `/{pageUrl}/` |
| Página suelta | `/{nombre-del-archivo}/` |

`pageUrl` se escribe sin barras, solo con minúsculas, números y guiones:

```ts
pageUrl: 'rebelion-en-la-granja-de-clics',   // → /rebelion-en-la-granja-de-clics/
```

Los archivos se siguen buscando en la carpeta de siempre. Si una URL propia se repite, o coincide con una carpeta de `public/` (como `curso01`), el build se detiene con un error.

## 7. Cómo añadir una nueva isla (subcurso)

1. Crear la carpeta pública con sus dos subcarpetas:

```text
public/curso02/subcursos/curso007/
├── contenidos/
└── medios/
```

2. Guardar en `contenidos/` los Markdown (el de la tarjeta, el de la página o ambos) y en `medios/` las imágenes. Los nombres son libres; por convención se usan `contenido-curso.md`, `pagina-curso.md`, `portada-curso.jpg` y `miniatura.jpg`.

3. En `src/motor/Derivas.ts`, agregar la estructura dentro del arreglo `subcursos` del curso:

```ts
{
  id: 'gen-serie-07',
  subcurso: 'curso007',   // su carpeta y el segundo tramo de su URL
  x: 2800,                // centro de la tarjeta en el lienzo del curso
  y: 0,
  ancho: 640,             // ancho de la tarjeta, en px
  alto: 900,              // altura mínima de la tarjeta, en px
},
```

4. En `src/data/islas.ts`, agregar el contenido con el mismo `id`:

```ts
{
  id: 'gen-serie-07',
  derroteroSection: 'obras',
  imageUrl: 'portada-curso.jpg',
  thumbnailImageUrl: 'miniatura.jpg',
  markdownFile: 'contenido-curso.md',
  pageMarkdownFile: 'pagina-curso.md',
  code: 'SERIE:07',
  title: 'Título de la isla',
  subtitle: 'Subtítulo opcional',
  tag: '2026',
  accentColor: '#16253D',
  imageCaption: 'PROCESSING / P5.JS',
  headerLabel: 'SERIE GENERATIVA',
},
```

5. Ejecutar `npm run build`: Astro genera la página `/curso02/curso007/` (o `/{pageUrl}/`), y la isla aparece en el lienzo, el radar, el Aparejo y, según sus atributos, en el Derrotero.

El orden de las islas en `subcursos` es el orden de la línea de recorrido que las une en el lienzo.

## 8. Posiciones y tamaños en el lienzo

Todas las posiciones se definen en `src/motor/Derivas.ts`:

- `x` e `y` son el **centro** de la tarjeta. `x` positivo desplaza hacia la derecha e `y` positivo hacia abajo.
- `ancho` es el ancho de la tarjeta y `alto` su altura mínima. Conviene que `alto` coincida con la altura real de la tarjeta (se puede medir en el navegador): el motor la usa para centrar la tarjeta, calcular la vista inicial y el minimapa, y dibujar las conexiones.

### 8.1. Sistemas de coordenadas

- **Ínsulas**: coordenadas del lienzo principal.
- **Islas**: coordenadas del lienzo de su curso, independientes del lienzo principal.
- **Islotes**: las del elemento al que pertenecen (`idSuperior`): un islote de una ínsula usa las del lienzo principal; un islote de una isla, las del lienzo de su curso.

### 8.2. Vista inicial

Al abrir un lienzo, la cámara se centra en el conjunto de las tarjetas, con un zoom del 70 % en escritorio (en el celular, el que hace entrar 1,25 tarjetas de ancho), y se ajusta para que la tarjeta de más arriba quede visible debajo del HUD. Los islotes no cuentan para ese cálculo. El algoritmo completo está en `src/motor/README.md`.

La última vista de cada lienzo se recuerda en el navegador. Para ver la vista inicial después de cambiar posiciones, usar CENTRAR (`R`) o borrar el dato `cursario:vistas` del almacenamiento local del navegador.

### 8.3. Ínsulas reflotadas

En una ínsula con `refloated: true` (en `src/data/insulas.ts`), las coordenadas de sus islas, y de los islotes de esas islas, se escriben **relativas al centro de la ínsula**: al mover la ínsula se mueve todo el conjunto. Así está hoy `arte-electronico` (DERIVA:01).

## 9. Cómo añadir un islote

1. Guardar sus archivos en las carpetas de su curso (`/{curso}/imagenes/` y `/{curso}/contenidos/`), o en otra carpeta escribiendo la ruta completa desde `/`.

2. En `src/motor/Derivas.ts`, agregar la estructura a `DERIVAS_ISLOTES`:

```ts
{
  id: 'islote-generativa-02',
  idSuperior: 'gen-serie-03',   // la ínsula o la isla a la que pertenece
  subcurso: 'islote019',        // segundo tramo de su URL, si tiene página
  x: 900,
  y: -600,
  ancho: 420,
  alto: 430,
},
```

3. En `src/data/islotes.ts`, agregar el contenido con el mismo `id`, con los atributos de las secciones 6.1 y 6.4.

El islote se dibuja en el mismo lienzo que su elemento superior, unido a él por una línea fina y punteada.

## 10. Cómo añadir un nuevo curso (ínsula)

1. Crear la carpeta `public/curso05/` con `contenidos/`, `imagenes/` y `subcursos/`.

2. En `src/motor/Derivas.ts`, agregar una entrada a `DERIVAS_INSULAS`:

```ts
{
  id: 'nuevo-curso',
  curso: 'curso05',   // su carpeta y el primer tramo de sus URLs
  x: 1600,
  y: 1800,
  ancho: 760,
  alto: 1000,
  subcursos: [],      // sus islas (ver sección 7)
},
```

3. En `src/data/insulas.ts`, agregar su contenido con el mismo `id` y un `code` correlativo (`DERIVA:05`). La tarjeta se genera sola en el lienzo principal.

4. Agregar los accesos que hoy están escritos a mano para las cinco derivas:
   - en `src/components/RadarMinimapa.astro`, un botón con `data-fly-to="nuevo-curso"`;
   - en `src/motor/MotorCursario.ts`, el atajo de teclado correspondiente (el `switch` de las teclas `0` a `4`).

5. Ejecutar `npm run build` y revisar el lienzo principal, el lienzo del nuevo curso, el radar, el Aparejo y el Derrotero.

El curso punteado en rojo del lienzo principal une las ínsulas en el orden de sus códigos. Un curso sin islas no tiene lienzo propio: su tarjeta no muestra INCURSIONAR.

## 11. Páginas de contenido y cartas

Cada página de contenido la arma una **carta**: una plantilla que decide por completo cómo se muestra su Markdown. El Markdown la elige en su encabezado de datos, entre dos líneas `---` al comienzo del archivo:

```markdown
---
carta: cursario
---
# Título
```

Sin encabezado o sin el dato `carta`, se usa el **cartulario**, la carta estándar. Las cartas disponibles son `cartulario`, `cursario` y `generativa`. Si el nombre no corresponde a ninguna, el build falla con un mensaje que lista las disponibles.

Las páginas con una carta distinta del cartulario tienen además una versión en **modo lectura**, armada con el cartulario, en `{URL de la página}cartulario/`, y un control flotante para pasar de una versión a otra. Para elegir qué imágenes aparecen en el modo lectura, se agrega `{lectura}` al final de su línea; con `lectura-imagenes: ninguna` en el encabezado, no aparece ninguna.

Todo lo relativo a las cartas está en `src/cartas/README.md`: qué recibe cada una, cómo se escriben sus estilos para no afectar a las demás, cómo reparten el contenido la carta *cursario* y la *generativa*, y cómo crear una carta nueva (alcanza con crear su carpeta con un `Carta.astro`).

### 11.1. Páginas sueltas

Cada archivo `.md` de `public/paginas/` se publica en `/{nombre-del-archivo}/`. Sus datos van en el encabezado:

```markdown
---
carta: cursario
titulo: Cursario
codigo: ACERCA DE
etiqueta: MANIFIESTO V1.0
color: #0038A8
descripcion: Acerca del proyecto CURSARIO.
---
```

Un archivo con `publicar: no` no se publica como página. Así están `bio.md` y `contacto.md`, que usa el Derrotero:

- `bio.md`: el texto de la sección Bio; el retrato se indica con `retrato:` en el encabezado.
- `contacto.md`: un dato por título `##`, con su valor debajo; un separador `---` pasa a la columna siguiente.

## 12. Cómo escribir el Markdown

Los Markdown se leen durante la compilación con MIMO (`src/utils/markdown.ts`), un intérprete acotado. Si falta el Markdown de una página (`pageMarkdownFile`), el build se detiene; si falta el de una tarjeta (`markdownFile`), la tarjeta se genera sin texto y el error solo aparece en la consola del build.

### 12.1. Sintaxis reconocida

```markdown
# Título principal
## Título secundario
### Título terciario

Párrafos con **negrita**, *itálica*, ***ambas*** y `código en línea`.

- Ítem de una lista sin orden
* También con asterisco

> Una cita destacada.
```

No se reconocen tablas, listas numeradas ni listas anidadas. Las líneas en blanco no cortan una lista; cualquier otro bloque sí.

### 12.2. Separadores

Una de estas cadenas, sola en una línea (con o sin espacios alrededor), genera un separador:

```markdown
---
___
***
===
+++
```

- `---`: línea gris con espaciado medio.
- `___`: línea gris fina, con la mitad del espaciado de `---`.
- `***`: línea negra gruesa con más espaciado. Solo se interpreta así cuando está sola, así que no interfiere con `***énfasis***` dentro de un párrafo.
- `===`: línea doble gris, sin margen vertical.
- `+++`: bloque blanco de separación.

También pueden usarse dentro de una cita, con `>` al comienzo de la línea (`> ---`); allí `+++` reduce su espacio a la mitad.

El aspecto final de cada separador depende de la carta: lo descripto corresponde al cartulario. Algunas cartas, como *cursario*, usan `---` para repartir el contenido.

### 12.3. Imágenes

Guardar la imagen dentro de `public/` y referenciarla con una ruta desde la raíz, comenzando por `/`:

```markdown
![Recorrido por el Arroyo del Rey](/curso00/subcursos/curso005/medios/recorrido-001.jpg)
```

No usar rutas relativas al propio Markdown como `./medios/recorrido-001.jpg`. El prefijo de GitHub Pages se agrega solo.

Para agregar un pie, escribir el texto en itálica inmediatamente después de la imagen, en la misma línea:

```markdown
![Recorrido por el Arroyo del Rey](/curso00/subcursos/curso005/medios/recorrido-001.jpg) *Recorrido del Arroyo del Rey, Longchamps — 31 de agosto de 2026.*
```

En las páginas con modo lectura, la marca `{lectura}` al final de la línea indica que la imagen también se muestra en esa versión.

### 12.4. Videos de YouTube

Una línea independiente con el identificador de once caracteres del video:

```markdown
[youtube:nnM_C6h1D_A]
```

En `https://youtu.be/nnM_C6h1D_A` o `https://www.youtube.com/watch?v=nnM_C6h1D_A`, el identificador es `nnM_C6h1D_A`. Para un video vertical, como un Short, se agrega `vertical`; el reproductor toma la proporción 9:16:

```markdown
[youtube:k5DIJFpFXfs vertical]
```

Los videos se cargan en diferido desde `youtube-nocookie.com`.

### 12.5. Enlaces

```markdown
[Repositorio de Cursario en GitHub](https://github.com/gastonmartino/cursario)
```

También se reconocen las URLs escritas directamente. Los enlaces a otros sitios y a archivos (como un PDF de `public/documentos/`) se abren en una pestaña nueva; los correos (`mailto:`) y las páginas del propio sitio (`/ruta/`), en la misma.

## 13. Comprobaciones antes de publicar

1. Revisar que los nombres de archivo coincidan exactamente con los declarados, incluyendo mayúsculas, acentos y extensiones (el hosting distingue mayúsculas de minúsculas aunque la computadora no lo haga).
2. Confirmar que cada `id` de `src/data/` tenga su entrada en `src/motor/Derivas.ts`.
3. Comprobar que `alto` de las tarjetas nuevas se corresponda con su altura real.
4. Ejecutar `npm run build` y corregir cualquier error.
5. Probar la navegación local con `npm run preview`, en escritorio y en un ancho de celular.
6. Subir el contenido de `dist/` al directorio público del hosting (la instancia de GitHub Pages se publica sola con el push).
7. Limpiar la caché del navegador o del proveedor si todavía se muestra una versión anterior.
