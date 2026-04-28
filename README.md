# The Land of Returning Songs

A storybook adventure game where flowers talk, trees dance, and every clue matters.

## About the Game

The flowers are losing their voices. The trees are forgetting their rhythms. The Festival Song has broken into pieces, and the land needs someone who listens.

Choose your path:
- 🥁 **Rhythm Walker** — You hear the beat in everything
- 🌺 **Bloom Listener** — You understand what is felt but not said
- 🌰 **Seed Scholar** — You read stories in roots and rings

## Files

| File | Purpose |
|------|---------|
| `index.html` | Main game page with landing screen |
| `styles.css` | All game styling and animations |
| `scenes.js` | Story content, artifacts, and scene descriptions |
| `game.js` | Game logic, commands, inventory, map |
| `WALKTHROUGH.txt` | Complete answer guide (spoilers!) |

## How to Play (Local)

1. Download all files
2. Put them in the same folder
3. Double-click `index.html`
4. Choose a character and click "Enter the Land"

## How to Play (Online)

### Deploy to Netlify (Easiest)

**Option 1: Drag & Drop**
1. Go to [netlify.com](https://netlify.com) and sign up (free)
2. Click "Add new site" → "Deploy manually"
3. Drag your folder containing all 4 files onto the upload area
4. Done! Your game is live at `https://random-name.netlify.app`

**Option 2: GitHub + Netlify (Auto-updates)**
1. Push these files to a GitHub repository
2. In Netlify, click "Add new site" → "Import an existing project"
3. Choose GitHub, select your repository
4. Leave "Build command" blank (no build needed)
5. Set "Publish directory" to `/` (root)
6. Click "Deploy site"
7. Any future push to GitHub automatically updates your game

### Deploy to GitHub Pages (Free)

**Option 1: Direct Upload**
1. Create a new GitHub repository
2. Upload all 4 files to the repository
3. Go to repository Settings → Pages
4. Under "Source", select "Deploy from a branch"
5. Select `main` branch and `/` (root) folder
6. Click Save
7. Your game will be at `https://yourusername.github.io/repository-name/`

**Option 2: gh-pages Branch**
1. Create a repository and push files to `main` branch
2. Create a `gh-pages` branch with the same files
3. Go to Settings → Pages
4. Select `gh-pages` branch
5. Your game is live

## Game Size

- Total: ~101 KB (very lightweight)
- No build step required
- No server needed
- Works on any device with a browser

## Cheat Codes

Type these in the game's command box:

| Cheat | Effect |
|-------|--------|
| `cheat godmode` | All items, max trust, all songs, all flags |
| `cheat items` | Give all inventory items |
| `cheat trust` | Max all trust meters |
| `cheat songs` | Collect all song fragments |
| `cheat flags` | Set story flags |
| `cheat jump [location]` | Teleport to any scene |
| `cheat clues` | Add all clues |
| `cheat secrets` | Find all hidden secrets |
| `cheat help` | Show all cheats |

Locations for `cheat jump`: meadow, market, pond, maze, clearing, ending, grove, arch, bridge, clock, lavender, snapdragon, library, orchard, thistledown

## Browser Compatibility

- ✅ Chrome / Edge (best)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (iOS Safari, Chrome Android)

## Features

- 37 hand-crafted scenes
- 74 hidden secrets to discover
- 5 different endings based on your choices
- Voice commentary (text-to-speech)
- AI-generated scene images
- Trust system (Flowers, Trees, Creatures)
- Inventory and clue journal
- Interactive map
- Riddles and puzzles

## License

Built for educational and personal use.
