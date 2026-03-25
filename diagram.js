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
    '<svg class="diagram-svg" viewBox="0 0 1260 960" id="mainDiagram" preserveAspectRatio="xMidYMid meet">',
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
    '  <rect x="50" y="400" width="200" height="260" rx="28" fill="var(--card-bg)" stroke="var(--border-color)" stroke-width="3" filter="url(#shadow)"/>',
    '  <text x="150" y="458" text-anchor="middle" font-size="20" font-weight="800" fill="var(--text-primary)">The User</text>',
    '  <text x="150" y="482" text-anchor="middle" font-size="14" fill="var(--text-muted)">Query / Intent</text>',
    '  <rect x="970" y="400" width="230" height="340" rx="42" fill="url(#gModel)" stroke="var(--blue)" stroke-width="4" filter="url(#shadow)"/>',
    '  <text x="1085" y="468" text-anchor="middle" font-size="34" font-weight="800" fill="var(--blue)">Model</text>',
    '  <text x="1085" y="500" text-anchor="middle" font-size="16" fill="var(--text-muted)">LLM / inference engine</text>',
    '  <line x1="1010" y1="538" x2="1160" y2="538" stroke="var(--blue)" stroke-width="1.4" opacity="0.22"/>',
    '  <text x="1085" y="558" text-anchor="middle" font-size="13" letter-spacing="2" font-weight="800" fill="var(--blue)">EXTERNAL API</text>',
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
    '  <text x="580" y="438" text-anchor="middle" font-size="22" font-weight="800" fill="var(--green)">Execution Engine</text>',
    '  <text x="580" y="462" text-anchor="middle" font-size="14" fill="var(--text-muted)">runs tools, returns results</text>',
    '</g>',

    // ═══ L2b · User → Engine ① ═══
    '<g class="layer" id="L2b">',
    bubble(340, 438, 'What is the weather in Boston?', 'var(--blue)', 220),
    '  <path d="M250,470 L430,470" fill="none" stroke="var(--blue)" stroke-width="3" marker-end="url(#arrBlue)"/>',
    pill(340, 470, 1, 'blue'),
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
    pill(352, 278, 3, 'purple'),
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
    '  <path d="M730,545 L970,545" fill="none" stroke="var(--green)" stroke-width="3" stroke-dasharray="8,6" marker-end="url(#arrGreen)"/>',
    pill(850, 545, 6, 'green'),
    tag(850, 569, 'TOOL_RESULT', '{ temp: 42, forecast: "rain" }', 'green'),
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

    // ═══ L5b · AGENTS.md ═══
    '<g class="layer" id="L5b">',
    '  <rect x="66" y="138" width="200" height="88" rx="22" fill="var(--card-bg)" stroke="var(--amber)" stroke-width="3" filter="url(#shadow)"/>',
    '  <text x="166" y="178" text-anchor="middle" font-size="18" font-weight="800" fill="var(--amber)">AGENTS.md</text>',
    '  <text x="166" y="200" text-anchor="middle" font-size="11" fill="var(--text-light)">identity &amp; rules</text>',
    '  <path d="M266,178 L330,178" fill="none" stroke="var(--amber)" stroke-width="3" stroke-dasharray="6,6" marker-end="url(#arrAmber)"/>',
    pill(290, 178, 1, 'amber'),
    '</g>',

    // ═══ L6 · SKILL.md + Registry ═══
    '<g class="layer" id="L6">',
    '  <rect x="66" y="248" width="200" height="80" rx="22" fill="var(--rose-bg)" stroke="var(--rose)" stroke-width="3" filter="url(#shadow)"/>',
    '  <text x="166" y="286" text-anchor="middle" font-size="18" font-weight="800" fill="var(--rose)">SKILL.md</text>',
    '  <text x="166" y="308" text-anchor="middle" font-size="11" fill="var(--text-light)">loaded via tool call</text>',
    '  <path d="M266,288 330,288" fill="none" stroke="var(--rose)" stroke-width="3" stroke-dasharray="6,6" marker-end="url(#arrRose)"/>',
    pill(290, 270, 2, 'rose'),
    '  <rect x="614" y="242" width="190" height="82" rx="12" fill="var(--card-bg)" stroke="var(--rose)" stroke-width="2" opacity="0.88"/>',
    '  <text x="709" y="264" text-anchor="middle" font-size="12" font-weight="700" fill="var(--rose)" letter-spacing="1">SKILL REGISTRY</text>',
    '  <text x="709" y="284" text-anchor="middle" font-size="11" fill="var(--text-muted)" style="font-family:\'JetBrains Mono\',monospace">/commit  /review-pr</text>',
    '  <text x="709" y="304" text-anchor="middle" font-size="11" fill="var(--text-muted)" style="font-family:\'JetBrains Mono\',monospace">/test    /deploy</text>',
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
    '  <path d="M970,600 L730,600" fill="none" stroke="var(--orange)" stroke-width="3" marker-end="url(#arrOrange)"/>',
    pill(850, 600, 5, 'orange'),
    tag(850, 624, 'TOOL_CALL', 'bash("pytest --cov")', 'orange'),
    '  <path d="M730,660 L970,660" fill="none" stroke="var(--orange)" stroke-width="3" stroke-dasharray="8,6" marker-end="url(#arrOrange)"/>',
    tag(850, 684, 'RESULT', '42 passed, 94% coverage', 'orange'),
    '</g>',

    // L3h · Bash result + answer to user ⑦
    '<g class="layer" id="L3h">',
    '  <path d="M970,720 L730,720" fill="none" stroke="var(--green)" stroke-width="3" marker-end="url(#arrGreen)"/>',
    pill(850, 720, 6, 'green'),
    // Engine → User (go up to user box bottom at y=650)
    '  <path d="M430,650 L250,650" fill="none" stroke="var(--green)" stroke-width="3" marker-end="url(#arrGreen)"/>',
    bubble(340, 618, 'All 42 tests passing, 94% coverage.', 'var(--green)', 270),
    '</g>',

    // ═══ L8 · Autonomous Loop ═══
    '<g class="layer" id="L8">',
    '  <rect x="300" y="360" width="920" height="520" rx="42" fill="none" stroke="var(--coral)" stroke-width="6" stroke-dasharray="18,14" opacity="0.48"/>',
    '  <text x="760" y="392" text-anchor="middle" font-size="18" font-weight="900" letter-spacing="4" fill="var(--coral)">AUTONOMOUS LOOP</text>',
    '  <path d="M1148,440 C1230,520 1230,720 1128,800 C1070,840 548,850 378,830 C302,820 294,740 294,640 C294,540 300,470 350,440" fill="none" stroke="var(--coral)" stroke-width="4" stroke-dasharray="12,10" marker-end="url(#arrCoral)"/>',
    pill(1218, 600, 12, 'coral'),
    '  <text x="1010" y="830" text-anchor="middle" font-size="11" font-weight="700" fill="var(--coral)">plan \u2192 act \u2192 observe \u2192 repeat</text>',
    '</g>',

    // ═══ L9 · Multi-Agent ═══
    '<g class="layer" id="L9">',
    '  <rect x="42" y="898" width="1176" height="50" rx="24" fill="var(--teal-bg)" stroke="var(--teal)" stroke-width="3" filter="url(#shadow)"/>',
    '  <text x="630" y="930" text-anchor="middle" font-size="20" font-weight="900" letter-spacing="3" fill="var(--teal)">MULTI-AGENT ORCHESTRATION</text>',
    pill(1184, 923, 13, 'teal'),
    '</g>',

    '</svg>'
  ].join('\n');
})();
