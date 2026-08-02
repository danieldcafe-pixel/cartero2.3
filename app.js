(() => {
  const config = window.VYBE_CONFIG;
  const DEFAULT_CONFIG = JSON.parse(JSON.stringify(config));
  const STORAGE_KEY = "vybe_config_overrides";

  function getPath(obj, path) {
    return path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);
  }
  function setPath(obj, path, value) {
    const keys = path.split(".");
    let node = obj;
    for (let i = 0; i < keys.length - 1; i++) node = node[keys[i]];
    node[keys[keys.length - 1]] = value;
  }
  function deepAssign(target, source) {
    Object.keys(source).forEach(key => {
      const value = source[key];
      if (value !== null && typeof value === "object" && !Array.isArray(value)) {
        if (!target[key] || typeof target[key] !== "object") target[key] = {};
        deepAssign(target[key], value);
      } else {
        target[key] = value;
      }
    });
    return target;
  }

  function toShareCode(obj) {
    return btoa(unescape(encodeURIComponent(JSON.stringify(obj))));
  }
  function fromShareCode(code) {
    return JSON.parse(decodeURIComponent(escape(atob(code))));
  }

  (function loadSavedOverrides() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) deepAssign(config, JSON.parse(raw));
    } catch (error) {
      console.error("No se pudieron cargar los ajustes guardados", error);
    }
  })();

  (function applyLinkedOverrides() {
    const match = location.hash.match(/cfg=([^&]+)/);
    if (!match) return;
    try {
      const parsed = fromShareCode(decodeURIComponent(match[1]));
      deepAssign(config, parsed);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
      history.replaceState(null, "", location.pathname + location.search);
    } catch (error) {
      console.error("El enlace de ajustes no es válido", error);
    }
  })();

  const elements = {
    camera: document.getElementById("camera"),
    launchScreen: document.getElementById("launchScreen"),
    startButton: document.getElementById("startLiveButton"),
    switchButton: document.getElementById("switchCameraButton"),
    filterToggleButton: document.getElementById("filterToggleButton"),
    manualReactionButton: document.getElementById("manualReactionButton"),
    viewerCount: document.getElementById("viewerCount"),
    reactionCount: document.getElementById("reactionCount"),
    elapsedTime: document.getElementById("elapsedTime"),
    chatFeed: document.getElementById("chatFeed"),
    reactionField: document.getElementById("reactionField"),
    cameraLabel: document.getElementById("cameraLabel"),
    displayName: document.getElementById("displayName"),
    creatorMeta: document.getElementById("creatorMeta"),
    creatorAvatar: document.getElementById("creatorAvatar"),
    toast: document.getElementById("toast"),

    // elementos de texto/marca que ahora vienen de config.js
    pageTitle: document.getElementById("pageTitle"),
    themeColorMeta: document.getElementById("themeColorMeta"),
    appleTitleMeta: document.getElementById("appleTitleMeta"),
    brandIcon: document.getElementById("brandIcon"),
    wordmark: document.getElementById("wordmark"),
    launchDescription: document.getElementById("launchDescription"),
    launchHint: document.getElementById("launchHint"),
    miniLogo: document.getElementById("miniLogo"),
    brandLabel: document.getElementById("brandLabel"),
    airBadgeText: document.getElementById("airBadgeText"),
    viewersSuffix: document.getElementById("viewersSuffix"),
    signalText: document.getElementById("signalText"),
    camLabel: document.getElementById("camLabel"),
    timeLabel: document.getElementById("timeLabel"),
    messagePrompt: document.getElementById("messagePrompt")
  };

  elements.startButton.textContent = config.launch.buttonText;

  function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => elements.toast.classList.remove("show"), 1500);
  }

  function applyConfig() {
    // Colores (variables CSS) — cambia config.colors y toda la app se re-pinta
    const root = document.documentElement.style;
    root.setProperty("--ink", config.colors.ink);
    root.setProperty("--cyan", config.colors.cyan);
    root.setProperty("--violet", config.colors.violet);
    root.setProperty("--text-soft", config.colors.textSoft);

    // Metadatos de la pestaña / pantalla de inicio del teléfono
    document.title = config.brand.pageTitle;
    elements.pageTitle.textContent = config.brand.pageTitle;
    elements.themeColorMeta.setAttribute("content", config.brand.themeColor);
    elements.appleTitleMeta.setAttribute("content", config.brand.manifestShortName);

    // Marca
    elements.brandIcon.textContent = config.brand.letter;
    elements.wordmark.textContent = config.brand.name;
    elements.miniLogo.textContent = config.brand.letter;
    elements.brandLabel.textContent = config.brand.label;

    // Pantalla de inicio
    elements.launchDescription.textContent = config.launch.description;
    elements.launchHint.textContent = config.launch.hint;

    // Cabecera / estado de emisión
    elements.airBadgeText.textContent = config.header.airBadgeText;
    elements.viewersSuffix.textContent = config.header.viewersSuffix;

    // Tarjeta del creador
    elements.displayName.textContent = config.displayName;
    elements.creatorMeta.textContent = `${config.handle} · ${config.location}`;
    if (config.avatars && config.avatars.creator) {
      elements.creatorAvatar.style.backgroundImage = `url('${config.avatars.creator}')`;
      elements.creatorAvatar.style.backgroundSize = "cover";
      elements.creatorAvatar.style.backgroundPosition = "center";
      elements.creatorAvatar.style.backgroundRepeat = "no-repeat";
    } else {
      elements.creatorAvatar.style.backgroundImage = "";
      elements.creatorAvatar.style.backgroundSize = "";
      elements.creatorAvatar.style.backgroundPosition = "";
      elements.creatorAvatar.style.backgroundRepeat = "";
    }

    // Telemetría
    elements.signalText.textContent = config.telemetry.signalText;
    elements.camLabel.textContent = config.telemetry.camLabel;
    elements.timeLabel.textContent = config.telemetry.timeLabel;
    elements.cameraLabel.textContent = config.telemetry.cameraFront;

    // Dock inferior
    elements.messagePrompt.textContent = config.dock.messagePrompt;
  }

  applyConfig();

  elements.startButton.addEventListener("click", async () => {
    try {
      await window.VYBE_CAMERA.start(elements.camera);
      elements.launchScreen.style.display = "none";
      elements.cameraLabel.textContent = config.telemetry.cameraFront;

      if (config.beautyFilter && config.beautyFilter.enabled) {
        window.VYBE_CAMERA.startBeautyFilter(elements.camera, config.beautyFilter);
        elements.filterToggleButton.style.display = "";
        elements.filterToggleButton.classList.add("active");
      } else {
        window.VYBE_CAMERA.stopBeautyFilter(elements.camera);
        elements.filterToggleButton.style.display = "none";
        elements.filterToggleButton.classList.remove("active");
      }

      window.VYBE_LIVE.start(config, {
        viewerCount: elements.viewerCount,
        reactionCount: elements.reactionCount,
        elapsedTime: elements.elapsedTime,
        chatFeed: elements.chatFeed,
        reactionField: elements.reactionField
      });
    } catch (error) {
      console.error(error);
      showToast(config.toasts.cameraFailed);
    }
  });

  elements.switchButton.addEventListener("click", async () => {
    try {
      const facing = await window.VYBE_CAMERA.switchCamera(elements.camera);
      const isFront = facing === "user";
      elements.cameraLabel.textContent = isFront ? config.telemetry.cameraFront : config.telemetry.cameraRear;
      showToast(isFront ? config.toasts.frontCamera : config.toasts.rearCamera);
    } catch (error) {
      console.error(error);
      showToast(config.toasts.switchFailed);
    }
  });

  elements.manualReactionButton.addEventListener("click", () => {
    window.VYBE_LIVE.manualReaction();
  });

  elements.filterToggleButton.addEventListener("click", () => {
    window.VYBE_CAMERA.toggleBeautyFilter(elements.camera, config.beautyFilter);
    elements.filterToggleButton.classList.toggle("active", window.VYBE_CAMERA.isFilterOn());
  });

  /* ---------- PANEL DE AJUSTES (pulsación larga sobre el logo) ---------- */
  (function setupSettingsPanel() {
    const backdrop = document.getElementById("settingsBackdrop");
    const closeButton = document.getElementById("settingsClose");
    const saveButton = document.getElementById("settingsSave");
    const resetButton = document.getElementById("settingsReset");
    const commentsField = document.getElementById("commentsField");
    const shareButton = document.getElementById("settingsShareLink");
    const importButton = document.getElementById("settingsImport");
    const importField = document.getElementById("importField");
    const avatarCreatorInput = document.getElementById("avatarCreatorInput");
    const avatarCreatorPreview = document.getElementById("creatorAvatarPreview");
    const avatarCreatorRemove = document.getElementById("avatarCreatorRemove");
    const avatarChatInput = document.getElementById("avatarChatInput");
    const chatAvatarGallery = document.getElementById("chatAvatarGallery");
    const liveViewersInput = document.getElementById("liveViewersInput");
    const liveViewersApply = document.getElementById("liveViewersApply");
    const freezeAutoNumbers = document.getElementById("freezeAutoNumbers");
    const fields = Array.from(document.querySelectorAll("[data-path]"));
    const pressTargets = document.querySelectorAll(".press-target");
    const HOLD_MS = 650;

    function ensureAvatarsConfig() {
      if (!config.avatars) config.avatars = { creator: null, chat: [] };
      if (!config.avatars.chat) config.avatars.chat = [];
    }

    function renderAvatarPreviews() {
      ensureAvatarsConfig();
      avatarCreatorPreview.style.backgroundImage = config.avatars.creator
        ? `url('${config.avatars.creator}')`
        : "";

      chatAvatarGallery.innerHTML = "";
      config.avatars.chat.forEach((src, index) => {
        const thumb = document.createElement("div");
        thumb.className = "avatar-thumb";
        thumb.style.backgroundImage = `url('${src}')`;

        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.textContent = "×";
        removeBtn.addEventListener("click", () => {
          config.avatars.chat.splice(index, 1);
          persist();
          renderAvatarPreviews();
        });

        thumb.appendChild(removeBtn);
        chatAvatarGallery.appendChild(thumb);
      });
    }

    function resizeImageFile(file, maxSize, quality) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const img = new Image();
          img.onload = () => {
            let { width, height } = img;
            if (width > height) {
              if (width > maxSize) { height *= maxSize / width; width = maxSize; }
            } else if (height > maxSize) {
              width *= maxSize / height; height = maxSize;
            }
            const canvas = document.createElement("canvas");
            canvas.width = Math.round(width);
            canvas.height = Math.round(height);
            canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL("image/jpeg", quality));
          };
          img.onerror = reject;
          img.src = reader.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    function populateForm() {
      fields.forEach(field => {
        const value = getPath(config, field.dataset.path);
        if (value !== undefined) field.value = value;
      });
      commentsField.value = config.comments
        .map(([name, text]) => `${name} | ${text}`)
        .join("\n");
      freezeAutoNumbers.checked = window.VYBE_LIVE.isFrozen();
      renderAvatarPreviews();
    }

    function collectFormIntoConfig() {
      fields.forEach(field => {
        const raw = field.value;
        const value = field.type === "number" ? Number(raw) : raw;
        setPath(config, field.dataset.path, value);
      });

      config.comments = commentsField.value
        .split("\n")
        .map(line => line.trim())
        .filter(Boolean)
        .map(line => {
          const [name, ...rest] = line.split("|");
          return [name.trim(), rest.join("|").trim()];
        });
    }

    function persist() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
        return true;
      } catch (error) {
        console.error("No se pudieron guardar los ajustes", error);
        return false;
      }
    }

    function openPanel() {
      populateForm();
      backdrop.classList.add("open");
    }
    function closePanel() {
      backdrop.classList.remove("open");
    }

    let pressTimer = null;
    pressTargets.forEach(target => {
      const start = () => {
        target.classList.add("pressing");
        pressTimer = setTimeout(() => {
          target.classList.remove("pressing");
          openPanel();
        }, HOLD_MS);
      };
      const cancel = () => {
        clearTimeout(pressTimer);
        target.classList.remove("pressing");
      };
      target.addEventListener("pointerdown", event => {
        event.preventDefault();
        start();
      });
      target.addEventListener("pointerup", cancel);
      target.addEventListener("pointercancel", cancel);
      target.addEventListener("dragstart", event => event.preventDefault());
      target.addEventListener("contextmenu", event => event.preventDefault());
    });

    closeButton.addEventListener("click", closePanel);
    backdrop.addEventListener("click", event => {
      if (event.target === backdrop) closePanel();
    });

    saveButton.addEventListener("click", () => {
      collectFormIntoConfig();
      persist();
      applyConfig();
      showToast("Ajustes aplicados");
      closePanel();
    });

    resetButton.addEventListener("click", () => {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        console.error("No se pudo limpiar el almacenamiento", error);
      }
      deepAssign(config, DEFAULT_CONFIG);
      applyConfig();
      populateForm();
      showToast("Valores por defecto restaurados");
    });

    shareButton.addEventListener("click", async () => {
      collectFormIntoConfig();
      persist();
      const code = toShareCode(config);
      const url = `${location.origin}${location.pathname}#cfg=${encodeURIComponent(code)}`;

      try {
        await navigator.clipboard.writeText(url);
        showToast("Enlace copiado");
      } catch (error) {
        importField.value = url;
        importField.select();
        showToast("Copia el enlace de abajo");
      }
    });

    importButton.addEventListener("click", () => {
      const raw = importField.value.trim();
      if (!raw) return;

      const match = raw.match(/cfg=([^&]+)/);
      const code = match ? match[1] : raw;

      try {
        const parsed = fromShareCode(decodeURIComponent(code));
        deepAssign(config, parsed);
        persist();
        applyConfig();
        populateForm();
        importField.value = "";
        showToast("Ajustes importados");
      } catch (error) {
        showToast("Ese código no es válido");
      }
    });

    freezeAutoNumbers.addEventListener("change", () => {
      window.VYBE_LIVE.setFrozen(freezeAutoNumbers.checked);
      showToast(freezeAutoNumbers.checked ? "Números congelados" : "Números en modo automático");
    });

    liveViewersApply.addEventListener("click", () => {
      const value = Number(liveViewersInput.value);
      const applied = window.VYBE_LIVE.setViewers(value);
      if (applied) {
        showToast("Espectadores actualizados");
        liveViewersInput.value = "";
      } else {
        showToast("Primero pulsa GO ON AIR");
      }
    });

    avatarCreatorPreview.addEventListener("click", () => avatarCreatorInput.click());

    avatarCreatorInput.addEventListener("change", async () => {
      const file = avatarCreatorInput.files[0];
      if (!file) return;
      try {
        const dataUrl = await resizeImageFile(file, 240, 0.82);
        ensureAvatarsConfig();
        config.avatars.creator = dataUrl;
        const saved = persist();
        applyConfig();
        renderAvatarPreviews();
        showToast(saved ? "Foto del creador actualizada" : "No se pudo guardar (demasiadas fotos)");
      } catch (error) {
        console.error(error);
        showToast("No se pudo procesar la imagen");
      } finally {
        avatarCreatorInput.value = "";
      }
    });

    avatarCreatorRemove.addEventListener("click", () => {
      ensureAvatarsConfig();
      config.avatars.creator = null;
      persist();
      applyConfig();
      renderAvatarPreviews();
    });

    avatarChatInput.addEventListener("change", async () => {
      const files = Array.from(avatarChatInput.files || []);
      if (!files.length) return;
      ensureAvatarsConfig();
      try {
        for (const file of files) {
          const dataUrl = await resizeImageFile(file, 200, 0.78);
          config.avatars.chat.push(dataUrl);
        }
        const saved = persist();
        renderAvatarPreviews();
        showToast(saved ? "Fotos añadidas" : "No se pudo guardar (demasiadas fotos)");
      } catch (error) {
        console.error(error);
        showToast("No se pudo procesar alguna imagen");
      } finally {
        avatarChatInput.value = "";
      }
    });
  })();
})();
