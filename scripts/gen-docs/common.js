// scripts/gen-docs/common.js
// Generic renderer for every mock document photograph. Each document HTML
// file only supplies a config object; every one of the seven realism rules
// lives here so it is applied identically everywhere. Dev tooling — no
// Math.random: every "random" position comes from a seeded PRNG so builds
// reproduce byte-for-byte.

const SVG_NS = "http://www.w3.org/2000/svg";

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function el(tag, attrs = {}, parent) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "text") node.textContent = v;
    else if (k === "html") node.innerHTML = v;
    else if (k === "class") node.className = v;
    else if (k === "id") node.id = v;
    else node.style.setProperty(k, v);
  }
  if (parent) parent.appendChild(node);
  return node;
}

function svgEl(tag, attrs = {}, parent) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  if (parent) parent.appendChild(node);
  return node;
}

/* -------------------------------------------------------------- *
 * 2. Substrate: paper grain + dust + fibres
 * -------------------------------------------------------------- */
function buildGrain(card, seed) {
  const svg = svgEl("svg", { class: "grain", width: "100%", height: "100%" }, card);
  svg.style.opacity = 0.06 + (seed % 4) * 0.008;
  const filter = svgEl("filter", { id: `grain-${seed}` });
  svgEl("feTurbulence", {
    type: "fractalNoise",
    baseFrequency: "0.82",
    numOctaves: "3",
    seed: String(seed % 97),
    stitchTiles: "stitch",
  }, filter);
  svgEl("feColorMatrix", { type: "saturate", values: "0" }, filter);
  const defs = svgEl("defs", {}, svg);
  defs.appendChild(filter);
  svgEl("rect", { width: "100%", height: "100%", filter: `url(#grain-${seed})` }, svg);
}

function buildDustAndFibres(card, seed, cardW, cardH) {
  const rnd = mulberry32(seed + 7);
  const svg = svgEl("svg", { class: "dust-fibre", width: "100%", height: "100%" }, card);
  const count = 15 + Math.floor(rnd() * 11); // 15-25
  const g = svgEl("g", { opacity: "0.04" }, svg);
  for (let i = 0; i < count; i++) {
    svgEl("circle", {
      cx: String(rnd() * cardW),
      cy: String(rnd() * cardH),
      r: String(0.4 + rnd() * 1.1),
      fill: "#1a1816",
    }, g);
  }
  for (let i = 0; i < 2; i++) {
    const x1 = rnd() * cardW;
    const y1 = rnd() * cardH;
    const len = 60 + rnd() * 140;
    const angle = rnd() * Math.PI * 2;
    svgEl("line", {
      x1: String(x1),
      y1: String(y1),
      x2: String(x1 + Math.cos(angle) * len),
      y2: String(y1 + Math.sin(angle) * len),
      stroke: "#1a1816",
      "stroke-width": "0.6",
      opacity: "0.04",
    }, svg);
  }
}

/* -------------------------------------------------------------- *
 * 6. Security furniture
 * -------------------------------------------------------------- */
function buildGuilloche(parent, seed, box) {
  const rnd = mulberry32(seed + 41);
  const svg = svgEl("svg", {
    class: "guilloche",
    style: `top:${box.top}px;left:${box.left}px;width:${box.size}px;height:${box.size}px;`,
    viewBox: "0 0 200 200",
  }, parent);
  const cx = 100, cy = 100;
  const rings = 4;
  for (let ring = 0; ring < rings; ring++) {
    const R = 34 + ring * 14 + rnd() * 4;
    const r = 9 + ring * 3 + rnd() * 3;
    const d = 16 + ring * 5;
    let path = "";
    const steps = 260;
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * Math.PI * 2 * (r / Math.max(1, gcdApprox(R, r)));
      const x = cx + (R + r) * Math.cos(t) - d * Math.cos(((R + r) / r) * t);
      const y = cy + (R + r) * Math.sin(t) - d * Math.sin(((R + r) / r) * t);
      path += `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)} `;
    }
    svgEl("path", {
      d: path,
      fill: "none",
      stroke: "#3a4a6b",
      "stroke-width": "0.6",
      opacity: "0.14",
    }, svg);
  }
  svgEl("circle", { cx, cy, r: 3, fill: "#3a4a6b", opacity: "0.16" }, svg);
}
function gcdApprox(a, b) {
  a = Math.round(a); b = Math.round(b);
  while (b) { [a, b] = [b, a % b]; }
  return a || 1;
}

function buildMicrotext(parent, text, box) {
  const unit = ` ${text} • `;
  const reps = Math.ceil((box.width / 22) / unit.length) + 4;
  el("div", {
    class: "microtext",
    top: `${box.top}px`,
    left: `${box.left}px`,
    width: `${box.width}px`,
    text: unit.repeat(reps),
  }, parent);
}

function buildGhostWatermark(parent, text, box) {
  el("div", {
    class: "ghost-watermark",
    top: `${box.top}px`,
    left: `${box.left}px`,
    "font-size": `${box.size}px`,
    transform: `rotate(-22deg)`,
    text,
  }, parent);
}

function buildSeal(parent, rimText, centerText, box) {
  const svg = svgEl("svg", {
    class: "seal",
    style: `top:${box.top}px;left:${box.left}px;width:${box.size}px;height:${box.size}px;`,
    viewBox: "0 0 200 200",
  }, parent);
  const defs = svgEl("defs", {}, svg);
  const path = svgEl("path", {
    id: `sealpath-${box.top}-${box.left}`,
    d: "M 20,100 A 80,80 0 1 1 180,100 A 80,80 0 1 1 20,100",
    fill: "none",
  }, defs);
  svgEl("circle", { cx: 100, cy: 100, r: 92, fill: "none", stroke: "#3a4a6b", "stroke-width": "1.4" }, svg);
  svgEl("circle", { cx: 100, cy: 100, r: 82, fill: "none", stroke: "#3a4a6b", "stroke-width": "0.8" }, svg);
  svgEl("circle", { cx: 100, cy: 100, r: 46, fill: "none", stroke: "#3a4a6b", "stroke-width": "0.8" }, svg);
  const t = svgEl("text", {
    fill: "#3a4a6b",
    "font-size": "10.5",
    "font-family": "GD Condensed, sans-serif",
    "font-weight": "700",
    "letter-spacing": "2.4",
  }, svg);
  const tp = svgEl("textPath", { href: `#${path.id}`, startOffset: "2%" }, t);
  tp.textContent = rimText.toUpperCase();
  const t2 = svgEl("text", {
    x: 100, y: 96, fill: "#3a4a6b", "font-size": "13", "font-family": "GD Archivo, sans-serif",
    "font-weight": "800", "text-anchor": "middle",
  }, svg);
  t2.textContent = centerText;
  const t3 = svgEl("text", {
    x: 100, y: 112, fill: "#3a4a6b", "font-size": "6.5", "font-family": "GD Condensed, sans-serif",
    "text-anchor": "middle", "letter-spacing": "1",
  }, svg);
  t3.textContent = "EST. 1988 · MV ACT";
}

function buildQr(parent, seed, box) {
  const rnd = mulberry32(seed + 91);
  const cells = 21;
  const cell = box.size / cells;
  const svg = svgEl("svg", {
    class: "qr-block",
    style: `top:${box.top}px;left:${box.left}px;width:${box.size}px;height:${box.size}px;`,
    viewBox: `0 0 ${box.size} ${box.size}`,
  }, parent);
  svgEl("rect", { width: box.size, height: box.size, fill: "#f4f1e8" }, svg);
  for (let y = 0; y < cells; y++) {
    for (let x = 0; x < cells; x++) {
      const inFinder =
        (x < 7 && y < 7) || (x >= cells - 7 && y < 7) || (x < 7 && y >= cells - 7);
      if (inFinder) continue;
      if (rnd() > 0.56) {
        svgEl("rect", {
          x: (x * cell).toFixed(2), y: (y * cell).toFixed(2),
          width: cell.toFixed(2), height: cell.toFixed(2), fill: "#16181c",
        }, svg);
      }
    }
  }
  const finder = (fx, fy) => {
    svgEl("rect", { x: fx * cell, y: fy * cell, width: cell * 7, height: cell * 7, fill: "#16181c" }, svg);
    svgEl("rect", { x: (fx + 1) * cell, y: (fy + 1) * cell, width: cell * 5, height: cell * 5, fill: "#f4f1e8" }, svg);
    svgEl("rect", { x: (fx + 2) * cell, y: (fy + 2) * cell, width: cell * 3, height: cell * 3, fill: "#16181c" }, svg);
  };
  finder(0, 0);
  finder(cells - 7, 0);
  finder(0, cells - 7);
}

function buildHologramBand(parent, cardW, cardH) {
  el("div", {
    class: "hologram-band",
    top: `${-cardH * 0.2}px`,
    left: `${cardW * 0.55}px`,
    width: `${cardW * 0.28}px`,
    height: `${cardH * 1.4}px`,
    transform: "rotate(40deg)",
    background:
      "linear-gradient(180deg, #ff5fa2, #ffd400, #34d399, #38bdf8, #a78bfa, #ff5fa2)",
  }, parent);
}

function buildSpecularSheen(parent, cardW, cardH) {
  el("div", {
    class: "specular-sheen",
    top: `${-cardH * 0.3}px`,
    left: `${-cardW * 0.2}px`,
    width: `${cardW * 0.35}px`,
    height: `${cardH * 1.8}px`,
    transform: "rotate(18deg)",
    opacity: "0.18",
    background: "linear-gradient(90deg, transparent, #fff, transparent)",
  }, parent);
}

/* -------------------------------------------------------------- *
 * 7. Wear + specimen marks
 * -------------------------------------------------------------- */
function buildFold(parent, cardW, cardH, fold) {
  const len = cardW * fold.lengthFrac;
  const common = {
    top: `${fold.top}px`,
    left: `${fold.left}px`,
    width: `${len}px`,
    height: "1px",
    transform: `rotate(${fold.angle}deg)`,
  };
  el("div", { class: "fold-light", ...common }, parent);
  el("div", { class: "fold-dark", ...common, top: `${fold.top + 2}px`, height: "3px" }, parent);
}

function buildSpecimen(card, cardW, cardH) {
  const svg = svgEl("svg", { class: "specimen-diag", width: "140%", height: "140%" }, card);
  const rows = 6, cols = 3;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const t = svgEl("text", {
        x: c * (cardW / cols) - 40,
        y: r * (cardH / (rows - 1)) + 20,
        fill: "#16181c",
        "font-family": "GD Archivo, sans-serif",
        "font-weight": "800",
        "font-size": "22",
        transform: `rotate(-28 ${c * (cardW / cols)} ${r * (cardH / (rows - 1))})`,
      }, svg);
      t.textContent = "SPECIMEN — DEMO ONLY";
    }
  }
  el("div", {
    class: "specimen-footer",
    bottom: "6px",
    left: "14px",
    text: "SPECIMEN — fictional data generated for the Vahan Mitra demo. Not a valid government document.",
  }, card);
}

/* -------------------------------------------------------------- *
 * Master builder
 * -------------------------------------------------------------- */
export function buildCard(config) {
  const stage = document.getElementById("stage");
  stage.style.width = `${config.canvas.w}px`;
  stage.style.height = `${config.canvas.h}px`;

  const rig = el("div", { id: "rig" }, stage);
  const geo = config.geometry;
  rig.style.left = `${(config.canvas.w - config.card.w) / 2}px`;
  rig.style.top = `${(config.canvas.h - config.card.h) / 2}px`;
  rig.style.width = `${config.card.w}px`;
  rig.style.height = `${config.card.h}px`;
  rig.style.transform = `perspective(2200px) rotateX(${geo.rotateX}deg) rotateY(${geo.rotateY}deg) rotate(${geo.rotate}deg)`;

  const radii = config.card.radius || [4, 4, 4, 4];
  const card = el("div", {
    class: "card",
    width: `${config.card.w}px`,
    height: `${config.card.h}px`,
    background: config.substrate.tone,
    "border-radius": `${radii[0]}px ${radii[1]}px ${radii[2]}px ${radii[3]}px`,
  }, rig);

  buildGrain(card, config.seed);
  buildDustAndFibres(card, config.seed, config.card.w, config.card.h);

  const formLayer = el("div", { class: "form-layer" }, card);
  const dataLayer = el("div", { class: "data-layer" }, card);
  dataLayer.style.transform = `translate(1.6px, -1.1px) rotate(${config.dataSkew ?? 0.4}deg)`;
  dataLayer.style.opacity = "0.88";
  dataLayer.style.filter = `hue-rotate(${config.dataHue ?? 6}deg) saturate(1.05)`;

  // Header
  if (config.header) {
    const h = config.header;
    const hb = el("div", { class: "header-block", top: `${h.top}px`, left: `${h.left}px`, width: `${h.width}px` }, formLayer);
    el("div", { class: "header-authority", "font-size": "9px", "margin-bottom": "3px", text: h.authority }, hb);
    el("div", { class: "header-title", "font-size": "20px", "margin-bottom": "2px", text: h.title }, hb);
    el("div", { class: "header-legal", "font-size": "9px", text: h.legal }, hb);
  }

  if (config.guilloche) buildGuilloche(formLayer, config.seed, config.guilloche);
  if (config.microtextTop) buildMicrotext(formLayer, config.microtextLabel, config.microtextTop);
  if (config.microtextBottom) buildMicrotext(formLayer, config.microtextLabel, config.microtextBottom);
  if (config.watermark) buildGhostWatermark(formLayer, config.watermark.text, config.watermark);
  if (config.seal) buildSeal(formLayer, config.seal.rim, config.seal.center, config.seal);
  if (config.qr) buildQr(formLayer, config.seed, config.qr);
  if (config.photo) {
    const p = config.photo;
    const box = el("div", {
      class: "photo-box", top: `${p.top}px`, left: `${p.left}px`, width: `${p.w}px`, height: `${p.h}px`,
      html: '<svg viewBox="0 0 100 120"><circle cx="50" cy="42" r="22" fill="#a39a86"/><path d="M10 118 C10 85 30 68 50 68 C70 68 90 85 90 118 Z" fill="#a39a86"/></svg>',
    }, formLayer);
    void box;
  }
  if (config.rules) {
    for (const r of config.rules) {
      el("div", { class: "hair-rule", top: `${r.top}px`, left: `${r.left}px`, width: `${r.width}px`, height: "1px" }, formLayer);
    }
  }
  if (config.notes) {
    for (const n of config.notes) {
      el("div", {
        class: "header-legal", position: "absolute", top: `${n.top}px`, left: `${n.left}px`, width: `${n.width}px`,
        "font-size": `${n.size ?? 9}px`, "line-height": "1.5", "white-space": "normal", text: n.text,
      }, formLayer);
    }
  }
  if (config.stamp) {
    const s = config.stamp;
    el("div", {
      class: "stamp", top: `${s.top}px`, left: `${s.left}px`, width: `${s.w}px`,
      "font-size": `${s.size}px`, transform: `rotate(${s.angle}deg)`, border: "2px solid #4b3b73",
      "border-radius": "6px", padding: "6px 10px", "text-align": "center", "line-height": "1.3",
      html: s.lines.map((l) => `<div>${l}</div>`).join(""),
    }, formLayer);
  }

  // Field labels (form layer) + values (data layer)
  for (const f of config.fields) {
    el("div", {
      class: "label", top: `${f.top}px`, left: `${f.left}px`, "font-size": `${f.labelSize ?? 8.5}px`, text: f.label,
    }, formLayer);
    const v = el("div", {
      class: "value", top: `${f.top + (f.dy ?? 12)}px`, left: `${f.left}px`, "font-size": `${f.size ?? 14}px`, text: f.value,
    }, dataLayer);
    v.setAttribute("data-field-key", f.key);
  }

  buildFold(card, config.card.w, config.card.h, config.fold);

  el("div", {
    class: "lighting-overlay",
    background: "linear-gradient(115deg, rgba(255,255,255,0.14), transparent 55%, rgba(0,0,0,0.10))",
  }, card);
  el("div", {
    class: "vignette",
    background: "radial-gradient(circle at 50% 50%, transparent 55%, rgba(0,0,0,0.12) 100%)",
  }, card);

  if (config.laminated) {
    buildHologramBand(card, config.card.w, config.card.h);
    buildSpecularSheen(card, config.card.w, config.card.h);
  }

  buildSpecimen(card, config.card.w, config.card.h);

  // Report field boxes as percentages of the full canvas for mockData.ts.
  const stageRect = stage.getBoundingClientRect();
  const boxes = {};
  for (const node of dataLayer.querySelectorAll("[data-field-key]")) {
    const r = node.getBoundingClientRect();
    boxes[node.getAttribute("data-field-key")] = {
      x: Number((((r.left - stageRect.left) / config.canvas.w) * 100).toFixed(1)),
      y: Number((((r.top - stageRect.top) / config.canvas.h) * 100).toFixed(1)),
      w: Number(((r.width / config.canvas.w) * 100).toFixed(1)),
      h: Number(((r.height / config.canvas.h) * 100).toFixed(1)),
    };
  }
  window.__FIELD_BOXES = boxes;

  document.fonts.ready.then(() => {
    window.__DOC_READY = true;
  });
}
