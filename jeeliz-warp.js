// Moldeado de cara (ojos más grandes, mejillas/mandíbula más afinadas)
// usando la librería jeelizFaceFilter (rastreo de cara probado, no el
// nuestro) + Three.js para deformar una malla 3D de cara texturizada con
// el video en vivo. El resultado queda en un canvas propio (jeelizCanvas)
// que camera.js usa como si fuera el video de entrada.
window.VYBE_FACE_WARP = (() => {
  let ready = false;
  let failed = false;
  let initStarted = false;
  let threeCamera = null;
  let jeelizCanvas = null;
  let videoTransformMat2 = null;
  let maskMaterial = null;

  // Coordenadas en el espacio local de la malla 3D (models/faceLowPoly.json)
  // — medidas directamente sobre ese archivo, no son valores inventados.
  // Los ojos están alrededor de (±0.33, 0.28); el punto más ancho de la
  // cara (mejilla/mandíbula) está alrededor de (±0.6, 0).
  const EYE_L = [-0.33, 0.28];
  const EYE_R = [0.33, 0.28];
  const CHEEK_L = [-0.55, 0.0];
  const CHEEK_R = [0.55, 0.0];

  const DEFAULT_EYE_AMOUNT = 0.16;
  const DEFAULT_CHEEK_AMOUNT = -0.14;

  function build_maskMaterial() {
    const vertexShaderSource = `
      uniform mat2 videoTransformMat2;
      uniform float eyeRadius;
      uniform float eyeAmount;
      uniform float cheekRadius;
      uniform float cheekAmount;
      varying vec2 vUVvideo;

      const vec2 EYE_L = vec2(${EYE_L[0]}, ${EYE_L[1]});
      const vec2 EYE_R = vec2(${EYE_R[0]}, ${EYE_R[1]});
      const vec2 CHEEK_L = vec2(${CHEEK_L[0]}, ${CHEEK_L[1]});
      const vec2 CHEEK_R = vec2(${CHEEK_R[0]}, ${CHEEK_R[1]});

      vec2 bulge(vec2 p, vec2 center, float radius, float amount) {
        vec2 d = p - center;
        float dist = length(d);
        if (radius > 0.0 && dist < radius) {
          float percent = 1.0 - dist / radius;
          float theta = percent * percent * amount;
          d *= (1.0 - theta);
          return center + d;
        }
        return p;
      }

      void main() {
        vec2 p = position.xy;
        p = bulge(p, EYE_L, eyeRadius, eyeAmount);
        p = bulge(p, EYE_R, eyeRadius, eyeAmount);
        p = bulge(p, CHEEK_L, cheekRadius, cheekAmount);
        p = bulge(p, CHEEK_R, cheekRadius, cheekAmount);
        vec3 positionDeformed = vec3(p, position.z);

        vec4 mvPosition = modelViewMatrix * vec4(positionDeformed, 1.0);
        gl_Position = projectionMatrix * mvPosition;

        // El UV del video se calcula con la posición ORIGINAL (sin
        // deformar) para que el "estirado" tome el color de donde
        // realmente está esa parte de la cara en el video.
        vec4 mvPosition0 = modelViewMatrix * vec4(position, 1.0);
        vec4 projectedPosition0 = projectionMatrix * mvPosition0;
        vUVvideo = vec2(0.5) + videoTransformMat2 * projectedPosition0.xy / projectedPosition0.w;
      }
    `;
    const fragmentShaderSource = `
      precision mediump float;
      uniform sampler2D samplerVideo;
      varying vec2 vUVvideo;
      void main() {
        gl_FragColor = texture2D(samplerVideo, vUVvideo);
      }
    `;
    return new THREE.ShaderMaterial({
      vertexShader: vertexShaderSource,
      fragmentShader: fragmentShaderSource,
      uniforms: {
        samplerVideo: { value: JeelizThreeHelper.get_threeVideoTexture() },
        videoTransformMat2: { value: videoTransformMat2 },
        eyeRadius: { value: 0.3 },
        eyeAmount: { value: DEFAULT_EYE_AMOUNT },
        cheekRadius: { value: 0.4 },
        cheekAmount: { value: DEFAULT_CHEEK_AMOUNT }
      }
    });
  }

  function init_threeScene(spec) {
    const threeStuffs = JeelizThreeHelper.init(spec, () => {});
    maskMaterial = build_maskMaterial();

    const loader = new THREE.BufferGeometryLoader();
    loader.load(
      "jeeliz/models/faceLowPoly.json",
      (geometry) => {
        geometry.computeVertexNormals();
        const mesh = new THREE.Mesh(geometry, maskMaterial);
        mesh.frustumCulled = false;
        mesh.scale.multiplyScalar(1.2);
        mesh.position.set(0, 0.2, -0.5);
        threeStuffs.faceObject.add(mesh);
        status = "listo";
      },
      undefined,
      (error) => {
        console.error("No se pudo cargar la malla de cara:", error);
        status = "error: no cargó la malla 3D";
        failed = true;
      }
    );

    threeCamera = JeelizThreeHelper.create_camera();
  }

  // ---------- DIAGNÓSTICO TEMPORAL ----------
  let status = "sin iniciar";
  function getStatus() {
    return status;
  }

  function init(videoElement) {
    if (initStarted) return;
    initStarted = true;
    status = "iniciando";

    jeelizCanvas = document.createElement("canvas");
    jeelizCanvas.width = 640;
    jeelizCanvas.height = 640;

    window.JEELIZFACEFILTER.init({
      canvas: jeelizCanvas,
      NNCPath: "jeeliz/neuralNets/",
      videoSettings: { videoElement },
      callbackReady: (errCode, spec) => {
        if (errCode) {
          console.error("Jeeliz no pudo inicializar:", errCode);
          status = "error: " + errCode;
          failed = true;
          return;
        }
        status = "cargando malla 3D";
        videoTransformMat2 = spec.videoTransformMat2;
        init_threeScene(spec);
        ready = true;
      },
      callbackTrack: (detectState) => {
        if (ready) window.JeelizThreeHelper.render(detectState, threeCamera);
      }
    });
  }

  function resize(width, height) {
    if (!jeelizCanvas || !width || !height) return;
    if (jeelizCanvas.width === width && jeelizCanvas.height === height) return;
    jeelizCanvas.width = width;
    jeelizCanvas.height = height;
    if (window.JEELIZFACEFILTER && window.JEELIZFACEFILTER.resize) {
      window.JEELIZFACEFILTER.resize();
    }
  }

  function getCanvas() {
    return (ready && !failed) ? jeelizCanvas : null;
  }

  function setIntensity(eyeAmount, cheekAmount) {
    if (!maskMaterial) return;
    maskMaterial.uniforms.eyeAmount.value = eyeAmount;
    maskMaterial.uniforms.cheekAmount.value = cheekAmount;
  }

  return { init, resize, getCanvas, setIntensity, getStatus };
})();
