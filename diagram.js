// diagram.js — 3-Column Agent Architecture Diagram
// Layout: User (left) | Agent Runtime (middle) | Model/LLM (right)
// Boxes aligned: User & Model same height, Engine taller (extends to MCP)
(function () {
  var container = document.querySelector('.scrolly-diagram');
  if (!container) return;

  // Pill: circled number on arrows
  function pill(x, y, order, colorClass) {
    return [
      '<g class="dyn-pill" data-order="' + order + '" transform="translate(' + x + ',' + y + ')">',
      '  <circle r="12" fill="var(--' + colorClass + ')" filter="url(#shadow)"/>',
      '  <text y="4" text-anchor="middle" font-size="12" font-weight="800" fill="#FFFFFF"></text>',
      '</g>'
    ].join('\n');
  }

  function bubble(x, y, text, stroke, width) {
    return [
      '<g transform="translate(' + x + ',' + y + ')">',
      '  <rect x="-' + (width / 2) + '" y="-19" width="' + width + '" height="38" rx="14" fill="var(--card-bg)" stroke="' + stroke + '" stroke-width="2" filter="url(#shadow)"/>',
      '  <text y="6" text-anchor="middle" font-size="12" font-weight="700" fill="var(--text-primary)">' + text + '</text>',
      '</g>'
    ].join('\n');
  }

  function codeBubble(x, y, text, stroke, width) {
    return [
      '<g transform="translate(' + x + ',' + y + ')">',
      '  <rect x="-' + (width / 2) + '" y="-19" width="' + width + '" height="38" rx="10" fill="var(--card-bg)" stroke="' + stroke + '" stroke-width="2" filter="url(#shadow)"/>',
      '  <text y="5" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text-primary)" style="font-family:\'JetBrains Mono\',monospace">' + text + '</text>',
      '</g>'
    ].join('\n');
  }

  // ── Box geometry (all tops aligned at y=400) ──
  // User:   x=56  w=212 h=260  → 400–660   right edge=268
  // Engine: x=418 w=340 h=420  → 400–820   edges 418–758
  // Model:  x=964 w=246 h=260  → 400–660   left edge=964

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
    '  <rect x="56" y="400" width="212" height="260" rx="28" fill="var(--card-bg)" stroke="var(--border-color)" stroke-width="3" filter="url(#shadow)"/>',
    '  <text x="162" y="440" text-anchor="middle" font-size="18" font-weight="800" fill="var(--text-primary)">The User</text>',
    '  <text x="162" y="464" text-anchor="middle" font-size="12" fill="var(--text-muted)">Query / Intent</text>',
    '  <rect x="964" y="400" width="246" height="260" rx="42" fill="url(#gModel)" stroke="var(--blue)" stroke-width="4" filter="url(#shadow)"/>',
    '  <text x="1087" y="440" text-anchor="middle" font-size="34" font-weight="800" fill="var(--blue)">Model</text>',
    '  <text x="1087" y="474" text-anchor="middle" font-size="15" fill="var(--text-muted)">LLM / inference engine</text>',
    '  <line x1="1014" y1="500" x2="1160" y2="500" stroke="var(--blue)" stroke-width="1.4" opacity="0.22"/>',
    '  <text x="1087" y="534" text-anchor="middle" font-size="11" letter-spacing="2" font-weight="800" fill="var(--blue)">EXTERNAL API</text>',
    '</g>',

    // ═══ L1q · Step 1 question ═══
    '<g class="layer" id="L1q">',
    bubble(616, 460, 'What is the tallest mountain?', 'var(--blue)', 276),
    '  <path d="M268,490 L964,490" fill="none" stroke="var(--blue)" stroke-width="3" marker-end="url(#arrBlue)"/>',
    pill(282, 490, 200, 'blue'),
    '</g>',

    // ═══ L1r · Step 1 response ═══
    '<g class="layer" id="L1r">',
    '  <path d="M964,520 L268,520" fill="none" stroke="var(--text-light)" stroke-width="3" marker-end="url(#arrBrown)"/>',
    pill(950, 520, 300, 'text-light'),
    bubble(616, 550, 'Mount Everest \u2014 8,849 m above sea level.', 'var(--text-light)', 344),
    '</g>',

    // ═══ L2a · Agent Runtime + Execution Engine ═══
    '<g class="layer" id="L2a">',
    '  <rect x="316" y="68" width="542" height="800" rx="36" fill="none" stroke="var(--text-light)" stroke-width="2.5" stroke-dasharray="18,14" opacity="0.4"/>',
    '  <text x="587" y="92" text-anchor="middle" font-size="17" font-weight="800" letter-spacing="4" fill="var(--text-light)">AGENT RUNTIME</text>',
    '  <text x="587" y="114" text-anchor="middle" font-size="11" fill="var(--text-muted)">local wrapper / orchestrator</text>',
    '  <rect x="418" y="400" width="340" height="420" rx="32" fill="url(#gExec)" stroke="var(--green)" stroke-width="4" filter="url(#shadow)"/>',
    '  <text x="588" y="440" text-anchor="middle" font-size="22" font-weight="800" fill="var(--green)">Execution Engine</text>',
    '  <text x="588" y="466" text-anchor="middle" font-size="13" fill="var(--text-muted)">runs tools, returns results to context</text>',
    '</g>',

    // ═══ L2b · User → Engine ① ═══
    '<g class="layer" id="L2b">',
    bubble(380, 460, 'What is the weather in Boston?', 'var(--blue)', 260),
    '  <path d="M268,490 L418,490" fill="none" stroke="var(--blue)" stroke-width="3" marker-end="url(#arrBlue)"/>',
    pill(282, 490, 180, 'blue'),
    '</g>',

    // ═══ L2c · Context Assembly + Context Window (no arrow to model yet) ═══
    '<g class="layer" id="L2c">',
    '  <rect x="360" y="148" width="454" height="156" rx="24" fill="var(--amber-bg)" stroke="var(--amber)" stroke-width="2" stroke-dasharray="10,8" opacity="0.72"/>',
    '  <text x="587" y="176" text-anchor="middle" font-size="14" font-weight="700" letter-spacing="2" fill="var(--amber)">CONTEXT ASSEMBLY</text>',
    '  <text x="587" y="198" text-anchor="middle" font-size="12" fill="var(--text-muted)">assembles prompt before sending to model</text>',
    '  <text x="587" y="224" text-anchor="middle" font-size="11" fill="var(--text-muted)" style="font-family:\'JetBrains Mono\',monospace">{ mode: "tool-call", format: "json" }</text>',
    '  <path d="M814,230 L922,230" fill="none" stroke="var(--amber)" stroke-width="3" stroke-dasharray="7,6" marker-end="url(#arrAmber)"/>',
    '  <rect x="930" y="86" width="280" height="172" rx="28" fill="var(--amber-bg)" stroke="var(--amber)" stroke-width="3" stroke-dasharray="10,8" filter="url(#shadow)"/>',
    '  <text x="1070" y="126" text-anchor="middle" font-size="18" font-weight="800" letter-spacing="2" fill="var(--amber)">CONTEXT WINDOW</text>',
    '  <text x="1070" y="156" text-anchor="middle" font-size="13" fill="var(--text-muted)">system prompt, history, state</text>',
    '  <text x="1070" y="186" text-anchor="middle" font-size="11" font-weight="700" fill="var(--amber)">+ conversation history</text>',
    '  <path d="M1070,258 L1070,390" fill="none" stroke="var(--amber)" stroke-width="3" stroke-dasharray="7,6" marker-end="url(#arrAmber)"/>',
    '</g>',

    // ═══ L2d · MCP + Tool Schemas ② + Engine→Model ③ ═══
    '<g class="layer" id="L2d">',
    '  <rect x="60" y="694" width="230" height="118" rx="26" fill="var(--purple-bg)" stroke="var(--purple)" stroke-width="4" filter="url(#shadow)"/>',
    '  <text x="175" y="740" text-anchor="middle" font-size="20" font-weight="800" fill="var(--purple)">MCP Servers</text>',
    '  <text x="175" y="764" text-anchor="middle" font-size="12" fill="var(--text-muted)">GitHub, Jira, weather, Gmail</text>',
    '  <text x="175" y="784" text-anchor="middle" font-size="10" fill="var(--text-light)">and more\u2026</text>',
    '  <rect x="380" y="240" width="196" height="62" rx="14" fill="var(--card-bg)" stroke="var(--purple)" stroke-width="2" opacity="0.88"/>',
    '  <text x="478" y="258" text-anchor="middle" font-size="10" font-weight="700" fill="var(--purple)" letter-spacing="1">MCP TOOL SCHEMAS</text>',
    '  <text x="478" y="275" text-anchor="middle" font-size="10" fill="var(--text-muted)" style="font-family:\'JetBrains Mono\',monospace">weather(city) \u2192 {temp, forecast}</text>',
    '  <text x="478" y="292" text-anchor="middle" font-size="10" fill="var(--text-muted)" style="font-family:\'JetBrains Mono\',monospace">readEmail(id) \u2192 {subject, body}</text>',
    pill(388, 268, 195, 'purple'),
    '  <path d="M758,490 L964,490" fill="none" stroke="var(--blue)" stroke-width="3" marker-end="url(#arrBlue)"/>',
    pill(772, 490, 197, 'blue'),
    '</g>',

    // ═══ L3a · tool_call Model→Engine ④ ═══
    '<g class="layer" id="L3a">',
    '  <path d="M964,540 L758,540" fill="none" stroke="var(--blue)" stroke-width="3" marker-end="url(#arrBlue)"/>',
    pill(950, 540, 210, 'blue'),
    codeBubble(861, 575, 'tool_call: weather("Boston")', 'var(--blue)', 240),
    '</g>',

    // ═══ L3b · Engine ↔ MCP ⑤ (straight horizontal) ═══
    '<g class="layer" id="L3b">',
    '  <path d="M418,753 L290,753" fill="none" stroke="var(--purple)" stroke-width="3" marker-end="url(#arrPurple)"/>',
    '  <polygon points="418,746 418,760 428,753" fill="var(--purple)"/>',
    pill(406, 753, 250, 'purple'),
    '</g>',

    // ═══ L3c · tool_result Engine→Model ⑥ ═══
    '<g class="layer" id="L3c">',
    '  <path d="M758,610 L964,610" fill="none" stroke="var(--green)" stroke-width="3" stroke-dasharray="8,6" marker-end="url(#arrGreen)"/>',
    pill(772, 610, 260, 'green'),
    codeBubble(861, 645, 'result: { temp: 42, forecast: "rain" }', 'var(--green)', 280),
    '</g>',

    // ═══ L3d · Final answer ⑦ — two arrows at y=650 ═══
    '<g class="layer" id="L3d">',
    '  <path d="M964,650 L758,650" fill="none" stroke="var(--green)" stroke-width="3" marker-end="url(#arrGreen)"/>',
    '  <path d="M418,650 L268,650" fill="none" stroke="var(--green)" stroke-width="3" marker-end="url(#arrGreen)"/>',
    pill(950, 650, 270, 'green'),
    bubble(343, 640, '42 \u00B0F and raining in Boston.', 'var(--green)', 236),
    '</g>',

    // ═══ L5 · Instructions ═══
    '<g class="layer" id="L5">',
    '  <rect x="42" y="86" width="232" height="256" rx="26" fill="none" stroke="var(--amber)" stroke-width="2" stroke-dasharray="14,10" opacity="0.5"/>',
    '  <text x="158" y="116" text-anchor="middle" font-size="13" font-weight="800" letter-spacing="2" fill="var(--amber)">INSTRUCTIONS</text>',
    '  <rect x="66" y="138" width="184" height="88" rx="22" fill="var(--card-bg)" stroke="var(--amber)" stroke-width="3" filter="url(#shadow)"/>',
    '  <text x="158" y="182" text-anchor="middle" font-size="18" font-weight="800" fill="var(--amber)">AGENTS.md</text>',
    '  <text x="158" y="208" text-anchor="middle" font-size="11" fill="var(--text-light)">identity &amp; rules</text>',
    '  <path d="M250,182 L350,182" fill="none" stroke="var(--amber)" stroke-width="3" stroke-dasharray="6,6" marker-end="url(#arrAmber)"/>',
    pill(302, 182, 110, 'amber'),
    '</g>',

    // ═══ L6 · SKILL.md ═══
    '<g class="layer" id="L6">',
    '  <rect x="66" y="248" width="184" height="80" rx="22" fill="var(--rose-bg)" stroke="var(--rose)" stroke-width="3" filter="url(#shadow)"/>',
    '  <text x="158" y="290" text-anchor="middle" font-size="18" font-weight="800" fill="var(--rose)">SKILL.md</text>',
    '  <text x="158" y="314" text-anchor="middle" font-size="11" fill="var(--text-light)">loaded via tool call</text>',
    '  <path d="M250,288 C294,288 308,246 350,232" fill="none" stroke="var(--rose)" stroke-width="2.5" stroke-dasharray="6,5" marker-end="url(#arrRose)"/>',
    pill(300, 260, 120, 'rose'),
    '  <rect x="610" y="240" width="176" height="54" rx="12" fill="var(--card-bg)" stroke="var(--rose)" stroke-width="2" opacity="0.88"/>',
    '  <text x="698" y="258" text-anchor="middle" font-size="10" font-weight="700" fill="var(--rose)" letter-spacing="1">SKILL REGISTRY</text>',
    '  <text x="698" y="274" text-anchor="middle" font-size="9.8" fill="var(--text-muted)" style="font-family:\'JetBrains Mono\',monospace">/commit  /review-pr</text>',
    '  <text x="698" y="290" text-anchor="middle" font-size="9.8" fill="var(--text-muted)" style="font-family:\'JetBrains Mono\',monospace">/test    /deploy</text>',
    pill(618, 252, 170, 'rose'),
    '</g>',

    // ═══ L7 · Bash / Shell ═══
    '<g class="layer" id="L7">',
    '  <rect x="472" y="850" width="232" height="80" rx="26" fill="var(--card-bg)" stroke="var(--orange)" stroke-width="4" filter="url(#shadow)"/>',
    '  <text x="588" y="886" text-anchor="middle" font-size="20" font-weight="800" fill="var(--orange)">BASH / SHELL</text>',
    '  <text x="588" y="910" text-anchor="middle" font-size="12" fill="var(--text-muted)">files, tests, commands</text>',
    '  <path d="M588,820 L588,840" fill="none" stroke="var(--orange)" stroke-width="3" marker-end="url(#arrOrange)"/>',
    pill(600, 830, 280, 'orange'),
    '</g>',

    // ═══ L8 · Autonomous Loop ═══
    '<g class="layer" id="L8">',
    '  <rect x="300" y="360" width="922" height="520" rx="42" fill="none" stroke="var(--coral)" stroke-width="6" stroke-dasharray="18,14" opacity="0.48"/>',
    '  <text x="761" y="392" text-anchor="middle" font-size="18" font-weight="900" letter-spacing="4" fill="var(--coral)">AUTONOMOUS LOOP</text>',
    '  <path d="M1148,440 C1230,520 1230,720 1128,800 C1070,840 548,850 378,830 C302,820 294,740 294,640 C294,540 300,470 350,440" fill="none" stroke="var(--coral)" stroke-width="4" stroke-dasharray="12,10" marker-end="url(#arrCoral)"/>',
    pill(1220, 600, 400, 'coral'),
    '  <text x="1010" y="830" text-anchor="middle" font-size="11" font-weight="700" fill="var(--coral)">plan \u2192 act \u2192 observe \u2192 repeat</text>',
    '</g>',

    // ═══ L9 · Multi-Agent ═══
    '<g class="layer" id="L9">',
    '  <rect x="42" y="898" width="1176" height="50" rx="24" fill="var(--teal-bg)" stroke="var(--teal)" stroke-width="3" filter="url(#shadow)"/>',
    '  <text x="630" y="930" text-anchor="middle" font-size="20" font-weight="900" letter-spacing="3" fill="var(--teal)">MULTI-AGENT ORCHESTRATION</text>',
    pill(1184, 923, 500, 'teal'),
    '</g>',

    '</svg>'
  ].join('\n');
})();
