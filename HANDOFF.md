# Handoff: AI Agents Visual Guide — Interactive Scrollytelling Website

## What This Is
A single-page interactive scrollytelling website that explains how AI agents work, built for LinkedIn/GitHub Pages publication. The target audience is IT, Legal, and VP-level decision-makers who need to understand AI agent architecture to make informed tooling decisions.

## Current State
The `index.html` file is a working prototype with:
- A hero section with animated entrance
- A **scrollytelling section** where a sticky SVG diagram on the left evolves as explanatory text panels scroll on the right
- Post-scrolly sections for Deployment, Real Products, Evaluation Framework, and Key Takeaways
- Warm pastel color palette (cream/peach/gold/sand tones)
- DM Serif Display + DM Sans + JetBrains Mono font stack
- Nav dots on the right side
- Intersection Observer-based scroll animations

## Architecture of the Scrolly Section
- Left side (58%): `position: sticky` SVG diagram that stays fixed on screen
- Right side (42%): Text steps that scroll vertically, each with a `data-layers` attribute listing which SVG `<g class="layer">` elements should be visible
- As you scroll, layers L0–L9 fade in/out to progressively build the diagram
- The diagram shows: User → System Prompt/Context → Model (LLM) → Structured Output → Tool Executor → MCP Server → Bash → AGENTS.md → SKILL.md → Agentic Loop → Multi-Agent

## Correct Flow (THIS IS IMPORTANT)
The diagram must show this flow accurately:
1. User sends message → goes into the Model along with the System Prompt/Context
2. Model outputs either: a plain text response (step 1) OR structured JSON (step 2+)
3. From step 3+: Model outputs a structured **tool request** → Tool Executor receives it → executes the tool → sends result BACK to Model → Model writes final answer → sent to User
4. MCP: The available MCP tools are listed IN the system prompt/context (so the model knows what it can ask for). The MCP Server is connected to the Tool Executor (which makes the actual MCP calls)
5. Bash: Another tool type — the executor can run shell commands, same flow as any tool
6. AGENTS.md: Injected INTO the context/system prompt — defines persona/rules
7. SKILL.md: Also injected into context on-demand — task-specific expertise
8. Agentic Loop: Wraps around the executor area — Plan → Act → Observe → Repeat
9. Multi-Agent: An orchestrator spawns multiple instances of the entire stack

## Known Issues / Things to Improve

### Visual Design
- The SVG diagram is functional but visually basic — needs to be more polished, more "infographic" quality
- Boxes and arrows need better styling — rounded corners, subtle gradients, shadows, more visual hierarchy
- The diagram feels cramped — needs more breathing room and better spatial composition
- Consider using SVG filter effects for shadows, glow on active/new elements
- The arrows need to be clearer — proper arrowheads, better routing, maybe curved paths
- Each new layer should have a subtle highlight/glow animation when it first appears
- The text on arrows/labels is too small in some places

### Scrollytelling UX
- The text-step panels could use better enter/exit animations (not just fade — maybe slide, scale, etc.)
- When a new layer appears in the diagram, the NEW elements should have a brief pulse/highlight animation
- Consider adding a mini-progress indicator showing which step you're on
- The transition between "scrolly section" and "post-scrolly sections" feels abrupt
- Mobile experience needs work — the sticky diagram should probably go on top (half screen) with text scrolling below

### Content
- Step 1 example: "What is the capital of France?" → "Paris" (timeless fact — LLMs know this from training, no lookup needed)
- Need to emphasize the term "model" alongside "LLM" since that's the industry term
- The structured output step should show a clearer before/after — maybe the same question but with JSON response
- Tool use step: show a realistic example where the model NEEDS a tool (something it can't know from training)
- MCP step: better visual showing tools being "injected" into the context window
- Consider adding a step between Bash and AGENTS.md about "context window" and how it all fits together
- The Agentic Loop could use a more visual representation — maybe a circular arrow or loop diagram overlaid
- Products section could map each product to the diagram components more explicitly

### Technical
- Consider breaking this into a proper build (React/Vite) if it grows much more, but single HTML is fine for now
- The SVG should probably be generated dynamically (JS) rather than inline, to make layer management cleaner
- Could benefit from a small state machine for step tracking instead of pure intersection observer
- Keyboard navigation (arrow keys to step through) would be nice
- Consider prefers-reduced-motion for accessibility

### Future Ideas
- Add hover interactivity to the diagram — hover on a box to see a tooltip with more detail
- Animated connections — data "flowing" along arrows
- A "full diagram" mode where you can see everything at once and click any component
- Print/PDF export mode for people who want a static version
- Dark mode toggle
- Share buttons for LinkedIn/Twitter with OG image

## Color Palette (CSS Variables)
```
--cream: #FFF8F0        (background)
--sand: #F0E0CC         (borders, subtle bg)
--peach: #FFDFC8        (decorative)
--gold: #D4915E         (accent, CTAs)
--brown: #3D3024        (primary text)
--blue: #4A7FBF         (LLM/Model)
--green: #5E9E6E        (Tool Executor)
--purple: #8B6EAF       (MCP)
--orange: #D47B4A       (Bash/Terminal)
--coral: #C26B6B        (Agentic Loop)
--amber: #C4963A        (AGENTS.md, System Prompt)
--rose: #B85E7E         (SKILL.md)
--teal: #4A8E8E         (Multi-Agent)
```

## File Structure
Currently a single `index.html` with inline CSS and JS. If you refactor:
```
/
├── index.html
├── styles.css
├── diagram.js          (SVG diagram generation + layer management)
├── scrolly.js          (scroll tracking + animations)
└── README.md
```

## How to Run
Just open `index.html` in a browser. No build step needed. For GitHub Pages, push to a repo and enable Pages on the main branch.

## Key Principle
This is meant to be a **beautiful, educational infographic that happens to be interactive**. Think of the best visual explainers you've seen on sites like Stripe, Linear, or Figma's marketing pages. The diagram should be something people screenshot and share. Every visual choice should serve clarity and delight.
