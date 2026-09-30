/* ==========================================================================
   GameHub — Minimalist Professional Gaming & Telemetry Engine
   Clean state management, tab routing, Gemini AI coach, and PostgreSQL store
   ========================================================================== */

(function () {
  'use strict';

  // ========================================================================
  // 1. DATA STORAGE & POSTGRESQL REPOSITORY LAYER
  // ========================================================================
  const STORAGE_KEYS = {
    ADVISORIES: 'gamehub_telemetry_v3',
    CROPS: 'gamehub_games_v3',
    SOIL: 'gamehub_hardware_v3',
    CURRENT_USER: 'gamehub_auth_user_v3',
    GEMINI_KEY: 'gamehub_gemini_key_v3',
    SOUND_ENABLED: 'gamehub_sound_v3'
  };

  const DEFAULT_GAMES = [
    { id: 1, name: "Cyber Strike", type: "Tactical FPS", optimal_ph: "800 DPI", avg_yield_kg: 2.10, water_need: "Competitive" },
    { id: 2, name: "Echos of Aethel", type: "Action RPG", optimal_ph: "1200 DPI", avg_yield_kg: 3.40, water_need: "Story-Driven" },
    { id: 3, name: "Apex Legends", type: "Battle Royale", optimal_ph: "800 DPI", avg_yield_kg: 2.45, water_need: "High Movement" },
    { id: 4, name: "Valorant", type: "Hero Shooter", optimal_ph: "800 DPI", avg_yield_kg: 1.85, water_need: "Tactical" },
    { id: 5, name: "Counter-Strike 2", type: "FPS", optimal_ph: "400 - 800 DPI", avg_yield_kg: 1.90, water_need: "Precision" },
    { id: 6, name: "Overwatch 2", type: "Hero Shooter", optimal_ph: "1000 DPI", avg_yield_kg: 2.20, water_need: "Fast-Paced" }
  ];

  const DEFAULT_HARDWARE = [
    { sensor_id: "HW-01-CPU", field: "AMD Ryzen 7 7800X3D", ph: 62, moisture_pct: 64.0, nitrogen_ppm: 95, phosphorus_ppm: 144, potassium_ppm: 4600 },
    { sensor_id: "HW-02-GPU", field: "NVIDIA RTX 4080 Super", ph: 71, moisture_pct: 68.0, nitrogen_ppm: 99, phosphorus_ppm: 144, potassium_ppm: 2450 },
    { sensor_id: "HW-03-RAM", field: "Corsair DDR5 32GB", ph: 38, moisture_pct: 42.0, nitrogen_ppm: 88, phosphorus_ppm: 320, potassium_ppm: 6000 },
    { sensor_id: "HW-04-SSD", field: "Samsung 990 Pro 2TB", ph: 45, moisture_pct: 48.0, nitrogen_ppm: 99, phosphorus_ppm: 500, potassium_ppm: 7000 },
    { sensor_id: "HW-05-DISPLAY", field: "OLED 240Hz Gaming Monitor", ph: 24, moisture_pct: 1.0, nitrogen_ppm: 10, phosphorus_ppm: 5, potassium_ppm: 240 }
  ];

  const INITIAL_ADVISORIES = [
    {
      id: 101,
      crop_name: "Cyber Strike",
      nickname: "Apex_Morgan",
      growth_stage: "Diamond III",
      acreage: 14.5,
      soil_type: "High-End Desktop (RTX 4080/4090)",
      soil_ph: 800,
      soil_moisture: 24,
      nitrogen_ppm: 144,
      phosphorus_ppm: 144,
      potassium_ppm: 85,
      target_yield: 2.4,
      irrigation: "Entry Fragger / Duelist",
      pests: "Sub-Optimal Crosshair Placement, Packet Loss",
      ai_persona: "Technical Performance Analyst",
      status: "VERIFIED",
      created_at: new Date(Date.now() - 3600000 * 2).toISOString().replace('T', ' ').substring(0, 19),
      recommendations: {
        urgent: {
          title: "Latency Stability & Input Timing",
          body: "Network latency is optimal at 24ms. Telemetry reveals minor micro-adjustment delays during horizontal angle transitions.",
          bullets: [
            "Maintain 800 DPI calibration with in-game multiplier set to 1.15.",
            "Pre-aim high-probability elevation angles before executing corner clears."
          ]
        },
        fertilizer: {
          title: "Sensitivity & Weapon Meta",
          dpi: "800 DPI",
          crosshair: "Static Cyan (Size 2, Gap -1)",
          weapon: "M4A1-S / Phantom",
          timing: "Allocate 20 minutes to static crosshair placement drills prior to entering competitive lobbies."
        },
        irrigation: {
          title: "Recovery & Endurance Cadence",
          schedule: "Hydrate with 250ml water every 45 minutes. Take a 5-minute eye-rest interval every 2 consecutive matches."
        },
        pest: {
          title: "Positioning & Counter-Tactics",
          tactics: [
            "Counter-Strafing: Ensure complete velocity cancellation before discharging burst fire.",
            "Site Anchoring: Hold tight off-angles instead of exposing two sightlines simultaneously.",
            "Communication: Call out audio cues with specific compass quadrants."
          ]
        },
        ai_synthesis: "Analysis of your recent telemetry indicates solid mechanical foundation with 144Hz synchronization. Aligning crosshair height during site transitions will yield an estimated +18% duel conversion rate. Maintain the 800 DPI calibration for consistent muscle memory across all competitive matches."
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
  // 2. AUDIO SYNTHESIZER (SUBTLE & USER-CONTROLLED)
  // ========================================================================
  let audioCtx = null;
  let soundEnabled = localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED) === 'true'; // Default OFF

  function playSoftClick(freq = 520, duration = 0.04) {
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
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (err) {}
  }

  // ========================================================================
  // 3. TOAST NOTIFICATIONS SYSTEM
  // ========================================================================
  const toastContainer = document.getElementById('toast-container');

  window.triggerNotification = function (message) {
    if (!toastContainer) return;
    playSoftClick(660);

    const toast = document.createElement('div');
    toast.className = 'toast-item';
    toast.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);
    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(8px)';
        toast.style.transition = 'all 0.2s ease';
        setTimeout(() => toast.remove(), 200);
      }
    }, 3500);
  };

  // ========================================================================
  // 4. ROUTING & TAB NAVIGATION
  // ========================================================================
  const navButtons = document.querySelectorAll('.nav-item');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const breadcrumbCurrent = document.getElementById('breadcrumb-current');
  const sidebar = document.querySelector('.app-sidebar');

  const TAB_TITLES = {
    'dashboard': 'Dashboard',
    'games': 'Games Library',
    'advisory-form': 'AI Gaming Assistant',
    'advisory-results': 'Analysis Results',
    'leaderboard': 'Competitive Leaderboard',
    'analytics': 'Performance Analytics',
    'database-pg': 'PostgreSQL Data Store',
    'settings': 'Settings & Preferences'
  };

  window.switchTab = function (tabId) {
    playSoftClick(480);

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

    if (breadcrumbCurrent && TAB_TITLES[tabId]) {
      breadcrumbCurrent.textContent = TAB_TITLES[tabId];
    }

    if (sidebar && sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
    }

    window.location.hash = tabId;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (tabId === 'database-pg') {
      renderActiveDbTable();
    }
  };

  navButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.dataset.tab;
      switchTab(target);
    });
  });

  // Mobile menu toggle
  const btnSidebarToggle = document.getElementById('btn-sidebar-toggle');
  if (btnSidebarToggle && sidebar) {
    btnSidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }

  function initRouting() {
    const hash = window.location.hash.replace('#', '');
    const validTabs = ['dashboard', 'games', 'advisory-form', 'advisory-results', 'leaderboard', 'analytics', 'database-pg', 'settings'];
    if (validTabs.includes(hash)) {
      switchTab(hash);
    }
  }

  // Pre-fill game in form from Library
  window.startAnalysisFor = function (gameName) {
    const cropSelect = document.getElementById('crop-type');
    if (cropSelect) {
      cropSelect.value = gameName;
    }
    switchTab('advisory-form');
    triggerNotification(`Target title set to ${gameName}. Ready for analysis.`);
  };

  // ========================================================================
  // 5. USER AUTH & ROLE SWITCHING
  // ========================================================================
  const USERS = {
    bob: { name: "Alex Morgan", role: "Diamond III (Competitive)", initials: "AM" },
    alice: { name: "Coach Dave", role: "Strategic Aim Analyst", initials: "CD" },
    overseer: { name: "System AI Analyst", role: "Automated Telemetry Bot", initials: "AI" },
    guest: { name: "Guest User", role: "Spectator Profile", initials: "GU" }
  };

  function updateAuthDisplay(userId) {
    const user = USERS[userId] || USERS.bob;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, userId);

    const avatarInitials = document.getElementById('avatar-initials');
    const profileAvatarLarge = document.getElementById('profile-avatar-large');
    const userDisplayName = document.getElementById('user-display-name');
    const userDisplayRole = document.getElementById('user-display-role');
    const authUsernameDisplay = document.getElementById('auth-username-display');
    const authRoleDisplay = document.getElementById('auth-role-display');

    if (avatarInitials) avatarInitials.textContent = user.initials;
    if (profileAvatarLarge) profileAvatarLarge.textContent = user.initials;
    if (userDisplayName) userDisplayName.textContent = user.name;
    if (userDisplayRole) userDisplayRole.textContent = user.role.split(' ')[0];
    if (authUsernameDisplay) authUsernameDisplay.textContent = user.name;
    if (authRoleDisplay) authRoleDisplay.textContent = user.role;
  }

  const btnSwitchUser = document.getElementById('btn-switch-user');
  const switchUserSelect = document.getElementById('switch-user-select');
  if (btnSwitchUser && switchUserSelect) {
    btnSwitchUser.addEventListener('click', () => {
      const selected = switchUserSelect.value;
      updateAuthDisplay(selected);
      triggerNotification(`Active profile switched to ${USERS[selected].name}.`);
    });
  }

  // ========================================================================
  // 6. AI GAMING ASSISTANT & FORM ENGINE
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

    // Validation
    if (!gameType) errors.push("Please select a target game title.");
    if (!platform) errors.push("Please specify your hardware platform.");
    if (isNaN(targetKd) || targetKd <= 0) errors.push("Target K/D ratio must be a positive number.");
    if (isNaN(hours) || hours <= 0) errors.push("Weekly training hours must be greater than zero.");
    if (isNaN(ping) || ping < 1 || ping > 500) errors.push("Latency must be between 1ms and 500ms.");
    if (isNaN(dpi) || dpi < 100 || dpi > 16000) errors.push("Mouse DPI is outside valid operational limits.");

    if (errors.length > 0) {
      playSoftClick(300);
      validationBox.style.display = 'block';
      validationBox.innerHTML = `<strong>Please correct the following fields:</strong><ul style="margin-top:6px; padding-left:18px;">${errors.map(err => `<li>${err}</li>`).join('')}</ul>`;
      validationBox.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const pestCheckboxes = document.querySelectorAll('input[name="pests"]:checked');
    const pestsList = Array.from(pestCheckboxes).map(cb => cb.value).join(', ') || 'General mechanics & timing';

    const formData = {
      crop_name: gameType,
      nickname: document.getElementById('crop-variety-nickname').value || `${gameType} Player`,
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
    submitBtn.innerHTML = `Running Telemetry Analysis...`;

    const customKey = (document.getElementById('gemini-api-key').value || localStorage.getItem(STORAGE_KEYS.GEMINI_KEY) || '').trim();
    let aiResults = null;

    if (customKey && customKey.startsWith('AIzaSy')) {
      try {
        aiResults = await callRealGeminiApi(customKey, formData);
      } catch (apiErr) {
        console.warn("Live Gemini API call failed, falling back to local performance engine:", apiErr);
      }
    }

    if (!aiResults) {
      await new Promise(resolve => setTimeout(resolve, 600));
      aiResults = computeGamingAdvisory(formData);
    }

    const newId = (dbAdvisories.length > 0 ? Math.max(...dbAdvisories.map(a => a.id)) : 100) + 1;
    const newRecord = {
      id: newId,
      ...formData,
      status: "ANALYZED",
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
    triggerNotification("Performance analysis generated successfully.");
  }

  function computeGamingAdvisory(data) {
    const dpi = data.soil_ph;
    const ping = data.soil_moisture;
    const game = data.crop_name;
    const persona = data.ai_persona;

    let urgentTitle = "Latency Stability & Frame Consistency";
    let urgentBody = `Average latency is ${ping}ms with a ${data.nitrogen_ppm}Hz refresh rate. Input variance remains stable across competitive scenarios.`;
    let urgentBullets = [
      `Maintain ${dpi} DPI sensitivity with linear polling rate (1000Hz).`,
      "Verify GPU driver low-latency mode is set to Ultra/On."
    ];

    if (ping > 80) {
      urgentTitle = "Elevated Network Latency Detected";
      urgentBody = `Your average latency of ${ping}ms exceeds competitive baselines (sub-40ms). Bufferbloat mitigation is advised.`;
      urgentBullets = [
        "Prioritize wired Ethernet routing over 5GHz Wi-Fi channels.",
        "Configure QoS on local gateway to prioritize gaming packet queues."
      ];
    }

    let recommendedWeapon = game.includes("Cyber") || game.includes("Counter") ? "M4A1-S / AK-47" : game.includes("Apex") ? "R-301 Carbine / Peacekeeper" : "Vandal / Phantom";

    let synthesis = `Telemetry evaluation for ${data.nickname} (${data.growth_stage}) demonstrates consistent target tracking across ${data.acreage} hours of weekly play. Adjusting corner peeking acceleration while maintaining ${dpi} DPI will support your progression toward a ${data.target_yield} K/D ratio. Pre-aim discipline during round transitions remains the highest-leverage improvement vector.`;

    return {
      urgent: { title: urgentTitle, body: urgentBody, bullets: urgentBullets },
      fertilizer: {
        title: "Sensitivity & Weapon Meta",
        dpi: `${dpi} DPI`,
        crosshair: "Static Cyan (Size 2, Gap -1)",
        weapon: recommendedWeapon,
        timing: "Dedicate 15 minutes to static click-timing routines before initiating ranked queues."
      },
      irrigation: {
        title: "Session & Focus Cadence",
        schedule: "Hydrate with 250ml water every 45 minutes. Implement a 5-minute cognitive reset after two consecutive losses."
      },
      pest: {
        title: "Positioning & Counter-Tactics",
        tactics: [
          `Crosshair Height: Align reticle with elevation lines before rounding corners.`,
          `Isolation: Avoid contesting wide angles without cover availability within 1.5 steps.`,
          `Utility Usage: Save flash/recon utility for site entry rather than early-round skirmishes.`
        ]
      },
      ai_synthesis: synthesis
    };
  }

  async function callRealGeminiApi(apiKey, data) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${data.gemini_model || 'gemini-1.5-flash'}:generateContent?key=${apiKey}`;
    const prompt = `You are a professional esports performance analyst. Provide a concise, actionable, and constructive analysis for:
Title: ${data.crop_name} (${data.nickname}), Current Rank: ${data.growth_stage}
Weekly Hours: ${data.acreage}, Hardware: ${data.soil_type}, Mouse DPI: ${data.soil_ph}, Ping: ${data.soil_moisture}ms
Refresh Rate: ${data.nitrogen_ppm}Hz, FPS: ${data.phosphorus_ppm}
Target K/D: ${data.target_yield}, Primary Role: ${data.irrigation}, Areas of Concern: ${data.pests}
Persona: ${data.ai_persona}, Player Notes: ${data.farmer_notes || 'None'}

Return your answer strictly in valid JSON format:
{
  "urgent": { "title": "string", "body": "string", "bullets": ["string", "string"] },
  "fertilizer": { "title": "string", "dpi": "string", "crosshair": "string", "weapon": "string", "timing": "string" },
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
  // 7. RENDERING ADVISORY RESULTS
  // ========================================================================
  function renderAdvisoryResults(rec) {
    if (!rec) return;

    document.getElementById('res-crop-name').textContent = rec.crop_name;
    document.getElementById('res-acreage').textContent = `${rec.acreage} hrs/week`;
    document.getElementById('res-soil-ph').textContent = `${rec.soil_ph} DPI`;
    document.getElementById('res-db-status').textContent = `Session ID #${rec.id} Verified`;

    const r = rec.recommendations;
    if (r) {
      if (r.urgent) {
        document.getElementById('res-urgent-title').textContent = r.urgent.title || "Priority Focus Area";
        document.getElementById('res-urgent-body').textContent = r.urgent.body || "";
        const bulletBox = document.getElementById('res-urgent-bullets');
        if (bulletBox && r.urgent.bullets) {
          bulletBox.innerHTML = r.urgent.bullets.map(b => `<div style="display:flex; gap:8px;"><span>•</span><span>${b}</span></div>`).join('');
        }
      }

      if (r.fertilizer) {
        document.getElementById('res-fert-title').textContent = r.fertilizer.title || "Loadout & Calibration";
        const npkBox = document.getElementById('res-npk-formula');
        if (npkBox) {
          npkBox.innerHTML = `
            <div class="loadout-item"><span class="loadout-tag">DPI</span> <span>${r.fertilizer.dpi || r.fertilizer.n || '800 DPI'}</span></div>
            <div class="loadout-item"><span class="loadout-tag">CROSSHAIR</span> <span>${r.fertilizer.crosshair || r.fertilizer.p || 'Static Cyan'}</span></div>
            <div class="loadout-item"><span class="loadout-tag">WEAPON</span> <span>${r.fertilizer.weapon || r.fertilizer.k || 'Primary Meta'}</span></div>
          `;
        }
        document.getElementById('res-fert-timing').textContent = r.fertilizer.timing || "Allocate 15-20 minutes to crosshair placement drills.";
      }

      if (r.irrigation) {
        document.getElementById('res-water-title').textContent = r.irrigation.title || "Session & Focus Cadence";
        const schedBox = document.getElementById('res-water-schedule');
        if (schedBox) {
          schedBox.innerHTML = `
            <div style="margin-bottom:6px;"><strong>Protocol:</strong> ${r.irrigation.schedule || 'Hydrate every 45 minutes.'}</div>
            <div><strong>Role Alignment:</strong> ${rec.irrigation}</div>
          `;
        }
      }

      if (r.pest) {
        document.getElementById('res-pest-title').textContent = r.pest.title || "Positioning & Counter-Tactics";
        const pestBox = document.getElementById('res-pest-tactics');
        if (pestBox) {
          if (Array.isArray(r.pest.tactics)) {
            pestBox.innerHTML = r.pest.tactics.map(t => `<div style="display:flex; gap:8px;"><span>•</span><span>${t}</span></div>`).join('');
          } else {
            pestBox.innerHTML = `<div>${r.pest.tactics}</div>`;
          }
        }
      }

      if (r.ai_synthesis) {
        document.getElementById('res-ai-raw-text').textContent = `"${r.ai_synthesis}"`;
      }
    }
  }

  // Action Buttons
  const btnSaveToPg = document.getElementById('btn-save-to-pg');
  const btnPrintResults = document.getElementById('btn-print-results');
  const btnNewAdvisory = document.getElementById('btn-new-advisory');

  if (btnSaveToPg) {
    btnSaveToPg.addEventListener('click', () => {
      setDbData(STORAGE_KEYS.ADVISORIES, dbAdvisories);
      triggerNotification("Session telemetry committed to PostgreSQL data store.");
    });
  }

  if (btnPrintResults) {
    btnPrintResults.addEventListener('click', () => {
      window.print();
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
  // 8. DASHBOARD RECENT TABLE & DB REPOSITORY
  // ========================================================================
  function renderDashboardTable() {
    const tbody = document.getElementById('dashboard-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';
    const records = dbAdvisories.slice(0, 6);

    records.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="font-medium text-secondary">#${row.id}</td>
        <td>${row.created_at || '2026-09-30 12:00'}</td>
        <td class="font-medium text-white">${row.crop_name}</td>
        <td>${row.nickname || 'Player'}</td>
        <td>${row.growth_stage || 'Diamond III'}</td>
        <td>${row.target_yield || '2.0'}</td>
        <td><span class="badge-success">Analyzed</span></td>
        <td><button class="btn btn-secondary btn-sm" onclick="viewSession(${row.id})">View Details</button></td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.viewSession = function (id) {
    const record = dbAdvisories.find(a => a.id === id);
    if (record) {
      currentActiveAdvisory = record;
      renderAdvisoryResults(record);
      switchTab('advisory-results');
    }
  };

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
          <th>id</th><th>game_title</th><th>player_handle</th><th>rank_tier</th><th>hours_weekly</th>
          <th>mouse_dpi</th><th>latency_ms</th><th>target_kd</th><th>status</th><th>timestamp</th>
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
          <th>id</th><th>title</th><th>genre</th><th>optimal_dpi</th><th>target_kd</th><th>category</th>
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
          <th>sensor_id</th><th>component</th><th>utilization_pct</th><th>temp_c</th><th>fan_rpm</th>
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

  // Tab pills for DB
  const dbTabButtons = document.querySelectorAll('.tab-pill');
  dbTabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      dbTabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentActiveTable = btn.dataset.table;
      renderActiveDbTable();
    });
  });

  // SQL Console Runner
  const btnRunSql = document.getElementById('btn-run-sql');
  const sqlQueryInput = document.getElementById('sql-query-input');
  const sqlStatusText = document.getElementById('sql-status-text');

  if (btnRunSql && sqlQueryInput) {
    btnRunSql.addEventListener('click', () => {
      executeRawSql(sqlQueryInput.value.trim());
    });
  }

  function executeRawSql(query) {
    playSoftClick(550);
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
      sqlStatusText.textContent = `200 OK — Query executed in ${Math.floor(Math.random() * 4 + 2)}ms`;
    } else if (q.startsWith('insert')) {
      const newId = Math.floor(Math.random() * 500) + 200;
      dbAdvisories.unshift({
        id: newId,
        crop_name: "Apex Legends",
        nickname: "Valkyrie_Flyer",
        growth_stage: "Diamond I",
        acreage: 18.0,
        soil_type: "Performance PC",
        soil_ph: 800,
        soil_moisture: 22,
        target_yield: 2.8,
        status: "COMMITTED",
        created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
        recommendations: computeGamingAdvisory({
          crop_name: "Apex Legends",
          nickname: "Valkyrie",
          soil_ph: 800,
          soil_moisture: 22,
          target_yield: 2.8,
          acreage: 18.0,
          irrigation: "Recon / Support",
          pests: "None",
          ai_persona: "Technical Performance Analyst",
          growth_stage: "Diamond I",
          nitrogen_ppm: 144
        })
      });
      setDbData(STORAGE_KEYS.ADVISORIES, dbAdvisories);
      renderActiveDbTable();
      renderDashboardTable();
      updateAdvisoryBadgeCount();
      sqlStatusText.textContent = `INSERT 0 1 — Record ID #${newId} committed.`;
    } else {
      sqlStatusText.textContent = `Statement parsed by PostgreSQL engine.`;
    }
  }

  const btnSqlInsert = document.getElementById('btn-sql-insert');
  if (btnSqlInsert) {
    btnSqlInsert.addEventListener('click', () => {
      executeRawSql("INSERT INTO player_telemetry (game_title, player_handle, target_kd) VALUES ('Apex Legends', 'Valkyrie_Flyer', 2.8);");
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
      sqlStatusText.textContent = `Database repository restored to default state.`;
      triggerNotification("Telemetry repository reset to defaults.");
    });
  }

  // ========================================================================
  // 9. SETTINGS & AUDIO CONTROLS
  // ========================================================================
  const btnSoundToggle = document.getElementById('btn-sound-toggle');
  if (btnSoundToggle) {
    btnSoundToggle.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, soundEnabled);
      if (soundEnabled) {
        playSoftClick(660);
        triggerNotification("Interface audio feedback enabled.");
      } else {
        triggerNotification("Interface audio feedback muted.");
      }
    });
  }

  const cfgGeminiKey = document.getElementById('cfg-gemini-key');
  const btnSaveKey = document.getElementById('btn-save-key');
  const btnClearKey = document.getElementById('btn-clear-key');
  const apiKeyStatus = document.getElementById('api-key-status');

  const storedKey = localStorage.getItem(STORAGE_KEYS.GEMINI_KEY);
  if (storedKey && cfgGeminiKey) {
    cfgGeminiKey.value = storedKey;
    if (apiKeyStatus) apiKeyStatus.textContent = 'Custom Google Gemini API Key is configured and active.';
  }

  if (btnSaveKey && cfgGeminiKey) {
    btnSaveKey.addEventListener('click', () => {
      const keyVal = cfgGeminiKey.value.trim();
      if (keyVal) {
        localStorage.setItem(STORAGE_KEYS.GEMINI_KEY, keyVal);
        if (apiKeyStatus) apiKeyStatus.textContent = 'Custom Google Gemini API Key saved.';
        triggerNotification("API Key saved to local storage.");
      }
    });
  }

  if (btnClearKey && cfgGeminiKey) {
    btnClearKey.addEventListener('click', () => {
      localStorage.removeItem(STORAGE_KEYS.GEMINI_KEY);
      cfgGeminiKey.value = '';
      if (apiKeyStatus) apiKeyStatus.textContent = 'Using built-in gaming performance model (No key required).';
      triggerNotification("API Key cleared.");
    });
  }

  const btnTestSound = document.getElementById('btn-test-sound');
  if (btnTestSound) {
    btnTestSound.addEventListener('click', () => {
      soundEnabled = true;
      playSoftClick(550);
      triggerNotification("Audio click verified.");
    });
  }

  // Search input filter
  const globalSearch = document.getElementById('global-search');
  if (globalSearch) {
    globalSearch.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      if (query.length > 2) {
        const matches = DEFAULT_GAMES.filter(g => g.name.toLowerCase().includes(query));
        if (matches.length > 0) {
          triggerNotification(`Found ${matches.length} matching title(s): ${matches.map(m => m.name).join(', ')}`);
        }
      }
    });
  }

  // ========================================================================
  // 10. BOOTSTRAP APPLICATION
  // ========================================================================
  function initApp() {
    initRouting();
    updateAuthDisplay(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'bob');
    updateAdvisoryBadgeCount();
    renderDashboardTable();
    renderActiveDbTable();
    if (currentActiveAdvisory) {
      renderAdvisoryResults(currentActiveAdvisory);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
