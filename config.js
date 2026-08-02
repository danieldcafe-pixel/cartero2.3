/* =========================================================================
   VYBE LIVE — CONFIGURACIÓN ÚNICA
   Edita SOLO este archivo para cambiar cualquier texto, color, nombre,
   comentarios o número que aparece en la app. No hace falta tocar
   index.html, style.css ni ningún otro .js para producciones distintas.
   ========================================================================= */

window.VYBE_CONFIG = {

  /* ---------- MARCA / APP ---------- */
  brand: {
    letter: "V",              // letra/inicial del logo circular
    name: "VYBE",             // nombre corto (wordmark de la pantalla de inicio)
    label: "VYBE / LIVE",     // texto de la esquina superior izquierda durante la emisión
    pageTitle: "VYBE Live",   // título de la pestaña del navegador
    manifestName: "VYBE Live",     // nombre completo (Home Screen / manifest)
    manifestShortName: "VYBE",     // nombre corto (debajo del icono en Home Screen)
    themeColor: "#07131e"          // color de la barra de estado / theme-color
  },

  /* ---------- PALETA DE COLORES ---------- */
  colors: {
    ink: "#07131e",
    cyan: "#5ce6ed",
    violet: "#9377ff",
    textSoft: "#c9d6df"
  },

  /* ---------- PANTALLA DE INICIO (launch screen) ---------- */
  launch: {
    description: "Open a live camera session with automatic audience activity.",
    buttonText: "GO ON AIR",
    hint: "Camera permission is required."
  },

  /* ---------- CABECERA / ESTADO DE EMISIÓN ---------- */
  header: {
    airBadgeText: "ON AIR",
    viewersSuffix: "VIEWERS"
  },

  /* ---------- TARJETA DEL CREADOR ---------- */
  displayName: "Mara Vale",
  handle: "@maravale",
  location: "Los Angeles",

  /* ---------- TELEMETRÍA (fila de indicadores) ---------- */
  telemetry: {
    signalText: "STABLE",
    camLabel: "CAM",
    timeLabel: "TIME",
    cameraFront: "FRONT",
    cameraRear: "REAR"
  },

  /* ---------- PIE / DOCK INFERIOR ---------- */
  dock: {
    messagePrompt: "Send a message"
  },

  /* ---------- MENSAJES EMERGENTES (toast) ---------- */
  toasts: {
    cameraFailed: "Camera access failed",
    switchFailed: "Unable to switch camera",
    frontCamera: "Front camera",
    rearCamera: "Rear camera"
  },

  /* ---------- NÚMEROS INICIALES ---------- */
  startingViewers: 12,
  startingReactions: 0,

  /* ---------- FILTRO EMBELLECEDOR ----------
     Se aplica a la imagen de la cámara al pulsar GO ON AIR y se
     desactiva solo, mostrando un efecto de "glitch" en el momento
     en que se cae, para revelar la imagen real. */
  beautyFilter: {
    enabled: true,          // false = la app funciona igual que antes, sin filtro
    durationSeconds: 40,    // segundos que dura el filtro activo
    glitchMs: 650,          // duración del efecto de caída del filtro (milisegundos)
    activeText: "✨ FILTER ON",           // texto de la píldora mientras el filtro está puesto
    offText: "FILTER OFF"                // texto que se ve un instante cuando se cae
  },

  /* ---------- AVATARES ---------- */
  /* No los edites a mano: súbelos desde el panel de ajustes en la app
     (mantén pulsado el logo). Aquí solo quedan guardados como referencia. */
  avatars: {
    creator: null,
    chat: []
  },

  /* ---------- COMENTARIOS FALSOS DEL CHAT ---------- */
  comments: [
    ["ava.rye", "This is wild."],
    ["mileswest", "The picture looks amazing."],
    ["jordynv", "Where are you right now?"],
    ["nova.camera", "Just shared this with everyone."],
    ["samuel.k", "No way this is happening live."],
    ["tessframe", "Keep the camera rolling."],
    ["bryceonair", "This stream is taking off."],
    ["liv.marlow", "Can you show us more?"],
    ["kaitlynx", "Best thing on my feed tonight."],
    ["owenfield", "The sound is super clean."],
    ["riley.motion", "People are joining fast."],
    ["harperlane", "That was unreal."],
    ["drewvisuals", "I got here at the perfect time."],
    ["skylar.noir", "This deserves way more views."],
    ["eastsideben", "Do not end the stream."],
    ["maddieflux", "I just sent this to my group chat."],
    ["noahdistrict", "The vibe is unreal."],
    ["charlie.mp4", "This looks cinematic."]
  ]
};
