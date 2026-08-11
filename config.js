/* =========================================================================
   VYBE LIVE — CONFIGURACIÓN ÚNICA
   Edita SOLO este archivo para cambiar cualquier texto, color, nombre,
   comentarios o número que aparece en la app. No hace falta tocar
   index.html, style.css ni ningún otro .js para producciones distintas.
   ========================================================================= */

window.VYBE_CONFIG = {

  /* ---------- MARCA / APP ---------- */
  brand: {
    letter: "",               // letra/inicial del logo circular (vacío = invisible, pero clicable)
    name: "",                 // nombre corto (wordmark de la pantalla de inicio)
    label: "",                // texto de la esquina superior izquierda durante la emisión
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
  displayName: "Helen Wildson",
  handle: "@helenwildson",
  location: "San Francisco",

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
  startingViewers: 5,
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
    // Íconos abstractos (formas/colores, generados) — en el mismo orden
    // que los 5 comentarios de abajo. Ninguna foto real de nadie.
    chat: [
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAiIHkxPSIwIiB4Mj0iMSIgeTI9IjEiPgo8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNmZjlhOGIiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmZjZhODgiLz4KPC9saW5lYXJHcmFkaWVudD48L2RlZnM+CjxyZWN0IHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgcng9IjE2IiBmaWxsPSJ1cmwoI2cpIi8+CjxjaXJjbGUgY3g9IjMyIiBjeT0iMzIiIHI9IjE0IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LC4zNSkiLz4KPC9zdmc+",
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAiIHkxPSIwIiB4Mj0iMSIgeTI9IjEiPgo8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNhOGVkZWEiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmZWQ2ZTMiLz4KPC9saW5lYXJHcmFkaWVudD48L2RlZnM+CjxyZWN0IHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgcng9IjE2IiBmaWxsPSJ1cmwoI2cpIi8+Cjxwb2x5Z29uIHBvaW50cz0iMzIsMTYgNDgsNDggMTYsNDgiIGZpbGw9InJnYmEoNywxOSwzMCwuMjgpIi8+Cjwvc3ZnPg==",
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAiIHkxPSIwIiB4Mj0iMSIgeTI9IjEiPgo8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNmNmQzNjUiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmZGEwODUiLz4KPC9saW5lYXJHcmFkaWVudD48L2RlZnM+CjxyZWN0IHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgcng9IjE2IiBmaWxsPSJ1cmwoI2cpIi8+CjxyZWN0IHg9IjE4IiB5PSIxOCIgd2lkdGg9IjI4IiBoZWlnaHQ9IjI4IiByeD0iOCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwuMykiLz4KPC9zdmc+",
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAiIHkxPSIwIiB4Mj0iMSIgeTI9IjEiPgo8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4NGZhYjAiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4ZmQzZjQiLz4KPC9saW5lYXJHcmFkaWVudD48L2RlZnM+CjxyZWN0IHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgcng9IjE2IiBmaWxsPSJ1cmwoI2cpIi8+CjxjaXJjbGUgY3g9IjI0IiBjeT0iMjYiIHI9IjgiIGZpbGw9InJnYmEoNywxOSwzMCwuMjUpIi8+PGNpcmNsZSBjeD0iNDAiIGN5PSIzOCIgcj0iOCIgZmlsbD0icmdiYSg3LDE5LDMwLC4yNSkiLz4KPC9zdmc+",
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAiIHkxPSIwIiB4Mj0iMSIgeTI9IjEiPgo8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNjNDcxZjUiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmYTcxY2QiLz4KPC9saW5lYXJHcmFkaWVudD48L2RlZnM+CjxyZWN0IHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgcng9IjE2IiBmaWxsPSJ1cmwoI2cpIi8+CjxwYXRoIGQ9Ik0xNiA0MCBRMzIgMTIgNDggNDAgWiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwuMzIpIi8+Cjwvc3ZnPg=="
    ]
  },

  /* ---------- COMENTARIOS FIJOS DEL CHAT (attrezzo para rodaje) ----------
     Exactamente 5, en este orden, sin aleatoriedad — para que se vean
     igual en cada toma. Usuarios inventados para la producción. */
  comments: [
    ["puppylover80032", "HI HONEY <3"],
    ["woke.is.a.v1rus", "you're stunning ✨✨"],
    ["quantum.rae", "Omg yasss queeen"],
    ["freethinker_lo", "The system is so broken, you are so right."],
    ["kyle.realtalk", "750 an hour?!?! Lmao"]
  ]
};
