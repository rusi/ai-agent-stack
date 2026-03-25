// diagram.js — Premium Info-Graphic Diagram for The AI Agent Stack
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

  function panel(x, y, w, h, r, fill, stroke, title, subtitle, titleColor, titleSize, subtitleSize) {
    return [
      '<g>',
      '  <rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + r + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="3" filter="url(#shadow)"/>',
      '  <text x="' + (x + w / 2) + '" y="' + (y + h / 2 - 6) + '" text-anchor="middle" font-size="' + (titleSize || 17) + '" font-weight="800" fill="' + titleColor + '">' + title + '</text>',
      '  <text x="' + (x + w / 2) + '" y="' + (y + h / 2 + 24) + '" text-anchor="middle" font-size="' + (subtitleSize || 11) + '" fill="var(--text-muted)">' + subtitle + '</text>',
      '</g>'
    ].join('\n');
  }

  container.innerHTML = [
    '<svg class="diagram-svg" viewBox="0 0 1220 980" id="mainDiagram" preserveAspectRatio="xMidYMid meet">',
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
    '  <marker id="arrGreenBack" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="var(--green)"/></marker>',
    '  <marker id="arrBrown" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="var(--text-light)"/></marker>',
    '  <marker id="arrPurple" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="var(--purple)"/></marker>',
    '  <marker id="arrOrange" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="var(--orange)"/></marker>',
    '  <marker id="arrCoral" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="var(--coral)"/></marker>',
    '</defs>',

    // ── L0: User + Model (always visible) ──
    '<g class="layer show" id="L0">',
    panel(70, 430, 220, 130, 28, 'var(--card-bg)', 'var(--border-color)', 'The User', 'Query / Intent', 'var(--text-primary)', 17, 12),
    '  <rect x="520" y="350" width="300" height="220" rx="42" fill="url(#gModel)" stroke="var(--blue)" stroke-width="4" filter="url(#shadow)"/>',
    '  <text x="670" y="438" text-anchor="middle" font-size="34" font-weight="800" fill="var(--blue)">Model</text>',
    '  <text x="670" y="482" text-anchor="middle" font-size="16" fill="var(--text-muted)">LLM / inference engine</text>',
    '  <line x1="585" y1="518" x2="755" y2="518" stroke="var(--blue)" stroke-width="1.4" opacity="0.22"/>',
    '  <text x="670" y="558" text-anchor="middle" font-size="12" letter-spacing="2" font-weight="800" fill="var(--blue)">PREDICTING TOKENS</text>',
    '</g>',

    // ── L1: Simple Q&A (Steps 1–2, then hidden) ──
    '<g class="layer" id="L1">',
    bubble(410, 440, 'Why is the sky blue?', 'var(--blue)', 220),
    '  <path d="M292,486 L508,486" fill="none" stroke="var(--blue)" stroke-width="4" marker-end="url(#arrBlue)"/>',
    pill(400, 486, 200, 'blue'),
    bubble(410, 562, 'Blue light scatters most in the atmosphere.', 'var(--text-light)', 340),
    '  <path d="M508,538 L294,538" fill="none" stroke="var(--text-light)" stroke-width="4" marker-end="url(#arrBrown)"/>',
    pill(400, 538, 300, 'text-light'),
    '</g>',

    // ── L2: Context Window (Step 2+) ──
    '<g class="layer" id="L2">',
    '  <rect x="500" y="92" width="360" height="160" rx="32" fill="var(--amber-bg)" stroke="var(--amber)" stroke-width="3" stroke-dasharray="10,8" filter="url(#shadow)"/>',
    '  <text x="680" y="136" text-anchor="middle" font-size="22" font-weight="800" letter-spacing="2" fill="var(--amber)">CONTEXT WINDOW</text>',
    '  <text x="680" y="176" text-anchor="middle" font-size="14" fill="var(--text-muted)">system prompt, history, state</text>',
    '  <text x="680" y="214" text-anchor="middle" font-size="15" fill="var(--text-muted)" style="font-family: \'JetBrains Mono\', monospace;">{ mode: "tool-call", format: "json" }</text>',
    '  <path d="M680,252 L680,332" fill="none" stroke="var(--amber)" stroke-width="3" stroke-dasharray="7,6" marker-end="url(#arrAmber)"/>',
    pill(706, 296, 100, 'amber'),
    '</g>',

    // ── L3: Agent Runtime + Executor + Tool Use (Step 3+, replaces L1) ──
    '<g class="layer" id="L3">',
    // Agent Runtime boundary
    '  <rect x="430" y="42" width="740" height="850" rx="42" fill="none" stroke="var(--text-light)" stroke-width="2" stroke-dasharray="18,14" opacity="0.34"/>',
    '  <text x="800" y="78" text-anchor="middle" font-size="18" font-weight="800" letter-spacing="4" fill="var(--text-light)">AGENT RUNTIME</text>',
    // Executor box
    '  <rect x="592" y="666" width="176" height="118" rx="30" fill="url(#gExec)" stroke="var(--green)" stroke-width="4" filter="url(#shadow)"/>',
    '  <text x="680" y="725" text-anchor="middle" font-size="24" font-weight="800" fill="var(--green)">EXECUTOR</text>',
    '  <text x="680" y="758" text-anchor="middle" font-size="13" fill="var(--text-muted)">runs tools, returns results</text>',
    // User question → Model
    bubble(410, 440, 'What is the weather in Boston right now?', 'var(--blue)', 336),
    '  <path d="M292,486 L508,486" fill="none" stroke="var(--blue)" stroke-width="4" marker-end="url(#arrBlue)"/>',
    pill(400, 486, 200, 'blue'),
    // Model → Executor (tool_call)
    '  <path d="M670,572 L670,648" fill="none" stroke="var(--blue)" stroke-width="4" marker-end="url(#arrBlue)"/>',
    pill(696, 614, 250, 'blue'),
    bubble(900, 612, 'tool_call: weather("Boston")', 'var(--blue)', 300),
    // Executor → Model (tool_result)
    '  <path d="M706,666 L706,590" fill="none" stroke="var(--green)" stroke-width="4" stroke-dasharray="8,7" marker-end="url(#arrGreen)"/>',
    pill(730, 700, 280, 'green'),
    bubble(930, 700, 'tool_result: 42 \u00B0F, rain', 'var(--green)', 250),
    // Final answer → User
    bubble(410, 570, 'It is 42 \u00B0F and raining in Boston.', 'var(--green)', 310),
    '  <path d="M508,546 L294,546" fill="none" stroke="var(--green)" stroke-width="4" marker-end="url(#arrGreenBack)"/>',
    pill(400, 546, 300, 'green'),
    '</g>',

    // ── L4: MCP / APIs (Step 4+) ──
    '<g class="layer" id="L4">',
    '  <rect x="104" y="690" width="250" height="146" rx="30" fill="var(--purple-bg)" stroke="var(--purple)" stroke-width="4" filter="url(#shadow)"/>',
    '  <text x="229" y="756" text-anchor="middle" font-size="24" font-weight="800" fill="var(--purple)">MCP / APIs</text>',
    '  <text x="229" y="794" text-anchor="middle" font-size="14" fill="var(--text-muted)">GitHub, Jira, databases</text>',
    '  <path d="M590,748 L368,748" fill="none" stroke="var(--purple)" stroke-width="4" marker-end="url(#arrPurple)"/>',
    pill(454, 718, 260, 'purple'),
    '</g>',

    // ── L5: Instructions / AGENTS.md (Step 5+) ──
    '<g class="layer" id="L5">',
    '  <rect x="52" y="86" width="320" height="304" rx="30" fill="none" stroke="var(--amber)" stroke-width="2" stroke-dasharray="16,12" opacity="0.45"/>',
    '  <text x="212" y="128" text-anchor="middle" font-size="16" font-weight="800" letter-spacing="3" fill="var(--amber)">INSTRUCTIONS</text>',
    '  <rect x="88" y="160" width="248" height="104" rx="26" fill="var(--card-bg)" stroke="var(--amber)" stroke-width="4" filter="url(#shadow)"/>',
    '  <text x="212" y="221" text-anchor="middle" font-size="22" font-weight="800" fill="var(--amber)">AGENTS.md</text>',
    '  <text x="212" y="254" text-anchor="middle" font-size="13" fill="var(--text-light)">identity &amp; rules</text>',
    '  <path d="M336,212 C412,212 448,212 492,212" fill="none" stroke="var(--amber)" stroke-width="3" stroke-dasharray="6,6" marker-end="url(#arrAmber)"/>',
    pill(420, 184, 80, 'amber'),
    '</g>',

    // ── L6: SKILL.md (Step 6+) ──
    '<g class="layer" id="L6">',
    '  <rect x="88" y="300" width="248" height="92" rx="26" fill="var(--rose-bg)" stroke="var(--rose)" stroke-width="4" filter="url(#shadow)"/>',
    '  <text x="212" y="354" text-anchor="middle" font-size="22" font-weight="800" fill="var(--rose)">SKILL.md</text>',
    '  <text x="212" y="382" text-anchor="middle" font-size="13" fill="var(--text-light)">loaded via tool call</text>',
    '  <path d="M336,346 C420,346 448,286 496,250" fill="none" stroke="var(--rose)" stroke-width="3" stroke-dasharray="6,6" marker-end="url(#arrAmber)"/>',
    pill(420, 320, 90, 'rose'),
    '</g>',

    // ── L7: Permissions + Bash / Shell (Step 7+) ──
    '<g class="layer" id="L7">',
    '  <rect x="880" y="612" width="236" height="76" rx="22" fill="var(--orange-bg)" stroke="var(--orange)" stroke-width="4" filter="url(#shadow)"/>',
    '  <text x="998" y="644" text-anchor="middle" font-size="18" font-weight="800" fill="var(--orange)">PERMISSIONS</text>',
    '  <text x="998" y="671" text-anchor="middle" font-size="13" fill="var(--text-muted)">sandbox / approval gates</text>',
    '  <rect x="900" y="710" width="228" height="146" rx="30" fill="var(--card-bg)" stroke="var(--orange)" stroke-width="4" filter="url(#shadow)"/>',
    '  <text x="1014" y="780" text-anchor="middle" font-size="24" font-weight="800" fill="var(--orange)">BASH / SHELL</text>',
    '  <text x="1014" y="820" text-anchor="middle" font-size="14" fill="var(--text-muted)">files, tests, commands</text>',
    '  <path d="M768,748 L888,748" fill="none" stroke="var(--orange)" stroke-width="4" marker-end="url(#arrOrange)"/>',
    pill(844, 718, 270, 'orange'),
    '</g>',

    // ── L8: Autonomous Loop boundary + arrow (Step 8+) ──
    '<g class="layer" id="L8">',
    '  <rect x="458" y="304" width="654" height="520" rx="42" fill="none" stroke="var(--coral)" stroke-width="7" stroke-dasharray="20,16" opacity="0.52"/>',
    '  <text x="785" y="286" text-anchor="middle" font-size="20" font-weight="900" letter-spacing="3" fill="var(--coral)">AUTONOMOUS LOOP</text>',
    '  <path d="M1100,474 C1146,518 1160,612 1110,700" fill="none" stroke="var(--coral)" stroke-width="5" stroke-dasharray="10,10" marker-end="url(#arrCoral)"/>',
    pill(1104, 454, 400, 'coral'),
    '</g>',

    // ── L9: Multi-Agent Orchestration (Step 9) ──
    '<g class="layer" id="L9">',
    '  <rect x="60" y="900" width="1100" height="58" rx="28" fill="var(--teal-bg)" stroke="var(--teal)" stroke-width="4" filter="url(#shadow)"/>',
    '  <text x="610" y="937" text-anchor="middle" font-size="24" font-weight="900" letter-spacing="3" fill="var(--teal)">MULTI-AGENT ORCHESTRATION</text>',
    pill(1126, 929, 500, 'teal'),
    '</g>',
    '</svg>'
  ].join('\n');
})();
