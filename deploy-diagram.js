// deploy-diagram.js — Deployment Boundaries + Orchestration Diagram
(function () {
  var container = document.getElementById('deployDiagramContainer');
  if (!container) return;

  var u = window.diagramUtils;
  var pill = u.pill, bubble = u.bubble, tag = u.tag;

  // Layout:
  // ┌──────────────────────────────────────────────────────────────────┐
  // │                         YOUR MACHINE                             │
  // │  ┌─────────────┐  ┌─────────────┐  ┌──── SANDBOX ─────┐        │
  // │  │  Agent #1    │  │  Agent #2    │  │  ┌───────────┐  │        │
  // │  │  Context     │  │  Context     │  │  │ Agent #3  │  │        │
  // │  │  Engine      │  │  Engine      │  │  │ Context   │  │        │
  // │  │  Bash/Tools  │  │  Bash/Tools  │  │  │ Engine    │  │        │
  // │  └─────────────┘  └─────────────┘  │  └───────────┘  │        │
  // │                                      └─────────────────┘        │
  // │  ┌─ Local MCP ────────────┐                                     │
  // │  │ GitLab  DB  Filesystem │                                     │
  // │  └────────────────────────┘                                     │
  // └──────────────────────────────────────────────────────────────────┘
  //
  //    ┌─ Cloud MCP ──────┐         ┌─────── MODELS ───────────┐
  //    │ GitHub  Jira     │         │ Cloud │ Local │ Private   │
  //    │ Slack   Notion   │         │       │       │ Cloud     │
  //    └──────────────────┘         └───────────────────────────┘

  // Box coordinates
  // Agent boxes: 3 agents across
  var a1x = 60, a2x = 290, a3x = 520;
  var ay = 140, aw = 200, ah = 280;

  // Model boxes: right column
  var mx = 860, mw = 160, mh = 120;
  var m1y = 100, m2y = 260, m3y = 420;

  // MCP local: bottom left inside machine
  var mlx = 60, mly = 480;
  // MCP cloud: bottom right outside machine
  var mcx = 60, mcy = 700;

  function agentBox(x, y, num, contextLabel) {
    return [
      // Agent container
      '  <rect x="' + x + '" y="' + y + '" width="' + aw + '" height="' + ah + '" rx="22" fill="var(--card-bg)" stroke="var(--green)" stroke-width="3" filter="url(#d_shadow)"/>',
      // Header
      '  <text x="' + (x + aw/2) + '" y="' + (y + 32) + '" text-anchor="middle" font-size="16" font-weight="800" fill="var(--green)">Agent ' + num + '</text>',
      // Context section
      '  <rect x="' + (x + 14) + '" y="' + (y + 48) + '" width="' + (aw - 28) + '" height="50" rx="10" fill="var(--amber-bg)" stroke="var(--amber)" stroke-width="1.5" opacity="0.7"/>',
      '  <text x="' + (x + aw/2) + '" y="' + (y + 68) + '" text-anchor="middle" font-size="10" font-weight="700" letter-spacing="1" fill="var(--amber)">CONTEXT</text>',
      '  <text x="' + (x + aw/2) + '" y="' + (y + 86) + '" text-anchor="middle" font-size="10" fill="var(--text-muted)">' + contextLabel + '</text>',
      // Engine section
      '  <rect x="' + (x + 14) + '" y="' + (y + 110) + '" width="' + (aw - 28) + '" height="52" rx="10" fill="var(--green-bg)" stroke="var(--green)" stroke-width="1.5"/>',
      '  <text x="' + (x + aw/2) + '" y="' + (y + 134) + '" text-anchor="middle" font-size="12" font-weight="700" fill="var(--green)">Execution Engine</text>',
      '  <text x="' + (x + aw/2) + '" y="' + (y + 150) + '" text-anchor="middle" font-size="10" fill="var(--text-muted)">runs tools, returns results</text>',
      // Tools/Bash section
      '  <rect x="' + (x + 14) + '" y="' + (y + 174) + '" width="' + (aw - 28) + '" height="44" rx="10" fill="var(--card-bg)" stroke="var(--orange)" stroke-width="1.5"/>',
      '  <text x="' + (x + aw/2) + '" y="' + (y + 196) + '" text-anchor="middle" font-size="11" font-weight="700" fill="var(--orange)">BASH / TOOLS</text>',
      '  <text x="' + (x + aw/2) + '" y="' + (y + 210) + '" text-anchor="middle" font-size="9" fill="var(--text-muted)">files, tests, commands</text>',
      // Worktree label
      '  <rect x="' + (x + 14) + '" y="' + (y + 230) + '" width="' + (aw - 28) + '" height="34" rx="8" fill="var(--card-bg)" stroke="var(--border-color)" stroke-width="1"/>',
      '  <text x="' + (x + aw/2) + '" y="' + (y + 252) + '" text-anchor="middle" font-size="10" fill="var(--text-light)">git worktree</text>',
    ].join('\n');
  }

  // Arrows from agents to models (right-pointing)
  function agentToModelArrow(ax, ay, my) {
    var startX = ax + aw;
    var startY = ay + 134;
    var endX = mx;
    var endY = my + mh/2;
    return '  <path d="M' + startX + ',' + startY + ' C' + (startX + 60) + ',' + startY + ' ' + (endX - 60) + ',' + endY + ' ' + endX + ',' + endY + '" fill="none" stroke="var(--blue)" stroke-width="2" stroke-dasharray="6,4" marker-end="url(#d_arrBlue)" opacity="0.5"/>';
  }

  container.innerHTML = [
    '<svg class="diagram-svg" viewBox="0 0 1100 840" id="deployDiagram" preserveAspectRatio="xMidYMid meet">',
    u.defs('d_'),

    // ═══ DL0 · Base: Agent blocks, MCP servers, Model blocks ═══
    '<g class="layer show" id="DL0">',
    // Agent 1
    agentBox(a1x, ay, 1, 'instructions + history'),
    // Agent 2
    agentBox(a2x, ay, 2, 'code review rules'),
    // Agent 3
    agentBox(a3x, ay, 3, 'test runner config'),

    // Arrows to models
    agentToModelArrow(a1x, ay, m1y),
    agentToModelArrow(a2x, ay, m2y),
    agentToModelArrow(a3x, ay, m3y),

    // Model boxes
    '  <rect x="' + mx + '" y="' + m1y + '" width="' + mw + '" height="' + mh + '" rx="24" fill="var(--blue-bg)" stroke="var(--blue)" stroke-width="3" filter="url(#d_shadow)"/>',
    '  <text x="' + (mx + mw/2) + '" y="' + (m1y + 45) + '" text-anchor="middle" font-size="16" font-weight="800" fill="var(--blue)">Claude</text>',
    '  <text x="' + (mx + mw/2) + '" y="' + (m1y + 68) + '" text-anchor="middle" font-size="11" fill="var(--text-muted)">Anthropic API</text>',
    '  <text x="' + (mx + mw/2) + '" y="' + (m1y + 98) + '" text-anchor="middle" font-size="10" font-weight="600" fill="var(--blue)">CLOUD</text>',

    '  <rect x="' + mx + '" y="' + m2y + '" width="' + mw + '" height="' + mh + '" rx="24" fill="var(--green-bg)" stroke="var(--green)" stroke-width="3" filter="url(#d_shadow)"/>',
    '  <text x="' + (mx + mw/2) + '" y="' + (m2y + 45) + '" text-anchor="middle" font-size="16" font-weight="800" fill="var(--green)">Ollama</text>',
    '  <text x="' + (mx + mw/2) + '" y="' + (m2y + 68) + '" text-anchor="middle" font-size="11" fill="var(--text-muted)">Local inference</text>',
    '  <text x="' + (mx + mw/2) + '" y="' + (m2y + 98) + '" text-anchor="middle" font-size="10" font-weight="600" fill="var(--green)">LOCAL</text>',

    '  <rect x="' + mx + '" y="' + m3y + '" width="' + mw + '" height="' + mh + '" rx="24" fill="var(--amber-bg)" stroke="var(--amber)" stroke-width="3" filter="url(#d_shadow)"/>',
    '  <text x="' + (mx + mw/2) + '" y="' + (m3y + 45) + '" text-anchor="middle" font-size="16" font-weight="800" fill="var(--amber)">Bedrock</text>',
    '  <text x="' + (mx + mw/2) + '" y="' + (m3y + 68) + '" text-anchor="middle" font-size="11" fill="var(--text-muted)">AWS Private</text>',
    '  <text x="' + (mx + mw/2) + '" y="' + (m3y + 98) + '" text-anchor="middle" font-size="10" font-weight="600" fill="var(--amber)">PRIVATE CLOUD</text>',

    // Local MCP servers
    '  <rect x="' + mlx + '" y="' + mly + '" width="340" height="100" rx="18" fill="var(--purple-bg)" stroke="var(--purple)" stroke-width="2" filter="url(#d_shadow)"/>',
    '  <text x="' + (mlx + 170) + '" y="' + (mly + 28) + '" text-anchor="middle" font-size="13" font-weight="800" letter-spacing="1" fill="var(--purple)">LOCAL MCP SERVERS</text>',
    '  <text x="' + (mlx + 80) + '" y="' + (mly + 56) + '" text-anchor="middle" font-size="14" font-weight="700" fill="var(--text-primary)">GitLab</text>',
    '  <text x="' + (mlx + 170) + '" y="' + (mly + 56) + '" text-anchor="middle" font-size="14" font-weight="700" fill="var(--text-primary)">PostgreSQL</text>',
    '  <text x="' + (mlx + 280) + '" y="' + (mly + 56) + '" text-anchor="middle" font-size="14" font-weight="700" fill="var(--text-primary)">Filesystem</text>',
    '  <text x="' + (mlx + 170) + '" y="' + (mly + 80) + '" text-anchor="middle" font-size="10" fill="var(--text-light)">data stays on your machine</text>',

    // Arrows from agents to local MCP
    '  <path d="M' + (a1x + aw/2) + ',' + (ay + ah) + ' L' + (a1x + aw/2) + ',' + mly + '" fill="none" stroke="var(--purple)" stroke-width="2" stroke-dasharray="5,4" marker-end="url(#d_arrPurple)" opacity="0.4"/>',
    '  <path d="M' + (a2x + aw/2) + ',' + (ay + ah) + ' L' + (a2x + aw/2) + ',' + mly + '" fill="none" stroke="var(--purple)" stroke-width="2" stroke-dasharray="5,4" marker-end="url(#d_arrPurple)" opacity="0.4"/>',

    // Cloud MCP servers
    '  <rect x="' + mcx + '" y="' + mcy + '" width="460" height="100" rx="18" fill="var(--rose-bg)" stroke="var(--rose)" stroke-width="2" filter="url(#d_shadow)"/>',
    '  <text x="' + (mcx + 230) + '" y="' + (mcy + 28) + '" text-anchor="middle" font-size="13" font-weight="800" letter-spacing="1" fill="var(--rose)">CLOUD MCP SERVERS</text>',
    '  <text x="' + (mcx + 70) + '" y="' + (mcy + 56) + '" text-anchor="middle" font-size="14" font-weight="700" fill="var(--text-primary)">GitHub</text>',
    '  <text x="' + (mcx + 160) + '" y="' + (mcy + 56) + '" text-anchor="middle" font-size="14" font-weight="700" fill="var(--text-primary)">Jira</text>',
    '  <text x="' + (mcx + 240) + '" y="' + (mcy + 56) + '" text-anchor="middle" font-size="14" font-weight="700" fill="var(--text-primary)">Slack</text>',
    '  <text x="' + (mcx + 330) + '" y="' + (mcy + 56) + '" text-anchor="middle" font-size="14" font-weight="700" fill="var(--text-primary)">Notion</text>',
    '  <text x="' + (mcx + 420) + '" y="' + (mcy + 56) + '" text-anchor="middle" font-size="14" font-weight="700" fill="var(--text-primary)">S3</text>',
    '  <text x="' + (mcx + 230) + '" y="' + (mcy + 80) + '" text-anchor="middle" font-size="10" fill="var(--coral)">data crosses your perimeter</text>',
    '</g>',

    // ═══ DL1_machine · "Your Machine" boundary ═══
    '<g class="layer" id="DL1_machine">',
    '  <rect x="30" y="68" width="780" height="560" rx="32" fill="none" stroke="var(--green)" stroke-width="4" stroke-dasharray="18,12" opacity="0.5"/>',
    '  <rect x="30" y="50" width="220" height="30" rx="6" fill="var(--bg-color)"/>',
    '  <text x="140" y="72" text-anchor="middle" font-size="18" font-weight="900" letter-spacing="4" fill="var(--green)">YOUR MACHINE</text>',
    '</g>',

    // ═══ DL2_sandbox · Sandbox boundary around Agent 3 ═══
    '<g class="layer" id="DL2_sandbox">',
    '  <rect x="' + (a3x - 16) + '" y="' + (ay - 20) + '" width="' + (aw + 32) + '" height="' + (ah + 52) + '" rx="26" fill="none" stroke="var(--orange)" stroke-width="3" stroke-dasharray="12,8" opacity="0.6"/>',
    '  <rect x="' + (a3x - 16) + '" y="' + (ay + ah + 10) + '" width="' + (aw + 32) + '" height="24" rx="6" fill="var(--orange-bg)"/>',
    '  <text x="' + (a3x + aw/2) + '" y="' + (ay + ah + 27) + '" text-anchor="middle" font-size="11" font-weight="800" letter-spacing="2" fill="var(--orange)">SANDBOXED</text>',
    // No network icon
    '  <text x="' + (a3x + aw + 6) + '" y="' + (ay + 10) + '" font-size="11" fill="var(--orange)" font-weight="700">no network</text>',
    '  <text x="' + (a3x + aw + 6) + '" y="' + (ay + 26) + '" font-size="11" fill="var(--orange)" font-weight="700">scoped fs</text>',
    '</g>',

    // ═══ DL3_models · Model deployment labels/boundaries ═══
    '<g class="layer" id="DL3_models">',
    // Cloud boundary
    '  <rect x="' + (mx - 16) + '" y="' + (m1y - 20) + '" width="' + (mw + 32) + '" height="' + (mh + 30) + '" rx="18" fill="none" stroke="var(--blue)" stroke-width="2" stroke-dasharray="8,6" opacity="0.4"/>',
    '  <text x="' + (mx + mw/2) + '" y="' + (m1y + mh + 22) + '" text-anchor="middle" font-size="10" fill="var(--coral)">prompts leave perimeter</text>',
    // Local boundary
    '  <rect x="' + (mx - 16) + '" y="' + (m2y - 20) + '" width="' + (mw + 32) + '" height="' + (mh + 30) + '" rx="18" fill="none" stroke="var(--green)" stroke-width="2" stroke-dasharray="8,6" opacity="0.4"/>',
    '  <text x="' + (mx + mw/2) + '" y="' + (m2y + mh + 22) + '" text-anchor="middle" font-size="10" fill="var(--green)">stays on your machine</text>',
    // Private cloud boundary
    '  <rect x="' + (mx - 16) + '" y="' + (m3y - 20) + '" width="' + (mw + 32) + '" height="' + (mh + 30) + '" rx="18" fill="none" stroke="var(--amber)" stroke-width="2" stroke-dasharray="8,6" opacity="0.4"/>',
    '  <text x="' + (mx + mw/2) + '" y="' + (m3y + mh + 22) + '" text-anchor="middle" font-size="10" fill="var(--amber)">your VPC / your keys</text>',
    '</g>',

    // ═══ DL4_mcp_local · Highlight local MCP boundary ═══
    '<g class="layer" id="DL4_mcp_local">',
    '  <rect x="' + (mlx - 10) + '" y="' + (mly - 10) + '" width="360" height="120" rx="22" fill="none" stroke="var(--green)" stroke-width="2" stroke-dasharray="8,6" opacity="0.4"/>',
    '  <text x="' + (mlx + 170) + '" y="' + (mly + 106) + '" text-anchor="middle" font-size="10" font-weight="700" fill="var(--green)">INSIDE YOUR PERIMETER</text>',
    '</g>',

    // ═══ DL5_mcp_cloud · Highlight cloud MCP — outside perimeter ═══
    '<g class="layer" id="DL5_mcp_cloud">',
    // Arrow from machine boundary down to cloud MCP
    '  <path d="M230,628 L230,' + mcy + '" fill="none" stroke="var(--rose)" stroke-width="2" stroke-dasharray="6,4" marker-end="url(#d_arrRose)"/>',
    '  <text x="244" y="' + (mcy - 20) + '" font-size="10" fill="var(--coral)" font-weight="700">API calls cross perimeter</text>',
    '</g>',

    // ═══ DL6_gov · Governance annotations ═══
    '<g class="layer" id="DL6_gov">',
    // Permission labels on agent boxes
    '  <text x="' + (a1x + aw/2) + '" y="' + (ay - 8) + '" text-anchor="middle" font-size="10" font-weight="700" fill="var(--amber)" letter-spacing="1">FULL ACCESS</text>',
    '  <text x="' + (a2x + aw/2) + '" y="' + (ay - 8) + '" text-anchor="middle" font-size="10" font-weight="700" fill="var(--amber)" letter-spacing="1">READ ONLY</text>',
    // Audit log marker
    '  <rect x="440" y="' + (mly + 12) + '" width="120" height="32" rx="8" fill="var(--amber-bg)" stroke="var(--amber)" stroke-width="1.5"/>',
    '  <text x="500" y="' + (mly + 34) + '" text-anchor="middle" font-size="11" font-weight="700" fill="var(--amber)">AUDIT LOG</text>',
    // Human-in-the-loop marker
    '  <rect x="580" y="' + (mly + 12) + '" width="180" height="32" rx="8" fill="var(--coral-bg)" stroke="var(--coral)" stroke-width="1.5"/>',
    '  <text x="670" y="' + (mly + 34) + '" text-anchor="middle" font-size="11" font-weight="700" fill="var(--coral)">HUMAN APPROVAL</text>',
    '</g>',

    // ═══ DO1_orch · Orchestrator (section 6) ═══
    '<g class="layer" id="DO1_orch">',
    // Orchestrator box at top center
    '  <rect x="200" y="24" width="300" height="80" rx="24" fill="var(--teal-bg)" stroke="var(--teal)" stroke-width="4" filter="url(#d_shadow)"/>',
    '  <text x="350" y="58" text-anchor="middle" font-size="22" font-weight="800" fill="var(--teal)">Orchestrator</text>',
    '  <text x="350" y="80" text-anchor="middle" font-size="12" fill="var(--text-muted)">delegates, collects, re-plans</text>',
    // Arrows from orchestrator to each agent
    '  <path d="M250,' + 104 + ' L' + (a1x + aw/2) + ',' + ay + '" fill="none" stroke="var(--teal)" stroke-width="2.5" marker-end="url(#d_arrTeal)"/>',
    '  <path d="M350,' + 104 + ' L' + (a2x + aw/2) + ',' + ay + '" fill="none" stroke="var(--teal)" stroke-width="2.5" marker-end="url(#d_arrTeal)"/>',
    '  <path d="M450,' + 104 + ' L' + (a3x + aw/2) + ',' + ay + '" fill="none" stroke="var(--teal)" stroke-width="2.5" marker-end="url(#d_arrTeal)"/>',
    '</g>',

    // ═══ DO2_roles · Role labels per agent ═══
    '<g class="layer" id="DO2_roles">',
    '  <rect x="' + (a1x + 20) + '" y="' + (ay + ah - 12) + '" width="' + (aw - 40) + '" height="28" rx="14" fill="var(--teal)" filter="url(#d_shadow)"/>',
    '  <text x="' + (a1x + aw/2) + '" y="' + (ay + ah + 8) + '" text-anchor="middle" font-size="11" font-weight="800" fill="white">IMPLEMENTER</text>',
    '  <rect x="' + (a2x + 20) + '" y="' + (ay + ah - 12) + '" width="' + (aw - 40) + '" height="28" rx="14" fill="var(--blue)" filter="url(#d_shadow)"/>',
    '  <text x="' + (a2x + aw/2) + '" y="' + (ay + ah + 8) + '" text-anchor="middle" font-size="11" font-weight="800" fill="white">CODE REVIEWER</text>',
    '  <rect x="' + (a3x + 20) + '" y="' + (ay + ah - 12) + '" width="' + (aw - 40) + '" height="28" rx="14" fill="var(--orange)" filter="url(#d_shadow)"/>',
    '  <text x="' + (a3x + aw/2) + '" y="' + (ay + ah + 8) + '" text-anchor="middle" font-size="11" font-weight="800" fill="white">TEST RUNNER</text>',
    '</g>',

    // ═══ DO3_flow · Coordination flow arrows ═══
    '<g class="layer" id="DO3_flow">',
    // Return arrows from agents back to orchestrator
    '  <path d="M' + (a1x + aw/2 + 20) + ',' + ay + ' L270,' + 104 + '" fill="none" stroke="var(--teal)" stroke-width="2" stroke-dasharray="6,4" marker-end="url(#d_arrTeal)" opacity="0.6"/>',
    '  <path d="M' + (a2x + aw/2 + 20) + ',' + ay + ' L370,' + 104 + '" fill="none" stroke="var(--teal)" stroke-width="2" stroke-dasharray="6,4" marker-end="url(#d_arrTeal)" opacity="0.6"/>',
    '  <path d="M' + (a3x + aw/2 + 20) + ',' + ay + ' L470,' + 104 + '" fill="none" stroke="var(--teal)" stroke-width="2" stroke-dasharray="6,4" marker-end="url(#d_arrTeal)" opacity="0.6"/>',
    // Labels on return arrows
    '  <text x="' + (a1x + aw/2 - 40) + '" y="' + (ay - 16) + '" font-size="9" fill="var(--teal)" font-weight="600">result</text>',
    '  <text x="' + (a2x + aw/2 - 40) + '" y="' + (ay - 16) + '" font-size="9" fill="var(--teal)" font-weight="600">review</text>',
    '  <text x="' + (a3x + aw/2 - 40) + '" y="' + (ay - 16) + '" font-size="9" fill="var(--teal)" font-weight="600">report</text>',
    '</g>',

    '</svg>'
  ].join('\n');
})();
