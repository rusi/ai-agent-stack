# AI Agent Stack — Developer Context

> **Purpose:** Load this file at the start of any Claude session that modifies this project.
> It replaces the ramp-up time of reading all source files.

## Project Overview

An interactive scrollytelling single-page site that visually explains the AI agent stack — from a raw LLM to multi-agent systems. Built with vanilla HTML/CSS/JS (no frameworks). Hosted on GitHub Pages at `rusi.github.io/ai-agent-stack`.

**Local dev:** `python3 -m http.server 8090` then open `http://localhost:8090`. No build step, no dependencies (except Playwright for gif recording).

## File Map

| File | Role |
|---|---|
| `index.html` | Page structure: hero, two scrolly containers, products section, governance section, footer |
| `styles.css` | All styling incl. theme vars, layout, mobile breakpoint at `max-width: 900px` |
| `diagram.js` | **Main diagram** SVG (id: `mainDiagram`). Covers steps 1.x–4.x. ViewBox: `0 0 1260 1060` |
| `deploy-diagram.js` | **Deploy/orchestration diagram** SVG (id: `deployDiagram`). Covers steps 5.x–6.x. ViewBox: `0 -70 1080 810` |
| `diagram-utils.js` | Shared SVG helpers: `pill()`, `bubble()`, `tag()`, `defs()`. Exposed as `window.diagramUtils` |
| `scrolly.js` | Scroll tracking, layer show/hide, nav pills, keyboard nav, mobile `preserveAspectRatio` |
| `record-gif.js` | Playwright script: full scroll recording → mp4 → gif |
| `record-keyframes.js` | Playwright script: click nav pill segments → high-res keyframe gif |

**Script load order:** `diagram-utils.js` → `diagram.js` → `deploy-diagram.js` → `scrolly.js`

## Architecture: How Scrollytelling Works

### Two scrolly containers

```
scrollyContainer (id)          → mainDiagram (SVG)     → steps 1.0–4.6
scrollyContainer2 (id)         → deployDiagram (SVG)   → steps 5.0–6.6
```

Each container has:
- `.scrolly-diagram` — sticky panel holding the SVG (left on desktop, top on mobile)
- `.scrolly-text` — scrolling text steps (right on desktop, below on mobile)

### Layer system

Each `.text-step` has a `data-layers` attribute listing which SVG `<g class="layer">` groups to show:

```html
<div class="text-step" data-layers="L0,L2a,L2b,L3a" id="step3a">
```

`scrolly.js` uses an IntersectionObserver-like scroll check: whichever step is near the viewport center becomes active. Its `data-layers` value determines which layers get `class="show"`. New layers also get a `highlight` class for entrance animation.

### Nav pills

Steps are grouped by their section number (extracted from label text like "3.2 · Skills"). Each group becomes a nav pill with clickable segments. Keyboard arrows navigate between all `navItems` (hero dot + pill segments + post-scrolly section dots).

## Font Size System (ALL diagrams)

Both diagrams use a strict 4-tier font size system defined in `diagram-utils.js`:

| Tier | Size | Usage |
|---|---|---|
| T1 | 30 | Primary box titles (The User, Model, Agent N, Orchestrator) |
| T2 | 22 | Secondary titles, content items (Context, Engine, Tools/Bash, GitHub, Files, etc.) |
| T3 | 16 | Zone labels, subtitles, descriptions (AGENT RUNTIME, CONTEXT ASSEMBLY, provider names) |
| T4 | 13 | Code text, small annotations, monospace content |
| Pills | 14 | Constrained by circle radius (numbered pills in diagram-utils `pill()`) |

**Boundary pill labels** (deploy-diagram.js `pillLabel()`) use T3 (16) with `letter-spacing: 2`.

## Main Diagram Layers (diagram.js)

**ViewBox:** `0 0 1260 1060`

**Box positions:**
- User box: x=50, w=200 (centered at x=150)
- Engine box: x=430, w=300 (centered at x=580)
- Model box: x=970, w=230 (centered at x=1085)
- Model Prompt document: x=945, y=80, w=280, h=260 (center_x=1085, aligned with Model)
- History box: 135×56, inside engine (left side)
- Memory box: 135×56, inside engine (right side)

| Layer ID | Content | First used in step |
|---|---|---|
| `L0` | Base boxes (User, Engine, Model) | 1.0 |
| `L1q` | Prompt arrow (User→Engine) | 1.1 |
| `L1r` | Response arrow (Engine→User) | 1.2 |
| `L2a` | Engine box fill/gradient | 2.0 |
| `L2b` | Request arrow (Engine→Model) | 2.1 |
| `L2c`, `L2cf` | Context window (amber box + files arrow) | 2.2 |
| `L2d`, `L2df` | Tools panel (purple box + tool call arrow) | 2.3 |
| `L3a` | Tool call flow arrow | 2.4 |
| `L3b` | MCP call flow | 2.5 |
| `L3c` | Result flow | 2.6 |
| `L3d` | Answer flow | 2.7 |
| `LH` | History box (session turns) inside engine | 2.2 |
| `LM` | Memory box (persistent) inside engine | 3.0 |
| `LP0`–`LP2` | Model Prompt content — 2.x weather conversation (3 progressive states) | 2.2–2.7 |
| `LP3_0`–`LP3_3` | Model Prompt content — 3.x instructions/skills/test (4 progressive states) | 3.0–3.6 |
| `LP4_0`–`LP4_2` | Model Prompt content — 4.x dashboard agentic loop (3 progressive states) | 4.0–4.6 |
| `L5a` | Instructions box | 3.0 |
| `L5b`, `L5bf` | Persona section + arrow | 3.1 |
| `L6`, `L6f` | Skills section + arrow | 3.2 |
| `L3e` | New prompt composition | 3.3 |
| `L3f` | Skill load flow | 3.4 |
| `L3g` | Bash call flow | 3.5 |
| `L3h` | Done state | 3.6 |
| `L7` | MCP servers panel | 3.5 |
| `L8` | Agentic loop outline | 4.0 |
| `L4q` | Loop prompt | 4.1 |
| `L4a`–`L4f` | Loop steps (plan→build→test→fix→done) | 4.2–4.6 |
| `L4a_mcp` | MCP in loop context | 4.2 |

**Step 4 scroll animation:** Steps 4.3–4.6 have `data-scroll-offset` values. `scrolly.js` translates a `<g id="L4inner">` group vertically to scroll through the agentic loop steps, with opacity fading for arrows entering/leaving the visible band.

## Deploy Diagram Layers (deploy-diagram.js)

**ViewBox:** `0 -70 1080 810` (negative Y for orchestrator bar above agents)

**Key coordinates:**
```
Agents: a1x=40, a2x=265, a3x=490, ay=100, aw=200, ah=260
Orchestrator bar: x=32, y=-60, width spans all 3 agents + 16px padding
Files/Secrets: x=40, y=410, w=270, h=90
Local MCP: x=340, y=410, w=280, h=90
Remote MCP: x=780, y=70, w=250, h=260
SaaS/APIs: x=780, y=410, w=250, h=90
Models row: y=580, h=110
  Local (Llama): x=140, w=170
  Private Cloud (Claude): x=360, w=200
  Cloud models: x=780 (Claude), x=910 (Codex)
```

| Layer ID | Content | First used in step |
|---|---|---|
| `DL0` | Base: 3 agent boxes, Remote MCP, SaaS/APIs | 5.0, 6.0 |
| `DO1_orch` | Orchestrator bar + "task" labels + down arrows | 5.0 |
| `DO2_roles` | Colored role borders (Implementer/Reviewer/Test Runner) + result labels | 5.1 |
| `DL1_machine` | "YOUR MACHINE" boundary | 6.1 |
| `DL2_sandbox` | Sandbox boundary around Agent 3 | 6.2 |
| `DL3_models` | Model boxes (Llama, Claude/Bedrock, Claude, Codex) with LOCAL/PRIVATE CLOUD pills | 6.3 |
| `DL3_cloud` | CLOUD pill around cloud models (separate from DL3_models for progressive reveal) | 6.3 |
| `DL4_mcp_local` | Files/Secrets + Local MCP boxes + arrows | 6.4 |
| `DL5_mcp_cloud` | Remote MCP + SaaS cloud pill + API arrows | 6.5 |
| `DL6_gov` | Warning icons (attack surface indicators) | 6.6 |

**Progressive cloud reveal:** `DL3_models` shows model boxes + LOCAL/PRIVATE CLOUD pills. `DL3_cloud` adds the CLOUD pill around cloud models. Steps 6.3–6.4 show both. Steps 6.5–6.6 show `DL3_models` but NOT `DL3_cloud` (because `DL5_mcp_cloud` adds its own CLOUD pill around Remote MCP).

**Orchestrator layout (DO1_orch):**
- Teal bar spans full agent width: `x = a1x-8 = 32`, `width = a3x+aw-a1x+16 = 666`
- Position: `y=-60`, height=80, rx=28
- Font: T1 (30), weight 800
- Three straight vertical arrows from bar to each agent
- "task" labels on left side of each arrow (text-anchor="end")

**Roles layout (DO2_roles):**
- Colored borders around each agent (teal for Implementer, blue for Reviewer, orange for Test Runner)
- Role pill labels on top of each agent
- Colored "result"/"review"/"report" labels on right side of arrows

## Mobile Responsiveness

**Breakpoint:** `@media (max-width: 900px)`

### Key mobile CSS
```css
.scrolly-container { flex-direction: column; }
.scrolly-diagram {
  position: sticky; top: 0;
  width: 100%; height: 38vh; min-height: 240px;
  padding: 4px 6px 0;
  z-index: 10;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-color);
  overflow: hidden;
}
.scrolly-diagram .diagram-svg {
  max-height: none; width: 100%; height: 100%;
}
```

### preserveAspectRatio (set in scrolly.js)
- `mainDiagram`: `xMidYMin meet` — top-aligns content, fits full width, no clipping
- `deployDiagram`: `xMidYMin meet` — same approach, ensures full width visible

**Why not `slice`:** The deploy diagram (1080×810) is nearly the same aspect ratio as a phone screen, so `slice` clips the sides. `meet` preserves full width.

**Previous failed approaches:**
- `height: 120%; margin-top: -4%` with `overflow: hidden` — fragile, clipped content unpredictably
- `slice` for main diagram — clipped sides on deploy diagram (different viewBox ratio)
- The current approach (100% height/width, `meet`, 38vh container) is stable

### Theme toggle on mobile
- Moved inside `<section class="hero">` in HTML (was at body level)
- `position: absolute; top: 16px; right: 16px; z-index: 2` on mobile
- `hero { position: relative }` on mobile
- This makes it scroll away with the hero instead of staying fixed

## Page Structure (index.html)

```
<body>
  <nav class="nav-dots" id="navDots"/>     ← fixed right-side nav

  <section class="hero" id="sec-hero">
    <div class="theme-toggle"/>            ← inside hero for mobile scroll-away
    ...hero content...
  </section>

  <div class="scrolly-container" id="scrollyContainer">
    <div class="scrolly-diagram">          ← mainDiagram rendered here by diagram.js
    <div class="scrolly-text">
      steps 1.0–4.6 (.text-step elements)
    </div>
  </div>

  <div class="scrolly-container" id="scrollyContainer2">
    <div class="scrolly-diagram" id="deployDiagramContainer">  ← deployDiagram rendered here
    <div class="scrolly-text">
      steps 5.0–6.6 (.text-step elements)
    </div>
  </div>

  <section id="sec-products">             ← product comparison cards
  <section id="sec-eval">                 ← governance checklist (5 items)
  <section id="sec-end">                  ← summary + share links + footer
</body>
```

## Desktop Scrolly Layout

```css
.scrolly-diagram {
  position: sticky; top: 0;
  width: 62%; height: 100vh;
  padding: 20px 18px 12px 24px; z-index: 1;
}
.scrolly-text { width: 38%; position: relative; z-index: 2; }
.text-step {
  min-height: 100vh;
  padding: 120px 64px 120px 40px;
}
```

The diagram stays fixed on the left (62% width, full viewport height) while text steps scroll on the right (38%). Each step is at least 100vh tall so the scroll distance triggers the layer changes properly.

## Text Step HTML Pattern

Every step follows this exact structure:

```html
<div class="text-step" data-layers="L0,L2a,L2b" id="step2b">
  <div class="text-step-inner">
    <div class="step-label">
      <span class="step-dot" style="background:var(--blue)"></span>
      <span style="color:var(--blue)">2.1 · The Request</span>
    </div>
    <h2>Heading Text</h2>
    <p class="desc">Body paragraph with optional <strong>bold</strong> and
      <span class="num-pill" style="background:var(--blue)">1</span> numbered pills.</p>
    <!-- Optional callout box: -->
    <div class="callout" style="background:var(--blue-bg)">
      <strong style="color:var(--blue)">Title</strong>
      <span style="color:var(--text-muted)">Explanation text.</span>
    </div>
  </div>
</div>
```

**Key elements:**
- `data-layers` — comma-separated layer IDs to show when this step is active
- `data-scroll-offset` — (step 4 only) vertical pixel offset for L4inner translation
- `.step-label` — colored dot + "N.N · Title" text, parsed by scrolly.js to group into nav pills
- `.text-step-inner` — gets `class="visible"` via IntersectionObserver for fade-in animation
- `.num-pill` — small inline colored circle with a number, matches diagram arrows

**To add a new step:** Copy an existing step, update `data-layers`, `id`, step-label number/title, and heading/body. The nav pills auto-generate from the section number in the label.

## Theming

**Three modes:** Light (default), Dark, Auto (follows system `prefers-color-scheme`).

**How it works:**
1. Theme stored in `localStorage` key `agent-stack-theme` (values: `light`, `dark`, `auto`)
2. Inline `<script>` in `<head>` reads it on load and sets `document.documentElement.setAttribute('data-theme', resolved)` — this prevents FOUC
3. Toggle buttons in hero section update localStorage and re-apply
4. CSS uses `[data-theme="dark"] { ... }` to override `:root` variables

**Color system** — CSS custom properties in `:root` (light) and `[data-theme="dark"]`:
- Semantic: `--bg-color`, `--card-bg`, `--text-primary`, `--text-muted`, `--text-light`, `--border-color`, `--border-light`
- Brand: `--gold`, `--cream`, `--sand`, `--peach`, `--brown`
- Accent: `--blue`, `--green`, `--amber`, `--purple`, `--orange`, `--coral`, `--rose`, `--teal`
- Each accent has a `-bg` variant (e.g., `--blue-bg`) for light fills and a `-light` variant for gradients

## Layer Animation CSS

```css
.diagram-svg .layer {
  opacity: 0;
  transition: opacity .8s cubic-bezier(.23,1,.32,1);
}
.diagram-svg .layer.show { opacity: 1; }
.diagram-svg .layer.highlight { animation: layerPulse 1.5s ease-out; }

@keyframes layerPulse {
  0%   { filter: brightness(1) saturate(1); }
  30%  { filter: brightness(1.3) saturate(1.2) drop-shadow(0 0 15px var(--gold)); }
  100% { filter: brightness(1) saturate(1); }
}
```

- Layers are hidden by default (`opacity: 0`)
- `scrolly.js` adds `class="show"` → fades in over 0.8s
- First time a layer appears, `class="highlight"` is added → golden pulse effect
- `highlight` is removed and re-added (with `offsetWidth` reflow) to retrigger on each entrance

## Nav Pill CSS

```css
.nav-dots { position: fixed; right: 28px; top: 50%; transform: translateY(-50%); }
.nav-dot { width: 10px; height: 10px; border-radius: 50%; }
.nav-dot.active { background: var(--gold); transform: scale(1.4); }

.nav-pill { display: flex; flex-direction: column; border-radius: 99px; overflow: hidden; }
.nav-pill-seg { width: 8px; height: 8px; }
.nav-pill-seg.active { background: var(--gold); height: 14px; }
.nav-pill.group-active { box-shadow: 0 0 10px rgba(212,145,94,.25); }
```

- `navItems` array contains all navigable elements: hero dot, pill segments, post-scrolly dots
- `updateNav()` runs on scroll, finds closest item to viewport center, sets `.active`
- Nav is hidden on mobile (`display: none` at 900px breakpoint)

## Products Section (sec-products)

Six product comparison cards in a `grid-3` layout:

| Product | Model | Instructions File | Runtime |
|---|---|---|---|
| Claude Code | Claude models | `CLAUDE.md` | Local terminal + subagents |
| Codex | GPT-5.4 | `AGENTS.md` | Local CLI or cloud sandboxes |
| Cursor | Multi-model | `.cursor/rules` | In-editor + remote background agents |
| Gemini Code Assist | Gemini family | Workspace context | IDE assistant + CLI agent loop |
| OpenCode | Any provider API | Config + prompts | Provider-agnostic local runtime |
| Copilot | Multi-model (GPT-5.x, Claude, Gemini) | `.github/copilot-instructions.md` | IDE, CLI, or cloud GitHub Actions |

Below the cards: a `compare-band` (2-column grid) with "Direct Model Path" (OpenCode) and "Platform-Native Path" (Copilot) comparison paragraphs.

**To update a product:** Edit the corresponding `.info-card` div in `sec-products`. Each card has `h3` (name + subtitle span) and `.items` div with `<div><strong>Label:</strong> value</div>` rows.

## Governance Section (sec-eval)

Title: "Before You Deploy" — 5 numbered eval items:

| # | Color | Topic | Question |
|---|---|---|---|
| 1 | blue | Data Sovereignty | Where is the model running, and who stores the logs? |
| 2 | green | Tool Permissions | What is the blast radius if the agent goes rogue? |
| 3 | purple | Auditability | Can I replay every action in a verifiable log? |
| 4 | amber | Approval Gates | Where are the human-in-the-loop checkpoints (and beware of approval fatigue)? |
| 5 | coral | Instruction Drift | How do I detect, correct, and prevent deviation from scoped role? |

Compressed layout for single-page fit with separate mobile sizes (smaller nums, tighter padding).

## Footer and Social Sharing

**Share links** in footer div:
- **LinkedIn:** `https://www.linkedin.com/shareArticle?mini=true&url=...&title=...&summary=...`
- **X/Twitter:** `https://twitter.com/intent/tweet?url=...&text=...`

**OG meta tags** in `<head>`:
- `og:image` and `twitter:image` both point to `https://rusi.github.io/ai-agent-stack/demo.gif`
- `og:image:width` = 1920, `og:image:height` = 540

**Footer credit:** "Made with Claude + Codex + Gemini" with links.

**Summary section** (`sec-end`): Four `.layer-bar` items (Models are Engines, Tools are Hands, Instructions are Policy, Loops are Agency) + gold tagline pill "Build with Intent. Evaluate with Rigor."

## Common Gotchas

1. **CSS caching on mobile:** Changes to `styles.css` may not reflect on mobile reload. The page has no cache-busting mechanism — hard refresh or append `?v=timestamp` to CSS link.

2. **Git index.lock:** If `git-gui` or `gitk` is open, `git commit -m` fails with index.lock error. Use `git commit -F /tmp/commit-msg.txt` as workaround, or close git-gui first.

3. **Layer ID naming inconsistency:** Main diagram uses `L0`, `L2a`, etc. Deploy diagram uses `DL0`, `DL1_machine`, etc. The `D` prefix distinguishes deploy layers. Orchestration layers use `DO` prefix.

4. **ViewBox negative Y:** Deploy diagram's viewBox starts at `y=-70` to accommodate the orchestrator bar above the agents. This means y=0 is NOT the top of the SVG.

5. **Deploy diagram opacity:** All base elements (agent boxes, model boxes) use `opacity="0.5"` (`baseOp` variable) for a muted appearance that pops when boundaries are overlaid.

6. **pillLabel() is local to deploy-diagram.js** — not in diagram-utils.js. It creates opaque colored rounded-rect labels with white text for boundary edges (YOUR MACHINE, SANDBOX, LOCAL, CLOUD, etc.).

7. **Step 4 scroll animation** is the most complex part. `L4inner` is a group that translates vertically based on `data-scroll-offset` values. Arrow opacity fades in/out based on a visible band (`bandTop=500`, `bandBot=660`, `fadeRange=100`). The `yCenters` map (`L4a:518, L4b:646, L4c:778, L4d:933, L4f:1190`) defines each arrow's rest position. Progress between steps uses an adjusted curve (`adjProgress = (rawProgress - 0.4) / 0.6`) to delay the start of movement. To add a new loop step: add a layer, add its yCenters entry, add a `data-scroll-offset` step, and include it in `l4ArrowIds`.

8. **Both diagrams use `window.diagramUtils`** — shared helpers (`pill()`, `bubble()`, `tag()`, `defs()`) live in `diagram-utils.js` and are referenced as `var u = window.diagramUtils` in both `diagram.js` and `deploy-diagram.js`. The font tier system (T1–T4) is documented in the comment header of `diagram-utils.js`.

9. **Model Prompt document** uses a `clipPath` (`id="promptClip"`) to mask overflowing content. Three builder functions generate per-section content: `promptContent(state)` for 2.x weather, `promptContent3(state)` for 3.x instructions/skills/test, `promptContent4(state)` for 4.x dashboard agentic loop. Shared helpers are factored into `mkPrompt()` (returns lbl/ln/sm/sep/gap) and `promptWrap(parts, y)` (handles clipPath + scroll translation).

## Recording Scripts

Both scripts require `npx playwright install chromium` first.

- **`record-gif.js`**: Opens page at 1920×1080, presses down arrow repeatedly (1s pause), records video, converts to gif via ffmpeg. Output: `demo.mp4` + `demo.gif`.

- **`record-keyframes.js`**: Opens page at 1920×540 (wide aspect), clicks the last nav pill segment of each section group to jump to final state, takes high-res screenshots with 3s settle time, combines into slow-frame gif (1.5s/frame). Output: `demo.gif` in `output/` dir, copied to project root.
