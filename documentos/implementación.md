# Plan de implementación de *Cursario*

Este documento registra el estado de la implementación de *Cursario* y propone una secuencia de trabajo para las próximas etapas. Su objetivo es servir como referencia práctica del proyecto, sin reemplazar la documentación conceptual de [contexto.md](contexto.md) ni la bitácora histórica del `README.md`.

## 1. Estado general

*Cursario* cuenta actualmente con un prototipo funcional construido con Astro, TypeScript, Tailwind y Canvas 2D. La aplicación puede compilarse como un sitio estático y ya permite recorrer la cartografía principal, entrar en cada curso, explorar sus subderivas y abrir páginas editoriales individuales.

La estructura actual comprende cuatro cursos principales:

| Curso | Tema | Subderivas actuales |
| --- | --- | ---: |
| `curso00` | En Curso / bitácora | 5 |
| `curso01` | Artes Electrónicas / UNTREF | 5 |
| `curso02` | Gráfica Generativa | 6 |
| `curso03` | Pensamiento & Diseño | 3 |

La cantidad de subderivas no está fijada en el código. Cada curso obtiene sus elementos desde una colección de datos y el canvas calcula su encuadre, conexiones y radar a partir de la cantidad real de elementos.

## 2. Implementado

### Navegación espacial

- Cartografía macro con las cuatro islas principales.
- Entrada a una deriva local mediante `INCURSIONAR`.
- Movimiento del plano mediante arrastre, zoom, inercia y desplazamientos animados.
- Navegación con mouse, touch, botones del HUD y atajos de teclado.
- Retorno desde una deriva al nivel macro mediante `ESC` o `VOLVER`.
- Radar/minimapa colapsable con representación de la cámara y acceso rápido a los cuatro cursos.
- Radar local que representa todos los elementos de la deriva activa, sin asumir un máximo de tres, cinco o seis subderivas.
- Distribuciones espaciales específicas: seis subderivas en una fila para `curso02` y una composición de tres elementos superiores y dos inferiores para `curso01`, con menor tamaño en la fila inferior.
- Recuperación de la deriva de origen al volver desde una página editorial mediante un parámetro de navegación.

### Modelo de contenidos

- Catálogo centralizado y tipado para definir cada subderiva.
- Rutas, nombres de imagen y archivos Markdown declarados como atributos de cada subderiva.
- Atributos opcionales para imagen, resumen Markdown, página editorial, título, subtítulo, descripción, palabras clave, categoría y referencia temporal.
- Posibilidad de representar una tarjeta con sólo imagen, sólo Markdown o ambos contenidos.
- Cuando sólo hay imagen, se elimina el marco visual de la tarjeta para que la imagen ocupe todo el ancho disponible.
- Los títulos, subtítulos, descripción, palabras clave y metadatos sólo se renderizan cuando tienen contenido.
- Las palabras clave se transforman en chips separados a partir de una cadena delimitada por comas.
- En las subderivas, el botón de acceso a detalle sólo aparece si existe un archivo de página editorial, independientemente de la configuración general de la acción.

### Tarjetas e interfaz

- Tarjetas HTML superpuestas al canvas para conservar legibilidad y enlaces.
- Contenido visual adaptable: una o dos columnas según la combinación de imagen y Markdown.
- Carga `eager` para las imágenes de los cursos principales y `lazy` para las imágenes de las subderivas.
- HUD con coordenadas, escala, estado del curso activo, zoom, centrado y retorno.
- Cursor gráfico con retícula, estela de tinta y respuesta a la velocidad del movimiento.
- Textura de papel, retículas, corrientes, líneas de fuerza y recursos visuales inspirados en la cartografía, la risografía y los circuitos.
- Transición entre el nivel macro y el nivel local mediante una cortina visual que respeta la preferencia de movimiento reducido del sistema.

### Páginas editoriales

- Generación estática de una página por cada subderiva que figure en el catálogo.
- Encabezado editorial con código, título, subtítulo, navegación de retorno e inicio.
- Lectura vertical independiente del canvas.
- Conversor Markdown controlado para títulos, párrafos, citas, negrita, cursiva y código inline.
- Soporte para videos de YouTube mediante la sintaxis `[youtube:ID_DEL_VIDEO]` en páginas editoriales.
- Soporte para imágenes mediante la sintaxis Markdown habitual `![texto alternativo](/ruta/de/la-imagen.jpg)`.
- Las imágenes insertadas en páginas editoriales ocupan el ancho disponible, son responsive y utilizan carga diferida (`lazy loading`).
- La página de `curso005` de `curso00` contiene actualmente un ejemplo de video embebido y recursos visuales del recorrido.

### Configuración y publicación

- Astro configurado para generar el sitio de forma estática.
- TypeScript en modo estricto.
- Tailwind como sistema de estilos.
- Servidor de desarrollo disponible mediante `npm run dev` en el puerto 3000.
- Comandos definidos para desarrollo, compilación y previsualización:

```bash
npm run dev
npm run build
npm run preview
```

## 3. Pendiente

### Contenidos

- Reemplazar o completar los textos, imágenes y registros de prueba con los contenidos definitivos.
- Revisar títulos, subtítulos, fechas, etiquetas y descripciones para mantener un criterio editorial consistente.
- Completar la documentación de las obras de Artes Electrónicas, las series generativas y los escritos.
- Incorporar, cuando corresponda, registros sonoros, videos propios, código y diagramas.

### Agrupamiento de contenidos
- Permitir que las subderivas sean agrupadas lógicamente en el canvas. Es decir, si cada deriva es una isla, poder definir archipiélagos que las reúna, con algún criterio lógico. Por ejemplo, en el caso de la gráfica generativa, armar agrupaciones por "colecciones" o "curadurías".
- Pemitir incorporar en los canvas de navegación algún otro elemento simple que no sean islas (sólo texto y/o imagen), sin contenedor y sin necesidad de navegar a un siguiente nivel.
- Añadir una sección de **Acerca del "El Cursario"**
- Añadir un link en el header que despliegue un índice de contenidos (agrupado por cursos/subderivas) y que apunte a las páginas estáticas. Este índice debería poder ser accedido desde cualquier nivel.

### Experiencia y accesibilidad

- Definir e implementar un modo de “Flujo Continuo” para mobile y accesibilidad, que permita recorrer los contenidos en una secuencia vertical clara sin depender exclusivamente del canvas bidimensional.
- Mejorar la navegación por teclado, el foco visible, las etiquetas ARIA y las alternativas textuales de las tarjetas y controles.
- Resolver una alternativa accesible para la información que hoy se comunica principalmente mediante posición, color, movimiento o coordenadas.
- Evaluar un drawer o modal editorial para consultar contenidos sin abandonar completamente la deriva espacial.

### Contenidos enriquecidos

- Ampliar el procesador Markdown si aparecen necesidades de listas, enlaces, tablas, imágenes con pie, audio u otros recursos.
- Formalizar una sintaxis o un modelo de datos para videos, galerías, audio y código, evitando depender únicamente de convenciones textuales.
- Incorporar validaciones para detectar rutas rotas, archivos ausentes, identificadores de YouTube inválidos y campos incompatibles.

### Rendimiento y calidad

- Medir el tiempo de carga inicial y el peso de imágenes, GIFs, texturas y scripts.
- Optimizar imágenes y evaluar formatos más eficientes cuando no se pierda calidad visual.
- Revisar el costo de los canvas y de las animaciones en dispositivos de baja potencia.
- Probar sistemáticamente desktop, mobile, touch y distintos tamaños de pantalla.
- Verificar compatibilidad entre navegadores y respetar de manera consistente `prefers-reduced-motion`.
- Incorporar una revisión básica de SEO, metadatos sociales y páginas de error.


## 4. Propuesta de próximos pasos

### Etapa 1 — Consolidar el contenido

1. Hacer un inventario de las obras, series, experimentos y escritos que formarán parte de la primera publicación.
2. Completar el catálogo de subderivas con títulos, descripciones, palabras clave, fechas, imágenes y páginas editoriales definitivas.
3. Revisar las rutas públicas de medios y ejecutar una compilación para detectar archivos faltantes.
4. Establecer una convención editorial común para nombres de archivos, textos alternativos, títulos y metadatos.

### Etapa 2 — Robustecer la publicación editorial

1. Decidir qué recursos deben resolverse mediante Markdown y cuáles conviene declarar como datos estructurados.
2. Ampliar el conversor sólo con las capacidades necesarias para los contenidos reales.
3. Agregar validaciones de contenido durante la compilación.
4. Revisar el comportamiento de páginas sin imagen, sin Markdown o sin página editorial.

### Etapa 3 — Resolver mobile y accesibilidad

1. Diseñar el modo de Flujo Continuo como una vista alternativa, no necesariamente como una sustitución del canvas.
2. Definir el orden de lectura de cursos, subderivas, metadatos y acciones.
3. Incorporar navegación completa por teclado y lectores de pantalla.
4. Probar la interacción con touch y establecer umbrales de movimiento, zoom y selección que no dificulten la lectura.

### Etapa 4 — Optimizar la experiencia visual

1. Medir el rendimiento antes de modificar la estética o la densidad de la escena.
2. Optimizar recursos pesados y ajustar la carga diferida según la visibilidad y la distancia a cámara.
3. Revisar el equilibrio entre textura, animación, legibilidad y consumo de GPU.
4. Validar las composiciones de cada curso en diferentes resoluciones.

### Etapa 5 — Preparar la publicación

1. Definir dominio, títulos, descripciones y metadatos de cada página.
2. Ejecutar `npm run build` en un entorno limpio y revisar la salida generada.
3. Probar la navegación completa desde enlaces directos, incluyendo el regreso al curso de origen.
4. Publicar una primera versión estable y registrar en este documento las decisiones que surjan durante la puesta en línea.

## 5. Criterio de evolución

La implementación debe seguir creciendo sin convertir la cartografía en una estructura rígida. Los cursos y subderivas tienen que poder incorporar nuevos contenidos sin exigir cambios en la lógica general de navegación. A la vez, cada ampliación debe conservar tres condiciones: que el recorrido sea comprensible, que los contenidos puedan leerse sin depender del movimiento y que la estética sensible no comprometa el acceso ni el rendimiento.
