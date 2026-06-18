// =============================================================
// HeroChart — pure-SVG cinematic candlestick + growth line
// Matches the gold/silver of the logo. No external libs.
// FUTURE ADDITION: swap mock candles for live price feed (e.g. Binance WS).
// =============================================================
const candles = [
  { o: 60, c: 75, h: 80, l: 55 },
  { o: 75, c: 70, h: 82, l: 65 },
  { o: 70, c: 90, h: 95, l: 68 },
  { o: 90, c: 85, h: 96, l: 80 },
  { o: 85, c: 110, h: 115, l: 82 },
  { o: 110, c: 100, h: 118, l: 95 },
  { o: 100, c: 130, h: 138, l: 98 },
  { o: 130, c: 125, h: 140, l: 120 },
  { o: 125, c: 160, h: 168, l: 122 },
  { o: 160, c: 155, h: 170, l: 150 },
  { o: 155, c: 195, h: 205, l: 152 },
  { o: 195, c: 185, h: 210, l: 180 },
  { o: 185, c: 230, h: 240, l: 182 },
];

const HeroChart = () => {
  const W = 640;
  const H = 320;
  const padX = 30;
  const padY = 30;
  const step = (W - padX * 2) / candles.length;
  const maxV = 260;

  const y = (v: number) => H - padY - (v / maxV) * (H - padY * 2);

  // Path that traces the closing prices (the rising "gold arrow")
  const linePath = candles
    .map((c, i) => `${i === 0 ? "M" : "L"} ${padX + i * step + step / 2} ${y(c.c)}`)
    .join(" ");

  return (
    <div
      className="relative rounded-2xl p-[1px]"
      style={{ backgroundImage: "linear-gradient(135deg,#d4af37,#9ca3af,#f3e5ab,#d4af37)" }}
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#0f141c] to-[#0d1117] p-4">
        {/* Glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-10 opacity-60"
          style={{
            background:
              "radial-gradient(400px 200px at 80% 20%, rgba(212,175,55,0.18), transparent 60%), radial-gradient(300px 200px at 20% 80%, rgba(156,163,175,0.12), transparent 60%)",
          }}
        />
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-gray-400">BTC / USDT</div>
            <div className="bg-gradient-to-r from-[#f3e5ab] to-[#d4af37] bg-clip-text text-xl font-bold text-transparent">
              $108,420.55
            </div>
          </div>
          <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-emerald-300">
            ▲ 24.6%
          </div>
        </div>

        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full">
          <defs>
            <linearGradient id="line" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#9ca3af" />
              <stop offset="60%" stopColor="#d4af37" />
              <stop offset="100%" stopColor="#f3e5ab" />
            </linearGradient>
            <linearGradient id="fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#d4af37" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid */}
          {[0, 1, 2, 3].map((i) => (
            <line
              key={i}
              x1={padX}
              x2={W - padX}
              y1={padY + i * ((H - padY * 2) / 3)}
              y2={padY + i * ((H - padY * 2) / 3)}
              stroke="#ffffff"
              strokeOpacity="0.04"
            />
          ))}

          {/* Candles */}
          {candles.map((c, i) => {
            const cx = padX + i * step + step / 2;
            const up = c.c >= c.o;
            const color = up ? "#d4af37" : "#9ca3af";
            return (
              <g key={i}>
                <line x1={cx} x2={cx} y1={y(c.h)} y2={y(c.l)} stroke={color} strokeOpacity="0.7" />
                <rect
                  x={cx - step * 0.3}
                  width={step * 0.6}
                  y={y(Math.max(c.o, c.c))}
                  height={Math.max(2, Math.abs(y(c.o) - y(c.c)))}
                  fill={color}
                  fillOpacity={up ? 0.9 : 0.5}
                />
              </g>
            );
          })}

          {/* Fill under the growth line */}
          <path
            d={`${linePath} L ${padX + candles.length * step - step / 2} ${H - padY} L ${padX + step / 2} ${H - padY} Z`}
            fill="url(#fill)"
          />
          {/* Growth line */}
          <path d={linePath} fill="none" stroke="url(#line)" strokeWidth="2.5" strokeLinecap="round" />
          {/* Last point */}
          <circle
            cx={padX + (candles.length - 1) * step + step / 2}
            cy={y(candles[candles.length - 1].c)}
            r="5"
            fill="#f3e5ab"
            stroke="#d4af37"
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  );
};

export default HeroChart;


