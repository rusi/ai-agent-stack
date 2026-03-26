// deploy-diagram.js — Deployment Boundaries + Orchestration Diagram
(function () {
  var container = document.getElementById('deployDiagramContainer');
  if (!container) return;

  var u = window.diagramUtils;

  // Layout (v6 — aligned models, opaque pills, proper boundaries):
  //
  //   ┌──── YOUR MACHINE ─────────────────────────────────┐
  //   │                              [SANDBOX]             │
  //   │  Agent 1      Agent 2      Agent 3                 │    Remote MCP
  //   │  ┌────────┐   ┌────────┐   ┌────────┐             │    ┌──────────┐
  //   │  │Context │   │Context │   │Context │             │    │ GitHub   │
  //   │  │Engine  │   │Engine  │   │Engine  │             │    │ Jira     │
  //   │  │Tools   │   │Tools   │   │Tools   │             │    │ Slack    │
  //   │  └────────┘   └────────┘   └────────┘             │    │ Notion   │
  //   │                                                    │    └──────────┘
  //   │  Files&Secrets       Local MCP  ─── arrow ───>     │    SaaS/APIs
  //   └────────────────────────────────────────────────────┘    ┌──────────┐
  //                                                             │Google    │
  //      [LOCAL]        [PRIV CLOUD]         [CLOUD]            └──────────┘
  //       Llama          Claude/Bedr.        Claude  Codex
  //

  var baseOp = '0.5';

  // Agent boxes
  var aw = 200, ah = 260;
  var a1x = 40, a2x = 265, a3x = 490;
  var ay = 100;

  // Sandbox geometry — pill inside border
  var sbTop = ay - 36;       // border top (pill is inside)
  var sbPillY = ay - 16;     // pill center

  // YOUR MACHINE border — covers agents + filesystem + MCP
  var ymTop = sbTop - 20;    // above sandbox border
  var ymLeft = 14;
  var ymWidth = 710;          // covers Agent 3 (490 + 200 = 690 + padding)
  var ymHeight = 520 - ymTop; // extends to below FS/MCP row

  // Files & Secrets (LEFT below agents)
  var fsx = 40, fsy = 410, fsw = 270, fsh = 90;

  // Local MCP (RIGHT below agents)
  var mlx = 340, mly = 410, mlw = 280, mlh = 90;

  // Right column
  var rcx = 780, rcw = 250;
  // Remote MCP
  var rmcy = 70, rmch = 260;
  // SaaS / APIs — aligned with Local MCP row
  var ssy = mly, ssh = mlh;

  // Model row — ALL models on same Y
  var mh = 110;
  var modY = 580;
  // Left models (under YOUR MACHINE, centered)
  var lm1x = 140, lm1w = 170;   // Llama (LOCAL)
  var lm2x = 360, lm2w = 200;   // Claude/Bedrock (PRIVATE CLOUD)
  // Cloud models (in right column, same row)
  var cm1x = rcx, cm1w = 115;        // Claude
  var cm2x = rcx + 130, cm2w = 120;  // Codex

  function agentBox(x, y, num) {
    var cx = x + aw / 2;
    var secW = aw - 20, secX = x + 10;
    return [
      '  <rect x="' + x + '" y="' + y + '" width="' + aw + '" height="' + ah + '" rx="20" fill="var(--card-bg)" stroke="var(--border-color)" stroke-width="2" opacity="' + baseOp + '"/>',
      '  <text x="' + cx + '" y="' + (y + 36) + '" text-anchor="middle" font-size="28" font-weight="800" fill="var(--text-primary)" opacity="' + baseOp + '">Agent ' + num + '</text>',
      '  <rect x="' + secX + '" y="' + (y + 50) + '" width="' + secW + '" height="50" rx="14" fill="var(--amber-bg)" stroke="var(--amber)" stroke-width="1.5" opacity="' + baseOp + '"/>',
      '  <text x="' + cx + '" y="' + (y + 82) + '" text-anchor="middle" font-size="20" font-weight="700" fill="var(--amber)" opacity="' + baseOp + '">Context</text>',
      '  <rect x="' + secX + '" y="' + (y + 110) + '" width="' + secW + '" height="50" rx="14" fill="var(--green-bg)" stroke="var(--green)" stroke-width="1.5" opacity="' + baseOp + '"/>',
      '  <text x="' + cx + '" y="' + (y + 142) + '" text-anchor="middle" font-size="20" font-weight="700" fill="var(--green)" opacity="' + baseOp + '">Engine</text>',
      '  <rect x="' + secX + '" y="' + (y + 170) + '" width="' + secW + '" height="50" rx="14" fill="var(--card-bg)" stroke="var(--orange)" stroke-width="1.5" opacity="' + baseOp + '"/>',
      '  <text x="' + cx + '" y="' + (y + 202) + '" text-anchor="middle" font-size="20" font-weight="700" fill="var(--orange)" opacity="' + baseOp + '">Tools / Bash</text>',
    ].join('\n');
  }

  function modelBox(x, y, w, h, name, provider) {
    var cx = x + w / 2;
    return [
      '  <rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="22" fill="var(--card-bg)" stroke="var(--border-color)" stroke-width="2" opacity="' + baseOp + '"/>',
      '  <text x="' + cx + '" y="' + (y + 30) + '" text-anchor="middle" font-size="14" font-weight="600" fill="var(--text-muted)" opacity="' + baseOp + '">' + provider + '</text>',
      '  <text x="' + cx + '" y="' + (y + 68) + '" text-anchor="middle" font-size="28" font-weight="800" fill="var(--blue)" opacity="' + baseOp + '">' + name + '</text>',
    ].join('\n');
  }

  // Pill label — OPAQUE, no transparency
  function pillLabel(cx, y, text, color, pw) {
    var half = (pw || 180) / 2;
    return [
      '  <rect x="' + (cx - half) + '" y="' + (y - 16) + '" width="' + (half * 2) + '" height="32" rx="16" fill="var(--' + color + ')" filter="url(#d_shadow)"/>',
      '  <text x="' + cx + '" y="' + (y + 6) + '" text-anchor="middle" font-size="14" font-weight="800" letter-spacing="2" fill="white">' + text + '</text>',
    ].join('\n');
  }

  // Warning icon with number
  function warnIcon(x, y, num) {
    return [
      '  <circle cx="' + x + '" cy="' + y + '" r="16" fill="var(--coral)" filter="url(#d_shadow)"/>',
      '  <text x="' + x + '" y="' + (y + 1) + '" text-anchor="middle" font-size="11" font-weight="800" fill="white" dominant-baseline="middle">\u26A0' + num + '</text>',
    ].join('\n');
  }

  // Arrow Y for external API calls — aligned with MCP/SaaS center
  var arrowY = mly + mlh / 2;

  container.innerHTML = [
    '<svg class="diagram-svg" viewBox="0 0 1080 740" id="deployDiagram" preserveAspectRatio="xMidYMid meet">',
    u.defs('d_'),

    // ═══ DL0 · Base ═══
    '<g class="layer show" id="DL0">',

    agentBox(a1x, ay, 1),
    agentBox(a2x, ay, 2),
    agentBox(a3x, ay, 3),

    // Files & Secrets (LEFT)
    '  <rect x="' + fsx + '" y="' + fsy + '" width="' + fsw + '" height="' + fsh + '" rx="20" fill="var(--card-bg)" stroke="var(--border-color)" stroke-width="2" opacity="' + baseOp + '"/>',
    '  <text x="' + (fsx + fsw/2) + '" y="' + (fsy + 28) + '" text-anchor="middle" font-size="14" font-weight="800" letter-spacing="2" fill="var(--coral)" opacity="' + baseOp + '">LOCAL FILESYSTEM</text>',
    '  <text x="' + (fsx + 75) + '" y="' + (fsy + 62) + '" text-anchor="middle" font-size="22" font-weight="700" fill="var(--text-primary)" opacity="' + baseOp + '">Files</text>',
    '  <text x="' + (fsx + 195) + '" y="' + (fsy + 62) + '" text-anchor="middle" font-size="22" font-weight="700" fill="var(--coral)" opacity="' + baseOp + '">Secrets</text>',

    // Local MCP (RIGHT)
    '  <rect x="' + mlx + '" y="' + mly + '" width="' + mlw + '" height="' + mlh + '" rx="20" fill="var(--card-bg)" stroke="var(--border-color)" stroke-width="2" opacity="' + baseOp + '"/>',
    '  <text x="' + (mlx + mlw/2) + '" y="' + (mly + 28) + '" text-anchor="middle" font-size="14" font-weight="800" letter-spacing="2" fill="var(--purple)" opacity="' + baseOp + '">LOCAL MCP</text>',
    '  <text x="' + (mlx + 70) + '" y="' + (mly + 62) + '" text-anchor="middle" font-size="22" font-weight="700" fill="var(--text-primary)" opacity="' + baseOp + '">GitLab</text>',
    '  <text x="' + (mlx + 195) + '" y="' + (mly + 62) + '" text-anchor="middle" font-size="22" font-weight="700" fill="var(--text-primary)" opacity="' + baseOp + '">Postgres</text>',

    // Remote MCP (right column top)
    '  <rect x="' + rcx + '" y="' + rmcy + '" width="' + rcw + '" height="' + rmch + '" rx="24" fill="var(--card-bg)" stroke="var(--border-color)" stroke-width="2" opacity="' + baseOp + '"/>',
    '  <text x="' + (rcx + rcw/2) + '" y="' + (rmcy + 34) + '" text-anchor="middle" font-size="14" font-weight="800" letter-spacing="2" fill="var(--rose)" opacity="' + baseOp + '">REMOTE MCP</text>',
    '  <text x="' + (rcx + rcw/2) + '" y="' + (rmcy + 78) + '" text-anchor="middle" font-size="24" font-weight="700" fill="var(--text-primary)" opacity="' + baseOp + '">GitHub</text>',
    '  <text x="' + (rcx + rcw/2) + '" y="' + (rmcy + 118) + '" text-anchor="middle" font-size="24" font-weight="700" fill="var(--text-primary)" opacity="' + baseOp + '">Jira</text>',
    '  <text x="' + (rcx + rcw/2) + '" y="' + (rmcy + 158) + '" text-anchor="middle" font-size="24" font-weight="700" fill="var(--text-primary)" opacity="' + baseOp + '">Slack</text>',
    '  <text x="' + (rcx + rcw/2) + '" y="' + (rmcy + 198) + '" text-anchor="middle" font-size="24" font-weight="700" fill="var(--text-primary)" opacity="' + baseOp + '">Notion</text>',
    '  <text x="' + (rcx + rcw/2) + '" y="' + (rmcy + 238) + '" text-anchor="middle" font-size="24" font-weight="700" fill="var(--text-primary)" opacity="' + baseOp + '">Linear</text>',

    // SaaS / External APIs — aligned with Local MCP row
    '  <rect x="' + rcx + '" y="' + ssy + '" width="' + rcw + '" height="' + ssh + '" rx="20" fill="var(--card-bg)" stroke="var(--border-color)" stroke-width="2" opacity="' + baseOp + '"/>',
    '  <text x="' + (rcx + rcw/2) + '" y="' + (ssy + 28) + '" text-anchor="middle" font-size="14" font-weight="800" letter-spacing="2" fill="var(--coral)" opacity="' + baseOp + '">SAAS / EXTERNAL APIS</text>',
    '  <text x="' + (rcx + 65) + '" y="' + (ssy + 62) + '" text-anchor="middle" font-size="20" font-weight="700" fill="var(--text-primary)" opacity="' + baseOp + '">Google</text>',
    '  <text x="' + (rcx + 185) + '" y="' + (ssy + 62) + '" text-anchor="middle" font-size="20" font-weight="700" fill="var(--text-primary)" opacity="' + baseOp + '">Stripe</text>',

    // Model row — ALL on same Y
    modelBox(lm1x, modY, lm1w, mh, 'Llama', 'Meta / local'),
    modelBox(lm2x, modY, lm2w, mh, 'Claude', 'AWS Bedrock'),
    modelBox(cm1x, modY, cm1w, mh, 'Claude', 'Anthropic'),
    modelBox(cm2x, modY, cm2w, mh, 'Codex', 'OpenAI'),

    '</g>',

    // ═══ DL1_machine · "Your Machine" ═══
    '<g class="layer" id="DL1_machine">',
    '  <rect x="' + ymLeft + '" y="' + ymTop + '" width="' + ymWidth + '" height="' + ymHeight + '" rx="32" fill="none" stroke="var(--green)" stroke-width="4"/>',
    pillLabel(180, ymTop, 'YOUR MACHINE', 'green', 220),
    '</g>',

    // ═══ DL2_sandbox · pill INSIDE border ═══
    '<g class="layer" id="DL2_sandbox">',
    '  <rect x="' + (a3x - 16) + '" y="' + sbTop + '" width="' + (aw + 32) + '" height="' + (ay + ah - sbTop + 16) + '" rx="24" fill="none" stroke="var(--orange)" stroke-width="3"/>',
    pillLabel(a3x + aw/2, sbTop + 20, 'SANDBOX', 'orange', aw + 20),
    '</g>',

    // ═══ DL3_models · LOCAL + PRIVATE CLOUD boundaries ═══
    '<g class="layer" id="DL3_models">',
    // LOCAL boundary (Llama)
    '  <rect x="' + (lm1x - 12) + '" y="' + (modY - 24) + '" width="' + (lm1w + 24) + '" height="' + (mh + 48) + '" rx="22" fill="none" stroke="var(--green)" stroke-width="4"/>',
    pillLabel(lm1x + lm1w/2, modY - 24, 'LOCAL', 'green', 110),
    // PRIVATE CLOUD boundary (Bedrock)
    '  <rect x="' + (lm2x - 12) + '" y="' + (modY - 24) + '" width="' + (lm2w + 24) + '" height="' + (mh + 48) + '" rx="22" fill="none" stroke="var(--amber)" stroke-width="4"/>',
    pillLabel(lm2x + lm2w/2, modY - 24, 'PRIVATE CLOUD', 'amber', 180),
    '</g>',

    // ═══ DL3_cloud · Small CLOUD boundary around cloud models (hidden when DL5 expands) ═══
    '<g class="layer" id="DL3_cloud">',
    '  <rect x="' + (cm1x - 12) + '" y="' + (modY - 24) + '" width="' + (cm2x + cm2w - cm1x + 24) + '" height="' + (mh + 48) + '" rx="22" fill="none" stroke="var(--coral)" stroke-width="4"/>',
    pillLabel((cm1x + cm2x + cm2w) / 2, modY - 24, 'CLOUD', 'coral', 120),
    '</g>',

    // ═══ DL4_mcp_local · Local MCP highlight + straight arrow ═══
    '<g class="layer" id="DL4_mcp_local">',
    '  <rect x="' + (mlx - 10) + '" y="' + (mly - 10) + '" width="' + (mlw + 20) + '" height="' + (mlh + 20) + '" rx="24" fill="none" stroke="var(--purple)" stroke-width="3"/>',
    // Straight horizontal arrow — MCP center to SaaS left
    '  <path d="M' + (mlx + mlw + 10) + ',' + arrowY + ' L' + (rcx - 8) + ',' + arrowY + '" fill="none" stroke="var(--coral)" stroke-width="3" stroke-dasharray="10,6" marker-end="url(#d_arrCoral)"/>',
    '  <text x="' + ((mlx + mlw + rcx) / 2) + '" y="' + (arrowY - 12) + '" text-anchor="middle" font-size="14" font-weight="700" fill="var(--coral)">external API calls</text>',
    '</g>',

    // ═══ DL5_mcp_cloud · CLOUD boundary expanded — wraps Remote MCP + SaaS + Cloud Models ═══
    '<g class="layer" id="DL5_mcp_cloud">',
    '  <rect x="' + (rcx - 14) + '" y="' + (rmcy - 20) + '" width="' + (rcw + 28) + '" height="' + (modY + mh - rmcy + 44) + '" rx="28" fill="none" stroke="var(--rose)" stroke-width="4"/>',
    pillLabel(rcx + rcw/2, rmcy - 20, 'CLOUD', 'rose', 130),
    '</g>',

    // ═══ DL6_gov · Attack surface — numbered warnings ═══
    '<g class="layer" id="DL6_gov">',
    // ①  Files & Secrets — agent reads credentials
    '  <rect x="' + (fsx - 6) + '" y="' + (fsy - 6) + '" width="' + (fsw + 12) + '" height="' + (fsh + 12) + '" rx="24" fill="none" stroke="var(--coral)" stroke-width="4" stroke-dasharray="8,6"/>',
    warnIcon(fsx + fsw + 2, fsy + 10, '1'),
    // ②  Local MCP → external APIs
    warnIcon((mlx + mlw + rcx) / 2, arrowY + 22, '2'),
    // ③  Remote MCP (API tokens, data shared)
    warnIcon(rcx + rcw + 2, rmcy + 40, '3'),
    // ④  Cloud models (prompts stored, training data)
    warnIcon(rcx + rcw + 2, modY + 40, '4'),
    '</g>',

    // ═══ DO1_orch · Orchestrator ═══
    '<g class="layer" id="DO1_orch">',
    '  <rect x="160" y="14" width="360" height="72" rx="28" fill="var(--teal-bg)" stroke="var(--teal)" stroke-width="4" filter="url(#d_shadow)"/>',
    '  <text x="340" y="48" text-anchor="middle" font-size="28" font-weight="800" fill="var(--teal)">Orchestrator</text>',
    '  <text x="340" y="68" text-anchor="middle" font-size="14" fill="var(--text-muted)">delegates, collects, re-plans</text>',
    '  <path d="M240,86 L' + (a1x + aw/2) + ',' + ay + '" fill="none" stroke="var(--teal)" stroke-width="3" marker-end="url(#d_arrTeal)"/>',
    '  <path d="M340,86 L' + (a2x + aw/2) + ',' + ay + '" fill="none" stroke="var(--teal)" stroke-width="3" marker-end="url(#d_arrTeal)"/>',
    '  <path d="M440,86 L' + (a3x + aw/2) + ',' + ay + '" fill="none" stroke="var(--teal)" stroke-width="3" marker-end="url(#d_arrTeal)"/>',
    '</g>',

    // ═══ DO2_roles ═══
    '<g class="layer" id="DO2_roles">',
    '  <rect x="' + (a1x + 14) + '" y="' + (ay + ah - 20) + '" width="' + (aw - 28) + '" height="36" rx="18" fill="var(--teal)" filter="url(#d_shadow)"/>',
    '  <text x="' + (a1x + aw/2) + '" y="' + (ay + ah + 4) + '" text-anchor="middle" font-size="15" font-weight="800" fill="white" letter-spacing="1">IMPLEMENTER</text>',
    '  <rect x="' + (a2x + 14) + '" y="' + (ay + ah - 20) + '" width="' + (aw - 28) + '" height="36" rx="18" fill="var(--blue)" filter="url(#d_shadow)"/>',
    '  <text x="' + (a2x + aw/2) + '" y="' + (ay + ah + 4) + '" text-anchor="middle" font-size="15" font-weight="800" fill="white" letter-spacing="1">REVIEWER</text>',
    '  <rect x="' + (a3x + 14) + '" y="' + (ay + ah - 20) + '" width="' + (aw - 28) + '" height="36" rx="18" fill="var(--orange)" filter="url(#d_shadow)"/>',
    '  <text x="' + (a3x + aw/2) + '" y="' + (ay + ah + 4) + '" text-anchor="middle" font-size="15" font-weight="800" fill="white" letter-spacing="1">TEST RUNNER</text>',
    '</g>',

    // ═══ DO3_flow ═══
    '<g class="layer" id="DO3_flow">',
    '  <path d="M' + (a1x + aw/2 + 20) + ',' + ay + ' L260,86" fill="none" stroke="var(--teal)" stroke-width="2" stroke-dasharray="6,4" marker-end="url(#d_arrTeal)" opacity="0.6"/>',
    '  <path d="M' + (a2x + aw/2 + 20) + ',' + ay + ' L360,86" fill="none" stroke="var(--teal)" stroke-width="2" stroke-dasharray="6,4" marker-end="url(#d_arrTeal)" opacity="0.6"/>',
    '  <path d="M' + (a3x + aw/2 + 20) + ',' + ay + ' L460,86" fill="none" stroke="var(--teal)" stroke-width="2" stroke-dasharray="6,4" marker-end="url(#d_arrTeal)" opacity="0.6"/>',
    '  <text x="' + (a1x + aw/2 - 30) + '" y="' + (ay - 8) + '" font-size="13" fill="var(--teal)" font-weight="600">result</text>',
    '  <text x="' + (a2x + aw/2 - 30) + '" y="' + (ay - 8) + '" font-size="13" fill="var(--teal)" font-weight="600">review</text>',
    '  <text x="' + (a3x + aw/2 - 30) + '" y="' + (ay - 8) + '" font-size="13" fill="var(--teal)" font-weight="600">report</text>',
    '</g>',

    '</svg>'
  ].join('\n');
})();
