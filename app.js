/* ==========================================================================
   🎮💀 ULTRA GAMER 9000 // DEFINITELY NOT A SCAM 💀🎮
   Core JavaScript Engine: Real functional routing, form validation,
   Gemini AI gaming coach, PostgreSQL telemetry store, and hilarious ragebait!
   ========================================================================== */

(function () {
  'use strict';

  // ========================================================================
  // 1. STATE & POSTGRESQL SIMULATION LAYER (GAMING TELEMETRY)
  // ========================================================================
  const STORAGE_KEYS = {
    ADVISORIES: 'gamer_pg_advisories_v2',
    CROPS: 'gamer_pg_games_v2',
    SOIL: 'gamer_pg_hardware_v2',
    CURRENT_USER: 'gamer_auth_user_v2',
    GEMINI_KEY: 'gamer_gemini_api_key_v2',
    SOUND_ENABLED: 'gamer_sound_enabled_v2'
  };

  const DEFAULT_GAMES = [
    { id: 1, name: "Counter-Strike 2", type: "Tactical FPS", optimal_ph: "400 - 800 DPI", avg_yield_kg: 1.25, water_need: "High Salt" },
    { id: 2, name: "Fortnite", type: "Battle Royale", optimal_ph: "800 - 1600 DPI", avg_yield_kg: 2.10, water_need: "Extreme Sweat" },
    { id: 3, name: "Elden Ring", type: "Soulslike", optimal_ph: "Controller Only", avg_yield_kg: 0.15, water_need: "Pure Tears" },
    { id: 4, name: "Valorant", type: "Hero Shooter", optimal_ph: "800 DPI", avg_yield_kg: 1.10, water_need: "Toxic E-Dating" },
    { id: 5, name: "League of Legends", type: "MOBA", optimal_ph: "Keyboard Smasher", avg_yield_kg: 0.85, water_need: "Maximum Salt" },
    { id: 6, name: "Roblox", type: "Platformer", optimal_ph: "Any Device", avg_yield_kg: 99.0, water_need: "Parent Credit Card" }
  ];

  const DEFAULT_HARDWARE = [
    { sensor_id: "HW-01-CPU", field: "CPU (Core i9 9900K)", ph: 102, moisture_pct: 95.0, nitrogen_ppm: 95, phosphorus_ppm: 140, potassium_ppm: 4200 },
    { sensor_id: "HW-02-GPU", field: "GPU (RTX 4090)", ph: 147, moisture_pct: 108.0, nitrogen_ppm: 99, phosphorus_ppm: 450, potassium_ppm: 3800 },
    { sensor_id: "HW-03-RAM", field: "DDR4 32GB (Chrome Hogs)", ph: 94, moisture_pct: 65.0, nitrogen_ppm: 88, phosphorus_ppm: 320, potassium_ppm: 3200 },
    { sensor_id: "HW-04-SSD", field: "NVMe 2TB (Call of Duty)", ph: 99, moisture_pct: 72.0, nitrogen_ppm: 99, phosphorus_ppm: 500, potassium_ppm: 5500 },
    { sensor_id: "HW-05-CHAIR", field: "Wooden Stool (Posture)", ph: 15, moisture_pct: 12.0, nitrogen_ppm: 10, phosphorus_ppm: 5, potassium_ppm: 100 }
  ];

  const INITIAL_ADVISORIES = [
    {
      id: 101,
      crop_name: "Counter-Strike 2",
      nickname: "xX_NoobSlayer_Xx",
      growth_stage: "Toilet III",
      acreage: 6.5,
      soil_type: "Potato PC (Intel HD Graphics 3000)",
      soil_ph: 800,
      soil_moisture: 180,
      nitrogen_ppm: 60,
      phosphorus_ppm: 34,
      potassium_ppm: 15,
      target_yield: 2.5,
      irrigation: "Support (Gets Blamed For Everything)",
      pests: "Sweaty 14-Year-Old Smurfs, Blatant Spinbot Cheaters",
      ai_persona: "Toxic Discord Mod",
      status: "TILTED",
      created_at: new Date(Date.now() - 3600000 * 3).toISOString().replace('T', ' ').substring(0, 19),
      recommendations: {
        urgent: {
          title: "POSTURE COLLAPSE & DESK TILT CRISIS",
          body: "Your chair ergonomics and high ping are actively sabotaging your spine! Reaction time is degraded by 320ms."
        },
        fertilizer: {
          title: "SENSITIVITY & CROSSHAIR META",
          n: "800 DPI",
          p: "Cyan Static",
          k: "AK-47 / Vandal",
          timing: "Apply 50% split in aim trainer, remainder in deathmatch."
        },
        irrigation: {
          title: "HYDRATION & BLINK PROTOCOL",
          schedule: "Drink 250ml water every 45 mins. Remember to blink at least twice per round."
        },
        pest: {
          title: "ANTI-SMURF & WALLHACK DEFENSE",
          tactics: "Mute toxic voice chat immediately and pre-aim common headshot angles."
        },
        ai_synthesis: "Attention Gamer: 92% of your deaths occurred because you were running in a straight line with a grenade out. Stop blaming your 180ms ping; lower your DPI from 3200 to 800 and plug in an ethernet cable."
      }
    }
  ];

  function getDbData(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function setDbData(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {}
  }

  let dbAdvisories = getDbData(STORAGE_KEYS.ADVISORIES, INITIAL_ADVISORIES);
  let dbCrops = getDbData(STORAGE_KEYS.CROPS, DEFAULT_GAMES);
  let dbSoil = getDbData(STORAGE_KEYS.SOIL, DEFAULT_HARDWARE);
  let currentActiveAdvisory = dbAdvisories[0] || null;

  // ========================================================================
  // 2. AUDIO SYNTHESIZER (WEB AUDIO API) - NO AUTOPLAY
  // ========================================================================
  let audioCtx = null;
  let soundEnabled = localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED) === 'true'; // Default OFF

  function playTone(freq, duration, type = 'square') {
    if (!soundEnabled) return;
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (err) {}
  }

  function playLaser() {
    playTone(880, 0.08, 'sawtooth');
    setTimeout(() => playTone(440, 0.12, 'sawtooth'), 50);
  }

  function playCoinBleep() {
    playTone(587, 0.08, 'square');
    setTimeout(() => playTone(880, 0.18, 'square'), 70);
  }

  function playAlarm() {
    playTone(950, 0.1, 'sawtooth');
    setTimeout(() => playTone(300, 0.15, 'sawtooth'), 100);
  }

  // ========================================================================
  // 3. ROUTING & TAB NAVIGATION
  // ========================================================================
  const navButtons = document.querySelectorAll('.nav-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  function switchTab(tabId) {
    playCoinBleep();
    navButtons.forEach(btn => {
      if (btn.dataset.tab === tabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    tabPanes.forEach(pane => {
      if (pane.id === `view-${tabId}`) {
        pane.classList.add('active');
      } else {
        pane.classList.remove('active');
      }
    });

    window.location.hash = tabId;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (tabId === 'database-pg') {
      renderActiveDbTable();
    }
  }

  navButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.dataset.tab;
      switchTab(target);
    });
  });

  function initRouting() {
    const hash = window.location.hash.replace('#', '');
    const validTabs = ['dashboard', 'advisory-form', 'advisory-results', 'leaderboard', 'database-pg', 'analytics', 'ragebait-shop', 'settings'];
    if (validTabs.includes(hash)) {
      switchTab(hash);
    }
  }

  // ========================================================================
  // 4. FLUCTUATING TELEMETRY NUMBERS & LIVE TICKERS
  // ========================================================================
  function startLiveFluctuations() {
    // Fluctuating live players
    const playersEl = document.getElementById('live-players-badge');
    const pingEl = document.getElementById('live-ping-badge');
    const fpsEl = document.getElementById('live-fps-badge');
    const gpuEl = document.getElementById('live-gpu-badge');
    const rageEl = document.getElementById('stat-rage-count');

    let players = 9842109;
    let rageQuits = 847291;

    setInterval(() => {
      // Random player count swing
      players += Math.floor(Math.random() * 21) - 10;
      if (playersEl) playersEl.textContent = `🔴 LIVE: ${players.toLocaleString()} PLAYERS ONLINE`;

      // Random ping
      const pings = [69, 420, 999, 1337, 850, 142];
      const randomPing = pings[Math.floor(Math.random() * pings.length)];
      if (pingEl) pingEl.textContent = `PING: ${randomPing}ms`;

      // Random FPS
      const fpsOptions = [7, 11, 12, 14, 18, 9, 22];
      const randomFps = fpsOptions[Math.floor(Math.random() * fpsOptions.length)];
      if (fpsEl) fpsEl.textContent = `FPS: ${randomFps}`;

      // Random GPU Temp
      const temp = 104 + Math.floor(Math.random() * 9);
      if (gpuEl) gpuEl.textContent = `GPU: ON FIRE 🔥 (${temp}°C)`;

      // Rage quit increment
      if (Math.random() > 0.4) {
        rageQuits += 1;
        if (rageEl) rageEl.textContent = rageQuits.toLocaleString();
      }
    }, 2400);

    // Fake countdown timer
    const countdownEl = document.getElementById('fake-countdown');
    let secondsLeft = 1942;
    setInterval(() => {
      secondsLeft--;
      if (secondsLeft < 0) secondsLeft = 3600;
      const h = String(Math.floor(secondsLeft / 3600)).padStart(2, '0');
      const m = String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, '0');
      const s = String(secondsLeft % 60).padStart(2, '0');
      if (countdownEl) countdownEl.textContent = `00:03:${m}:${s}`;
    }, 1000);
  }

  // ========================================================================
  // 5. RAGEBAIT JOKES & DECEPTIVE BUTTONS
  // ========================================================================
  window.triggerRageJoke = function (type) {
    playLaser();
    triggerScreenShake();

    switch (type) {
      case 'pro':
        showPopup(
          "👑 PRO STATUS UPGRADE",
          "CONGRATULATIONS 🎉",
          "YOU ARE STILL A NOOB.\n\n+0 SKILL ADDED TO YOUR ACCOUNT.\n\nTRY PLUGGING IN YOUR MOUSE.",
          "ACCEPT DEFEAT",
          "CRY IN DISCORD"
        );
        break;
      case 'do_not_click':
        showPopup("🔥 PROTOCOL BREACH", "WHY DID YOU CLICK IT?", "We literally labeled it 'DO NOT CLICK'. This is why your rank is Toilet III.", "I AM SORRY", "DO IT AGAIN");
        break;
      case 'rtx':
        showPopup("🎁 HARDWARE LOTTERY", "LOL NO.", "You did not win an RTX 5090. In fact, your integrated GPU just downclocked by 20MHz out of disrespect.", "FAIR ENOUGH", "ORDER FROM WISH");
        break;
      case 'delete_account':
        showPopup("💀 SYSTEM NOTICE", "JUST KIDDING 😂", "We didn't delete your account because that would be a mercy. You are sentenced to play 10 more ranked matches with 300ms ping.", "NO PLEASE", "UNINSTALL");
        break;
      case 'coins':
        showPopup("💰 BANK DEPOSIT", "TRANSACTION COMPLETE", "YOU HAVE RECEIVED 0 COINS.\n\nTransaction fee: $0.00.\nAccount balance: Still broke.", "THANKS FOR NOTHING", "SPEND 0 COINS");
        break;
      case 'fps':
        showPopup("⚡ FPS ACCELERATOR", "OVERCLOCK REPORT", "Your FPS remains 47.\n\nHuman eye can only see 30 fps anyway (Copium max).", "ACCEPT TRUTH", "DOWNLOAD MORE FPS");
        break;
      case 'ram':
        showPopup("💾 MEMORY EXPANSION", "128GB RAM DOWNLOADED", "128GB of imaginary RAM has been moved directly to your Recycle Bin. Please remember to empty it.", "OKAY", "DOWNLOAD 1TB");
        break;
      case 'fortnite':
        showToast("🎮 Fortnite: Download paused at 99% for 48 hours.");
        break;
      case 'cs':
        showToast("💀 CS2: You opened a crate and received: Welder Mask (Field-Tested, Value: $0.03).");
        break;
      case 'elden':
        showToast("🔥 Elden Rage: You died before the title screen finished loading.");
        break;
      case 'gta':
        showToast("🚗 GTA Responsibility: Your in-game rent is past due by 3 months.");
        break;
    }
  };

  // Wire CTA Buttons on Hero
  const btnBecomePro = document.getElementById('btn-become-pro');
  if (btnBecomePro) btnBecomePro.addEventListener('click', () => triggerRageJoke('pro'));

  const cta1 = document.getElementById('cta-click-me');
  if (cta1) cta1.addEventListener('click', () => triggerRageJoke('do_not_click'));

  const cta2 = document.getElementById('cta-free-coins');
  if (cta2) cta2.addEventListener('click', () => triggerRageJoke('coins'));

  const cta3 = document.getElementById('cta-boost-fps');
  if (cta3) cta3.addEventListener('click', () => triggerRageJoke('fps'));

  const btnDownloadRam = document.getElementById('btn-download-ram');
  if (btnDownloadRam) btnDownloadRam.addEventListener('click', () => triggerRageJoke('ram'));

  const btnKillBg = document.getElementById('btn-kill-background-apps');
  if (btnKillBg) btnKillBg.addEventListener('click', () => {
    playLaser();
    alert('🔪 4,891 Steam and Discord background telemetry services killed! CPU usage dropped by 0.001%!');
  });

  const btnRageQuitTop = document.getElementById('btn-rage-quit-top');
  if (btnRageQuitTop) btnRageQuitTop.addEventListener('click', () => {
    playAlarm();
    triggerScreenShake();
    alert('💀 EMERGENCY RAGE QUIT INITIATED! 🚨\n\nMonitor switched off in protest! Headset thrown across the room!');
  });

  const btnFakeSearch = document.getElementById('btn-fake-search');
  if (btnFakeSearch) btnFakeSearch.addEventListener('click', () => {
    playLaser();
    const q = document.getElementById('fake-search-input').value.trim();
    showToast(`🔍 Search for "${q || 'skill'}": 0 results found on your hard drive.`);
  });

  // ========================================================================
  // 6. POPUP & TOAST SYSTEM (COMEDIC & HARMLESS)
  // ========================================================================
  const popupModal = document.getElementById('rage-popup-modal');
  const popupTitle = document.getElementById('popup-title-text');
  const popupHeading = document.getElementById('popup-heading-text');
  const popupDesc = document.getElementById('popup-desc-text');
  const btnClosePopup = document.getElementById('btn-close-popup');
  const btnPopupAction1 = document.getElementById('btn-popup-action-1');
  const btnPopupAction2 = document.getElementById('btn-popup-action-2');

  function showPopup(title, heading, desc, btn1Text = "OKAY", btn2Text = "CANCEL") {
    if (!popupModal) return;
    popupTitle.textContent = title;
    popupHeading.textContent = heading;
    popupDesc.textContent = desc;
    btnPopupAction1.textContent = btn1Text;
    btnPopupAction2.textContent = btn2Text;
    popupModal.style.display = 'flex';
  }

  function hidePopup() {
    if (popupModal) popupModal.style.display = 'none';
  }

  if (btnClosePopup) btnClosePopup.addEventListener('click', hidePopup);
  if (btnPopupAction1) btnPopupAction1.addEventListener('click', hidePopup);
  if (btnPopupAction2) btnPopupAction2.addEventListener('click', hidePopup);

  // Floating Toasts
  const toastContainer = document.getElementById('toast-container');
  const TOAST_MESSAGES = [
    "💀 Someone just defeated you in a 1v1.",
    "🎮 Your controller is deeply disappointed.",
    "🔥 Your GPU wants a paid vacation.",
    "🗿 You have been promoted to Bronze 0.",
    "🚨 Your gaming license has expired.",
    "💀 You missed 100% of the shots you took.",
    "🏆 Achievement unlocked: OPENED WORST WEBSITE."
  ];

  function showToast(msg) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'rage-toast';
    toast.textContent = msg;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 4500);
  }

  // Periodic harmless toast
  setInterval(() => {
    const randomMsg = TOAST_MESSAGES[Math.floor(Math.random() * TOAST_MESSAGES.length)];
    showToast(randomMsg);
  }, 22000);

  function triggerScreenShake() {
    document.body.classList.add('screen-vibrate');
    setTimeout(() => document.body.classList.remove('screen-vibrate'), 450);
  }

  // ========================================================================
  // 7. USER AUTH & ROLE SWITCHING
  // ========================================================================
  const USERS = {
    bob: { name: "xX_NoobSlayer_Xx", title: "Master Tilt Overseer (Level 99)", badge: "🚽 TOILET III 💩" },
    alice: { name: "Pro_Esports_Coach_Dave", title: "Senior Strategic Aim Analyst", badge: "🔬 PRO COACH 🎮" },
    overseer: { name: "Cyber_Aimbot_9000", title: "Autonomous Tactical Rage Engine", badge: "🤖 MATRIX AIMBOT ⚡" },
    guest: { name: "ToiletGamer69", title: "WiFi Enjoyer & Casual Spammer", badge: "🍟 WIFI NOOB 📶" }
  };

  function updateAuthDisplay(userId) {
    const user = USERS[userId] || USERS.bob;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, userId);

    const userDisplay = document.getElementById('user-display');
    const authUsernameDisplay = document.getElementById('auth-username-display');
    const authRoleDisplay = document.getElementById('auth-role-display');

    if (userDisplay) {
      userDisplay.textContent = `👤 GAMER: ${user.name} [${user.badge}]`;
    }
    if (authUsernameDisplay) authUsernameDisplay.textContent = user.name;
    if (authRoleDisplay) authRoleDisplay.textContent = `${user.title} [${user.badge}]`;
  }

  const btnSwitchUser = document.getElementById('btn-switch-user');
  const switchUserSelect = document.getElementById('switch-user-select');
  if (btnSwitchUser && switchUserSelect) {
    btnSwitchUser.addEventListener('click', () => {
      const selected = switchUserSelect.value;
      updateAuthDisplay(selected);
      playLaser();
      alert(`🎮 SESSION SWITCHED! Operating as: ${USERS[selected].name}`);
    });
  }

  // ========================================================================
  // 8. ADVISORY FORM & GEMINI AI STRATEGY ENGINE
  // ========================================================================
  const soilPhInput = document.getElementById('soil-ph');
  const phDisplay = document.getElementById('ph-display');
  if (soilPhInput && phDisplay) {
    soilPhInput.addEventListener('input', () => {
      phDisplay.textContent = `${soilPhInput.value} DPI`;
    });
  }

  const advisoryForm = document.getElementById('agri-advisory-form');
  const validationBox = document.getElementById('form-validation-box');

  if (advisoryForm) {
    advisoryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleFormSubmission();
    });
  }

  function handleFormSubmission() {
    validationBox.style.display = 'none';
    validationBox.innerHTML = '';

    const errors = [];
    const gameType = document.getElementById('crop-type').value;
    const platform = document.getElementById('soil-type').value;
    const targetKd = parseFloat(document.getElementById('target-yield').value);
    const hours = parseFloat(document.getElementById('farm-acreage').value);
    const ping = parseFloat(document.getElementById('soil-moisture').value);
    const dpi = parseFloat(document.getElementById('soil-ph').value);
    const refreshRate = parseFloat(document.getElementById('soil-n').value);
    const fps = parseFloat(document.getElementById('soil-p').value);
    const chairRating = parseFloat(document.getElementById('soil-k').value);

    // Strict validation
    if (!gameType) errors.push("⚠️ You MUST select a Target Game! The AI cannot guess which game is causing your tears!");
    if (!platform) errors.push("⚠️ Gaming Platform / Hardware Rig is REQUIRED! Declare your potato specs!");
    if (isNaN(targetKd) || targetKd <= 0) errors.push("⚠️ Target K/D Ratio must be a positive number greater than 0!");
    if (isNaN(hours) || hours <= 0) errors.push("⚠️ Daily Hours Spent Losing must be greater than 0!");
    if (isNaN(ping) || ping < 1 || ping > 2000) errors.push("⚠️ Ping must be between 1ms and 2000ms!");
    if (isNaN(dpi) || dpi < 100 || dpi > 16000) errors.push("⚠️ Mouse DPI is outside known physics limits!");

    if (errors.length > 0) {
      playAlarm();
      validationBox.style.display = 'block';
      validationBox.innerHTML = `<h3>🚨 FORM VALIDATION FAILED (READ THESE WARNINGS):</h3><ul>${errors.map(err => `<li>${err}</li>`).join('')}</ul>`;
      validationBox.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const pestCheckboxes = document.querySelectorAll('input[name="pests"]:checked');
    const pestsList = Array.from(pestCheckboxes).map(cb => cb.value).join(', ') || 'General lobby incompetence';

    const formData = {
      crop_name: gameType,
      nickname: document.getElementById('crop-variety-nickname').value || `${gameType} Specialist`,
      growth_stage: document.getElementById('growth-stage').value,
      crop_mood: document.getElementById('crop-mood').value,
      target_yield: targetKd,
      soil_type: platform,
      soil_ph: dpi,
      soil_moisture: ping,
      nitrogen_ppm: refreshRate,
      phosphorus_ppm: fps,
      potassium_ppm: chairRating,
      acreage: hours,
      irrigation: document.getElementById('irrigation-type').value,
      pests: pestsList,
      ai_persona: document.getElementById('ai-persona').value,
      gemini_model: document.getElementById('gemini-model-select').value,
      farmer_notes: document.getElementById('farmer-notes').value
    };

    runGeminiInference(formData);
  }

  async function runGeminiInference(formData) {
    const submitBtn = document.getElementById('btn-generate-advisory');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `🤖 GEMINI AI COACH IS ANALYZING YOUR WHIFFED SHOTS... 🎮`;
    playLaser();
    triggerScreenShake();

    const customKey = (document.getElementById('gemini-api-key').value || localStorage.getItem(STORAGE_KEYS.GEMINI_KEY) || '').trim();
    let aiResults = null;

    if (customKey && customKey.startsWith('AIzaSy')) {
      try {
        aiResults = await callRealGeminiApi(customKey, formData);
      } catch (apiErr) {
        console.warn("Live Gemini API call failed, falling back to local expert engine:", apiErr);
      }
    }

    if (!aiResults) {
      await new Promise(resolve => setTimeout(resolve, 800));
      aiResults = computeGamingAdvisory(formData);
    }

    const newId = (dbAdvisories.length > 0 ? Math.max(...dbAdvisories.map(a => a.id)) : 100) + 1;
    const newRecord = {
      id: newId,
      ...formData,
      status: "TILTED",
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      recommendations: aiResults
    };

    dbAdvisories.unshift(newRecord);
    setDbData(STORAGE_KEYS.ADVISORIES, dbAdvisories);
    currentActiveAdvisory = newRecord;

    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;

    renderAdvisoryResults(newRecord);
    updateAdvisoryBadgeCount();
    renderDashboardTable();

    switchTab('advisory-results');
    playCoinBleep();
  }

  function computeGamingAdvisory(data) {
    const dpi = data.soil_ph;
    const ping = data.soil_moisture;
    const game = data.crop_name;
    const persona = data.ai_persona;

    let urgentTitle = "";
    let urgentBody = "";
    let urgentBullets = [];

    if (ping > 150) {
      urgentTitle = "🚨 SEVERE LATENCY DELAY: HIT-REGISTRATION COLLAPSE 🚨";
      urgentBody = `Your ping of ${ping}ms means your enemy saw you 3 business days before you fired your weapon!`;
      urgentBullets = [
        "⚠️ Unplug the toaster and disconnect other family members from Netflix",
        "⚠️ Use an ethernet cable instead of receiving Wi-Fi through 4 concrete walls"
      ];
    } else if (dpi > 2400) {
      urgentTitle = "🚨 HYPER-SENSITIVITY TREMOR: YOU ARE WHIP-PANNING INTO WALLS 🚨";
      urgentBody = `Your DPI of ${dpi} means moving your mouse 1 millimeter rotates your character 18 times!`;
      urgentBullets = [
        "⚠️ Lower your DPI immediately to 800 or 1200 DPI",
        "⚠️ Purchase a mousepad larger than a post-it note"
      ];
    } else {
      urgentTitle = "✅ HARDWARE IS FUNCTIONAL: THE PROBLEM IS RAW SKILL";
      urgentBody = `Your hardware ping (${ping}ms) and DPI (${dpi}) are completely acceptable. This confirms the uncomfortable truth: you simply missed your shots.`;
      urgentBullets = [
        "⚠️ Stop jumping around like a caffeinated kangaroo",
        "⚠️ Keep crosshair at head height instead of admiring the floor"
      ];
    }

    let recommendedWeapon = game.includes("Counter") ? "AK-47 / M4A1-S" : game.includes("Fortnite") ? "Pump Shotgun" : "Standard Primary";

    let synthesis = "";
    if (persona.includes("Discord")) {
      synthesis = `Listen here noob. I watched your replay for 4 seconds and wanted to delete my operating system. You spent ${data.acreage} hours today playing ${game} like your monitor was turned off. Lower your sensitivity, buy a real gaming chair, and stop blaming your teammates when you walk straight into snipers.`;
    } else if (persona.includes("Caster")) {
      synthesis = `OH MY GOODNESS! ${data.nickname.toUpperCase()} IS WALKING INTO THE ARENA ON ${game}! HE WHIFFS THE SHOT! HE FLASHES HIMSELF! THE CROWD IS WEEPING! HE NEEDS AN IMMEDIATE SENSITIVITY TUNE-UP! WHAT A DISASTER!`;
    } else if (persona.includes("Zen")) {
      synthesis = `Breathe in the calm digital wind. The 180ms ping is not your enemy; your agitated mind is the enemy. Release your anger against the 14-year-old smurfs. Practice crosshair stillness and the headshots shall follow.`;
    } else {
      synthesis = `[AIMBOT 9000 TELEMETRY REPORT] Game: ${game}. Target K/D ${data.target_yield} is statistically improbable at current 34 FPS. Adjust DPI to 800, calibrate counter-strafing, and drink 300ml water to lower cortisol tilt levels. Expected skill trajectory: +0.02% K/D.`;
    }

    return {
      urgent: { title: urgentTitle, body: urgentBody, bullets: urgentBullets },
      fertilizer: {
        title: `OPTIMIZED LOADOUT & SENSITIVITY: 800 DPI META`,
        n: `${dpi > 1600 ? '800 DPI' : dpi + ' DPI'}`,
        p: `Cyan Static Crosshair`,
        k: recommendedWeapon,
        timing: `Spend 30 minutes in aim warmup before jumping into ranked.`
      },
      irrigation: {
        title: `ANTI-TILT & HYDRATION CYCLE`,
        schedule: `Drink water every 45 mins. Step away for 5 mins after 2 consecutive defeats.`
      },
      pest: {
        title: `COUNTER-SMURF & WALLHACK DEFENSE`,
        tactics: [
          `Target: ${data.pests}`,
          `Countermeasure: Pre-fire common corners and hold off-angles`,
          `Mental Defense: Mute toxic players in voice chat immediately`
        ]
      },
      ai_synthesis: synthesis
    };
  }

  async function callRealGeminiApi(apiKey, data) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${data.gemini_model || 'gemini-1.5-flash'}:generateContent?key=${apiKey}`;
    const prompt = `You are a hilarious, slightly toxic, but technically accurate gaming coach AI. Generate an actionable, scientifically valid tactical loadout & tilt advisory for:
Game: ${data.crop_name} (${data.nickname}), Current Rank: ${data.growth_stage}, Rage Level: ${data.crop_mood}
Daily Hours: ${data.acreage}, Platform: ${data.soil_type}, Mouse DPI: ${data.soil_ph}, Ping: ${data.soil_moisture}ms
Refresh Rate: ${data.nitrogen_ppm}Hz, FPS: ${data.phosphorus_ppm}, Chair Ergonomics: ${data.potassium_ppm}/100
Target K/D: ${data.target_yield}, Role: ${data.irrigation}, In-Game Problems: ${data.pests}
Persona: ${data.ai_persona}, Player Confessions: ${data.farmer_notes || 'None'}

Return your answer strictly in valid JSON format with keys:
{
  "urgent": { "title": "string", "body": "string", "bullets": ["string", "string"] },
  "fertilizer": { "title": "string", "n": "string", "p": "string", "k": "string", "timing": "string" },
  "irrigation": { "title": "string", "schedule": "string" },
  "pest": { "title": "string", "tactics": ["string", "string", "string"] },
  "ai_synthesis": "string"
}`;

    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    if (!resp.ok) throw new Error(`Gemini HTTP error ${resp.status}`);
    const json = await resp.json();
    const candidateText = json.candidates[0].content.parts[0].text;
    const cleanJson = candidateText.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  }

  // ========================================================================
  // 9. RENDERING ADVISORY RESULTS
  // ========================================================================
  function renderAdvisoryResults(rec) {
    if (!rec) return;

    document.getElementById('res-crop-name').textContent = `${rec.crop_name.toUpperCase()} (${rec.nickname || 'MAIN'})`;
    document.getElementById('res-acreage').textContent = `${rec.acreage} HOURS PLAYED`;
    document.getElementById('res-soil-ph').textContent = `${rec.soil_ph} DPI (${rec.soil_type.toUpperCase()})`;
    document.getElementById('res-db-status').textContent = `COMMITTED TO POSTGRESQL (MATCH ID #${rec.id})`;

    const r = rec.recommendations;
    if (r) {
      if (r.urgent) {
        document.getElementById('res-urgent-title').textContent = r.urgent.title || "URGENT TILT DIRECTIVE";
        document.getElementById('res-urgent-body').textContent = r.urgent.body || "";
        const bulletBox = document.getElementById('res-urgent-bullets');
        if (bulletBox && r.urgent.bullets) {
          bulletBox.innerHTML = r.urgent.bullets.map(b => `<div>${b}</div>`).join('');
        }
      }

      if (r.fertilizer) {
        document.getElementById('res-fert-title').textContent = r.fertilizer.title || "LOADOUT & CROSSHAIR PRESCRIPTION";
        const npkBox = document.getElementById('res-npk-formula');
        if (npkBox) {
          npkBox.innerHTML = `
            <div class="npk-pill n-pill"><span class="npk-letter">DPI</span> <strong>${r.fertilizer.n || '800 DPI'}</strong></div>
            <div class="npk-pill p-pill"><span class="npk-letter">CROSS</span> <strong>${r.fertilizer.p || 'Cyan Static'}</strong></div>
            <div class="npk-pill k-pill"><span class="npk-letter">WEAPON</span> <strong>${r.fertilizer.k || 'Primary Meta'}</strong></div>
          `;
        }
        document.getElementById('res-fert-timing').textContent = r.fertilizer.timing || "Practice 30 minutes in aim trainer.";
      }

      if (r.irrigation) {
        document.getElementById('res-water-title').textContent = r.irrigation.title || "HYDRATION & BIOLOGICAL MAINTENANCE";
        const schedBox = document.getElementById('res-water-schedule');
        if (schedBox) {
          schedBox.innerHTML = `
            <div class="schedule-item">🗓️ <strong>SCHEDULE:</strong> ${r.irrigation.schedule || 'Drink water every 45 mins'}</div>
            <div class="schedule-item">🎮 <strong>ROLE FOCUS:</strong> ${rec.irrigation}</div>
          `;
        }
      }

      if (r.pest) {
        document.getElementById('res-pest-title').textContent = r.pest.title || "ANTI-SMURF TACTICS";
        const pestBox = document.getElementById('res-pest-tactics');
        if (pestBox) {
          if (Array.isArray(r.pest.tactics)) {
            pestBox.innerHTML = r.pest.tactics.map(t => `<div>⚠️ ${t}</div>`).join('');
          } else {
            pestBox.innerHTML = `<div>⚠️ ${r.pest.tactics}</div>`;
          }
        }
      }

      if (r.ai_synthesis) {
        document.getElementById('res-ai-raw-text').textContent = `"${r.ai_synthesis}"`;
      }
    }
  }

  // Result Action Buttons
  const btnSaveToPg = document.getElementById('btn-save-to-pg');
  const btnPrintResults = document.getElementById('btn-print-results');
  const btnCopyAdvisory = document.getElementById('btn-copy-advisory');
  const btnNewAdvisory = document.getElementById('btn-new-advisory');

  if (btnSaveToPg) {
    btnSaveToPg.addEventListener('click', () => {
      setDbData(STORAGE_KEYS.ADVISORIES, dbAdvisories);
      playCoinBleep();
      alert('💾 MATCH TELEMETRY COMMITTED TO POSTGRESQL!\n\nWAL synced. Your embarrassing performance is recorded forever in history.');
    });
  }

  if (btnPrintResults) {
    btnPrintResults.addEventListener('click', () => {
      playLaser();
      window.print();
    });
  }

  if (btnCopyAdvisory) {
    btnCopyAdvisory.addEventListener('click', () => {
      if (!currentActiveAdvisory) return;
      const text = `🎮 ULTRA GAMER 9000 ADVISORY #${currentActiveAdvisory.id}\nGame: ${currentActiveAdvisory.crop_name}\nTarget K/D: ${currentActiveAdvisory.target_yield}\nCoach Verdict: ${currentActiveAdvisory.recommendations?.ai_synthesis || 'N/A'}`;
      navigator.clipboard.writeText(text).then(() => {
        playCoinBleep();
        alert('📋 ADVISORY COPIED TO CLIPBOARD! Paste into Discord to intimidate enemies.');
      });
    });
  }

  if (btnNewAdvisory) {
    btnNewAdvisory.addEventListener('click', () => {
      switchTab('advisory-form');
    });
  }

  function updateAdvisoryBadgeCount() {
    const badge = document.getElementById('advisory-count-badge');
    const tableCount = document.getElementById('count-advisories');
    if (badge) badge.textContent = dbAdvisories.length;
    if (tableCount) tableCount.textContent = dbAdvisories.length;
  }

  // ========================================================================
  // 10. DASHBOARD RECENT TABLE & DB MANAGER
  // ========================================================================
  function renderDashboardTable() {
    const tbody = document.getElementById('dashboard-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';
    const records = dbAdvisories.slice(0, 8);

    records.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>#${row.id}</td>
        <td>${row.created_at || '2026-09-30 12:00'}</td>
        <td>${row.crop_name}</td>
        <td><strong>${row.nickname || 'Unknown'}</strong></td>
        <td>${row.growth_stage || 'Toilet III'}</td>
        <td>${row.crop_mood || 'Tilted'}</td>
        <td>${row.target_yield || '1.0'}</td>
        <td><span class="badge-chaotic-1">${row.status || 'TILTED'}</span></td>
        <td>${row.recommendations?.urgent?.title ? 'CRITICAL' : 'ANALYZED'}</td>
      `;
      tr.addEventListener('click', () => {
        currentActiveAdvisory = row;
        renderAdvisoryResults(row);
        switchTab('advisory-results');
      });
      tbody.appendChild(tr);
    });
  }

  let currentActiveTable = 'advisories';

  function renderActiveDbTable() {
    const thead = document.getElementById('pg-table-head');
    const tbody = document.getElementById('pg-table-body');
    if (!thead || !tbody) return;

    thead.innerHTML = '';
    tbody.innerHTML = '';

    if (currentActiveTable === 'advisories') {
      thead.innerHTML = `
        <tr>
          <th>id</th><th>game_title</th><th>gamer_tag</th><th>rank</th><th>hours_played</th>
          <th>mouse_dpi</th><th>ping_ms</th><th>target_kd</th><th>status</th><th>created_at</th>
        </tr>
      `;
      dbAdvisories.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${row.id}</td><td>${row.crop_name}</td><td>${row.nickname}</td><td>${row.growth_stage}</td>
          <td>${row.acreage}</td><td>${row.soil_ph}</td><td>${row.soil_moisture}</td>
          <td>${row.target_yield}</td><td>${row.status}</td><td>${row.created_at}</td>
        `;
        tbody.appendChild(tr);
      });
    } else if (currentActiveTable === 'crops') {
      thead.innerHTML = `
        <tr>
          <th>id</th><th>name</th><th>type</th><th>optimal_dpi</th><th>avg_kd</th><th>salt_rating</th>
        </tr>
      `;
      dbCrops.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${row.id}</td><td>${row.name}</td><td>${row.type}</td><td>${row.optimal_ph}</td>
          <td>${row.avg_yield_kg}</td><td>${row.water_need}</td>
        `;
        tbody.appendChild(tr);
      });
    } else if (currentActiveTable === 'soil') {
      thead.innerHTML = `
        <tr>
          <th>sensor_id</th><th>component</th><th>usage_pct</th><th>temp_c</th><th>fan_rpm</th>
        </tr>
      `;
      dbSoil.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${row.sensor_id}</td><td>${row.field}</td><td>${row.ph}%</td><td>${row.moisture_pct}°C</td>
          <td>${row.potassium_ppm} RPM</td>
        `;
        tbody.appendChild(tr);
      });
    }
  }

  const dbTabButtons = document.querySelectorAll('.db-tab-btn');
  dbTabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      dbTabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentActiveTable = btn.dataset.table;
      renderActiveDbTable();
    });
  });

  const btnRunSql = document.getElementById('btn-run-sql');
  const sqlQueryInput = document.getElementById('sql-query-input');
  const sqlStatusText = document.getElementById('sql-status-text');

  if (btnRunSql && sqlQueryInput) {
    btnRunSql.addEventListener('click', () => {
      executeRawSql(sqlQueryInput.value.trim());
    });
  }

  function executeRawSql(query) {
    playCoinBleep();
    const q = query.toLowerCase();

    if (q.startsWith('select')) {
      if (q.includes('game') || q.includes('crop')) {
        currentActiveTable = 'crops';
      } else if (q.includes('sensor') || q.includes('hardware') || q.includes('soil')) {
        currentActiveTable = 'soil';
      } else {
        currentActiveTable = 'advisories';
      }
      renderActiveDbTable();
      sqlStatusText.textContent = `Query executed: 200 OK (${Math.floor(Math.random() * 8 + 2)}ms)`;
    } else if (q.startsWith('insert')) {
      const newId = Math.floor(Math.random() * 500) + 200;
      dbAdvisories.unshift({
        id: newId,
        crop_name: "Valorant",
        nickname: "SQL_Inserted_Smurf",
        growth_stage: "Iron I",
        acreage: 4.0,
        soil_type: "Potato PC",
        soil_ph: 800,
        soil_moisture: 75,
        target_yield: 1.8,
        status: "TILTED",
        created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
        recommendations: computeGamingAdvisory({
          crop_name: "Valorant",
          nickname: "SQL",
          soil_ph: 800,
          soil_moisture: 75,
          target_yield: 1.8,
          acreage: 4.0,
          irrigation: "Duelist",
          pests: "None",
          ai_persona: "Toxic Discord Mod",
          growth_stage: "Iron I"
        })
      });
      setDbData(STORAGE_KEYS.ADVISORIES, dbAdvisories);
      renderActiveDbTable();
      renderDashboardTable();
      updateAdvisoryBadgeCount();
      sqlStatusText.textContent = `INSERT 0 1: Successfully committed Match ID #${newId}`;
    } else {
      sqlStatusText.textContent = `NOTICE: Statement acknowledged by PostgreSQL telemetry cluster.`;
    }
  }

  const btnSqlInsert = document.getElementById('btn-sql-insert');
  if (btnSqlInsert) {
    btnSqlInsert.addEventListener('click', () => {
      executeRawSql("INSERT INTO player_advisories (game_title, gamer_tag, target_kd) VALUES ('CS2', 'ClutchKing', 3.0);");
    });
  }

  const btnSqlReset = document.getElementById('btn-sql-reset');
  if (btnSqlReset) {
    btnSqlReset.addEventListener('click', () => {
      localStorage.removeItem(STORAGE_KEYS.ADVISORIES);
      dbAdvisories = [...INITIAL_ADVISORIES];
      setDbData(STORAGE_KEYS.ADVISORIES, dbAdvisories);
      renderActiveDbTable();
      renderDashboardTable();
      updateAdvisoryBadgeCount();
      sqlStatusText.textContent = `DATABASE RESET: Restored initial gaming telemetry records.`;
    });
  }

  // ========================================================================
  // 11. SETTINGS & SOUND CONTROLS
  // ========================================================================
  const btnSoundToggle = document.getElementById('btn-sound-toggle');
  if (btnSoundToggle) {
    btnSoundToggle.textContent = soundEnabled ? '🔊 SOUND: ON' : '🔇 SOUND: OFF';
    btnSoundToggle.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, soundEnabled);
      btnSoundToggle.textContent = soundEnabled ? '🔊 SOUND: ON' : '🔇 SOUND: OFF';
      if (soundEnabled) playCoinBleep();
    });
  }

  const cfgGeminiKey = document.getElementById('cfg-gemini-key');
  const btnSaveKey = document.getElementById('btn-save-key');
  const btnClearKey = document.getElementById('btn-clear-key');
  const apiKeyStatus = document.getElementById('api-key-status');

  const storedKey = localStorage.getItem(STORAGE_KEYS.GEMINI_KEY);
  if (storedKey && cfgGeminiKey) {
    cfgGeminiKey.value = storedKey;
    if (apiKeyStatus) apiKeyStatus.textContent = '🟢 Google Gemini API Key is Saved & Active!';
  }

  if (btnSaveKey && cfgGeminiKey) {
    btnSaveKey.addEventListener('click', () => {
      const keyVal = cfgGeminiKey.value.trim();
      if (keyVal) {
        localStorage.setItem(STORAGE_KEYS.GEMINI_KEY, keyVal);
        if (apiKeyStatus) apiKeyStatus.textContent = '🟢 Google Gemini API Key Saved!';
        playCoinBleep();
        alert('🔑 Gemini API Key saved locally in your browser! Live AI gaming coach calls are now active.');
      }
    });
  }

  if (btnClearKey && cfgGeminiKey) {
    btnClearKey.addEventListener('click', () => {
      localStorage.removeItem(STORAGE_KEYS.GEMINI_KEY);
      cfgGeminiKey.value = '';
      if (apiKeyStatus) apiKeyStatus.textContent = 'Using Built-in Gaming Fallback Engine (No key required!)';
      playCoinBleep();
    });
  }

  const btnTestSound = document.getElementById('btn-test-sound');
  if (btnTestSound) {
    btnTestSound.addEventListener('click', () => {
      playLaser();
    });
  }

  const btnScreenShake = document.getElementById('btn-screen-shake');
  if (btnScreenShake) {
    btnScreenShake.addEventListener('click', () => {
      triggerScreenShake();
      playAlarm();
    });
  }

  const btnTriggerPopupTest = document.getElementById('btn-trigger-popup-test');
  if (btnTriggerPopupTest) {
    btnTriggerPopupTest.addEventListener('click', () => {
      showPopup("🔥 TEST POPUP", "YOUR PC IS TOO POWERFUL", "Actually never mind. It is running at 12 FPS.", "CONFIRM", "CLOSE");
    });
  }

  // ========================================================================
  // 12. INITIAL BOOTSTRAP
  // ========================================================================
  function initApp() {
    initRouting();
    startLiveFluctuations();
    updateAuthDisplay(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'bob');
    updateAdvisoryBadgeCount();
    renderDashboardTable();
    renderActiveDbTable();
    if (currentActiveAdvisory) {
      renderAdvisoryResults(currentActiveAdvisory);
    }
    console.log("🎮💀 ULTRA GAMER 9000 INITIALIZED SUCCESSFULLY! DEFINITELY NOT A SCAM. 💀🎮");
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
