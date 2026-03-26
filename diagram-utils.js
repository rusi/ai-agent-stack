// diagram-utils.js — Shared SVG helper functions for all diagrams
window.diagramUtils = {
  pill: function (x, y, label, colorClass) {
    return [
      '<g class="dyn-pill" data-label="' + label + '" transform="translate(' + x + ',' + y + ')">',
      '  <circle r="12" fill="var(--' + colorClass + ')" filter="url(#shadow)"/>',
      '  <text y="4" text-anchor="middle" font-size="12" font-weight="800" fill="#FFFFFF">' + label + '</text>',
      '</g>'
    ].join('\n');
  },

  bubble: function (x, y, text, stroke, width) {
    return [
      '<g transform="translate(' + x + ',' + y + ')">',
      '  <rect x="-' + (width / 2) + '" y="-20" width="' + width + '" height="40" rx="14" fill="var(--card-bg)" stroke="' + stroke + '" stroke-width="2" filter="url(#shadow)"/>',
      '  <text y="6" text-anchor="middle" font-size="14" font-weight="700" fill="var(--text-primary)">' + text + '</text>',
      '</g>'
    ].join('\n');
  },

  tag: function (x, y, title, detail, color) {
    return [
      '<g transform="translate(' + x + ',' + y + ')">',
      '  <text y="0" text-anchor="middle" font-size="10" font-weight="700" letter-spacing="1" fill="var(--' + color + ')">' + title + '</text>',
      '  <text y="17" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text-primary)" style="font-family:\'JetBrains Mono\',monospace">' + detail + '</text>',
      '</g>'
    ].join('\n');
  },

  defs: function (idPrefix) {
    var p = idPrefix || '';
    return [
      '<defs>',
      '  <filter id="' + p + 'shadow" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000000" flood-opacity="0.14"/></filter>',
      '  <marker id="' + p + 'arrBlue"   viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="var(--blue)"/></marker>',
      '  <marker id="' + p + 'arrAmber"  viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="var(--amber)"/></marker>',
      '  <marker id="' + p + 'arrGreen"  viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="var(--green)"/></marker>',
      '  <marker id="' + p + 'arrBrown"  viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="var(--text-light)"/></marker>',
      '  <marker id="' + p + 'arrPurple" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="var(--purple)"/></marker>',
      '  <marker id="' + p + 'arrOrange" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="var(--orange)"/></marker>',
      '  <marker id="' + p + 'arrCoral"  viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="var(--coral)"/></marker>',
      '  <marker id="' + p + 'arrRose"   viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="var(--rose)"/></marker>',
      '  <marker id="' + p + 'arrTeal"   viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="var(--teal)"/></marker>',
      '</defs>'
    ].join('\n');
  }
};
