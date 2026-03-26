// record-gif.js — Navigate through the site with arrow keys and record a GIF
// Usage: node record-gif.js
//
// Requires: npm i playwright
//           ffmpeg (brew install ffmpeg)

const { chromium } = require('playwright');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const URL = 'http://localhost:8090';
const WIDTH = 1280;
const HEIGHT = 800;
const OUTPUT_DIR = path.join(__dirname, 'output');
const GIF_PATH = path.join(__dirname, 'demo.gif');

// GIF settings
const GIF_WIDTH = 800;    // output width
const GIF_FPS = 10;       // frames per second
const PAUSE_MS = 1000;    // pause between each step
const STOP_LABEL = '6.6'; // stop after this step label (last diagram step)

(async () => {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    colorScheme: 'dark',
    recordVideo: { dir: OUTPUT_DIR, size: { width: WIDTH, height: HEIGHT } }
  });

  const page = await context.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });

  // Wait for page to settle
  await page.waitForTimeout(2000);

  // Hide theme toggle and nav dots for clean recording
  await page.evaluate(() => {
    var toggle = document.getElementById('themeToggle');
    var nav = document.getElementById('navDots');
    if (toggle) toggle.style.display = 'none';
    if (nav) nav.style.display = 'none';
  });

  // Count how many nav items exist and find which one has our stop label
  const totalSteps = await page.evaluate((stopLabel) => {
    // Find all text steps and their labels
    var steps = document.querySelectorAll('.text-step');
    var lastStepIndex = -1;
    var navItems = document.querySelectorAll('.nav-dot, .nav-pill-seg');

    // Find the step that contains our stop label
    steps.forEach(function (s, i) {
      var label = s.querySelector('.step-label');
      if (label && label.textContent.indexOf(stopLabel) !== -1) {
        lastStepIndex = i;
      }
    });

    // navItems includes: hero dot + all step segments + post-scrolly dots
    // We want hero + all steps up to our stop label
    return { navCount: navItems.length, lastStepIndex: lastStepIndex };
  }, STOP_LABEL);

  // Calculate number of arrow presses needed
  // The nav has: hero dot, then step segments, then post-scrolly dots
  // We need to press down arrow enough times to reach our stop step
  // Let's just count by checking the active label after each press

  console.log(`Nav items: ${totalSteps.navCount}`);
  console.log(`Navigating with ArrowDown, pausing ${PAUSE_MS}ms between steps...`);
  console.log(`Will stop after step ${STOP_LABEL}\n`);

  // Initial pause on hero
  console.log('  → Hero');
  await page.waitForTimeout(PAUSE_MS);

  let step = 0;
  while (true) {
    // Press down arrow
    await page.keyboard.press('ArrowDown');
    step++;

    // Wait for scroll animation to complete
    await page.waitForTimeout(800);

    // Check what step we're on
    const currentLabel = await page.evaluate(() => {
      // Find the active nav segment's associated text step
      var active = document.querySelector('.nav-pill-seg.active');
      if (!active) return 'non-step';

      // Find the closest visible text step
      var vc = window.innerHeight / 2;
      var best = null;
      var bestDist = Infinity;
      document.querySelectorAll('.text-step').forEach(function (s) {
        var r = s.getBoundingClientRect();
        var center = (r.top + r.bottom) / 2;
        var dist = Math.abs(center - vc);
        if (dist < bestDist) { bestDist = dist; best = s; }
      });

      if (best) {
        var label = best.querySelector('.step-label');
        if (label) return label.textContent.trim();
      }
      return 'unknown';
    });

    console.log(`  → Step ${step}: ${currentLabel}`);

    // Pause to let viewer see the content
    await page.waitForTimeout(PAUSE_MS);

    // Check if we've reached the stop label
    if (currentLabel.indexOf(STOP_LABEL) !== -1) {
      console.log(`\n  Reached ${STOP_LABEL}, stopping.`);
      break;
    }

    // Safety: don't loop forever
    if (step > 50) {
      console.log('\n  Safety limit reached, stopping.');
      break;
    }
  }

  // Final pause
  await page.waitForTimeout(1000);

  // Close to finalize video
  await page.close();
  await context.close();
  await browser.close();

  // Find the most recent video
  const videos = fs.readdirSync(OUTPUT_DIR)
    .filter(f => f.endsWith('.webm'))
    .map(f => ({
      path: path.join(OUTPUT_DIR, f),
      mtime: fs.statSync(path.join(OUTPUT_DIR, f)).mtimeMs
    }))
    .sort((a, b) => b.mtime - a.mtime);

  if (videos.length === 0) {
    console.error('No video file found!');
    process.exit(1);
  }

  const videoFile = videos[0].path;
  const videoDuration = (fs.statSync(videoFile).size / 1024 / 1024).toFixed(1);
  console.log(`\nVideo: ${videoFile} (${videoDuration} MB)`);
  console.log('Converting to GIF...');

  const palettePath = path.join(OUTPUT_DIR, 'palette.png');

  // Also save as mp4 (much smaller, GitHub supports it in READMEs)
  const mp4Path = GIF_PATH.replace('.gif', '.mp4');
  execSync(
    `ffmpeg -y -i "${videoFile}" -vf "fps=24,scale=${GIF_WIDTH}:-2:flags=lanczos" -c:v libx264 -preset slow -crf 28 -pix_fmt yuv420p -movflags +faststart -an "${mp4Path}"`,
    { stdio: 'pipe' }
  );
  const mp4Size = (fs.statSync(mp4Path).size / 1024 / 1024).toFixed(1);
  console.log(`\nMP4: ${mp4Path} (${mp4Size} MB)`);

  // GIF with aggressive optimization (64 colors, high dither)
  // Pass 1: palette
  execSync(
    `ffmpeg -y -i "${videoFile}" -vf "fps=${GIF_FPS},scale=${GIF_WIDTH}:-1:flags=lanczos,palettegen=max_colors=64:stats_mode=diff" -update 1 "${palettePath}"`,
    { stdio: 'pipe' }
  );

  // Pass 2: GIF
  execSync(
    `ffmpeg -y -i "${videoFile}" -i "${palettePath}" -lavfi "fps=${GIF_FPS},scale=${GIF_WIDTH}:-1:flags=lanczos [x]; [x][1:v] paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle" "${GIF_PATH}"`,
    { stdio: 'pipe' }
  );

  fs.unlinkSync(palettePath);

  const gifSize = (fs.statSync(GIF_PATH).size / 1024 / 1024).toFixed(1);
  console.log(`GIF: ${GIF_PATH} (${gifSize} MB)`);
  console.log(`\nRecommendation: Use the MP4 in your README if GIF is too large.`);
  console.log(`GitHub renders MP4 in READMEs with: ![demo](demo.mp4)`);
})();
