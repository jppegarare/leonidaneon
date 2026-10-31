import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import galeriaJson from '../../data/galeria.json';
import { normalizar } from '../data';
import { EVENTO_NAVEGAR, rolarPara, type Destino } from '../navegacao';
import { Secao } from './comum';

interface ItemGaleria {
  chave: string;
  titulo: string;
  categoria: string;
  grupo: string;
  alt: string;
  video?: string;
}

const itens = galeriaJson.itens as ItemGaleria[];
const categorias = galeriaJson.categorias;
const base = import.meta.env.BASE_URL;
const src = (chave: string, w: 800 | 1600) => `${base}img/oficial/${chave}-${w}.webp`;
const POR_PAGINA = 24;

export default function Galeria() {
  const [categoria, setCategoria] = useState('Tudo');
  const [busca, setBusca] = useState('');
  const [limite, setLimite] = useState(POR_PAGINA);
  const [aberta, setAberta] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const origemRef = useRef<HTMLElement | null>(null);
  const toqueX = useRef<number | null>(null);

  const contagem = useMemo(() => {
    const c: Record<string, number> = { Tudo: itens.length };
    itens.forEach((i) => { c[i.categoria] = (c[i.categoria] ?? 0) + 1; });
    return c;
  }, []);

  const termos = normalizar(busca).split(/\s+/).filter(Boolean);
  const lista = itens.filter((i) => {
    if (categoria !== 'Tudo' && i.categoria !== categoria) return false;
    if (!termos.length) return true;
    const alvo = normalizar(`${i.titulo} ${i.grupo} ${i.alt} ${i.categoria}`);
    return termos.every((t) => alvo.includes(t));
  });
  const visiveis = lista.slice(0, limite);

  useEffect(() => {
    const ouvir = (e: Event) => {
      const d = (e as CustomEvent<Destino>).detail;
      if (d.secao !== 'galeria') return;
      setCategoria(d.alvo ?? 'Tudo');
      setBusca('');
      setLimite(POR_PAGINA);
      setTimeout(() => rolarPara('galeria'), 60);
    };
    window.addEventListener(EVENTO_NAVEGAR, ouvir);
    return () => window.removeEventListener(EVENTO_NAVEGAR, ouvir);
  }, []);

  // abre/fecha o visualizador
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (aberta !== null && !d.open) d.showModal();
    if (aberta === null && d.open) d.close();
  }, [aberta]);

  const abrir = (i: number, el: HTMLElement) => {
    origemRef.current = el;
    setAberta(i);
  };
  const fechar = () => {
    setAberta(null);
    setTimeout(() => origemRef.current?.focus(), 30);
  };
  const passo = (n: number) => setAberta((a) => (a === null ? a : (a + n + lista.length) % lista.length));
  const teclas = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); passo(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); passo(-1); }
  };

  const atual = aberta !== null ? lista[aberta] : null;

  return (
    <Secao
      id="galeria"
      rotulo="Imagens oficiais"
      titulo="Galeria"
      subtitulo={`${itens.length} imagens: todas as capturas e artes da página de mídia da Rockstar, mais quadros escolhidos dos trailers oficiais.`}
      larga
    >
      <div className="painel-filtros">
        <label className="campo-busca">
          <span className="sr-only">Buscar na galeria</span>
          <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18"><circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M15 15 L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          <input type="search" placeholder="Ex.: Lucia, Vice City, Cheetah, praia…" value={busca} onChange={(e) => { setBusca(e.target.value); setLimite(POR_PAGINA); }} />
        </label>
        <div className="filtros filtros-rolagem" role="group" aria-label="Filtrar galeria por categoria">
          {['Tudo', ...categorias].map((c) => (
            <button
              key={c}
              type="button"
              className={`chip ${categoria === c ? 'chip-ativo' : ''}`}
              aria-pressed={categoria === c}
              onClick={() => { setCategoria(c); setLimite(POR_PAGINA); }}
            >
              {c} ({contagem[c] ?? 0})
            </button>
          ))}
        </div>
      </div>
      <p className="resultado-contagem" role="status">{lista.length} imagens</p>

      {lista.length === 0 ? (
        <p className="vazio">Nenhuma imagem encontrada. Tente outro termo.</p>
      ) : (
        <ul className="grade-galeria">
          {visiveis.map((i, n) => (
            <li key={i.chave}>
              <button type="button" className="miniatura-galeria" onClick={(e) => abrir(n, e.currentTarget)} aria-label={`Ampliar: ${i.titulo}`}>
                <img src={src(i.chave, 800)} alt={i.alt} loading="lazy" decoding="async" width={800} height={450} />
                <span className="miniatura-legenda">
                  <span className="miniatura-categoria">{i.categoria}</span>
                  <span className="miniatura-titulo">{i.titulo}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {visiveis.length < lista.length && (
        <div className="galeria-mais">
          <button type="button" className="botao botao-pilula" onClick={() => setLimite((l) => l + POR_PAGINA * 2)}>
            Mostrar mais ({lista.length - visiveis.length} restantes)
          </button>
        </div>
      )}
      <p className="credito-linha">Todas as imagens: Rockstar Games · <a href={galeriaJson.fonte} target="_blank" rel="noopener noreferrer">página de mídia oficial ↗</a></p>

      <dialog ref={dialogRef} className="visualizador" aria-label="Visualizador de imagens" onClose={fechar} onKeyDown={teclas}
        onTouchStart={(e) => { toqueX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (toqueX.current === null) return;
          const dx = e.changedTouches[0].clientX - toqueX.current;
          toqueX.current = null;
          if (Math.abs(dx) > 50) passo(dx < 0 ? 1 : -1);
        }}
        onClick={(e) => { if (e.target === dialogRef.current) fechar(); }}>
        {atual && aberta !== null && (
          <div className="visualizador-caixa">
            <figure className="visualizador-figura">
              <img key={atual.chave} src={src(atual.chave, 1600)} alt={atual.alt} />
              <figcaption>
                <span className="visualizador-categoria">{atual.categoria} · {aberta + 1} de {lista.length}</span>
                <strong className="visualizador-titulo">{atual.titulo}</strong>
                <span className="visualizador-alt">{atual.alt}</span>
                <span className="visualizador-links">
                  <span>Imagem: Rockstar Games</span>
                  {atual.video && <a href={atual.video} target="_blank" rel="noopener noreferrer">Ver este momento no YouTube ↗</a>}
                  <a href={src(atual.chave, 1600)} target="_blank" rel="noopener noreferrer">Abrir imagem ↗</a>
                </span>
              </figcaption>
            </figure>
            <button type="button" className="visualizador-nav anterior" onClick={() => passo(-1)} aria-label="Imagem anterior">‹</button>
            <button type="button" className="visualizador-nav proxima" onClick={() => passo(1)} aria-label="Próxima imagem">›</button>
            <button type="button" className="visualizador-fechar" onClick={fechar} aria-label="Fechar visualizador">✕</button>
          </div>
        )}
      </dialog>
    </Secao>
  );
}
