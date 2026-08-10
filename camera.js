window.VYBE_CAMERA = (() => {
  let stream = null;
  let facing = "user";
  let filterTimer = null;
  let glitchTimer = null;
  let badgeHideTimer = null;
  let filterOn = false;
  let lastOptions = {};

  // La cámara real se reproduce oculta en <video id="cameraSource">.
  // Lo que se ve en pantalla es <canvas id="camera">, pintado fotograma
  // a fotograma aquí — así podemos aplicar el suavizado SOLO en la piel
  // (usando puntos de referencia de la cara) y no en toda la imagen.
  let sourceVideo = null;
  let canvasEl = null;
  let ctx = null;
  let rafId = null;

  // ---------- Detección facial (MediaPipe FaceLandmarker) ----------
  // Índices de puntos de referencia (topología estándar de 468 puntos
  // de MediaPipe Face Mesh) que forman el contorno de: óvalo de la
  // cara, ojo izquierdo, ojo derecho y labios exteriores.
  const FACE_OVAL = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];
  const LEFT_EYE = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246];
  const RIGHT_EYE = [263, 249, 390, 373, 374, 380, 381, 382, 362, 398, 384, 385, 386, 387, 388, 466];
  const LIPS_OUTER = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 409, 270, 269, 267, 0, 37, 39, 40, 185];

  let faceLandmarker = null;
  if (window.__vybeFaceLandmarkerReady) {
    window.__vybeFaceLandmarkerReady.then((lm) => { faceLandmarker = lm || null; });
  }

  let frameCounter = 0;
  const DETECT_EVERY_N_FRAMES = 6; // en CPU es más lento; detectar cara ~5 veces/seg a 30fps
  let cachedMask = null; // { facePath, eyesMouthPath } en coordenadas del canvas

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

  function coverRect(source) {
    const sw = source.videoWidth, sh = source.videoHeight;
    if (!sw || !sh) return null;
    const cw = canvasEl.width, ch = canvasEl.height;
    const scale = Math.max(cw / sw, ch / sh);
    const dw = sw * scale, dh = sh * scale;
    const dx = (cw - dw) / 2, dy = (ch - dh) / 2;
    return { dx, dy, dw, dh };
  }

  function drawCovered(source, rect) {
    if (!rect) return;
    ctx.drawImage(source, rect.dx, rect.dy, rect.dw, rect.dh);
  }

  function pathFromIndices(landmarks, indices, rect) {
    const path = new Path2D();
    indices.forEach((idx, i) => {
      const lm = landmarks[idx];
      const x = rect.dx + lm.x * rect.dw;
      const y = rect.dy + lm.y * rect.dh;
      if (i === 0) path.moveTo(x, y); else path.lineTo(x, y);
    });
    path.closePath();
    return path;
  }

  function updateFaceMask(rect) {
    if (!faceLandmarker || !sourceVideo || sourceVideo.readyState < 2) return;
    let result;
    try {
      result = faceLandmarker.detectForVideo(sourceVideo, performance.now());
    } catch (error) {
      return; // si falla la detección en algún fotograma, seguimos con la última máscara conocida
    }
    const landmarks = result && result.faceLandmarks && result.faceLandmarks[0];
    if (!landmarks) return;

    const facePath = pathFromIndices(landmarks, FACE_OVAL, rect);
    const eyesMouthPath = new Path2D();
    eyesMouthPath.addPath(pathFromIndices(landmarks, LEFT_EYE, rect));
    eyesMouthPath.addPath(pathFromIndices(landmarks, RIGHT_EYE, rect));
    eyesMouthPath.addPath(pathFromIndices(landmarks, LIPS_OUTER, rect));

    cachedMask = { facePath, eyesMouthPath };
  }

  function renderLoop() {
    rafId = requestAnimationFrame(renderLoop);
    if (!sourceVideo || sourceVideo.readyState < 2 || !ctx) return;
    resizeCanvasToDisplaySize();

    const rect = coverRect(sourceVideo);
    if (!rect) return;

    // 1) Base nítida, siempre.
    ctx.filter = "none";
    drawCovered(sourceVideo, rect);

    if (filterOn) {
      frameCounter++;
      if (faceLandmarker && frameCounter % DETECT_EVERY_N_FRAMES === 0) {
        updateFaceMask(rect);
      }

      // 2) Glow cálido sobre TODA la imagen, en modo "screen" — esto es lo
      // que hace que el filtro se note siempre, incluso si la detección de
      // cara (paso 3) todavía está cargando o falla en el dispositivo.
      ctx.filter = "blur(11px) brightness(1.35) saturate(1.35) contrast(0.94)";
      ctx.globalAlpha = 0.6;
      ctx.globalCompositeOperation = "screen";
      drawCovered(sourceVideo, rect);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";

      if (faceLandmarker && cachedMask) {
        // 3) Suavizado extra, más fuerte, SOLO dentro del óvalo de la cara.
        ctx.save();
        ctx.clip(cachedMask.facePath);
        ctx.filter = "blur(14px) brightness(1.12) saturate(1.15)";
        ctx.globalAlpha = 0.55;
        drawCovered(sourceVideo, rect);
        ctx.globalAlpha = 1;
        ctx.restore();

        // 4) Se devuelve la nitidez de ojos y boca por encima del suavizado.
        ctx.save();
        ctx.clip(cachedMask.eyesMouthPath);
        ctx.filter = "brightness(1.06) saturate(1.1) contrast(1.03)";
        drawCovered(sourceVideo, rect);
        ctx.restore();
      }
    }

    ctx.filter = "none";
  }

  function turnFilterOff(canvasElement, options) {
    clearFilterTimers();
    filterOn = false;
    cachedMask = null;

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
    cachedMask = null;
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
    cachedMask = null;
    await start(canvasElement);
    return facing;
  }

  function getFacing() {
    return facing;
  }

  return { start, switchCamera, getFacing, startBeautyFilter, stopBeautyFilter, toggleBeautyFilter, isFilterOn };
})();
