// diagram.js — 3-Column Agent Architecture Diagram
//
// Font tiers: T1=30  T2=22  T3=16  T4=13  (pills=14)
//
(function () {
  var container = document.querySelector('.scrolly-diagram');
  if (!container) return;

  var u = window.diagramUtils;
  var pill = u.pill, bubble = u.bubble, tag = u.tag;

  // ── Box edges ──
  // User:   x=50  w=200  → 50–250
  // Engine: x=430 w=300  → 430–730
  // Model:  x=970 w=230  → 970–1200   center_x=1085
  // Model Prompt: x=945  w=280         center_x=1085 (aligned with Model)

  // ── Prompt document content builders ──
  var mono = "font-family:'JetBrains Mono',monospace";
  var PX = 957, CLIP_BOT = 338;

  function promptWrap(parts, y) {
    var scrollY = Math.max(0, y - CLIP_BOT);
    if (scrollY < 10) scrollY = 0;
    var tx = scrollY > 0 ? ' transform="translate(0,-'+scrollY+')"' : '';
    return '<g clip-path="url(#promptClip)"><g'+tx+'>' + parts.join('\n') + '</g></g>';
  }

  function mkPrompt() {
    var x = PX, parts = [], y = 120;
    function lbl(t, c) { parts.push('<text x="'+x+'" y="'+y+'" font-size="13" font-weight="700" fill="var(--'+c+')">'+t+'</text>'); y += 16; }
    function ln(t) { parts.push('<text x="'+x+'" y="'+y+'" font-size="13" fill="var(--text-muted)" style="'+mono+'">'+t+'</text>'); y += 16; }
    function sm(t) { parts.push('<text x="'+x+'" y="'+y+'" font-size="13" fill="var(--text-muted)" style="'+mono+'">'+t+'</text>'); y += 15; }
    function sep() { parts.push('<line x1="'+x+'" y1="'+y+'" x2="'+(x+256)+'" y2="'+y+'" stroke="var(--border-color)" stroke-width="1" opacity="0.4"/>'); y += 16; }
    function gap() { y += 4; }
    return { lbl: lbl, ln: ln, sm: sm, sep: sep, gap: gap, parts: parts, y: function() { return y; } };
  }

  // 2.x — Weather conversation
  function promptContent(state) {
    var p = mkPrompt();
    p.lbl('SYSTEM', 'amber'); p.ln('You are a helpful assistant.'); p.gap();
    if (state >= 1) { p.lbl('TOOLS', 'purple'); p.sm('weather(city) \u2192 forecast'); p.sm('readEmail(id) \u2192 {subj, body}'); p.sm('jira(id) \u2192 {title, specs}'); p.gap(); }
    p.sep();
    p.lbl('USER', 'blue'); p.ln('What\u2019s the weather in Boston?'); p.gap();
    if (state >= 2) { p.lbl('ASSISTANT', 'green'); p.sm('\u25b8 weather("Boston")'); p.gap(); p.lbl('TOOL RESULT', 'purple'); p.sm('{temp: 42\u00b0F, sky: "cloudy"}'); p.gap(); }
    return promptWrap(p.parts, p.y());
  }

  // 3.x — Instructions / skills / test run
  function promptContent3(state) {
    var p = mkPrompt();
    p.lbl('SYSTEM', 'amber'); p.sm('You are Junior \u2014 expert engineer.'); p.sm('Follow CLAUDE.md rules.'); p.gap();
    if (state >= 1) { p.lbl('TOOLS', 'purple'); p.sm('load_skill(name) \u2192 workflow'); p.sm('bash(cmd) \u2192 output'); p.gap(); p.lbl('SKILLS', 'rose'); p.sm('/test  /commit  /review-pr'); p.gap(); }
    p.sep();
    if (state >= 2) { p.lbl('USER', 'blue'); p.ln('Run my tests'); p.gap(); }
    if (state >= 3) { p.lbl('ASSISTANT', 'green'); p.sm('\u25b8 load_skill("/test")'); p.gap(); p.lbl('SKILL LOADED', 'rose'); p.sm('/test workflow injected'); p.gap(); }
    if (state >= 4) { p.lbl('ASSISTANT', 'green'); p.sm('\u25b8 bash("pytest --cov")'); p.gap(); p.lbl('TOOL RESULT', 'orange'); p.sm('42 passed, 94% coverage'); p.gap(); }
    return promptWrap(p.parts, p.y());
  }

  // 4.x — Dashboard agentic loop
  function promptContent4(state) {
    var p = mkPrompt();
    p.lbl('SYSTEM', 'amber'); p.sm('You are Junior \u2014 expert engineer.'); p.sm('Plan, act, observe, repeat.'); p.gap();
    p.lbl('TOOLS', 'purple'); p.sm('jira(id) \u2192 specs'); p.sm('writeFile(path, code)'); p.sm('bash(cmd) \u2192 output'); p.gap();
    p.sep();
    p.lbl('USER', 'blue'); p.ln('Implement the dashboard.'); p.gap();
    if (state >= 1) { p.lbl('ASSISTANT', 'green'); p.sm('\u25b8 jira("REQ-302")'); p.gap(); p.lbl('TOOL RESULT', 'purple'); p.sm('{title: "Dashboard", specs\u2026}'); p.gap(); }
    if (state >= 2) { p.lbl('ASSISTANT', 'green'); p.sm('\u25b8 writeFile("index.html")'); p.sm('\u25b8 writeFile("app.js")'); p.gap(); }
    if (state === 3) { p.lbl('ASSISTANT', 'green'); p.sm('\u25b8 bash("npm test")'); p.gap(); p.lbl('TOOL RESULT', 'coral'); p.sm('6 passed, 2 failed'); p.gap(); }
    if (state >= 4) { p.lbl('ASSISTANT', 'green'); p.sm('\u25b8 bash("npm test")'); p.gap(); p.lbl('TOOL RESULT', 'coral'); p.sm('6 passed, 2 failed'); p.gap(); p.lbl('ASSISTANT', 'green'); p.sm('\u25b8 writeFile("app.js")'); p.gap(); p.lbl('ASSISTANT', 'green'); p.sm('\u25b8 bash("npm test")'); p.gap(); p.lbl('TOOL RESULT', 'orange'); p.sm('all 8 tests passing'); p.gap(); }
    return promptWrap(p.parts, p.y());
  }

  container.innerHTML = [
    '<svg class="diagram-svg" viewBox="0 0 1260 1060" id="mainDiagram" preserveAspectRatio="xMidYMid meet">',
    u.defs('').replace('</defs>',
    '  <linearGradient id="gModel" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="var(--blue-bg)"/><stop offset="100%" stop-color="var(--blue-light)"/></linearGradient>\n' +
    '  <linearGradient id="gExec" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="var(--green-bg)"/><stop offset="100%" stop-color="var(--green-light)"/></linearGradient>\n' +
    '  <clipPath id="promptClip"><rect x="947" y="106" width="276" height="232"/></clipPath>\n' +
    '</defs>'),

    // ═══ L0 · Base boxes ═══
    '<g class="layer show" id="L0">',
    // User box
    '  <rect x="50" y="400" width="200" height="260" rx="28" fill="var(--card-bg)" stroke="var(--border-color)" stroke-width="3" filter="url(#shadow)"/>',
    '  <text x="150" y="520" text-anchor="middle" font-size="30" font-weight="800" fill="var(--text-primary)">The User</text>',        // T1
    '  <text x="150" y="548" text-anchor="middle" font-size="16" fill="var(--text-muted)">Query / Intent</text>',                       // T3
    // Model box
    '  <rect x="970" y="400" width="230" height="340" rx="42" fill="url(#gModel)" stroke="var(--blue)" stroke-width="4" filter="url(#shadow)"/>',
    '  <text x="1085" y="520" text-anchor="middle" font-size="30" font-weight="800" fill="var(--blue)">Model</text>',                   // T1
    '  <text x="1085" y="548" text-anchor="middle" font-size="16" fill="var(--text-muted)">LLM / inference engine</text>',               // T3
    '  <line x1="1010" y1="578" x2="1160" y2="578" stroke="var(--blue)" stroke-width="1.4" opacity="0.22"/>',
    '  <text x="1085" y="602" text-anchor="middle" font-size="16" letter-spacing="2" font-weight="800" fill="var(--blue)">EXTERNAL API</text>', // T3
    '  <text x="1178" y="718" text-anchor="end" font-size="13" fill="var(--text-light)" opacity="0.3">' + (typeof SITE_VERSION !== "undefined" ? SITE_VERSION : "v1.0") + '</text>',
    '</g>',

    // ═══ L1q · Step 1 question ═══
    '<g class="layer" id="L1q">',
    bubble(610, 440, 'What is the tallest mountain?', 'var(--blue)', 310),
    '  <path d="M250,478 L970,478" fill="none" stroke="var(--blue)" stroke-width="3" marker-end="url(#arrBlue)"/>',
    pill(610, 478, 1, 'blue'),
    '</g>',

    // ═══ L1r · Step 1 response ═══
    '<g class="layer" id="L1r">',
    '  <path d="M970,530 L250,530" fill="none" stroke="var(--text-light)" stroke-width="3" marker-end="url(#arrBrown)"/>',
    pill(610, 530, 2, 'text-light'),
    bubble(610, 568, 'Mount Everest \u2014 8,849 m above sea level.', 'var(--text-light)', 390),
    '</g>',

    // ═══ L2a · Agent Runtime + Execution Engine ═══
    '<g class="layer" id="L2a">',
    '  <rect x="316" y="68" width="530" height="800" rx="36" fill="none" stroke="var(--text-light)" stroke-width="2.5" stroke-dasharray="18,14" opacity="0.4"/>',
    '  <text x="581" y="92" text-anchor="middle" font-size="16" font-weight="800" letter-spacing="4" fill="var(--text-light)">AGENT RUNTIME</text>',  // T3
    '  <text x="581" y="114" text-anchor="middle" font-size="13" fill="var(--text-muted)">local process / orchestrator</text>',                       // T4
    '  <rect x="430" y="400" width="300" height="420" rx="32" fill="url(#gExec)" stroke="var(--green)" stroke-width="4" filter="url(#shadow)"/>',
    '  <text x="580" y="478" text-anchor="middle" font-size="30" font-weight="800" fill="var(--green)">Execution</text>',  // T1
    '  <text x="580" y="512" text-anchor="middle" font-size="30" font-weight="800" fill="var(--green)">Engine</text>',      // T1
    '  <text x="580" y="538" text-anchor="middle" font-size="16" fill="var(--text-muted)">runs tools, returns results</text>', // T3
    '</g>',

    // ═══ L2b · User → Engine ① ═══
    '<g class="layer" id="L2b">',
    bubble(340, 464, 'What is the weather in Boston?', 'var(--blue)', 280),
    '  <path d="M250,420 L430,420" fill="none" stroke="var(--blue)" stroke-width="3" marker-end="url(#arrBlue)"/>',
    pill(340, 420, 1, 'blue'),
    '</g>',

    // ═══ L2c · Context Assembly + Model Prompt document ═══
    '<g class="layer" id="L2c">',
    // Context Assembly box
    '  <rect x="340" y="126" width="494" height="220" rx="26" fill="var(--amber-bg)" stroke="var(--amber)" stroke-width="2" stroke-dasharray="10,8" opacity="0.72"/>',
    '  <text x="587" y="158" text-anchor="middle" font-size="16" font-weight="700" letter-spacing="2" fill="var(--amber)">CONTEXT ASSEMBLY</text>',  // T3
    '  <text x="587" y="180" text-anchor="middle" font-size="16" fill="var(--text-muted)">assembles prompt before sending to model</text>',            // T3
    '  <text x="587" y="210" text-anchor="middle" font-size="13" fill="var(--text-muted)" style="font-family:\'JetBrains Mono\',monospace">{ mode: "tool-call", format: "json" }</text>', // T4
    // Model Prompt document — horizontally centered on Model box (center_x=1085)
    '  <rect x="945" y="80" width="280" height="260" rx="6" fill="var(--card-bg)" stroke="var(--amber)" stroke-width="2" filter="url(#shadow)"/>',
    '  <line x1="945" y1="104" x2="1225" y2="104" stroke="var(--amber)" stroke-width="1" opacity="0.4"/>',
    '  <text x="1085" y="98" text-anchor="middle" font-size="16" font-weight="700" letter-spacing="1.5" fill="var(--amber)">MODEL PROMPT</text>',     // T3
    '</g>',

    // ═══ LP0 · Prompt state 0: system + user ═══
    '<g class="layer" id="LP0">', promptContent(0), '</g>',
    // ═══ LP1 · Prompt state 1: + tools ═══
    '<g class="layer" id="LP1">', promptContent(1), '</g>',
    // ═══ LP2 · Prompt state 2: + tool call & result ═══
    '<g class="layer" id="LP2">', promptContent(2), '</g>',

    // ═══ LP3_0–LP3_4 · 3.x prompt states (instructions/skills/test) ═══
    '<g class="layer" id="LP3_0">', promptContent3(0), '</g>',
    '<g class="layer" id="LP3_1">', promptContent3(1), '</g>',
    '<g class="layer" id="LP3_2">', promptContent3(2), '</g>',
    '<g class="layer" id="LP3_3">', promptContent3(3), '</g>',
    '<g class="layer" id="LP3_4">', promptContent3(4), '</g>',

    // ═══ LP4_0–LP4_4 · 4.x prompt states (dashboard agentic loop) ═══
    '<g class="layer" id="LP4_0">', promptContent4(0), '</g>',
    '<g class="layer" id="LP4_1">', promptContent4(1), '</g>',
    '<g class="layer" id="LP4_2">', promptContent4(2), '</g>',
    '<g class="layer" id="LP4_3">', promptContent4(3), '</g>',
    '<g class="layer" id="LP4_4">', promptContent4(4), '</g>',

    // ═══ L2cf · Context FLOW (arrows + pills for step 2) ═══
    '<g class="layer" id="L2cf">',
    '  <path d="M834,230 L945,230" fill="none" stroke="var(--amber)" stroke-width="3" stroke-dasharray="7,6" marker-end="url(#arrAmber)"/>',
    pill(880, 230, 2, 'amber'),
    '  <path d="M1085,340 L1085,392" fill="none" stroke="var(--amber)" stroke-width="3" stroke-dasharray="7,6" marker-end="url(#arrAmber)"/>',
    '  <path d="M730,420 L970,420" fill="none" stroke="var(--blue)" stroke-width="3" marker-end="url(#arrBlue)"/>',
    pill(850, 420, 2, 'blue'),
    '</g>',

    // ═══ L2d · MCP ② + Tool Schemas + Engine→Model ③ ═══
    '<g class="layer" id="L2d">',
    // MCP Servers (aligned with User)
    '  <rect x="50" y="694" width="200" height="118" rx="26" fill="var(--purple-bg)" stroke="var(--purple)" stroke-width="4" filter="url(#shadow)"/>',
    '  <text x="150" y="736" text-anchor="middle" font-size="22" font-weight="800" fill="var(--purple)">MCP Servers</text>',       // T2
    '  <text x="150" y="760" text-anchor="middle" font-size="16" fill="var(--text-muted)">Weather, Gmail, JIRA</text>',            // T3
    '  <text x="150" y="782" text-anchor="middle" font-size="13" fill="var(--text-light)">and more\u2026</text>',                  // T4
    // MCP Tool Schemas in Context Assembly
    '  <rect x="362" y="240" width="240" height="90" rx="14" fill="var(--card-bg)" stroke="var(--purple)" stroke-width="2" opacity="0.88"/>',
    '  <text x="482" y="262" text-anchor="middle" font-size="16" font-weight="700" fill="var(--purple)" letter-spacing="1">MCP TOOL SCHEMAS</text>', // T3
    '  <text x="482" y="280" text-anchor="middle" font-size="13" fill="var(--text-muted)" style="font-family:\'JetBrains Mono\',monospace">weather(city) \u2192 {forecast}</text>',   // T4
    '  <text x="482" y="296" text-anchor="middle" font-size="13" fill="var(--text-muted)" style="font-family:\'JetBrains Mono\',monospace">readEmail(id) \u2192 {subj, body}</text>',    // T4
    '  <text x="482" y="312" text-anchor="middle" font-size="13" fill="var(--text-muted)" style="font-family:\'JetBrains Mono\',monospace">jira(id) \u2192 {title, specs}</text>',    // T4
    '</g>',

    // ═══ L2df · MCP pill (flow, hidden in step 3+) ═══
    '<g class="layer" id="L2df">',
    pill(352, 280, 3, 'purple'),
    '</g>',

    // ═══ LH · History (session conversation turns) ═══
    '<g class="layer" id="LH">',
    '  <rect x="442" y="566" width="135" height="56" rx="14" fill="var(--blue-bg)" stroke="var(--blue)" stroke-width="2" opacity="0.9"/>',
    '  <text x="510" y="592" text-anchor="middle" font-size="22" font-weight="700" fill="var(--blue)">History</text>',       // T2
    '  <text x="510" y="612" text-anchor="middle" font-size="13" fill="var(--text-muted)">session turns</text>',              // T4
    '</g>',

    // ═══ LM · Memory (persistent across sessions) ═══
    '<g class="layer" id="LM">',
    '  <rect x="583" y="566" width="135" height="56" rx="14" fill="var(--amber-bg)" stroke="var(--amber)" stroke-width="2" opacity="0.9"/>',
    '  <text x="651" y="592" text-anchor="middle" font-size="22" font-weight="700" fill="var(--amber)">Memory</text>',       // T2
    '  <text x="651" y="612" text-anchor="middle" font-size="13" fill="var(--text-muted)">persistent</text>',                 // T4
    '</g>',

    // ═══ L3a · tool_call Model→Engine ④  (y=480) ═══
    '<g class="layer" id="L3a">',
    '  <path d="M970,480 L730,480" fill="none" stroke="var(--blue)" stroke-width="3" marker-end="url(#arrBlue)"/>',
    pill(850, 480, 4, 'blue'),
    tag(850, 506, 'TOOL_CALL', 'weather("Boston")', 'blue'),
    '</g>',

    // ═══ L3b · Engine ↔ MCP ⑤ ═══
    '<g class="layer" id="L3b">',
    '  <path d="M430,743 L250,743" fill="none" stroke="var(--purple)" stroke-width="3" marker-end="url(#arrPurple)"/>',
    pill(340, 753, 5, 'purple'),
    '  <path d="M250,763 L430,763" fill="none" stroke="var(--purple)" stroke-width="3" stroke-dasharray="8,6" marker-end="url(#arrPurple)"/>',
    '</g>',

    // ═══ L3c · tool_result Engine→Model ⑥  (y=555) ═══
    '<g class="layer" id="L3c">',
    '  <path d="M730,555 L970,555" fill="none" stroke="var(--green)" stroke-width="3" stroke-dasharray="8,6" marker-end="url(#arrGreen)"/>',
    pill(850, 555, 6, 'green'),
    tag(850, 579, 'TOOL_RESULT', '{ temp: 42, sky: "cloudy" }', 'green'),
    '</g>',

    // ═══ L3d · Final answer ⑦  (y=640) ═══
    '<g class="layer" id="L3d">',
    '  <path d="M970,640 L730,640" fill="none" stroke="var(--green)" stroke-width="3" marker-end="url(#arrGreen)"/>',
    pill(850, 640, 7, 'green'),
    '  <path d="M430,640 L250,640" fill="none" stroke="var(--green)" stroke-width="3" marker-end="url(#arrGreen)"/>',
    bubble(340, 606, '42 \u00B0F and cloudy in Boston.', 'var(--green)', 260),
    '</g>',

    // ═══ L5a · Instructions border ═══
    '<g class="layer" id="L5a">',
    '  <rect x="42" y="86" width="250" height="256" rx="26" fill="none" stroke="var(--amber)" stroke-width="2" stroke-dasharray="14,10" opacity="0.5"/>',
    '  <text x="167" y="116" text-anchor="middle" font-size="16" font-weight="800" letter-spacing="2" fill="var(--amber)">INSTRUCTIONS</text>', // T3
    '</g>',

    // ═══ L5b · AGENTS.md (box only) ═══
    '<g class="layer" id="L5b">',
    '  <rect x="66" y="138" width="200" height="88" rx="22" fill="var(--card-bg)" stroke="var(--amber)" stroke-width="3" filter="url(#shadow)"/>',
    '  <text x="166" y="178" text-anchor="middle" font-size="22" font-weight="800" fill="var(--amber)">AGENTS.md</text>',  // T2
    '  <text x="166" y="200" text-anchor="middle" font-size="16" fill="var(--text-light)">persona &amp; rules</text>',     // T3
    '</g>',

    // ═══ L5bf · AGENTS.md arrow + pill ═══
    '<g class="layer" id="L5bf">',
    '  <path d="M266,178 L330,178" fill="none" stroke="var(--amber)" stroke-width="3" stroke-dasharray="6,6" marker-end="url(#arrAmber)"/>',
    pill(290, 158, 1, 'amber'),
    '</g>',

    // ═══ L6 · SKILL.md + Registry (boxes only) ═══
    '<g class="layer" id="L6">',
    '  <rect x="66" y="248" width="200" height="80" rx="22" fill="var(--rose-bg)" stroke="var(--rose)" stroke-width="3" filter="url(#shadow)"/>',
    '  <text x="166" y="286" text-anchor="middle" font-size="22" font-weight="800" fill="var(--rose)">SKILL.md</text>',     // T2
    '  <text x="166" y="308" text-anchor="middle" font-size="16" fill="var(--text-light)">loaded via tool call</text>',      // T3
    '  <rect x="608" y="240" width="210" height="90" rx="12" fill="var(--card-bg)" stroke="var(--rose)" stroke-width="2" opacity="0.88"/>',
    '  <text x="713" y="264" text-anchor="middle" font-size="16" font-weight="700" fill="var(--rose)" letter-spacing="1">SKILL REGISTRY</text>', // T3
    '  <text x="713" y="286" text-anchor="middle" font-size="13" fill="var(--text-muted)" style="font-family:\'JetBrains Mono\',monospace">/commit  /review-pr</text>', // T4
    '  <text x="713" y="306" text-anchor="middle" font-size="13" fill="var(--text-muted)" style="font-family:\'JetBrains Mono\',monospace">/test    /deploy</text>',     // T4
    '</g>',

    // ═══ L6f · SKILL.md arrow + pill ═══
    '<g class="layer" id="L6f">',
    '  <path d="M266,288 L330,288" fill="none" stroke="var(--rose)" stroke-width="3" stroke-dasharray="6,6" marker-end="url(#arrRose)"/>',
    pill(290, 270, 2, 'rose'),
    '</g>',

    // ═══ L7 · Bash / Shell (inside Engine box) ═══
    '<g class="layer" id="L7">',
    '  <rect x="455" y="718" width="250" height="78" rx="20" fill="var(--card-bg)" stroke="var(--orange)" stroke-width="3" filter="url(#shadow)"/>',
    '  <text x="580" y="750" text-anchor="middle" font-size="22" font-weight="800" fill="var(--orange)">BASH / SHELL</text>', // T2
    '  <text x="580" y="774" text-anchor="middle" font-size="16" fill="var(--text-muted)">files, tests, commands</text>',     // T3
    '</g>',

    // ═══ Step 3 flow layers ═══

    // L3e · "Run my tests" User → Engine ④
    '<g class="layer" id="L3e">',
    '  <path d="M250,420 L430,420" fill="none" stroke="var(--blue)" stroke-width="3" marker-end="url(#arrBlue)"/>',
    pill(340, 420, 3, 'blue'),
    bubble(340, 464, 'Run my tests', 'var(--blue)', 180),
    // Context arrows (redrawn for step 3 flow) with ③ pills
    '  <path d="M834,230 L945,230" fill="none" stroke="var(--amber)" stroke-width="3" stroke-dasharray="7,6" marker-end="url(#arrAmber)"/>',
    pill(890, 230, 3, 'amber'),
    '  <path d="M1085,340 L1085,392" fill="none" stroke="var(--amber)" stroke-width="3" stroke-dasharray="7,6" marker-end="url(#arrAmber)"/>',
    '  <path d="M730,420 L970,420" fill="none" stroke="var(--blue)" stroke-width="3" marker-end="url(#arrBlue)"/>',
    pill(850, 420, 3, 'blue'),
    '</g>',

    // L3f · Model returns tool_call: load_skill("/test") ⑤
    '<g class="layer" id="L3f">',
    '  <path d="M970,480 L730,480" fill="none" stroke="var(--rose)" stroke-width="3" marker-end="url(#arrRose)"/>',
    pill(850, 480, 4, 'rose'),
    tag(850, 506, 'TOOL_CALL', 'load_skill("/test")', 'rose'),
    '  <path d="M730,545 L970,545" fill="none" stroke="var(--rose)" stroke-width="3" stroke-dasharray="8,6" marker-end="url(#arrRose)"/>',
    tag(850, 569, 'SKILL_LOADED', '/test workflow injected', 'rose'),
    '</g>',

    // L3g · Skill loaded + Model calls bash ⑥
    '<g class="layer" id="L3g">',
    '  <path d="M970,620 L730,620" fill="none" stroke="var(--orange)" stroke-width="3" marker-end="url(#arrOrange)"/>',
    pill(850, 620, 5, 'orange'),
    tag(850, 644, 'TOOL_CALL', 'bash("pytest --cov")', 'orange'),
    '  <path d="M730,685 L970,685" fill="none" stroke="var(--orange)" stroke-width="3" stroke-dasharray="8,6" marker-end="url(#arrOrange)"/>',
    tag(850, 699, 'RESULT', '42 passed, 94% coverage', 'orange'),
    '</g>',

    // L3h · Bash result + answer to user ⑦
    '<g class="layer" id="L3h">',
    '  <path d="M970,740 L730,740" fill="none" stroke="var(--green)" stroke-width="3" marker-end="url(#arrGreen)"/>',
    pill(850, 740, 6, 'green'),
    '  <path d="M430,650 L250,650" fill="none" stroke="var(--green)" stroke-width="3" marker-end="url(#arrGreen)"/>',
    bubble(340, 618, 'All 42 tests passing, 94% coverage.', 'var(--green)', 310),
    '</g>',

    // ═══ L8 · Agentic Loop boundary ═══
    '<g class="layer" id="L8">',
    '  <rect x="300" y="350" width="920" height="620" rx="42" fill="none" stroke="var(--coral)" stroke-width="5" stroke-dasharray="18,14" opacity="0.48"/>',
    '  <text x="760" y="380" text-anchor="middle" font-size="22" font-weight="900" letter-spacing="4" fill="var(--coral)">AGENTIC LOOP</text>', // T2
    '  <text x="760" y="956" text-anchor="middle" font-size="22" font-weight="700" fill="var(--coral)">plan \u2192 act \u2192 observe \u2192 repeat</text>', // T2
    '</g>',

    // ═══ Step 4 flow layers ═══

    // L4q · Question + context arrows (persists all step 4)
    '<g class="layer" id="L4q">',
    '  <path d="M250,420 L430,420" fill="none" stroke="var(--blue)" stroke-width="3" marker-end="url(#arrBlue)"/>',
    pill(340, 420, 1, 'blue'),
    bubble(340, 454, 'Implement the dashboard', 'var(--blue)', 250),
    '  <path d="M834,230 L945,230" fill="none" stroke="var(--amber)" stroke-width="3" stroke-dasharray="7,6" marker-end="url(#arrAmber)"/>',
    '  <path d="M1085,340 L1085,392" fill="none" stroke="var(--amber)" stroke-width="3" stroke-dasharray="7,6" marker-end="url(#arrAmber)"/>',
    '  <path d="M730,420 L970,420" fill="none" stroke="var(--blue)" stroke-width="3" marker-end="url(#arrBlue)"/>',
    '</g>',

    // ── Scrollable arrow zone (clipped, animated translateY) ──
    '<g>',
    '  <g id="L4inner">',

    // L4a · Jira MCP call ②
    '<g class="layer" id="L4a">',
    '  <path d="M970,476 L730,476" fill="none" stroke="var(--purple)" stroke-width="3" marker-end="url(#arrPurple)"/>',
    pill(850, 476, 2, 'purple'),
    tag(850, 502, 'TOOL_CALL', 'jira("REQ-302")', 'purple'),
    '  <path d="M730,541 L970,541" fill="none" stroke="var(--purple)" stroke-width="3" stroke-dasharray="8,6" marker-end="url(#arrPurple)"/>',
    tag(850, 562, 'RESULT', '{title: "Dashboard", specs: ...}', 'purple'),
    '</g>',

    // L4b · Write files ③
    '<g class="layer" id="L4b">',
    '  <path d="M970,606 L730,606" fill="none" stroke="var(--orange)" stroke-width="3" marker-end="url(#arrOrange)"/>',
    pill(850, 606, 3, 'orange'),
    tag(850, 632, 'TOOL_CALL', 'writeFile("index.html")', 'orange'),
    '  <path d="M970,668 L730,668" fill="none" stroke="var(--orange)" stroke-width="3" marker-end="url(#arrOrange)"/>',
    tag(850, 688, 'TOOL_CALL', 'writeFile("app.js")', 'orange'),
    '</g>',

    // L4c · Test → fail ④
    '<g class="layer" id="L4c">',
    '  <path d="M970,736 L730,736" fill="none" stroke="var(--orange)" stroke-width="3" marker-end="url(#arrOrange)"/>',
    pill(850, 736, 4, 'orange'),
    tag(850, 762, 'TOOL_CALL', 'bash("npm test")', 'orange'),
    '  <path d="M730,802 L970,802" fill="none" stroke="var(--coral)" stroke-width="3" stroke-dasharray="8,6" marker-end="url(#arrCoral)"/>',
    tag(850, 822, 'FAIL', '2 tests failed', 'coral'),
    '</g>',

    // L4d · Fix + retest → pass ⑤
    '<g class="layer" id="L4d">',
    '  <path d="M970,866 L730,866" fill="none" stroke="var(--orange)" stroke-width="3" marker-end="url(#arrOrange)"/>',
    pill(850, 866, 5, 'orange'),
    tag(850, 892, 'TOOL_CALL', 'writeFile("app.js") // fix', 'orange'),
    '  <path d="M970,926 L730,926" fill="none" stroke="var(--orange)" stroke-width="3" marker-end="url(#arrOrange)"/>',
    tag(850, 942, 'TOOL_CALL', 'bash("npm test")', 'orange'),
    '  <path d="M730,982 L970,982" fill="none" stroke="var(--green)" stroke-width="3" stroke-dasharray="8,6" marker-end="url(#arrGreen)"/>',
    tag(850, 1002, 'PASS', 'all 8 tests passing', 'green'),
    '</g>',

    // L4f · ⑥ Model→Engine arrow only
    '<g class="layer" id="L4f">',
    pill(850, 1190, 6, 'green'),
    '  <path d="M970,1190 L730,1190" fill="none" stroke="var(--green)" stroke-width="3" marker-end="url(#arrGreen)"/>',
    '</g>',

    '  </g>',
    '</g>',

    // L4a_mcp · MCP arrows (outside clip)
    '<g class="layer" id="L4a_mcp">',
    '  <path d="M430,743 L250,743" fill="none" stroke="var(--purple)" stroke-width="3" marker-end="url(#arrPurple)"/>',
    '  <path d="M250,763 L430,763" fill="none" stroke="var(--purple)" stroke-width="3" stroke-dasharray="8,6" marker-end="url(#arrPurple)"/>',
    '</g>',

    // L4e · Loop indicator + Engine→User result
    '<g class="layer" id="L4e">',
    '  <path d="M780,515 C820,485 900,485 940,515" fill="none" stroke="var(--coral)" stroke-width="3" stroke-dasharray="8,5" marker-end="url(#arrCoral)"/>',
    '  <path d="M940,545 C900,575 820,575 780,545" fill="none" stroke="var(--coral)" stroke-width="3" stroke-dasharray="8,5" marker-end="url(#arrCoral)"/>',
    '  <text x="860" y="535" text-anchor="middle" font-size="13" font-weight="800" fill="var(--coral)">3 iterations</text>', // T4
    '  <path d="M430,640 L250,640" fill="none" stroke="var(--green)" stroke-width="3" marker-end="url(#arrGreen)"/>',
    bubble(340, 608, 'Dashboard done. 3 files, 8 tests.', 'var(--green)', 310),
    '</g>',

    '</svg>'
  ].join('\n');
})();
