// ==================== ARTIFACT FUNCTIONS ====================
function getTotalArtifacts() {
  let total = 0;
  for (const scene in artifactRegistry) {
    total += artifactRegistry[scene].length;
  }
  return total;
}

function getSceneArtifacts(sceneId) {
  return artifactRegistry[sceneId] || [];
}

function getFoundSceneArtifacts(sceneId) {
  const artifacts = getSceneArtifacts(sceneId);
  return artifacts.filter(function(a) {
    return gameState.foundArtifacts.has(a.id);
  });
}

function findArtifact(sceneId, artifactId) {
  if (gameState.foundArtifacts.has(artifactId)) return false;
  const artifacts = getSceneArtifacts(sceneId);
  const artifact = artifacts.find(function(a) { return a.id === artifactId; });
  if (!artifact) return false;

  gameState.foundArtifacts.add(artifactId);
  showArtifactFound(artifact);
  updateArtifactDisplay();
  return true;
}

function showArtifactFound(artifact) {
  const html = `<div class='artifact-found'>🏆 <strong>Secret Found:</strong> ${artifact.name} — ${artifact.desc}</div>`;
  addStoryText(html);
}

function updateArtifactDisplay() {
  const sceneArtifacts = getSceneArtifacts(gameState.currentScene);
  const foundInScene = getFoundSceneArtifacts(gameState.currentScene);
  const totalFound = gameState.foundArtifacts.size;
  const totalAll = getTotalArtifacts();

  document.getElementById('sceneArtifactCount').textContent = foundInScene.length + '/' + sceneArtifacts.length;
  document.getElementById('globalArtifactCount').textContent = totalFound + '/' + totalAll;

  const dotsContainer = document.getElementById('sceneArtifactDots');
  dotsContainer.innerHTML = sceneArtifacts.map(function(a) {
    const found = gameState.foundArtifacts.has(a.id);
    return `<div class='artifact-dot ${found ? 'found' : ''}' title='${a.name}: ${a.desc}'></div>`;
  }).join('');

  const unfound = sceneArtifacts.filter(function(a) { return !gameState.foundArtifacts.has(a.id); });
  if (unfound.length > 0) {
    const hidden = unfound.filter(function(a) { return a.type === 'hidden' || a.type === 'item_required'; });
    if (hidden.length > 0) {
      document.getElementById('artifactHint').innerHTML = `🔍 <strong>${hidden.length} secret${hidden.length > 1 ? 's' : ''}</strong> still hidden. Try: <em>look closer, listen carefully, or return with new items</em>.`;
    } else {
      document.getElementById('artifactHint').innerHTML = '✨ Almost there! <strong>One more secret</strong> to find here.';
    }
  } else {
    document.getElementById('artifactHint').innerHTML = '✅ <strong>All secrets found here!</strong> But other lands still hold mysteries...';
  }

  const totalDisplay = document.getElementById('totalArtifactsDisplay');
  totalDisplay.innerHTML = `<span style='font-size:2rem;'>🏆</span><p style='font-size:1.5rem; font-weight:bold; color:var(--bark); margin-top:5px;'>${totalFound}/${totalAll}</p><p style='font-size:0.85rem; color:var(--text-light);'>Secrets discovered across all lands</p>`;
}

// ==================== BACKTRACKING SYSTEM ====================
function checkBacktrackOpportunities() {
  const currentScene = gameState.currentScene;
  const visitCount = gameState.sceneVisitCount[currentScene] || 0;

  if (visitCount > 1) {
    const artifacts = getSceneArtifacts(currentScene);
    const unfound = artifacts.filter(function(a) { 
      return !gameState.foundArtifacts.has(a.id) && a.type === 'item_required'; 
    });

    if (unfound.length > 0) {
      const hasNewItems = gameState.inventory.length > 0;
      if (hasNewItems) {
        addStoryText(`<div class='backtrack-notice'>🔄 <strong>You return with new eyes...</strong> Your pack holds items that might reveal secrets you missed before. Try <em>using</em> them here.</div>`);
      }
    }
  }
}

// ==================== CORE FUNCTIONS ====================
function selectPath(path) {
  document.querySelectorAll('.character-card').forEach(function(c) { c.classList.remove('selected'); });
  document.querySelector(`[data-path="${path}"]`).classList.add('selected');
  gameState.path = path;
  document.getElementById('startBtn').disabled = false;
}

function startGame() {
  document.getElementById('charSelectModal').style.display = 'none';
  document.getElementById('gameContainer').style.display = 'grid';
  loadScene('meadow_gate');
}

function loadScene(sceneId) {
  const scene = scenes[sceneId];
  if (!scene) {
    addStoryText(`<p class='narrator'>That path is not yet grown. Try another direction.</p>`);
    return;
  }

  gameState.currentScene = sceneId;
  gameState.visitedScenes.add(sceneId);
  gameState.sceneVisitCount[sceneId] = (gameState.sceneVisitCount[sceneId] || 0) + 1;

  if (scene.onEnter) {
    try {
      scene.onEnter();
    } catch(e) {
      console.log('onEnter error:', e);
    }
  }

  const storyContent = document.getElementById('storyContent');
  const descFn = sceneDescriptions[sceneId];
  const desc = descFn ? descFn() : `<p class='narrator'>You arrive at ${scene.title}.</p>`;
  storyContent.innerHTML = `<div class='fade-in'>${desc}</div>`;
  storyContent.scrollTop = 0;

  document.getElementById('scenePlaceholder').textContent = scene.emoji || '🌸';
  document.getElementById('sceneImage').style.display = 'none';
  document.getElementById('scenePlaceholder').style.display = 'block';

  if (gameState.autoImages && scene.imagePrompt) {
    setTimeout(function() { generateSceneImage(); }, 500);
  }

  updateQuickCommands(scene);
  updateMap(scene.region);
  updateArtifactDisplay();
  checkBacktrackOpportunities();

  if (gameState.voiceEnabled) {
    setTimeout(function() { speakCurrentScene(); }, 1000);
  }
}

function updateQuickCommands(scene) {
  const container = document.getElementById('quickCommands');
  const commands = [];

  const directions = ['north', 'south', 'east', 'west', 'up', 'down', 'back', 'forward'];
  directions.forEach(function(dir) {
    if (scene.exits[dir]) {
      commands.push({ text: dir.charAt(0).toUpperCase() + dir.slice(1), action: 'go ' + dir });
    }
  });

  const specials = ['examine', 'take', 'talk', 'listen', 'dance', 'sing', 'help', 'comfort', 'sort', 'solve', 'read', 'follow', 'name', 'wait', 'untangle', 'invite', 'begin', 'cross', 'knock', 'play'];
  specials.forEach(function(action) {
    if (scene.exits[action]) {
      commands.push({ text: action.charAt(0).toUpperCase() + action.slice(1), action: action });
    }
  });

  if (gameState.inventory.includes('Rootkey Flute') && scene.exits.play) {
    commands.push({ text: 'Play Flute', action: 'play flute' });
  }
  if (gameState.inventory.includes('Dew Pebble') && scene.exits.use) {
    commands.push({ text: 'Use Pebble', action: 'use pebble' });
  }
  if (gameState.inventory.includes('Moonpetal Mirror') && scene.exits.mirror) {
    commands.push({ text: 'Use Mirror', action: 'use mirror' });
  }
  if (gameState.inventory.includes('Laughing Pollen Pouch') && scene.exits.pollen) {
    commands.push({ text: 'Use Pollen', action: 'use pollen' });
  }

  container.innerHTML = commands.map(function(cmd) {
    return `<span class='quick-cmd' onclick='executeCommand("${cmd.action}")'>${cmd.text}</span>`;
  }).join('');
}

function executeCommand(cmd) {
  document.getElementById('commandInput').value = cmd;
  processCommand();
}

function handleKeyPress(e) {
  if (e.key === 'Enter') processCommand();
}

function processCommand() {
  const input = document.getElementById('commandInput').value.toLowerCase().trim();
  if (!input) return;
  
  // Check for cheat codes
  if (input.startsWith('cheat')) {
    processCheat(input);
    document.getElementById('commandInput').value = '';
    return;
  }
  document.getElementById('commandInput').value = '';

  const scene = scenes[gameState.currentScene];
  const words = input.split(' ');
  const action = words[0];
  const target = words.slice(1).join(' ');

  const directions = ['north', 'south', 'east', 'west', 'up', 'down', 'back', 'forward'];
  if (directions.includes(action) || input.startsWith('go ')) {
    const dir = input.startsWith('go ') ? words[1] : action;
    if (scene.exits[dir]) {
      loadScene(scene.exits[dir]);
      return;
    }
  }

  if (scene.exits[action]) {
    loadScene(scene.exits[action]);
    return;
  }

  if (action === 'look' || action === 'examine' || action === 'inspect') {
    addStoryText(`<p class='narrator'>You look around carefully...</p>`);
    const descFn = sceneDescriptions[gameState.currentScene];
    if (descFn) {
      addStoryText(descFn());
    }
    return;
  }

  if (action === 'talk' || action === 'speak' || action === 'ask') {
    if (scene.characters && scene.characters.length > 0) {
      addStoryText(`<p class='narrator'>You speak gently. The ${scene.characters.join(', ')} ${scene.characters.length > 1 ? 'listen.' : 'listens.'}</p>`);
    } else {
      addStoryText(`<p class='narrator'>There is no one here to talk to.</p>`);
    }
    return;
  }

  if (action === 'listen') {
    addStoryText(`<p class='narrator'>You close your eyes and listen. The land has much to say to those who wait.</p>`);
    modifyTrust('flowers', 2);
    modifyTrust('trees', 2);
    return;
  }

  if (action === 'take' || action === 'get' || action === 'grab') {
    if (scene.items && scene.items.length > 0) {
      addStoryText(`<p class='narrator'>You reach for the ${scene.items[0]}...</p>`);
      if (scene.exits['take']) {
        loadScene(scene.exits['take']);
      }
    } else {
      addStoryText(`<p class='narrator'>There is nothing here to take.</p>`);
    }
    return;
  }

  if (action === 'inventory' || action === 'i' || input === 'pack') {
    if (gameState.inventory.length === 0) {
      addStoryText(`<p class='narrator'>Your pack is empty.</p>`);
    } else {
      addStoryText(`<p class='narrator'>In your pack: ${gameState.inventory.join(', ')}</p>`);
    }
    return;
  }

  if (action === 'use') {
    const itemName = words.slice(1).join(' ');
    const hasItem = gameState.inventory.some(function(i) { return i.toLowerCase().includes(itemName); });
    if (hasItem) {
      addStoryText(`<p class='narrator'>You use the ${itemName}...</p>`);
    } else {
      addStoryText(`<p class='narrator'>You do not have that item.</p>`);
    }
    return;
  }

  if (action === 'wait') {
    addStoryText(`<p class='narrator'>You wait patiently. Sometimes doing nothing is the most important action.</p>`);
    if (scene.exits['wait']) {
      loadScene(scene.exits['wait']);
    }
    return;
  }

  if (action === 'help') {
    addStoryText(`<p class='narrator'>You offer help. The land notices kindness.</p>`);
    if (scene.exits['help']) {
      loadScene(scene.exits['help']);
    }
    return;
  }

  if (action === 'dance') {
    addStoryText(`<p class='narrator'>You begin to move. Long... short... short. The rhythm of listening.</p>`);
    if (scene.exits['dance']) {
      loadScene(scene.exits['dance']);
    }
    return;
  }

  if (action === 'sing') {
    addStoryText(`<p class='narrator'>Your voice rises. Not loud, but true. The land responds to truth.</p>`);
    if (scene.exits['sing']) {
      loadScene(scene.exits['sing']);
    }
    return;
  }

  addStoryText(`<p class='narrator'>You try to ${input}. The land considers your action. Try: look, go [direction], talk, listen, take, examine, dance, sing, wait, help, or use [item].</p>`);
}

function addStoryText(html) {
  const container = document.getElementById('storyContent');
  const div = document.createElement('div');
  div.className = 'fade-in';
  div.innerHTML = html;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function addItem(name, icon) {
  if (!gameState.inventory.includes(name)) {
    gameState.inventory.push(name);
    updateInventory();
  }
}

function updateInventory() {
  const list = document.getElementById('inventoryList');
  if (gameState.inventory.length === 0) {
    list.innerHTML = `<li style='opacity:0.5;font-style:italic;'>Your pack is empty...</li>`;
  } else {
    list.innerHTML = gameState.inventory.map(function(item) {
      const iconMap = {
        'Dew Pebble': '💧', 'Memory Acorn': '🌰', 'Rootkey Flute': '🎵',
        'Laughing Pollen Pouch': '😄', 'Sunseed Compass': '🧭',
        'Rainbell Shell': '🐚', 'Moonpetal Mirror': '🪞', 'Thornproof Ribbon': '🎀'
      };
      return `<li><span class='item-icon'>${iconMap[item] || '✨'}</span>${item}</li>`;
    }).join('');
  }
}

function addClue(text) {
  if (!gameState.clues.includes(text)) {
    gameState.clues.push(text);
    updateClues();
  }
}

function updateClues() {
  const list = document.getElementById('clueList');
  if (gameState.clues.length === 0) {
    list.innerHTML = `<li style='opacity:0.5;font-style:italic;'>No clues discovered yet...</li>`;
  } else {
    list.innerHTML = gameState.clues.map(function(clue) {
      return `<li class='found'>🔍 ${clue}</li>`;
    }).join('');
  }
}

function modifyTrust(type, amount) {
  gameState.trust[type] = Math.max(0, Math.min(100, gameState.trust[type] + amount));
  document.getElementById('trustFlowers').style.width = gameState.trust.flowers + '%';
  document.getElementById('trustTrees').style.width = gameState.trust.trees + '%';
  document.getElementById('trustAnimals').style.width = gameState.trust.animals + '%';
}

function updateSongDisplay() {
  const container = document.getElementById('songFragments');
  const pieces = ['🎶', '🎵', '🎼', '🎤', '🎧', '🎹'];
  container.innerHTML = pieces.map(function(emoji, i) {
    const found = i < gameState.songPieces.length;
    return `<span style='opacity:${found ? '1' : '0.3'};font-size:24px;transition:opacity 0.5s;'>${emoji}</span>`;
  }).join('');
}

function discoverRegion(region) {
  if (!gameState.discoveredRegions.includes(region)) {
    gameState.discoveredRegions.push(region);
  }
}

function updateMap(currentRegion) {
  const container = document.getElementById('mapContainer');
  const regions = {
    'meadow': { top: '70%', left: '40%', name: 'Whispering<br>Meadow' },
    'grove': { top: '50%', left: '70%', name: 'Dancing<br>Grove' },
    'market': { top: '30%', left: '40%', name: 'Petal<br>Market' },
    'root_library': { top: '50%', left: '20%', name: 'Root-Tunnel<br>Library' },
    'pond': { top: '30%', left: '70%', name: 'Rainbell<br>Pond' },
    'orchard': { top: '10%', left: '40%', name: 'Moonlit<br>Orchard' },
    'maze': { top: '30%', left: '10%', name: 'Thorn<br>Maze' },
    'clearing': { top: '10%', left: '10%', name: 'Silent<br>Clearing' },
    'festival': { top: '50%', left: '50%', name: 'Festival<br>Grounds' }
  };

  let html = '';
  for (const key in regions) {
    const pos = regions[key];
    const discovered = gameState.discoveredRegions.includes(key);
    const isCurrent = key === currentRegion;
    if (discovered) {
      html += `<div class='map-region discovered ${isCurrent ? 'current' : ''}' style='top:${pos.top};left:${pos.left};'>${pos.name}</div>`;
    }
  }
  container.innerHTML = html;
}

function toggleVoice() {
  gameState.voiceEnabled = !gameState.voiceEnabled;
  document.getElementById('voiceToggle').classList.toggle('active');
}

function toggleImages() {
  gameState.autoImages = !gameState.autoImages;
  document.getElementById('imageToggle').classList.toggle('active');
}

function speakCurrentScene() {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const scene = scenes[gameState.currentScene];
  const descFn = sceneDescriptions[gameState.currentScene];
  let text = '';
  if (descFn) {
    const temp = document.createElement('div');
    temp.innerHTML = descFn();
    text = temp.textContent || temp.innerText || '';
  }
  if (!text) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 1.1;
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(function(v) { return v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Victoria'); });
  if (preferredVoice) utterance.voice = preferredVoice;

  const btn = document.getElementById('voiceBtn');
  btn.classList.add('speaking');
  utterance.onend = function() { btn.classList.remove('speaking'); };
  window.speechSynthesis.speak(utterance);
}

function generateSceneImage() {
  const scene = scenes[gameState.currentScene];
  if (!scene.imagePrompt) return;

  const btn = document.getElementById('genImageBtn');
  btn.disabled = true;
  btn.innerHTML = `<span style='display:inline-block;width:20px;height:20px;border:3px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;animation:spin 1s linear infinite;'></span> Painting...`;

  const prompt = encodeURIComponent(scene.imagePrompt + ', high quality, detailed, warm lighting');
  const url = `https://image.pollinations.ai/prompt/${prompt}?width=800&height=400&nologo=true&seed=${Math.floor(Math.random() * 10000)}`;

  const img = document.getElementById('sceneImage');
  img.onload = function() {
    img.style.display = 'block';
    document.getElementById('scenePlaceholder').style.display = 'none';
    btn.disabled = false;
    btn.innerHTML = '<span>✨</span> Paint This Scene';
  };
  img.onerror = function() {
    btn.disabled = false;
    btn.innerHTML = '<span>🔄</span> Try Again';
  };
  img.src = url;
}


// ==================== CHEAT CODES ====================
// Type these in the command box to activate cheats
// Example: type "cheat godmode" to get all items and max trust

function processCheat(code) {
  const parts = code.split(' ');
  const cheat = parts[1] ? parts[1].toLowerCase() : '';

  switch(cheat) {
    case 'godmode':
    case 'all':
      // Give all items
      addItem('Dew Pebble', '💧');
      addItem('Memory Acorn', '🌰');
      addItem('Rootkey Flute', '🎵');
      addItem('Laughing Pollen Pouch', '😄');
      addItem('Sunseed Compass', '🧭');
      addItem('Rainbell Shell', '🐚');
      addItem('Moonpetal Mirror', '🪞');
      addItem('Thornproof Ribbon', '🎀');
      // Max trust
      gameState.trust.flowers = 100;
      gameState.trust.trees = 100;
      gameState.trust.animals = 100;
      modifyTrust('flowers', 0);
      modifyTrust('trees', 0);
      modifyTrust('animals', 0);
      // All song pieces
      gameState.songPieces = ['rhythm', 'reflection', 'voice', 'harmony', 'return', 'skyseed'];
      updateSongDisplay();
      // All flags
      gameState.flags.thistledownHeard = true;
      gameState.flags.helpedFledgling = true;
      // All clues
      addClue('Dew reveals shy truths');
      addClue('Willow roots marked 7-5-3');
      addClue('Bridge rhythm: three notes, silence, two notes');
      addClue('Root door code: knock, pause, knock-knock');
      addClue('The Old Promise: Voice + Rhythm = Harmony');
      addClue('The final note was hidden by someone who was laughed over');
      addClue('Buttercup pattern: yellow-white-yellow-blue');
      addClue('Hidden tools in plain sight');
      addClue('Count backwards before the true hour');
      addClue('The compass points to kindness');
      addClue('Water answers order: outer, inner, stillness');
      addClue('Patience opens the maze');
      addClue('The final note must be invited back, not demanded');
      addClue('The Moonpetal Mirror shows intended meaning');
      addClue('Helping the lost raises friendship ending');
      addClue('Thistledown hid the note from hurt, not malice');
      addClue('The Skyseed requires voice and rhythm together');
      addClue('The Festival began as a conversation');
      // Discover all regions
      discoverRegion('grove');
      discoverRegion('market');
      discoverRegion('root_library');
      discoverRegion('pond');
      discoverRegion('orchard');
      discoverRegion('maze');
      discoverRegion('clearing');
      discoverRegion('festival');
      addStoryText("<p class='artifact-found'>⚡ CHEAT ACTIVATED: God Mode — All items, max trust, all song pieces, all flags set!</p>");
      break;

    case 'items':
    case 'inventory':
      addItem('Dew Pebble', '💧');
      addItem('Memory Acorn', '🌰');
      addItem('Rootkey Flute', '🎵');
      addItem('Laughing Pollen Pouch', '😄');
      addItem('Sunseed Compass', '🧭');
      addItem('Rainbell Shell', '🐚');
      addItem('Moonpetal Mirror', '🪞');
      addItem('Thornproof Ribbon', '🎀');
      addStoryText("<p class='artifact-found'>⚡ CHEAT: All items added to inventory!</p>");
      break;

    case 'trust':
    case 'love':
      gameState.trust.flowers = 100;
      gameState.trust.trees = 100;
      gameState.trust.animals = 100;
      modifyTrust('flowers', 0);
      modifyTrust('trees', 0);
      modifyTrust('animals', 0);
      addStoryText("<p class='artifact-found'>⚡ CHEAT: All trust meters maxed to 100%!</p>");
      break;

    case 'songs':
    case 'music':
      gameState.songPieces = ['rhythm', 'reflection', 'voice', 'harmony', 'return', 'skyseed'];
      updateSongDisplay();
      addStoryText("<p class='artifact-found'>⚡ CHEAT: All 6 song fragments collected!</p>");
      break;

    case 'flags':
    case 'story':
      gameState.flags.thistledownHeard = true;
      gameState.flags.helpedFledgling = true;
      addStoryText("<p class='artifact-found'>⚡ CHEAT: Story flags set — Thistledown heard and Fledgling helped!</p>");
      break;

    case 'jump':
    case 'teleport':
      if (parts[2]) {
        const target = parts[2].toLowerCase();
        const sceneMap = {
          'meadow': 'meadow_gate',
          'puddle': 'puddle_mirror',
          'bench': 'buttercup_bench',
          'willow': 'willow_steps',
          'tunnel': 'root_tunnel_early',
          'promise': 'old_promise',
          'daisy': 'daisy_circle',
          'bridge': 'humming_bridge',
          'grove': 'dancing_grove',
          'dance': 'dance_with_trees',
          'arch': 'petal_arch',
          'market': 'petal_market',
          'lavender': 'lavender_stall',
          'clock': 'clock_tower',
          'snapdragon': 'seed_trader',
          'library': 'root_tunnel_library',
          'pond': 'rainbell_pond',
          'orchard': 'moonlit_orchard',
          'maze': 'thorn_maze',
          'clearing': 'silent_clearing',
          'thistledown': 'thistledown_listen',
          'festival': 'festival_preparation',
          'ending': 'ending_calculation'
        };
        const sceneId = sceneMap[target];
        if (sceneId && scenes[sceneId]) {
          loadScene(sceneId);
          addStoryText(`<p class='artifact-found'>⚡ CHEAT: Teleported to ${scenes[sceneId].title}!</p>`);
        } else {
          addStoryText("<p class='narrator'>Unknown location. Try: meadow, market, pond, maze, clearing, ending, etc.</p>");
        }
      } else {
        addStoryText("<p class='narrator'>Usage: cheat jump [location] — e.g., 'cheat jump market'</p>");
      }
      break;

    case 'clues':
      addClue('Dew reveals shy truths');
      addClue('Willow roots marked 7-5-3');
      addClue('Bridge rhythm: three notes, silence, two notes');
      addClue('Root door code: knock, pause, knock-knock');
      addClue('The Old Promise: Voice + Rhythm = Harmony');
      addClue('The final note was hidden by someone who was laughed over');
      addClue('Buttercup pattern: yellow-white-yellow-blue');
      addClue('Hidden tools in plain sight');
      addClue('Count backwards before the true hour');
      addClue('The compass points to kindness');
      addClue('Water answers order: outer, inner, stillness');
      addClue('Patience opens the maze');
      addClue('The final note must be invited back, not demanded');
      addClue('The Moonpetal Mirror shows intended meaning');
      addClue('Helping the lost raises friendship ending');
      addClue('Thistledown hid the note from hurt, not malice');
      addClue('The Skyseed requires voice and rhythm together');
      addClue('The Festival began as a conversation');
      addStoryText("<p class='artifact-found'>⚡ CHEAT: All 18 clues added to journal!</p>");
      break;

    case 'artifacts':
    case 'secrets':
      // Mark all artifacts as found
      for (const sceneId in artifactRegistry) {
        artifactRegistry[sceneId].forEach(function(a) {
          gameState.foundArtifacts.add(a.id);
        });
      }
      updateArtifactDisplay();
      addStoryText(`<p class='artifact-found'>⚡ CHEAT: All ${getTotalArtifacts()} secrets found!</p>`);
      break;

    case 'help':
    case 'list':
      addStoryText(`<div class='riddle-box'><p><strong>Available Cheat Codes:</strong></p>
        <p style='margin-top:10px;'>cheat godmode — All items, max trust, all songs, all flags<br>
        cheat items — Give all inventory items<br>
        cheat trust — Max all trust meters<br>
        cheat songs — Collect all song fragments<br>
        cheat flags — Set story flags (Thistledown heard, Fledgling helped)<br>
        cheat jump [location] — Teleport to any scene<br>
        cheat clues — Add all clues to journal<br>
        cheat secrets — Find all hidden secrets<br>
        cheat help — Show this list</p></div>`);
      break;

    default:
      addStoryText("<p class='narrator'>Unknown cheat. Type 'cheat help' for available codes.</p>");
  }
}


// ==================== VOICE SELECTOR ====================
function populateVoiceList() {
  if (typeof speechSynthesis === 'undefined') return;

  const voiceSelect = document.getElementById('voiceSelect');
  if (!voiceSelect) return;

  const voices = speechSynthesis.getVoices();

  // iOS-specific: filter to only working voices
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const iOSVoiceNames = ['Samantha', 'Karen', 'Daniel', 'Moira', 'Tessa', 'Alex', 'Fred', 'Victoria', 'Sara', 'Anna', 'Melina'];

  let availableVoices = voices;
  if (isIOS) {
    availableVoices = voices.filter(function(v) {
      return iOSVoiceNames.some(function(name) { return v.name.includes(name); });
    });
  }

  // Clear and repopulate
  voiceSelect.innerHTML = '<option value="">Default Voice</option>';

  availableVoices.forEach(function(voice) {
    const option = document.createElement('option');
    option.textContent = voice.name + ' (' + voice.lang + ')';
    option.setAttribute('data-name', voice.name);
    voiceSelect.appendChild(option);
  });
}

// Initialize voices when available
if (typeof speechSynthesis !== 'undefined') {
  populateVoiceList();
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
  }
}

function getSelectedVoice() {
  const voiceSelect = document.getElementById('voiceSelect');
  if (!voiceSelect || !voiceSelect.selectedOptions[0]) return null;

  const selectedName = voiceSelect.selectedOptions[0].getAttribute('data-name');
  if (!selectedName) return null;

  const voices = speechSynthesis.getVoices();
  return voices.find(function(v) { return v.name === selectedName; });
}

// Override speakCurrentScene to use selected voice
const originalSpeakCurrentScene = speakCurrentScene;
speakCurrentScene = function() {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  const scene = scenes[gameState.currentScene];
  const descFn = sceneDescriptions[gameState.currentScene];
  let text = '';
  if (descFn) {
    const temp = document.createElement('div');
    temp.innerHTML = descFn();
    text = temp.textContent || temp.innerText || '';
  }
  if (!text) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 1.1;

  // Use selected voice if available
  const selectedVoice = getSelectedVoice();
  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  const btn = document.getElementById('voiceBtn');
  btn.classList.add('speaking');
  utterance.onend = function() { btn.classList.remove('speaking'); };
  window.speechSynthesis.speak(utterance);
};

// ==================== TUTORIAL & REST AREA ====================
function showTutorial() {
  const overlay = document.getElementById('tutorialOverlay');
  if (overlay) {
    overlay.style.display = 'flex';
  }
}

function closeTutorial() {
  const overlay = document.getElementById('tutorialOverlay');
  if (overlay) {
    overlay.style.display = 'none';
  }
  // Mark tutorial as seen
  localStorage.setItem('returningSongs_tutorialSeen', 'true');
}

function showRestArea() {
  const rest = document.getElementById('restArea');
  if (rest) {
    rest.style.display = 'flex';
  }
}

function closeRestArea() {
  const rest = document.getElementById('restArea');
  if (rest) {
    rest.style.display = 'none';
  }
}

// Auto-show tutorial for first-time players
function checkFirstTime() {
  const hasSeen = localStorage.getItem('returningSongs_tutorialSeen');
  if (!hasSeen) {
    setTimeout(showTutorial, 1500);
  }
}

// Rest prompt after every 5 scene changes
const originalLoadScene = loadScene;
let sceneChangeCount = parseInt(localStorage.getItem('returningSongs_sceneCount') || '0');

loadScene = function(sceneId) {
  originalLoadScene(sceneId);
  sceneChangeCount++;
  localStorage.setItem('returningSongs_sceneCount', sceneChangeCount.toString());

  // Suggest rest every 5 scenes
  if (sceneChangeCount > 0 && sceneChangeCount % 5 === 0) {
    setTimeout(function() {
      addStoryText(`<div style='background:linear-gradient(135deg,#e3f2fd,#bbdefb);border-left:4px solid var(--water-deep);padding:10px 15px;margin:10px 0;border-radius:0 10px 10px 0;font-size:0.9rem;color:var(--bark);'>
        🌙 <strong>The land whispers:</strong> "You have travelled far, brave one. Would you like to <button onclick='showRestArea()' style='background:var(--water-deep);color:white;border:none;border-radius:10px;padding:3px 10px;cursor:pointer;font-family:"Cinzel",serif;'>rest a while</button> before continuing?"
      </div>`);
    }, 2000);
  }
};

// Check first time on page load
window.addEventListener('load', checkFirstTime);
