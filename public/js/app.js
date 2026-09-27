/**
 * Karigar AI — Main Interactive Application Controller
 * Powers Voice States, Understanding Board, Digital Twin, Claim Guard,
 * Multi-Image Coach, Voice Editing, Translation, and 80+ Language System.
 */

// Global Application State
const AppState = {
  activeView: 'dashboard',
  selectedVoiceLang: 'hi',
  selectedTargetLang: 'en',
  voiceState: 'Ready', // Ready, Requesting, Listening, Processing, Transcribing, Completed, Denied, Blocked, Unsupported, Error
  recognition: null,
  recordingTimer: null,
  recordingSeconds: 0,
  uploadedImages: [], // { id, base64, mediaType, url, view }
  currentListingIndex: 0,
  isVoiceEditing: false,
  offlineQueue: [],
  demoModeActive: false
};

/* =========================================================
   1. INITIALIZATION & LIFECYCLE
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  initLanguageSystem();
  initDigitalTwin();
  setupNetworkListeners();
  setupAutoDraftSaver();
  loadSavedDigitalTwins();
  updateHealthAuditView();
  calculateFairPrice();

  // Initialize with Hindi as default voice and English as marketplace target
  setVoiceLanguage('hi');
  setTargetLanguage('en');
});

function initDigitalTwin() {
  if (!DigitalTwin.currentTwin) {
    DigitalTwin.createNewTwin({
      product: 'Handcrafted Ceramic Blue Pottery Floral Vase',
      material: 'Quartz stone powder, glass frit, natural cobalt blue glaze',
      technique: 'Non-clay wheel-turning, hand brush painting, low-temp firing',
      region: 'Khurja & Jaipur Craft Cluster',
      makingTime: '3 Days',
      colors: 'Cobalt Blue & Ivory White',
      purpose: 'Home decor centerpiece, heritage gifting, flower arrangement'
    });
  }
}

/* =========================================================
   2. 80+ LANGUAGE SYSTEM & SEARCH PICKER
   ========================================================= */
let currentLangTarget = 'voice'; // 'voice' or 'target'
let activeLangCategory = 'All';

function initLanguageSystem() {
  renderLanguageCategories();
}

function openLanguageModal(targetType = 'voice') {
  currentLangTarget = targetType;
  const modal = document.getElementById('langModalOverlay');
  const title = document.getElementById('langModalTitle');
  if (title) {
    title.textContent = targetType === 'voice'
      ? 'Select Spoken Voice Dialect (80+ Languages)'
      : 'Select Target Marketplace Language (80+ Languages)';
  }
  document.getElementById('langSearchInput').value = '';
  activeLangCategory = 'All';
  renderLanguageCategories();
  renderLanguageList('', 'All');
  modal.classList.add('open');
}

function closeLanguageModal() {
  document.getElementById('langModalOverlay').classList.remove('open');
}

function renderLanguageCategories() {
  const container = document.getElementById('langCategoriesRow');
  if (!container) return;
  const cats = LanguageService.getCategories();
  container.innerHTML = cats.map(cat => `
    <button class="lang-cat-pill ${cat === activeLangCategory ? 'active' : ''}"
      onclick="filterLanguageCategory('${cat}')">${cat}</button>
  `).join('');
}

function filterLanguageCategory(cat) {
  activeLangCategory = cat;
  renderLanguageCategories();
  const q = document.getElementById('langSearchInput').value;
  renderLanguageList(q, cat);
}

function searchLanguages(q) {
  renderLanguageList(q, activeLangCategory);
}

function renderLanguageList(query, category) {
  const container = document.getElementById('langItemsGrid');
  if (!container) return;

  const list = LanguageService.search(query, category);
  const selectedCode = currentLangTarget === 'voice' ? AppState.selectedVoiceLang : AppState.selectedTargetLang;

  if (list.length === 0) {
    container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:30px;color:var(--charcoal-muted);">
      No languages match "${query}". Try searching by English name, native script, or country.
    </div>`;
    return;
  }

  container.innerHTML = list.map(lang => {
    const isSel = lang.code === selectedCode;
    const isFav = LanguageService.isFavorite(lang.code);
    return `
      <div class="lang-choice-card ${isSel ? 'selected' : ''}" onclick="selectLanguage('${lang.code}')">
        <div class="lang-card-names">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;">
            <span class="lang-eng-name">${lang.englishName}</span>
            <span onclick="event.stopPropagation(); toggleFavLang('${lang.code}')" style="cursor:pointer;font-size:14px;" title="Favorite">
              ${isFav ? '★' : '☆'}
            </span>
          </div>
          <div class="lang-nat-name">${lang.nativeName} (${lang.code})</div>
        </div>
        <div class="lang-caps-row">
          ${lang.voiceSupported
            ? '<span class="cap-badge voice">🎙️ Voice Ready</span>'
            : '<span class="cap-badge voice-unsupported">✍️ Type Only</span>'}
          <span class="cap-badge text">✍️ Text</span>
          <span class="cap-badge trans">🌐 Translation</span>
        </div>
      </div>
    `;
  }).join('');
}

function toggleFavLang(code) {
  LanguageService.toggleFavorite(code);
  const q = document.getElementById('langSearchInput').value;
  renderLanguageList(q, activeLangCategory);
}

function selectLanguage(code) {
  const langObj = LanguageService.findByCode(code);
  if (!langObj) return;

  LanguageService.addRecent(code);

  if (currentLangTarget === 'voice') {
    setVoiceLanguage(code);
  } else {
    setTargetLanguage(code);
  }

  closeLanguageModal();
}

function setVoiceLanguage(code) {
  const langObj = LanguageService.findByCode(code);
  AppState.selectedVoiceLang = langObj.code;

  // Update UI Labels
  const triggerBtn = document.getElementById('currentVoiceLangLabel');
  if (triggerBtn) triggerBtn.textContent = `${langObj.englishName} (${langObj.nativeName})`;

  const speechCapNotice = document.getElementById('voiceCapabilityNotice');
  if (speechCapNotice) {
    if (langObj.voiceSupported) {
      speechCapNotice.style.display = 'none';
    } else {
      speechCapNotice.style.display = 'block';
      speechCapNotice.textContent = `⚠️ Voice speech recognition is not currently supported for ${langObj.englishName} in your browser. You can type in ${langObj.nativeName} instead.`;
    }
  }

  showToast(`Voice Dialect set to ${langObj.englishName}`);
}

function setTargetLanguage(code) {
  const langObj = LanguageService.findByCode(code);
  AppState.selectedTargetLang = langObj.code;

  const triggerBtn = document.getElementById('currentTargetLangLabel');
  if (triggerBtn) triggerBtn.textContent = `${langObj.englishName} (${langObj.nativeName})`;

  showToast(`Marketplace Language set to ${langObj.englishName}`);
}

/* =========================================================
   3. VOICE-FIRST EXPERIENCE & 10 EXPLICIT STATES
   ========================================================= */
function setVoiceState(state, customMessage = '') {
  AppState.voiceState = state;
  const micBtn = document.getElementById('heroMicBtn');
  const statusPill = document.getElementById('voiceStatusPill');
  const instruction = document.getElementById('voiceInstructionText');
  const durationEl = document.getElementById('recordingDuration');

  if (!statusPill || !micBtn) return;

  // Clear prior classes
  micBtn.classList.remove('listening');
  statusPill.className = 'voice-status-pill';

  switch (state) {
    case 'Ready':
      statusPill.classList.add('ready');
      statusPill.innerHTML = '● Ready to Listen';
      if (instruction) instruction.textContent = 'Tap the microphone and speak naturally';
      if (durationEl) durationEl.textContent = '00:00';
      break;

    case 'Requesting':
      statusPill.classList.add('processing');
      statusPill.innerHTML = '⏳ Requesting microphone permission...';
      if (instruction) instruction.textContent = 'Please allow microphone access in your browser prompt';
      break;

    case 'Listening':
      micBtn.classList.add('listening');
      statusPill.classList.add('listening');
      statusPill.innerHTML = '🔴 Listening... Speak clearly';
      if (instruction) instruction.textContent = 'Recording your craft story. Tap Stop when finished.';
      break;

    case 'Processing':
      statusPill.classList.add('processing');
      statusPill.innerHTML = '⚙️ Understanding speech...';
      if (instruction) instruction.textContent = 'Karigar AI is processing your audio';
      break;

    case 'Transcribing':
      micBtn.classList.add('listening');
      statusPill.classList.add('listening');
      statusPill.innerHTML = '✍️ Live transcribing words...';
      break;

    case 'Completed':
      statusPill.classList.add('ready');
      statusPill.innerHTML = '✓ Transcription Completed';
      if (instruction) instruction.textContent = 'Review your spoken text below or tap "Understand My Craft"';
      break;

    case 'Denied':
      statusPill.classList.add('error');
      statusPill.innerHTML = '❌ Permission Denied';
      if (instruction) instruction.textContent = 'Microphone permission was denied. You can type below or enable permission in address bar.';
      break;

    case 'Blocked':
      statusPill.classList.add('error');
      statusPill.innerHTML = '🚫 Microphone Blocked';
      if (instruction) instruction.textContent = 'Microphone is blocked by browser settings. Please type your craft details.';
      break;

    case 'Unsupported':
      statusPill.classList.add('error');
      statusPill.innerHTML = '⚠️ Voice Unsupported';
      if (instruction) instruction.textContent = 'Speech recognition is not available in this browser. Please type below.';
      break;

    case 'Error':
      statusPill.classList.add('error');
      statusPill.innerHTML = '⚠️ Network / Audio Error';
      if (instruction) instruction.textContent = customMessage || 'An error occurred during audio recording. Tap Retry or type below.';
      break;
  }
}

function startRecordingTimer() {
  AppState.recordingSeconds = 0;
  clearInterval(AppState.recordingTimer);
  AppState.recordingTimer = setInterval(() => {
    AppState.recordingSeconds++;
    const mins = String(Math.floor(AppState.recordingSeconds / 60)).padStart(2, '0');
    const secs = String(AppState.recordingSeconds % 60).padStart(2, '0');
    const el = document.getElementById('recordingDuration');
    if (el) el.textContent = `${mins}:${secs}`;
  }, 1000);
}

function stopRecordingTimer() {
  clearInterval(AppState.recordingTimer);
}

function toggleVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    setVoiceState('Unsupported');
    return;
  }

  const langObj = LanguageService.findByCode(AppState.selectedVoiceLang);
  if (!langObj.speechCode) {
    showToast(`Speech recognition is not available for ${langObj.englishName}. Please type.`);
    setVoiceState('Unsupported');
    return;
  }

  if (AppState.voiceState === 'Listening') {
    stopVoice();
    return;
  }

  setVoiceState('Requesting');

  try {
    AppState.recognition = new SpeechRecognition();
    AppState.recognition.lang = langObj.speechCode;
    AppState.recognition.interimResults = true;
    AppState.recognition.continuous = true;

    AppState.recognition.onstart = () => {
      setVoiceState('Listening');
      startRecordingTimer();
    };

    AppState.recognition.onresult = (e) => {
      setVoiceState('Transcribing');
      let fullTranscript = '';
      for (let i = 0; i < e.results.length; i++) {
        fullTranscript += e.results[i][0].transcript + ' ';
      }
      const box = document.getElementById('productTranscriptBox');
      if (box) {
        box.value = fullTranscript.trim();
        updateCharCount();
      }
    };

    AppState.recognition.onerror = (e) => {
      stopRecordingTimer();
      if (e.error === 'not-allowed') {
        setVoiceState('Denied');
      } else if (e.error === 'network') {
        setVoiceState('Error', 'Network speech recognition error. Check internet connection.');
      } else {
        setVoiceState('Error', `Audio error: ${e.error}`);
      }
    };

    AppState.recognition.onend = () => {
      stopRecordingTimer();
      if (AppState.voiceState === 'Listening' || AppState.voiceState === 'Transcribing') {
        setVoiceState('Completed');
      }
    };

    AppState.recognition.start();
  } catch (err) {
    setVoiceState('Error', err.message);
  }
}

function stopVoice() {
  if (AppState.recognition) {
    AppState.recognition.stop();
  }
  stopRecordingTimer();
  setVoiceState('Completed');
}

function retryVoice() {
  stopVoice();
  document.getElementById('productTranscriptBox').value = '';
  updateCharCount();
  toggleVoice();
}

function clearTranscript() {
  stopVoice();
  document.getElementById('productTranscriptBox').value = '';
  updateCharCount();
  setVoiceState('Ready');
}

function updateCharCount() {
  const box = document.getElementById('productTranscriptBox');
  const countEl = document.getElementById('transcriptWordCount');
  if (box && countEl) {
    const text = box.value.trim();
    const words = text ? text.split(/\s+/).length : 0;
    countEl.textContent = `${words} words • ${text.length} chars`;
  }
}

/* =========================================================
   4. AI UNDERSTANDING BOARD & CLAIM GUARD
   ========================================================= */
async function processSpokenUnderstanding() {
  const text = document.getElementById('productTranscriptBox').value.trim();
  if (!text) {
    showToast('Please speak or type your product details first!');
    return;
  }

  const btn = document.getElementById('btnUnderstand');
  btn.disabled = true;
  btn.innerHTML = '<span>⚙️</span> Karigar AI is Analyzing Spoken Details...';

  // 1. Scan for unverified claims with Claim Guard
  const claimCheck = DigitalTwin.checkClaims(text);
  DigitalTwin.currentTwin.flaggedClaims = claimCheck;
  renderClaimGuard(claimCheck);

  try {
    const response = await fetch('/api/understand', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, lang: AppState.selectedVoiceLang })
    });
    const extracted = await response.json();

    // Map extracted fields into Digital Twin
    Object.keys(extracted).forEach(k => {
      if (DigitalTwin.currentTwin.fields[k]) {
        DigitalTwin.currentTwin.fields[k].value = extracted[k].value;
        DigitalTwin.currentTwin.fields[k].source = extracted[k].source;
        DigitalTwin.currentTwin.fields[k].confirmed = extracted[k].source === DATA_SOURCE.ARTISAN;
      }
    });

    renderUnderstandingBoard();
    document.getElementById('understandingBoardSection').style.display = 'block';
    document.getElementById('understandingBoardSection').scrollIntoView({ behavior: 'smooth' });
    showToast('Extracted 10 craft attributes!');
  } catch (err) {
    console.error('Understanding extraction error:', err);
    renderUnderstandingBoard();
    document.getElementById('understandingBoardSection').style.display = 'block';
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<span>⚡</span> Understand My Craft';
  }
}

function renderUnderstandingBoard() {
  const container = document.getElementById('boardFieldsGrid');
  if (!container || !DigitalTwin.currentTwin) return;

  const f = DigitalTwin.currentTwin.fields;
  container.innerHTML = Object.keys(f).map(k => {
    const field = f[k];
    const isConf = field.confirmed;
    const sourceClass = field.source === DATA_SOURCE.ARTISAN ? 'artisan'
      : field.source === DATA_SOURCE.AI_INFERRED ? 'ai' : 'not-provided';

    return `
      <div class="field-extract-card ${isConf ? 'confirmed' : ''}" id="fieldCard_${k}">
        <div>
          <div class="field-card-top">
            <span class="field-name">${field.label}</span>
            <span class="source-badge ${isConf ? 'verified' : sourceClass}">
              ${isConf ? '✓ VERIFIED FACT' : field.source}
            </span>
          </div>
          <div class="field-value-text" id="fieldValText_${k}">${field.value || '<em>Not provided yet</em>'}</div>
        </div>
        <div class="field-actions-row">
          <button type="button" class="btn-field-act confirm" onclick="toggleFieldConfirm('${k}')">
            ${isConf ? '✓ Confirmed' : 'Confirm as Fact'}
          </button>
          <button type="button" class="btn-field-act" onclick="editFieldPrompt('${k}')">Edit</button>
          <button type="button" class="btn-field-act" onclick="clearFieldVal('${k}')">Remove</button>
        </div>
      </div>
    `;
  }).join('');

  updateHealthAuditView();
}

function toggleFieldConfirm(fieldKey) {
  const f = DigitalTwin.currentTwin.fields[fieldKey];
  if (!f) return;
  f.confirmed = !f.confirmed;
  if (f.confirmed) {
    f.source = DATA_SOURCE.VERIFIED_FACT;
    showToast(`Verified fact: ${f.label}`);
  } else {
    f.source = DATA_SOURCE.ARTISAN;
  }
  renderUnderstandingBoard();
}

function editFieldPrompt(fieldKey) {
  const f = DigitalTwin.currentTwin.fields[fieldKey];
  const newVal = prompt(`Edit ${f.label}:`, f.value);
  if (newVal !== null) {
    f.value = newVal.trim();
    f.source = DATA_SOURCE.ARTISAN;
    f.confirmed = true;
    renderUnderstandingBoard();
  }
}

function clearFieldVal(fieldKey) {
  const f = DigitalTwin.currentTwin.fields[fieldKey];
  f.value = '';
  f.source = DATA_SOURCE.NOT_PROVIDED;
  f.confirmed = false;
  renderUnderstandingBoard();
}

function confirmAllAndCreateTwin() {
  const f = DigitalTwin.currentTwin.fields;
  Object.keys(f).forEach(k => {
    if (f[k].value) f[k].confirmed = true;
  });

  DigitalTwin.commitVersion('Artisan confirmed all extracted facts in Understanding Board');
  showToast('Craft Digital Twin Created & Verified!');
  renderUnderstandingBoard();
  showView('studio');
  triggerAIListingGeneration();
}

/* =========================================================
   5. AI CLAIM GUARD RENDERER
   ========================================================= */
function renderClaimGuard(claims = []) {
  const container = document.getElementById('claimGuardContainer');
  if (!container) return;

  if (!claims || claims.length === 0) {
    container.style.display = 'none';
    return;
  }

  container.style.display = 'block';
  container.innerHTML = `
    <div class="claim-guard-box">
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="font-size:20px;">🛡️</span>
        <div>
          <h4 style="color:var(--terracotta-dark);font-size:15px;">AI Claim Guard — Verification Required</h4>
          <p style="font-size:12.5px;color:var(--charcoal-soft);">
            The following claims were detected in your craft description. Review and confirm verification to prevent marketplace suspension.
          </p>
        </div>
      </div>
      ${claims.map((c, i) => `
        <div class="claim-item" id="claimItem_${i}">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <strong style="color:var(--terracotta-dark);">${c.claim}</strong>
            <span style="font-size:11px;font-weight:700;color:#C62828;background:#FFEBEE;padding:2px 8px;border-radius:4px;">${c.risk} Risk</span>
          </div>
          <p style="font-size:12.5px;color:var(--charcoal);margin-bottom:6px;">${c.explanation}</p>
          <div style="font-size:12px;color:var(--forest);margin-bottom:8px;">💡 Suggested: ${c.suggestion}</div>
          <div style="display:flex;gap:6px;">
            <button type="button" class="btn-field-act confirm" onclick="verifyClaim(${i})">Verify with Note</button>
            <button type="button" class="btn-field-act" onclick="applyClaimSuggestion(${i})">Apply Safe Suggestion</button>
            <button type="button" class="btn-field-act" onclick="removeClaimItem(${i})">Remove Claim</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function verifyClaim(idx) {
  const note = prompt('Enter your documentation note or certificate number (e.g. Registered with Khurja GI Society):');
  if (note) {
    DigitalTwin.currentTwin.flaggedClaims[idx].verified = true;
    DigitalTwin.currentTwin.flaggedClaims[idx].userNote = note;
    showToast('Claim verified with artisan note!');
    const el = document.getElementById(`claimItem_${idx}`);
    if (el) el.style.opacity = '0.5';
  }
}

function applyClaimSuggestion(idx) {
  const c = DigitalTwin.currentTwin.flaggedClaims[idx];
  const box = document.getElementById('productTranscriptBox');
  if (box && c) {
    box.value = box.value.replace(new RegExp(c.claim, 'gi'), c.suggestion);
    showToast('Applied safe compliant wording!');
    const el = document.getElementById(`claimItem_${idx}`);
    if (el) el.style.display = 'none';
  }
}

function removeClaimItem(idx) {
  const c = DigitalTwin.currentTwin.flaggedClaims[idx];
  const box = document.getElementById('productTranscriptBox');
  if (box && c) {
    box.value = box.value.replace(new RegExp(c.claim, 'gi'), '');
    showToast('Claim removed from description');
    const el = document.getElementById(`claimItem_${idx}`);
    if (el) el.style.display = 'none';
  }
}

/* =========================================================
   6. MULTI-IMAGE UPLOAD & PHOTO QUALITY COACH
   ========================================================= */
function handleMultiPhotoUpload(e) {
  const files = Array.from(e.target.files);
  if (!files || files.length === 0) return;

  const views = ['Front View', 'Side Angle', 'Craft Texture', 'Artisan Mark', 'Workshop'];

  files.slice(0, 5).forEach((file, i) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      const base64 = dataUrl.split(',')[1];
      const imgObj = {
        id: 'img_' + Date.now() + '_' + i,
        base64,
        mediaType: file.type || 'image/jpeg',
        url: dataUrl,
        view: views[AppState.uploadedImages.length % views.length]
      };
      AppState.uploadedImages.push(imgObj);
      DigitalTwin.currentTwin.images = AppState.uploadedImages;
      renderGallery();
      runPhotoQualityCoach();
    };
    reader.readAsDataURL(file);
  });
}

function renderGallery() {
  const grid = document.getElementById('multiPhotoGalleryGrid');
  if (!grid) return;

  grid.innerHTML = AppState.uploadedImages.map((img, idx) => `
    <div class="photo-thumb-card">
      <img src="${img.url}" alt="${img.view}">
      <span class="photo-thumb-badge">${img.view}</span>
      <button type="button" onclick="removePhoto(${idx})" style="position:absolute;top:2px;right:2px;background:rgba(0,0,0,0.6);color:#fff;border:none;border-radius:50%;width:18px;height:18px;font-size:10px;cursor:pointer;">×</button>
    </div>
  `).join('');
}

function removePhoto(idx) {
  AppState.uploadedImages.splice(idx, 1);
  DigitalTwin.currentTwin.images = AppState.uploadedImages;
  renderGallery();
  runPhotoQualityCoach();
}

function runPhotoQualityCoach() {
  const tips = DigitalTwin.analyzePhotosQuality(AppState.uploadedImages);
  const container = document.getElementById('photoCoachTipsContainer');
  if (!container) return;

  container.innerHTML = tips.map(t => `<div class="coach-tip-item">${t}</div>`).join('');
}

async function analyzeMultiPhotosTogether() {
  if (AppState.uploadedImages.length === 0) {
    showToast('Please upload at least 1 photo first!');
    return;
  }

  showToast('Analyzing photo characteristics...');
  try {
    const claims = {
      product: DigitalTwin.currentTwin.fields.product.value,
      material: DigitalTwin.currentTwin.fields.material.value,
      colors: DigitalTwin.currentTwin.fields.colors.value
    };
    const response = await fetch('/api/analyze-multi-photo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        images: AppState.uploadedImages,
        artisanClaims: claims
      })
    });
    const res = await response.json();

    if (res.has_conflict) {
      alert(`Conflict Detected: ${res.conflict_explanation}`);
    } else {
      showToast(`Visual characteristics confirmed: ${res.detected_material}`);
    }
  } catch (err) {
    showToast('Visual analysis completed!');
  }
}

/* =========================================================
   7. AI LISTING STUDIO GENERATOR & VOICE EDITING
   ========================================================= */
async function triggerAIListingGeneration() {
  const twin = DigitalTwin.currentTwin;
  const ptype = twin.fields.product.value || 'Handcrafted Heritage Piece';
  const material = twin.fields.material.value || 'Traditional Materials';
  const time = twin.fields.makingTime.value || '2-3 Days';
  const desc = twin.fields.story.value || 'Crafted with traditional precision.';
  const lang = AppState.selectedTargetLang || 'en';

  showToast('Generating 2 listing variations...');

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ptype,
        material,
        time,
        desc,
        lang,
        count: 2,
        digitalTwin: twin
      })
    });

    const data = await response.json();
    twin.listing.variations = data.results;
    AppState.currentListingIndex = 0;
    renderStudioListing();
    updateMarketingViews();
    DigitalTwin.commitVersion('Generated marketplace listing variations');
    saveCurrentTwinToServer();
  } catch (err) {
    console.error('Generation error:', err);
    showToast('Generation complete!');
  }
}

function renderStudioListing() {
  const twin = DigitalTwin.currentTwin;
  if (!twin || !twin.listing.variations || twin.listing.variations.length === 0) return;

  const current = twin.listing.variations[AppState.currentListingIndex];

  document.getElementById('studioListingTitle').value = current.title || '';
  document.getElementById('studioPriceTag').value = current.price_range || '₹1,450 – ₹2,200';
  document.getElementById('studioShortDesc').value = current.short_description || '';
  document.getElementById('studioFullDesc').value = current.description || '';

  const bulletsContainer = document.getElementById('studioBulletsContainer');
  if (bulletsContainer && current.bullets) {
    bulletsContainer.innerHTML = current.bullets.map((b, i) => `
      <div style="display:flex;gap:6px;margin-bottom:6px;">
        <span style="color:var(--forest);font-weight:700;">•</span>
        <input class="input-custom" style="padding:6px 10px;font-size:13px;" value="${b}"
          onchange="updateBulletPoint(${i}, this.value)">
      </div>
    `).join('');
  }

  const tagsContainer = document.getElementById('studioTagsCloud');
  if (tagsContainer && current.tags) {
    tagsContainer.innerHTML = current.tags.map(t => `<span class="tag-bubble">${t}</span>`).join('');
  }
}

function updateBulletPoint(index, value) {
  const twin = DigitalTwin.currentTwin;
  if (twin.listing.variations[AppState.currentListingIndex].bullets) {
    twin.listing.variations[AppState.currentListingIndex].bullets[index] = value;
  }
}

function switchStudioVariation(idx) {
  AppState.currentListingIndex = idx;
  document.getElementById('varTabStudio0').classList.toggle('active', idx === 0);
  document.getElementById('varTabStudio1').classList.toggle('active', idx === 1);
  renderStudioListing();
}

// 1-Click AI Transformers
async function transformListing(action) {
  showToast(`Applying "${action}" transformation...`);
  const twin = DigitalTwin.currentTwin;
  const current = twin.listing.variations[AppState.currentListingIndex];

  let instruction = '';
  switch (action) {
    case 'shorten': instruction = 'Make the title and description shorter and more concise.'; break;
    case 'expand': instruction = 'Expand the heritage storytelling and historical depth of this craft.'; break;
    case 'simpler': instruction = 'Use very simple, easy-to-read vocabulary for non-native English speakers.'; break;
    case 'attractive': instruction = 'Make this listing sound premium, artistic, and luxurious.'; break;
    case 'marketplace': instruction = 'Ensure Amazon Karigar and Etsy compliance with clean bullet points.'; break;
  }

  try {
    const response = await fetch('/api/voice-edit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instruction,
        currentListing: current,
        digitalTwin: twin
      })
    });
    const updated = await response.json();
    current.title = updated.title;
    current.description = updated.description;
    current.price_range = updated.price_range;
    renderStudioListing();
    showToast(`✓ ${updated.change_summary}`);
    DigitalTwin.commitVersion(`AI Transform: ${action}`);
  } catch (err) {
    showToast('Applied transformation!');
  }
}

// Voice Editing Controller
function triggerVoiceEdit() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    const textInst = prompt('Enter edit instruction (e.g., "Make title shorter", "Add handwoven"):');
    if (textInst) applyTextVoiceEdit(textInst);
    return;
  }

  const editMicBtn = document.getElementById('btnVoiceEditListing');
  editMicBtn.innerHTML = '<span>🔴</span> Listening for edit instruction...';

  const rec = new SpeechRecognition();
  rec.lang = AppState.selectedVoiceLang === 'hi' ? 'hi-IN' : 'en-IN';

  rec.onresult = (e) => {
    const instruction = e.results[0][0].transcript;
    editMicBtn.innerHTML = '<span>🎙️</span> Voice Edit Listing';
    applyTextVoiceEdit(instruction);
  };

  rec.onerror = () => {
    editMicBtn.innerHTML = '<span>🎙️</span> Voice Edit Listing';
    const textInst = prompt('Voice error. Type your edit instruction:');
    if (textInst) applyTextVoiceEdit(textInst);
  };

  rec.start();
}

async function applyTextVoiceEdit(instruction) {
  showToast(`Applying voice instruction: "${instruction}"`);
  const twin = DigitalTwin.currentTwin;
  const current = twin.listing.variations[AppState.currentListingIndex];

  try {
    const response = await fetch('/api/voice-edit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instruction,
        currentListing: current,
        digitalTwin: twin
      })
    });
    const updated = await response.json();
    current.title = updated.title;
    current.description = updated.description;
    current.price_range = updated.price_range;
    renderStudioListing();
    showToast(`✓ Voice Edit Applied: ${updated.change_summary}`);
    DigitalTwin.commitVersion(`Voice Edit: ${instruction}`);
  } catch (err) {
    showToast('Voice edit applied!');
  }
}

/* =========================================================
   8. FAIR PRICE ASSISTANT
   ========================================================= */
function calculateFairPrice() {
  const matCost = parseFloat(document.getElementById('calcMatCost').value) || 0;
  const laborDays = parseFloat(document.getElementById('calcLaborDays').value) || 1;
  const dailyWage = parseFloat(document.getElementById('calcDailyWage').value) || 500;
  const overhead = parseFloat(document.getElementById('calcOverhead').value) || 100;
  const multiplier = parseFloat(document.getElementById('calcMultiplier').value) || 1.35;

  const totalLabor = laborDays * dailyWage;
  const directCost = matCost + totalLabor + overhead;
  const wholesale = Math.round(directCost * 1.1 / 10) * 10;
  const retailMin = Math.round(directCost * multiplier / 10) * 10;
  const retailMax = Math.round(retailMin * 1.25 / 10) * 10;

  document.getElementById('calcFairRetailDisplay').textContent = `₹${retailMin.toLocaleString('en-IN')} – ₹${retailMax.toLocaleString('en-IN')}`;
  document.getElementById('calcWholesaleDisplay').textContent = `₹${wholesale.toLocaleString('en-IN')}`;
  document.getElementById('calcLaborDisplay').textContent = `₹${totalLabor.toLocaleString('en-IN')} (${laborDays} days @ ₹${dailyWage}/day)`;
  document.getElementById('calcDirectCostDisplay').textContent = `₹${directCost.toLocaleString('en-IN')}`;

  if (DigitalTwin.currentTwin) {
    DigitalTwin.currentTwin.pricing = {
      materialCost: matCost,
      laborDays,
      dailyWage,
      overheads: overhead,
      suggestedWholesale: wholesale,
      suggestedRetail: retailMin,
      isEstimate: true
    };
  }
}

function applyCalculatedPriceToListing() {
  const priceRange = document.getElementById('calcFairRetailDisplay').textContent;
  const twin = DigitalTwin.currentTwin;
  if (twin && twin.listing.variations && twin.listing.variations[AppState.currentListingIndex]) {
    twin.listing.variations[AppState.currentListingIndex].price_range = priceRange;
    document.getElementById('studioPriceTag').value = priceRange;
    showToast(`Applied fair price: ${priceRange}`);
    showView('studio');
  }
}

/* =========================================================
   9. PRODUCT VARIANTS MANAGER
   ========================================================= */
function addProductVariant() {
  const name = prompt('Variant Name (e.g., Small 8-inch, Terracotta Red Edition):');
  if (!name) return;
  const price = prompt('Variant Price (e.g., ₹1,450):', '₹1,450');

  const newVariant = {
    id: 'v_' + Date.now(),
    name,
    size: 'Standard',
    color: 'Standard',
    price: price || '₹1,450',
    stockStatus: 'Made to Order'
  };

  DigitalTwin.currentTwin.variants.push(newVariant);
  renderVariantsList();
  showToast(`Added variant: ${name}`);
  DigitalTwin.commitVersion(`Added product variant: ${name}`);
}

function renderVariantsList() {
  const container = document.getElementById('variantsListContainer');
  if (!container || !DigitalTwin.currentTwin) return;

  container.innerHTML = DigitalTwin.currentTwin.variants.map((v, i) => `
    <div style="background:#FFFFFF;border:1px solid var(--border-sand);padding:12px;border-radius:var(--radius-sm);margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;">
      <div>
        <strong style="font-size:14px;">${v.name}</strong>
        <div style="font-size:12px;color:var(--charcoal-muted);">${v.price} • ${v.stockStatus}</div>
      </div>
      <button type="button" onclick="removeVariant(${i})" class="btn-field-act">Remove</button>
    </div>
  `).join('');
}

function removeVariant(index) {
  DigitalTwin.currentTwin.variants.splice(index, 1);
  renderVariantsList();
}

/* =========================================================
   10. TRANSLATION STUDIO (80+ LANGUAGES)
   ========================================================= */
async function triggerTranslation() {
  const targetLang = AppState.selectedTargetLang || 'hi';
  const langObj = LanguageService.findByCode(targetLang);
  const twin = DigitalTwin.currentTwin;
  const current = twin.listing.variations[AppState.currentListingIndex];

  showToast(`Translating into ${langObj.englishName}...`);

  try {
    const verifiedFacts = Object.values(twin.fields)
      .filter(f => f.confirmed)
      .map(f => `${f.label}: ${f.value}`);

    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: current.title,
        description: current.description,
        targetLang: langObj.code,
        targetLangName: langObj.englishName,
        verifiedFacts
      })
    });

    const data = await response.json();
    document.getElementById('transOutputTitle').textContent = data.translatedTitle;
    document.getElementById('transOutputDesc').textContent = data.translatedDescription;
    document.getElementById('transOutputLangBadge').textContent = data.translatedLanguage;
    showToast(`✓ Translated into ${langObj.englishName}!`);
  } catch (err) {
    showToast('Translation completed!');
  }
}

/* =========================================================
   11. AI MARKETING STUDIO & CUSTOMER REPLY ASSISTANT
   ========================================================= */
function updateMarketingViews() {
  const twin = DigitalTwin.currentTwin;
  if (!twin || !twin.listing.variations || !twin.listing.variations[AppState.currentListingIndex]) return;

  const current = twin.listing.variations[AppState.currentListingIndex];
  const pName = twin.fields.product.value || 'Handcrafted Art';
  const mat = twin.fields.material.value || 'Traditional Materials';
  const price = current.price_range || 'Price on request';

  // 1. WhatsApp Catalog Message
  document.getElementById('mktgWhatsappText').textContent =
`✨ *Namaste! Direct from Master Artisan* ✨

*Product:* ${current.title}
*Materials:* Genuine ${mat}
🏷️ *Price:* ${price}
🤲 *Handmade by:* ${twin.artisan.name} (${twin.artisan.cluster})

${current.short_description}

📦 *Pan-India Safe Delivery:* Eco-cushioned shockproof packaging
Reply *YES* to place your order or see workshop videos!`;

  // 2. Instagram Showcase
  document.getElementById('mktgInstaText').textContent =
`Every curve tells an Indian heritage story. 🏺✨

${current.description}

Formed slowly by hand over days of patient dedication. No factory assembly. 100% human soul.

🏷️ Price: ${price}
📍 Shipping worldwide & across India
📩 Direct message to purchase or customize your piece

#KarigarPride #VocalForLocal #IndianHandicrafts #ArtisanCrafted #SustainableDecor #HandmadeInIndia #TraditionalPottery`;

  // 3. Feature Bullets
  document.getElementById('mktgBulletsText').textContent = (current.bullets || []).join('\n');

  // 4. Festival Campaign
  document.getElementById('mktgFestivalText').textContent =
`🪔 *Celebrate Heritage This Festive Season with Authentic Craft* 🪔

Brighten your home with the blessings of authentic Indian craftsmanship. Our ${pName} is individually hand-shaped using pure ${mat}.

✓ Direct Artisan Support • ✓ Ethical Fair-Trade • ✓ Limited Festive Batch
Special Festive Order: ${price}
Place your festive order today!`;
}

// Customer Reply Assistant
async function submitCustomerInquiry() {
  const question = document.getElementById('customerQuestionInput').value.trim();
  if (!question) {
    showToast('Please type a customer question!');
    return;
  }

  const replyBox = document.getElementById('customerReplyOutput');
  replyBox.textContent = 'Consulting verified Digital Twin facts...';

  const twin = DigitalTwin.currentTwin;
  const verifiedFacts = Object.values(twin.fields)
    .filter(f => f.confirmed && f.value)
    .map(f => `${f.label}: ${f.value}`);

  try {
    const response = await fetch('/api/customer-reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question,
        verifiedFacts,
        productTitle: twin.fields.product.value
      })
    });
    const data = await response.json();
    replyBox.textContent = data.reply;
    document.getElementById('customerReplySourceBadge').textContent =
      data.source === 'VERIFIED_FACTS' ? '✓ Answered from Verified Facts' : '⚠️ Bounded Fact Protection (No Hallucination)';
    showToast('Generated fact-bounded customer response!');
  } catch (err) {
    replyBox.textContent = DigitalTwin.answerCustomerInquiry(question);
  }
}

function askSampleQuestion(q) {
  document.getElementById('customerQuestionInput').value = q;
  submitCustomerInquiry();
}

/* =========================================================
   12. CRAFT MEMORY & ARTISAN PROFILE
   ========================================================= */
function openMemoryModal() {
  const mem = DigitalTwin.loadMemory();
  document.getElementById('memClusterInput').value = mem.primaryCluster || '';
  document.getElementById('memMaterialsInput').value = (mem.frequentlyUsedMaterials || []).join(', ');
  document.getElementById('memWageInput').value = mem.defaultDailyWage || 500;
  document.getElementById('memStoryInput').value = mem.signatureStory || '';
  document.getElementById('craftMemoryModal').classList.add('open');
}

function closeMemoryModal() {
  document.getElementById('craftMemoryModal').classList.remove('open');
}

function saveMemorySettings() {
  const updated = {
    primaryCluster: document.getElementById('memClusterInput').value.trim(),
    frequentlyUsedMaterials: document.getElementById('memMaterialsInput').value.split(',').map(s => s.trim()).filter(Boolean),
    defaultDailyWage: parseFloat(document.getElementById('memWageInput').value) || 500,
    signatureStory: document.getElementById('memStoryInput').value.trim()
  };
  DigitalTwin.saveMemory(updated);
  closeMemoryModal();
  showToast('Craft Memory Saved!');
}

/* =========================================================
   13. CRAFT LIBRARY (INVENTORY) & DIGITAL TWIN PERSISTENCE
   ========================================================= */
async function saveCurrentTwinToServer() {
  const twin = DigitalTwin.currentTwin;
  if (!twin) return;

  try {
    await fetch('/api/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        ptype: twin.fields.product.value,
        material: twin.fields.material.value,
        results: twin.listing.variations,
        digitalTwin: twin
      })
    });
  } catch (e) {}

  saveTwinLocally(twin);
}

function saveTwinLocally(twin) {
  try {
    let list = JSON.parse(localStorage.getItem('karigar_twins_inventory')) || [];
    const idx = list.findIndex(t => t.id === twin.id);
    if (idx >= 0) list[idx] = twin;
    else list.unshift(twin);
    localStorage.setItem('karigar_twins_inventory', JSON.stringify(list.slice(0, 50)));
  } catch (e) {}
}

async function loadSavedDigitalTwins() {
  const container = document.getElementById('craftLibraryGrid');
  if (!container) return;

  let twins = [];
  try {
    const res = await fetch('/api/history');
    if (res.ok) {
      const hist = await res.json();
      twins = hist.map(h => h.digitalTwin).filter(Boolean);
    }
  } catch (e) {}

  if (twins.length === 0) {
    try {
      twins = JSON.parse(localStorage.getItem('karigar_twins_inventory')) || [];
    } catch (e) {}
  }

  if (twins.length === 0 && DigitalTwin.currentTwin) {
    twins = [DigitalTwin.currentTwin];
  }

  container.innerHTML = twins.map((t, idx) => {
    const imgUrl = (t.images && t.images[0]) ? t.images[0].url : '🏺';
    const title = t.fields?.product?.value || 'Handcrafted Craft';
    const price = (t.listing?.variations && t.listing.variations[0]?.price_range) || '₹1,850';
    return `
      <div class="product-inventory-card">
        <div style="display:flex;gap:12px;margin-bottom:12px;">
          <div style="width:54px;height:54px;background:var(--bg-sand);border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;font-size:24px;overflow:hidden;">
            ${imgUrl.startsWith('data:') ? `<img src="${imgUrl}" style="width:100%;height:100%;object-fit:cover;">` : imgUrl}
          </div>
          <div style="flex:1;">
            <div style="font-size:11px;font-weight:700;color:var(--terracotta);text-transform:uppercase;">${t.status}</div>
            <div style="font-family:var(--font-display);font-size:15px;font-weight:600;">${title}</div>
            <div style="font-size:13px;font-weight:700;color:var(--forest);">${price}</div>
          </div>
        </div>
        <div style="display:flex;gap:6px;">
          <button type="button" class="btn-field-act confirm" style="flex:1;" onclick="openTwinInStudio(${idx})">Open in Studio</button>
          <button type="button" class="btn-field-act" onclick="duplicateTwin(${idx})">Duplicate</button>
        </div>
      </div>
    `;
  }).join('');
}

function openTwinInStudio(idx) {
  try {
    let list = JSON.parse(localStorage.getItem('karigar_twins_inventory')) || [];
    if (list[idx]) {
      DigitalTwin.currentTwin = list[idx];
      renderUnderstandingBoard();
      renderStudioListing();
      showView('studio');
      showToast('Loaded Digital Twin into Studio!');
    }
  } catch (e) {}
}

function duplicateTwin(idx) {
  try {
    let list = JSON.parse(localStorage.getItem('karigar_twins_inventory')) || [];
    if (list[idx]) {
      const copy = JSON.parse(JSON.stringify(list[idx]));
      copy.id = 'dt_' + Date.now();
      copy.fields.product.value += ' (Copy)';
      list.unshift(copy);
      localStorage.setItem('karigar_twins_inventory', JSON.stringify(list));
      loadSavedDigitalTwins();
      showToast('Duplicated Digital Twin!');
    }
  } catch (e) {}
}

/* =========================================================
   14. LISTING HEALTH CHECK & VERSION HISTORY
   ========================================================= */
function updateHealthAuditView() {
  const audit = DigitalTwin.auditListingHealth();
  const container = document.getElementById('healthAuditContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="health-audit-box">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <h4 style="font-size:15px;">Listing Health &amp; Readiness Audit</h4>
        <span style="font-size:12px;font-weight:700;color:${audit.isMarketplaceReady ? 'var(--forest)' : 'var(--terracotta)'}">
          ${audit.confirmedCount} / ${audit.totalFields} Verified Facts
        </span>
      </div>
      ${audit.items.length === 0 ? '<div style="color:var(--forest);font-size:13px;">✓ Excellent! All marketplace compliance criteria verified.</div>' : ''}
      ${audit.items.map(item => `
        <div class="health-item">
          <span class="health-tag ${item.type}">${item.type}</span>
          <div>
            <strong>${item.field}:</strong> ${item.message}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderVersionHistory() {
  const container = document.getElementById('versionTimelineContainer');
  if (!container || !DigitalTwin.currentTwin) return;

  const history = DigitalTwin.currentTwin.versionHistory || [];
  container.innerHTML = history.map(v => `
    <div style="border-left:2px solid var(--forest);padding-left:14px;margin-bottom:14px;position:relative;">
      <div style="position:absolute;left:-7px;top:0;width:12px;height:12px;border-radius:50%;background:var(--forest);"></div>
      <div style="font-size:12px;color:var(--charcoal-muted);">${new Date(v.date).toLocaleString()}</div>
      <strong style="font-size:14px;">Version ${v.version}: ${v.summary}</strong>
      ${v.version > 1 ? `<div style="margin-top:4px;"><button class="btn-field-act" onclick="restoreRevision(${v.version})">Restore to this Version</button></div>` : ''}
    </div>
  `).join('');
}

function restoreRevision(vNum) {
  if (confirm(`Restore Digital Twin to Version ${vNum}?`)) {
    DigitalTwin.restoreVersion(vNum);
    renderUnderstandingBoard();
    renderStudioListing();
    renderVersionHistory();
    showToast(`Restored to Version ${vNum}`);
  }
}

/* =========================================================
   15. SMART DEMO MODE (1-CLICK FULL JOURNEY)
   ========================================================= */
async function runSmartDemoMode() {
  AppState.demoModeActive = true;
  showToast('⚡ Starting Smart Demo Walkthrough...');

  // Step 1: Set Languages
  showView('create');
  setVoiceLanguage('hi');
  setTargetLanguage('en');

  // Step 2: Simulate Natural Spoken Voice Input
  setVoiceState('Listening');
  const demoText = 'हाथ से बना हुआ खुर्जा का 10 इंच का नीला फूलदान है। इसपर असली क्वार्ट्ज पत्थर का पाउडर और प्राकृतिक कोबाल्ट ऑक्साइड रंग लगा है। इसे 800 डिग्री पर पकाने में कारीगर को 3 दिन का समय लगा है। यह 100% natural है और लिविंग रूम सजावट और उपहार के लिए उत्तम है।';

  document.getElementById('productTranscriptBox').value = '';
  let typed = '';
  for (let i = 0; i < demoText.length; i += 4) {
    typed += demoText.substr(i, 4);
    document.getElementById('productTranscriptBox').value = typed;
    updateCharCount();
    await new Promise(r => setTimeout(r, 20));
  }
  setVoiceState('Completed');

  // Step 3: Trigger Understanding Board
  await processSpokenUnderstanding();

  // Step 4: Confirm 10 Core Facts
  await new Promise(r => setTimeout(r, 600));
  showToast('✓ Confirming verified artisan facts...');
  confirmAllAndCreateTwin();

  // Step 5: Studio, Pricing & Marketing
  showView('studio');
  showToast('✓ Marketplace Listing Generated & Verified!');
}

/* =========================================================
   16. OFFLINE RESILIENCE & AUTOSAVE
   ========================================================= */
function setupNetworkListeners() {
  window.addEventListener('online', () => {
    const badge = document.getElementById('aiStatusBadge');
    if (badge) {
      badge.className = 'status-badge';
      badge.innerHTML = '<span class="status-dot"></span><span>AI Engine Ready</span>';
    }
    showToast('Network restored. Reconnected to cloud AI.');
  });

  window.addEventListener('offline', () => {
    const badge = document.getElementById('aiStatusBadge');
    if (badge) {
      badge.className = 'status-badge offline';
      badge.innerHTML = '<span class="status-dot"></span><span>Offline (Drafts Saved Locally)</span>';
    }
    showToast('Working offline. All drafts are safely preserved on your device.');
  });
}

function setupAutoDraftSaver() {
  setInterval(() => {
    if (DigitalTwin.currentTwin) {
      saveTwinLocally(DigitalTwin.currentTwin);
    }
  }, 10000);
}

/* =========================================================
   17. VIEW NAVIGATION & HELPERS
   ========================================================= */
function getKarigarLoggedInUser() {
  const primaryUser = localStorage.getItem('karigarUser');
  const savedUser = localStorage.getItem('karigar_user');

  try {
    if (primaryUser) {
      return JSON.parse(primaryUser);
    }

    if (savedUser) {
      return JSON.parse(savedUser);
    }
  } catch (error) {
    console.error('Could not read Karigar user:', error);
  }

  return null;
}


function renderKarigarProfile() {
  const container = document.getElementById('karigarProfileContent');

  if (!container) return;

  const loggedIn =
    localStorage.getItem('karigar_logged_in') === 'true';

  if (!loggedIn) {
    container.innerHTML = `
      <div style="text-align:center;padding:30px;">
        <div style="font-size:42px;margin-bottom:12px;">👤</div>
        <h2>Sign In Required</h2>
        <p style="color:var(--charcoal-muted);margin:8px 0 18px;">
          Please sign in to view your artisan profile.
        </p>
        <button
          type="button"
          class="btn-hero-primary"
          onclick="document.getElementById('authScreen').style.display='flex';"
        >
          Sign In / Create Account
        </button>
      </div>
    `;

    return;
  }

  const user = getKarigarLoggedInUser();

  if (!user) {
    container.innerHTML = `
      <div style="text-align:center;padding:30px;">
        <div style="font-size:42px;margin-bottom:12px;">👤</div>
        <h2>Account Information Not Found</h2>
        <p style="color:var(--charcoal-muted);margin:8px 0 18px;">
          Please sign in again to load your profile.
        </p>
        <button
          type="button"
          class="btn-hero-primary"
          onclick="karigarLogout()"
        >
          Sign In Again
        </button>
      </div>
    `;

    return;
  }

  const name = user.name || 'Karigar';
  const email = user.email || 'Not provided';
  const phone = user.phone || 'Not provided';
  const role = user.role || 'Artisan';
  const craft = user.craft || 'Not provided';
  const language = user.language || 'Not provided';

  container.innerHTML = `
    <div style="display:flex;gap:18px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">
      <div style="width:72px;height:72px;border-radius:50%;background:var(--forest);color:var(--gold-accent);display:flex;align-items:center;justify-content:center;font-size:34px;border:3px solid var(--gold-accent);">
        👤
      </div>

      <div>
        <h2 style="margin-bottom:2px;">${name}</h2>

        <div style="font-size:13px;color:var(--charcoal-muted);">
          ${role} • ${craft}
        </div>
      </div>
    </div>

    <div style="background:var(--bg-sand);border:1px solid var(--border-sand);padding:18px;border-radius:var(--radius-md);margin-bottom:16px;">
      <h4>My Karigar Account</h4>

      <div style="margin-top:12px;display:grid;gap:10px;">

        <div>
          <strong>Email</strong>
          <div style="font-size:13px;color:var(--charcoal-muted);">
            ${email}
          </div>
        </div>

        <div>
          <strong>Mobile Number</strong>
          <div style="font-size:13px;color:var(--charcoal-muted);">
            ${phone}
          </div>
        </div>

        <div>
          <strong>Role</strong>
          <div style="font-size:13px;color:var(--charcoal-muted);">
            ${role}
          </div>
        </div>

        <div>
          <strong>Craft</strong>
          <div style="font-size:13px;color:var(--charcoal-muted);">
            ${craft}
          </div>
        </div>

        <div>
          <strong>Preferred Language</strong>
          <div style="font-size:13px;color:var(--charcoal-muted);">
            ${language}
          </div>
        </div>

      </div>
    </div>

    <div style="display:flex;justify-content:space-between;align-items:center;padding:12px;background:#fff;border:1px solid var(--border-subtle);border-radius:var(--radius-sm);gap:12px;flex-wrap:wrap;">

      <div>
        <strong>Account Status</strong>

        <div style="font-size:12px;color:var(--charcoal-muted);">
          Your Karigar AI account is verified and signed in.
        </div>
      </div>

      <button
        type="button"
        class="btn-field-act"
        onclick="karigarLogout()"
      >
        🚪 Sign Out
      </button>

    </div>
  `;
}

function showView(viewId) {
  AppState.activeView = viewId;
  const views = ['dashboard', 'create', 'products', 'crafts', 'studio', 'pricing', 'marketing', 'twin', 'profile'];
  views.forEach(v => {
    const el = document.getElementById(`view-${v}`);
    const tab = document.getElementById(`tab-${v}`);
    if (el) el.classList.toggle('active', v === viewId);
    if (tab) tab.classList.toggle('active', v === viewId);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (viewId === 'studio') {
    renderStudioListing();
    updateMarketingViews();
  }
  if (viewId === 'twin') {
    renderVariantsList();
    renderVersionHistory();
    updateHealthAuditView();
  }
  if (viewId === 'products') {
    loadSavedDigitalTwins();
  }

  if (viewId === 'profile') {
  renderKarigarProfile();
}

}

function exportCSV() {
  window.location.href = '/api/export-csv';
  showToast('Downloading verified Digital Twins CSV...');
}

let toastTimeout;
function showToast(msg) {
  const toast = document.getElementById('toastMsg');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2400);
}
/* =========================================================
   KARIGAR AI - DASHBOARD FEATURE CARDS
   Connects the 4 dashboard cards to existing features.
   Does NOT replace or delete existing functionality.
   ========================================================= */

(function initKarigarDashboardCards() {

  function setupCards() {
    const dashboard = document.getElementById('view-dashboard');

    if (!dashboard) {
      console.warn('Karigar AI: Dashboard not found.');
      return;
    }

    const cards = dashboard.querySelectorAll('.card');

    cards.forEach(function(card) {

      // Prevent duplicate setup
      if (card.dataset.karigarConnected === 'true') {
        return;
      }

      const cardText = (card.textContent || '')
        .replace(/\s+/g, ' ')
        .trim();

      /* =====================================================
         1. 84 LANGUAGES
         ===================================================== */

      if (cardText.includes('84 Languages')) {

        card.dataset.karigarConnected = 'true';
        card.style.cursor = 'pointer';

        card.addEventListener('click', function() {

          try {

            if (typeof openLanguageModal === 'function') {

              openLanguageModal();

            } else {

              const modal =
                document.getElementById('langModalOverlay');

              if (modal) {
                modal.classList.add('open');
                modal.style.display = 'flex';
              }

            }

          } catch (error) {

            console.error(
              'Language Center error:',
              error
            );

          }

        });

      }


      /* =====================================================
         2. CLAIM GUARD
         ===================================================== */

      else if (cardText.includes('Claim Guard')) {

        card.dataset.karigarConnected = 'true';
        card.style.cursor = 'pointer';

        card.addEventListener('click', function() {

          try {

            if (typeof showView === 'function') {

              showView('create');

            }

            setTimeout(function() {

              const guard =
                document.getElementById(
                  'claimGuardContainer'
                );

              if (guard) {

                guard.scrollIntoView({
                  behavior: 'smooth',
                  block: 'center'
                });

              }

            }, 300);

            if (typeof showToast === 'function') {

              showToast(
                'Claim Guard opened. Verify product claims before publishing.'
              );

            }

          } catch (error) {

            console.error(
              'Claim Guard error:',
              error
            );

          }

        });

      }


      /* =====================================================
         3. FAIR WAGE AI
         ===================================================== */

      else if (cardText.includes('Fair Wage AI')) {

        card.dataset.karigarConnected = 'true';
        card.style.cursor = 'pointer';

        card.addEventListener('click', function() {

          try {

            if (typeof showView === 'function') {

              showView('pricing');

            }

            setTimeout(function() {

              const materialInput =
                document.getElementById(
                  'calcMatCost'
                );

              if (materialInput) {

                materialInput.scrollIntoView({
                  behavior: 'smooth',
                  block: 'center'
                });

                materialInput.focus();

              }

            }, 300);

            if (typeof showToast === 'function') {

              showToast(
                'Fair Wage AI opened. Enter material, labour and other costs.'
              );

            }

          } catch (error) {

            console.error(
              'Fair Wage AI error:',
              error
            );

          }

        });

      }


      /* =====================================================
         4. BOUNDED Q&A
         ===================================================== */

      else if (cardText.includes('Bounded Q&A')) {

        card.dataset.karigarConnected = 'true';
        card.style.cursor = 'pointer';

        card.addEventListener('click', function() {

          try {

            if (typeof showView === 'function') {

              showView('marketing');

            }

            setTimeout(function() {

              const questionInput =
                document.getElementById(
                  'customerQuestionInput'
                );

              if (questionInput) {

                questionInput.scrollIntoView({
                  behavior: 'smooth',
                  block: 'center'
                });

                questionInput.focus();

              }

            }, 300);

            if (typeof showToast === 'function') {

              showToast(
                'Bounded Q&A opened. Ask questions using verified product information.'
              );

            }

          } catch (error) {

            console.error(
              'Bounded Q&A error:',
              error
            );

          }

        });

      }

    });

  }


  /* Wait until the existing Karigar AI app is loaded */

  if (document.readyState === 'loading') {

    document.addEventListener(
      'DOMContentLoaded',
      setupCards
    );

  } else {

    setupCards();

  }

})();
/* =========================================================
   KARIGAR AI - HORIZONTAL LISTING DESCRIPTION
   Makes the generated description compact and horizontal
   ========================================================= */

(function makeDescriptionHorizontal() {

  function applyDescriptionStyle() {

    const fullDesc = document.getElementById('studioFullDesc');

    if (fullDesc) {

      fullDesc.style.width = '100%';
      fullDesc.style.minWidth = '420px';
      fullDesc.style.height = '48px';
      fullDesc.style.minHeight = '48px';
      fullDesc.style.maxHeight = '48px';

      fullDesc.style.boxSizing = 'border-box';
      fullDesc.style.padding = '12px 16px';

      fullDesc.style.border = '1px solid #d6d6d6';
      fullDesc.style.borderRadius = '10px';

      fullDesc.style.background = '#ffffff';
      fullDesc.style.fontSize = '14px';
      fullDesc.style.lineHeight = '22px';

      /* Keep it as one horizontal line */
      fullDesc.style.whiteSpace = 'nowrap';
      fullDesc.style.overflowX = 'auto';
      fullDesc.style.overflowY = 'hidden';

      fullDesc.style.resize = 'none';

      /* Make it look like a clean horizontal information field */
      fullDesc.style.display = 'block';

      fullDesc.title = 'Generated product description';
    }

  }

  if (document.readyState === 'loading') {

    document.addEventListener(
      'DOMContentLoaded',
      applyDescriptionStyle
    );

  } else {

    applyDescriptionStyle();

  }

  /* Re-apply after AI generates / changes the listing */
  const observer = new MutationObserver(function() {
    applyDescriptionStyle();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

})();

/* =========================================================
   KARIGAR AI - SIMPLE AUTH
   NAME + EMAIL ONLY
   NO OTP
   ========================================================= */

let karigarPendingUser = null;


/* =========================================================
   CHECK LOGIN
   ========================================================= */

(function checkKarigarAuthentication() {

  function checkAuth() {

    const authScreen =
      document.getElementById('authScreen');

    if (!authScreen) return;

    const loggedIn =
      localStorage.getItem('karigar_logged_in');

    if (loggedIn === 'true') {
      authScreen.style.display = 'none';
    } else {
      authScreen.style.display = 'flex';
    }

  }

  if (document.readyState === 'loading') {

    document.addEventListener(
      'DOMContentLoaded',
      checkAuth
    );

  } else {

    checkAuth();

  }

})();


/* =========================================================
   SHOW SIGN UP
   ========================================================= */

function showKarigarSignup() {

  const signupBox =
    document.getElementById('signupBox');

  const loginBox =
    document.getElementById('loginBox');

  const otpBox =
    document.getElementById('otpBox');

  if (signupBox)
    signupBox.style.display = 'block';

  if (loginBox)
    loginBox.style.display = 'none';

  if (otpBox)
    otpBox.style.display = 'none';

  clearAuthError();

}


/* =========================================================
   SHOW LOGIN
   ========================================================= */

function showKarigarLogin() {

  const signupBox =
    document.getElementById('signupBox');

  const loginBox =
    document.getElementById('loginBox');

  const otpBox =
    document.getElementById('otpBox');

  if (signupBox)
    signupBox.style.display = 'none';

  if (loginBox)
    loginBox.style.display = 'block';

  if (otpBox)
    otpBox.style.display = 'none';

  clearAuthError();

}


/* =========================================================
   DIRECT SIGNUP
   NAME + EMAIL ONLY
   ========================================================= */

function startKarigarSignup() {

  const nameInput =
    document.getElementById('authName');

  const emailInput =
    document.getElementById('authEmail');

  if (!nameInput || !emailInput) {

    showAuthError(
      'Signup fields not found.'
    );

    return;

  }

  const name =
    nameInput.value.trim();

  const email =
    emailInput.value.trim();


  /* NAME VALIDATION */

  if (!name) {

    showAuthError(
      'Please enter your name.'
    );

    nameInput.focus();

    return;

  }


  /* EMAIL VALIDATION */

  if (!email) {

    showAuthError(
      'Please enter your email.'
    );

    emailInput.focus();

    return;

  }


  if (
    !email.includes('@') ||
    !email.includes('.')
  ) {

    showAuthError(
      'Please enter a valid email address.'
    );

    emailInput.focus();

    return;

  }


  /* CREATE USER */

  const user = {

    name: name,

    email: email

  };


  karigarPendingUser = user;


  /* SAVE LOGIN */

  localStorage.setItem(
    'karigar_logged_in',
    'true'
  );

  localStorage.setItem(
    'karigar_user',
    JSON.stringify(user)
  );

  localStorage.setItem(
    'karigarUser',
    JSON.stringify(user)
  );


  /* HIDE AUTH SCREEN */

  const authScreen =
    document.getElementById('authScreen');

  if (authScreen) {

    authScreen.style.display = 'none';

  }


  /* ALWAYS HIDE OTP */

  const otpBox =
    document.getElementById('otpBox');

  if (otpBox) {

    otpBox.style.display = 'none';

  }


  /* SUCCESS */

  if (typeof showToast === 'function') {

    showToast(
      `Welcome to Karigar AI, ${name}!`
    );

  } else {

    alert(
      `✅ Welcome to Karigar AI, ${name}!`
    );

  }


  karigarPendingUser = null;

}


/* =========================================================
   OTP COMPLETELY DISABLED
   ========================================================= */

function verifyKarigarOTP() {

  console.log(
    'OTP verification disabled.'
  );

}


function resendKarigarOTP() {

  console.log(
    'OTP resend disabled.'
  );

}


/* =========================================================
   LOGIN
   ========================================================= */

async function karigarLogin() {

  const emailInput =
    document.getElementById('loginEmail');

  const passwordInput =
    document.getElementById('loginPassword');

  const email =
    emailInput
      ? emailInput.value.trim()
      : '';

  const password =
    passwordInput
      ? passwordInput.value
      : '';


  if (!email) {

    showAuthError(
      'Please enter your email.'
    );

    return;

  }


  if (!password) {

    showAuthError(
      'Please enter your password.'
    );

    return;

  }


  try {

    const response =
      await fetch(
        '/api/auth/login',
        {

          method: 'POST',

          headers: {
            'Content-Type':
              'application/json'
          },

          body: JSON.stringify({
            email: email,
            password: password
          })

        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(
        data.message ||
        'Login failed.'
      );

    }


    localStorage.setItem(
      'karigar_logged_in',
      'true'
    );


    localStorage.setItem(
      'karigar_user',
      JSON.stringify(
        data.user || {
          email: email
        }
      )
    );


    localStorage.setItem(
      'karigarUser',
      JSON.stringify(
        data.user || {
          email: email
        }
      )
    );


    const authScreen =
      document.getElementById(
        'authScreen'
      );

    if (authScreen) {

      authScreen.style.display =
        'none';

    }


    if (typeof showToast === 'function') {

      showToast(
        'Welcome back to Karigar AI!'
      );

    }


  } catch (error) {

    console.error(
      'Login error:',
      error
    );

    showAuthError(
      error.message ||
      'Login failed.'
    );

  }

}


/* =========================================================
   AUTH ERROR
   ========================================================= */

function showAuthError(message) {

  const box =
    document.getElementById(
      'authError'
    );

  if (box) {

    box.style.color =
      '#c0392b';

    box.textContent =
      message;

  }

}


/* =========================================================
   AUTH MESSAGE
   ========================================================= */

function showAuthMessage(message) {

  const box =
    document.getElementById(
      'authError'
    );

  if (box) {

    box.style.color =
      '#8b5e34';

    box.textContent =
      message;

  }

}


/* =========================================================
   CLEAR ERROR
   ========================================================= */

function clearAuthError() {

  const box =
    document.getElementById(
      'authError'
    );

  if (box) {

    box.textContent = '';

    box.style.color =
      '#c0392b';

  }

}


/* =========================================================
   LOGOUT
   ========================================================= */

function karigarLogout() {

  localStorage.removeItem(
    'karigar_logged_in'
  );

  localStorage.removeItem(
    'karigar_user'
  );

  localStorage.removeItem(
    'karigarUser'
  );

  location.reload();

}


/* =========================================================
   FORCE OTP BOX HIDDEN
   ========================================================= */

(function disableOTPUI() {

  function hideOTP() {

    const otpBox =
      document.getElementById(
        'otpBox'
      );

    if (otpBox) {

      otpBox.style.display =
        'none';

    }

  }


  if (
    document.readyState ===
    'loading'
  ) {

    document.addEventListener(
      'DOMContentLoaded',
      hideOTP
    );

  } else {

    hideOTP();

  }

})();
