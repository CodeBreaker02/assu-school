/**
 * Scenes for chapter 01. Like every lesson scene, each one is a pure function
 * of playback progress t ∈ [0, 1] and draws into a 640×360 viewBox.
 */

type SceneProps = { t: number };

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const range = (t: number, from: number, to: number) => clamp((t - from) / (to - from));
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
const easeBack = (x: number) => (x === 0 ? 0 : 1 + 2.7 * Math.pow(x - 1, 3) + 1.7 * Math.pow(x - 1, 2));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

const GOLD = "#e9b44c";
const GOLD_SOFT = "#f6d58e";
const EMBER = "#e2603b";
const MINT = "#6fd39a";
const BLUE = "#9fb6ff";
const CREAM = "#f3ebdd";
const MUTED = "#b3aa9a";
const MONO = "var(--font-geist-mono)";
const DISPLAY = "var(--font-avant-garde)";

function Coin({ x, y, r = 8, opacity = 1 }: { x: number; y: number; r?: number; opacity?: number }) {
  return (
    <g transform={`translate(${x} ${y})`} opacity={opacity}>
      <circle r={r} fill={GOLD} stroke="#b8862b" strokeWidth="1.5" />
      <circle r={r * 0.6} fill="none" stroke={GOLD_SOFT} strokeWidth="1" opacity="0.8" />
    </g>
  );
}

function Cowrie({ x, y, s = 1, opacity = 1 }: { x: number; y: number; s?: number; opacity?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity}>
      <ellipse rx="22" ry="29" fill="#f3e6c8" />
      <ellipse rx="22" ry="29" fill="url(#cowrie-shade)" />
      <path d="M0 -24 C -5 -10, -5 10, 0 24 C 5 10, 5 -10, 0 -24 Z" fill="#2a2216" />
      {[-15, -8, -1, 6, 13].map((ty) => (
        <g key={ty} stroke="#2a2216" strokeWidth="2" strokeLinecap="round">
          <line x1="-8" y1={ty} x2="-4" y2={ty} />
          <line x1="4" y1={ty} x2="8" y2={ty} />
        </g>
      ))}
    </g>
  );
}

function CowrieDefs() {
  return (
    <defs>
      <radialGradient id="cowrie-shade" cx="35%" cy="30%" r="80%">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.5" />
        <stop offset="100%" stopColor={GOLD} stopOpacity="0.55" />
      </radialGradient>
    </defs>
  );
}

function Pill({ x, y, label, color, opacity = 1, scale = 1 }: { x: number; y: number; label: string; color: string; opacity?: number; scale?: number }) {
  const w = label.length * 8.4 + 28;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
      <rect x={-w / 2} y="-16" width={w} height="32" rx="16" fill="rgb(20 17 13 / 0.9)" stroke={color} strokeWidth="1.5" />
      <text y="5" textAnchor="middle" fill={CREAM} fontSize="14" fontFamily={DISPLAY}>
        {label}
      </text>
    </g>
  );
}

/* ───────────── 01 · Everything is connected ───────────── */

const topics = [
  { label: "Budget", color: GOLD },
  { label: "Tontine", color: MINT },
  { label: "Crédit", color: EMBER },
  { label: "Famille", color: "#d9a6ff" },
  { label: "BRVM", color: BLUE },
  { label: "Retraite", color: "#ff9fb0" },
  { label: "Inflation", color: EMBER },
  { label: "Épargne", color: MINT },
];

export function OrbitScene({ t }: SceneProps) {
  const link = range(t, 0.5, 0.7);
  const glow = range(t, 0.55, 0.8);
  return (
    <svg viewBox="0 0 640 360" className="size-full">
      <CowrieDefs />
      <defs>
        <radialGradient id="orbit-glow">
          <stop offset="0%" stopColor={GOLD} stopOpacity="0.45" />
          <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="320" cy="168" rx="230" ry="128" fill="none" stroke="rgb(243 235 221 / 0.1)" strokeDasharray="3 7" />
      <circle cx="320" cy="168" r={60 + glow * 70} fill="url(#orbit-glow)" opacity={glow} />
      {topics.map((tp, i) => {
        const a = (i / topics.length) * Math.PI * 2 + t * 1.1 - Math.PI / 2;
        const x = 320 + Math.cos(a) * 230;
        const y = 168 + Math.sin(a) * 128;
        const show = easeBack(range(t, 0.04 + i * 0.05, 0.14 + i * 0.05));
        return (
          <g key={tp.label}>
            <line x1="320" y1="168" x2={lerp(320, x, link)} y2={lerp(168, y, link)} stroke={tp.color} strokeOpacity="0.55" strokeWidth="1.5" />
            <Pill x={x} y={y} label={tp.label} color={tp.color} opacity={clamp(show)} scale={0.6 + 0.4 * show} />
          </g>
        );
      })}
      <Cowrie x={320} y={168} s={1.2 + glow * 0.25} />
      <g opacity={range(t, 0.72, 0.82)}>
        <text x="320" y="246" textAnchor="middle" fill={CREAM} fontSize="22" fontFamily={DISPLAY}>
          Tout est lié.
        </text>
      </g>
    </svg>
  );
}

/* ───────────── 02 · From cowrie to Mobile Money ───────────── */

const stations = [
  { x: 80, year: "Avant", title: "Cauri" },
  { x: 200, year: "XIXᵉ s.", title: "Pièces" },
  { x: 320, year: "1945", title: "Franc CFA" },
  { x: 440, year: "1994", title: "− 50 %" },
  { x: 560, year: "Auj.", title: "Mobile Money" },
];

function StationIcon({ i, x, k }: { i: number; x: number; k: number }) {
  const y = 150;
  if (i === 0) return <Cowrie x={x} y={y} s={0.9} />;
  if (i === 1)
    return (
      <g>
        <Coin x={x - 12} y={y + 8} r={15} />
        <Coin x={x + 12} y={y - 6} r={15} />
      </g>
    );
  if (i === 2)
    return (
      <g transform={`translate(${x} ${y})`}>
        <rect x="-36" y="-21" width="72" height="42" rx="6" fill="#2f5f4a" stroke={MINT} strokeWidth="1.5" />
        <circle r="11" fill="none" stroke={MINT} strokeWidth="1.5" />
        <text y="4" textAnchor="middle" fill={CREAM} fontSize="10" fontFamily={MONO}>
          CFA
        </text>
      </g>
    );
  if (i === 3) {
    // The note splits in two: the 1994 devaluation.
    const split = easeOut(range(k, 0.3, 1)) * 16;
    return (
      <g transform={`translate(${x} ${y})`}>
        <clipPath id="half-l">
          <rect x="-40" y="-30" width="40" height="60" />
        </clipPath>
        <clipPath id="half-r">
          <rect x="0" y="-30" width="40" height="60" />
        </clipPath>
        {[
          { clip: "half-l", dx: -split, rot: -split / 2, o: 1 },
          { clip: "half-r", dx: split, rot: split / 2, o: 1 - split / 24 },
        ].map((h) => (
          <g key={h.clip} transform={`translate(${h.dx} ${Math.abs(h.dx) * 0.6}) rotate(${h.rot})`} opacity={h.o}>
            <g clipPath={`url(#${h.clip})`}>
              <rect x="-36" y="-21" width="72" height="42" rx="6" fill="#2f5f4a" stroke={MINT} strokeWidth="1.5" />
              <circle r="11" fill="none" stroke={MINT} strokeWidth="1.5" />
            </g>
          </g>
        ))}
      </g>
    );
  }
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-20" y="-32" width="40" height="64" rx="8" fill="#1d1a15" stroke={GOLD} strokeWidth="1.5" />
      <rect x="-14" y="-24" width="28" height="40" rx="3" fill={GOLD} opacity="0.25" />
      {[0, 1, 2].map((w) => (
        <path
          key={w}
          d={`M${-8 - w * 7} ${-44 - w * 6} Q 0 ${-52 - w * 8} ${8 + w * 7} ${-44 - w * 6}`}
          fill="none"
          stroke={GOLD}
          strokeWidth="1.5"
          opacity={clamp(range(k, 0.2 + w * 0.2, 0.5 + w * 0.2))}
        />
      ))}
    </g>
  );
}

export function HistoryScene({ t }: SceneProps) {
  const head = lerp(80, 560, easeOut(range(t, 0.06, 0.9)));
  return (
    <svg viewBox="0 0 640 360" className="size-full">
      <CowrieDefs />
      <line x1="60" x2="580" y1="236" y2="236" stroke="rgb(243 235 221 / 0.15)" strokeWidth="2" />
      <line x1="60" x2={head} y1="236" y2="236" stroke={GOLD} strokeWidth="3" strokeLinecap="round" />
      {stations.map((s, i) => {
        const k = range(head, s.x - 30, s.x + 40);
        const pop = easeBack(range(k, 0, 0.6));
        return (
          <g key={s.title}>
            <circle cx={s.x} cy="236" r={6 + pop * 3} fill={k > 0.3 ? GOLD : "#2a251d"} stroke={GOLD} strokeWidth="1.5" />
            <g opacity={clamp(pop)} transform={`translate(0 ${(1 - clamp(pop)) * 14})`}>
              <StationIcon i={i} x={s.x} k={k} />
              <text x={s.x} y="72" textAnchor="middle" fill={i === 3 ? EMBER : GOLD} fontSize="13" fontFamily={MONO}>
                {s.year}
              </text>
              <text x={s.x} y="272" textAnchor="middle" fill={i === 3 ? EMBER : CREAM} fontSize="16" fontFamily={DISPLAY}>
                {s.title}
              </text>
            </g>
          </g>
        );
      })}
      <circle cx={head} cy="236" r="10" fill={GOLD_SOFT} opacity="0.35" />
    </svg>
  );
}

/* ───────────── 03 · The shrinking basket ───────────── */

const goods = [
  { x: 392, y: 196, c: GOLD },
  { x: 430, y: 188, c: MINT },
  { x: 468, y: 194, c: EMBER },
  { x: 410, y: 160, c: "#d9a6ff" },
  { x: 450, y: 156, c: BLUE },
  { x: 430, y: 128, c: GOLD_SOFT },
];

export function BasketScene({ t }: SceneProps) {
  const years = 5 * easeOut(range(t, 0.18, 0.88));
  const price = 10_000 * Math.pow(1.05, years);
  const affordable = 6 * (10_000 / price);
  return (
    <svg viewBox="0 0 640 360" className="size-full">
      {/* the banknote never changes */}
      <g transform="translate(160 176)">
        <rect x="-92" y="-50" width="184" height="100" rx="10" fill="#2f5f4a" stroke={MINT} strokeWidth="2" />
        <circle r="30" fill="none" stroke={MINT} strokeWidth="1.5" opacity="0.6" />
        <text y="8" textAnchor="middle" fill={CREAM} fontSize="26" fontFamily={DISPLAY}>
          10 000 F
        </text>
        <text y="80" textAnchor="middle" fill={MUTED} fontSize="13" fontFamily={MONO}>
          Votre billet
        </text>
      </g>

      {/* basket + goods that fall out as prices rise */}
      {goods.map((g, i) => {
        const out = clamp(i + 1 - affordable);
        return (
          <g key={i} transform={`translate(${g.x + out * (i % 2 ? 70 : -30)} ${g.y + out * 110}) rotate(${out * 50})`} opacity={1 - out * 0.85}>
            <circle r="19" fill={g.c} opacity="0.9" />
            <circle r="19" fill="none" stroke="rgb(0 0 0 / 0.25)" />
          </g>
        );
      })}
      <path d="M360 200 L500 200 L484 262 L376 262 Z" fill="#3a2d1a" stroke={GOLD} strokeWidth="2" />
      <path d="M380 200 Q430 140 480 200" fill="none" stroke={GOLD} strokeWidth="3" />
      {[388, 412, 436, 460].map((x) => (
        <line key={x} x1={x} x2={x - 4} y1="206" y2="256" stroke={GOLD} strokeOpacity="0.3" />
      ))}

      {/* price tag */}
      <g transform={`translate(520 108) rotate(${-8 + years * 1.5})`}>
        <path d="M-60 -24 L44 -24 L66 0 L44 24 L-60 24 Z" fill={years > 0.2 ? EMBER : CREAM} opacity="0.95" />
        <circle cx="46" cy="0" r="5" fill="#0b0a08" />
        <text x="-8" y="7" textAnchor="middle" fill="#0b0a08" fontSize="19" fontFamily={DISPLAY}>
          {Math.round(price).toLocaleString("fr-FR")} F
        </text>
      </g>
      <text x="430" y="300" textAnchor="middle" fill={MUTED} fontSize="13" fontFamily={MONO}>
        Année {Math.floor(years)} · le panier
      </text>
    </svg>
  );
}

/* ───────────── 04 · Money in, money out ───────────── */

const inflows = [
  { label: "Stock", y: 100 },
  { label: "Terrain", y: 180 },
  { label: "Épargne", y: 260 },
];
const outflows = [
  { label: "Crédit", y: 130 },
  { label: "Dette", y: 230 },
];

export function FlowsScene({ t }: SceneProps) {
  const wallet = easeBack(range(t, 0.02, 0.15));
  const inOn = range(t, 0.18, 0.28);
  const outOn = range(t, 0.42, 0.52);
  const moto = easeOut(range(t, 0.68, 0.86));
  const level = clamp(0.25 + range(t, 0.2, 0.45) * 0.55 - range(t, 0.45, 0.65) * 0.3);
  return (
    <svg viewBox="0 0 640 360" className="size-full">
      {/* sources */}
      {inflows.map((f, i) => (
        <g key={f.label} opacity={inOn}>
          <Pill x={92} y={f.y} label={f.label} color={MINT} />
          <path d={`M150 ${f.y} C 220 ${f.y}, 230 180, 278 180`} fill="none" stroke={MINT} strokeOpacity="0.35" strokeWidth="2" strokeDasharray="4 6" />
          {[0, 1].map((n) => {
            const p = (t * 2.4 + i * 0.3 + n * 0.5) % 1;
            return <Coin key={n} x={lerp(150, 278, p)} y={lerp(f.y, 180, easeOut(p))} r={7} opacity={inOn * (p < 0.9 ? 1 : (1 - p) * 10)} />;
          })}
        </g>
      ))}
      {outflows.map((f, i) => (
        <g key={f.label} opacity={outOn}>
          <Pill x={548} y={f.y} label={f.label} color={EMBER} />
          <path d={`M362 180 C 410 180, 420 ${f.y}, 492 ${f.y}`} fill="none" stroke={EMBER} strokeOpacity="0.35" strokeWidth="2" strokeDasharray="4 6" />
          {[0, 1].map((n) => {
            const p = (t * 2.4 + i * 0.4 + n * 0.5) % 1;
            return <Coin key={n} x={lerp(362, 492, p)} y={lerp(180, f.y, easeOut(p))} r={7} opacity={outOn * (p < 0.9 ? 1 : (1 - p) * 10)} />;
          })}
        </g>
      ))}

      {/* the wallet */}
      <g transform={`translate(320 180) scale(${0.6 + 0.4 * wallet})`} opacity={clamp(wallet)}>
        <clipPath id="wallet-clip">
          <rect x="-46" y="-36" width="92" height="72" rx="14" />
        </clipPath>
        <rect x="-46" y="-36" width="92" height="72" rx="14" fill="#2a2216" stroke={GOLD} strokeWidth="2" />
        <g clipPath="url(#wallet-clip)">
          <rect x="-50" y={36 - 72 * level} width="100" height="80" fill={GOLD} opacity="0.85" />
        </g>
        <rect x="20" y="-10" width="30" height="20" rx="6" fill="#1a1510" stroke={GOLD} strokeWidth="1.5" />
        <text y="62" textAnchor="middle" fill={CREAM} fontSize="15" fontFamily={DISPLAY}>
          Votre poche
        </text>
      </g>

      {/* the same moto switches side */}
      <g opacity={range(t, 0.62, 0.7)} transform={`translate(${lerp(92, 548, moto)} ${lerp(330, 320, moto)})`}>
        <Pill x={0} y={0} label="Moto" color={moto > 0.5 ? EMBER : MINT} />
        <text y="-24" textAnchor="middle" fill={MUTED} fontSize="11" fontFamily={MONO}>
          {moto > 0.5 ? "à crédit, pour se promener" : "taxi-moto"}
        </text>
      </g>
    </svg>
  );
}

/* ───────────── 05 · The personal balance sheet ───────────── */

const owned = [
  { label: "Épargne", h: 26, c: MINT },
  { label: "Moto", h: 52, c: GOLD },
  { label: "Stock", h: 30, c: GOLD_SOFT },
];
const owed = [
  { label: "Prêt", h: 36, c: EMBER },
  { label: "Crédit", h: 18, c: "#f08a6b" },
];

export function BalanceScene({ t }: SceneProps) {
  const left = owned.reduce((n, b, i) => n + b.h * easeOut(range(t, 0.08 + i * 0.08, 0.18 + i * 0.08)), 0);
  const right = owed.reduce((n, b, i) => n + b.h * easeOut(range(t, 0.38 + i * 0.08, 0.48 + i * 0.08)), 0);
  const angle = clamp((right - left) / 108, -1, 1) * 10;
  const result = range(t, 0.66, 0.8);
  const net = Math.round((300_000 * easeOut(range(t, 0.68, 0.9))) / 1000) * 1000;

  const stack = (items: typeof owned, x: number, from: number) => {
    let y = 0;
    return items.map((b, i) => {
      const k = easeOut(range(t, from + i * 0.08, from + 0.1 + i * 0.08));
      const h = b.h * k;
      y += h;
      return (
        <g key={b.label} opacity={k}>
          <rect x={x - 40} y={-y} width="80" height={Math.max(0, h - 2)} rx="4" fill={b.c} />
          {h > 16 && (
            <text x={x} y={-y + h / 2 + 4} textAnchor="middle" fill="#0b0a08" fontSize="11" fontFamily={MONO}>
              {b.label}
            </text>
          )}
        </g>
      );
    });
  };

  return (
    <svg viewBox="0 0 640 360" className="size-full">
      <path d="M320 120 L320 300 M270 306 L370 306" stroke="rgb(243 235 221 / 0.3)" strokeWidth="6" strokeLinecap="round" />
      <g transform={`rotate(${angle} 320 120)`}>
        <rect x="150" y="116" width="340" height="8" rx="4" fill={CREAM} opacity="0.85" />
        <circle cx="320" cy="120" r="9" fill={GOLD} />
        {[
          { x: 180, items: owned, from: 0.08, label: "Ce que je possède", c: MINT },
          { x: 460, items: owed, from: 0.38, label: "Ce que je dois", c: EMBER },
        ].map((pan) => (
          <g key={pan.label} transform={`rotate(${-angle} ${pan.x} 124)`}>
            <line x1={pan.x} y1="124" x2={pan.x - 50} y2="210" stroke="rgb(243 235 221 / 0.25)" strokeWidth="1.5" />
            <line x1={pan.x} y1="124" x2={pan.x + 50} y2="210" stroke="rgb(243 235 221 / 0.25)" strokeWidth="1.5" />
            <path d={`M${pan.x - 62} 210 Q${pan.x} 236 ${pan.x + 62} 210 Z`} fill={pan.c} opacity="0.85" />
            <g transform="translate(0 210)">{stack(pan.items, pan.x, pan.from)}</g>
            <text x={pan.x} y="258" textAnchor="middle" fill={MUTED} fontSize="12" fontFamily={MONO}>
              {pan.label}
            </text>
          </g>
        ))}
      </g>
      <g opacity={result} transform={`translate(320 ${54 - (1 - result) * 10})`}>
        <text textAnchor="middle" fill={MUTED} fontSize="12" fontFamily={MONO} y="-14">
          VALEUR NETTE
        </text>
        <text textAnchor="middle" fill={MINT} fontSize="30" fontFamily={DISPLAY} y="18">
          + {net.toLocaleString("fr-FR")} F
        </text>
      </g>
    </svg>
  );
}
