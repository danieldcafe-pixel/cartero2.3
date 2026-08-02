window.VYBE_CAMERA = (() => {
  let stream = null;
  let facing = "user";
  let filterTimer = null;
  let glitchTimer = null;
  let badgeHideTimer = null;
  let filterOn = false;
  let lastOptions = {};

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

  function turnFilterOff(videoElement, options) {
    clearFilterTimers();
    filterOn = false;

    const overlay = getGlitchOverlay();
    const badge = getFilterBadge();
    videoElement.classList.add("filter-glitch");
    if (overlay) overlay.classList.add("active");
    if (badge) badge.textContent = options.offText || "FILTER OFF";

    const glitchMs = options.glitchMs ?? 650;
    glitchTimer = setTimeout(() => {
      videoElement.classList.remove("beauty-filter", "filter-glitch");
      if (overlay) overlay.classList.remove("active");
      badgeHideTimer = setTimeout(() => {
        if (badge) badge.classList.remove("show");
      }, 1400);
    }, glitchMs);
  }

  function turnFilterOn(videoElement, options) {
    clearFilterTimers();
    filterOn = true;

    const overlay = getGlitchOverlay();
    const badge = getFilterBadge();
    videoElement.classList.remove("filter-glitch");
    if (overlay) overlay.classList.remove("active");
    videoElement.classList.add("beauty-filter");

    if (badge) {
      badge.textContent = options.activeText || "✨ FILTER ON";
      badge.classList.add("show");
    }

    const durationMs = Math.max(0, (options.durationSeconds ?? 40) * 1000);
    filterTimer = setTimeout(() => turnFilterOff(videoElement, options), durationMs);
  }

  function startBeautyFilter(videoElement, options = {}) {
    lastOptions = options;
    turnFilterOn(videoElement, options);
  }

  function toggleBeautyFilter(videoElement, options = lastOptions) {
    lastOptions = options;
    if (filterOn) {
      turnFilterOff(videoElement, options);
    } else {
      turnFilterOn(videoElement, options);
    }
  }

  function stopBeautyFilter(videoElement) {
    clearFilterTimers();
    filterOn = false;
    const overlay = getGlitchOverlay();
    const badge = getFilterBadge();
    videoElement.classList.remove("beauty-filter", "filter-glitch");
    if (overlay) overlay.classList.remove("active");
    if (badge) badge.classList.remove("show");
  }

  function isFilterOn() {
    return filterOn;
  }

  async function start(videoElement) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error("Camera API is unavailable.");
    }

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

    videoElement.srcObject = stream;
    videoElement.classList.toggle("mirror", facing === "user");
    await videoElement.play();
  }

  async function switchCamera(videoElement) {
    facing = facing === "user" ? "environment" : "user";
    await start(videoElement);
    return facing;
  }

  function getFacing() {
    return facing;
  }

  return { start, switchCamera, getFacing, startBeautyFilter, stopBeautyFilter, toggleBeautyFilter, isFilterOn };
})();
