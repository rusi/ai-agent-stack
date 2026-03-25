// diagram.js — Programmatic SVG diagram for The AI Agent Stack
// Generates the interactive layered diagram inside .scrolly-diagram
(function () {
  var container = document.querySelector('.scrolly-diagram');
  if (!container) return;

  container.innerHTML = [
    '<svg class="diagram-svg" viewBox="0 0 800 730" id="mainDiagram">',
    '<defs>',
    '  <filter id="shadow" x="-4%" y="-4%" width="108%" height="112%">',
    '    <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#3D3024" flood-opacity=".06"/>',
    '  </filter>',
    '  <filter id="shadowMd" x="-4%" y="-4%" width="108%" height="112%">',
    '    <feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="#3D3024" flood-opacity=".08"/>',
    '  </filter>',
    '  <linearGradient id="gUser" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFF8F0"/><stop offset="100%" stop-color="#FFDFC8"/></linearGradient>',
    '  <linearGradient id="gModel" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#E8F0F8"/><stop offset="100%" stop-color="#C8DCF0"/></linearGradient>',
    '  <linearGradient id="gExec" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#E4F2E8"/><stop offset="100%" stop-color="#B8DCC0"/></linearGradient>',
    '  <linearGradient id="gMCP" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#EDE4F5"/><stop offset="100%" stop-color="#D0BFE4"/></linearGradient>',
    '  <linearGradient id="gBash" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FDF0E8"/><stop offset="100%" stop-color="#F5D8C4"/></linearGradient>',
    '  <linearGradient id="gContext" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FBF3E0"/><stop offset="100%" stop-color="#F3E4C0"/></linearGradient>',
    '  <linearGradient id="gAgents" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FBF3E0"/><stop offset="100%" stop-color="#F0DDB8"/></linearGradient>',
    '  <linearGradient id="gSkill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#F8E8EE"/><stop offset="100%" stop-color="#EACCD8"/></linearGradient>',
    '  <linearGradient id="gGuard" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFF4EA"/><stop offset="100%" stop-color="#F4D7C3"/></linearGradient>',
    '  <marker id="arrBlue" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="9" markerHeight="7" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#4A7FBF"/></marker>',
    '  <marker id="arrBrown" viewBox="0 0 10 7" refX="1" refY="3.5" markerWidth="9" markerHeight="7" orient="auto"><polygon points="10 0,0 3.5,10 7" fill="#9C8E80"/></marker>',
    '  <marker id="arrGreen" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="9" markerHeight="7" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#5E9E6E"/></marker>',
    '  <marker id="arrGreenR" viewBox="0 0 10 7" refX="1" refY="3.5" markerWidth="9" markerHeight="7" orient="auto"><polygon points="10 0,0 3.5,10 7" fill="#5E9E6E"/></marker>',
    '  <marker id="arrAmber" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="8" markerHeight="6" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#C4963A"/></marker>',
    '  <marker id="arrPurple" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="8" markerHeight="6" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#8B6EAF"/></marker>',
    '  <marker id="arrOrange" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="8" markerHeight="6" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#D47B4A"/></marker>',
    '  <marker id="arrRose" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="8" markerHeight="6" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#B85E7E"/></marker>',
    '</defs>',

    // Background
    '<rect width="800" height="730" fill="#FFFDF9" rx="20"/>',
    '<rect x="14" y="14" width="772" height="702" fill="none" stroke="#F7EDE0" stroke-width="28" rx="28"/>',
    '<rect x="1" y="1" width="798" height="728" fill="none" stroke="#F0E0CC" stroke-width="1.5" rx="20"/>',

    // ── L0: User + Model (always visible) ──
    '<g class="layer show" id="L0">',
    '  <rect x="20" y="285" width="125" height="82" rx="16" fill="url(#gUser)" stroke="#E8A87C" stroke-width="2" filter="url(#shadow)"/>',
    '  <text x="82" y="316" text-anchor="middle" font-size="16" fill="#3D3024" font-weight="700">You</text>',
    '  <text x="82" y="336" text-anchor="middle" font-size="11" fill="#9C8E80">(the user)</text>',
    '  <rect x="606" y="210" width="178" height="162" rx="18" fill="url(#gModel)" stroke="#4A7FBF" stroke-width="2.5" filter="url(#shadowMd)"/>',
    '  <text x="700" y="264" text-anchor="middle" font-size="20" fill="#4A7FBF" font-weight="700">Model</text>',
    '  <text x="700" y="284" text-anchor="middle" font-size="12" fill="#6B5E50">(LLM)</text>',
    '  <text x="700" y="310" text-anchor="middle" font-size="11" fill="#9C8E80">Claude, GPT,</text>',
    '  <text x="700" y="326" text-anchor="middle" font-size="11" fill="#9C8E80">Gemini, Llama</text>',
    '  <text x="700" y="350" text-anchor="middle" font-size="10" fill="#4A7FBF" font-weight="600">predicts next token</text>',
    '  <text x="700" y="366" text-anchor="middle" font-size="10" fill="#6B5E50">no tools inside the model</text>',
    '</g>',

    // ── L1: Basic chat arrows (neutral reply — no green) ──
    '<g class="layer" id="L1">',
    '  <path d="M145,308 Q392,266 603,276" fill="none" stroke="#C8DCF0" stroke-width="2.5" marker-end="url(#arrBlue)"/>',
    '  <rect x="250" y="266" width="200" height="22" rx="8" fill="white" filter="url(#shadow)"/>',
    '  <text x="350" y="281" text-anchor="middle" font-size="11" fill="#6B5E50" font-style="italic">&quot;What is the capital of France?&quot;</text>',
    '  <path d="M611,322 Q400,354 145,332" fill="none" stroke="#F0E0CC" stroke-width="2.5" marker-end="url(#arrBrown)"/>',
    '  <rect x="240" y="336" width="220" height="22" rx="8" fill="white" filter="url(#shadow)"/>',
    '  <text x="350" y="351" text-anchor="middle" font-size="11" fill="#6B5E50" font-style="italic">&quot;The capital of France is Paris.&quot;</text>',
    '</g>',

    // ── L2: System Prompt / Context Window ──
    '<g class="layer" id="L2">',
    '  <rect x="230" y="330" width="240" height="36" fill="white"/>',
    '  <rect x="200" y="45" width="380" height="125" rx="14" fill="url(#gContext)" stroke="#C4963A" stroke-width="1.5" stroke-dasharray="7,4" filter="url(#shadow)"/>',
    '  <text x="390" y="72" text-anchor="middle" font-size="12" fill="#C4963A" font-weight="700">SYSTEM PROMPT / CONTEXT</text>',
    '  <line x1="218" y1="84" x2="562" y2="84" stroke="#C4963A" stroke-width=".5" opacity=".4"/>',
    '  <text x="390" y="104" text-anchor="middle" font-size="11" fill="#6B5E50">&quot;Reply in JSON format.&quot;</text>',
    '  <text x="390" y="122" text-anchor="middle" font-size="11" fill="#6B5E50">&quot;Schema: { city, country }&quot;</text>',
    '  <text x="390" y="156" text-anchor="middle" font-size="10" fill="#C4963A" font-weight="500">hidden instructions, loaded first</text>',
    '  <path d="M580,110 Q628,110 660,215" fill="none" stroke="#C4963A" stroke-width="1.5" stroke-dasharray="5,3" marker-end="url(#arrAmber)"/>',
    '  <rect x="240" y="336" width="220" height="26" rx="8" fill="white" stroke="#4A7FBF" stroke-width="1.5" filter="url(#shadow)"/>',
    '  <text x="350" y="353" text-anchor="middle" font-size="11" fill="#4A7FBF" font-weight="600" font-family="\'JetBrains Mono\',monospace">{ &quot;city&quot;:&quot;Paris&quot;, &quot;country&quot;:&quot;FR&quot; }</text>',
    '</g>',

    // ── L3: AGENTS.md ──
    '<g class="layer" id="L3">',
    '  <rect x="15" y="52" width="160" height="68" rx="12" fill="url(#gAgents)" stroke="#C4963A" stroke-width="2" filter="url(#shadow)"/>',
    '  <text x="95" y="78" text-anchor="middle" font-size="13" fill="#C4963A" font-weight="700">AGENTS.md</text>',
    '  <text x="95" y="96" text-anchor="middle" font-size="10" fill="#6B5E50">persona, rules, permissions</text>',
    '  <text x="95" y="112" text-anchor="middle" font-size="9" fill="#C4963A" font-style="italic">always loaded at startup</text>',
    '  <path d="M175,82 L197,82" fill="none" stroke="#C4963A" stroke-width="1.5" stroke-dasharray="6,3" marker-end="url(#arrAmber)"/>',
    '</g>',

    // ── L4: SKILL.md (on-demand) ──
    '<g class="layer" id="L4">',
    '  <rect x="15" y="142" width="160" height="56" rx="12" fill="url(#gSkill)" stroke="#B85E7E" stroke-width="2" filter="url(#shadow)"/>',
    '  <text x="95" y="167" text-anchor="middle" font-size="13" fill="#B85E7E" font-weight="700">SKILL.md</text>',
    '  <text x="95" y="185" text-anchor="middle" font-size="10" fill="#6B5E50">task-specific expertise</text>',
    '  <path d="M175,164 Q192,164 197,140" fill="none" stroke="#B85E7E" stroke-width="1.5" stroke-dasharray="6,3" marker-end="url(#arrRose)"/>',
    '  <rect x="20" y="206" width="148" height="18" rx="6" fill="#F8E8EE" stroke="#B85E7E" stroke-width="1"/>',
    '  <text x="94" y="218" text-anchor="middle" font-size="9" fill="#B85E7E" font-weight="500">loaded when trigger matches</text>',
    '</g>',

    // ── L5: Agent Boundary + Tool Executor ──
    '<g class="layer" id="L5">',
    '  <rect x="230" y="330" width="240" height="40" fill="white"/>',
    // Agent boundary — fill=none so earlier layers show through
    '  <rect x="176" y="26" width="420" height="586" rx="20" fill="none" stroke="#9C8E80" stroke-width="2" stroke-dasharray="10,6"/>',
    '  <rect x="290" y="18" width="192" height="24" rx="8" fill="white" stroke="#9C8E80" stroke-width="1.5"/>',
    '  <text x="386" y="34" text-anchor="middle" font-size="11" fill="#6B5E50" font-weight="700">AGENT APPLICATION</text>',
    '  <rect x="620" y="176" width="118" height="24" rx="8" fill="white" stroke="#4A7FBF" stroke-width="1.2" filter="url(#shadow)"/>',
    '  <text x="679" y="192" text-anchor="middle" font-size="10" fill="#4A7FBF" font-weight="700">MODEL API</text>',
    // Tool Executor
    '  <rect x="250" y="405" width="240" height="82" rx="16" fill="url(#gExec)" stroke="#5E9E6E" stroke-width="2" filter="url(#shadowMd)"/>',
    '  <text x="370" y="432" text-anchor="middle" font-size="13" fill="#5E9E6E" font-weight="700">TOOL EXECUTOR</text>',
    '  <text x="370" y="450" text-anchor="middle" font-size="10" fill="#6B5E50">separate code \u2014 not the model</text>',
    '  <rect x="300" y="462" width="140" height="20" rx="7" fill="white" stroke="#5E9E6E" stroke-width="1"/>',
    '  <text x="370" y="476" text-anchor="middle" font-size="10" fill="#5E9E6E" font-family="\'JetBrains Mono\',monospace">get_weather(&quot;Tokyo&quot;)</text>',
    // Model → Executor (tool call)
    '  <path d="M700,372 L700,395 Q700,408 686,408 L493,408" fill="none" stroke="#4A7FBF" stroke-width="2" marker-end="url(#arrBlue)"/>',
    '  <text x="714" y="390" font-size="10" fill="#4A7FBF" font-weight="600">tool call</text>',
    // Executor → Model (result)
    '  <path d="M493,452 Q620,452 640,420 Q652,400 640,380 L640,370" fill="none" stroke="#5E9E6E" stroke-width="2" stroke-dasharray="5,3" marker-end="url(#arrGreen)"/>',
    '  <text x="598" y="468" font-size="10" fill="#5E9E6E">result</text>',
    // Final answer to user
    '  <path d="M611,322 Q400,354 145,332" fill="none" stroke="#5E9E6E" stroke-width="2.5" marker-end="url(#arrGreenR)"/>',
    '  <text x="350" y="324" text-anchor="middle" font-size="10" fill="#5E9E6E" font-weight="600">final answer to user</text>',
    '</g>',

    // ── L6: MCP ──
    '<g class="layer" id="L6">',
    // Expanded context with tool chips
    '  <rect x="200" y="45" width="380" height="148" rx="14" fill="url(#gContext)" stroke="#C4963A" stroke-width="1.5" stroke-dasharray="7,4" filter="url(#shadow)"/>',
    '  <text x="390" y="70" text-anchor="middle" font-size="12" fill="#C4963A" font-weight="700">SYSTEM PROMPT / CONTEXT</text>',
    '  <line x1="218" y1="80" x2="562" y2="80" stroke="#C4963A" stroke-width=".5" opacity=".4"/>',
    '  <text x="390" y="98" text-anchor="middle" font-size="10" fill="#6B5E50">&quot;You have access to these tools:&quot;</text>',
    '  <rect x="218" y="108" width="66" height="20" rx="6" fill="#EDE4F5" stroke="#8B6EAF" stroke-width="1"/>',
    '  <text x="251" y="122" text-anchor="middle" font-size="9" fill="#8B6EAF" font-weight="600">gmail</text>',
    '  <rect x="290" y="108" width="60" height="20" rx="6" fill="#EDE4F5" stroke="#8B6EAF" stroke-width="1"/>',
    '  <text x="320" y="122" text-anchor="middle" font-size="9" fill="#8B6EAF" font-weight="600">slack</text>',
    '  <rect x="356" y="108" width="66" height="20" rx="6" fill="#EDE4F5" stroke="#8B6EAF" stroke-width="1"/>',
    '  <text x="389" y="122" text-anchor="middle" font-size="9" fill="#8B6EAF" font-weight="600">github</text>',
    '  <rect x="428" y="108" width="72" height="20" rx="6" fill="#EDE4F5" stroke="#8B6EAF" stroke-width="1"/>',
    '  <text x="464" y="122" text-anchor="middle" font-size="9" fill="#8B6EAF" font-weight="600">postgres</text>',
    '  <rect x="506" y="108" width="58" height="20" rx="6" fill="#EDE4F5" stroke="#8B6EAF" stroke-width="1"/>',
    '  <text x="535" y="122" text-anchor="middle" font-size="9" fill="#8B6EAF" font-weight="600">stripe</text>',
    '  <rect x="218" y="134" width="72" height="20" rx="6" fill="#EDE4F5" stroke="#8B6EAF" stroke-width="1"/>',
    '  <text x="254" y="148" text-anchor="middle" font-size="9" fill="#8B6EAF" font-weight="600">calendar</text>',
    '  <rect x="296" y="134" width="58" height="20" rx="6" fill="#EDE4F5" stroke="#8B6EAF" stroke-width="1"/>',
    '  <text x="325" y="148" text-anchor="middle" font-size="9" fill="#8B6EAF" font-weight="600">jira</text>',
    '  <text x="390" y="180" text-anchor="middle" font-size="10" fill="#C4963A" font-weight="500">model sees available tools here</text>',
    '  <path d="M580,120 Q630,120 665,215" fill="none" stroke="#C4963A" stroke-width="1.5" stroke-dasharray="5,3" marker-end="url(#arrAmber)"/>',
    // MCP Server box
    '  <rect x="618" y="418" width="167" height="66" rx="14" fill="url(#gMCP)" stroke="#8B6EAF" stroke-width="2" filter="url(#shadow)"/>',
    '  <text x="701" y="446" text-anchor="middle" font-size="12" fill="#8B6EAF" font-weight="700">MCP Server</text>',
    '  <text x="701" y="464" text-anchor="middle" font-size="10" fill="#9C8E80">universal protocol</text>',
    // Executor → MCP arrow
    '  <path d="M490,445 L615,445" fill="none" stroke="#8B6EAF" stroke-width="2" marker-end="url(#arrPurple)"/>',
    '  <text x="552" y="438" text-anchor="middle" font-size="9" fill="#8B6EAF" font-weight="500">MCP call</text>',
    '</g>',

    // ── L7: Bash / Terminal ──
    '<g class="layer" id="L7">',
    '  <rect x="236" y="510" width="178" height="56" rx="12" fill="url(#gBash)" stroke="#D47B4A" stroke-width="2" filter="url(#shadow)"/>',
    '  <text x="325" y="535" text-anchor="middle" font-size="12" fill="#D47B4A" font-weight="700">BASH / TERMINAL</text>',
    '  <text x="325" y="552" text-anchor="middle" font-size="10" fill="#9C8E80">shell, files, packages</text>',
    '  <rect x="430" y="510" width="146" height="56" rx="12" fill="url(#gGuard)" stroke="#D47B4A" stroke-width="2" filter="url(#shadow)"/>',
    '  <text x="503" y="533" text-anchor="middle" font-size="12" fill="#D47B4A" font-weight="700">PERMISSIONS</text>',
    '  <text x="503" y="550" text-anchor="middle" font-size="10" fill="#6B5E50">sandbox • approvals</text>',
    '  <path d="M365,487 L332,507" fill="none" stroke="#D47B4A" stroke-width="1.5" marker-end="url(#arrOrange)"/>',
    '  <path d="M395,487 L470,507" fill="none" stroke="#D47B4A" stroke-width="1.5" marker-end="url(#arrOrange)"/>',
    '  <path d="M576,538 Q610,538 622,498 Q632,466 620,445" fill="none" stroke="#D47B4A" stroke-width="1.5" stroke-dasharray="5,4" marker-end="url(#arrOrange)"/>',
    '</g>',

    // ── L8: Agentic Loop ──
    '<g class="layer" id="L8">',
    '  <rect x="196" y="390" width="388" height="192" rx="16" fill="none" stroke="#C26B6B" stroke-width="2.5" stroke-dasharray="8,5"/>',
    '  <rect x="284" y="380" width="172" height="22" rx="8" fill="#FAE8E8" stroke="#C26B6B" stroke-width="1.5"/>',
    '  <text x="370" y="395" text-anchor="middle" font-size="11" fill="#C26B6B" font-weight="700">AGENTIC LOOP</text>',
    '  <text x="390" y="596" text-anchor="middle" font-size="11" fill="#C26B6B" font-weight="600">Plan \u2192 Act \u2192 Observe \u2192 Repeat</text>',
    '</g>',

    // ── L9: Multi-Agent ──
    '<g class="layer" id="L9">',
    '  <rect x="15" y="640" width="770" height="46" rx="12" fill="#E0F2F2" stroke="#4A8E8E" stroke-width="1.5" filter="url(#shadow)"/>',
    '  <text x="400" y="668" text-anchor="middle" font-size="12" fill="#4A8E8E" font-weight="700">MULTI-AGENT:  Orchestrator spawns multiple instances of this entire stack</text>',
    '</g>',

    '</svg>'
  ].join('\n');
})();
