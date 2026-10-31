import { info, formatarData } from '../data';
import { StatusBadge } from './comum';

/** Arte original: sol listrado, mar, grade neon e palmeiras, tudo em SVG. */
function ArteHorizonte() {
  return (
    <svg className="hero-arte" viewBox="0 0 1200 520" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="ceu" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0d0618" />
          <stop offset=".55" stopColor="#3b0f4f" />
          <stop offset="1" stopColor="#ff4d8d" stopOpacity=".55" />
        </linearGradient>
        <linearGradient id="sol" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe08a" />
          <stop offset=".5" stopColor="#ff8a5b" />
          <stop offset="1" stopColor="#ff2f7d" />
        </linearGradient>
        <linearGradient id="mar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a0b45" />
          <stop offset="1" stopColor="#0d0618" />
        </linearGradient>
        <clipPath id="clipSol">
          <circle cx="600" cy="300" r="170" />
        </clipPath>
        <filter id="brilho" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
      </defs>

      <rect width="1200" height="520" fill="url(#ceu)" />
      {/* estrelas */}
      <g fill="#fff" opacity=".7">
        {[[120, 60], [260, 120], [380, 40], [880, 70], [1010, 140], [1120, 50], [700, 30], [520, 110], [60, 170], [1160, 200]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.8 : 1.1} className="estrela" style={{ animationDelay: `${i * 0.37}s` }} />
        ))}
      </g>

      {/* sol listrado */}
      <circle cx="600" cy="300" r="190" fill="#ff4d8d" opacity=".35" filter="url(#brilho)" />
      <g clipPath="url(#clipSol)">
        <rect x="430" y="130" width="340" height="340" fill="url(#sol)" />
        <g fill="#2a0b45">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect key={i} x="420" y={300 + i * 22} width="360" height={4 + i * 2.2} />
          ))}
        </g>
      </g>

      {/* mar e grade */}
      <rect y="360" width="1200" height="160" fill="url(#mar)" />
      <g stroke="#22d3ee" strokeOpacity=".55" strokeWidth="1.4" className="grade">
        {Array.from({ length: 7 }).map((_, i) => {
          const y = 360 + Math.pow(i + 1, 1.75) * 4.2;
          return <line key={`h${i}`} x1="0" x2="1200" y1={y} y2={y} />;
        })}
        {Array.from({ length: 25 }).map((_, i) => {
          const x = i * 50;
          return <line key={`v${i}`} x1={600 + (x - 600) * 0.08} y1="360" x2={600 + (x - 600) * 2.4} y2="520" />;
        })}
      </g>
      <line x1="0" x2="1200" y1="360" y2="360" stroke="#ff4d8d" strokeWidth="2.5" />

      {/* palmeiras (silhuetas simples) */}
      <Palmeira x={140} escala={1.15} />
      <Palmeira x={250} escala={0.8} espelhar />
      <Palmeira x={1010} escala={1.05} espelhar />
      <Palmeira x={1110} escala={0.75} />
    </svg>
  );
}

function Palmeira({ x, escala, espelhar = false }: { x: number; escala: number; espelhar?: boolean }) {
  const t = `translate(${x} 362) scale(${espelhar ? -escala : escala} ${escala})`;
  return (
    <g transform={t} fill="#0d0618" className="palmeira">
      <path d="M-4 0 C-2 -60 6 -120 18 -180 L24 -178 C12 -120 6 -60 6 0 Z" />
      <g transform="translate(20 -180)">
        <path d="M0 0 C-30 -18 -62 -12 -84 8 C-58 -2 -30 -2 0 6 Z" />
        <path d="M0 0 C26 -22 60 -20 86 -2 C58 -8 30 -6 0 6 Z" />
        <path d="M0 0 C-18 -30 -16 -58 2 -78 C-6 -52 -4 -28 4 -2 Z" />
        <path d="M0 0 C-36 4 -60 26 -70 54 C-50 32 -28 16 2 6 Z" />
        <path d="M0 0 C34 6 56 30 62 58 C44 34 24 18 -2 6 Z" />
      </g>
    </g>
  );
}

export default function Hero() {
  return (
    <div className="hero" id="inicio">
      <ArteHorizonte />
      <div className="hero-conteudo">
        <p className="hero-sobretitulo">Guia de fã · não oficial</p>
        <h1 className="hero-titulo">
          <span className="neon-rosa">Leonida</span> <span className="neon-ciano">Neon</span>
        </h1>
        <p className="hero-texto">
          Tudo o que se sabe sobre <strong>Grand Theft Auto VI</strong> até {formatarData('2026-10-31', true)}, com status e fonte em
          cada informação.
        </p>
        <div className="hero-chips">
          <span className="chip-info">
            <strong>{info.lancamento.valor}</strong> <StatusBadge status={info.lancamento.status} compacto />
          </span>
          <span className="chip-info">{info.plataformas.valor}</span>
        </div>
        <a className="botao botao-primario" href="#contagem">Ver contagem regressiva ↓</a>
      </div>
    </div>
  );
}
