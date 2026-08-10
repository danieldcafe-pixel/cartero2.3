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
  // Puntos de referencia para el moldeado (ojos más grandes, cara más
  // afinada): mejilla/mandíbula izquierda y derecha, en el punto más
  // ancho de la cara — los que se usan típicamente para medir "ancho
  // facial" en apps de retoque.
  const LEFT_CHEEK = 234;
  const RIGHT_CHEEK = 454;

  // BUG encontrado: camera.js (script normal) se ejecuta ANTES que el
  // <script type="module"> de index.html que crea window.__vybeFace-
  // LandmarkerReady (los módulos siempre se difieren hasta después de
  // los scripts normales). Por eso el chequeo de abajo siempre daba
  // falso y nunca nos enterábamos cuando MediaPipe terminaba de cargar,
  // aunque cargara bien. Se resuelve revisando en cada fotograma hasta
  // que la promesa exista, en vez de solo una vez al principio.
  let faceLandmarker = null;
  let landmarkerSubscribed = false;
  function ensureFaceLandmarkerSubscription() {
    if (landmarkerSubscribed || !window.__vybeFaceLandmarkerReady) return;
    landmarkerSubscribed = true;
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
    const sw = source.videoWidth || source.width;
    const sh = source.videoHeight || source.height;
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

  // ---------- Desenfoque "estirado" (no depende de ctx.filter) ----------
  // ctx.filter con blur() tiene soporte poco fiable en Safari/iOS: en
  // algunos dispositivos simplemente no dibuja nada, lo que dejaba el
  // filtro embellecedor sin ningún efecto visible. Esta técnica dibuja el
  // origen en un canvas diminuto (eso ya lo desenfoca al perder detalle) y
  // luego lo estira de vuelta a tamaño completo — funciona igual en
  // cualquier navegador porque solo usa drawImage.
  let glowCanvas = null;
  let glowCtx = null;

  function drawSoftGlow(targetCtx, source, rect) {
    if (!glowCanvas) {
      glowCanvas = document.createElement("canvas");
      glowCtx = glowCanvas.getContext("2d");
    }
    // Como esto solo se dibuja dentro del recorte de la cara (nunca toca
    // el fondo), se puede desenfocar bastante fuerte sin miedo.
    const downscale = 40; // solo se dibuja dentro de la cara, puede ser fuerte
    const gw = Math.max(2, Math.round(canvasEl.width / downscale));
    const gh = Math.max(2, Math.round(canvasEl.height / downscale));
    if (glowCanvas.width !== gw || glowCanvas.height !== gh) {
      glowCanvas.width = gw;
      glowCanvas.height = gh;
    }
    const s = gw / canvasEl.width;
    glowCtx.clearRect(0, 0, gw, gh);
    glowCtx.drawImage(source, rect.dx * s, rect.dy * s, rect.dw * s, rect.dh * s);

    targetCtx.imageSmoothingEnabled = true;
    targetCtx.globalAlpha = 0.85;
    targetCtx.drawImage(glowCanvas, 0, 0, gw, gh, 0, 0, canvasEl.width, canvasEl.height);
    targetCtx.globalAlpha = 1;

    // Brillo cálido encima (modo "screen": aclara sin lavar los blancos).
    targetCtx.save();
    targetCtx.globalCompositeOperation = "screen";
    targetCtx.fillStyle = "rgba(255,222,200,0.18)";
    targetCtx.fillRect(0, 0, canvasEl.width, canvasEl.height);
    targetCtx.restore();
  }

  // ---------- Recorte con borde difuminado (sin efecto "máscara") ----------
  // ctx.clip() con el óvalo de la cara corta con un borde 100% duro/recto
  // — se nota como una máscara pegada encima de la cara. Para evitarlo,
  // la piel suavizada se pinta en un canvas aparte (compositeCanvas) y
  // se recorta con una máscara que primero se dibuja chiquita (eso ya
  // difumina su contorno) y luego se estira — el mismo truco que usamos
  // para el desenfoque, aplicado al borde del recorte.
  let maskCanvas = null;
  let maskCtx = null;
  let compositeCanvas = null;
  let compositeCtx = null;

  function drawFeatheredFaceSmoothing(source, rect, path) {
    if (!compositeCanvas) {
      compositeCanvas = document.createElement("canvas");
      compositeCtx = compositeCanvas.getContext("2d");
    }
    if (compositeCanvas.width !== canvasEl.width || compositeCanvas.height !== canvasEl.height) {
      compositeCanvas.width = canvasEl.width;
      compositeCanvas.height = canvasEl.height;
    }
    compositeCtx.clearRect(0, 0, compositeCanvas.width, compositeCanvas.height);
    drawSoftGlow(compositeCtx, source, rect);

    if (!maskCanvas) {
      maskCanvas = document.createElement("canvas");
      maskCtx = maskCanvas.getContext("2d");
    }
    const md = 22; // más alto = borde más difuminado
    const mw = Math.max(2, Math.round(canvasEl.width / md));
    const mh = Math.max(2, Math.round(canvasEl.height / md));
    if (maskCanvas.width !== mw || maskCanvas.height !== mh) {
      maskCanvas.width = mw;
      maskCanvas.height = mh;
    }
    maskCtx.clearRect(0, 0, mw, mh);
    maskCtx.save();
    maskCtx.scale(mw / canvasEl.width, mh / canvasEl.height);
    maskCtx.fillStyle = "#fff";
    maskCtx.fill(path);
    maskCtx.restore();

    compositeCtx.globalCompositeOperation = "destination-in";
    compositeCtx.imageSmoothingEnabled = true;
    compositeCtx.drawImage(maskCanvas, 0, 0, mw, mh, 0, 0, compositeCanvas.width, compositeCanvas.height);
    compositeCtx.globalCompositeOperation = "source-over";

    ctx.drawImage(compositeCanvas, 0, 0);
  }

  // ---------- Respaldo mientras no hay datos de cara ----------
  // Si la detección facial (MediaPipe) todavía está cargando, va lenta,
  // o directamente no funciona en este dispositivo/red, esto asegura que
  // el filtro se vea igual desde el primer segundo. SIN desenfoque —
  // cualquier blur, por leve que sea, se termina leyendo como "cámara
  // desenfocada". Es solo un cambio de color: más brillo y calidez,
  // manteniendo la imagen 100% nítida. En cuanto la detección facial
  // esté lista, deja de usarse y entra el suavizado preciso + el
  // moldeado de ojos/mandíbula.
  function drawWholeFrameFallback() {
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = "rgba(255,225,205,0.22)";
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
    ctx.restore();
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

  // ---------- Moldeado geométrico (ojos más grandes, cara más afinada) ----------
  // Esto NO se puede hacer con canvas 2D (que solo pinta píxeles, no los
  // desplaza) — hace falta un shader WebGL que, para cada píxel de salida,
  // decida de qué otro punto de la imagen original tomar el color. Cerca
  // de cada ojo "atrae" la muestra hacia el centro (agranda esa zona); en
  // las mejillas/mandíbula la "aleja" (la encoge). Se renderiza aparte, en
  // un canvas oculto, y el resultado se usa como si fuera el video de
  // entrada para todo lo demás (desenfoque, brillo, etc.).
  const MAX_WARP_POINTS = 6;
  const EYE_ENLARGE_AMOUNT = 0.42;
  const JAW_SLIM_AMOUNT = 0.3;

  let warpCanvas = null;
  let gl = null;
  let glFailed = false;
  let warpProgram = null;
  let warpTexture = null;
  let warpUniforms = null;
  let warpParams = null; // { centers: Float32Array(12), radii: Float32Array(6), amounts: Float32Array(6), count }

  function compileShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("Shader del moldeado facial:", gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  function initWarpGL() {
    if (glFailed) return false;
    if (gl) return true;

    warpCanvas = document.createElement("canvas");
    gl = warpCanvas.getContext("webgl", { premultipliedAlpha: false })
      || warpCanvas.getContext("experimental-webgl", { premultipliedAlpha: false });
    if (!gl) {
      glFailed = true;
      return false;
    }

    const vertexSrc = `
      attribute vec2 aPos;
      varying vec2 vUv;
      void main() {
        vUv = aPos * 0.5 + 0.5;
        gl_Position = vec4(aPos, 0.0, 1.0);
      }
    `;
    const fragmentSrc = `
      precision mediump float;
      varying vec2 vUv;
      uniform sampler2D uTex;
      uniform vec2 uCenters[${MAX_WARP_POINTS}];
      uniform float uRadii[${MAX_WARP_POINTS}];
      uniform float uAmounts[${MAX_WARP_POINTS}];
      uniform int uCount;
      uniform float uAspect;

      void main() {
        vec2 uv = vUv;
        for (int i = 0; i < ${MAX_WARP_POINTS}; i++) {
          if (i >= uCount) break;
          float radius = uRadii[i];
          if (radius <= 0.0) continue;
          vec2 center = uCenters[i];
          vec2 d = uv - center;
          vec2 dPhys = vec2(d.x, d.y / uAspect);
          float dist = length(dPhys);
          if (dist < radius) {
            float percent = 1.0 - dist / radius;
            float theta = percent * percent * uAmounts[i];
            d *= (1.0 - theta);
            uv = center + d;
          }
        }
        gl_FragColor = texture2D(uTex, uv);
      }
    `;

    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSrc);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSrc);
    if (!vertexShader || !fragmentShader) {
      glFailed = true;
      return false;
    }

    warpProgram = gl.createProgram();
    gl.attachShader(warpProgram, vertexShader);
    gl.attachShader(warpProgram, fragmentShader);
    gl.linkProgram(warpProgram);
    if (!gl.getProgramParameter(warpProgram, gl.LINK_STATUS)) {
      console.error("No se pudo enlazar el shader del moldeado facial:", gl.getProgramInfoLog(warpProgram));
      glFailed = true;
      return false;
    }

    const quad = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);

    gl.useProgram(warpProgram);
    const aPos = gl.getAttribLocation(warpProgram, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    warpTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, warpTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    warpUniforms = {
      tex: gl.getUniformLocation(warpProgram, "uTex"),
      centers: gl.getUniformLocation(warpProgram, "uCenters"),
      radii: gl.getUniformLocation(warpProgram, "uRadii"),
      amounts: gl.getUniformLocation(warpProgram, "uAmounts"),
      count: gl.getUniformLocation(warpProgram, "uCount"),
      aspect: gl.getUniformLocation(warpProgram, "uAspect")
    };

    return true;
  }

  function averageLandmark(landmarks, indices) {
    let x = 0, y = 0;
    indices.forEach((i) => { x += landmarks[i].x; y += landmarks[i].y; });
    return { x: x / indices.length, y: y / indices.length };
  }

  function landmarkSpan(landmarks, indices) {
    let minX = 1, maxX = 0, minY = 1, maxY = 0;
    indices.forEach((i) => {
      const p = landmarks[i];
      minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
      minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y);
    });
    return Math.max(maxX - minX, maxY - minY);
  }

  // MediaPipe da landmark.y con origen arriba (0 = arriba, 1 = abajo);
  // el shader trabaja en espacio UV de WebGL con origen abajo, así que se
  // invierte una sola vez acá en vez de por píxel dentro del shader.
  function toUvPoint(p) {
    return { x: p.x, y: 1 - p.y };
  }

  function computeWarpParams(landmarks) {
    const leftEye = toUvPoint(averageLandmark(landmarks, LEFT_EYE));
    const rightEye = toUvPoint(averageLandmark(landmarks, RIGHT_EYE));
    const eyeSpan = Math.max(landmarkSpan(landmarks, LEFT_EYE), landmarkSpan(landmarks, RIGHT_EYE));
    const eyeRadius = eyeSpan * 2.1;

    const leftCheek = toUvPoint(landmarks[LEFT_CHEEK]);
    const rightCheek = toUvPoint(landmarks[RIGHT_CHEEK]);
    const jawRadius = eyeSpan * 3.6;

    const centers = new Float32Array(MAX_WARP_POINTS * 2);
    const radii = new Float32Array(MAX_WARP_POINTS);
    const amounts = new Float32Array(MAX_WARP_POINTS);

    const points = [
      [leftEye, eyeRadius, EYE_ENLARGE_AMOUNT],
      [rightEye, eyeRadius, EYE_ENLARGE_AMOUNT],
      [leftCheek, jawRadius, -JAW_SLIM_AMOUNT],
      [rightCheek, jawRadius, -JAW_SLIM_AMOUNT]
    ];
    points.forEach(([point, radius, amount], i) => {
      centers[i * 2] = point.x;
      centers[i * 2 + 1] = point.y;
      radii[i] = radius;
      amounts[i] = amount;
    });

    warpParams = { centers, radii, amounts, count: points.length };
  }

  function renderWarpedFrame() {
    if (!warpParams) return null;
    if (!initWarpGL()) return null;

    const vw = sourceVideo.videoWidth, vh = sourceVideo.videoHeight;
    if (!vw || !vh) return null;
    if (warpCanvas.width !== vw || warpCanvas.height !== vh) {
      warpCanvas.width = vw;
      warpCanvas.height = vh;
    }

    gl.viewport(0, 0, vw, vh);
    gl.useProgram(warpProgram);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, warpTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sourceVideo);
    gl.uniform1i(warpUniforms.tex, 0);

    gl.uniform2fv(warpUniforms.centers, warpParams.centers);
    gl.uniform1fv(warpUniforms.radii, warpParams.radii);
    gl.uniform1fv(warpUniforms.amounts, warpParams.amounts);
    gl.uniform1i(warpUniforms.count, warpParams.count);
    gl.uniform1f(warpUniforms.aspect, vw / vh);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    return warpCanvas;
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
    computeWarpParams(landmarks);
  }

  function renderLoop() {
    rafId = requestAnimationFrame(renderLoop);
    ensureFaceLandmarkerSubscription();
    if (!sourceVideo || sourceVideo.readyState < 2 || !ctx) return;
    resizeCanvasToDisplaySize();

    let effectiveSource = sourceVideo;

    if (filterOn) {
      frameCounter++;
      if (faceLandmarker && frameCounter % DETECT_EVERY_N_FRAMES === 0) {
        updateFaceMask(coverRect(sourceVideo));
      }
      if (faceLandmarker && warpParams) {
        const warped = renderWarpedFrame();
        if (warped) effectiveSource = warped;
      }
    }

    const rect = coverRect(effectiveSource);
    if (!rect) return;

    // 1) Base nítida (ya con ojos/mandíbula moldeados si hay detección).
    ctx.filter = "none";
    drawCovered(effectiveSource, rect);

    if (filterOn) {
      // El fondo se queda tal cual (nítido) — todo el efecto vive dentro
      // del óvalo de la cara para no acentuar el ruido de la cámara en
      // zonas donde no aporta nada.
      if (faceLandmarker && cachedMask) {
        // 2) Suavizado de piel, fuerte, con borde difuminado (no un
        // recorte duro tipo "máscara") dentro del óvalo de la cara.
        drawFeatheredFaceSmoothing(effectiveSource, rect, cachedMask.facePath);

        // 3) Se devuelve la nitidez total de ojos y boca por encima.
        ctx.save();
        ctx.clip(cachedMask.eyesMouthPath);
        ctx.filter = "none";
        drawCovered(effectiveSource, rect);
        ctx.restore();
      } else {
        // Sin datos de cara todavía (MediaPipe cargando/lento/sin
        // soporte en este dispositivo) — efecto de respaldo sobre toda
        // la imagen para que el filtro se note desde ya.
        drawWholeFrameFallback();
      }
    }

    ctx.filter = "none";

    // ---------- DIAGNÓSTICO TEMPORAL ----------
    // Indicador en la esquina para saber, con certeza, en qué paso se
    // corta la cadena: si MediaPipe cargó y si está detectando la cara
    // en este dispositivo. Se saca una vez que quede claro el problema.
    let debugText = "MP: cargando";
    let debugColor = "#999";
    if (faceLandmarker === null && !window.__vybeFaceLandmarkerReady) {
      debugText = "MP: sin promesa";
      debugColor = "#999";
    } else if (faceLandmarker) {
      if (cachedMask) {
        debugText = "MP: OK, cara SI";
        debugColor = "#3ddc84";
      } else {
        debugText = "MP: OK, cara NO";
        debugColor = "#ff5252";
      }
    } else if (window.__vybeFaceLandmarkerError) {
      debugText = "ERROR: " + window.__vybeFaceLandmarkerError.slice(0, 60);
      debugColor = "#ff5252";
    } else {
      debugText = "MP: " + (window.__vybeMpStage || "cargando todavía...");
      debugColor = "#ffb300";
    }
    ctx.save();
    // La cámara frontal se muestra en espejo (CSS scaleX(-1) sobre el
    // canvas entero); sin esto el texto saldría invertido en pantalla.
    if (canvasEl.classList.contains("mirror")) {
      ctx.translate(canvasEl.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.font = "bold 28px sans-serif";
    ctx.textBaseline = "top";
    const pad = 10;
    const w = ctx.measureText(debugText).width + pad * 2;
    // Porcentaje de la altura, no píxeles fijos, para caer siempre debajo
    // de la cabecera y arriba del chat sin importar el tamaño de pantalla.
    const y = canvasEl.height * 0.32;
    ctx.fillStyle = "rgba(0,0,0,0.75)";
    ctx.fillRect(10, y, w, 46);
    ctx.fillStyle = debugColor;
    ctx.fillText(debugText, 10 + pad, y + 8);
    ctx.restore();
  }

  function turnFilterOff(canvasElement, options) {
    clearFilterTimers();
    filterOn = false;
    cachedMask = null;
    warpParams = null;

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
    warpParams = null;
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
    warpParams = null;
    await start(canvasElement);
    return facing;
  }

  function getFacing() {
    return facing;
  }

  return { start, switchCamera, getFacing, startBeautyFilter, stopBeautyFilter, toggleBeautyFilter, isFilterOn };
})();
