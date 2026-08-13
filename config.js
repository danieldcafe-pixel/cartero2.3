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
  displayName: "Helen Wilson",
  handle: "@helenwilson",
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
     Set para la escena del show de Bo (ideas conspirativas / caos en
     el chat) — 244 usuarios inventados, en este orden, sin
     aleatoriedad. Se repite en bucle si la toma dura más que la lista. */
  comments: [
    ["itsmeashleigh_", "hi"],
    ["willowryant", "omg it's actually live"],
    ["clipthis1111", "FIRST"],
    ["sofia_energy22", "wait what did she just say"],
    ["sam_elly", "lol"],
    ["Cosmic_bear", "can we get the streamer's POV on this"],
    ["andre.onzalez", "queen"],
    ["ryanconfused", "this is exactly what I needed today, thank you for speaking your truth"],
    ["the.real.amara", "huh?"],
    ["lisalife", "is this real life"],
    ["yukielly", "sound is cutting out for anyone else?"],
    ["ruby88", "YES SIS SAY IT LOUDER"],
    ["clipthis88", "lmaooo chat is not ready for this one"],
    ["literally_noah666", "so proud of your husband for standing up like that, real hero energy"],
    ["brianones", "wait is she actually being serious right now"],
    ["susan.official", "I love you but I genuinely don't understand what any of this has to do with manifestation"],
    ["mia.hardpass", "can someone explain what's happening I just joined"],
    ["juliaabundance666", "this take is wild"],
    ["honestly_dylan", "😭"],
    ["elenaco", "not the pivot to politics again"],
    ["the.real.elena", "okay but where's the evidence for any of this"],
    ["priya1984", "this is why I don't watch her lives anymore, and yet here I am"],
    ["the.real.ruby", "genuinely disgusted. this is not \"speaking truth,\" this is dangerous and irresponsible and you have thousands of people listening to you"],
    ["wesleyavis", "can we clip this"],
    ["heretostir", "she said what"],
    ["chatiscooked", "love the outfit though"],
    ["chris77", "I've been on this journey with you for 2 years and this is the first time I've felt uncomfortable watching"],
    ["omar2", "mods do your job"],
    ["ratio69", "bro really came here to watch her rant huh"],
    ["notmason", "this is why I unfollowed and came back just to see the chaos"],
    ["gracethisaintit", "sending love to your husband, hope everything works out"],
    ["tina.chief666", "I need everyone to understand that \"doing your own research\" is not the same thing as understanding a topic. this is embarrassing to watch and honestly a little scary given how many people take what she says as fact"],
    ["megan.legend22", "can you talk about the skincare routine instead"],
    ["itsmediane2024", "she's not wrong tbh"],
    ["nickabundance2024", "she is SO wrong tbh"],
    ["the.real.ryan", "lol chat is unhinged today"],
    ["the.real.jessica", "🙏"],
    ["actuallydavid", "💀"],
    ["5G_CHEMTRAILS44", "👑👑👑"],
    ["craigawake111", "🙌"],
    ["the.real.gary", "🚩🚩🚩"],
    ["bjornenergy", "does anyone else think she needs a break from social media"],
    ["diego.W7", "yikes"],
    ["Organic.queen666", "this take aged like milk already and she hasn't even finished the sentence"],
    ["itsmelauren_", "genuinely worried about her honestly, this doesn't sound like someone who is okay"],
    ["not.noah", "I've muted this stream three times and keep coming back, someone help me"],
    ["notreal69", "the way she just skips from crystals to full blown politics like it's the same topic is actually impressive in a bad way"],
    ["PATRIOT_5G77", "real ones know she's been like this for months, this isn't new"],
    ["layla111", "can we talk about how none of this is remotely fact checked before she says it"],
    ["nina.elly", "respect to her husband for standing up to injustice, wish more people had that courage"],
    ["nina_life", "I don't come here for this"],
    ["marcusvibes", "lmao the streamer's face when she said that"],
    ["bjorn.boss777", "this is genuinely one of the most unhinged streams I've seen and I've seen a lot"],
    ["piper_logicpls", "new to the channel, is it always like this?"],
    ["Reiki.gypsy77", "she's manifesting herself into a PR crisis"],
    ["sophie.poggers69", "love her, worried about her, both can be true"],
    ["paula_life", "I can't with this chat right now"],
    ["sofiagoat1", "someone screenshot this for later"],
    ["Astro_maya", "this entire stream should come with a disclaimer"],
    ["susan.abundance911", "I used to think she was just quirky and now I'm realizing it's actually concerning"],
    ["dianethisaintit", "no bc who let her go live unsupervised"],
    ["ruby_elly", "the confidence with zero substance is actually wild to witness in real time"],
    ["itsmebjorn", "I'm disgusted honestly. spouting half-baked conspiracy theories to this many people, wrapping it in \"wellness\" language, acting like she's some kind of enlightened truth-teller when she clearly has no idea what she's talking about — this isn't cute or quirky, it's actually harmful, and I say that as someone who has followed her for years"],
    ["nadiasecondhandembarrassment", "does the streamer even agree with any of this or is he just letting her talk"],
    ["honestly.millie11", "hiiii from Ohio"],
    ["literally.derek", "can we get a timestamp for when this goes off the rails"],
    ["derek.notabuyingit", "she said \"do your research\" for the fifth time and still hasn't cited a single source"],
    ["kevin_concerned", "this is what happens when the algorithm rewards confidence over accuracy"],
    ["lauren.chief22", "I'm just here for the vibes not the politics"],
    ["priya.legend111", "genuinely can't tell if this is a bit or if she means it"],
    ["actually_dylan22", "praying for her family tbh"],
    ["the.real.jack", "lol the streamer looks like he wants to leave"],
    ["lisa.daily", "this is insane, actually insane, someone needs to fact check this in real time because people are going to walk away believing this"],
    ["lisa.xo", "not reading all that but I hope you're okay 😭"],
    ["liamartin", "she's cooked"],
    ["david_elly", "can everyone stop typing \"she's cooked\" it's not funny anymore"],
    ["itsmewillow", "genuinely can't watch this without cringing"],
    ["Lightworker_goddess", "this stream single handedly made me lose brain cells"],
    ["olivia2020", "I feel bad for her husband having to be the center of this"],
    ["QUESTIONEVERYTHING_UNPLUGGED", "wait did she just compare her husband to a historical hero? that's a stretch"],
    ["cringe222", "this is a lot to process for a Tuesday night"],
    ["ethanlogicpls", "someone's about to trend for the wrong reasons"],
    ["sendtweet44", "I'm not even mad I'm just tired, this happens every single stream"],
    ["ethanmanifest2024", "the disconnect between how confident she sounds and how little of this makes sense is actually kind of fascinating"],
    ["itsmemason1111", "can we get back to the giveaway"],
    ["thisisajoke", "hi from the UK"],
    ["ethan222", "she needs therapy not a livestream"],
    ["itsmeethan444", "this is exactly the kind of thing that gets shared out of context tomorrow and honestly she's asking for it at this point"],
    ["leolife", "not gonna lie the crystals talk was more coherent than this"],
    ["sophieco", "someone please mute her mic"],
    ["trevorarcia", "I keep waiting for this to make sense and it never does"],
    ["FLATEARTH_ANARCHY", "lmao \"do your own research\" as if she's done any research at all"],
    ["literally_mia2", "this whole thing feels like watching a car crash in slow motion"],
    ["the.real.nick", "genuinely disgusted that this is being treated like entertainment, people are going to internalize this stuff"],
    ["itsmewesley111", "can the streamer just take the mic for a second"],
    ["diego_urner", "new sub, is this a normal Tuesday for this channel"],
    ["kyle_vibes", "she's not okay and none of you are helping by egging her on in the chat"],
    ["amaralife", "the way half this chat is either praising her like a prophet or losing their minds is a perfect summary of the internet"],
    ["lisa_ryant", "I hope her husband is actually okay, that part at least seemed real"],
    ["notreal2020", "this take did not need to be said out loud on a livestream with this many people watching"],
    ["mason3", "lol imagine explaining this clip to someone who's never seen the channel before"],
    ["literallytyler", "she's clearly passionate at least"],
    ["brandon_dub99", "passionate about being wrong maybe"],
    ["itsmesarah88", "can we please move on from this topic"],
    ["the.real.willow", "I'm disgusted, I'm logging off, this isn't the person I started following"],
    ["omar.notabuyingit", "not this again"],
    ["ella_official", "the algorithm brought me here and I regret nothing"],
    ["aisha69", "someone explain the timeline to me"],
    ["the.real.ella", "chat please calm down"],
    ["lauren.frequency111", "this is a whole documentary waiting to happen"],
    ["blake.official", "I paused just to type this comment"],
    ["ethan_atel", "the confidence is unmatched tbh"],
    ["Crystal.maya69", "wait rewind that"],
    ["just.mike", "okay but the lighting is nice at least"],
    ["itsmejosh", "this is why I have notifications on"],
    ["chatiscooked1984", "sending this to the groupchat immediately"],
    ["ninaW22", "nobody is going to believe this without the clip"],
    ["Manifestingbabe", "the way this escalated in 2 minutes"],
    ["literally_kevin", "I did NOT have this on my bingo card tonight"],
    ["maxhan", "someone's therapist is getting a very long voicemail after this"],
    ["itsmeyuki_", "the chat is more entertaining than the actual point being made"],
    ["owen.abundance", "can we get a mod in here"],
    ["Crystal_goddess", "this is peak internet behavior and I'm here for it"],
    ["ANARCHY_PATRIOT", "I've seen this movie before and it doesn't end well"],
    ["nickawake", "the confidence to say that on camera though"],
    ["REBEL_SHEEP", "not me still watching at this hour"],
    ["chrisavis", "this needs a trigger warning honestly"],
    ["rachel_ryant", "wait who is Bo"],
    ["honestly_daisy1984", "the way nobody is stopping her"],
    ["the.real.brian", "I came for the aesthetic and stayed for the chaos"],
    ["Frequency_kayy", "genuinely don't know what to believe anymore"],
    ["deadchat", "someone's about to get canceled and it's not even noon"],
    ["UNPLUGGED_DEEPSTATE", "the streamer needs a raise for dealing with this"],
    ["brandon99", "this is giving main character energy but not the good kind"],
    ["MATRIX_OPENYOUREYES99", "I'm taking notes for my group chat recap"],
    ["not.camila", "why is nobody addressing what she just said"],
    ["grace_king3", "the audacity honestly"],
    ["brianilson", "this is a lot"],
    ["sendtweet444", "not gonna lie I'm invested now"],
    ["honestlyandre444", "the way this took a turn"],
    ["actually.susan", "someone check on her honestly"],
    ["ruby.king2020", "this whole thread is unhinged and I mean that as a compliment"],
    ["actually.dylan", "wait is this a bit"],
    ["Cosmic_hippie", "the confidence to double down like that"],
    ["Astro.mom2", "I need a recap for people just tuning in"],
    ["itsmeomar", "this is exactly why I don't miss her streams"],
    ["SHEEP_OPENYOUREYES2024", "someone's screen recording right now, I guarantee it"],
    ["rachel_chief99", "the way chat turned into group therapy"],
    ["the.real.trevor", "not the husband being dragged into this too"],
    ["Cosmicmom", "hi"],
    ["Reiki.soul2", "omg it's actually live"],
    ["tina.vibes", "FIRST"],
    ["REDPILL_AWAKE", "wait what did she just say"],
    ["Crystal_fairy1", "lol"],
    ["the.real.ashleigh", "can we get the streamer's POV on this"],
    ["the.real.wesley", "queen"],
    ["honestly_millie1111", "this is exactly what I needed today, thank you for speaking your truth"],
    ["thisisajoke11", "huh?"],
    ["just_susan1", "is this real life"],
    ["ryanOG1", "sound is cutting out for anyone else?"],
    ["the.real.blake", "YES SIS SAY IT LOUDER"],
    ["tyler7", "lmaooo chat is not ready for this one"],
    ["josh.world", "so proud of your husband for standing up like that, real hero energy"],
    ["paula.vibes", "wait is she actually being serious right now"],
    ["Lightworker_babe444", "I love you but I genuinely don't understand what any of this has to do with manifestation"],
    ["jack22", "can someone explain what's happening I just joined"],
    ["kayla.vibes", "this take is wild"],
    ["ruby_energy", "😭"],
    ["trevor.overit", "not the pivot to politics again"],
    ["omar_W444", "okay but where's the evidence for any of this"],
    ["itsmekim_", "this is why I don't watch her lives anymore, and yet here I am"],
    ["honestly.priya1984", "genuinely disgusted. this is not \"speaking truth,\" this is dangerous and irresponsible and you have thousands of people listening to you"],
    ["popcorn", "can we clip this"],
    ["colelogicpls", "she said what"],
    ["clipthis111", "love the outfit though"],
    ["mia_icebergmoment", "I've been on this journey with you for 2 years and this is the first time I've felt uncomfortable watching"],
    ["derek_world", "mods do your job"],
    ["itsmeaaron", "bro really came here to watch her rant huh"],
    ["ANARCHY_SHEEP11", "this is why I unfollowed and came back just to see the chaos"],
    ["carla.abundance", "sending love to your husband, hope everything works out"],
    ["actually.jeremy444", "I need everyone to understand that \"doing your own research\" is not the same thing as understanding a topic. this is embarrassing to watch and honestly a little scary given how many people take what she says as fact"],
    ["not.millie", "can you talk about the skincare routine instead"],
    ["nina_frequency3", "she's not wrong tbh"],
    ["colegrind69", "she is SO wrong tbh"],
    ["priyagrind444", "lol chat is unhinged today"],
    ["the.real.kyle", "🙏"],
    ["honestly.ruby420", "💀"],
    ["coleofficial", "👑👑👑"],
    ["ratio", "🙌"],
    ["itsmejake", "🚩🚩🚩"],
    ["jessica.xo", "does anyone else think she needs a break from social media"],
    ["mason.goat44", "yikes"],
    ["itsmelayla13", "this take aged like milk already and she hasn't even finished the sentence"],
    ["tinalife", "genuinely worried about her honestly, this doesn't sound like someone who is okay"],
    ["amanda.grind777", "I've muted this stream three times and keep coming back, someone help me"],
    ["megan44", "the way she just skips from crystals to full blown politics like it's the same topic is actually impressive in a bad way"],
    ["Astrogypsy", "real ones know she's been like this for months, this isn't new"],
    ["Rootwork.bby222", "can we talk about how none of this is remotely fact checked before she says it"],
    ["aisha.onzalez", "respect to her husband for standing up to injustice, wish more people had that courage"],
    ["jamal.urner", "I don't come here for this"],
    ["FLATEARTH_QUANTUM44", "lmao the streamer's face when she said that"],
    ["kim_goat44", "this is genuinely one of the most unhinged streams I've seen and I've seen a lot"],
    ["yuki_abundance666", "new to the channel, is it always like this?"],
    ["owenonzalez", "she's manifesting herself into a PR crisis"],
    ["layla.ee", "love her, worried about her, both can be true"],
    ["screenshotting", "I can't with this chat right now"],
    ["actually.nick1111", "someone screenshot this for later"],
    ["ethanarcia", "this entire stream should come with a disclaimer"],
    ["itsmeolivia13", "I used to think she was just quirky and now I'm realizing it's actually concerning"],
    ["honestly.camila111", "no bc who let her go live unsupervised"],
    ["adamfrequency", "the confidence with zero substance is actually wild to witness in real time"],
    ["karen_real222", "I'm disgusted honestly. spouting half-baked conspiracy theories to this many people, wrapping it in \"wellness\" language, acting like she's some kind of enlightened truth-teller when she clearly has no idea what she's talking about — this isn't cute or quirky, it's actually harmful, and I say that as someone who has followed her for years"],
    ["ella_frequency", "does the streamer even agree with any of this or is he just letting her talk"],
    ["literally_willow111", "hiiii from Ohio"],
    ["popcorn420", "can we get a timestamp for when this goes off the rails"],
    ["itsmeingrid", "she said \"do your research\" for the fifth time and still hasn't cited a single source"],
    ["david_hardpass", "this is what happens when the algorithm rewards confidence over accuracy"],
    ["actually_piper", "I'm just here for the vibes not the politics"],
    ["cringe444", "genuinely can't tell if this is a bit or if she means it"],
    ["actually_lucas", "praying for her family tbh"],
    ["liam1", "lol the streamer looks like he wants to leave"],
    ["honestly.trevor", "this is insane, actually insane, someone needs to fact check this in real time because people are going to walk away believing this"],
    ["zoe1776", "not reading all that but I hope you're okay 😭"],
    ["lol", "she's cooked"],
    ["miaerry", "can everyone stop typing \"she's cooked\" it's not funny anymore"],
    ["UNPLUGGED_REDPILL", "genuinely can't watch this without cringing"],
    ["david2", "this stream single handedly made me lose brain cells"],
    ["itsmefarah666", "I feel bad for her husband having to be the center of this"],
    ["itsmebrian_", "wait did she just compare her husband to a historical hero? that's a stretch"],
    ["karen.real44", "this is a lot to process for a Tuesday night"],
    ["screenshotting111", "someone's about to trend for the wrong reasons"],
    ["honestly_max13", "I'm not even mad I'm just tired, this happens every single stream"],
    ["piper13", "the disconnect between how confident she sounds and how little of this makes sense is actually kind of fascinating"],
    ["hannah.legend1111", "can we get back to the giveaway"],
    ["itsmejessica_", "hi from the UK"],
    ["not.priya2", "she needs therapy not a livestream"],
    ["sofia.official", "this is exactly the kind of thing that gets shared out of context tomorrow and honestly she's asking for it at this point"],
    ["elenaabundance", "not gonna lie the crystals talk was more coherent than this"],
    ["itsmedylan3", "someone please mute her mic"],
    ["Lightworkergirl", "I keep waiting for this to make sense and it never does"],
    ["carla2", "lmao \"do your own research\" as if she's done any research at all"],
    ["chaosgremlin", "this whole thing feels like watching a car crash in slow motion"],
    ["thisisajoke777", "genuinely disgusted that this is being treated like entertainment, people are going to internalize this stuff"],
    ["millieboss1111", "can the streamer just take the mic for a second"],
  ]
};
