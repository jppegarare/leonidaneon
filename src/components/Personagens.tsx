import { useEffect, useState } from 'react';
import { personagens, formatarData } from '../data';
import { Fontes, Notas, Secao, StatusBadge } from './comum';
import { EVENTO_NAVEGAR, rolarPara, type Destino } from '../navegacao';

const CORES: Record<string, string> = {
  rosa: '#ff4d8d', ciano: '#22d3ee', roxo: '#a78bfa', amarelo: '#ffd166', laranja: '#ff8a5b', verde: '#34d399',
};

/** Emblema abstrato (iniciais + padrão geométrico); não representa a aparência real dos personagens. */
function Emblema({ nome, cor, indice }: { nome: string; cor: string; indice: number }) {
  const iniciais = nome
    .replace(/\(.*\)/, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('');
  const raios = 6 + (indice % 4) * 2;
  return (
    <svg viewBox="0 0 100 100" className="emblema" aria-hidden="true">
      <defs>
        <linearGradient id={`eg-${indice}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={cor} />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="#140a26" stroke={`url(#eg-${indice})`} strokeWidth="3" />
      <g stroke={cor} strokeOpacity=".35" strokeWidth="1.2">
        {Array.from({ length: raios }).map((_, i) => {
          const a = (i / raios) * Math.PI * 2;
          return <line key={i} x1={50 + Math.cos(a) * 30} y1={50 + Math.sin(a) * 30} x2={50 + Math.cos(a) * 42} y2={50 + Math.sin(a) * 42} />;
        })}
      </g>
      <text x="50" y="58" textAnchor="middle" fontSize="26" fill="#fff" fontFamily="Audiowide, sans-serif">{iniciais}</text>
    </svg>
  );
}

export default function Personagens() {
  const [aberto, setAberto] = useState<string | null>(null);

  useEffect(() => {
    const ouvir = (e: Event) => {
      const d = (e as CustomEvent<Destino>).detail;
      if (d.secao !== 'personagens' || !d.alvo) return;
      setAberto(d.alvo.replace('per-', ''));
      setTimeout(() => rolarPara(d.alvo!), 60);
    };
    window.addEventListener(EVENTO_NAVEGAR, ouvir);
    return () => window.removeEventListener(EVENTO_NAVEGAR, ouvir);
  }, []);

  return (
    <Secao
      id="personagens"
      numero="04"
      titulo="Personagens"
      subtitulo="Os perfis divulgados pela Rockstar, recontados com nossas palavras. Toque num cartão para ver mais."
    >
      <p className="aviso-pequeno" role="note">
        Os emblemas são ilustrações abstratas feitas para este site e não retratam os personagens. Para ver como eles são,{' '}
        <a href="https://www.rockstargames.com/VI/only-in-leonida" target="_blank" rel="noopener noreferrer">visite o site oficial ↗</a>.
      </p>
      <div className="grade-personagens">
        {personagens.map((p, i) => {
          const cor = CORES[p.cor] ?? CORES.rosa;
          const estaAberto = aberto === p.id;
          return (
            <article
              key={p.id}
              id={`per-${p.id}`}
              className={`cartao-personagem ${estaAberto ? 'aberto' : ''}`}
              style={{ ['--cor' as string]: cor, animationDelay: `${i * 60}ms` }}
            >
              <button
                type="button"
                className="personagem-topo"
                aria-expanded={estaAberto}
                aria-controls={`per-det-${p.id}`}
                onClick={() => setAberto(estaAberto ? null : p.id)}
              >
                <Emblema nome={p.titulo} cor={cor} indice={i} />
                <span className="personagem-nome">{p.titulo}</span>
                <span className="personagem-papel">{p.papel}</span>
                <span className="personagem-seta" aria-hidden="true">{estaAberto ? '−' : '+'}</span>
              </button>
              <div className="personagem-corpo">
                <StatusBadge status={p.status} />
                <ul className="tags">
                  {p.destaques.map((d) => <li key={d}>{d}</li>)}
                </ul>
              </div>
              <div id={`per-det-${p.id}`} className="personagem-detalhes" hidden={!estaAberto}>
                <p>{p.descricao}</p>
                <Notas itens={p.detalhes} />
                <p className="painel-data">Perfil revelado em {formatarData(p.data, true)}</p>
                <Fontes urls={p.fontes} />
              </div>
            </article>
          );
        })}
      </div>
    </Secao>
  );
}
