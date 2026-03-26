// diagram.js — 3-Column Agent Architecture Diagram
(function () {
  var container = document.querySelector('.scrolly-diagram');
  if (!container) return;

  function pill(x, y, label, colorClass) {
    return [
      '<g class="dyn-pill" data-label="' + label + '" transform="translate(' + x + ',' + y + ')">',
      '  <circle r="12" fill="var(--' + colorClass + ')" filter="url(#shadow)"/>',
      '  <text y="4" text-anchor="middle" font-size="12" font-weight="800" fill="#FFFFFF">' + label + '</text>',
      '</g>'
    ].join('\n');
  }

  function bubble(x, y, text, stroke, width) {
    return [
      '<g transform="translate(' + x + ',' + y + ')">',
      '  <rect x="-' + (width / 2) + '" y="-20" width="' + width + '" height="40" rx="14" fill="var(--card-bg)" stroke="' + stroke + '" stroke-width="2" filter="url(#shadow)"/>',
      '  <text y="6" text-anchor="middle" font-size="14" font-weight="700" fill="var(--text-primary)">' + text + '</text>',
      '</g>'
    ].join('\n');
  }

  // Two-line label: title + mono detail
  function tag(x, y, title, detail, color) {
    return [
      '<g transform="translate(' + x + ',' + y + ')">',
      '  <text y="0" text-anchor="middle" font-size="10" font-weight="700" letter-spacing="1" fill="var(--' + color + ')">' + title + '</text>',
      '  <text y="17" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text-primary)" style="font-family:\'JetBrains Mono\',monospace">' + detail + '</text>',
      '</g>'
    ].join('\n');
  }

  // ── Box edges ──
  // User:   x=50  w=200  → 50–250
  // Engine: x=430 w=300  → 430–730
  // Model:  x=970 w=230  → 970–1200
  // Gaps: User↔Engine 180px, Engine↔Model 240px (center at 850)

  container.innerHTML = [
    '<svg class="diagram-svg" viewBox="0 0 1260 1060" id="mainDiagram" preserveAspectRatio="xMidYMid meet">',
    '<defs>',
    '  <filter id="shadow" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000000" flood-opacity="0.14"/></filter>',
    '  <linearGradient id="gModel" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="var(--blue-bg)"/><stop offset="100%" stop-color="var(--blue-light)"/></linearGradient>',
    '  <linearGradient id="gExec" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="var(--green-bg)"/><stop offset="100%" stop-color="var(--green-light)"/></linearGradient>',
    '  <marker id="arrBlue"   viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="var(--blue)"/></marker>',
    '  <marker id="arrAmber"  viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="var(--amber)"/></marker>',
    '  <marker id="arrGreen"  viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="var(--green)"/></marker>',
    '  <marker id="arrBrown"  viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="var(--text-light)"/></marker>',
    '  <marker id="arrPurple" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="var(--purple)"/></marker>',
    '  <marker id="arrOrange" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="var(--orange)"/></marker>',
    '  <marker id="arrCoral"  viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="var(--coral)"/></marker>',
    '  <marker id="arrRose"   viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="var(--rose)"/></marker>',
    '</defs>',

    // ═══ L0 · Base boxes ═══
    '<g class="layer show" id="L0">',
    // User box — centered text
    '  <rect x="50" y="400" width="200" height="260" rx="28" fill="var(--card-bg)" stroke="var(--border-color)" stroke-width="3" filter="url(#shadow)"/>',
    '  <text x="150" y="520" text-anchor="middle" font-size="24" font-weight="800" fill="var(--text-primary)">The User</text>',
    '  <text x="150" y="546" text-anchor="middle" font-size="14" fill="var(--text-muted)">Query / Intent</text>',
    // Model box — centered text
    '  <rect x="970" y="400" width="230" height="340" rx="42" fill="url(#gModel)" stroke="var(--blue)" stroke-width="4" filter="url(#shadow)"/>',
    '  <text x="1085" y="516" text-anchor="middle" font-size="36" font-weight="800" fill="var(--blue)">Model</text>',
    '  <text x="1085" y="546" text-anchor="middle" font-size="16" fill="var(--text-muted)">LLM / inference engine</text>',
    '  <line x1="1010" y1="578" x2="1160" y2="578" stroke="var(--blue)" stroke-width="1.4" opacity="0.22"/>',
    '  <text x="1085" y="602" text-anchor="middle" font-size="13" letter-spacing="2" font-weight="800" fill="var(--blue)">EXTERNAL API</text>',
    '</g>',

    // ═══ L1q · Step 1 question ═══
    '<g class="layer" id="L1q">',
    bubble(610, 440, 'What is the tallest mountain?', 'var(--blue)', 276),
    '  <path d="M250,478 L970,478" fill="none" stroke="var(--blue)" stroke-width="3" marker-end="url(#arrBlue)"/>',
    pill(610, 478, 1, 'blue'),
    '</g>',

    // ═══ L1r · Step 1 response ═══
    '<g class="layer" id="L1r">',
    '  <path d="M970,530 L250,530" fill="none" stroke="var(--text-light)" stroke-width="3" marker-end="url(#arrBrown)"/>',
    pill(610, 530, 2, 'text-light'),
    bubble(610, 568, 'Mount Everest \u2014 8,849 m above sea level.', 'var(--text-light)', 344),
    '</g>',

    // ═══ L2a · Agent Runtime + Execution Engine ═══
    '<g class="layer" id="L2a">',
    '  <rect x="316" y="68" width="530" height="800" rx="36" fill="none" stroke="var(--text-light)" stroke-width="2.5" stroke-dasharray="18,14" opacity="0.4"/>',
    '  <text x="581" y="92" text-anchor="middle" font-size="17" font-weight="800" letter-spacing="4" fill="var(--text-light)">AGENT RUNTIME</text>',
    '  <text x="581" y="114" text-anchor="middle" font-size="11" fill="var(--text-muted)">local wrapper / orchestrator</text>',
    '  <rect x="430" y="400" width="300" height="420" rx="32" fill="url(#gExec)" stroke="var(--green)" stroke-width="4" filter="url(#shadow)"/>',
    '  <text x="580" y="480" text-anchor="middle" font-size="26" font-weight="800" fill="var(--green)">Execution</text>',
    '  <text x="580" y="510" text-anchor="middle" font-size="26" font-weight="800" fill="var(--green)">Engine</text>',
    '  <text x="580" y="536" text-anchor="middle" font-size="13" fill="var(--text-muted)">runs tools, returns results</text>',
    '</g>',

    // ═══ L2b · User → Engine ① ═══
    '<g class="layer" id="L2b">',
    bubble(340, 464, 'What is the weather in Boston?', 'var(--blue)', 220),
    '  <path d="M250,420 L430,420" fill="none" stroke="var(--blue)" stroke-width="3" marker-end="url(#arrBlue)"/>',
    pill(340, 420, 1, 'blue'),
    '</g>',

    // ═══ L2c · Context Assembly + Context Window — STRUCTURAL (boxes only) ═══
    '<g class="layer" id="L2c">',
    '  <rect x="340" y="126" width="494" height="210" rx="26" fill="var(--amber-bg)" stroke="var(--amber)" stroke-width="2" stroke-dasharray="10,8" opacity="0.72"/>',
    '  <text x="587" y="158" text-anchor="middle" font-size="17" font-weight="700" letter-spacing="2" fill="var(--amber)">CONTEXT ASSEMBLY</text>',
    '  <text x="587" y="184" text-anchor="middle" font-size="15" fill="var(--text-muted)">assembles prompt before sending to model</text>',
    '  <text x="587" y="214" text-anchor="middle" font-size="13" fill="var(--text-muted)" style="font-family:\'JetBrains Mono\',monospace">{ mode: "tool-call", format: "json" }</text>',
    '  <rect x="930" y="126" width="280" height="210" rx="28" fill="var(--amber-bg)" stroke="var(--amber)" stroke-width="3" stroke-dasharray="10,8" filter="url(#shadow)"/>',
    '  <text x="1070" y="164" text-anchor="middle" font-size="20" font-weight="800" letter-spacing="2" fill="var(--amber)">CONTEXT WINDOW</text>',
    '  <text x="1070" y="196" text-anchor="middle" font-size="16" fill="var(--text-muted)">system prompt, history, state</text>',
    '  <text x="1070" y="228" text-anchor="middle" font-size="14" font-weight="700" fill="var(--amber)">+ conversation history</text>',
    '</g>',

    // ═══ L2cf · Context FLOW (arrows + pills for step 2) ═══
    '<g class="layer" id="L2cf">',
    '  <path d="M834,200 L930,200" fill="none" stroke="var(--amber)" stroke-width="3" stroke-dasharray="7,6" marker-end="url(#arrAmber)"/>',
    '  <path d="M1070,336 L1070,390" fill="none" stroke="var(--amber)" stroke-width="3" stroke-dasharray="7,6" marker-end="url(#arrAmber)"/>',
    pill(1082, 363, 2, 'amber'),
    '  <path d="M730,420 L970,420" fill="none" stroke="var(--blue)" stroke-width="3" marker-end="url(#arrBlue)"/>',
    pill(850, 420, 2, 'blue'),
    '</g>',

    // ═══ L2d · MCP ② + Tool Schemas + Engine→Model ③ ═══
    '<g class="layer" id="L2d">',
    // MCP Servers (aligned with User)
    '  <rect x="50" y="694" width="200" height="118" rx="26" fill="var(--purple-bg)" stroke="var(--purple)" stroke-width="4" filter="url(#shadow)"/>',
    '  <text x="150" y="738" text-anchor="middle" font-size="20" font-weight="800" fill="var(--purple)">MCP Servers</text>',
    '  <text x="150" y="762" text-anchor="middle" font-size="13" fill="var(--text-muted)">GitHub, Jira, weather, Gmail</text>',
    '  <text x="150" y="782" text-anchor="middle" font-size="11" fill="var(--text-light)">and more\u2026</text>',
    // MCP Tool Schemas in Context Assembly — bigger box for bigger text
    '  <rect x="366" y="242" width="224" height="82" rx="14" fill="var(--card-bg)" stroke="var(--purple)" stroke-width="2" opacity="0.88"/>',
    '  <text x="478" y="264" text-anchor="middle" font-size="14" font-weight="700" fill="var(--purple)" letter-spacing="1">MCP TOOL SCHEMAS</text>',
    '  <text x="478" y="284" text-anchor="middle" font-size="10" fill="var(--text-muted)" style="font-family:\'JetBrains Mono\',monospace">weather(city) \u2192 {temp, forecast}</text>',
    '  <text x="478" y="304" text-anchor="middle" font-size="10" fill="var(--text-muted)" style="font-family:\'JetBrains Mono\',monospace">readEmail(id) \u2192 {subject, body}</text>',
    '</g>',

    // ═══ L2df · MCP pill (flow, hidden in step 3+) ═══
    '<g class="layer" id="L2df">',
    pill(352, 278, 3, 'purple'),
    '</g>',

    // ═══ L3a · tool_call Model→Engine ④  (y=480) ═══
    '<g class="layer" id="L3a">',
    '  <path d="M970,480 L730,480" fill="none" stroke="var(--blue)" stroke-width="3" marker-end="url(#arrBlue)"/>',
    pill(850, 480, 4, 'blue'),
    tag(850, 504, 'TOOL_CALL', 'weather("Boston")', 'blue'),
    '</g>',

    // ═══ L3b · Engine ↔ MCP ⑤ ═══
    '<g class="layer" id="L3b">',
    '  <path d="M430,743 L250,743" fill="none" stroke="var(--purple)" stroke-width="3" marker-end="url(#arrPurple)"/>',
    pill(340, 753, 5, 'purple'),
    '  <path d="M250,763 L430,763" fill="none" stroke="var(--purple)" stroke-width="3" stroke-dasharray="8,6" marker-end="url(#arrPurple)"/>',
    '</g>',

    // ═══ L3c · tool_result Engine→Model ⑥  (y=545) ═══
    '<g class="layer" id="L3c">',
    '  <path d="M730,555 L970,555" fill="none" stroke="var(--green)" stroke-width="3" stroke-dasharray="8,6" marker-end="url(#arrGreen)"/>',
    pill(850, 555, 6, 'green'),
    tag(850, 579, 'TOOL_RESULT', '{ temp: 42, forecast: "rain" }', 'green'),
    '</g>',

    // ═══ L3d · Final answer ⑦  (y=640) ═══
    '<g class="layer" id="L3d">',
    // Model → Engine
    '  <path d="M970,640 L730,640" fill="none" stroke="var(--green)" stroke-width="3" marker-end="url(#arrGreen)"/>',
    pill(850, 640, 7, 'green'),
    // Engine → User
    '  <path d="M430,640 L250,640" fill="none" stroke="var(--green)" stroke-width="3" marker-end="url(#arrGreen)"/>',
    bubble(340, 606, '42 \u00B0F and raining in Boston.', 'var(--green)', 200),
    '</g>',

    // ═══ L5a · Instructions border ═══
    '<g class="layer" id="L5a">',
    '  <rect x="42" y="86" width="250" height="256" rx="26" fill="none" stroke="var(--amber)" stroke-width="2" stroke-dasharray="14,10" opacity="0.5"/>',
    '  <text x="167" y="116" text-anchor="middle" font-size="13" font-weight="800" letter-spacing="2" fill="var(--amber)">INSTRUCTIONS</text>',
    '</g>',

    // ═══ L5b · AGENTS.md (box only) ═══
    '<g class="layer" id="L5b">',
    '  <rect x="66" y="138" width="200" height="88" rx="22" fill="var(--card-bg)" stroke="var(--amber)" stroke-width="3" filter="url(#shadow)"/>',
    '  <text x="166" y="178" text-anchor="middle" font-size="18" font-weight="800" fill="var(--amber)">AGENTS.md</text>',
    '  <text x="166" y="200" text-anchor="middle" font-size="11" fill="var(--text-light)">identity &amp; rules</text>',
    '</g>',

    // ═══ L5bf · AGENTS.md arrow + pill ═══
    '<g class="layer" id="L5bf">',
    '  <path d="M266,178 L330,178" fill="none" stroke="var(--amber)" stroke-width="3" stroke-dasharray="6,6" marker-end="url(#arrAmber)"/>',
    pill(290, 178, 1, 'amber'),
    '</g>',

    // ═══ L6 · SKILL.md + Registry (boxes only) ═══
    '<g class="layer" id="L6">',
    '  <rect x="66" y="248" width="200" height="80" rx="22" fill="var(--rose-bg)" stroke="var(--rose)" stroke-width="3" filter="url(#shadow)"/>',
    '  <text x="166" y="286" text-anchor="middle" font-size="18" font-weight="800" fill="var(--rose)">SKILL.md</text>',
    '  <text x="166" y="308" text-anchor="middle" font-size="11" fill="var(--text-light)">loaded via tool call</text>',
    '  <rect x="614" y="242" width="190" height="82" rx="12" fill="var(--card-bg)" stroke="var(--rose)" stroke-width="2" opacity="0.88"/>',
    '  <text x="709" y="264" text-anchor="middle" font-size="12" font-weight="700" fill="var(--rose)" letter-spacing="1">SKILL REGISTRY</text>',
    '  <text x="709" y="284" text-anchor="middle" font-size="11" fill="var(--text-muted)" style="font-family:\'JetBrains Mono\',monospace">/commit  /review-pr</text>',
    '  <text x="709" y="304" text-anchor="middle" font-size="11" fill="var(--text-muted)" style="font-family:\'JetBrains Mono\',monospace">/test    /deploy</text>',
    '</g>',

    // ═══ L6f · SKILL.md arrow + pill ═══
    '<g class="layer" id="L6f">',
    '  <path d="M266,288 330,288" fill="none" stroke="var(--rose)" stroke-width="3" stroke-dasharray="6,6" marker-end="url(#arrRose)"/>',
    pill(290, 270, 2, 'rose'),
    '</g>',

    // ═══ L7 · Bash / Shell (inside Engine box) ═══
    '<g class="layer" id="L7">',
    '  <rect x="462" y="720" width="236" height="70" rx="20" fill="var(--card-bg)" stroke="var(--orange)" stroke-width="3" filter="url(#shadow)"/>',
    '  <text x="580" y="750" text-anchor="middle" font-size="17" font-weight="800" fill="var(--orange)">BASH / SHELL</text>',
    '  <text x="580" y="770" text-anchor="middle" font-size="11" fill="var(--text-muted)">files, tests, commands</text>',
    '</g>',

    // ═══ Step 3 flow layers ═══

    // L3e · "Run my tests" User → Engine ④ — arrow above, text below
    '<g class="layer" id="L3e">',
    '  <path d="M250,420 L430,420" fill="none" stroke="var(--blue)" stroke-width="3" marker-end="url(#arrBlue)"/>',
    pill(340, 420, 3, 'blue'),
    bubble(340, 452, 'Run my tests', 'var(--blue)', 160),
    // Context arrows (redrawn for step 3 flow) with ③ pills
    '  <path d="M834,200 L930,200" fill="none" stroke="var(--amber)" stroke-width="3" stroke-dasharray="7,6" marker-end="url(#arrAmber)"/>',
    pill(882, 200, 3, 'amber'),
    '  <path d="M1070,336 L1070,390" fill="none" stroke="var(--amber)" stroke-width="3" stroke-dasharray="7,6" marker-end="url(#arrAmber)"/>',
    '  <path d="M730,420 L970,420" fill="none" stroke="var(--blue)" stroke-width="3" marker-end="url(#arrBlue)"/>',
    pill(850, 420, 3, 'blue'),
    '</g>',

    // L3f · Model returns tool_call: load_skill("/test") ⑤
    '<g class="layer" id="L3f">',
    '  <path d="M970,480 L730,480" fill="none" stroke="var(--rose)" stroke-width="3" marker-end="url(#arrRose)"/>',
    pill(850, 480, 4, 'rose'),
    tag(850, 504, 'TOOL_CALL', 'load_skill("/test")', 'rose'),
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
    // Engine → User (go up to user box bottom at y=650)
    '  <path d="M430,650 L250,650" fill="none" stroke="var(--green)" stroke-width="3" marker-end="url(#arrGreen)"/>',
    bubble(340, 618, 'All 42 tests passing, 94% coverage.', 'var(--green)', 270),
    '</g>',

    // ═══ L8 · Autonomous Loop boundary (box only, no arrow) ═══
    '<g class="layer" id="L8">',
    '  <rect x="300" y="350" width="920" height="620" rx="42" fill="none" stroke="var(--coral)" stroke-width="5" stroke-dasharray="18,14" opacity="0.48"/>',
    '  <text x="760" y="380" text-anchor="middle" font-size="18" font-weight="900" letter-spacing="4" fill="var(--coral)">AUTONOMOUS LOOP</text>',
    '  <text x="760" y="956" text-anchor="middle" font-size="22" font-weight="700" fill="var(--coral)">plan \u2192 act \u2192 observe \u2192 repeat</text>',
    '</g>',

    // ═══ Step 4 flow layers ═══

    // L4q · Question + context arrows (persists all step 4)
    '<g class="layer" id="L4q">',
    '  <path d="M250,420 L430,420" fill="none" stroke="var(--blue)" stroke-width="3" marker-end="url(#arrBlue)"/>',
    pill(340, 420, 1, 'blue'),
    bubble(340, 452, 'Implement the dashboard', 'var(--blue)', 220),
    '  <path d="M834,200 L930,200" fill="none" stroke="var(--amber)" stroke-width="3" stroke-dasharray="7,6" marker-end="url(#arrAmber)"/>',
    '  <path d="M1070,336 L1070,390" fill="none" stroke="var(--amber)" stroke-width="3" stroke-dasharray="7,6" marker-end="url(#arrAmber)"/>',
    '  <path d="M730,420 L970,420" fill="none" stroke="var(--blue)" stroke-width="3" marker-end="url(#arrBlue)"/>',
    '</g>',

    // ── Scrollable arrow zone (clipped, animated translateY) ──
    // Layers L4a-L4d are nested inside a clipped group for scroll animation.
    // L4q and L4e sit OUTSIDE the clip (question + final response).
    '<g>',
    '  <g id="L4inner">',

    // L4a · Jira MCP call ② (y=476–560)
    '<g class="layer" id="L4a">',
    '  <path d="M970,476 L730,476" fill="none" stroke="var(--purple)" stroke-width="3" marker-end="url(#arrPurple)"/>',
    pill(850, 476, 2, 'purple'),
    tag(850, 500, 'TOOL_CALL', 'jira("REQ-302")', 'purple'),
    '  <path d="M730,541 L970,541" fill="none" stroke="var(--purple)" stroke-width="3" stroke-dasharray="8,6" marker-end="url(#arrPurple)"/>',
    tag(850, 560, 'RESULT', '{title: "Dashboard", specs: ...}', 'purple'),
    '</g>',

    // L4b · Write files ③ (y=596–672)
    '<g class="layer" id="L4b">',
    '  <path d="M970,606 L730,606" fill="none" stroke="var(--orange)" stroke-width="3" marker-end="url(#arrOrange)"/>',
    pill(850, 606, 3, 'orange'),
    tag(850, 630, 'TOOL_CALL', 'writeFile("index.html")', 'orange'),
    '  <path d="M970,668 L730,668" fill="none" stroke="var(--orange)" stroke-width="3" marker-end="url(#arrOrange)"/>',
    tag(850, 686, 'TOOL_CALL', 'writeFile("app.js")', 'orange'),
    '</g>',

    // L4c · Test → fail ④ (y=716–800)
    '<g class="layer" id="L4c">',
    '  <path d="M970,736 L730,736" fill="none" stroke="var(--orange)" stroke-width="3" marker-end="url(#arrOrange)"/>',
    pill(850, 736, 4, 'orange'),
    tag(850, 760, 'TOOL_CALL', 'bash("npm test")', 'orange'),
    '  <path d="M730,802 L970,802" fill="none" stroke="var(--coral)" stroke-width="3" stroke-dasharray="8,6" marker-end="url(#arrCoral)"/>',
    tag(850, 820, 'FAIL', '2 tests failed', 'coral'),
    '</g>',

    // L4d · Fix + retest → pass ⑤ (y=836–960)
    '<g class="layer" id="L4d">',
    '  <path d="M970,866 L730,866" fill="none" stroke="var(--orange)" stroke-width="3" marker-end="url(#arrOrange)"/>',
    pill(850, 866, 5, 'orange'),
    tag(850, 890, 'TOOL_CALL', 'writeFile("app.js") // fix', 'orange'),
    '  <path d="M970,926 L730,926" fill="none" stroke="var(--orange)" stroke-width="3" marker-end="url(#arrOrange)"/>',
    tag(850, 940, 'TOOL_CALL', 'bash("npm test")', 'orange'),
    '  <path d="M730,982 L970,982" fill="none" stroke="var(--green)" stroke-width="3" stroke-dasharray="8,6" marker-end="url(#arrGreen)"/>',
    tag(850, 1000, 'PASS', 'all 8 tests passing', 'green'),
    '</g>',

    // L4f · ⑥ Model→Engine arrow only (y=1190, appears at y=640 when offset=-550)
    '<g class="layer" id="L4f">',
    pill(850, 1190, 6, 'green'),
    '  <path d="M970,1190 L730,1190" fill="none" stroke="var(--green)" stroke-width="3" marker-end="url(#arrGreen)"/>',
    '</g>',

    '  </g>',
    '</g>',

    // L4a_mcp · MCP arrows (outside clip, shown with L4a)
    '<g class="layer" id="L4a_mcp">',
    '  <path d="M430,743 L250,743" fill="none" stroke="var(--purple)" stroke-width="3" marker-end="url(#arrPurple)"/>',
    '  <path d="M250,763 L430,763" fill="none" stroke="var(--purple)" stroke-width="3" stroke-dasharray="8,6" marker-end="url(#arrPurple)"/>',
    '</g>',

    // L4e · Loop indicator + Engine→User result (outside clip, centered between blue arrow y=420 and ⑥ y=640)
    '<g class="layer" id="L4e">',
    // Loop indicator — centered at y=530 between blue arrow (420) and ⑥ arrow (640)
    '  <path d="M780,515 C820,485 900,485 940,515" fill="none" stroke="var(--coral)" stroke-width="3" stroke-dasharray="8,5" marker-end="url(#arrCoral)"/>',
    '  <path d="M940,545 C900,575 820,575 780,545" fill="none" stroke="var(--coral)" stroke-width="3" stroke-dasharray="8,5" marker-end="url(#arrCoral)"/>',
    '  <text x="860" y="535" text-anchor="middle" font-size="12" font-weight="800" fill="var(--coral)">3 iterations</text>',
    // Engine → User result arrow + bubble (near bottom of User box)
    '  <path d="M430,640 L250,640" fill="none" stroke="var(--green)" stroke-width="3" marker-end="url(#arrGreen)"/>',
    bubble(340, 608, 'Dashboard implemented. 3 files, 8 tests.', 'var(--green)', 290),
    '</g>',

    '</svg>'
  ].join('\n');
})();
