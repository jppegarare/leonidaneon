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
import Videos from './components/Videos';
import Busca from './components/Busca';
import PaginaFontes from './components/PaginaFontes';
import { STATUS_INFO, formatarData, type Status } from './data';
import { StatusBadge } from './components/comum';

const AVISO = 'Site de fã, não oficial. Não afiliado à Rockstar Games ou à Take-Two Interactive.';

const NAV = [
  ['contagem', 'Contagem'],
  ['videos', 'Trailers'],
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
  const [rolou, setRolou] = useState(false);

  useEffect(() => {
    const f = () => setRolou(window.scrollY > 40);
    f();
    window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);

  // Esc fecha o menu
  useEffect(() => {
    if (!menuAberto) return;
    const f = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuAberto(false); };
    window.addEventListener('keydown', f);
    return () => window.removeEventListener('keydown', f);
  }, [menuAberto]);

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
        <svg className="faixa-palmeiras" viewBox="0 0 1200 40" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
          {[40, 160, 300, 880, 1010, 1130].map((x, i) => (
            <g key={x} transform={`translate(${x} 40) scale(${i % 2 ? 0.55 : 0.7})`} fill="currentColor">
              <path d="M-2 0 C0 -22 3 -40 8 -58 L11 -57 C7 -40 4 -22 4 0 Z" />
              <path d="M9 -58 C-6 -66 -22 -62 -32 -52 C-18 -58 -4 -58 9 -54 Z" />
              <path d="M9 -58 C22 -68 38 -66 50 -56 C36 -60 22 -60 9 -54 Z" />
              <path d="M9 -58 C-12 -54 -24 -42 -28 -28 C-18 -40 -6 -48 10 -54 Z" />
              <path d="M9 -58 C28 -54 40 -42 42 -28 C32 -40 22 -48 8 -54 Z" />
            </g>
          ))}
        </svg>
        <span className="faixa-texto">{AVISO}</span>
      </div>

      <header className={`topo ${rolou || menuAberto || rota === 'fontes' ? 'topo-solido' : ''}`}>
        <a href="#inicio" className="marca" aria-label="Leonida Neon, início" onClick={() => setMenuAberto(false)}>
          <svg className="marca-sol" viewBox="0 0 40 40" width="34" height="34" aria-hidden="true">
            <defs>
              <linearGradient id="marcaSol" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#ffd59e" /><stop offset="1" stopColor="#ff8f7a" />
              </linearGradient>
              <clipPath id="marcaClip"><circle cx="20" cy="20" r="15" /></clipPath>
            </defs>
            <g clipPath="url(#marcaClip)">
              <rect x="5" y="5" width="30" height="30" fill="url(#marcaSol)" />
              <rect x="5" y="23" width="30" height="2" fill="#1a1330" />
              <rect x="5" y="27.5" width="30" height="2.6" fill="#1a1330" />
              <rect x="5" y="32" width="30" height="3" fill="#1a1330" />
            </g>
          </svg>
          <span className="marca-textos">
            <span className="marca-nome">Leonida <em>Neon</em></span>
            <span className="marca-sub">guia de fã de GTA VI</span>
          </span>
        </a>

        <div className="topo-acoes">
          <a href="#videos" className="botao botao-contorno botao-pequeno topo-cta" onClick={() => setMenuAberto(false)}>Ver trailers</a>
          <button type="button" className="botao-icone" onClick={() => setBuscaAberta(true)} aria-haspopup="dialog" aria-label="Buscar no site (atalho: /)">
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" strokeWidth="2.2" /><path d="M15 15 L21 21" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
          </button>
          <button
            type="button"
            className={`botao-icone botao-menu ${menuAberto ? 'aberto' : ''}`}
            aria-expanded={menuAberto}
            aria-controls="menu-principal"
            onClick={() => setMenuAberto((m) => !m)}
          >
            <span className="sr-only">{menuAberto ? 'Fechar menu' : 'Abrir menu'}</span>
            <span className="hamburguer" aria-hidden="true"><i /><i /><i /></span>
          </button>
        </div>

      </header>

      <nav id="menu-principal" className={`menu-tela ${menuAberto ? 'aberto' : ''}`} aria-label="Seções" hidden={!menuAberto}>
        <ul>
          {NAV.map(([id, rotulo]) => (
            <li key={id}><a href={`#${id}`} onClick={() => setMenuAberto(false)}>{rotulo}</a></li>
          ))}
          <li><a href="#/fontes" onClick={() => setMenuAberto(false)} aria-current={rota === 'fontes' ? 'page' : undefined}>Fontes</a></li>
        </ul>
        <p className="menu-aviso">{AVISO}</p>
      </nav>

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
            <Videos />
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
          Grand Theft Auto, GTA, Rockstar Games e Take-Two Interactive são marcas dos respectivos donos. As capturas de tela são
          imagens oficiais distribuídas pela Rockstar Games na <a href="https://www.rockstargames.com/VI/media" target="_blank" rel="noopener noreferrer">página de mídia do GTA VI</a>,
          usadas com crédito. Logotipos e fontes oficiais não são usados. Vídeos oficiais aparecem apenas pelo player do YouTube.
        </p>
        <p>
          Informações atualizadas até {formatarData('2026-10-31', true)}. Veja a página de <a href="#/fontes">Fontes e metodologia</a>.
          Fontes tipográficas livres: Fraunces e Outfit (SIL Open Font License).
        </p>
      </footer>

      <Busca aberta={buscaAberta} fechar={() => setBuscaAberta(false)} />
    </>
  );
}
