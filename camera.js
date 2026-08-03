window.VYBE_CAMERA = (() => {
  let stream = null;
  let facing = "user";
  let filterTimer = null;
  let glitchTimer = null;
  let badgeHideTimer = null;
  let filterOn = false;
  let lastOptions = {};

  // La cámara real se reproduce oculta en <video id="cameraSource">.
  // Lo que se ve en pantalla es <canvas id="camera">, donde pintamos
  // cada fotograma nosotros mismos — así podemos mezclar una copia
  // suavizada con la nítida (algo que un simple filtro CSS no puede
  // hacer: un filtro CSS solo ensucia/aclara TODA la imagen por igual,
  // nunca suaviza la piel manteniendo ojos/labios definidos).
  let sourceVideo = null;
  let canvasEl = null;
  let ctx = null;
  let rafId = null;

  function getGlitchOverlay() {
    return document.getElementById("filterGlitchOverlay");
  }
  function getFilterBadge() {
    return document.getElementById("filterBadge");
  }

  function clearFilterTimers() {
    clearTimeout(filterTimer);
    clearTimeout(glitchTimer);
    clearTimeout(badgeHideTimer);
    filterTimer = null;
    glitchTimer = null;
    badgeHideTimer = null;
  }

  function resizeCanvasToDisplaySize() {
    const rect = canvasEl.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const w = Math.max(1, Math.round(rect.width * dpr));
    const h = Math.max(1, Math.round(rect.height * dpr));
    if (canvasEl.width !== w || canvasEl.height !== h) {
      canvasEl.width = w;
      canvasEl.height = h;
    }
  }

  function drawCovered(source) {
    const sw = source.videoWidth, sh = source.videoHeight;
    if (!sw || !sh) return;
    const cw = canvasEl.width, ch = canvasEl.height;
    const scale = Math.max(cw / sw, ch / sh);
    const dw = sw * scale, dh = sh * scale;
    const dx = (cw - dw) / 2, dy = (ch - dh) / 2;
    ctx.drawImage(source, dx, dy, dw, dh);
  }

  function renderLoop() {
    rafId = requestAnimationFrame(renderLoop);
    if (!sourceVideo || sourceVideo.readyState < 2 || !ctx) return;
    resizeCanvasToDisplaySize();

    if (filterOn) {
      // 1) Base muy suavizada, más luminosa y cálida — la "piel más tersa".
      ctx.filter = "blur(15px) brightness(1.32) saturate(1.5) contrast(0.85)";
      drawCovered(sourceVideo);

      // 2) Se repinta el fotograma nítido encima, en modo "overlay" y con
      // opacidad reducida: esto devuelve la definición de ojos, cejas y
      // labios, mientras la piel (zonas más planas) se queda dominada por
      // la base suavizada de abajo.
      ctx.filter = "none";
      ctx.globalAlpha = 0.38;
      ctx.globalCompositeOperation = "overlay";
      drawCovered(sourceVideo);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    } else {
      ctx.filter = "none";
      drawCovered(sourceVideo);
    }
  }

  function turnFilterOff(canvasElement, options) {
    clearFilterTimers();
    filterOn = false;

    const overlay = getGlitchOverlay();
    const badge = getFilterBadge();
    canvasElement.classList.add("filter-glitch");
    if (overlay) overlay.classList.add("active");
    if (badge) badge.textContent = options.offText || "FILTER OFF";

    const glitchMs = options.glitchMs ?? 650;
    glitchTimer = setTimeout(() => {
      canvasElement.classList.remove("beauty-filter", "filter-glitch");
      if (overlay) overlay.classList.remove("active");
      badgeHideTimer = setTimeout(() => {
        if (badge) badge.classList.remove("show");
      }, 1400);
    }, glitchMs);
  }

  function turnFilterOn(canvasElement, options) {
    clearFilterTimers();
    filterOn = true;

    const overlay = getGlitchOverlay();
    const badge = getFilterBadge();
    canvasElement.classList.remove("filter-glitch");
    if (overlay) overlay.classList.remove("active");
    canvasElement.classList.add("beauty-filter");

    if (badge) {
      badge.textContent = options.activeText || "✨ FILTER ON";
      badge.classList.add("show");
    }

    const durationMs = Math.max(0, (options.durationSeconds ?? 40) * 1000);
    filterTimer = setTimeout(() => turnFilterOff(canvasElement, options), durationMs);
  }

  function startBeautyFilter(canvasElement, options = {}) {
    lastOptions = options;
    turnFilterOn(canvasElement, options);
  }

  function toggleBeautyFilter(canvasElement, options = lastOptions) {
    lastOptions = options;
    if (filterOn) {
      turnFilterOff(canvasElement, options);
    } else {
      turnFilterOn(canvasElement, options);
    }
  }

  function stopBeautyFilter(canvasElement) {
    clearFilterTimers();
    filterOn = false;
    const overlay = getGlitchOverlay();
    const badge = getFilterBadge();
    canvasElement.classList.remove("beauty-filter", "filter-glitch");
    if (overlay) overlay.classList.remove("active");
    if (badge) badge.classList.remove("show");
  }

  function isFilterOn() {
    return filterOn;
  }

  async function start(canvasElement) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error("Camera API is unavailable.");
    }

    canvasEl = canvasElement;
    ctx = canvasEl.getContext("2d");

    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: { ideal: facing },
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      }
    });

    if (!sourceVideo) {
      sourceVideo = document.getElementById("cameraSource");
    }
    sourceVideo.srcObject = stream;
    canvasElement.classList.toggle("mirror", facing === "user");
    await sourceVideo.play();

    if (!rafId) {
      renderLoop();
    }
  }

  async function switchCamera(canvasElement) {
    facing = facing === "user" ? "environment" : "user";
    await start(canvasElement);
    return facing;
  }

  function getFacing() {
    return facing;
  }

  return { start, switchCamera, getFacing, startBeautyFilter, stopBeautyFilter, toggleBeautyFilter, isFilterOn };
})();
