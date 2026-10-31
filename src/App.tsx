import { useEffect, useState } from 'react';
import Hero from './components/Hero';
import Contagem from './components/Contagem';
import Essencial from './components/Essencial';
import Mapa from './components/Mapa';
import Personagens from './components/Personagens';
import LinhaDoTempo from './components/LinhaDoTempo';
import Mecanicas from './components/Mecanicas';
import Trilha from './components/Trilha';
import Edicoes from './components/Edicoes';
import ViceCity from './components/ViceCity';
import Quiz from './components/Quiz';
import Busca from './components/Busca';
import PaginaFontes from './components/PaginaFontes';
import { STATUS_INFO, formatarData, type Status } from './data';
import { StatusBadge } from './components/comum';

const AVISO = 'Site de fã, não oficial. Não afiliado à Rockstar Games ou à Take-Two Interactive.';

const NAV = [
  ['contagem', 'Contagem'],
  ['essencial', 'Essencial'],
  ['mapa', 'Mapa'],
  ['personagens', 'Personagens'],
  ['linha-do-tempo', 'Linha do tempo'],
  ['mecanicas', 'Mecânicas'],
  ['trilha', 'Trilha'],
  ['edicoes', 'Edições'],
  ['vice-city', '2002 × VI'],
  ['quiz', 'Quiz'],
] as const;

function useRota() {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const f = () => setHash(window.location.hash);
    window.addEventListener('hashchange', f);
    return () => window.removeEventListener('hashchange', f);
  }, []);
  return hash.startsWith('#/fontes') ? 'fontes' : 'home';
}

export default function App() {
  const rota = useRota();
  const [buscaAberta, setBuscaAberta] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  // Atalhos: "/" ou Ctrl/Cmd+K abrem a busca
  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      const alvo = e.target as HTMLElement;
      const digitando = alvo && (alvo.tagName === 'INPUT' || alvo.tagName === 'TEXTAREA' || alvo.isContentEditable);
      if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !digitando)) {
        e.preventDefault();
        setBuscaAberta(true);
      }
    };
    window.addEventListener('keydown', f);
    return () => window.removeEventListener('keydown', f);
  }, []);

  // Ao trocar de rota, volta ao topo (ou à âncora da home)
  useEffect(() => {
    if (rota === 'fontes') window.scrollTo(0, 0);
    else {
      const id = window.location.hash.slice(1);
      if (id) setTimeout(() => document.getElementById(id)?.scrollIntoView(), 30);
    }
  }, [rota]);

  return (
    <>
      <a href="#conteudo" className="pular-link">Pular para o conteúdo</a>
      <div className="faixa-aviso" role="note">
        <span aria-hidden="true">⚠️</span> {AVISO}
      </div>

      <header className="topo">
        <a href="#inicio" className="marca" aria-label="Leonida Neon, início">
          <svg viewBox="0 0 40 40" width="32" height="32" aria-hidden="true">
            <defs>
              <linearGradient id="marcaSol" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#ffd166" /><stop offset="1" stopColor="#ff4d8d" />
              </linearGradient>
              <clipPath id="marcaClip"><circle cx="20" cy="20" r="14" /></clipPath>
            </defs>
            <g clipPath="url(#marcaClip)">
              <rect x="6" y="6" width="28" height="28" fill="url(#marcaSol)" />
              <rect x="6" y="22" width="28" height="2" fill="#0d0618" />
              <rect x="6" y="26" width="28" height="2.6" fill="#0d0618" />
              <rect x="6" y="30.5" width="28" height="3" fill="#0d0618" />
            </g>
          </svg>
          <span>Leonida <em>Neon</em></span>
        </a>

        <button
          type="button"
          className="botao-menu"
          aria-expanded={menuAberto}
          aria-controls="menu-principal"
          onClick={() => setMenuAberto((m) => !m)}
        >
          <span className="sr-only">Menu</span>
          <span aria-hidden="true">{menuAberto ? '✕' : '☰'}</span>
        </button>

        <nav id="menu-principal" className={`nav ${menuAberto ? 'nav-aberta' : ''}`} aria-label="Seções">
          <ul>
            {NAV.map(([id, rotulo]) => (
              <li key={id}><a href={`#${id}`} onClick={() => setMenuAberto(false)}>{rotulo}</a></li>
            ))}
            <li><a href="#/fontes" onClick={() => setMenuAberto(false)} aria-current={rota === 'fontes' ? 'page' : undefined}>Fontes</a></li>
          </ul>
        </nav>

        <button type="button" className="botao-busca" onClick={() => setBuscaAberta(true)} aria-haspopup="dialog">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M15 15 L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          <span className="botao-busca-texto">Buscar</span>
          <kbd className="atalho">/</kbd>
        </button>
      </header>

      {rota === 'fontes' ? (
        <PaginaFontes />
      ) : (
        <>
          <Hero />
          <main id="conteudo" tabIndex={-1}>
            <div className="legenda-status legenda-topo" aria-label="Legenda de status">
              {(Object.keys(STATUS_INFO) as Status[]).map((s) => (
                <p key={s}><StatusBadge status={s} /> <span>{STATUS_INFO[s].explicacao}</span></p>
              ))}
            </div>
            <Contagem />
            <Essencial />
            <Mapa />
            <Personagens />
            <LinhaDoTempo />
            <Mecanicas />
            <Trilha />
            <Edicoes />
            <ViceCity />
            <Quiz />
          </main>
        </>
      )}

      <footer className="rodape">
        <p className="rodape-aviso"><strong>{AVISO}</strong></p>
        <p>
          Grand Theft Auto, GTA, Rockstar Games e Take-Two Interactive são marcas dos respectivos donos. Este site não usa imagens,
          logotipos nem artes oficiais; toda a arte é original, feita em SVG e CSS. Vídeos oficiais aparecem apenas pelo player do YouTube.
        </p>
        <p>
          Informações atualizadas até {formatarData('2026-10-31', true)}. Veja a página de <a href="#/fontes">Fontes e metodologia</a>.
          Fontes tipográficas livres: Audiowide e Inter (SIL Open Font License).
        </p>
      </footer>

      <Busca aberta={buscaAberta} fechar={() => setBuscaAberta(false)} />
    </>
  );
}
