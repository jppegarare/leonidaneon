import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { avisoMapa, leonida, locaisExtras, regioes, formatarData } from '../data';
import { Fontes, Notas, Secao, StatusBadge } from './comum';
import { EVENTO_NAVEGAR, rolarPara, type Destino } from '../navegacao';

/**
 * Formas desenhadas do zero: um "low-poly" estilizado, sem decalque do mapa oficial.
 * As posições só refletem as inspirações reais citadas pela imprensa (norte → sul).
 */
const FORMAS: Record<string, { d: string; rotulo: [number, number]; cor: string; icone: string }> = {
  'mount-kalaga': {
    d: 'M58 52 L196 30 L338 40 L352 128 L262 146 L176 140 L76 130 Z',
    rotulo: [206, 92], cor: '#34d399', icone: 'montanha',
  },
  'port-gellhorn': {
    d: 'M76 130 L176 140 L164 252 L118 280 L60 214 L52 166 Z',
    rotulo: [112, 200], cor: '#f59e0b', icone: 'porto',
  },
  ambrosia: {
    d: 'M176 140 L262 146 L352 128 L338 252 L276 292 L164 252 Z',
    rotulo: [258, 208], cor: '#a78bfa', icone: 'fabrica',
  },
  grassrivers: {
    d: 'M164 252 L276 292 L268 400 L222 440 L176 408 L144 330 L118 280 Z',
    rotulo: [204, 352], cor: '#84cc16', icone: 'pantano',
  },
  'vice-city': {
    d: 'M276 292 L338 252 L362 336 L344 416 L268 400 Z',
    rotulo: [316, 340], cor: '#ff4d8d', icone: 'predios',
  },
  'leonida-keys': {
    d: 'M262 452 q14 -10 26 0 q-12 12 -26 0 Z M226 470 q14 -8 26 2 q-14 10 -26 -2 Z M188 482 q12 -8 24 1 q-12 9 -24 -1 Z M150 488 q11 -7 22 1 q-11 8 -22 -1 Z M114 490 q10 -6 20 1 q-10 7 -20 -1 Z',
    rotulo: [196, 512], cor: '#22d3ee', icone: 'ilhas',
  },
};

function Icone({ tipo, x, y }: { tipo: string; x: number; y: number }) {
  const t = `translate(${x - 9} ${y - 30})`;
  const comum = { fill: 'none', stroke: '#fff', strokeWidth: 1.6, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const, opacity: 0.85 };
  switch (tipo) {
    case 'montanha':
      return <path transform={t} d="M0 16 L6 6 L10 11 L13 4 L18 16 Z" {...comum} />;
    case 'porto':
      return <path transform={t} d="M2 10 L16 10 L13 15 L5 15 Z M9 10 L9 2 L14 7 L9 7" {...comum} />;
    case 'fabrica':
      return <path transform={t} d="M1 16 L1 8 L6 11 L6 8 L11 11 L11 3 L15 3 L15 16 Z" {...comum} />;
    case 'pantano':
      return <path transform={t} d="M0 12 q4 -4 8 0 q4 4 8 0 M3 16 q3 -3 6 0 q3 3 6 0 M9 10 L9 2 M7 4 L11 4" {...comum} />;
    case 'predios':
      return <path transform={t} d="M1 16 L1 6 L5 6 L5 16 M6 16 L6 1 L11 1 L11 16 M12 16 L12 8 L17 8 L17 16" {...comum} />;
    default:
      return <path transform={t} d="M2 12 q3 -3 6 0 M10 14 q3 -3 6 0 M9 10 L9 4 q3 -2 5 1" {...comum} />;
  }
}

export default function Mapa() {
  const [selecionada, setSelecionada] = useState<string>('vice-city');
  const painelRef = useRef<HTMLDivElement>(null);
  const regiao = regioes.find((r) => r.id === selecionada)!;

  useEffect(() => {
    const ouvir = (e: Event) => {
      const d = (e as CustomEvent<Destino>).detail;
      if (d.secao !== 'mapa') return;
      if (d.regiao) setSelecionada(d.regiao);
      setTimeout(() => rolarPara(d.alvo ?? 'mapa-painel'), 60);
    };
    window.addEventListener(EVENTO_NAVEGAR, ouvir);
    return () => window.removeEventListener(EVENTO_NAVEGAR, ouvir);
  }, []);

  const escolher = (id: string, focarPainel = false) => {
    setSelecionada(id);
    if (focarPainel && window.matchMedia('(max-width: 860px)').matches) {
      setTimeout(() => painelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    }
  };

  const teclado = (e: KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      escolher(id, true);
    }
  };

  return (
    <Secao
      id="mapa"
      numero="03"
      titulo="Mapa interativo de Leonida"
      subtitulo="Toque ou clique numa região para ver o que já foi revelado."
    >
      <p className="aviso-pequeno" role="note">🗺️ {avisoMapa}</p>
      <div className="mapa-layout">
        <div className="mapa-quadro">
          <svg
            viewBox="0 0 420 540"
            className="mapa-svg"
            role="group"
            aria-label="Mapa estilizado de Leonida com seis regiões selecionáveis"
          >
            <defs>
              <pattern id="ondas" width="24" height="12" patternUnits="userSpaceOnUse">
                <path d="M0 8 q6 -6 12 0 t12 0" fill="none" stroke="#22d3ee" strokeOpacity=".14" strokeWidth="1" />
              </pattern>
              <filter id="neon" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="4" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <radialGradient id="solMapa" cx=".5" cy=".5" r=".5">
                <stop offset="0" stopColor="#ffd166" stopOpacity=".55" />
                <stop offset="1" stopColor="#ffd166" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="420" height="540" fill="#0b1030" rx="18" />
            <rect width="420" height="540" fill="url(#ondas)" rx="18" />
            <circle cx="380" cy="470" r="70" fill="url(#solMapa)" />

            {/* rosa dos ventos */}
            <g transform="translate(386 44)" className="rosa-ventos" aria-hidden="true">
              <circle r="16" fill="none" stroke="#22d3ee" strokeOpacity=".5" />
              <path d="M0 -14 L4 0 L0 14 L-4 0 Z" fill="#ff4d8d" />
              <text y="-20" textAnchor="middle" fontSize="10" fill="#e9e3ff">N</text>
            </g>

            {regioes.map((r) => {
              const f = FORMAS[r.id];
              if (!f) return null;
              const ativa = r.id === selecionada;
              return (
                <g
                  key={r.id}
                  className={`regiao ${ativa ? 'regiao-ativa' : ''}`}
                  role="button"
                  tabIndex={0}
                  aria-pressed={ativa}
                  aria-label={`${r.titulo}${ativa ? ' (selecionada)' : ''}`}
                  onClick={() => escolher(r.id, true)}
                  onKeyDown={(e) => teclado(e, r.id)}
                  style={{ ['--cor-regiao' as string]: f.cor }}
                >
                  <path d={f.d} className="regiao-forma" />
                  <Icone tipo={f.icone} x={f.rotulo[0]} y={f.rotulo[1]} />
                  <text x={f.rotulo[0]} y={f.rotulo[1]} textAnchor="middle" className="regiao-rotulo">
                    {r.titulo.replace('Parque Nacional ', '')}
                  </text>
                </g>
              );
            })}
            <text x="24" y="526" fontSize="10" fill="#9b8fc7">Ilustração de fã — fora de escala</text>
          </svg>
          <div className="mapa-botoes" role="group" aria-label="Escolher região">
            {regioes.map((r) => (
              <button
                key={r.id}
                type="button"
                className={`chip ${r.id === selecionada ? 'chip-ativo' : ''}`}
                aria-pressed={r.id === selecionada}
                onClick={() => escolher(r.id, true)}
              >
                {r.titulo.replace('Parque Nacional ', '')}
              </button>
            ))}
          </div>
        </div>

        <div className="mapa-painel" id="mapa-painel" ref={painelRef} aria-live="polite">
          <article key={regiao.id} className="painel-conteudo" id={`loc-${regiao.id}`}>
            <header>
              <h3 style={{ color: FORMAS[regiao.id]?.cor }}>{regiao.titulo}</h3>
              <StatusBadge status={regiao.status} />
            </header>
            <p className="painel-inspiracao">
              Inspiração real: <strong>{regiao.inspiracao}</strong> <StatusBadge status={regiao.inspiracaoStatus} />
            </p>
            <p>{regiao.descricao}</p>
            <ul className="tags">
              {regiao.destaques.map((d) => <li key={d}>{d}</li>)}
            </ul>
            <Notas itens={regiao.pontos} />
            <p className="painel-data">Revelado em {formatarData(regiao.data, true)}</p>
            <Fontes urls={regiao.fontes} />
            <a className="link-oficial" href="https://www.rockstargames.com/VI/only-in-leonida" target="_blank" rel="noopener noreferrer">
              Ver imagens oficiais no site da Rockstar ↗
            </a>
          </article>
        </div>
      </div>

      <div className="grade-extras">
        <article className="cartao-mini" id={`loc-${leonida.id}`}>
          <header><h4>{leonida.titulo}</h4><StatusBadge status={leonida.status} /></header>
          <p>{leonida.descricao}</p>
          <Fontes urls={leonida.fontes} />
        </article>
        {locaisExtras.map((l) => (
          <article className="cartao-mini" key={l.id} id={`loc-${l.id}`}>
            <header><h4>{l.titulo}</h4><StatusBadge status={l.status} /></header>
            <p>{l.descricao}</p>
            <Fontes urls={l.fontes} />
          </article>
        ))}
      </div>
    </Secao>
  );
}
