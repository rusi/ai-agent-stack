// record-keyframes.js — Capture key diagram states as a high-quality animated GIF
// Usage: node record-keyframes.js
//
// Takes ~7 frames: hero + last step of each main section (1–6)
// Clicks the last segment of each nav pill to jump to the final state.
//
// Requires: npm i playwright, ffmpeg

const { chromium } = require('playwright');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const URL = 'http://localhost:8090';
const WIDTH = 1280;
const HEIGHT = 800;
const OUTPUT_DIR = path.join(__dirname, 'output');
const GIF_PATH = path.join(__dirname, 'demo.gif');

const FRAME_DELAY_MS = 2500;  // how long each frame shows in the GIF

(async () => {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Clean old frames
  fs.readdirSync(OUTPUT_DIR)
    .filter(f => f.startsWith('keyframe-'))
    .forEach(f => fs.unlinkSync(path.join(OUTPUT_DIR, f)));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    colorScheme: 'dark',
    deviceScaleFactor: 2  // retina quality
  });

  const page = await context.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // Hide theme toggle and nav dots for clean screenshots
  await page.evaluate(() => {
    var toggle = document.getElementById('themeToggle');
    var nav = document.getElementById('navDots');
    if (toggle) toggle.style.display = 'none';
    if (nav) nav.style.display = 'none';
  });

  // Frame 0: Hero
  console.log('Frame 0: Hero');
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'keyframe-00.png') });

  // Find all nav pills and click the last segment of each
  const pillCount = await page.evaluate(() => {
    return document.querySelectorAll('.nav-pill').length;
  });

  console.log(`Found ${pillCount} nav pills (sections)`);

  for (let i = 0; i < pillCount; i++) {
    // Click the last segment of this pill
    const label = await page.evaluate((pillIndex) => {
      var pill = document.querySelectorAll('.nav-pill')[pillIndex];
      if (!pill) return 'not found';
      var segs = pill.querySelectorAll('.nav-pill-seg');
      var lastSeg = segs[segs.length - 1];
      if (lastSeg) lastSeg.click();
      return pill.getAttribute('data-group') || 'unknown';
    }, i);

    // Wait for smooth scroll to complete and diagram layers to animate
    await page.waitForTimeout(2000);

    // For the last pill (section 6), scroll down so the step is more visible
    if (i === pillCount - 1) {
      await page.evaluate(() => window.scrollBy(0, 120));
      await page.waitForTimeout(500);
    }

    const frameNum = String(i + 1).padStart(2, '0');
    const framePath = path.join(OUTPUT_DIR, `keyframe-${frameNum}.png`);
    console.log(`Frame ${i + 1}: Section ${label} (last step)`);
    await page.screenshot({ path: framePath });
  }

  await browser.close();

  // Count frames
  const frames = fs.readdirSync(OUTPUT_DIR)
    .filter(f => f.startsWith('keyframe-') && f.endsWith('.png'))
    .sort();

  console.log(`\nCaptured ${frames.length} frames. Assembling GIF...`);

  // Calculate frame delay in centiseconds for GIF (e.g., 2500ms = 250cs)
  const delayCentisecs = Math.round(FRAME_DELAY_MS / 10);

  // Use ffmpeg to create GIF from frames
  // -framerate controls input timing, we use a very low one to get long pauses
  const inputFps = 1000 / FRAME_DELAY_MS;  // e.g., 0.4 fps for 2500ms

  const palettePath = path.join(OUTPUT_DIR, 'palette.png');

  // Pass 1: palette from all frames (full color, no compression)
  execSync(
    `ffmpeg -y -framerate ${inputFps} -i "${OUTPUT_DIR}/keyframe-%02d.png" -vf "scale=${WIDTH}:-1:flags=lanczos,palettegen=max_colors=256:stats_mode=single" -update 1 "${palettePath}"`,
    { stdio: 'pipe' }
  );

  // Pass 2: assemble GIF with full palette
  execSync(
    `ffmpeg -y -framerate ${inputFps} -i "${OUTPUT_DIR}/keyframe-%02d.png" -i "${palettePath}" -lavfi "scale=${WIDTH}:-1:flags=lanczos [x]; [x][1:v] paletteuse=dither=sierra2_4a:diff_mode=rectangle" -loop 0 "${GIF_PATH}"`,
    { stdio: 'pipe' }
  );

  fs.unlinkSync(palettePath);

  const gifSize = (fs.statSync(GIF_PATH).size / 1024 / 1024).toFixed(1);
  console.log(`\nDone! ${GIF_PATH} (${gifSize} MB) — ${frames.length} frames, ${FRAME_DELAY_MS}ms each`);
})();
