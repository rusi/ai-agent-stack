// diagram.js — 3-Column Agent Architecture Diagram
// Layout: User (left) | Agent Runtime (middle) | Model/LLM (right)
(function () {
  var container = document.querySelector('.scrolly-diagram');
  if (!container) return;

  // Pills use data-order for dynamic renumbering by scrolly.js
  function pill(x, y, order, colorClass) {
    return [
      '<g class="dyn-pill" data-order="' + order + '" transform="translate(' + x + ',' + y + ')">',
      '  <circle r="13" fill="var(--' + colorClass + ')" filter="url(#shadow)"/>',
      '  <text y="4" text-anchor="middle" font-size="13" font-weight="800" fill="#FFFFFF"></text>',
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

  // Mono-spaced code bubble (for tool calls / results)
  function codeBubble(x, y, text, stroke, width) {
    return [
      '<g transform="translate(' + x + ',' + y + ')">',
      '  <rect x="-' + (width / 2) + '" y="-19" width="' + width + '" height="38" rx="10" fill="var(--card-bg)" stroke="' + stroke + '" stroke-width="2" filter="url(#shadow)"/>',
      '  <text y="5" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text-primary)" style="font-family:\'JetBrains Mono\',monospace">' + text + '</text>',
      '</g>'
    ].join('\n');
  }

  function panel(x, y, w, h, r, fill, stroke, title, subtitle, titleColor, titleSize, subtitleSize) {
    return [
      '<g>',
      '  <rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + r + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="3" filter="url(#shadow)"/>',
      '  <text x="' + (x + w / 2) + '" y="' + (y + h / 2 - 6) + '" text-anchor="middle" font-size="' + (titleSize || 17) + '" font-weight="800" fill="' + titleColor + '">' + title + '</text>',
      '  <text x="' + (x + w / 2) + '" y="' + (y + h / 2 + 24) + '" text-anchor="middle" font-size="' + (subtitleSize || 11) + '" fill="var(--text-muted)">' + subtitle + '</text>',
      '</g>'
    ].join('\n');
  }

  // ─── COORDINATES ───
  // Col 1: User side       x: 40–250
  // Col 2: Agent Runtime   x: 300–830
  // Col 3: Model/LLM       x: 880–1180

  container.innerHTML = [
    '<svg class="diagram-svg" viewBox="0 0 1220 960" id="mainDiagram" preserveAspectRatio="xMidYMid meet">',
    '<defs>',
    '  <filter id="shadow" x="-40%" y="-40%" width="180%" height="180%">',
    '    <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000000" flood-opacity="0.14"/>',
    '  </filter>',
    '  <linearGradient id="gModel" x1="0" y1="0" x2="0" y2="1">',
    '    <stop offset="0%" stop-color="var(--blue-bg)"/>',
    '    <stop offset="100%" stop-color="var(--blue-light)"/>',
    '  </linearGradient>',
    '  <linearGradient id="gExec" x1="0" y1="0" x2="0" y2="1">',
    '    <stop offset="0%" stop-color="var(--green-bg)"/>',
    '    <stop offset="100%" stop-color="var(--green-light)"/>',
    '  </linearGradient>',
    '  <marker id="arrBlue" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="var(--blue)"/></marker>',
    '  <marker id="arrAmber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="var(--amber)"/></marker>',
    '  <marker id="arrGreen" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="var(--green)"/></marker>',
    '  <marker id="arrBrown" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="var(--text-light)"/></marker>',
    '  <marker id="arrPurple" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="var(--purple)"/></marker>',
    '  <marker id="arrOrange" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="var(--orange)"/></marker>',
    '  <marker id="arrCoral" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="var(--coral)"/></marker>',
    '  <marker id="arrRose" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="var(--rose)"/></marker>',
    '</defs>',

    // ══════════════════════════════════════════════
    // L0 — User + Model (always visible, 3-column base)
    // ══════════════════════════════════════════════
    '<g class="layer show" id="L0">',
    // User box — left column
    panel(50, 380, 200, 130, 28, 'var(--card-bg)', 'var(--border-color)', 'The User', 'Query / Intent', 'var(--text-primary)', 18, 12),
    // Model box — right column (external API)
    '  <rect x="895" y="320" width="280" height="260" rx="42" fill="url(#gModel)" stroke="var(--blue)" stroke-width="4" filter="url(#shadow)"/>',
    '  <text x="1035" y="420" text-anchor="middle" font-size="34" font-weight="800" fill="var(--blue)">Model</text>',
    '  <text x="1035" y="460" text-anchor="middle" font-size="15" fill="var(--text-muted)">LLM / inference engine</text>',
    '  <line x1="940" y1="498" x2="1130" y2="498" stroke="var(--blue)" stroke-width="1.4" opacity="0.22"/>',
    '  <text x="1035" y="534" text-anchor="middle" font-size="11" letter-spacing="2" font-weight="800" fill="var(--blue)">EXTERNAL API</text>',
    '</g>',

    // ══════════════════════════════════════════════
    // L1 — Simple Q&A (Steps 1–2, hidden at Step 3)
    // ══════════════════════════════════════════════
    '<g class="layer" id="L1">',
    // Question: User → Model (across the empty middle)
    bubble(560, 410, 'What is the tallest mountain?', 'var(--blue)', 270),
    '  <path d="M252,445 L883,445" fill="none" stroke="var(--blue)" stroke-width="3" marker-end="url(#arrBlue)"/>',
    pill(570, 445, 200, 'blue'),
    // Answer: Model → User
    bubble(560, 520, 'Mount Everest \u2014 8,849 m above sea level.', 'var(--text-light)', 320),
    '  <path d="M883,490 L252,490" fill="none" stroke="var(--text-light)" stroke-width="3" marker-end="url(#arrBrown)"/>',
    pill(570, 490, 300, 'text-light'),
    '</g>',

    // ══════════════════════════════════════════════
    // L2 — Context Window on Model side (Step 2+)
    // ══════════════════════════════════════════════
    '<g class="layer" id="L2">',
    '  <rect x="885" y="86" width="300" height="200" rx="28" fill="var(--amber-bg)" stroke="var(--amber)" stroke-width="3" stroke-dasharray="10,8" filter="url(#shadow)"/>',
    '  <text x="1035" y="128" text-anchor="middle" font-size="18" font-weight="800" letter-spacing="2" fill="var(--amber)">CONTEXT WINDOW</text>',
    '  <text x="1035" y="158" text-anchor="middle" font-size="13" fill="var(--text-muted)">system prompt, history, state</text>',
    '  <text x="1035" y="192" text-anchor="middle" font-size="12" fill="var(--text-muted)" style="font-family:\'JetBrains Mono\',monospace">{ mode: "tool-call" }</text>',
    '  <text x="1035" y="218" text-anchor="middle" font-size="12" fill="var(--text-muted)" style="font-family:\'JetBrains Mono\',monospace">{ format: "json" }</text>',
    '  <text x="1035" y="256" text-anchor="middle" font-size="11" font-weight="700" fill="var(--amber)">+ conversation history</text>',
    // Arrow: Context feeds into Model
    '  <path d="M1035,286 L1035,308" fill="none" stroke="var(--amber)" stroke-width="3" stroke-dasharray="7,6" marker-end="url(#arrAmber)"/>',
    pill(1060, 296, 100, 'amber'),
    '</g>',

    // ══════════════════════════════════════════════
    // L3 — Agent Runtime + Executor + Tool Use (Step 3+)
    // ══════════════════════════════════════════════
    '<g class="layer" id="L3">',
    // Agent Runtime boundary — middle column
    '  <rect x="296" y="56" width="546" height="810" rx="36" fill="none" stroke="var(--text-light)" stroke-width="2.5" stroke-dasharray="18,14" opacity="0.4"/>',
    '  <text x="569" y="90" text-anchor="middle" font-size="17" font-weight="800" letter-spacing="4" fill="var(--text-light)">AGENT RUNTIME</text>',
    '  <text x="569" y="112" text-anchor="middle" font-size="11" fill="var(--text-muted)">local wrapper / orchestrator</text>',

    // Context Assembly area — inside runtime, upper portion
    '  <rect x="326" y="130" width="486" height="150" rx="22" fill="var(--amber-bg)" stroke="var(--amber)" stroke-width="2" stroke-dasharray="10,8" opacity="0.7"/>',
    '  <text x="569" y="160" text-anchor="middle" font-size="14" font-weight="700" letter-spacing="2" fill="var(--amber)">CONTEXT ASSEMBLY</text>',
    '  <text x="569" y="183" text-anchor="middle" font-size="12" fill="var(--text-muted)">assembles prompt before sending to model</text>',

    // Arrow: Context Assembly → Model Context Window
    '  <path d="M812,200 L875,200" fill="none" stroke="var(--amber)" stroke-width="3" stroke-dasharray="7,6" marker-end="url(#arrAmber)"/>',
    pill(846, 200, 150, 'amber'),

    // Executor — big box, inside runtime
    '  <rect x="356" y="430" width="430" height="250" rx="32" fill="url(#gExec)" stroke="var(--green)" stroke-width="4" filter="url(#shadow)"/>',
    '  <text x="571" y="490" text-anchor="middle" font-size="28" font-weight="800" fill="var(--green)">EXECUTOR</text>',
    '  <text x="571" y="520" text-anchor="middle" font-size="14" fill="var(--text-muted)">runs tools, returns results to context</text>',

    // Question bubble: User → Runtime
    bubble(150, 340, 'What is the weather in Boston?', 'var(--blue)', 220),
    '  <path d="M252,445 L344,445" fill="none" stroke="var(--blue)" stroke-width="3" marker-end="url(#arrBlue)"/>',
    pill(300, 445, 200, 'blue'),

    // Runtime → Model: sends assembled context
    '  <path d="M842,450 L883,450" fill="none" stroke="var(--blue)" stroke-width="3" marker-end="url(#arrBlue)"/>',
    pill(862, 436, 210, 'blue'),

    // Model → Runtime: returns tool_call
    '  <path d="M883,500 L800,500 L800,555 L790,555" fill="none" stroke="var(--blue)" stroke-width="3" marker-end="url(#arrBlue)"/>',
    pill(848, 500, 250, 'blue'),
    codeBubble(960, 550, 'weather("Boston")', 'var(--blue)', 200),
    '  <text x="960" y="530" text-anchor="middle" font-size="10" font-weight="700" fill="var(--blue)" letter-spacing="1">TOOL_CALL</text>',

    // Executor result bubble
    codeBubble(571, 610, '{ temp: 42, unit: "F", condition: "rain" }', 'var(--green)', 370),
    '  <text x="571" y="588" text-anchor="middle" font-size="10" font-weight="700" fill="var(--green)" letter-spacing="1">TOOL_RESULT</text>',
    pill(571, 638, 280, 'green'),

    // Result → back to Model (via context)
    '  <path d="M760,620 L842,620 L842,480 L883,480" fill="none" stroke="var(--green)" stroke-width="3" stroke-dasharray="8,6" marker-end="url(#arrGreen)"/>',
    pill(860, 560, 290, 'green'),

    // Final answer → User
    bubble(150, 520, '42 \u00B0F and raining in Boston.', 'var(--green)', 230),
    '  <path d="M344,490 L252,490" fill="none" stroke="var(--green)" stroke-width="3" marker-end="url(#arrGreen)"/>',
    pill(300, 490, 300, 'green'),
    '</g>',

    // ══════════════════════════════════════════════
    // L4 — MCP / APIs (Step 4+)
    // ══════════════════════════════════════════════
    '<g class="layer" id="L4">',
    // MCP servers — external, left/below
    '  <rect x="52" y="690" width="200" height="120" rx="26" fill="var(--purple-bg)" stroke="var(--purple)" stroke-width="4" filter="url(#shadow)"/>',
    '  <text x="152" y="745" text-anchor="middle" font-size="20" font-weight="800" fill="var(--purple)">MCP Servers</text>',
    '  <text x="152" y="778" text-anchor="middle" font-size="12" fill="var(--text-muted)">GitHub, Jira, databases</text>',

    // Arrow: Executor → MCP servers (calls them)
    '  <path d="M356,600 L300,600 L300,740 L262,740" fill="none" stroke="var(--purple)" stroke-width="3" marker-end="url(#arrPurple)"/>',
    pill(300, 670, 260, 'purple'),

    // Tool schemas inside context assembly
    '  <rect x="340" y="200" width="220" height="68" rx="12" fill="var(--card-bg)" stroke="var(--purple)" stroke-width="2" opacity="0.85"/>',
    '  <text x="450" y="220" text-anchor="middle" font-size="10" font-weight="700" fill="var(--purple)" letter-spacing="1">MCP TOOL SCHEMAS</text>',
    '  <text x="450" y="238" text-anchor="middle" font-size="10" fill="var(--text-muted)" style="font-family:\'JetBrains Mono\',monospace">weather(city) \u2192 {temp, humidity}</text>',
    '  <text x="450" y="254" text-anchor="middle" font-size="10" fill="var(--text-muted)" style="font-family:\'JetBrains Mono\',monospace">readEmail() \u2192 {subject, body}</text>',
    pill(345, 204, 262, 'purple'),
    '</g>',

    // ══════════════════════════════════════════════
    // L5 — AGENTS.md / Instructions (Step 5+)
    // ══════════════════════════════════════════════
    '<g class="layer" id="L5">',
    // Instructions zone — user side
    '  <rect x="38" y="80" width="220" height="270" rx="26" fill="none" stroke="var(--amber)" stroke-width="2" stroke-dasharray="14,10" opacity="0.5"/>',
    '  <text x="148" y="112" text-anchor="middle" font-size="13" font-weight="800" letter-spacing="2" fill="var(--amber)">INSTRUCTIONS</text>',
    // AGENTS.md box
    '  <rect x="58" y="132" width="180" height="90" rx="22" fill="var(--card-bg)" stroke="var(--amber)" stroke-width="3" filter="url(#shadow)"/>',
    '  <text x="148" y="178" text-anchor="middle" font-size="18" font-weight="800" fill="var(--amber)">AGENTS.md</text>',
    '  <text x="148" y="206" text-anchor="middle" font-size="11" fill="var(--text-light)">identity &amp; rules</text>',
    // Arrow: AGENTS.md → Runtime context assembly
    '  <path d="M238,177 L316,177" fill="none" stroke="var(--amber)" stroke-width="3" stroke-dasharray="6,6" marker-end="url(#arrAmber)"/>',
    pill(280, 177, 80, 'amber'),
    '</g>',

    // ══════════════════════════════════════════════
    // L6 — SKILL.md (Step 6+)
    // ══════════════════════════════════════════════
    '<g class="layer" id="L6">',
    '  <rect x="58" y="244" width="180" height="80" rx="22" fill="var(--rose-bg)" stroke="var(--rose)" stroke-width="3" filter="url(#shadow)"/>',
    '  <text x="148" y="286" text-anchor="middle" font-size="18" font-weight="800" fill="var(--rose)">SKILL.md</text>',
    '  <text x="148" y="310" text-anchor="middle" font-size="11" fill="var(--text-light)">loaded via tool call</text>',
    // Dotted arrow: on-demand load into context
    '  <path d="M238,284 L316,220" fill="none" stroke="var(--rose)" stroke-width="2.5" stroke-dasharray="6,5" marker-end="url(#arrRose)"/>',
    pill(280, 250, 90, 'rose'),
    // Skill registry entry in context
    '  <rect x="580" y="200" width="218" height="68" rx="12" fill="var(--card-bg)" stroke="var(--rose)" stroke-width="2" opacity="0.85"/>',
    '  <text x="689" y="220" text-anchor="middle" font-size="10" font-weight="700" fill="var(--rose)" letter-spacing="1">SKILL REGISTRY</text>',
    '  <text x="689" y="238" text-anchor="middle" font-size="10" fill="var(--text-muted)" style="font-family:\'JetBrains Mono\',monospace">/commit  /review-pr</text>',
    '  <text x="689" y="254" text-anchor="middle" font-size="10" fill="var(--text-muted)" style="font-family:\'JetBrains Mono\',monospace">/test    /deploy</text>',
    pill(585, 204, 92, 'rose'),
    '</g>',

    // ══════════════════════════════════════════════
    // L7 — Bash / Shell (Step 7+, no permissions block)
    // ══════════════════════════════════════════════
    '<g class="layer" id="L7">',
    '  <rect x="380" y="720" width="200" height="110" rx="26" fill="var(--card-bg)" stroke="var(--orange)" stroke-width="4" filter="url(#shadow)"/>',
    '  <text x="480" y="773" text-anchor="middle" font-size="20" font-weight="800" fill="var(--orange)">BASH / SHELL</text>',
    '  <text x="480" y="802" text-anchor="middle" font-size="12" fill="var(--text-muted)">files, tests, commands</text>',
    // Arrow: Executor → Bash
    '  <path d="M571,680 L571,708" fill="none" stroke="var(--orange)" stroke-width="3" marker-end="url(#arrOrange)"/>',
    pill(595, 696, 270, 'orange'),
    '</g>',

    // ══════════════════════════════════════════════
    // L8 — Autonomous Loop (Step 8+)
    // ══════════════════════════════════════════════
    '<g class="layer" id="L8">',
    // Loop boundary — wraps BOTH runtime and model
    '  <rect x="280" y="300" width="910" height="420" rx="40" fill="none" stroke="var(--coral)" stroke-width="6" stroke-dasharray="18,14" opacity="0.5"/>',
    '  <text x="735" y="336" text-anchor="middle" font-size="18" font-weight="900" letter-spacing="4" fill="var(--coral)">AUTONOMOUS LOOP</text>',
    // Loop arrow — clear circular path: right side, going around
    '  <path d="M1190,460 C1210,560 1210,660 1140,700 C1060,740 400,740 340,700 C280,660 280,560 296,460" fill="none" stroke="var(--coral)" stroke-width="4" stroke-dasharray="12,10" marker-end="url(#arrCoral)"/>',
    pill(1200, 520, 400, 'coral'),
    // Label on the loop
    '  <text x="735" y="756" text-anchor="middle" font-size="11" font-weight="700" fill="var(--coral)">plan \u2192 act \u2192 observe \u2192 repeat</text>',
    '</g>',

    // ══════════════════════════════════════════════
    // L9 — Multi-Agent Orchestration (Step 9)
    // ══════════════════════════════════════════════
    '<g class="layer" id="L9">',
    '  <rect x="40" y="900" width="1140" height="50" rx="24" fill="var(--teal-bg)" stroke="var(--teal)" stroke-width="3" filter="url(#shadow)"/>',
    '  <text x="610" y="932" text-anchor="middle" font-size="20" font-weight="900" letter-spacing="3" fill="var(--teal)">MULTI-AGENT ORCHESTRATION</text>',
    pill(1146, 925, 500, 'teal'),
    '</g>',

    '</svg>'
  ].join('\n');
})();
