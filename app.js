/* ==========================================================================
   🌾🚜 AGRI-CYBER-FARM-9000: CORE JAVASCRIPT ENGINE 🚜🌾
   Complete functional logic for routing, form validation, Gemini AI reasoning,
   PostgreSQL storage engine, sound synthesis, and UI interactions!
   ========================================================================== */

(function () {
  'use strict';

  // ========================================================================
  // 1. STATE MANAGEMENT & POSTGRESQL SIMULATION LAYER
  // ========================================================================
  const STORAGE_KEYS = {
    ADVISORIES: 'agri_pg_advisories_v1',
    CROPS: 'agri_pg_crops_v1',
    SOIL: 'agri_pg_soil_v1',
    CURRENT_USER: 'agri_auth_user_v1',
    GEMINI_KEY: 'agri_gemini_api_key_v1',
    POWER_LEVEL: 'agri_ai_power_level_v1',
    SOUND_ENABLED: 'agri_sound_enabled_v1'
  };

  const DEFAULT_CROPS = [
    { id: 1, name: "Hybrid Field Corn", type: "Grain", optimal_ph: "6.0 - 6.8", avg_yield_kg: 7200, water_need: "Medium-High" },
    { id: 2, name: "Hard Winter Wheat", type: "Cereal", optimal_ph: "6.2 - 7.0", avg_yield_kg: 4800, water_need: "Medium" },
    { id: 3, name: "Heritage Roma Tomato", type: "Nightshade", optimal_ph: "6.2 - 6.8", avg_yield_kg: 18500, water_need: "High" },
    { id: 4, name: "Russet Burbank Potato", type: "Tuber", optimal_ph: "5.5 - 6.5", avg_yield_kg: 22000, water_need: "Medium" },
    { id: 5, name: "Glyphosate Soybean", type: "Legume", optimal_ph: "6.0 - 7.0", avg_yield_kg: 3400, water_need: "Medium" },
    { id: 6, name: "Imperator Carrot", type: "Root", optimal_ph: "6.0 - 6.8", avg_yield_kg: 14000, water_need: "Medium-Low" }
  ];

  const DEFAULT_SOIL = [
    { sensor_id: "SNSR-01-N", field: "Field 1 (Corn)", ph: 6.5, moisture_pct: 78.4, nitrogen_ppm: 45, phosphorus_ppm: 22, potassium_ppm: 180 },
    { sensor_id: "SNSR-02-E", field: "Field 2 (Wheat)", ph: 6.8, moisture_pct: 62.1, nitrogen_ppm: 38, phosphorus_ppm: 19, potassium_ppm: 165 },
    { sensor_id: "SNSR-03-S", field: "Field 3 (Potatoes)", ph: 5.8, moisture_pct: 81.0, nitrogen_ppm: 52, phosphorus_ppm: 34, potassium_ppm: 210 },
    { sensor_id: "SNSR-04-W", field: "Greenhouse Alpha", ph: 6.4, moisture_pct: 69.5, nitrogen_ppm: 60, phosphorus_ppm: 40, potassium_ppm: 240 },
    { sensor_id: "SNSR-05-C", field: "Pasture / Barnyard", ph: 7.2, moisture_pct: 74.0, nitrogen_ppm: 75, phosphorus_ppm: 45, potassium_ppm: 190 }
  ];

  const INITIAL_ADVISORIES = [
    {
      id: 101,
      crop_name: "Corn",
      nickname: "Big Bertha 2026",
      growth_stage: "Vegetative",
      acreage: 25.5,
      soil_type: "Sandy Loam",
      soil_ph: 6.5,
      soil_moisture: 78.4,
      nitrogen_ppm: 45,
      phosphorus_ppm: 22,
      potassium_ppm: 180,
      target_yield: 6500,
      irrigation: "Center Pivot Sprinkler",
      pests: "Fall Armyworms, Aphids",
      ai_persona: "Hyper-Direct Agronomist",
      status: "APPLIED",
      created_at: new Date(Date.now() - 3600000 * 5).toISOString().replace('T', ' ').substring(0, 19),
      recommendations: {
        urgent: {
          title: "OPTIMAL PH ZONE WITH MUD RISK",
          body: "Soil pH 6.5 is well within corn nutrient absorption range. However, 78.4% moisture indicates mud puddling near pivot tracks. Inspect wheel ruts."
        },
        fertilizer: {
          title: "SIDE-DRESS NITROGEN INJECTION",
          n: "135 kg/ha",
          p: "55 kg/ha",
          k: "80 kg/ha",
          timing: "Apply 50% split now at V6 stage, remainder at tasseling."
        },
        irrigation: {
          title: "PAUSE PIVOT FOR 48 HOURS",
          schedule: "Rain sensor detected saturation. Defer center pivot cycle until soil moisture dips below 65%."
        },
        pest: {
          title: "BACILLUS THURINGIENSIS (BT) SPRAY",
          tactics: "Apply biological Bt spray at dusk to eliminate young armyworm instars before whorl feeding commences."
        },
        ai_synthesis: "Comprehensive analysis: Field 1 is on trajectory for a record-breaking harvest (+22% above baseline). Keep tractor tires inflated to 32 PSI."
      }
    }
  ];

  // Storage getters & setters
  function getDbData(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.warn("Storage read error:", e);
      return fallback;
    }
  }

  function setDbData(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn("Storage write error:", e);
    }
  }

  let dbAdvisories = getDbData(STORAGE_KEYS.ADVISORIES, INITIAL_ADVISORIES);
  let dbCrops = getDbData(STORAGE_KEYS.CROPS, DEFAULT_CROPS);
  let dbSoil = getDbData(STORAGE_KEYS.SOIL, DEFAULT_SOIL);
  let currentActiveAdvisory = dbAdvisories[0] || null;

  // ========================================================================
  // 2. AUDIO SYNTHESIZER (WEB AUDIO API)
  // ========================================================================
  let audioCtx = null;
  let soundEnabled = localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED) !== 'false';

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
    } catch (err) {
      // Audio might be blocked by browser autoplay policy
    }
  }

  function playTractorHorn() {
    playTone(150, 0.4, 'sawtooth');
    setTimeout(() => playTone(120, 0.6, 'sawtooth'), 200);
  }

  function playCoinBleep() {
    playTone(587, 0.1, 'square');
    setTimeout(() => playTone(880, 0.25, 'square'), 80);
  }

  function playAlarm() {
    playTone(800, 0.15, 'sawtooth');
    setTimeout(() => playTone(400, 0.2, 'sawtooth'), 150);
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

  // Handle URL hash routing on initial load
  function initRouting() {
    const hash = window.location.hash.replace('#', '');
    const validTabs = ['dashboard', 'advisory-form', 'advisory-results', 'database-pg', 'analytics', 'settings'];
    if (validTabs.includes(hash)) {
      switchTab(hash);
    }
  }

  // ========================================================================
  // 4. CLOCK, MARQUEE & TOP BAR
  // ========================================================================
  function updateLiveClock() {
    const clockEl = document.getElementById('live-clock');
    if (clockEl) {
      const now = new Date();
      clockEl.textContent = `⏰ ${now.toLocaleTimeString()}`;
    }
  }
  setInterval(updateLiveClock, 1000);
  updateLiveClock();

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

  // ========================================================================
  // 5. USER AUTHENTICATION & ROLE SWITCHING
  // ========================================================================
  const USERS = {
    bob: { name: "Farmer Bob McGee", title: "Master Farm Overseer (Level 99)", badge: "🌽 CORN LORD 👑" },
    alice: { name: "Dr. Alice Vance", title: "Senior Agricultural Biochemist", badge: "🔬 DR. BIO 🧪" },
    overseer: { name: "Cyber-Overseer 9000", title: "Autonomous AI Farm Intelligence", badge: "🤖 MATRIX OVERLORD ⚡" },
    guest: { name: "Barn Visitor (Intern)", title: "Tractor Trainee & Corn Observer", badge: "🚜 INTERN 🌱" }
  };

  function updateAuthDisplay(userId) {
    const user = USERS[userId] || USERS.bob;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, userId);

    const userDisplay = document.getElementById('user-display');
    const authUsernameDisplay = document.getElementById('auth-username-display');
    const authRoleDisplay = document.getElementById('auth-role-display');

    if (userDisplay) {
      userDisplay.textContent = `👤 LOGGED IN: ${user.name.toUpperCase()} [${user.badge}]`;
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
      playTractorHorn();
      alert(`🚜 SESSION SWITCHED! You are now operating as: ${USERS[selected].name}`);
    });
  }

  // ========================================================================
  // 6. AI POWER LEVEL & OVERCLOCK ENGINE
  // ========================================================================
  let currentPower = parseInt(localStorage.getItem(STORAGE_KEYS.POWER_LEVEL) || '97', 10);

  function setPowerLevel(level) {
    currentPower = level;
    localStorage.setItem(STORAGE_KEYS.POWER_LEVEL, level);

    const powerDisplay = document.getElementById('power-display');
    const powerBar = document.getElementById('power-bar');
    const powerBadge = document.getElementById('power-status-badge');

    if (powerDisplay) powerDisplay.textContent = `${level}%`;
    if (powerBar) {
      powerBar.style.width = `${Math.min(level, 100)}%`;
      if (level > 100) {
        powerBar.style.background = 'linear-gradient(90deg, #ff0000, #ff00ff, #ffff00)';
      } else {
        powerBar.style.background = 'linear-gradient(90deg, #39ff14, #ffff00, #ff6600, #ff0022)';
      }
    }
    if (powerBadge) {
      if (level > 100) {
        powerBadge.textContent = '🔥 OVERCLOCK MELTDOWN DANGER ⚠️';
        powerBadge.style.background = '#ff0000';
        powerBadge.style.color = '#ffff00';
      } else {
        powerBadge.textContent = 'NORMAL CYBERNETIC HUM 🟢';
        powerBadge.style.background = '#003300';
        powerBadge.style.color = '#39ff14';
      }
    }
  }

  const btnOverclock = document.getElementById('btn-overclock');
  const btnResetPower = document.getElementById('btn-reset-power');

  if (btnOverclock) {
    btnOverclock.addEventListener('click', () => {
      playAlarm();
      triggerScreenShake();
      setPowerLevel(9999);
      alert('⚡ WARNING! GEMINI AI OVERCLOCKED TO 9999%!\n\nAll corn ears within 5 miles are vibrating in harmonic sympathy with Google servers!');
    });
  }

  if (btnResetPower) {
    btnResetPower.addEventListener('click', () => {
      playCoinBleep();
      setPowerLevel(97);
    });
  }

  function triggerScreenShake() {
    document.body.classList.add('screen-vibrate');
    setTimeout(() => document.body.classList.remove('screen-vibrate'), 450);
  }

  // ========================================================================
  // 7. COMPETING CTAS & EASTER EGGS
  // ========================================================================
  const btnTurboHarvest = document.getElementById('btn-turbo-harvest');
  if (btnTurboHarvest) {
    btnTurboHarvest.addEventListener('click', () => {
      playTractorHorn();
      triggerScreenShake();
      alert('🚜🚨 EMERGENCY TURBO HARVEST MODE ENGAGED! 🚨🚜\n\nTurbines engaged! Harvester speed increased by 400%! Watch out for wandering cows!');
    });
  }

  const cta1 = document.getElementById('cta-click-me');
  const cta2 = document.getElementById('cta-no-click-me');
  const cta3 = document.getElementById('cta-urgent');

  if (cta1) cta1.addEventListener('click', () => { playCoinBleep(); alert('🌽 CONGRATULATIONS! You clicked the green button! A free bag of fertilizer has been credited to your barn!'); });
  if (cta2) cta2.addEventListener('click', () => { playAlarm(); alert('⛔ REBEL DETECTED! You clicked the button you were told not to click! The potatoes are proud of you.'); });
  if (cta3) cta3.addEventListener('click', () => { playCoinBleep(); switchTab('advisory-form'); });

  const btnQuickAdvise = document.getElementById('btn-quick-advise');
  if (btnQuickAdvise) {
    btnQuickAdvise.addEventListener('click', () => {
      const select = document.getElementById('quick-crop-select');
      const cropName = select ? select.value : 'Sweet Corn';
      generateQuickAdvisory(cropName);
    });
  }

  // ========================================================================
  // 8. ADVISORY FORM SLIDER & VALIDATION ENGINE
  // ========================================================================
  const soilPhInput = document.getElementById('soil-ph');
  const phDisplay = document.getElementById('ph-display');
  if (soilPhInput && phDisplay) {
    soilPhInput.addEventListener('input', () => {
      phDisplay.textContent = soilPhInput.value;
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
    const cropType = document.getElementById('crop-type').value;
    const soilType = document.getElementById('soil-type').value;
    const targetYield = parseFloat(document.getElementById('target-yield').value);
    const acreage = parseFloat(document.getElementById('farm-acreage').value);
    const soilMoisture = parseFloat(document.getElementById('soil-moisture').value);
    const soilPh = parseFloat(document.getElementById('soil-ph').value);
    const soilN = parseFloat(document.getElementById('soil-n').value);
    const soilP = parseFloat(document.getElementById('soil-p').value);
    const soilK = parseFloat(document.getElementById('soil-k').value);

    // Strict validation
    if (!cropType) errors.push("⚠️ You MUST select a Primary Target Crop! Crops cannot advise themselves!");
    if (!soilType) errors.push("⚠️ Soil Texture Classification is REQUIRED! Mud without classification is anarchy!");
    if (isNaN(targetYield) || targetYield <= 0) errors.push("⚠️ Target Yield must be a positive number greater than 0 kg/ha!");
    if (isNaN(acreage) || acreage <= 0) errors.push("⚠️ Field Acreage must be greater than 0 acres!");
    if (isNaN(soilMoisture) || soilMoisture < 0 || soilMoisture > 100) errors.push("⚠️ Soil Moisture must be between 0% and 100%!");
    if (isNaN(soilPh) || soilPh < 3.0 || soilPh > 10.0) errors.push("⚠️ Soil pH is outside known biological planetary boundaries (3.0 - 10.0)!");

    if (errors.length > 0) {
      playAlarm();
      validationBox.style.display = 'block';
      validationBox.innerHTML = `<h3>🚨 FORM VALIDATION FAILED (READ THESE WARNINGS):</h3><ul>${errors.map(err => `<li>${err}</li>`).join('')}</ul>`;
      validationBox.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // Collect checked pests
    const pestCheckboxes = document.querySelectorAll('input[name="pests"]:checked');
    const pestsList = Array.from(pestCheckboxes).map(cb => cb.value).join(', ') || 'No immediate pest outbreak noted';

    const formData = {
      crop_name: cropType,
      nickname: document.getElementById('crop-variety-nickname').value || `${cropType} Field Patch`,
      growth_stage: document.getElementById('growth-stage').value,
      crop_mood: document.getElementById('crop-mood').value,
      target_yield: targetYield,
      soil_type: soilType,
      soil_ph: soilPh,
      soil_moisture: soilMoisture,
      nitrogen_ppm: soilN,
      phosphorus_ppm: soilP,
      potassium_ppm: soilK,
      acreage: acreage,
      irrigation: document.getElementById('irrigation-type').value,
      pests: pestsList,
      ai_persona: document.getElementById('ai-persona').value,
      gemini_model: document.getElementById('gemini-model-select').value,
      farmer_notes: document.getElementById('farmer-notes').value
    };

    runGeminiInference(formData);
  }

  // ========================================================================
  // 9. GEMINI AI AGRONOMIC INFERENCE ENGINE
  // ========================================================================
  async function runGeminiInference(formData) {
    const submitBtn = document.getElementById('btn-generate-advisory');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `🤖 GEMINI AI IS THINKING VERY HARD ABOUT YOUR ${formData.crop_name.toUpperCase()}... 🌾`;
    playTractorHorn();
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

    // If no custom API key or API call failed, run our rich built-in agronomy calculation engine
    if (!aiResults) {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate ultra-fast cognition
      aiResults = computeAgronomyAdvisory(formData);
    }

    // Assemble new database advisory record
    const newId = (dbAdvisories.length > 0 ? Math.max(...dbAdvisories.map(a => a.id)) : 100) + 1;
    const newRecord = {
      id: newId,
      ...formData,
      status: "ACTIVE",
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      recommendations: aiResults
    };

    // Commit to simulated PostgreSQL store
    dbAdvisories.unshift(newRecord);
    setDbData(STORAGE_KEYS.ADVISORIES, dbAdvisories);
    currentActiveAdvisory = newRecord;

    // Reset submit button
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;

    // Render into results view
    renderAdvisoryResults(newRecord);

    // Update table and badges
    updateAdvisoryBadgeCount();
    renderDashboardTable();

    // Switch tab to Results!
    switchTab('advisory-results');
    playCoinBleep();
  }

  // Built-in High Precision Agronomy Engine
  function computeAgronomyAdvisory(data) {
    const ph = data.soil_ph;
    const moisture = data.soil_moisture;
    const crop = data.crop_name;
    const persona = data.ai_persona;

    // 1. Soil pH & Urgent Thing
    let urgentTitle = "";
    let urgentBody = "";
    let urgentBullets = [];

    if (ph < 5.8) {
      urgentTitle = "🚨 SEVERE SOIL ACIDIFICATION & ALUMINUM TOXICITY RISK 🚨";
      urgentBody = `Your soil pH of ${ph} is significantly acidic. In acid soil, phosphorus becomes locked into insoluble aluminum phosphates, crippling root elongation!`;
      urgentBullets = [
        `⚠️ Broadcast ${Math.round(data.acreage * 45)} kg of Agricultural Calcitic Limestone across all ${data.acreage} acres`,
        `⚠️ Incorporate lime into the top 15cm of soil before heavy rains occur`
      ];
    } else if (ph > 7.6) {
      urgentTitle = "🚨 HIGH ALKALINITY & IRON CHLOROSIS WARNING 🚨";
      urgentBody = `Your soil pH of ${ph} is dangerously alkaline for ${crop}. Iron and zinc micronutrients are chemically immobilized!`;
      urgentBullets = [
        `⚠️ Apply Elemental Sulfur (250 kg/ha) or Agricultural Gypsum to gradually drive down soil pH`,
        `⚠️ Apply foliar chelated iron (Fe-EDDHA) to prevent interveinal chlorosis`
      ];
    } else {
      urgentTitle = "✅ SOIL PH IS BALANCED, BUT MONITOR NITROGEN LEACHING";
      urgentBody = `Soil pH ${ph} is in the sweet spot for ${crop}. However, warm soil temperatures will accelerate microbial nitrification.`;
      urgentBullets = [
        `⚠️ Maintain consistent soil moisture to preserve active rhizosphere mycorrhizal colonies`,
        `⚠️ Verify tractor wheel tracks are not causing subsurface hardpan compaction`
      ];
    }

    // 2. NPK Fertilizer Calculation
    let nDose = Math.max(40, Math.round((data.target_yield / 50) - (data.nitrogen_ppm * 0.4)));
    let pDose = Math.max(25, Math.round((data.target_yield / 120) - (data.phosphorus_ppm * 0.3)));
    let kDose = Math.max(30, Math.round((data.target_yield / 90) - (data.potassium_ppm * 0.2)));

    // 3. Irrigation Protocol
    let irrFreq = "3.5 days";
    let irrDuration = "4 hours";
    let irrAction = "";
    if (moisture > 75) {
      irrFreq = "5 to 6 days";
      irrDuration = "2 hours (Reduced)";
      irrAction = "Hold off on immediate irrigation! Soil is already near field capacity.";
    } else if (moisture < 45) {
      irrFreq = "2 days";
      irrDuration = "5 hours (Deep Soak)";
      irrAction = "CRITICAL DEFICIT! Apply emergency water depth of 40mm immediately to prevent vegetative wilting.";
    } else {
      irrAction = `Maintain standard ${data.irrigation} rotation. Apply 30mm water equivalent per week.`;
    }

    // 4. Pest Defense
    let pestBullets = [
      `Target: ${data.pests}`,
      `Organic Control: Cold-pressed 0.5% Neem Oil spray with agricultural wetting agent`,
      `Biological Countermeasure: Introduce beneficial parasitoid wasps (Trichogramma) or predatory ladybugs`
    ];

    // 5. Persona Synthesis
    let synthesis = "";
    if (persona.includes("Southern")) {
      synthesis = `Well butter my biscuits! Listen here farmer, your ${data.acreage} acres of ${crop} ("${data.nickname}") are mighty hungry for ${nDose} kg of nitrogen! The computer says your dirt moisture is ${moisture}%, so don't you dare drown 'em. Get your tractor rolling and watch out for them bugs!`;
    } else if (persona.includes("Zen")) {
      synthesis = `Breathe in the morning dew over your ${data.acreage} acres of ${crop}. The soil pH of ${ph} speaks of quiet harmony, though your plants yearn for ${nDose} kg of nitrogen light. Flow with the irrigation currents and honor the earth.`;
    } else if (persona.includes("Cybernetic")) {
      synthesis = `[SYSTEM 9000 ANALYSIS COMPLETE] Target crop: ${crop} [${data.nickname}]. Nitrogen deficit detected: ${nDose} kg/ha required for target yield ${data.target_yield} kg/ha. Soil hydration status: ${moisture}%. Confidence rating: 99.8%. Executing harvest optimization matrix.`;
    } else {
      synthesis = `Official Agronomic Directive: Field analysis for ${data.acreage} acres of ${crop} confirms strong vegetative potential. Implement split-application fertilizer (${nDose}-${pDose}-${kDose} kg/ha NPK). Maintain moisture at 65-70%. Follow IPM pest controls to secure projected yield.`;
    }

    return {
      urgent: { title: urgentTitle, body: urgentBody, bullets: urgentBullets },
      fertilizer: {
        title: `NPK DOSAGE: ${nDose}N - ${pDose}P - ${kDose}K (KG/HA)`,
        n: `${nDose} kg/ha`,
        p: `${pDose} kg/ha`,
        k: `${kDose} kg/ha`,
        timing: `Apply 45% basal split during ${data.growth_stage}, remaining 55% during reproductive peak.`
      },
      irrigation: {
        title: `WATER PROTOCOL FOR ${data.irrigation.toUpperCase()}`,
        body: irrAction,
        schedule: `Run system every ${irrFreq} for ${irrDuration}. Target root depth: 30cm.`
      },
      pest: {
        title: `INTEGRATED PEST DEFENSE (${data.pests.substring(0, 30)}...)`,
        tactics: pestBullets
      },
      ai_synthesis: synthesis
    };
  }

  // Real Google Gemini API Call (when user supplies API key)
  async function callRealGeminiApi(apiKey, data) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${data.gemini_model || 'gemini-1.5-flash'}:generateContent?key=${apiKey}`;
    const prompt = `You are a world-class agricultural agronomist and farm AI. Generate an actionable, scientifically accurate farming advisory for:
Crop: ${data.crop_name} (${data.nickname}), Stage: ${data.growth_stage}, Mood: ${data.crop_mood}
Acreage: ${data.acreage} acres, Soil: ${data.soil_type}, pH: ${data.soil_ph}, Moisture: ${data.soil_moisture}%
N-P-K: N=${data.nitrogen_ppm}ppm, P=${data.soil_p}ppm, K=${data.soil_k}ppm
Target Yield: ${data.target_yield} kg/ha, Irrigation: ${data.irrigation}, Pests: ${data.pests}
Persona: ${data.ai_persona}, Farmer Notes: ${data.farmer_notes || 'None'}

Return your answer strictly in valid JSON format with keys:
{
  "urgent": { "title": "string", "body": "string", "bullets": ["string", "string"] },
  "fertilizer": { "title": "string", "n": "string", "p": "string", "k": "string", "timing": "string" },
  "irrigation": { "title": "string", "body": "string", "schedule": "string" },
  "pest": { "title": "string", "tactics": ["string", "string", "string"] },
  "ai_synthesis": "string"
}`;

    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    if (!resp.ok) {
      throw new Error(`Gemini HTTP error ${resp.status}`);
    }

    const json = await resp.json();
    const candidateText = json.candidates[0].content.parts[0].text;
    const cleanJson = candidateText.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  }

  // Quick advisory from dashboard dropdown
  function generateQuickAdvisory(cropName) {
    const randomSoil = dbSoil[Math.floor(Math.random() * dbSoil.length)];
    const mockData = {
      crop_name: cropName.replace(/🌽|🌾|🍅|🥔|🌱/g, '').trim(),
      nickname: `Fast Dispatch ${cropName}`,
      growth_stage: "Vegetative",
      crop_mood: "Overjoyed",
      target_yield: 7000,
      soil_type: "Clay Loam",
      soil_ph: randomSoil.ph,
      soil_moisture: randomSoil.moisture_pct,
      nitrogen_ppm: randomSoil.nitrogen_ppm,
      phosphorus_ppm: randomSoil.phosphorus_ppm,
      potassium_ppm: randomSoil.potassium_ppm,
      acreage: 18.0,
      irrigation: "Drip Irrigation",
      pests: "Fall Armyworms, Aphids",
      ai_persona: "Hyper-Direct Agronomist",
      gemini_model: "gemini-1.5-flash",
      farmer_notes: "Fast dispatch triggered from dashboard."
    };
    runGeminiInference(mockData);
  }

  // ========================================================================
  // 10. RENDERING ADVISORY RESULTS
  // ========================================================================
  function renderAdvisoryResults(rec) {
    if (!rec) return;

    document.getElementById('res-crop-name').textContent = `${rec.crop_name.toUpperCase()} (${rec.nickname || 'FIELD 1'})`;
    document.getElementById('res-acreage').textContent = `${rec.acreage} ACRES`;
    document.getElementById('res-soil-ph').textContent = `${rec.soil_ph} (SOIL: ${rec.soil_type.toUpperCase()})`;
    document.getElementById('res-db-status').textContent = `COMMITTED TO POSTGRESQL (ID #${rec.id})`;

    const r = rec.recommendations;
    if (r) {
      // 1. Urgent Warning
      if (r.urgent) {
        document.getElementById('res-urgent-title').textContent = r.urgent.title || "URGENT SOIL DIRECTIVE";
        document.getElementById('res-urgent-body').textContent = r.urgent.body || "";
        const bulletBox = document.getElementById('res-urgent-bullets');
        if (bulletBox && r.urgent.bullets) {
          bulletBox.innerHTML = r.urgent.bullets.map(b => `<div>${b}</div>`).join('');
        }
      }

      // 2. Fertilizer
      if (r.fertilizer) {
        document.getElementById('res-fert-title').textContent = r.fertilizer.title || "NPK RATIO PRESCRIPTION";
        const npkBox = document.getElementById('res-npk-formula');
        if (npkBox) {
          npkBox.innerHTML = `
            <div class="npk-pill n-pill"><span class="npk-letter">N</span> <strong>${r.fertilizer.n || '120 kg/ha'}</strong></div>
            <div class="npk-pill p-pill"><span class="npk-letter">P</span> <strong>${r.fertilizer.p || '50 kg/ha'}</strong></div>
            <div class="npk-pill k-pill"><span class="npk-letter">K</span> <strong>${r.fertilizer.k || '75 kg/ha'}</strong></div>
          `;
        }
        document.getElementById('res-fert-timing').textContent = r.fertilizer.timing || "Apply in two equal splits.";
      }

      // 3. Water
      if (r.irrigation) {
        document.getElementById('res-water-title').textContent = r.irrigation.title || "WATER PROTOCOL";
        document.getElementById('res-water-body').textContent = r.irrigation.body || "";
        const schedBox = document.getElementById('res-water-schedule');
        if (schedBox) {
          schedBox.innerHTML = `
            <div class="schedule-item">🗓️ <strong>SCHEDULE:</strong> ${r.irrigation.schedule || 'Run every 3.5 days'}</div>
            <div class="schedule-item">💧 <strong>METHOD:</strong> ${rec.irrigation}</div>
          `;
        }
      }

      // 4. Pest
      if (r.pest) {
        document.getElementById('res-pest-title').textContent = r.pest.title || "PEST DEFENSE MATRIX";
        const pestBox = document.getElementById('res-pest-tactics');
        if (pestBox && Array.isArray(r.pest.tactics)) {
          pestBox.innerHTML = r.pest.tactics.map(t => `<div>⚠️ ${t}</div>`).join('');
        } else if (pestBox && typeof r.pest.tactics === 'string') {
          pestBox.innerHTML = `<div>⚠️ ${r.pest.tactics}</div>`;
        }
      }

      // 5. Synthesis
      if (r.ai_synthesis) {
        document.getElementById('res-ai-raw-text').textContent = `"${r.ai_synthesis}"`;
      }
    }
  }

  // Result Actions Buttons
  const btnSaveToPg = document.getElementById('btn-save-to-pg');
  const btnPrintResults = document.getElementById('btn-print-results');
  const btnCopyAdvisory = document.getElementById('btn-copy-advisory');
  const btnNewAdvisory = document.getElementById('btn-new-advisory');

  if (btnSaveToPg) {
    btnSaveToPg.addEventListener('click', () => {
      setDbData(STORAGE_KEYS.ADVISORIES, dbAdvisories);
      playCoinBleep();
      alert('💾 TRANSACTION COMMITTED TO POSTGRESQL!\n\nWAL log synced. Advisory record is permanent and safe.');
    });
  }

  if (btnPrintResults) {
    btnPrintResults.addEventListener('click', () => {
      playTractorHorn();
      window.print();
    });
  }

  if (btnCopyAdvisory) {
    btnCopyAdvisory.addEventListener('click', () => {
      if (!currentActiveAdvisory) return;
      const text = `🌾 AGRI-CYBER-FARM-9000 ADVISORY #${currentActiveAdvisory.id}\nCrop: ${currentActiveAdvisory.crop_name}\nTarget: ${currentActiveAdvisory.target_yield} kg/ha\nSynthesis: ${currentActiveAdvisory.recommendations?.ai_synthesis || 'N/A'}`;
      navigator.clipboard.writeText(text).then(() => {
        playCoinBleep();
        alert('📋 ADVISORY COPIED TO CLIPBOARD! Share with your tractor crew.');
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
  // 11. DASHBOARD RECENT TABLE & DB TABLES
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
        <td>Sector ${row.id % 5 + 1} (${row.acreage} ac)</td>
        <td><strong>${row.crop_name}</strong> (${row.nickname || 'N/A'})</td>
        <td>${row.soil_ph}</td>
        <td>${row.soil_moisture}%</td>
        <td>${row.recommendations?.fertilizer?.n || '120N'} / ${row.recommendations?.fertilizer?.p || '50P'}</td>
        <td><span class="badge-chaotic-3">${row.status || 'ACTIVE'}</span></td>
        <td>Farmer Bob</td>
      `;
      tr.addEventListener('click', () => {
        currentActiveAdvisory = row;
        renderAdvisoryResults(row);
        switchTab('advisory-results');
      });
      tbody.appendChild(tr);
    });
  }

  // PostgreSQL Table View Manager
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
          <th>id</th><th>crop_name</th><th>acreage</th><th>soil_type</th><th>soil_ph</th>
          <th>moisture_pct</th><th>target_yield</th><th>status</th><th>created_at</th>
        </tr>
      `;
      dbAdvisories.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${row.id}</td><td>${row.crop_name}</td><td>${row.acreage}</td><td>${row.soil_type}</td>
          <td>${row.soil_ph}</td><td>${row.soil_moisture}</td><td>${row.target_yield}</td>
          <td>${row.status}</td><td>${row.created_at}</td>
        `;
        tbody.appendChild(tr);
      });
    } else if (currentActiveTable === 'crops') {
      thead.innerHTML = `
        <tr>
          <th>id</th><th>name</th><th>type</th><th>optimal_ph</th><th>avg_yield_kg</th><th>water_need</th>
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
          <th>sensor_id</th><th>field</th><th>ph</th><th>moisture_pct</th><th>nitrogen_ppm</th><th>phosphorus_ppm</th><th>potassium_ppm</th>
        </tr>
      `;
      dbSoil.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${row.sensor_id}</td><td>${row.field}</td><td>${row.ph}</td><td>${row.moisture_pct}</td>
          <td>${row.nitrogen_ppm}</td><td>${row.phosphorus_ppm}</td><td>${row.potassium_ppm}</td>
        `;
        tbody.appendChild(tr);
      });
    }
  }

  // DB Table Tabs
  const dbTabButtons = document.querySelectorAll('.db-tab-btn');
  dbTabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      dbTabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentActiveTable = btn.dataset.table;
      renderActiveDbTable();
    });
  });

  // SQL Runner Console
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
      if (q.includes('crop')) {
        currentActiveTable = 'crops';
      } else if (q.includes('soil')) {
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
        crop_name: "Custom SQL Corn",
        nickname: "Raw Query Field",
        growth_stage: "Vegetative",
        acreage: 50.0,
        soil_type: "Sandy Loam",
        soil_ph: 6.7,
        soil_moisture: 72.0,
        target_yield: 8000,
        status: "COMMITTED",
        created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
        recommendations: computeAgronomyAdvisory({
          crop_name: "Corn",
          nickname: "SQL Query",
          soil_ph: 6.7,
          soil_moisture: 72.0,
          target_yield: 8000,
          acreage: 50.0,
          irrigation: "Drip Irrigation",
          pests: "None",
          ai_persona: "Hyper-Direct Agronomist",
          growth_stage: "Vegetative"
        })
      });
      setDbData(STORAGE_KEYS.ADVISORIES, dbAdvisories);
      renderActiveDbTable();
      renderDashboardTable();
      updateAdvisoryBadgeCount();
      sqlStatusText.textContent = `INSERT 0 1: Successfully committed ID #${newId}`;
    } else {
      sqlStatusText.textContent = `NOTICE: Statement acknowledged and parsed by PostgreSQL engine.`;
    }
  }

  const btnSqlInsert = document.getElementById('btn-sql-insert');
  if (btnSqlInsert) {
    btnSqlInsert.addEventListener('click', () => {
      executeRawSql("INSERT INTO farm_advisories (crop_name, acreage, soil_ph) VALUES ('Durum Wheat', 40.0, 6.8);");
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
      sqlStatusText.textContent = `DATABASE RESET: Restored initial PostgreSQL tables.`;
    });
  }

  // ========================================================================
  // 12. SETTINGS VIEW ACTIONS & GEMINI API KEY STORAGE
  // ========================================================================
  const cfgGeminiKey = document.getElementById('cfg-gemini-key');
  const btnSaveKey = document.getElementById('btn-save-key');
  const btnClearKey = document.getElementById('btn-clear-key');
  const apiKeyStatus = document.getElementById('api-key-status');

  const storedKey = localStorage.getItem(STORAGE_KEYS.GEMINI_KEY);
  if (storedKey && cfgGeminiKey) {
    cfgGeminiKey.value = storedKey;
    if (apiKeyStatus) apiKeyStatus.textContent = '🟢 Google Gemini API Key is Saved & Ready for Live Calls!';
  }

  if (btnSaveKey && cfgGeminiKey) {
    btnSaveKey.addEventListener('click', () => {
      const keyVal = cfgGeminiKey.value.trim();
      if (keyVal) {
        localStorage.setItem(STORAGE_KEYS.GEMINI_KEY, keyVal);
        if (apiKeyStatus) apiKeyStatus.textContent = '🟢 Google Gemini API Key Saved!';
        playCoinBleep();
        alert('🔑 Gemini API Key saved locally in your browser! Live AI calls are now active.');
      }
    });
  }

  if (btnClearKey && cfgGeminiKey) {
    btnClearKey.addEventListener('click', () => {
      localStorage.removeItem(STORAGE_KEYS.GEMINI_KEY);
      cfgGeminiKey.value = '';
      if (apiKeyStatus) apiKeyStatus.textContent = 'Using Built-in Agricultural Fallback Engine (No key required!)';
      playCoinBleep();
    });
  }

  const btnTestSound = document.getElementById('btn-test-sound');
  if (btnTestSound) {
    btnTestSound.addEventListener('click', () => {
      playTractorHorn();
    });
  }

  const btnScreenShake = document.getElementById('btn-screen-shake');
  if (btnScreenShake) {
    btnScreenShake.addEventListener('click', () => {
      triggerScreenShake();
      playAlarm();
    });
  }

  // ========================================================================
  // 13. INITIAL BOOTSTRAP
  // ========================================================================
  function initApp() {
    initRouting();
    setPowerLevel(currentPower);
    updateAuthDisplay(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'bob');
    updateAdvisoryBadgeCount();
    renderDashboardTable();
    renderActiveDbTable();
    if (currentActiveAdvisory) {
      renderAdvisoryResults(currentActiveAdvisory);
    }
    console.log("🌾🚜 AGRI-CYBER-FARM-9000 INITIALIZED SUCCESSFULLY! 🚜🌾");
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
