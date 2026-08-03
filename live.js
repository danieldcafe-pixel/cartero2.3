/* =========================================================================
   VYBE LIVE — MOTOR DE EMISIÓN (espectadores, chat falso, reacciones, reloj)
   Reconstruido: este archivo se había perdido/sobrescrito.
   Expone window.VYBE_LIVE con la API que ya usa app.js:
     start(config, refs), manualReaction(), isFrozen(), setFrozen(bool),
     setViewers(number)
   ========================================================================= */
window.VYBE_LIVE = (() => {
  let cfg = null;
  let refs = {};
  let started = false;
  let frozen = false;

  let startTime = null;
  let currentViewers = 0;
  let currentReactions = 0;
  let commentIndex = 0;

  let intervals = [];
  let sparkTimeouts = [];

  const SPARK_COLORS = ["#5ce6ed", "#9377ff", "#ff6f91", "#ffd166", "#7be495"];
  const SPARK_CHARS = ["✦", "❤", "🔥", "✨", "👏"];
  const MAX_CHAT_ROWS = 20;

  function clearTimers() {
    intervals.forEach(clearInterval);
    intervals = [];
    sparkTimeouts.forEach(clearTimeout);
    sparkTimeouts = [];
  }

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function formatElapsed(ms) {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${pad(minutes)}:${pad(seconds)}`;
  }

  function pickChatAvatar(index) {
    const gallery = cfg.avatars && cfg.avatars.chat;
    if (!gallery || !gallery.length) return null;
    return gallery[index % gallery.length];
  }

  function pushComment() {
    if (!refs.chatFeed || !cfg.comments || !cfg.comments.length) return;

    const [name, text] = cfg.comments[commentIndex % cfg.comments.length];
    const avatarSrc = pickChatAvatar(commentIndex);
    commentIndex++;

    const row = document.createElement("div");
    row.className = "chat-row";

    const avatar = document.createElement("div");
    avatar.className = "chat-avatar";
    if (avatarSrc) {
      avatar.style.backgroundImage = `url('${avatarSrc}')`;
      avatar.style.backgroundSize = "cover";
      avatar.style.backgroundPosition = "center";
    }

    const message = document.createElement("div");
    message.className = "chat-message";
    const strong = document.createElement("b");
    strong.textContent = name;
    message.appendChild(strong);
    message.appendChild(document.createTextNode(text));

    row.appendChild(avatar);
    row.appendChild(message);
    refs.chatFeed.appendChild(row);

    while (refs.chatFeed.children.length > MAX_CHAT_ROWS) {
      refs.chatFeed.removeChild(refs.chatFeed.firstChild);
    }
  }

  function spawnSpark(manual) {
    if (!refs.reactionField) return;

    const spark = document.createElement("span");
    spark.className = "spark";

    const size = manual ? 28 + Math.random() * 12 : 16 + Math.random() * 14;
    const duration = 2.2 + Math.random() * 1.6;
    const x = Math.round(Math.random() * 44 - 22) + "px";
    const rotation = Math.round(Math.random() * 50 - 25) + "deg";
    const color = SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)];
    const char = SPARK_CHARS[Math.floor(Math.random() * SPARK_CHARS.length)];

    spark.style.setProperty("--size", size.toFixed(1) + "px");
    spark.style.setProperty("--duration", duration.toFixed(2) + "s");
    spark.style.setProperty("--x", x);
    spark.style.setProperty("--rotation", rotation);
    spark.style.setProperty("--spark-color", color);
    spark.textContent = char;

    refs.reactionField.appendChild(spark);
    const timeout = setTimeout(() => spark.remove(), duration * 1000 + 150);
    sparkTimeouts.push(timeout);
  }

  function setViewerDisplay() {
    if (refs.viewerCount) refs.viewerCount.textContent = currentViewers;
  }

  function setReactionDisplay() {
    if (refs.reactionCount) refs.reactionCount.textContent = currentReactions;
  }

  function bumpReactions(amount) {
    currentReactions = Math.max(0, currentReactions + amount);
    setReactionDisplay();
  }

  function bumpViewers(delta) {
    currentViewers = Math.max(1, currentViewers + delta);
    setViewerDisplay();
  }

  function randomViewerStep() {
    if (frozen) return;
    // Sesgado hacia arriba para que se sienta una emisión creciendo,
    // con algo de vaivén natural.
    const delta = Math.round((Math.random() - 0.35) * 14);
    if (delta !== 0) bumpViewers(delta);
  }

  function randomReactionStep() {
    if (frozen) return;
    if (Math.random() < 0.55) {
      bumpReactions(Math.round(1 + Math.random() * 2));
      spawnSpark(false);
    }
  }

  function start(config, elements) {
    clearTimers();
    cfg = config;
    refs = elements || {};
    started = true;
    commentIndex = 0;
    startTime = Date.now();

    currentViewers = Math.max(0, Math.round(cfg.startingViewers || 0));
    currentReactions = Math.max(0, Math.round(cfg.startingReactions || 0));

    if (refs.chatFeed) refs.chatFeed.innerHTML = "";
    if (refs.reactionField) refs.reactionField.innerHTML = "";
    if (refs.elapsedTime) refs.elapsedTime.textContent = "00:00";
    setViewerDisplay();
    setReactionDisplay();

    intervals.push(setInterval(() => {
      if (refs.elapsedTime) refs.elapsedTime.textContent = formatElapsed(Date.now() - startTime);
    }, 1000));

    intervals.push(setInterval(() => {
      if (Math.random() < 0.85) pushComment();
    }, 2600));

    intervals.push(setInterval(randomViewerStep, 2200));
    intervals.push(setInterval(randomReactionStep, 1400));

    // Primer comentario casi inmediato para que la pantalla no se sienta vacía.
    const firstComment = setTimeout(pushComment, 600);
    sparkTimeouts.push(firstComment);
  }

  function manualReaction() {
    bumpReactions(1);
    spawnSpark(true);
  }

  function isFrozen() {
    return frozen;
  }

  function setFrozen(value) {
    frozen = !!value;
  }

  function setViewers(value) {
    if (!started || !Number.isFinite(value)) return false;
    currentViewers = Math.max(0, Math.round(value));
    setViewerDisplay();
    return true;
  }

  return { start, manualReaction, isFrozen, setFrozen, setViewers };
})();
