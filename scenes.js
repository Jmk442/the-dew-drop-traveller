// ==================== GAME STATE ====================
const gameState = {
  currentScene: "meadow_gate",
  path: null,
  inventory: [],
  clues: [],
  trust: { flowers: 20, trees: 20, animals: 10 },
  songPieces: [],
  discoveredRegions: ["meadow"],
  flags: {},
  stage: 1,
  voiceEnabled: false,
  autoImages: true,
  visitedScenes: new Set(),
  foundArtifacts: new Set(),
  sceneVisitCount: {}
};

// ==================== ARTIFACT REGISTRY ====================
const artifactRegistry = {
  meadow_gate: [
    { id: "mg_1", name: "First Impression", desc: "The flowers noticed you approached quietly", type: "immediate", icon: "👁️" },
    { id: "mg_2", name: "Hidden Puddle", desc: "You spotted the strange puddle", type: "immediate", icon: "💧" },
    { id: "mg_3", name: "Three Voices", desc: "You listened to all three flowers", type: "hidden", icon: "👂" }
  ],
  puddle_mirror: [
    { id: "pm_1", name: "Reflection Truth", desc: "You saw what was behind the reflection", type: "immediate", icon: "🪞" },
    { id: "pm_2", name: "Violet Trust", desc: "The Violet shared a secret", type: "immediate", icon: "🌸" }
  ],
  take_pebble: [
    { id: "tp_1", name: "Dew Pebble", desc: "A magical stone that reveals shy truths", type: "immediate", icon: "💎" }
  ],
  buttercup_bench: [
    { id: "bb_1", name: "Scarecrow Wisdom", desc: "The scarecrow spoke to you", type: "immediate", icon: "🎃" },
    { id: "bb_2", name: "Willow Numbers", desc: "You noticed the 7-5-3 pattern", type: "hidden", icon: "🔢" },
    { id: "bb_3", name: "Color Pattern", desc: "You saw the yellow-white-yellow-blue sequence", type: "hidden", icon: "🎨" }
  ],
  scarecrow_pocket: [
    { id: "sp_1", name: "Memory Acorn", desc: "Stores lost voices and memories", type: "immediate", icon: "🌰" },
    { id: "sp_2", name: "Root Memory", desc: "Roots remember what branches forget", type: "immediate", icon: "🌿" }
  ],
  willow_steps: [
    { id: "ws_1", name: "Ancient Willow", desc: "You found the secret entrance", type: "immediate", icon: "🌳" },
    { id: "ws_2", name: "Counting Code", desc: "Seven for sky, five for heart, three for root", type: "hidden", icon: "📐" }
  ],
  root_tunnel_early: [
    { id: "rte_1", name: "Secret Library", desc: "Found the hidden Root-Tunnel entrance", type: "immediate", icon: "📚" },
    { id: "rte_2", name: "Bioluminescence", desc: "The moss pulses like a heartbeat", type: "hidden", icon: "✨" }
  ],
  old_promise: [
    { id: "op_1", name: "The Old Promise", desc: "Voice + Rhythm = Harmony", type: "immediate", icon: "📜" },
    { id: "op_2", name: "Hidden Note", desc: "Someone was laughed over, not stolen from", type: "hidden", icon: "📝" }
  ],
  daisy_circle: [
    { id: "dc_1", name: "Daisy Code", desc: "Yellow-white-yellow-blue pattern memorized", type: "immediate", icon: "🌼" },
    { id: "dc_2", name: "Market Hint", desc: "The merchant who sleeps knows the price of dreams", type: "hidden", icon: "💭" }
  ],
  humming_bridge: [
    { id: "hb_1", name: "Bridge Rhythm", desc: "Three notes, silence, two notes", type: "immediate", icon: "🎵" },
    { id: "hb_2", name: "Echo Riddle", desc: "Solved the bridge riddle", type: "hidden", icon: "🔊" }
  ],
  dancing_grove: [
    { id: "dg_1", name: "Dancing Trees", desc: "You witnessed the grove dance", type: "immediate", icon: "💃" },
    { id: "dg_2", name: "Oak Sorrow", desc: "The Oak forgets, but wants to remember", type: "hidden", icon: "🌳" }
  ],
  dance_with_trees: [
    { id: "dwt_1", name: "Rootkey Flute", desc: "Earned by dancing the true rhythm", type: "immediate", icon: "🎶" },
    { id: "dwt_2", name: "Tree Trust", desc: "The trees accepted you as a listener", type: "immediate", icon: "🤝" },
    { id: "dwt_3", name: "Rhythm Piece", desc: "First fragment of the Festival Song", type: "immediate", icon: "🎼" }
  ],
  petal_arch: [
    { id: "pa_1", name: "Stage 1 Complete", desc: "The meadow has taught you what it can", type: "immediate", icon: "✅" },
    { id: "pa_2", name: "Broken Arch", desc: "Missing petals hint at missing song pieces", type: "hidden", icon: "🌸" }
  ],
  petal_market: [
    { id: "pmkt_1", name: "Market Bustle", desc: "You entered the social heart of the land", type: "immediate", icon: "🏪" },
    { id: "pmkt_2", name: "Rumour Heard", desc: "The final note was hidden, not stolen", type: "hidden", icon: "👂" },
    { id: "pmkt_3", name: "Three Paths", desc: "Discovered Lavender, Clock, and Seed-Trader", type: "hidden", icon: "📍" }
  ],
  lavender_stall: [
    { id: "ls_1", name: "Sleepy Merchant", desc: "The Lavender dozes but dreams wisely", type: "immediate", icon: "💜" },
    { id: "ls_2", name: "Jar Puzzle", desc: "Colors of calm: purple, blue, white, green", type: "hidden", icon: "🧩" },
    { id: "ls_3", name: "Mine Riddle", desc: "Pencil lead: hidden tools in plain sight", type: "hidden", icon: "⛏️" }
  ],
  lavender_helped: [
    { id: "lh_1", name: "Laughing Pollen", desc: "Reveals hidden ink, softens hearts", type: "immediate", icon: "😄" },
    { id: "lh_2", name: "Patience Reward", desc: "Sorting with care earned trust", type: "immediate", icon: "💝" }
  ],
  clock_tower: [
    { id: "ct_1", name: "Backwards Time", desc: "The dandelion clocks spin in reverse", type: "immediate", icon: "🕐" },
    { id: "ct_2", name: "Map Riddle", desc: "Cities without houses, mountains without trees", type: "hidden", icon: "🗺️" }
  ],
  clock_solved: [
    { id: "cs_1", name: "Region Map", desc: "Discovered Pond, Orchard, and Maze locations", type: "immediate", icon: "🗺️" },
    { id: "cs_2", name: "Patience Lesson", desc: "Count backwards before the true hour", type: "immediate", icon: "⏳" }
  ],
  seed_trader: [
    { id: "st_1", name: "Crying Snapdragon", desc: "Her compass was more than direction", type: "immediate", icon: "🏕️" },
    { id: "st_2", name: "Warmth Compass", desc: "The seeds point to kindness, not north", type: "hidden", icon: "🧭" }
  ],
  snapdragon_comforted: [
    { id: "sc_1", name: "Sunseed Compass", desc: "Points to warmth and kindness", type: "immediate", icon: "🧭" },
    { id: "sc_2", name: "True Comfort", desc: "You gave presence, not just words", type: "immediate", icon: "💚" },
    { id: "sc_3", name: "Maze Hint", desc: "Warmth guides better than direction", type: "hidden", icon: "🔥" }
  ],
  snapdragon_trade: [
    { id: "stx_1", name: "Cold Compass", desc: "Taken, not given. Its warmth is dimmed.", type: "immediate", icon: "🧭" },
    { id: "stx_2", name: "Hard Lesson", desc: "Some things cannot be traded, only given", type: "immediate", icon: "💨" }
  ],
  root_tunnel_entrance: [
    { id: "rte2_1", name: "Living Door", desc: "Wood that expects a sequence", type: "immediate", icon: "🚪" },
    { id: "rte2_2", name: "Knock Code", desc: "Knock, pause, knock-knock", type: "hidden", icon: "✊" }
  ],
  root_tunnel_library: [
    { id: "rtl_1", name: "Library Opened", desc: "Borrow memory, return meaning", type: "immediate", icon: "📚" },
    { id: "rtl_2", name: "Root Reader", desc: "A scholar who writes in root-script", type: "hidden", icon: "✍️" }
  ],
  first_festival: [
    { id: "ff_1", name: "First Song", desc: "The Festival began as conversation", type: "immediate", icon: "🎉" },
    { id: "ff_2", name: "Skyseed Origin", desc: "A living promise of harmony", type: "hidden", icon: "☁️" }
  ],
  thistledown_lore: [
    { id: "tl_1", name: "Thistledown Pain", desc: "Hidden from hurt, not malice", type: "immediate", icon: "🌵" },
    { id: "tl_2", name: "Invitation Key", desc: "The note must be invited back", type: "immediate", icon: "💌" }
  ],
  skyseed_lore: [
    { id: "sl_1", name: "Skyseed Truth", desc: "Requires voice AND rhythm together", type: "immediate", icon: "☁️" },
    { id: "sl_2", name: "Apology Seed", desc: "Too light for soil, too full of hope", type: "hidden", icon: "🌱" }
  ],
  rainbell_pond: [
    { id: "rp_1", name: "Reed Bells", desc: "Chiming out of tune, waiting for voice", type: "immediate", icon: "🔔" },
    { id: "rp_2", name: "Ripple Pattern", desc: "Outer, inner, then stillness", type: "hidden", icon: "〰️" },
    { id: "rp_3", name: "Echo Riddle", desc: "I speak without a mouth...", type: "hidden", icon: "🗣️" }
  ],
  pond_singing: [
    { id: "ps_1", name: "Rainbell Shell", desc: "Rings water-memory patterns", type: "immediate", icon: "🐚" },
    { id: "ps_2", name: "Reflection Piece", desc: "Second fragment of the Festival Song", type: "immediate", icon: "🎼" },
    { id: "ps_3", name: "Water Trust", desc: "The pond remembers music again", type: "immediate", icon: "💧" }
  ],
  moonlit_orchard: [
    { id: "mo_1", name: "Glass Apples", desc: "Showing face and feelings", type: "immediate", icon: "🍎" },
    { id: "mo_2", name: "Moth Lantern", desc: "Leading to hidden truths", type: "hidden", icon: "🦋" },
    { id: "mo_3", name: "Honesty Gate", desc: "Name a feeling honestly", type: "hidden", icon: "💭" }
  ],
  glass_apple: [
    { id: "ga_1", name: "Moonpetal Mirror", desc: "Shows intended meaning behind words", type: "immediate", icon: "🪞" },
    { id: "ga_2", name: "True Reflection", desc: "The apple shows intent, not appearance", type: "immediate", icon: "✨" }
  ],
  thorn_maze: [
    { id: "tm_1", name: "Patient Maze", desc: "Thorns lean away from safe paths", type: "immediate", icon: "🌿" },
    { id: "tm_2", name: "Lost Fledgling", desc: "A small bird needs help", type: "hidden", icon: "🐦" },
    { id: "tm_3", name: "Footsteps Riddle", desc: "The more you take, the more you leave", type: "hidden", icon: "👣" }
  ],
  maze_wait: [
    { id: "mw_1", name: "Thornproof Ribbon", desc: "Shimmers with protective light", type: "immediate", icon: "🎀" },
    { id: "mw_2", name: "Patience Reward", desc: "Waiting revealed the hidden path", type: "immediate", icon: "⏳" }
  ],
  help_fledgling: [
    { id: "hf_1", name: "Fledgling Song", desc: "A perfect note of gratitude", type: "immediate", icon: "🎵" },
    { id: "hf_2", name: "Kindness Echo", desc: "The thorns soften for gentleness", type: "immediate", icon: "💚" },
    { id: "hf_3", name: "Friendship Boost", desc: "Helping the lost raises ending condition", type: "hidden", icon: "⭐" }
  ],
  silent_clearing: [
    { id: "scl_1", name: "Silent Place", desc: "Where voices go to rest", type: "immediate", icon: "🌑" },
    { id: "scl_2", name: "Thistledown Found", desc: "The keeper of the final note", type: "immediate", icon: "🌵" },
    { id: "scl_3", name: "Three Choices", desc: "Listen, mirror, or pollen", type: "hidden", icon: "🎯" }
  ],
  thistledown_listen: [
    { id: "tlis_1", name: "True Listening", desc: "You sat in silence and heard", type: "immediate", icon: "👂" },
    { id: "tlis_2", name: "Carelessness Cut", desc: "Deeper than cruelty", type: "hidden", icon: "💔" },
    { id: "tlis_3", name: "Return Invitation", desc: "The note will come when invited", type: "immediate", icon: "💌" }
  ],
  festival_preparation: [
    { id: "fprep_1", name: "Festival Grounds", desc: "Flowers and trees gather", type: "immediate", icon: "🎊" },
    { id: "fprep_2", name: "Song Audit", desc: "Counting what you have gathered", type: "hidden", icon: "📊" }
  ],
  ending_calculation: [
    { id: "end_1", name: "Journey Complete", desc: "Your choices shaped the ending", type: "immediate", icon: "🏆" },
    { id: "end_2", name: "Land Remembers", desc: "The Land of Returning Songs knows you", type: "immediate", icon: "🌟" }
  ]
};


// ==================== SCENE DESCRIPTIONS ====================
const sceneDescriptions = {
  meadow_gate: function() {
    findArtifact("meadow_gate", "mg_1");
    findArtifact("meadow_gate", "mg_2");
    return `<p class='narrator'>You stand at the edge of the Whispering Meadow, where the grass hums beneath your feet and the air smells of honey and old stories.</p>
           <p>Before you, three flowers argue in whispers — a bright <strong>Marigold</strong>, a trembling <strong>Violet</strong>, and a proud <strong>Dandelion</strong>. They fall silent as you approach.</p>
           <p class='flower-speech'>"A traveller!" the Marigold declares. "But do they <em>listen</em>, or do they merely <em>hear</em>?"</p>
           <p class='flower-speech'>"Sh-sh-she looks kind..." the Violet whispers, half-hiding behind a leaf.</p>
           <p class='flower-speech'>"Kindness is not enough," the Dandelion huffs. "The Festival Song is broken. The trees forget their dances. We need someone who can <strong>restore what was lost</strong>."</p>
           <p>The meadow stretches in every direction. To the <strong>north</strong>, you hear music — faint and broken. To the <strong>east</strong>, a grove of trees sways though there is no wind. To the <strong>south</strong>, a path leads deeper into flowers. And here, at your feet, a <strong>puddle</strong> catches the light strangely.</p>`;
  },

  puddle_mirror: function() {
    findArtifact("puddle_mirror", "pm_1");
    findArtifact("puddle_mirror", "pm_2");
    return `<p class='narrator'>You kneel beside the puddle. It is not ordinary water — it holds the sky too perfectly, too still.</p>
           <p>When you look closely, you see your reflection... but behind your reflection, something else moves. A shape. A <strong>truth waiting to be seen</strong>.</p>
           <p class='flower-speech'>"Dew reveals shy truths," a small voice says. It is the Violet, who has crept closer. "Things that hide in plain sight."</p>
           <p>There is a <strong>Dew Pebble</strong> at the bottom of the puddle, smooth and cool. It seems to glow faintly.</p>`;
  },

  take_pebble: function() {
    findArtifact("take_pebble", "tp_1");
    return `<p class='narrator'>You reach into the puddle. The water is warm, like a memory. Your fingers close around the pebble.</p>
           <p>As you lift it, the puddle ripples once — not from your touch, but as if sighing. The pebble fits in your palm like it was always meant to be there.</p>
           <p class='clue-found'>💧 <strong>Clue Found:</strong> "Dew reveals shy truths" — things hidden in reflections may show their true shape.</p>
           <p>The Violet nods approvingly. "You listened to the water. That is rare."</p>`;
  },

  buttercup_bench: function() {
    findArtifact("buttercup_bench", "bb_1");
    return `<p class='narrator'>A circle of buttercups grows around a mossy stone bench. The flowers here are quiet — too quiet. They watch you with hundreds of tiny golden eyes.</p>
           <p>On the bench sits an <strong>Old Scarecrow</strong>, slumped but not asleep. His button eyes gleam with unexpected awareness.</p>
           <p class='tree-speech'>"Lost things find the patient," the Scarecrow creaks. "Check my pocket. The willow knows."</p>
           <p>His straw finger points toward a distant <strong>willow tree</strong> with roots that seem to form numbers: <strong>7... 5... 3...</strong></p>
           <p>There is something in his pocket. And the buttercups seem arranged: <strong>yellow, white, yellow, blue</strong>.</p>`;
  },

  scarecrow_pocket: function() {
    findArtifact("scarecrow_pocket", "sp_1");
    findArtifact("scarecrow_pocket", "sp_2");
    return `<p class='narrator'>You reach into the scarecrow's pocket. Inside is an acorn — warm, and when held to your ear, you hear a faint melody.</p>
           <p class='clue-found'>🌰 <strong>Item Found:</strong> Memory Acorn — stores lost voices and memories.</p>
           <p class='clue-found'>🔍 <strong>Clue Found:</strong> Willow roots marked <strong>7-5-3</strong>. Numbers in nature are never accidental.</p>
           <p class='clue-found'>🔍 <strong>Clue Found:</strong> Buttercup pattern: <strong>yellow-white-yellow-blue</strong>.</p>
           <p>The Scarecrow's head tilts. "Roots remember what branches forget."</p>`;
  },

  willow_steps: function() {
    findArtifact("willow_steps", "ws_1");
    return `<p class='narrator'>The willow tree is ancient. Its roots twist through the earth like a story written in cursive. Where they break the surface: <strong>7</strong>, then <strong>5</strong>, then <strong>3</strong>.</p>
           <p>Between the roots, a dark gap leads downward. The air smells of old paper and growing things.</p>
           <p class='tree-speech'>"Seven for the sky, five for the heart, three for the root. Count true, and the library opens."</p>`;
  },

  root_tunnel_early: function() {
    findArtifact("root_tunnel_early", "rte_1");
    return `<p class='narrator'>You descend between the willow roots. The tunnel glows with bioluminescent moss that pulses like a slow heartbeat.</p>
           <p>Shelves grow from living wood, holding books of bark, leaf, and pressed flower. A <strong>Root Reader</strong> sits at a stump desk.</p>
           <p class='tree-speech'>"Few find this path. You counted the willow's numbers."</p>
           <p>They slide a book toward you: <strong>"The Old Promise: Voice + Rhythm = Harmony"</strong>.</p>
           <p class='clue-found'>📖 <strong>Lore Unlocked:</strong> Voice and rhythm together create harmony. Neither alone is enough.</p>`;
  },

  old_promise: function() {
    findArtifact("old_promise", "op_1");
    findArtifact("old_promise", "op_2");
    return `<p class='narrator'>You open the bark book. Pages thin as moth wings, root-script shifting as you watch:</p>
           <div class='riddle-box'><p><strong>The Old Promise</strong></p>
           <p style='margin-top:10px;font-style:italic;'>
           "In the beginning, the Flowers sang and the Trees danced,<br>
           and the Song between them was the Festival.<br><br>
           But a voice that is only heard is not truly listened to.<br>
           And a rhythm that is only seen is not truly joined.<br><br>
           The Promise was this:<br>
           <strong>Voice needs Rhythm. Rhythm needs Voice.</strong><br>
           Together, they are Harmony."
           </p></div>
           <p class='flower-speech'>"Someone broke this promise not by stealing, but by <strong>being unheard</strong>. Find them, and you find the final note."</p>
           <p class='clue-found'>🔍 <strong>Clue Found:</strong> The final note was hidden by someone who was laughed over, not stolen by a villain.</p>`;
  },

  daisy_circle: function() {
    findArtifact("daisy_circle", "dc_1");
    return `<p class='narrator'>A perfect circle of daisies, but four stand taller:</p>
           <p style='text-align:center;font-size:2rem;margin:15px 0;'>🌼🤍🌼💙</p>
           <p><strong>Yellow, White, Yellow, Blue.</strong></p>
           <p>The Dandelion appears. "This pattern matters at the <strong>Petal Market</strong>. Remember: <em>the merchant who sleeps knows the price of dreams.</em>"</p>`;
  },

  humming_bridge: function() {
    findArtifact("humming_bridge", "hb_1");
    return `<p class='narrator'>A wooden bridge over a singing stream. But the song is broken — it hums, pauses, hums again.</p>
           <p style='text-align:center;font-size:1.5rem;margin:15px 0;font-family:monospace;'>♪ ♪ ♪ &nbsp;&nbsp; ... &nbsp;&nbsp; ♪ ♪</p>
           <p><strong>Three notes. Silence. Two notes.</strong></p>
           <p class='tree-speech'>"Long... short... short. This is the rhythm of welcoming."</p>
           <div class='riddle-box'><p><strong>The Bridge Riddle:</strong></p>
           <p style='margin-top:8px;'>"I sing without a mouth, I dance without feet.<br>
           I welcome the patient, but the hurried I greet<br>
           With silence. Count my song: three, then wait, then two.<br>
           What am I?" <em>(Answer: an echo)</em></p></div>`;
  },

  dancing_grove: function() {
    findArtifact("dancing_grove", "dg_1");
    return `<p class='narrator'>The trees here are <strong>dancing</strong>. Branches move in patterns: quick, slow, holding poses.</p>
           <p>An <strong>Oak</strong> in the center leads uncertainly. It pauses, extends a branch, pulls back.</p>
           <p class='tree-speech'>"We... forget," the Oak groans. "The rhythm was stolen. Or lost. Or hidden."</p>
           <p>A <strong>Willow</strong> traces circles. A <strong>Birch</strong> taps staccato. A <strong>Pine</strong> stands still, needles shimmering.</p>
           <p>If you match their rhythm — <strong>long, short, short</strong> — they might trust you.</p>`;
  },

  dance_with_trees: function() {
    findArtifact("dance_with_trees", "dwt_1");
    findArtifact("dance_with_trees", "dwt_2");
    findArtifact("dance_with_trees", "dwt_3");
    return `<p class='narrator'>You step into the center and move: <strong>Long... short... short.</strong></p>
           <p>The Oak's branches quiver. The Willow's circles align. The Birch finds your beat.</p>
           <p class='tree-speech'>"You <em>listen</em>," the Oak breathes. "They see our dance and call it wind."</p>
           <p>A root splits open, revealing a <strong>Rootkey Flute</strong>, carved with spirals.</p>
           <p class='tree-speech'>"The doors below remember this sound. Knock, pause, knock-knock."</p>
           <p class='clue-found'>🎵 <strong>Item Found:</strong> Rootkey Flute — opens sequence-based root doors.</p>
           <p class='clue-found'>🔍 <strong>Clue Found:</strong> Root door code: knock, pause, knock-knock.</p>`;
  },

  petal_arch: function() {
    findArtifact("petal_arch", "pa_1");
    var hasDew = gameState.clues.includes("Dew reveals shy truths");
    var hasWillow = gameState.clues.includes("Willow roots marked 7-5-3");
    var hasBridge = gameState.clues.includes("Bridge rhythm: three notes, silence, two notes");
    var hasFlute = gameState.inventory.includes("Rootkey Flute");
    return `<p class='narrator'>An arch of woven flowers marks the boundary. But it droops — petals missing, weave broken.</p>
           <p>This is a <strong>checkpoint</strong>. The land watches how you travelled.</p>
           <div class='riddle-box'><p><strong>The Meadow's Recap:</strong></p>
           <p style='margin-top:10px;font-style:italic;'>
           ${hasDew ? "✓ They noticed dew reveals shy truths.<br>" : "○ They missed the puddle's secret.<br>"}
           ${hasWillow ? "✓ They read the willow's numbers.<br>" : "○ They did not count the roots.<br>"}
           ${hasBridge ? "✓ They heard the bridge's song.<br>" : "○ They crossed without listening.<br>"}
           ${hasFlute ? "✓ They danced with the trees.<br>" : "○ The trees still wait.<br>"}
           <br>
           ${gameState.trust.flowers > 30 ? "The flowers speak more freely now.<br>" : "The flowers remain cautious.<br>"}
           ${gameState.trust.trees > 30 ? "The trees remember their rhythm." : "The trees still forget their steps."}
           </p></div>
           <p>Beyond the arch: the <strong>Petal Market</strong>. New voices. New riddles.</p>
           <p class='flower-speech'>"Go forward. Remember: <strong>the merchant who sleeps knows the price of dreams.</strong>"</p>`;
  },

  petal_market: function() {
    findArtifact("petal_market", "pmkt_1");
    findArtifact("petal_market", "pmkt_2");
    return `<p class='narrator'>The Petal Market is alive with color. Flowers sell goods from stalls of petals and leaves. But tension hums beneath.</p>
           <p>A <strong>Lavender</strong> dozes at her stall — jars mixed up. A <strong>Dandelion Clock Tower</strong> ticks backwards. A <strong>Snapdragon</strong> weeps quietly.</p>
           <p class='flower-speech'>"The final note is hidden," a Rose whispers. "By someone laughed over at the Festival long ago."</p>
           <p>Paths: <strong>Lavender Stall</strong> (west), <strong>Clock Tower</strong> (north), <strong>Seed-Trader's Tent</strong> (east). Or <strong>south</strong> back, <strong>down</strong> to Root-Tunnel.</p>`;
  },

  lavender_stall: function() {
    findArtifact("lavender_stall", "ls_1");
    return `<p class='narrator'>The Lavender merchant stirs in sleep. Her jars are scattered: <strong>green, purple, white, blue</strong>.</p>
           <p>A sign reads: <strong>"Sort by the color of calm: purple, blue, white, green."</strong></p>
           <p class='flower-speech'>"Help me... The Laughing Pollen must be found before the Festival..."</p>
           <div class='riddle-box'><p><strong>Sleepy Merchant's Riddle:</strong></p>
           <p style='margin-top:8px;'>"I am taken from a mine and shut in a wooden case,<br>
           yet everyone uses me. What am I?" <em>(Answer: pencil lead)</em></p></div>`;
  },

  lavender_helped: function() {
    findArtifact("lavender_helped", "lh_1");
    findArtifact("lavender_helped", "lh_2");
    return `<p class='narrator'>You rearrange the jars: <strong>purple, blue, white, green</strong> — colors of calm.</p>
           <p>The Lavender's eyes open. She reaches beneath her stall and produces a glowing pouch.</p>
           <p class='flower-speech'>"The Laughing Pollen Pouch. It reveals hidden ink and softens tense hearts."</p>
           <p class='clue-found'>🎒 <strong>Item Found:</strong> Laughing Pollen Pouch — reveals hidden messages.</p>
           <p class='clue-found'>🔍 <strong>Clue Found:</strong> Hidden tools in plain sight — like pencil lead in wood.</p>`;
  },

  clock_tower: function() {
    findArtifact("clock_tower", "ct_1");
    return `<p class='narrator'>The Clock Tower is made of hundreds of dandelion clocks, spinning <strong>backwards</strong>.</p>
           <div class='riddle-box'><p><strong>The Backwards Clock:</strong></p>
           <p style='margin-top:8px;'>"I have cities, but no houses.<br>
           I have mountains, but no trees.<br>
           I have water, but no fish.<br>
           I have roads, but no cars.<br>
           What am I?" <em>(Answer: a map)</em></p></div>
           <p>The clock counts backwards because it measures <strong>patience</strong>, not time.</p>`;
  },

  clock_solved: function() {
    findArtifact("clock_solved", "cs_1");
    findArtifact("clock_solved", "cs_2");
    return `<p class='narrator'>The answer: <strong>a map</strong>.</p>
           <p>The dandelion seeds rearrange, forming a region map:</p>
           <p>• The Meadow • The Dancing Grove • The Petal Market<br>
           • <strong>Rainbell Pond</strong> (east) • <strong>Moonlit Orchard</strong> (north) • <strong>Thorn Maze</strong> (west)</p>
           <p class='clue-found'>🔍 <strong>Clue Found:</strong> Count backwards before the true hour — patience reveals what haste hides.</p>`;
  },

  seed_trader: function() {
    findArtifact("seed_trader", "st_1");
    return `<p class='narrator'>The tent smells of earth. A <strong>Snapdragon</strong> cries behind a table of seeds.</p>
           <p class='flower-speech'>"I lost the Sunseed Compass. It points to warmth, not north. Someone said I was too small to hold it."</p>
           <p>Seeds on the table form a <strong>compass rose</strong> pointing toward candle warmth.</p>
           <p>You can <strong>comfort</strong> her, or <strong>trade</strong> coldly.</p>`;
  },

  snapdragon_comforted: function() {
    findArtifact("snapdragon_comforted", "sc_1");
    findArtifact("snapdragon_comforted", "sc_2");
    findArtifact("snapdragon_comforted", "sc_3");
    return `<p class='narrator'>You sit beside her. "The compass pointed to warmth because <em>you</em> are warm. You made the compass important."</p>
           <p>Her tears slow. "You understand. Here. Take it."</p>
           <p>She presses the <strong>Sunseed Compass</strong> into your hands. Warm, like a held breath.</p>
           <p class='clue-found'>🧭 <strong>Item Found:</strong> Sunseed Compass — points to kindness, not north.</p>
           <p class='clue-found'>🔍 <strong>Clue Found:</strong> Warmth guides better than direction in the Thorn Maze.</p>`;
  },

  snapdragon_trade: function() {
    findArtifact("snapdragon_trade", "stx_1");
    findArtifact("snapdragon_trade", "stx_2");
    return `<p class='narrator'>You bargain sharply. The Snapdragon flinches, hands over the compass. Her tears dry, but so does the warmth in her eyes.</p>
           <p>You have the compass, but it feels heavy. It points nowhere.</p>
           <p class='clue-found'>🧭 <strong>Item Found:</strong> Sunseed Compass — but its warmth is dimmed.</p>
           <p>Some things cannot be traded, only given.</p>`;
  },

  root_tunnel_entrance: function() {
    findArtifact("root_tunnel_entrance", "rte2_1");
    return `<p class='narrator'>A bark sign reads: <strong>"Borrow memory, return meaning."</strong></p>
           <p>A door of living wood. No handle — only knot patterns expecting a sequence.</p>
           <p>Remember: <strong>knock, pause, knock-knock</strong>.</p>`;
  },

  root_tunnel_library: function() {
    findArtifact("root_tunnel_library", "rtl_1");
    return `<p class='narrator'>You knock... pause... knock-knock. The door opens like a yawn.</p>
           <p>Inside: shelves of root and bark, bioluminescent moss in green-gold. The <strong>Root Reader</strong> looks up.</p>
           <p class='tree-speech'>"You know the knock. You have listened well."</p>
           <p>"Ask the roots for memory. But remember: <strong>borrow memory, return meaning</strong>."</p>
           <p>Ask about: <strong>festival</strong>, <strong>thistledown</strong>, or <strong>skyseed</strong>.</p>`;
  },

  first_festival: function() {
    findArtifact("first_festival", "ff_1");
    return `<p class='narrator'>A book of pressed lily petals unfolds in fragrance:</p>
           <div class='riddle-box'><p><strong>The First Festival</strong></p>
           <p style='margin-top:10px;font-style:italic;'>
           "Before walls or roads, there was the Meadow.<br>
           The first Flower sang. The first Tree danced.<br><br>
           They did not plan the Festival.<br>
           They simply <em>responded</em> to each other.<br><br>
           That warmth became the Skyseed —<br>
           the living promise that harmony is possible."
           </p></div>
           <p class='clue-found'>🔍 <strong>Lore:</strong> The Festival began as a conversation. The Skyseed is a living promise of harmony.</p>`;
  },

  thistledown_lore: function() {
    findArtifact("thistledown_lore", "tl_1");
    findArtifact("thistledown_lore", "tl_2");
    return `<p class='narrator'>The Reader pulls out a book bound in thistle, handled with care.</p>
           <div class='riddle-box'><p><strong>Thistledown's Song</strong></p>
           <p style='margin-top:10px;font-style:italic;'>
           "Thistledown was not always prickly.<br>
           They tried to sing at the Festival.<br>
           But their voice was small, and the crowd was loud.<br><br>
           So Thistledown hid the final note.<br>
           Not to be cruel. Because being unheard hurts more than being silent.<br><br>
           The prickles grew to protect the silence."
           </p></div>
           <p class='clue-found'>🔍 <strong>Lore:</strong> Thistledown hid the note from hurt, not malice. It must be <em>invited</em> back.</p>`;
  },

  skyseed_lore: function() {
    findArtifact("skyseed_lore", "sl_1");
    return `<p class='narrator'>A book of cloud and seed-pod, soft as down:</p>
           <div class='riddle-box'><p><strong>The Skyseed Promise</strong></p>
           <p style='margin-top:10px;font-style:italic;'>
           "When the first sincere apology was spoken,<br>
           the land could not hold it in soil.<br>
           It was too light, too full of hope.<br><br>
           So the land sent it upward.<br>
           It became the Skyseed —<br>
           a seed that grows in air, not earth.<br><br>
           It waits for voice and rhythm to return together."
           </p></div>
           <p class='clue-found'>🔍 <strong>Lore:</strong> The Skyseed requires voice and rhythm together.</p>`;
  },

  rainbell_pond: function() {
    findArtifact("rainbell_pond", "rp_1");
    return `<p class='narrator'>Reeds chime like bells, but out of tune. The water is too still.</p>
           <p>When you drop a pebble: <strong>outer ripple, inner ripple, then stillness</strong>.</p>
           <p class='tree-speech'>"Water answers order," the reeds whisper. "First the wide welcome, then the close truth, then quiet acceptance."</p>
           <p>You sense that if you match this pattern — perhaps by <strong>singing</strong> — the water might reveal something.</p>
           <div class='riddle-box'><p><strong>The Water's Riddle:</strong></p>
           <p style='margin-top:8px;'>"I speak without a mouth, hear without ears.<br>
           I have no body, but I come alive with wind.<br>
           What am I?" <em>(Answer: an echo)</em></p></div>`;
  },

  pond_singing: function() {
    findArtifact("pond_singing", "ps_1");
    findArtifact("pond_singing", "ps_2");
    findArtifact("pond_singing", "ps_3");
    return `<p class='narrator'>You sing — not loudly, but truly. Wide, then close, then quiet.</p>
           <p>The reeds chime in harmony. From the center, a <strong>Rainbell Shell</strong> floats up, glowing.</p>
           <p class='tree-speech'>"You gave voice to the pattern. Now the water will remember music."</p>
           <p class='clue-found'>🐚 <strong>Item Found:</strong> Rainbell Shell — rings water-memory patterns.</p>
           <p class='clue-found'>🔍 <strong>Clue Found:</strong> Water answers order: outer welcome, inner truth, quiet acceptance.</p>`;
  },

  moonlit_orchard: function() {
    findArtifact("moonlit_orchard", "mo_1");
    return `<p class='narrator'>Trees bear <strong>Glass Apples</strong> showing your face and feelings. A <strong>Moth Lantern</strong> flickers in a nook.</p>
           <p class='flower-speech'>"Name a feeling honestly," a Glass Apple seems to whisper. "And the orchard will give you its truth."</p>
           <p>You can <strong>examine</strong> the apples or <strong>follow</strong> the moths.</p>`;
  },

  glass_apple: function() {
    findArtifact("glass_apple", "ga_1");
    findArtifact("glass_apple", "ga_2");
    return `<p class='narrator'>You hold the Glass Apple. It shows not what you look like, but what you <em>intend</em>.</p>
           <p>Behind the tree, you find a <strong>Moonpetal Mirror</strong> — shows intended meaning behind words.</p>
           <p class='clue-found'>🪞 <strong>Item Found:</strong> Moonpetal Mirror — reveals hidden feelings.</p>`;
  },

  thorn_maze: function() {
    findArtifact("thorn_maze", "tm_1");
    return `<p class='narrator'>The maze is <strong>patient</strong>. It will not let you through quickly.</p>
           <p>The thorns lean <em>away</em> from safe paths. The test: <strong>wait, listen, step</strong>.</p>
           <p>A <strong>lost fledgling</strong> chirps from a nest, and a <strong>ribbon</strong> is tangled in brambles.</p>
           <div class='riddle-box'><p><strong>The Maze's Riddle:</strong></p>
           <p style='margin-top:8px;'>"The more you take, the more you leave behind.<br>
           What am I?" <em>(Answer: footsteps)</em></p></div>`;
  },

  maze_wait: function() {
    findArtifact("maze_wait", "mw_1");
    findArtifact("maze_wait", "mw_2");
    return `<p class='narrator'>You stand still. Listen. The thorns lean away from a left path.</p>
           <p>A breeze reveals a gap invisible moments ago.</p>
           <p class='clue-found'>🔍 <strong>Clue Found:</strong> Patience opens the maze — waiting reveals what rushing obscures.</p>
           <p>You find a <strong>Thornproof Ribbon</strong>, shimmering with protective light.</p>`;
  },

  help_fledgling: function() {
    findArtifact("help_fledgling", "hf_1");
    findArtifact("help_fledgling", "hf_2");
    findArtifact("help_fledgling", "hf_3");
    return `<p class='narrator'>The fledgling has fallen, frightened. You use the <strong>Thornproof Ribbon</strong> as a soft ladder back to the nest.</p>
           <p>It sings a single, perfect note — clear and grateful.</p>
           <p class='clue-found'>🔍 <strong>Clue Found:</strong> Helping the small and lost raises the friendship ending condition.</p>
           <p>The thorns seem softer, touched by gentleness.</p>`;
  },

  silent_clearing: function() {
    findArtifact("silent_clearing", "scl_1");
    findArtifact("silent_clearing", "scl_2");
    return `<p class='narrator'>Where voices go to rest. Flowers do not speak. Trees do not dance. Even the wind holds its breath.</p>
           <p>In the center, one flower faces away. Prickly, defensive, small.</p>
           <p class='flower-speech'>"I am Thistledown. I hid the final note. Not because I am cruel. Because I am tired of being unheard."</p>
           <p>You can <strong>listen</strong> without interrupting.</p>`;
  },

  thistledown_listen: function() {
    findArtifact("thistledown_listen", "tlis_1");
    findArtifact("thistledown_listen", "tlis_3");
    return `<p class='narrator'>You sit in silence. No advice. No promises to fix. Just <em>listening</em>.</p>
           <p>Thistledown's prickles lower. Their voice, like wind through dry grass:</p>
           <p class='flower-speech'>"I just wanted to sing one note that someone would remember. But they laughed. Carelessly. And carelessness cuts deeper than cruelty."</p>
           <p class='flower-speech'>"If you promise someone will <em>listen</em> this time... I will give you the final note. Because you heard me first."</p>
           <p class='clue-found'>🔍 <strong>Clue Found:</strong> The final note must be invited back, not demanded. Listening is the key.</p>`;
  },

  festival_preparation: function() {
    findArtifact("festival_preparation", "fprep_1");
    var hasRhythm = gameState.songPieces.includes("rhythm");
    var hasReflection = gameState.songPieces.includes("reflection");
    var hasThistledown = gameState.flags.thistledownHeard;
    return `<p class='narrator'>The Festival Green opens. Flowers gather in choirs. Trees arrange in circles. The air shimmers.</p>
           <p>The Song is still broken. You have gathered:</p>
           <p>${hasRhythm ? "✓ Rhythm (Dancing Grove)<br>" : "○ Rhythm missing<br>"}
           ${hasReflection ? "✓ Reflection (Rainbell Pond)<br>" : "○ Reflection missing<br>"}
           ${hasThistledown ? "✓ Return (Thistledown invited back)<br>" : "○ Return missing<br>"}</p>
           <p>The ending depends on what you gathered, whom you helped, and how you listened.</p>
           <p>When ready, <strong>begin</strong> the ceremony.</p>`;
  },

  ending_calculation: function() {
    findArtifact("ending_calculation", "end_1");
    findArtifact("ending_calculation", "end_2");
    var hasAll = gameState.songPieces.length >= 2 && gameState.flags.thistledownHeard;
    var highTrust = gameState.trust.flowers > 50 && gameState.trust.trees > 50;
    var heard = gameState.flags.thistledownHeard;
    var helped = gameState.flags.helpedFledgling;

    var title, desc;
    if (hasAll && heard && highTrust) {
      title = "🌟 Harmony Restored";
      desc = `<p class='narrator'>Flowers sing. Trees dance. Thistledown — no longer prickly — sings the final note.</p>
             <p>Not the loudest note. But the truest.</p>
             <p class='flower-speech'>"Thank you for listening. The Song was never broken. It was waiting for someone to hear all its parts."</p>
             <p class='clue-found'>🌟 <strong>Best Ending:</strong> Harmony Restored — You became the listener the land needed.</p>`;
    } else if (gameState.songPieces.includes("rhythm") && gameState.trust.trees > 60) {
      title = "🌳 Festival Guardian";
      desc = `<p class='narrator'>The trees crown you with woven leaves. You protect the rhythm for generations.</p>
             <p class='clue-found'>🌳 <strong>Ending:</strong> Festival Guardian — Keeper of future Festivals.</p>`;
    } else if (heard && helped && gameState.trust.flowers > 60) {
      title = "💝 Friendship Ending";
      desc = `<p class='narrator'>You sit with Thistledown, the Snapdragon, the Violet, and the grown fledgling.</p>
             <p>No grand ceremony. Just voices, finally heard. Just rhythms, finally joined.</p>
             <p class='clue-found'>💝 <strong>Ending:</strong> Friendship Restored — The strongest magic is listening well.</p>`;
    } else if (gameState.inventory.includes("Dew Pebble")) {
      title = "🌱 Quiet Gardener";
      desc = `<p class='narrator'>You choose to stay in the Silent Clearing. Not to fix it, but to tend it.</p>
             <p>The clearing is no longer silent. It is peaceful. There is a difference.</p>
             <p class='clue-found'>🌱 <strong>Ending:</strong> Quiet Gardener — Peace comes in many sizes.</p>`;
    } else {
      title = "🌙 Bittersweet Half-Song";
      desc = `<p class='narrator'>The Festival begins, but the Song is incomplete. Some pieces remain missing.</p>
             <p>But the land is patient. It will wait for the next listener. It will wait for your return, wiser.</p>
             <p class='clue-found'>🌙 <strong>Ending:</strong> Bittersweet Half-Song — Part saved. The rest waits for your return.</p>`;
    }

    return `<p style='text-align:center;font-size:1.5rem;margin-bottom:20px;'>${title}</p>${desc}
           <div class='riddle-box' style='margin-top:20px;'><p><strong>Your Journey's Record:</strong></p>
           <p style='margin-top:10px;'>
           Items: ${gameState.inventory.length} | Clues: ${gameState.clues.length}<br>
           Flower trust: ${gameState.trust.flowers}% | Tree trust: ${gameState.trust.trees}%<br>
           Regions: ${gameState.discoveredRegions.length} | Song pieces: ${gameState.songPieces.length}/6<br>
           Secrets: ${gameState.foundArtifacts.size}/${getTotalArtifacts()}
           </p></div>
           <p style='text-align:center;margin-top:20px;'><em>The Land of Returning Songs will remember you.</em></p>
           <p style='text-align:center;'><button onclick='location.reload()' style='padding:10px 30px;background:linear-gradient(135deg,var(--petal-deep),var(--festival));border:none;border-radius:20px;color:white;font-family:"Cinzel",serif;cursor:pointer;'>Play Again</button></p>`;
  }
};


// ==================== SCENE DATABASE ====================
const scenes = {
  meadow_gate: {
    title: "Whispering Meadow — The Gate", region: "meadow", emoji: "🌸",
    exits: { north: "humming_bridge", east: "dancing_grove", south: "buttercup_bench", examine: "puddle_mirror" },
    items: [], characters: ["marigold", "violet", "dandelion"],
    imagePrompt: "A magical storybook meadow at golden hour, three anthropomorphic flowers with expressive faces near a wooden gate, lush green grass, soft pastel colors, children's book illustration"
  },
  puddle_mirror: {
    title: "The Puddle Mirror", region: "meadow", emoji: "💧",
    exits: { back: "meadow_gate", take: "take_pebble" },
    items: ["Dew Pebble"], characters: ["violet"],
    imagePrompt: "A magical puddle in a meadow acting as a mirror, glowing dew pebble at the bottom, soft ethereal light, storybook illustration"
  },
  take_pebble: {
    title: "Dew Pebble Acquired", region: "meadow", emoji: "💎",
    exits: { back: "meadow_gate" }, items: [], characters: [],
    imagePrompt: "A hand holding a glowing blue dew pebble above a magical puddle, sparkling water droplets, warm golden light",
    onEnter: function() {
      addItem("Dew Pebble", "💧");
      addClue("Dew reveals shy truths — reflections show hidden truths");
      modifyTrust("flowers", 10);
    }
  },
  buttercup_bench: {
    title: "Buttercup Bench", region: "meadow", emoji: "🌼",
    exits: { back: "meadow_gate", north: "daisy_circle", examine: "scarecrow_pocket", willow: "willow_steps" },
    items: ["Memory Acorn"], characters: ["scarecrow"],
    imagePrompt: "A mossy stone bench surrounded by buttercups, a wise scarecrow pointing to a willow tree, roots forming numbers in soil"
  },
  scarecrow_pocket: {
    title: "The Scarecrow's Gift", region: "meadow", emoji: "🌰",
    exits: { back: "buttercup_bench" }, items: [], characters: [],
    imagePrompt: "A child discovering a glowing golden acorn in a scarecrow's pocket, magical sparkles",
    onEnter: function() {
      addItem("Memory Acorn", "🌰");
      addClue("Willow roots marked 7-5-3 — numbers in nature hold secrets");
      addClue("Buttercup pattern: yellow-white-yellow-blue");
      modifyTrust("flowers", 5);
    }
  },
  willow_steps: {
    title: "Willow Steps", region: "meadow", emoji: "🌿",
    exits: { back: "buttercup_bench", down: "root_tunnel_early" },
    items: [], characters: ["willow"],
    imagePrompt: "Ancient willow tree with roots forming numbers 7-5-3, dark entrance between roots"
  },
  root_tunnel_early: {
    title: "Root-Tunnel Library (Secret)", region: "root_library", emoji: "📚",
    exits: { back: "willow_steps", read: "old_promise", up: "meadow_gate" },
    items: [], characters: ["root_reader"],
    imagePrompt: "Underground library inside tree roots, glowing moss, bookshelves of living wood",
    onEnter: function() {
      addClue("The Old Promise: Voice + Rhythm = Harmony");
      discoverRegion("root_library");
    }
  },
  old_promise: {
    title: "The Old Promise", region: "root_library", emoji: "📜",
    exits: { back: "root_tunnel_early" }, items: [], characters: [],
    imagePrompt: "Ancient book of bark showing glowing text about flowers and trees",
    onEnter: function() {
      addClue("The final note was hidden by someone who was laughed over");
      modifyTrust("trees", 15);
    }
  },
  daisy_circle: {
    title: "Daisy Circle", region: "meadow", emoji: "🌼",
    exits: { north: "humming_bridge", east: "buttercup_bench", back: "meadow_gate" },
    items: [], characters: ["dandelion"],
    imagePrompt: "Circle of daisies with four taller ones forming color pattern, dandelion floating nearby"
  },
  humming_bridge: {
    title: "The Humming Bridge", region: "meadow", emoji: "🌉",
    exits: { cross: "dancing_grove", back: "meadow_gate", south: "daisy_circle" },
    items: [], characters: ["bridge"],
    imagePrompt: "Magical wooden bridge over singing stream, planks glowing with musical notes",
    onEnter: function() {
      addClue("Bridge rhythm: three notes, silence, two notes (long-short-short)");
    }
  },
  dancing_grove: {
    title: "Dancing Grove", region: "grove", emoji: "🌳",
    exits: { west: "humming_bridge", north: "petal_arch", dance: "dance_with_trees" },
    items: [], characters: ["oak", "willow", "birch", "pine"],
    imagePrompt: "Enchanted forest grove with dancing trees, ancient oak in center, magical dappled light"
  },
  dance_with_trees: {
    title: "Dancing With the Trees", region: "grove", emoji: "💃",
    exits: { back: "dancing_grove" }, items: [], characters: [],
    imagePrompt: "Child dancing with enchanted trees, magical wooden flute revealed by splitting roots",
    onEnter: function() {
      addItem("Rootkey Flute", "🎵");
      addClue("Root door code: knock, pause, knock-knock");
      modifyTrust("trees", 20);
      if (!gameState.songPieces.includes("rhythm")) {
        gameState.songPieces.push("rhythm");
        updateSongDisplay();
      }
    }
  },
  petal_arch: {
    title: "Petal Arch — Stage 1 Complete", region: "meadow", emoji: "🌸",
    exits: { forward: "petal_market", back: "dancing_grove" }, items: [], characters: [],
    imagePrompt: "Drooping flower archway, warm golden light beyond showing bustling market",
    onEnter: function() {
      gameState.stage = 2;
      discoverRegion("market");
    }
  },
  petal_market: {
    title: "Petal Market", region: "market", emoji: "🏪",
    exits: { west: "lavender_stall", north: "clock_tower", east: "seed_trader", south: "petal_arch", down: "root_tunnel_entrance", pond: "rainbell_pond", orchard: "moonlit_orchard", maze: "thorn_maze" },
    items: [], characters: ["lavender", "snapdragon", "rose"],
    imagePrompt: "Bustling magical flower market, lavender stall, backwards clock tower, crying snapdragon"
  },
  lavender_stall: {
    title: "Lavender Stall", region: "market", emoji: "💜",
    exits: { back: "petal_market", sort: "lavender_helped" },
    items: ["Laughing Pollen Pouch"], characters: ["lavender"],
    imagePrompt: "Sleepy lavender merchant at stall with scattered colorful jars, dream-like atmosphere"
  },
  lavender_helped: {
    title: "The Laughing Pollen", region: "market", emoji: "😄",
    exits: { back: "petal_market" }, items: [], characters: [],
    imagePrompt: "Lavender merchant smiling, handing glowing pollen pouch to child, jars neatly arranged",
    onEnter: function() {
      addItem("Laughing Pollen Pouch", "😄");
      addClue("Hidden tools in plain sight — like pencil lead in wood");
      modifyTrust("flowers", 15);
    }
  },
  clock_tower: {
    title: "Dandelion Clock Tower", region: "market", emoji: "🕐",
    exits: { back: "petal_market", solve: "clock_solved" }, items: [], characters: [],
    imagePrompt: "Magical clock tower of dandelion seeds spinning backwards, ethereal golden light"
  },
  clock_solved: {
    title: "Time's Secret Revealed", region: "market", emoji: "🗺️",
    exits: { back: "petal_market" }, items: [], characters: [],
    imagePrompt: "Dandelion seeds forming glowing map in air, showing paths to pond, orchard, maze",
    onEnter: function() {
      addClue("Count backwards before the true hour — patience reveals what haste hides");
      discoverRegion("pond");
      discoverRegion("orchard");
      discoverRegion("maze");
    }
  },
  seed_trader: {
    title: "Seed-Trader's Tent", region: "market", emoji: "🏕️",
    exits: { back: "petal_market", comfort: "snapdragon_comforted", trade: "snapdragon_trade" },
    items: ["Sunseed Compass"], characters: ["snapdragon"],
    imagePrompt: "Crying snapdragon flower behind seed table, warm candlelight, empathetic scene"
  },
  snapdragon_comforted: {
    title: "A Warm Heart", region: "market", emoji: "💝",
    exits: { back: "petal_market" }, items: [], characters: [],
    imagePrompt: "Child comforting snapdragon who smiles through tears, exchanging warm golden compass",
    onEnter: function() {
      addItem("Sunseed Compass", "🧭");
      addClue("The compass points to kindness — warmth guides better than direction");
      modifyTrust("flowers", 20);
      modifyTrust("animals", 10);
    }
  },
  snapdragon_trade: {
    title: "Cold Exchange", region: "market", emoji: "💨",
    exits: { back: "petal_market" }, items: [], characters: [],
    imagePrompt: "Cold transaction, sad snapdragon handing over dim compass, muted colors",
    onEnter: function() {
      addItem("Sunseed Compass", "🧭");
      modifyTrust("flowers", -10);
    }
  },
  root_tunnel_entrance: {
    title: "Root-Tunnel Entrance", region: "root_library", emoji: "🌿",
    exits: { back: "petal_market", knock: "root_tunnel_library" }, items: [], characters: [],
    imagePrompt: "Living wooden door in tree roots with knot patterns, glowing moss"
  },
  root_tunnel_library: {
    title: "Root-Tunnel Library", region: "root_library", emoji: "📚",
    exits: { back: "petal_market", festival: "first_festival", thistledown: "thistledown_lore", skyseed: "skyseed_lore" },
    items: [], characters: ["root_reader"],
    imagePrompt: "Underground library in giant tree roots, glowing moss, scholar at root desk"
  },
  first_festival: {
    title: "The First Festival", region: "root_library", emoji: "🎉",
    exits: { back: "root_tunnel_library" }, items: [], characters: [],
    imagePrompt: "Book of pressed lily petals showing first festival story, flowers singing, trees dancing",
    onEnter: function() {
      addClue("The Festival began as a conversation");
      addClue("The Skyseed is a living promise of harmony");
    }
  },
  thistledown_lore: {
    title: "The Story of Thistledown", region: "root_library", emoji: "🌵",
    exits: { back: "root_tunnel_library" }, items: [], characters: [],
    imagePrompt: "Book bound in soft thistles showing story of hurt flower, warm candlelight",
    onEnter: function() {
      addClue("Thistledown hid the final note from hurt, not malice");
      addClue("The final note must be invited back, not demanded");
      modifyTrust("flowers", 10);
    }
  },
  skyseed_lore: {
    title: "The Skyseed", region: "root_library", emoji: "☁️",
    exits: { back: "root_tunnel_library" }, items: [], characters: [],
    imagePrompt: "Magical book of clouds showing floating skyseed, ethereal light",
    onEnter: function() {
      addClue("The Skyseed requires voice and rhythm together");
    }
  },
  rainbell_pond: {
    title: "Rainbell Pond", region: "pond", emoji: "🔔",
    exits: { back: "petal_market", sing: "pond_singing", south: "petal_market" },
    items: ["Rainbell Shell"], characters: ["reeds"],
    imagePrompt: "Magical pond surrounded by reed bells, ripples forming concentric circles, misty ethereal atmosphere"
  },
  pond_singing: {
    title: "The Pond Sings Back", region: "pond", emoji: "🎵",
    exits: { back: "rainbell_pond" }, items: [], characters: [],
    imagePrompt: "Child singing by magical pond, glowing shell rising from water, reed bells chiming",
    onEnter: function() {
      addItem("Rainbell Shell", "🐚");
      addClue("Water answers order: outer, inner, stillness");
      if (!gameState.songPieces.includes("reflection")) {
        gameState.songPieces.push("reflection");
        updateSongDisplay();
      }
    }
  },
  moonlit_orchard: {
    title: "Moonlit Orchard", region: "orchard", emoji: "🌙",
    exits: { back: "petal_market", examine: "glass_apple", south: "petal_market" },
    items: ["Moonpetal Mirror"], characters: ["glass_apple"],
    imagePrompt: "Magical orchard at moonlight with glass apples, moths circling lantern, silver light"
  },
  glass_apple: {
    title: "The Glass Apple", region: "orchard", emoji: "🍎",
    exits: { back: "moonlit_orchard" }, items: [], characters: [],
    imagePrompt: "Child holding transparent glass apple, moonflower petal mirror on ground",
    onEnter: function() {
      addItem("Moonpetal Mirror", "🪞");
      addClue("The Moonpetal Mirror shows intended meaning behind words");
      modifyTrust("flowers", 10);
    }
  },
  thorn_maze: {
    title: "Thorn Maze", region: "maze", emoji: "🌿",
    exits: { back: "petal_market", wait: "maze_wait", help: "help_fledgling", forward: "silent_clearing" },
    items: ["Thornproof Ribbon"], characters: ["fledgling"],
    imagePrompt: "Magical hedge maze with thorns leaning from paths, small bird in nest, tangled ribbons"
  },
  maze_wait: {
    title: "Patience Opens the Maze", region: "maze", emoji: "⏳",
    exits: { back: "thorn_maze" }, items: [], characters: [],
    imagePrompt: "Child standing patiently as thorns part to reveal path, glowing ribbon on branch",
    onEnter: function() {
      addItem("Thornproof Ribbon", "🎀");
      addClue("Patience opens the maze — waiting reveals what rushing obscures");
      addClue("The more you take, the more you leave behind: footsteps");
      modifyTrust("animals", 15);
    }
  },
  help_fledgling: {
    title: "A Small Friend", region: "maze", emoji: "🐦",
    exits: { back: "thorn_maze" }, items: [], characters: [],
    imagePrompt: "Child helping small bird to nest using glowing ribbon, gentle magical light",
    onEnter: function() {
      addClue("Helping the lost raises friendship ending condition");
      modifyTrust("animals", 25);
      gameState.flags.helpedFledgling = true;
    }
  },
  silent_clearing: {
    title: "Silent Clearing", region: "clearing", emoji: "🌑",
    exits: { back: "thorn_maze", listen: "thistledown_listen", south: "thorn_maze" },
    items: [], characters: ["thistledown"],
    imagePrompt: "Quiet clearing where flowers and trees are still, small prickly flower facing away in center"
  },
  thistledown_listen: {
    title: "Being Heard", region: "clearing", emoji: "💚",
    exits: { back: "silent_clearing", invite: "festival_preparation" }, items: [], characters: [],
    imagePrompt: "Child sitting quietly listening to small prickly flower, emotional connection, soft warm light",
    onEnter: function() {
      addClue("The final note must be invited back, not demanded");
      modifyTrust("flowers", 30);
      gameState.flags.thistledownHeard = true;
    }
  },
  festival_preparation: {
    title: "Festival of Returning Songs", region: "festival", emoji: "🎊",
    exits: { back: "silent_clearing", begin: "ending_calculation" }, items: [], characters: [],
    imagePrompt: "Magical festival ground with flowers in choirs and trees in circles, golden sunset",
    onEnter: function() { gameState.stage = 6; }
  },
  ending_calculation: {
    title: "The Returning Song", region: "festival", emoji: "🎵",
    exits: {}, items: [], characters: [],
    imagePrompt: "Magical festival finale with flowers singing and trees dancing, warm golden light"
  }
};
