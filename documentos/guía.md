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
- Probar el ingreso a los cuatro cursos.
- Probar una subderiva de cada curso y una página editorial directa.
- Verificar imágenes, videos de YouTube, enlaces `VOLVER` e `INICIO`.
- Confirmar que una URL profunda, por ejemplo `/curso00/curso005/`, cargue correctamente.
- Si el hosting muestra un error 404 al actualizar una página profunda, revisar la configuración de reescritura del dominio o del servidor, según la configuración del proveedor.

La publicación no requiere ejecutar `npm run dev` ni `npm run preview` en el hosting. Esos comandos son para desarrollo y revisión local.

## 5. Componentes principales de Astro

### `Layout.astro`

Es la estructura base de las páginas. Define metadatos, tipografías, estilos globales, comportamiento de scroll y el marco visual común.

### `InfiniteCanvas.astro`

Es la vista principal del sitio. Combina el canvas de navegación, las tarjetas HTML de cursos y subderivas, la cortina de transición, el HUD y el radar. También carga los contenidos Markdown de las tarjetas principales y vincula cada subderiva con su definición de datos.

### `IslandCard.astro`

Es la tarjeta visual utilizada para representar cursos y subderivas. Puede recibir una imagen, contenido Markdown o ambos. También administra títulos, subtítulos, descripciones, palabras clave, metadatos, acciones de navegación y el comportamiento visual responsive de sus contenidos.

### `HUD.astro`

Es la interfaz flotante de orientación. Muestra coordenadas, escala, estado de la navegación y controles para acercar, alejar, centrar y volver desde una deriva.

### `RadarMinimap.astro`

Es el radar/minimapa colapsable. Representa la posición de la cámara, ofrece accesos rápidos a los cursos principales y cambia su información cuando se ingresa en una deriva local.

### `src/pages/[curso]/[subcurso].astro`

Es la plantilla de las páginas editoriales de tercer nivel. Astro genera una ruta por cada subderiva con `pageMarkdownFile` definido y allí se presenta el contenido largo, la navegación editorial y los medios incluidos en el Markdown.

### Archivos del motor

Los archivos de `src/engine/` controlan la parte espacial:

- `Camera.ts`: cámara, zoom y coordenadas del mundo.
- `CanvasController.ts`: interacción, eventos, selección, transiciones y sincronización con la interfaz.
- `GenerativeSurface.ts`: retículas, textura, corrientes, líneas de fuerza y elementos dibujados en el canvas.
- `InkCursor.ts`: cursor gráfico, estela y partículas.
- `Derivas.ts`: definición de los cursos principales y las posiciones de sus subderivas.

## 6. Atributos de contenido y navegación de `IslandCard`

Las tarjetas utilizan atributos relacionados con el contenido y la navegación. Algunos se definen en `src/data/subcursos.ts`, otros se calculan en `src/components/InfiniteCanvas.astro` y finalmente son recibidos por `src/components/IslandCard.astro`.

### `markdownHtml`

Es contenido Markdown ya convertido a HTML antes de llegar a la tarjeta. Se usa principalmente para el contenido introductorio de los cursos principales:

```astro
<IslandCard markdownHtml={curso00MarkdownHtml} />
```

No se define en `subcursos.ts`. Para las subderivas se utiliza normalmente `markdownFile`.

### `markdownFile`

Es la ruta pública al Markdown breve que aparece dentro de la tarjeta de una subderiva. Se define en `src/data/subcursos.ts`:

```ts
markdownFile: '/curso00/subcursos/curso005/contenidos/contenido-curso.md',
```

Es opcional. Sin este atributo, la tarjeta puede mostrar sólo una imagen. Con el archivo y sin imagen, muestra una sola columna de texto; con ambos, muestra imagen y texto.

### `pageMarkdownFile`

Es la ruta pública al Markdown extendido de la página editorial de tercer nivel:

```ts
pageMarkdownFile: '/curso00/subcursos/curso005/contenidos/pagina-curso.md',
```

Ese archivo se presenta en una ruta como `/curso00/curso005/`. Es el indicador de que la subderiva tiene una página editorial disponible. Si no está definido, no aparece el botón de acción ni se habilita el click general de la tarjeta hacia una página de detalle.

### `actionHref`

Es la URL de destino de una acción de navegación. Puede definirse opcionalmente en `subcursos.ts`:

```ts
actionHref: '/curso00/curso005/',
```

Si no se indica, `InfiniteCanvas.astro` construye automáticamente `/${course}/${subcurso}/` cuando existe `pageMarkdownFile`. Define el destino del botón `INCURSIONAR`; el botón sigue dependiendo de que exista una página editorial válida.

### `detailHref`

Es el destino al hacer click sobre cualquier parte de la tarjeta. Al igual que `actionHref`, puede definirse directamente en la definición de la subderiva dentro de `src/data/subcursos.ts`:

```ts
detailHref: '/curso00/curso005/',
```

Para las subderivas se pasa desde `InfiniteCanvas.astro`, con estos valores de fallback:

```astro
detailHref={subcurso.detailHref || subcurso.actionHref || (subcurso.pageMarkdownFile
  ? `/${subcurso.course}/${subcurso.subcurso}/`
  : undefined)}
```

La navegación completa de la tarjeta es independiente de `showAction`: aunque el botón esté oculto, el click puede seguir llevando a `detailHref`. Si no existe `detailHref`, la tarjeta no navega al hacer click fuera de sus controles.

### `actionLabel`

Es el texto visible del botón de acción:

```astro
actionLabel="INCURSIONAR [ABRIR]"
```

Si no se indica, se utiliza `INCURSIONAR [CLICK / ENTER]`. Sólo cambia la etiqueta visual; no define el destino.

### `showAction`

Controla exclusivamente si se incluye el botón de acción. Para una subderiva se define en `src/data/subcursos.ts`:

```ts
showAction: false,
```

Es opcional y por defecto vale `true` mediante:

```astro
showAction={subcurso.showAction ?? true}
```

Por lo tanto, `showAction: false` oculta el botón, pero no desactiva el click general mediante `detailHref`. Además, si no existe `pageMarkdownFile`, el botón no aparece aunque `showAction` sea `true`.

### Resumen rápido

| Atributo | Función | Lugar habitual |
| --- | --- | --- |
| `markdownHtml` | HTML ya generado para una tarjeta | `InfiniteCanvas.astro` |
| `markdownFile` | Markdown breve dentro de la tarjeta | `src/data/subcursos.ts` |
| `pageMarkdownFile` | Markdown de la página editorial | `src/data/subcursos.ts` |
| `actionHref` | Destino del botón de acción | `src/data/subcursos.ts` o calculado |
| `detailHref` | Destino del click sobre toda la tarjeta | `src/data/subcursos.ts` |
| `actionLabel` | Texto visible del botón | Instancia de `IslandCard` |
| `showAction` | Muestra u oculta el botón | `src/data/subcursos.ts` |

## 7. Cómo añadir un nuevo curso principal

Un curso principal necesita una definición espacial, una tarjeta visible en la vista macro, una entrada en el radar, una carpeta pública para sus contenidos y, normalmente, subderivas asociadas.

### Pasos

1. Crear en `public/` una carpeta con el identificador del curso, por ejemplo `public/curso04/`, y dentro sus carpetas de contenidos, imágenes y subcursos.
2. En `src/engine/Derivas.ts`, agregar una nueva entrada a `SPATIAL_DERIVAS` con:
   - `id` único;
   - `code`, `name`, `subtitle` y `description`;
   - `x`, `y`, `width` y `height` iniciales;
   - `accentColor` y `tag`;
   - `type` apropiado;
   - arreglo `items` con las subderivas espaciales.
3. En `src/components/InfiniteCanvas.astro`, agregar la tarjeta principal del nuevo curso. Allí se indica la imagen, el Markdown inicial, el código, la descripción, la región y las dimensiones de la tarjeta.
4. En `src/components/RadarMinimap.astro`, agregar un botón de acceso rápido con `data-fly-to` apuntando al nuevo `id`.
5. Si el nuevo identificador debe formar parte del catálogo de subderivas, ampliar los tipos de `src/data/subcursos.ts` (`course` y `parentDerivaId`) y agregar las definiciones correspondientes.
6. Crear los Markdown e imágenes con las rutas que se hayan declarado.
7. Ejecutar `npm run build` y revisar que la nueva región, sus enlaces y sus páginas se generen correctamente.

El motor espacial recorre `SPATIAL_DERIVAS` de forma general, pero los cuatro cursos actuales aparecen escritos explícitamente en la tarjeta macro y en los botones del radar. Por eso esos dos archivos requieren una modificación manual al incorporar un quinto curso.

## 8. Cómo modificar las posiciones en el canvas

Las posiciones de los cursos principales y sus subderivas se definen en `src/engine/Derivas.ts`.

- Para mover un curso principal, modificar sus valores `x` y `y` dentro de `SPATIAL_DERIVAS`.
- Para mover una subderiva, modificar `x` y `y` dentro del arreglo `items` de su curso.
- `x` positivo desplaza hacia la derecha y `y` positivo hacia abajo.
- `width` y `height` definen el tamaño espacial de cada tarjeta.
- En `src/data/subcursos.ts`, `cardWidth` y `cardHeight` permiten ajustar el tamaño de la tarjeta HTML correspondiente sin modificar necesariamente la geometría base del motor.

Después de cambiar posiciones, revisar el encuadre automático, las conexiones entre tarjetas, el radar y el comportamiento en pantallas pequeñas. No es necesario cambiar la lógica para agregar o quitar elementos del arreglo `items`: el encuadre y el radar se calculan recorriendo todos los elementos existentes.

Para conservar una composición particular, conviene modificar las coordenadas de los elementos en conjunto. Por ejemplo, una fila horizontal usa valores de `x` progresivos y valores de `y` iguales o cercanos; dos filas usan un segundo grupo con un `y` mayor. Si se cambia el orden visual, también puede ser necesario revisar el orden de los elementos en `items`, porque las conexiones siguen ese orden.

## 9. Cómo añadir una nueva subderiva

Cada subderiva se define en dos lugares relacionados:

- `src/data/subcursos.ts`: identidad editorial y rutas de contenido.
- `src/engine/Derivas.ts`: posición y geometría dentro de la deriva local.

### Pasos

1. Crear la carpeta pública, por ejemplo:

```text
public/curso02/subcursos/curso007/
├── contenidos/
└── medios/
```

2. Copiar o crear dentro de `contenidos/` los archivos `contenido-curso.md` y `pagina-curso.md`, si la subderiva tendrá resumen y página editorial.
3. Copiar o agregar dentro de `medios/` la portada y los recursos de la subderiva.
4. Agregar un objeto a `SUBCURSOS` con un `subcurso` y `itemId` únicos. Declarar las rutas con barra inicial, por ejemplo:

```ts
{
  course: 'curso02',
  parentDerivaId: 'generativa',
  subcurso: 'curso007',
  itemId: 'gen-serie-07',
  imageUrl: '/curso02/subcursos/curso007/medios/portada-curso.jpg',
  markdownFile: '/curso02/subcursos/curso007/contenidos/contenido-curso.md',
  pageMarkdownFile: '/curso02/subcursos/curso007/contenidos/pagina-curso.md',
  code: 'SUBCURSO:02.7',
  title: 'Título de la subderiva',
  subtitle: 'Subtítulo opcional',
  description: 'Descripción breve opcional.',
  keywords: 'palabra uno, palabra dos, palabra tres',
  tag: 'CATEGORÍA',
  accentColor: '#16253D',
  categoryLabel: 'TIPO DE PIEZA',
  timeReference: '2026',
  captionLabel: 'GEN #07',
}
```

5. Agregar en el arreglo `items` del curso correspondiente una definición con el mismo `itemId`, código, tamaño y coordenadas:

```ts
{
  id: 'gen-serie-07',
  code: 'SERIE:07',
  title: 'Título breve para el canvas',
  subtitle: 'Referencia breve',
  summary: 'Resumen de apoyo para la escena espacial.',
  x: 2800,
  y: 0,
  width: 640,
  height: 660,
  accentColor: '#16253D',
  tag: 'PROCESSING',
}
```

6. Si no existe `imageUrl`, la tarjeta sólo mostrará el Markdown. Si no existe `markdownFile`, mostrará únicamente la imagen. Si no existe `pageMarkdownFile`, no mostrará el botón de acceso al detalle.
7. Ejecutar `npm run build` para que Astro genere automáticamente la nueva ruta `/curso02/curso007/`.

## 10. Cómo crear el Markdown de una subderiva

Hay dos archivos con funciones diferentes:

- `contenido-curso.md`: resumen breve que aparece dentro de la tarjeta en la deriva local. Es opcional.
- `pagina-curso.md`: contenido extendido de la página editorial de tercer nivel. Es necesario para que aparezca el botón de detalle de una subderiva.

Los archivos deben guardarse en la carpeta pública declarada en `src/data/subcursos.ts`. Por ejemplo:

```text
public/curso00/subcursos/curso005/contenidos/
├── contenido-curso.md
└── pagina-curso.md
```

El contenido se escribe en Markdown. El conversor actual reconoce:

```markdown
# Título principal
## Título secundario
### Título terciario

Párrafos normales con **negrita**, *cursiva* y `código inline`.

> Una cita destacada.
```

La lectura del Markdown se hace durante la compilación. Si la ruta no existe o el archivo está vacío, no se generará contenido para esa sección.

### Insertar una imagen

Guardar la imagen dentro de `public/` y referenciarla desde el Markdown con una ruta pública absoluta, comenzando por `/`. Por ejemplo, si el archivo está en:

```text
public/curso00/subcursos/curso005/medios/recorrido-001.jpg
```

el Markdown debe contener:

```markdown
![Recorrido por el Arroyo del Rey](/curso00/subcursos/curso005/medios/recorrido-001.jpg)
```

No usar una ruta relativa al propio archivo Markdown como `./medios/recorrido-001.jpg`. En el sitio, `/` representa la raíz pública del dominio. Las imágenes de las páginas editoriales se muestran de manera responsive, ocupan el ancho disponible y utilizan `lazy loading`.

### Insertar un video de YouTube

Usar una línea independiente con el identificador de once caracteres del video:

```markdown
[youtube:nnM_C6h1D_A]
```

En un enlace como `https://youtu.be/nnM_C6h1D_A`, el identificador es la parte posterior a la última barra. No incluir la URL completa dentro de la etiqueta. El sitio genera un iframe responsive y lo carga de manera diferida.

La etiqueta debe escribirse sola en una línea. También puede usarse con videos cuyo enlace original tenga el formato `https://www.youtube.com/watch?v=ID`, tomando únicamente el valor de `ID`.

## 11. Comprobaciones antes de publicar

Antes de subir una nueva versión:

1. Revisar que todos los nombres de archivos coincidan exactamente con las rutas declaradas, incluyendo mayúsculas y extensiones.
2. Confirmar que cada `itemId` de `src/data/subcursos.ts` coincida con un `id` del curso correspondiente en `Derivas.ts`.
3. Comprobar que `pageMarkdownFile` sólo esté definido cuando el archivo existe.
4. Ejecutar `npm run build` y corregir cualquier error.
5. Probar la navegación local con `npm run preview`.
6. Subir el contenido de `dist/` al directorio público del hosting.
7. Limpiar la caché del navegador o del proveedor si todavía se muestra una versión anterior.
