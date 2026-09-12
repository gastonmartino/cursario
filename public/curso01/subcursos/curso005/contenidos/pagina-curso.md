# Diálogos Desavenidos
*Trabajo realizado junto con Diego Flores, Ángel Aberbach y Gianfranco Chiappe.*

> Una **experiencia háptica** sobre acuerdos a destiempo, desencuentros cotidianos y displicencias serviciales. 

![Diálogos desavenidos / Instalación](/curso01/subcursos/curso005/medios/dialogos-desavenidos-01.jpg) *Instalación de los dispositivos para "Diálogos Desavenidos". Silla con sensores capacitivos enfrentada al robot (insumiso).*

El cuerpo participa de actuaciones a destiempo, sobreactuaciones y displicencias administradas en espacios regidos por convenciones y rituales gestuales.

> Se presenta un juego de incomodidades, cristalizado en la relación humano- dispositivo, en la cuál el primero accede voluntariamente a ser rarificado tan solo para conocer las mecánicas del dispositivo mediante giros, torsiones, y acomodamientos. Como resultado, emerge una intensificación de fricciones, donde la negociación y la mediación escalan al punto de volverse interfaz. 

## Origen de la obra
El punto de partida fue el incidente de pedir la cuenta en un bar (y no conseguir el objetivo rápidamente), vinculado con las convenciones, los gestos, el espacio, las distancias y la negociación con el “otro” (proxemia).

## Ejes de la investigación
1. **Propuestas de Mark Patterson** donde habla del tacto como relación y no como simple contacto. El autor menciona “un mundo de movimiento y exploración, de comunicación social no verbal”. La metáfora de la proximidad: hoy las tecnologías hápticas muestran que puede haber experiencias táctiles a distancia (presencia afectiva). 
2. **Noción de comodidad** como algo más vinculado a normas diseñadas que a la biología en sí. “Evitar el malestar como parte de la experiencia de usuario surge como imperativo económico cultural” (The Invention of Comfort. Sensibilities of design).
3. **Mimética vincular** y cómo ésta puede producir desencuentros y sobreactuaciones, a veces simplemente a causa de destiempos y otras veces como fruto de una displicencia intencional.
4. **Oculésica**, el lenguaje no verbal que estudia cómo nos comunicamos con la mirada) también nos aportó ideas para forzar intervenciones del cuerpo (movimientos, giros, tensiones, gestos.
5. **Proxemia** distancia y posición de la silla-dispositivo invervenida respecto del dispositivo (robot insurrrecto) para configurar la interacción.

## Experiencia
La instalación propone un diálogo (individual) con un “otro” (el dispositivo de color negro montado en un trípode con una cámara, parlante y luces en la parte superior) que da la bienvenida y propone iniciar un vínculo, una interacción, invitando al visitante a sentarse en la silla que tiene enfrente de un modo sugestivo, calmo, pero intrigante.

![Interacción con el dispositivo](/curso01/subcursos/curso005/medios/dialogos-desavenidos-02.jpg) *Interacción del participante (sentado en la silla) para llamar la atención del dispositivo.*

La acción de sentarse en la silla inicia un vínculo. Si bien las respuestas del dispositivo se vuelven más directas, potentes y resueltas son, al mismo tiempo, confusas, contradictorias y displicentes. Exhortan al visitante a entablar un diálogo imposible e impostado que busca incomodar, exasperar y desgastar al interlocutor quien, mientras se mantiene sentado en la silla, busca la atención esquiva del dispositivo y explora formas de respuesta (por ejemplo, imitando sus acciones o haciendo gestos para llamar su atención o intentando sincronizar sus movimientos con los del dispositivo o evitando el contacto o sometiéndose o desafiando sus órdenes, etc). 

> Levantarse de la silla implica para el visitante el fin de la interacción (exitosa o frustrada) y el dispositivo retorna a su estado inicial.

## Detalles Técnicos
Como condición inicial de la negociación interactiva con la obra, se requiere que el espectador se siente en una silla frente al “mozo” (robot). Para determinar si esto se cumple, fue intervenida una silla como dispositivo de sensado friccionante utilizando los siguientes materiales y técnicas:
1. Dos mallas de acero encontradas en la calle, utilizadas como estructura para sensores capacitivos. Se colocó un sensor en el asiento, y otro en el respaldo de la silla.
2. Para obtener valores más significativos se envolvió cada malla con un tramo de cable soldado a ellas.
3. Con el fin de desacoplar los sensores entre sí (que la lectura de uno no modifique al otro significativamente), se recubrió todo con cuerina.
4. Un pequeño módulo de sensores capacitivos con una placa PCB pre-perforada, borneras para PCB, y resistencias de 1 megaohm.
5. Un Arduino UNO como receptor de los datos de los sensores, leídos e interpretados por una computadora con Ableton Live 12 y Max for Live.

![Sensores capacitivos instalados en la silla](/curso01/subcursos/curso005/medios/dialogos-desavenidos-03.jpg) *Intervención de la silla para adosarle unas almohadillas con sensores capacitivos conectados Arduino.*

Para crear una primera conexión con el espectador e invitarlo a interactuar con la obra se decidió recaer en el sonido. Éste opera como señuelo o como disuasor, dependiendo del comportamiento de la obra y del espectador con ésta. El devenir de los distintos sonidos, provenientes de grabaciones de voz, fue controlado desde el software Ableton Live 12 junto con Max for Live. Dependiendo del estado de la obra (espectador sentado / espectador parado) el programa define qué banco de sonidos aleatorios reproducir:
1. Voces que capten la atención 
2. Voces que engañen y burlen
En términos de electrónica, se utilizaron los siguientes componentes, los que fueron encapsulados en dos gabinetes con el resto de los módulos que conforman el “mozo”:
- Módulo amplificador PAM8610 con parlante de televisor de 10W y 8Ohms
- Fuente de 12V

La estructura del “mozo” (robot) fue lograda con los siguientes materiales:
1. Trípode como base estructural
2. Dos gabinetes en madera MDF (uno fijo y otro móvil, anclado a un motor paso a paso) que contienen la electrónica y son la parte visible del “mozo”

![Dispositivo robótico y detalle del interior](/curso01/subcursos/curso005/medios/dialogos-desavenidos-04.jpg) *Dispositivo robótico (el mozo) a la izquierda. Interior de la parte inferior del dispositivo, a la derecha.*


Por último se desglosa el detalle de los componentes que generan/controlan el movimiento, la iluminación y el comportamiento de esta estructura:
- Motor paso a paso NEMA 17 con bornera para cable de 30A (utilizada como acople) y driver DRV8825
- Webcam utilizada para determinar si hay movimiento frente a ella
- Raspberry Pi 5 recibiendo la imagen de la cámara y corriendo Processing junto OpenCV para analizar esa imagen con un algoritmo de “flujo óptico”. Además, mediante OSC envía datos del “flujo óptico” a la computadora que controla el sonido, y recibe de ésta la traducción de esos datos, utilizados para indicar a una placa Arduino UNO a qué posición mover el motor NEMA.
- Arduino UNO encargado de mover el motor y encender las luces (NeoPixel)
- Módulo NeoPixel utilizado para “molestar” al espectador con su brillo.


