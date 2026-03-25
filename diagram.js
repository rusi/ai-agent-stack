// diagram.js — Premium Info-Graphic Diagram for The AI Agent Stack
(function () {
  var container = document.querySelector('.scrolly-diagram');
  if (!container) return;

  function pill(x, y, num, colorClass) {
    return [
      '<g class="flow-pill" transform="translate(' + x + ',' + y + ')">',
      '  <circle r="11" fill="var(--' + colorClass + ')" filter="url(#shadow)"/>',
      '  <text dy=".35em" text-anchor="middle" font-size="11" font-weight="800" fill="#FFFFFF">' + num + '</text>',
      '</g>'
    ].join('\n');
  }

  function bubble(x, y, text, color, align = "middle", width = 180) {
    var anchor = align === "left" ? "start" : (align === "right" ? "end" : "middle");
    var tx = align === "left" ? -width/2 + 10 : (align === "right" ? width/2 - 10 : 0);
    return [
      '<g class="msg-bubble" transform="translate(' + x + ',' + y + ')">',
      '  <rect x="-' + (width/2) + '" y="-14" width="' + width + '" height="28" rx="10" fill="var(--card-bg)" stroke="' + color + '" stroke-width="1.5" filter="url(#shadow)"/>',
      '  <text x="' + tx + '" text-anchor="' + anchor + '" font-size="10" font-weight="600" fill="var(--text-muted)">' + text + '</text>',
      '</g>'
    ].join('\n');
  }

  container.innerHTML = [
    '<svg class="diagram-svg" viewBox="0 0 800 780" id="mainDiagram" preserveAspectRatio="xMidYMid meet">',
    '<defs>',
    '  <filter id="shadow" x="-40%" y="-40%" width="180%" height="180%">',
    '    <feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#000000" flood-opacity="0.1"/>',
    '  </filter>',
    '  <linearGradient id="gModel" x1="0" y1="0" x2="0" y2="1">',
    '    <stop offset="0%" stop-color="var(--blue-bg)"/>',
    '    <stop offset="100%" stop-color="var(--blue-light)"/>',
    '  </linearGradient>',
    '  <linearGradient id="gExec" x1="0" y1="0" x2="0" y2="1">',
    '    <stop offset="0%" stop-color="var(--green-bg)"/>',
    '    <stop offset="100%" stop-color="var(--green-light)"/>',
    '  </linearGradient>',

    // Arrow Markers
    '  <marker id="arrBlue" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="var(--blue)"/></marker>',
    '  <marker id="arrAmber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="var(--amber)"/></marker>',
    '  <marker id="arrGreen" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="var(--green)"/></marker>',
    '  <marker id="arrGreenR" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M10,0 L0,5 L10,10 Z" fill="var(--green)"/></marker>',
    '  <marker id="arrPurple" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M10,0 L0,5 L10,10 Z" fill="var(--purple)"/></marker>',
    '  <marker id="arrOrange" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="var(--orange)"/></marker>',
    '  <marker id="arrMuted" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M10,0 L0,5 L10,10 Z" fill="var(--text-light)"/></marker>',
    '</defs>',

    // ── L0: The Foundation ──
    '<g class="layer show" id="L0">',
    '  <rect x="25" y="320" width="140" height="90" rx="20" fill="var(--bg-color)" stroke="var(--border-color)" stroke-width="1.5" filter="url(#shadow)"/>',
    '  <text x="95" y="360" text-anchor="middle" font-size="16" fill="var(--text-primary)" font-weight="700">The User</text>',
    '  <text x="95" y="380" text-anchor="middle" font-size="11" fill="var(--text-muted)">Query / Intent</text>',
    
    '  <rect x="320" y="280" width="170" height="170" rx="28" fill="url(#gModel)" stroke="var(--blue)" stroke-width="2.5" filter="url(#shadow)"/>',
    '  <text x="405" y="345" text-anchor="middle" font-size="24" fill="var(--blue)" font-weight="800">Model</text>',
    '  <text x="405" y="370" text-anchor="middle" font-size="14" fill="var(--text-muted)">Intelligence</text>',
    '  <line x1="350" y1="390" x2="460" y2="390" stroke="var(--blue)" stroke-width="1" opacity="0.2"/>',
    '  <text x="405" y="415" text-anchor="middle" font-size="10" fill="var(--blue)" font-weight="700" letter-spacing="1.5">PREDICTING...</text>',
    '</g>',

    // ── L1: Stateless Flow ──
    '<g class="layer" id="L1">',
    '  <path d="M165,355 L310,355" fill="none" stroke="var(--blue)" stroke-width="3" marker-end="url(#arrBlue)"/>',
    '  <path d="M310,380 L175,380" fill="none" stroke="var(--text-light)" stroke-width="3" marker-end="url(#arrMuted)"/>',
    bubble(235, 335, "How many teeth do sharks have?", "var(--blue)", "middle", 170),
    bubble(235, 400, "They have about 3,000 teeth.", "var(--text-light)", "middle", 170),
    pill(235, 355, 1, 'blue'),
    pill(235, 380, 2, 'text-light'),
    '</g>',

    // ── L2: Context Layer ──
    '<g class="layer" id="L2">',
    '  <rect x="305" y="40" width="200" height="125" rx="24" fill="var(--amber-bg)" stroke="var(--amber)" stroke-width="2" stroke-dasharray="8,4" filter="url(#shadow)"/>',
    '  <text x="405" y="75" text-anchor="middle" font-size="15" fill="var(--amber)" font-weight="800">CONTEXT</text>',
    '  <text x="405" y="105" text-anchor="middle" font-size="11" fill="var(--text-muted)">System Instructions</text>',
    '  <text x="405" y="125" text-anchor="middle" font-size="12" fill="var(--text-muted)" class="mono">{ reply: "json" }</text>',
    '  <path d="M405,165 L405,270" fill="none" stroke="var(--amber)" stroke-width="2.5" stroke-dasharray="5,5" marker-end="url(#arrAmber)"/>',
    pill(420, 215, 3, 'amber'),
    '</g>',

    // ── L3 & L4: Project Data ──
    '<g class="layer" id="L3">',
    '  <rect x="25" y="30" width="160" height="210" rx="28" fill="none" stroke="var(--amber)" stroke-width="1.5" stroke-dasharray="12,8" opacity="0.4"/>',
    '  <text x="105" y="55" text-anchor="middle" font-size="11" fill="var(--amber)" font-weight="800" letter-spacing="2">PROJECT DATA</text>',
    '  <rect x="40" y="75" width="130" height="70" rx="18" fill="var(--card-bg)" stroke="var(--amber)" stroke-width="2" filter="url(#shadow)"/>',
    '  <text x="105" y="105" text-anchor="middle" font-size="15" fill="var(--amber)" font-weight="800">AGENTS.md</text>',
    '  <text x="105" y="125" text-anchor="middle" font-size="10" fill="var(--text-light)">IDENTITY</text>',
    '  <path d="M170,110 C240,110 260,110 300,110" fill="none" stroke="var(--amber)" stroke-width="2" stroke-dasharray="4,4" marker-end="url(#arrAmber)"/>',
    pill(235, 95, 4, 'amber'),
    '</g>',

    '<g class="layer" id="L4">',
    '  <rect x="40" y="155" width="130" height="65" rx="18" fill="var(--rose-bg)" stroke="var(--rose)" stroke-width="2" filter="url(#shadow)"/>',
    '  <text x="105" y="190" text-anchor="middle" font-size="15" fill="var(--rose)" font-weight="800">SKILL.md</text>',
    '  <path d="M170,185 C240,185 260,140 300,130" fill="none" stroke="var(--rose)" stroke-width="2" stroke-dasharray="4,4" marker-end="url(#arrAmber)"/>',
    pill(235, 195, 5, 'rose'),
    '</g>',

    // ── L5: Execution Layer ──
    '<g class="layer" id="L5">',
    '  <rect x="300" y="25" width="480" height="640" rx="40" fill="none" stroke="var(--text-light)" stroke-width="1.5" stroke-dasharray="16,12" opacity="0.3"/>',
    '  <text x="540" y="50" text-anchor="middle" font-size="12" fill="var(--text-light)" font-weight="800" letter-spacing="3">AGENT RUNTIME</text>',
    
    '  <rect x="335" y="510" width="140" height="100" rx="24" fill="url(#gExec)" stroke="var(--green)" stroke-width="2.5" filter="url(#shadow)"/>',
    '  <text x="405" y="560" text-anchor="middle" font-size="16" fill="var(--green)" font-weight="800">EXECUTOR</text>',
    '  <text x="405" y="580" text-anchor="middle" font-size="11" fill="var(--text-muted)">Action Logic</text>',
    
    '  <path d="M405,455 L405,500" fill="none" stroke="var(--blue)" stroke-width="3" marker-end="url(#arrBlue)"/>',
    bubble(515, 475, "Tool: get_weather('Boston')", "var(--blue)", "left", 160),
    pill(420, 475, 6, 'blue'),
    
    '  <path d="M435,510 L435,465" fill="none" stroke="var(--green)" stroke-width="3" stroke-dasharray="4,4" marker-end="url(#arrGreen)"/>',
    bubble(515, 515, "Result: 42°F, Rain", "var(--green)", "left", 160),
    pill(420, 515, 7, 'green'),

    '  <rect x="180" y="365" width="130" height="30" fill="var(--card-bg)"/>',
    '  <path d="M315,380 L175,380" fill="none" stroke="var(--green)" stroke-width="3.5" marker-end="url(#arrGreenR)"/>',
    bubble(235, 405, "It's 42°F and raining in Boston.", "var(--green)", "middle", 180),
    pill(235, 380, 8, 'green'),
    '</g>',

    // ── L6: MCP Server (Left Side) ──
    '<g class="layer" id="L6">',
    '  <rect x="25" y="510" width="160" height="100" rx="24" fill="var(--purple-bg)" stroke="var(--purple)" stroke-width="2.5" filter="url(#shadow)"/>',
    '  <text x="105" y="560" text-anchor="middle" font-size="16" fill="var(--purple)" font-weight="800">MCP SERVER</text>',
    '  <text x="105" y="580" text-anchor="middle" font-size="10" fill="var(--text-muted)">EXT. SERVICES</text>',
    '  <path d="M330,560 L195,560" fill="none" stroke="var(--purple)" stroke-width="3" marker-end="url(#arrPurple)"/>',
    pill(260, 545, 9, 'purple'),
    '</g>',

    // ── L7: Bash Tools ──
    '<g class="layer" id="L7">',
    '  <rect x="520" y="510" width="160" height="100" rx="24" fill="var(--card-bg)" stroke="var(--orange)" stroke-width="2.5" filter="url(#shadow)"/>',
    '  <text x="600" y="560" text-anchor="middle" font-size="16" fill="var(--orange)" font-weight="800">BASH / SHELL</text>',
    '  <path d="M480,560 L515,560" fill="none" stroke="var(--orange)" stroke-width="3" marker-end="url(#arrOrange)"/>',
    pill(500, 545, 10, 'orange'),
    '</g>',

    // ── L8: Autonomy ──
    '<g class="layer" id="L8">',
    '  <rect x="295" y="250" width="490" height="400" rx="48" fill="none" stroke="var(--coral)" stroke-width="4" stroke-dasharray="14,10" opacity="0.5"/>',
    '  <text x="540" y="240" text-anchor="middle" font-size="18" fill="var(--coral)" font-weight="900" letter-spacing="3">THE LOOP</text>',
    pill(785, 260, 11, 'coral'),
    '</g>',

    // ── L9: Multi-Agent ──
    '<g class="layer" id="L9">',
    '  <rect x="20" y="700" width="760" height="65" rx="24" fill="var(--teal-bg)" stroke="var(--teal)" stroke-width="3" filter="url(#shadow)"/>',
    '  <text x="400" y="738" text-anchor="middle" font-size="20" fill="var(--teal)" font-weight="900" letter-spacing="2">MULTI-AGENT SWARMS</text>',
    pill(765, 715, 12, 'teal'),
    '</g>',

    '</svg>'
  ].join('\n');
})();
