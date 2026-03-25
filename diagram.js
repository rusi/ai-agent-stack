// diagram.js — 3-Column Agent Architecture Diagram
// Layout: User (left) | Agent Runtime (middle) | Model/LLM (right)
(function () {
  var container = document.querySelector('.scrolly-diagram');
  if (!container) return;

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

  container.innerHTML = [
    '<svg class="diagram-svg" viewBox="0 0 1260 960" id="mainDiagram" preserveAspectRatio="xMidYMid meet">',
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

    '<g class="layer show" id="L0">',
    panel(56, 398, 212, 132, 28, 'var(--card-bg)', 'var(--border-color)', 'The User', 'Query / Intent', 'var(--text-primary)', 18, 12),
    '  <rect x="964" y="332" width="246" height="252" rx="42" fill="url(#gModel)" stroke="var(--blue)" stroke-width="4" filter="url(#shadow)"/>',
    '  <text x="1087" y="432" text-anchor="middle" font-size="34" font-weight="800" fill="var(--blue)">Model</text>',
    '  <text x="1087" y="472" text-anchor="middle" font-size="15" fill="var(--text-muted)">LLM / inference engine</text>',
    '  <line x1="1014" y1="510" x2="1160" y2="510" stroke="var(--blue)" stroke-width="1.4" opacity="0.22"/>',
    '  <text x="1087" y="546" text-anchor="middle" font-size="11" letter-spacing="2" font-weight="800" fill="var(--blue)">EXTERNAL API</text>',
    '</g>',

    '<g class="layer" id="L1q">',
    bubble(610, 414, 'What is the tallest mountain?', 'var(--blue)', 276),
    '  <path d="M270,464 L954,464" fill="none" stroke="var(--blue)" stroke-width="3" marker-end="url(#arrBlue)"/>',
    pill(612, 464, 200, 'blue'),
    '</g>',

    '<g class="layer" id="L1r">',
    bubble(610, 534, 'Mount Everest \u2014 8,849 m above sea level.', 'var(--text-light)', 344),
    '  <path d="M954,504 L270,504" fill="none" stroke="var(--text-light)" stroke-width="3" marker-end="url(#arrBrown)"/>',
    pill(612, 504, 300, 'text-light'),
    '</g>',

    '<g class="layer" id="L2">',
    '  <rect x="930" y="86" width="280" height="192" rx="28" fill="var(--amber-bg)" stroke="var(--amber)" stroke-width="3" stroke-dasharray="10,8" filter="url(#shadow)"/>',
    '  <text x="1070" y="126" text-anchor="middle" font-size="18" font-weight="800" letter-spacing="2" fill="var(--amber)">CONTEXT WINDOW</text>',
    '  <text x="1070" y="156" text-anchor="middle" font-size="13" fill="var(--text-muted)">system prompt, history, state</text>',
    '  <text x="1070" y="190" text-anchor="middle" font-size="12" fill="var(--text-muted)" style="font-family:\'JetBrains Mono\',monospace">{ mode: "tool-call" }</text>',
    '  <text x="1070" y="216" text-anchor="middle" font-size="12" fill="var(--text-muted)" style="font-family:\'JetBrains Mono\',monospace">{ format: "json" }</text>',
    '  <text x="1070" y="248" text-anchor="middle" font-size="11" font-weight="700" fill="var(--amber)">+ conversation history</text>',
    '  <path d="M1070,278 L1070,318" fill="none" stroke="var(--amber)" stroke-width="3" stroke-dasharray="7,6" marker-end="url(#arrAmber)"/>',
    pill(1096, 298, 100, 'amber'),
    '</g>',

    '<g class="layer" id="L3">',
    '  <rect x="316" y="68" width="542" height="800" rx="36" fill="none" stroke="var(--text-light)" stroke-width="2.5" stroke-dasharray="18,14" opacity="0.4"/>',
    '  <text x="587" y="92" text-anchor="middle" font-size="17" font-weight="800" letter-spacing="4" fill="var(--text-light)">AGENT RUNTIME</text>',
    '  <text x="587" y="114" text-anchor="middle" font-size="11" fill="var(--text-muted)">local wrapper / orchestrator</text>',

    '  <rect x="360" y="148" width="454" height="142" rx="24" fill="var(--amber-bg)" stroke="var(--amber)" stroke-width="2" stroke-dasharray="10,8" opacity="0.72"/>',
    '  <text x="587" y="178" text-anchor="middle" font-size="14" font-weight="700" letter-spacing="2" fill="var(--amber)">CONTEXT ASSEMBLY</text>',
    '  <text x="587" y="202" text-anchor="middle" font-size="12" fill="var(--text-muted)">assembles prompt before sending to model</text>',
    '  <path d="M814,220 L922,220" fill="none" stroke="var(--amber)" stroke-width="3" stroke-dasharray="7,6" marker-end="url(#arrAmber)"/>',
    pill(870, 220, 130, 'amber'),

    '  <rect x="418" y="470" width="340" height="188" rx="32" fill="url(#gExec)" stroke="var(--green)" stroke-width="4" filter="url(#shadow)"/>',
    '  <text x="588" y="538" text-anchor="middle" font-size="28" font-weight="800" fill="var(--green)">EXECUTOR</text>',
    '  <text x="588" y="568" text-anchor="middle" font-size="14" fill="var(--text-muted)">runs tools, returns results to context</text>',

    bubble(492, 364, 'What is the weather in Boston?', 'var(--blue)', 254),
    '  <path d="M270,464 L418,464" fill="none" stroke="var(--blue)" stroke-width="3" marker-end="url(#arrBlue)"/>',
    pill(344, 464, 180, 'blue'),

    '  <path d="M758,464 L954,464" fill="none" stroke="var(--blue)" stroke-width="3" marker-end="url(#arrBlue)"/>',
    pill(856, 438, 190, 'blue'),

    codeBubble(998, 684, 'weather("Boston")', 'var(--blue)', 204),
    '  <text x="998" y="658" text-anchor="middle" font-size="10" font-weight="700" fill="var(--blue)" letter-spacing="1">TOOL_CALL</text>',
    '  <path d="M1120,584 L1120,642 L1100,642" fill="none" stroke="var(--blue)" stroke-width="3" marker-end="url(#arrBlue)"/>',
    pill(1120, 614, 210, 'blue'),

    codeBubble(588, 614, '{ temp: 42, unit: "F", condition: "rain" }', 'var(--green)', 376),
    '  <text x="588" y="590" text-anchor="middle" font-size="10" font-weight="700" fill="var(--green)" letter-spacing="1">TOOL_RESULT</text>',
    pill(588, 640, 220, 'green'),

    '  <path d="M776,614 L872,614 L872,432 L954,432" fill="none" stroke="var(--green)" stroke-width="3" stroke-dasharray="8,6" marker-end="url(#arrGreen)"/>',
    pill(872, 522, 230, 'green'),

    bubble(284, 536, '42 \u00B0F and raining in Boston.', 'var(--green)', 236),
    '  <path d="M418,520 L270,520" fill="none" stroke="var(--green)" stroke-width="3" marker-end="url(#arrGreen)"/>',
    pill(344, 520, 240, 'green'),
    '</g>',

    '<g class="layer" id="L4">',
    '  <rect x="60" y="694" width="230" height="118" rx="26" fill="var(--purple-bg)" stroke="var(--purple)" stroke-width="4" filter="url(#shadow)"/>',
    '  <text x="175" y="748" text-anchor="middle" font-size="20" font-weight="800" fill="var(--purple)">MCP Servers</text>',
    '  <text x="175" y="780" text-anchor="middle" font-size="12" fill="var(--text-muted)">GitHub, Jira, databases</text>',
    '  <path d="M418,602 L322,602 L322,753 L300,753" fill="none" stroke="var(--purple)" stroke-width="3" marker-end="url(#arrPurple)"/>',
    pill(322, 676, 150, 'purple'),
    '  <rect x="388" y="212" width="176" height="54" rx="12" fill="var(--card-bg)" stroke="var(--purple)" stroke-width="2" opacity="0.88"/>',
    '  <text x="476" y="230" text-anchor="middle" font-size="10" font-weight="700" fill="var(--purple)" letter-spacing="1">MCP TOOL SCHEMAS</text>',
    '  <text x="476" y="246" text-anchor="middle" font-size="9.6" fill="var(--text-muted)" style="font-family:\'JetBrains Mono\',monospace">weather(city) \u2192 {temp, humidity}</text>',
    '  <text x="476" y="260" text-anchor="middle" font-size="9.6" fill="var(--text-muted)" style="font-family:\'JetBrains Mono\',monospace">readEmail() \u2192 {subject, body}</text>',
    pill(396, 212, 160, 'purple'),
    '</g>',

    '<g class="layer" id="L5">',
    '  <rect x="42" y="86" width="232" height="256" rx="26" fill="none" stroke="var(--amber)" stroke-width="2" stroke-dasharray="14,10" opacity="0.5"/>',
    '  <text x="158" y="116" text-anchor="middle" font-size="13" font-weight="800" letter-spacing="2" fill="var(--amber)">INSTRUCTIONS</text>',
    '  <rect x="66" y="138" width="184" height="88" rx="22" fill="var(--card-bg)" stroke="var(--amber)" stroke-width="3" filter="url(#shadow)"/>',
    '  <text x="158" y="182" text-anchor="middle" font-size="18" font-weight="800" fill="var(--amber)">AGENTS.md</text>',
    '  <text x="158" y="208" text-anchor="middle" font-size="11" fill="var(--text-light)">identity &amp; rules</text>',
    '  <path d="M250,182 L350,182" fill="none" stroke="var(--amber)" stroke-width="3" stroke-dasharray="6,6" marker-end="url(#arrAmber)"/>',
    pill(302, 182, 110, 'amber'),
    '</g>',

    '<g class="layer" id="L6">',
    '  <rect x="66" y="248" width="184" height="80" rx="22" fill="var(--rose-bg)" stroke="var(--rose)" stroke-width="3" filter="url(#shadow)"/>',
    '  <text x="158" y="290" text-anchor="middle" font-size="18" font-weight="800" fill="var(--rose)">SKILL.md</text>',
    '  <text x="158" y="314" text-anchor="middle" font-size="11" fill="var(--text-light)">loaded via tool call</text>',
    '  <path d="M250,288 C294,288 308,246 350,232" fill="none" stroke="var(--rose)" stroke-width="2.5" stroke-dasharray="6,5" marker-end="url(#arrRose)"/>',
    pill(300, 260, 120, 'rose'),
    '  <rect x="610" y="212" width="176" height="54" rx="12" fill="var(--card-bg)" stroke="var(--rose)" stroke-width="2" opacity="0.88"/>',
    '  <text x="698" y="230" text-anchor="middle" font-size="10" font-weight="700" fill="var(--rose)" letter-spacing="1">SKILL REGISTRY</text>',
    '  <text x="698" y="246" text-anchor="middle" font-size="9.8" fill="var(--text-muted)" style="font-family:\'JetBrains Mono\',monospace">/commit  /review-pr</text>',
    '  <text x="698" y="260" text-anchor="middle" font-size="9.8" fill="var(--text-muted)" style="font-family:\'JetBrains Mono\',monospace">/test    /deploy</text>',
    pill(618, 212, 170, 'rose'),
    '</g>',

    '<g class="layer" id="L7">',
    '  <rect x="472" y="724" width="232" height="108" rx="26" fill="var(--card-bg)" stroke="var(--orange)" stroke-width="4" filter="url(#shadow)"/>',
    '  <text x="588" y="776" text-anchor="middle" font-size="20" font-weight="800" fill="var(--orange)">BASH / SHELL</text>',
    '  <text x="588" y="804" text-anchor="middle" font-size="12" fill="var(--text-muted)">files, tests, commands</text>',
    '  <path d="M588,658 L588,712" fill="none" stroke="var(--orange)" stroke-width="3" marker-end="url(#arrOrange)"/>',
    pill(612, 690, 260, 'orange'),
    '</g>',

    '<g class="layer" id="L8">',
    '  <rect x="300" y="304" width="922" height="536" rx="42" fill="none" stroke="var(--coral)" stroke-width="6" stroke-dasharray="18,14" opacity="0.48"/>',
    '  <text x="761" y="340" text-anchor="middle" font-size="18" font-weight="900" letter-spacing="4" fill="var(--coral)">AUTONOMOUS LOOP</text>',
    '  <path d="M1148,392 C1220,470 1222,690 1128,760 C1070,804 548,810 378,786 C302,774 294,690 294,596 C294,492 300,420 350,390" fill="none" stroke="var(--coral)" stroke-width="4" stroke-dasharray="12,10" marker-end="url(#arrCoral)"/>',
    pill(1204, 562, 400, 'coral'),
    '  <text x="1010" y="782" text-anchor="middle" font-size="11" font-weight="700" fill="var(--coral)">plan \u2192 act \u2192 observe \u2192 repeat</text>',
    '</g>',

    '<g class="layer" id="L9">',
    '  <rect x="42" y="898" width="1176" height="50" rx="24" fill="var(--teal-bg)" stroke="var(--teal)" stroke-width="3" filter="url(#shadow)"/>',
    '  <text x="630" y="930" text-anchor="middle" font-size="20" font-weight="900" letter-spacing="3" fill="var(--teal)">MULTI-AGENT ORCHESTRATION</text>',
    pill(1184, 923, 500, 'teal'),
    '</g>',

    '</svg>'
  ].join('\n');
})();
