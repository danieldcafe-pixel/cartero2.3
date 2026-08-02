VYBE LIVE v1.6.1 — CORRIGE PROBLEMA DE CACHÉ (LOS CAMBIOS NO SE VEÍAN)

AVISO IMPORTANTE — SI LOS CAMBIOS NO SE APLICABAN
En versiones anteriores, todos los archivos usaban siempre el mismo
"?v=1.0.0" en su nombre. Esto hacía que el navegador (sobre todo en
el icono añadido a la pantalla de inicio del iPad) siguiera usando
una copia antigua guardada en caché, aunque subieras código nuevo
a GitHub. Por eso botones nuevos (como "Aplicar" para espectadores)
podían no hacer nada: la app seguía ejecutando el código viejo.

Ahora los archivos usan "?v=1.6.1". Aun así, la PRIMERA vez que
actualices, conviene forzar la recarga:
1. Si la tienes en la pantalla de inicio del iPad: bórrala y vuelve
   a añadirla desde Safari (Compartir > Añadir a pantalla de inicio)
   después de que el nuevo deploy esté publicado.
2. Si la abres en Safari/Chrome normal: mantén pulsado el botón de
   recargar y elige "Actualización forzada" / "Vaciar caché y
   recargar", o entra en una pestaña de incógnito para comprobar.
3. En futuras actualizaciones de código, cambia el número de
   versión en index.html (los "?v=1.6.1" de las líneas de
   <link>/<script>) por uno nuevo, así el navegador siempre
   detecta que hay archivos distintos que descargar.

VYBE LIVE v1.6 — CON OPCIÓN DE CONGELAR LOS NÚMEROS AUTOMÁTICOS

QUÉ CAMBIÓ RESPECTO A v1.0
Antes había textos repartidos entre index.html, config.js y app.js.
Ahora TODO el contenido visible (marca, textos, colores, nombres,
comentarios, números) vive en un único archivo: config.js
No hace falta tocar index.html, style.css, camera.js ni live.js
para adaptar la app a una nueva producción.

CÓMO EDITAR
Abre config.js y cambia lo que necesites:

- brand.letter / brand.name / brand.label
    Letra del logo, nombre de marca (pantalla de inicio) y el texto
    de la esquina superior izquierda ("VYBE / LIVE").
- brand.pageTitle / brand.manifestName / brand.manifestShortName
    Título de la pestaña y nombres para el icono de Home Screen.
    (El nombre del icono en el teléfono también debe actualizarse
    a mano en manifest.webmanifest, ver más abajo).
- brand.themeColor / colors.ink / colors.cyan / colors.violet / colors.textSoft
    Colores de toda la interfaz (degradados, acentos, texto).
- launch.description / launch.buttonText / launch.hint
    Textos de la pantalla inicial antes de pulsar el botón.
- header.airBadgeText / header.viewersSuffix
    Textos de las píldoras "ON AIR" y "VIEWERS".
- displayName / handle / location
    Nombre, usuario y ubicación de la tarjeta del creador.
- telemetry.*
    Etiquetas STABLE / CAM / TIME y FRONT / REAR.
- dock.messagePrompt
    Texto de la barra "Send a message".
- toasts.*
    Mensajes emergentes (fallo de cámara, cambio de cámara, etc.).
- startingViewers / startingReactions
    Números con los que arranca la emisión.
- comments
    Lista de comentarios falsos del chat (usuario + mensaje).
- beautyFilter.enabled / beautyFilter.durationSeconds / beautyFilter.glitchMs / beautyFilter.activeText / beautyFilter.offText
    Filtro embellecedor sobre la imagen de la cámara (piel más suave,
    más luz, más color). Se activa solo al pulsar GO ON AIR y se cae
    solo tras "durationSeconds" segundos (40 por defecto), con un
    efecto de "glitch" de "glitchMs" milisegundos que hace evidente
    el momento en que se quita, dejando ver la imagen real sin
    filtro. "activeText" y "offText" son los textos de la píldora
    junto a ON AIR (en inglés, para que combinen con el resto de la
    interfaz). Pon "enabled": false para desactivarlo por completo
    (y ocultar también el botón de activar/desactivar).
    Además del apagado automático, hay un botón "✨" debajo del botón
    de cambiar cámara (arriba a la derecha) para activar o desactivar
    el filtro manualmente en cualquier momento, con el mismo efecto
    de glitch al quitarlo. Al volver a activarlo manualmente, el
    contador de "durationSeconds" empieza de nuevo desde ese instante.

PANEL DE EDICIÓN EN VIVO (sin tocar código)
Mantén pulsado el logo "V" (en la pantalla inicial o en la esquina
superior izquierda durante la emisión) durante medio segundo para
abrir un panel con todos los campos editables: marca, creador,
textos de la pantalla inicial, números iniciales, colores y
comentarios del chat.
- "Guardar y aplicar" guarda los cambios en el propio dispositivo
  (localStorage) y los aplica al instante, sin recargar la página.
- Los cambios se quedan guardados en ESE dispositivo/navegador,
  aunque cierres la app o el iPad se reinicie. Si abres la app en
  otro iPad, verás los valores de config.js hasta que edites el
  panel también ahí.
- "Restablecer" borra los ajustes guardados y vuelve a los valores
  originales de config.js.
- Los espectadores/reacciones iniciales se aplican la próxima vez
  que se pulse "GO ON AIR".

CAMBIAR ESPECTADORES AL INSTANTE (durante la emisión)
Por defecto, espectadores y reacciones suben y bajan solos cada
pocos segundos para simular una emisión real — por eso, si cambias
el número, en unos segundos puede volver a moverse por su cuenta.
Si quieres que se quede fijo en el número que tú pongas:
1. Activa "Mantener los números fijos (no suben ni bajan solos)".
2. Ahora sí, cambia el número con "Cambiar espectadores ahora
   mismo" y se quedará quieto hasta que lo cambies tú de nuevo o
   desactives la casilla.
Dentro del panel, en "Espectadores y reacciones", el campo
("Cambiar espectadores ahora mismo") pone el contador exactamente
en el número que escribas, en el momento, sin esperar a "Guardar y
aplicar" y sin reiniciar la emisión. Solo funciona si ya has
pulsado GO ON AIR; si no, avisa para que lo hagas primero.
Los campos "Espectadores al pulsar GO ON AIR" / "Reacciones al
pulsar GO ON AIR" son distintos: solo se aplican la próxima vez
que arranques una emisión nueva.

FOTOS DE AVATAR
Dentro del panel de ajustes, en "Avatares":
- Foto del creador: sube una imagen y sustituye el cuadro de color
  de la tarjeta superior izquierda. "Quitar foto" vuelve al
  degradado de color.
- Fotos para el chat: sube una o varias; se reparten en orden entre
  los comentarios falsos que van apareciendo. Puedes quitar
  cualquiera con la "×" en su esquina.
Las fotos se comprimen y reducen de tamaño automáticamente al
subirlas para que no ocupen demasiado espacio, y se aplican al
instante sin necesidad de pulsar "Guardar y aplicar".
Nota: si añades fotos, el enlace de "Sincronizar entre
dispositivos" puede quedarse muy largo. Si al abrirlo en el otro
dispositivo no carga bien, usa "Aplicar código pegado" copiando y
pegando el texto completo (por WhatsApp, Notas, Mail...) en lugar
de abrir el enlace corto.

SINCRONIZAR ENTRE DISPOSITIVOS (teléfono + ordenador, etc.)
Los ajustes del panel se guardan por separado en cada dispositivo.
Para que dos (o más) dispositivos tengan los mismos ajustes:
1. Ajusta todo en un dispositivo y abre "Sincronizar entre
   dispositivos" dentro del panel.
2. Pulsa "Copiar enlace con estos ajustes" (se copia solo, o se
   muestra en el cuadro de texto si el navegador no permite copiar
   automáticamente).
3. Envía ese enlace al otro dispositivo (WhatsApp, Mail, AirDrop,
   Mensajes...) y ábrelo ahí: aplicará los mismos ajustes al
   instante y los dejará también guardados en ese dispositivo.
4. Si no puedes enviar el enlace, puedes pegar el código a mano en
   el cuadro "O pega aquí el enlace/código recibido" y pulsar
   "Aplicar código pegado".
No hace falta internet más allá de lo que uses para enviar el
enlace (WhatsApp, AirDrop, etc.); no depende de ningún servidor.

MANIFEST (icono y nombre en la pantalla de inicio del iPad)
manifest.webmanifest es un archivo estático (no puede leer config.js),
así que si cambias el nombre de marca actualízalo también ahí:
  "name": "..."        -> igual que brand.manifestName
  "short_name": "..."  -> igual que brand.manifestShortName

SUBIR A NETLIFY
1. Sube la carpeta completa (arrastrar y soltar en Deploys).
2. Espera a que el deploy muestre "Published".
3. Abre la URL de Netlify en Safari y refresca.

VERSIÓN PARA LA PANTALLA DE INICIO DEL IPAD
1. Borra el icono antiguo de VYBE de la pantalla de inicio.
2. Abre la URL actualizada de Netlify en Safari.
3. Confirma que la pantalla de inicio muestra los textos correctos.
4. Toca Compartir > Añadir a pantalla de inicio.
5. Lanza la app desde el nuevo icono.

NOTA
El indicador de privacidad verde/naranja del iPad puede aparecer
mientras la cámara está activa. Lo controla iPadOS, no la app.
