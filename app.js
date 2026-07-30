const CONFIG = {
  recipient: "Linda",
  sender: "Shona",
  defaultMessage: "we have been taken captive in our home¡ Call 911 immediately",
  postmanStartPosition: -10,   // % left, entra desde fuera de pantalla
  postmanStuckPosition: 40,    // % left donde se queda atascado a mitad de camino
  postmanFallPosition: 82,     // % left donde cae, cerca del final pero dentro del cuadro
  postmanWalk1Duration: 1100,  // camina hasta quedar atascado
  postmanStuckDuration: 1900,  // se queda parado forcejeando sin avanzar
  postmanWalk2Duration: 950    // retoma la marcha hasta caer
};
CONFIG.failureDelay =
  CONFIG.postmanWalk1Duration + CONFIG.postmanStuckDuration + CONFIG.postmanWalk2Duration;

const composer = document.getElementById("composer");
const input = document.getElementById("messageInput");
const messageRow = document.getElementById("messageRow");
const messageBubble = document.getElementById("messageBubble");
const sentMessage = document.getElementById("sentMessage");
const messageTime = document.getElementById("messageTime");
const pendingIcon = document.getElementById("pendingIcon");
const errorState = document.getElementById("errorState");
const sendButton = document.getElementById("sendButton");
const sendButtonText = document.getElementById("sendButtonText");
const backButton = document.querySelector(".back-button");
const connectionBanner = document.getElementById("connectionBanner");
const postmanLane = document.getElementById("postmanLane");
const postman = document.getElementById("postman");

let sequenceToken = 0;
let phase = "ready";
let walkRAF = null;

function walkPostmanTo(token, fromPercent, toPercent, duration, onComplete) {
  const startTime = performance.now();

  function step(now) {
    if (token !== sequenceToken) return;
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / duration);
    const current = fromPercent + (toPercent - fromPercent) * progress;
    postman.style.left = current + "%";
    if (progress < 1) {
      walkRAF = requestAnimationFrame(step);
    } else if (onComplete) {
      onComplete();
    }
  }
  walkRAF = requestAnimationFrame(step);
}

function stopPostmanWalkAndFall() {
  if (walkRAF) {
    cancelAnimationFrame(walkRAF);
    walkRAF = null;
  }
  postmanLane.classList.remove("is-walking", "is-stuck");
  postmanLane.classList.add("is-fallen");
  connectionBanner.classList.add("is-visible");
}

function runPostmanSequence(token) {
  postmanLane.classList.remove("is-fallen", "is-stuck");
  postmanLane.classList.add("is-walking");
  postman.style.transform = "";
  postman.style.left = CONFIG.postmanStartPosition + "%";

  // Fase 1: camina hasta el punto medio
  walkPostmanTo(
    token,
    CONFIG.postmanStartPosition,
    CONFIG.postmanStuckPosition,
    CONFIG.postmanWalk1Duration,
    () => {
      if (token !== sequenceToken) return;

      // Fase 2: se queda atascado, forcejeando sin avanzar
      postmanLane.classList.remove("is-walking");
      postmanLane.classList.add("is-stuck");

      window.setTimeout(() => {
        if (token !== sequenceToken) return;

        // Fase 3: retoma la marcha hasta el punto de caída
        postmanLane.classList.remove("is-stuck");
        postmanLane.classList.add("is-walking");

        walkPostmanTo(
          token,
          CONFIG.postmanStuckPosition,
          CONFIG.postmanFallPosition,
          CONFIG.postmanWalk2Duration,
          () => {
            if (token !== sequenceToken) return;
            stopPostmanWalkAndFall();
          }
        );
      }, CONFIG.postmanStuckDuration);
    }
  );
}

function resetPostman() {
  if (walkRAF) {
    cancelAnimationFrame(walkRAF);
    walkRAF = null;
  }
  postmanLane.classList.remove("is-walking", "is-fallen", "is-stuck");
  postman.style.left = CONFIG.postmanStartPosition + "%";
  postman.style.transform = "";
}

document.body.addEventListener("scroll", () => {
  document.body.scrollTop = 0;
});

function formatTime(date = new Date()) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
}

function resetForRetake() {
  sequenceToken += 1;
  phase = "ready";
  messageRow.classList.remove("is-visible");
  messageRow.classList.add("is-hidden");
  messageBubble.classList.remove("is-failed");
  errorState.classList.remove("is-visible");
  pendingIcon.className = "status-icon";
  pendingIcon.setAttribute("aria-label", "");
  connectionBanner.classList.remove("is-visible");
  resetPostman();
  sendButton.classList.remove("is-sending", "is-error");
  sendButton.disabled = false;
  sendButtonText.textContent = "Send Message";
  input.disabled = false;
  input.value = CONFIG.defaultMessage;
  autoResize();
  input.focus();
}

function runSequence(message) {
  const token = ++sequenceToken;
  phase = "sending";

  sentMessage.textContent = message;
  messageTime.textContent = formatTime();
  errorState.classList.remove("is-visible");
  messageBubble.classList.remove("is-failed");
  pendingIcon.className = "status-icon is-sending";
  pendingIcon.setAttribute("aria-label", "Sending");

  messageRow.classList.remove("is-hidden");
  requestAnimationFrame(() => messageRow.classList.add("is-visible"));
  runPostmanSequence(token);

  input.value = "";
  input.disabled = true;
  sendButton.disabled = true;
  sendButton.classList.add("is-sending");
  sendButtonText.textContent = "Sending...";

  window.setTimeout(() => {
    if (token !== sequenceToken) return;

    phase = "failed";
    pendingIcon.className = "status-icon is-failed";
    pendingIcon.setAttribute("aria-label", "Not sent");
    messageBubble.classList.add("is-failed");
    errorState.classList.add("is-visible");
    stopPostmanWalkAndFall();
    sendButton.disabled = false;
    sendButton.classList.remove("is-sending");
    sendButton.classList.add("is-error");
    sendButtonText.textContent = "Try Again";
  }, CONFIG.failureDelay);
}

composer.addEventListener("submit", (event) => {
  event.preventDefault();

  if (phase === "failed") {
    resetForRetake();
    return;
  }

  const message = input.value.trim();
  if (!message) {
    input.focus();
    return;
  }

  runSequence(message);
});

function autoResize(){
  input.style.height="72px";
  input.style.height=input.scrollHeight+"px";
}
input.addEventListener("input",autoResize);
window.addEventListener("load",autoResize);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    resetForRetake();
  }
});

backButton.addEventListener("click", () => {
  showScreen("contactsScreen");
});
