# Motor para la Cartografía del Cursario

El motor dibuja y anima el lienzo infinito del Cursario: el fondo cartográfico,
la cámara que se desplaza y hace zoom, el cursor entintado y la ubicación de
las tarjetas HTML sobre el fondo:
- **Ínsulas**: cada una de las tarjeta del nivel superior, los cursos principales.
- **Islas**: cada una de las tarjetas que conforman un subcurso
- **Islotes**: pequeñas piezas de información, a veces representadas como tarjetas o a veces simplemente enmarcadas y agrupadas con las islas o las ínsulas.

Trabaja solo con la **estructura** del sitio (qué cursos, subcursos e islotes
hay, dónde están y cómo se relacionan) y con **ids**. No conoce el contenido de
las tarjetas (títulos, códigos, colores, textos); lo que necesita de él se lo
provee quien lo crea, el Mapa de la portada (`src/components/Mapa.astro`).

## Archivos

| Archivo | Para qué se usa |
|---|---|
| `Derivas.ts` | Estructura del sitio: los cursos de primer nivel (`DERIVAS_INSULAS`), sus subcursos (definidos dentro de cada curso y reunidos en `DERIVAS_ISLAS`) y los islotes (`DERIVAS_ISLOTES`), con sus relaciones, carpetas, URLs, posiciones y tamaños. Incluye `ubicar(id)`, que devuelve dónde está cualquier elemento. |
| `MotorCursario.ts` | El motor propiamente dicho: recibe los eventos (puntero, rueda, toques, teclado), administra los dos niveles (lienzo principal y lienzo de un curso), mueve la cámara, ubica las tarjetas HTML, informa la telemetría al HUD y decide cuándo hay que dibujar. |
| `Camara.ts` | Posición y zoom de la vista: conversión entre coordenadas de pantalla y del mundo, arrastre con inercia, zoom centrado en un punto y vuelos suaves hacia un destino. |
| `CartografiaGenerativa.ts` | Dibujo del fondo en el lienzo principal (`infinite-canvas`): papel, retícula, ríos, circuitos, curso entre las ínsulas, línea de recorrido de los subcursos y conexiones de los islotes. |
| `CursorEntintado.ts` | Dibujo del cursor en su propio lienzo (`cursor-canvas`, encima de todo): mira técnica, estela de tinta, gotas que salpican y la etiqueta junto al puntero. |

## Estructura y contenido

`Derivas.ts` es la única fuente de la estructura. El contenido de cada tarjeta
está en `src/data/` (`insulas.ts`, `islas.ts`, `islotes.ts`) y se vincula con la
estructura por el `id`:

- **Ínsula** (`DerivaInsula`): un curso de primer nivel. `curso` es su carpeta en
  `public/` y el primer tramo de sus URLs.
- **Isla** (`DerivaIsla`): un subcurso dentro de un curso. `subcurso` es su
  carpeta y el segundo tramo de la URL de su página (`/{curso}/{subcurso}/`),
  salvo que la isla tenga una URL propia (`pageUrl`, en `src/data/islas.ts`):
  entonces la página va en `/{pageUrl}/`, y sus archivos siguen en su carpeta.
- **Islote** (`DerivaIslote`): una tarjeta más simple asociada a un curso o a un
  subcurso (`idSuperior`). Se dibuja en el mismo lienzo que su superior.

`ubicar(id)` devuelve, para cualquier curso, subcurso o islote, el curso de
primer nivel que lo contiene, las carpetas donde se buscan sus imágenes y
Markdown, la URL de su página y su posición y tamaño.

## Niveles

El motor tiene dos niveles, cada uno con su propio sistema de coordenadas:

- **Lienzo principal** (`macro`): se ven las cuatro ínsulas, los islotes
  asociados a ellas y, si hay ínsulas reflotadas, sus islas e islotes (ver más
  abajo). Click o Enter sobre una ínsula, o su botón INCURSIONAR,
  entra a ese curso.
- Un curso todavía sin islas no tiene lienzo propio, como una ínsula
  reflotada (`tieneLienzo`, en `Derivas.ts`): su ínsula no muestra el botón
  INCURSIONAR y `/?deriva={id}` lleva hacia ella en el lienzo principal.
- **Lienzo de un curso** (`deriva`): se ven las islas de ese curso, conectadas
  por una línea de recorrido en el orden en que están definidas, y sus islotes.
  Escape o el botón VOLVER regresan al lienzo principal, con la cámara sobre el
  curso del que se salió.

Al cambiar de nivel se avisa a la portada (`AlCambiarDeNivel`), que muestra una
transición. La portada abre directamente el lienzo de un curso cuando la URL
es `/?deriva={id}` (así vuelven las páginas de los subcursos).

### Ínsulas reflotadas

Una ínsula con `refloated: true` (en `src/data/insulas.ts`) no tiene lienzo
propio: sus islas, con sus islotes, salen a flote en el lienzo principal, junto
a ella y a las demás ínsulas, unidas a la ínsula por su línea de recorrido.

- En `Derivas.ts`, las coordenadas de esas islas y de sus islotes son
  relativas al centro de la ínsula: al moverla, se mueve todo el conjunto
  (`posicionReflotada` da su posición en el lienzo principal).
- La ínsula no tiene botón INCURSIONAR, y el click o Enter no incursionan.
  `/?deriva={id}` lleva hacia ella en el lienzo principal, y VOLVER, desde las
  páginas de sus islas, lleva a la portada.
- En el minimapa, sus islas son puntos chicos, más claros y sin texto. Los
  islotes no se muestran.
- Una envolvente punteada, fina y en rojo suave, rodea a sus islas (no a los
  islotes) a 40 unidades de distancia. Sigue la forma del grupo: rellena los
  entrantes chicos entre islas, pero no los huecos grandes donde puede haber
  otras ínsulas (`calcularEnvolvente`, en `CartografiaGenerativa.ts`).

## Cámara

- El zoom va de 0,25 a 2,5.
- La vista inicial de cada lienzo se calcula con el algoritmo de la sección
  siguiente. CENTRAR (o `R`) vuelve a ella.
- Mientras nadie mueva la vista inicial, se recalcula si cambia el tamaño del
  lienzo (al cargar en el celular, al mover la costura).
- La última vista de cada lienzo (posición y zoom) se recuerda en el navegador
  (`cursario:vistas`): al volver a un lienzo, aunque sea desde otra página, se
  lo encuentra como se dejó. La primera vez, o si nadie la había movido, se
  usa la vista inicial, calculada para la pantalla de ese momento.
- Arrastrar desplaza la vista; al soltar, sigue desplazándose por inercia y se
  frena de a poco.
- La rueda del mouse hace zoom centrado en el puntero. En un trackpad, deslizar
  desplaza la vista y pellizcar hace zoom. En pantallas táctiles se arrastra con
  un dedo y se hace zoom con dos.
- Los vuelos (centrar, ir a un curso, zoom con botones o teclas) se hacen
  acercándose suavemente al destino. Al llegar, la cámara fija el valor final y
  queda quieta.

Atajos de teclado: `R` centra la vista (en el lienzo de un curso, también `0`);
`+` y `-` hacen zoom; en el lienzo principal, `0` a `4` vuelan a la deriva del
mismo número (DERIVA:00 a 04) y `Enter` entra al curso que tiene el puntero
encima; `Escape` vuelve desde un curso. Mientras el menú de navegación
está abierto, el teclado no llega al lienzo.

## Vista inicial de cada lienzo

Se calcula en `vistaInicial` (`MotorCursario.ts`), con las constantes del
principio del archivo. Cuentan las **tarjetas** del lienzo: en el principal, las
ínsulas y las islas de las ínsulas reflotadas; en el de un curso, sus islas. Los
islotes nunca cuentan. "Pantalla chica" es un lienzo de menos de 768 px de
ancho (`ANCHO_MOVIL`).

1. **Zoom.** En escritorio y tablets, 70 % (`ZOOM_INICIAL`). En pantallas
   chicas, el que hace entrar 1,25 tarjetas de ancho (`TARJETAS_MOVIL`, con el
   ancho de la tarjeta más ancha).
2. **Centrado.** La cámara va al centro del rectángulo que encierra todas las
   tarjetas, en los dos ejes (no solo las que se ven).
3. **Ajuste vertical.** Con esa vista, se toma la tarjeta de más arriba **de
   entre las que se ven en el lienzo**. Si su borde superior queda a menos de
   100 px del borde del lienzo (`MARGEN_SUPERIOR`: cortada o debajo del HUD),
   el lienzo baja hasta que quede justo a 100 px, con su encabezado a la vista.
   Si no, no se mueve. Esta posición vertical ya no cambia.
4. **Ajuste horizontal** (solo en pantallas chicas). Con la vista del paso
   anterior, se toman las tarjetas visibles que el borde izquierdo corta (una
   parte queda fuera de la pantalla) y, de ellas, la de más arriba. El lienzo
   se desplaza hasta que esa tarjeta entre entera, con su borde izquierdo a
   16 px (`MARGEN_IZQUIERDO_MOVIL`). Si ninguna está cortada, no se mueve. Es
   una sola pasada: si al desplazarse asoma otra tarjeta por la izquierda, se
   deja así (puede quedar entera pero pegada al borde).

En escritorio la vista termina en el paso 3, centrada en horizontal.

## Tarjetas HTML

Las ínsulas, islas e islotes son elementos HTML que se superponen al lienzo. El
motor no los dibuja: en cada actualización los muestra u oculta según el nivel
y los ubica con una transformación (posición y escala según la cámara), así que
se desplazan y escalan junto con el fondo. Empiezan ocultos, de modo que el
navegador solo descarga las imágenes de las tarjetas del lienzo que se está
viendo.

Como el tamaño final de cada tarjeta lo conoce recién el navegador, las propias
tarjetas se ocupan de lo que depende de él: dibujan sus esquinas de plano
(`EsquinasPlano.astro`) y detectan cuándo el puntero está encima. Las
conexiones de los islotes usan el tamaño real de cada islote.

## Sobrevuelo

Cada tarjeta avisa cuando el puntero entra o sale, con su id:
`marcarSobrevuelo(id)` y `desmarcarSobrevuelo(id)`. Con eso el motor sabe qué
curso o subcurso está bajo el puntero (para el HUD, la etiqueta del cursor, el
click y Enter). Lo que esté tapado por otro elemento, como el radar, no recibe
el puntero. En pantallas táctiles la marca dura lo que dura el toque.

## Lo que el motor pide desde afuera

Al crear `MotorCursario`, la portada le pasa:

- **`AparienciaLienzo`**: dos funciones por id, `accentColor` (color de acento
  de un curso o subcurso, para la línea de recorrido y las conexiones de los
  islotes) y `cursorLabel` (texto que acompaña al cursor al pasar por encima o al
  hacer click). Sin ellas, el motor usa un color neutro y no muestra etiqueta.
- **`AlActualizarTelemetria`**: recibe en cada actualización la posición y el
  zoom de la cámara, el nivel, el curso activo y lo que está bajo el puntero
  (`DatosTelemetria`). La portada lo usa para el HUD y el minimapa.
- **`AlCambiarDeNivel`**: se llama al entrar o salir de un curso.

## Cuándo dibuja

El motor dibuja bajo demanda; con todo quieto no hace ningún trabajo.

- El **lienzo principal**, las **tarjetas** y la **telemetría** se actualizan
  cuando se mueve la cámara o cambia algo de la escena: el nivel, el sobrevuelo,
  el tamaño de la ventana, la carga de las fuentes o el tamaño de un islote.
- El **lienzo del cursor** se redibuja mientras el puntero se mueve y mientras la
  estela y las gotas se desvanecen (unos 0,6 segundos).
- Mientras la cámara está en movimiento (inercia o vuelo) o el cursor tiene
  estela, el motor pide un cuadro tras otro al navegador. Cuando todo se
  detiene, deja de pedirlos hasta que algún evento lo despierta: el puntero, la
  rueda, un toque, el teclado, los botones del HUD, el cambio de tamaño de la
  ventana o un aviso de sobrevuelo.

## El fondo

Lo que dibuja `CartografiaGenerativa.ts` depende solo de la cámara, del nivel y
del tamaño de la ventana; nada se anima con el paso del tiempo.

- **Lienzo principal**: textura de papel, retícula de 200 unidades (con cruces
  desde zoom 0,4 y coordenadas desde 0,7), ríos y esquemas de circuitos; el
  curso punteado en rojo que une las ínsulas, en el orden de sus códigos; el
  recorrido de las ínsulas reflotadas con sus islas, y las conexiones de los
  islotes.
- **Lienzo de un curso**: papel, retícula fina de 150 unidades, la línea de
  recorrido que une sus islas y las conexiones de sus islotes.

Los ríos se generan con ruido a partir de una semilla al azar, así que el trazado
cambia cada vez que se carga el sitio.
