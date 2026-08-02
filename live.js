window.VYBE_LIVE = (() => {
  const state = {
    running: false,
    seconds: 0,
    viewers: 0,
    reactions: 0,
    commentIndex: 0,
    frozen: false
  };

  let elements = {};
  let config = {};

  function formatCount(value) {
    if (value >= 1000000) return (value / 1000000).toFixed(1) + "M";
    if (value >= 1000) return (value / 1000).toFixed(1) + "K";
    return Math.round(value).toLocaleString("en-US");
  }

  function renderCounts() {
    elements.viewerCount.textContent = Math.max(0, Math.round(state.viewers)).toLocaleString("en-US");
    elements.reactionCount.textContent = formatCount(state.reactions);
  }

  function renderTime() {
    const minutes = String(Math.floor(state.seconds / 60)).padStart(2, "0");
    const seconds = String(state.seconds % 60).padStart(2, "0");
    elements.elapsedTime.textContent = `${minutes}:${seconds}`;
  }

  function addReaction(large = false) {
    const spark = document.createElement("span");
    spark.className = "spark";
    spark.textContent = ["✦", "✧", "◆", "⬡"][Math.floor(Math.random() * 4)];
    spark.style.setProperty("--x", `${Math.random() * 76 - 50}px`);
    spark.style.setProperty("--rotation", `${Math.random() * 60 - 30}deg`);
    spark.style.setProperty("--duration", `${2.1 + Math.random() * 1.8}s`);
    spark.style.setProperty("--size", `${large ? 31 : 18 + Math.random() * 16}px`);
    spark.style.setProperty("--spark-color", Math.random() > .5 ? "#5ce6ed" : "#a58cff");
    elements.reactionField.appendChild(spark);
    setTimeout(() => spark.remove(), 4300);
  }

  function addComment() {
    const index = state.commentIndex++;
    const [name, text] = config.comments[index % config.comments.length];
    const avatarList = (config.avatars && config.avatars.chat) || [];

    const row = document.createElement("div");
    row.className = "chat-row";

    const avatarSpan = document.createElement("span");
    avatarSpan.className = "chat-avatar";
    if (avatarList.length) {
      const image = avatarList[index % avatarList.length];
      avatarSpan.style.backgroundImage = `url('${image}')`;
      avatarSpan.style.backgroundSize = "cover";
      avatarSpan.style.backgroundPosition = "center";
    }

    const messageDiv = document.createElement("div");
    messageDiv.className = "chat-message";
    messageDiv.innerHTML = `<b>${name}</b>${text}`;

    row.appendChild(avatarSpan);
    row.appendChild(messageDiv);
    elements.chatFeed.appendChild(row);

    while (elements.chatFeed.children.length > 6) {
      elements.chatFeed.firstElementChild.remove();
    }
  }

  function reactionLoop() {
    if (state.running && !state.frozen) {
      const pace = state.seconds < 15 ? 2 : state.seconds < 45 ? 5 : state.seconds < 90 ? 9 : 14;
      let added = Math.floor(Math.random() * (pace + 1));

      if (Math.random() < .07) {
        added += 12 + Math.floor(Math.random() * 22);
      }

      state.reactions += added;
      const visualCount = Math.min(5, Math.ceil(added / 4));

      for (let index = 0; index < visualCount; index++) {
        setTimeout(() => addReaction(), index * 90);
      }

      renderCounts();
    }

    setTimeout(reactionLoop, 650 + Math.random() * 900);
  }

  function viewerLoop() {
    if (state.running && !state.frozen) {
      let drift = state.seconds < 20
        ? Math.floor(Math.random() * 6)
        : Math.floor(Math.random() * 15) - 3;

      if (Math.random() < .06) {
        drift += 24 + Math.floor(Math.random() * 45);
      }

      state.viewers = Math.max(10, state.viewers + drift);
      renderCounts();
    }

    setTimeout(viewerLoop, 2200 + Math.random() * 2800);
  }

  function commentLoop() {
    if (state.running) addComment();

    const minimum = state.seconds < 20 ? 4500 : state.seconds < 60 ? 3000 : 2100;
    const variation = state.seconds < 20 ? 4200 : state.seconds < 60 ? 3300 : 2600;
    setTimeout(commentLoop, minimum + Math.random() * variation);
  }

  function start(configObject, elementMap) {
    config = configObject;
    elements = elementMap;
    state.running = true;
    state.seconds = 0;
    state.viewers = config.startingViewers;
    state.reactions = config.startingReactions;
    state.commentIndex = 0;

    renderCounts();
    renderTime();
    addComment();
    setTimeout(addComment, 1800);

    setInterval(() => {
      if (!state.running) return;
      state.seconds += 1;
      renderTime();
    }, 1000);

    reactionLoop();
    viewerLoop();
    setTimeout(commentLoop, 5200);
  }

  function manualReaction() {
    state.reactions += 1;
    addReaction(true);
    renderCounts();
  }

  function setViewers(value) {
    if (!state.running || Number.isNaN(value)) return false;
    state.viewers = Math.max(0, Math.round(value));
    renderCounts();
    return true;
  }

  function setFrozen(value) {
    state.frozen = !!value;
  }

  function isFrozen() {
    return state.frozen;
  }

  return { start, manualReaction, setViewers, setFrozen, isFrozen };
})();
