import { useState, type ReactNode } from 'react';
import { useRevelar } from '../navegacao';
import { STATUS_INFO, fontePorUrl, formatarData, type Status } from '../data';

/* ---------- Selo de status ---------- */

export function StatusBadge({ status, compacto = false }: { status: Status; compacto?: boolean }) {
  const s = STATUS_INFO[status];
  return (
    <span className={`selo selo-${status}`} title={s.explicacao}>
      <span aria-hidden="true" className="selo-icone">{s.icone}</span>
      {compacto ? <span className="sr-only">{s.rotulo}</span> : s.rotulo}
    </span>
  );
}

/* ---------- Links de fonte ---------- */

export function Fontes({ urls, rotulo = 'Fontes' }: { urls: string[]; rotulo?: string }) {
  if (!urls.length) return null;
  return (
    <div className="fontes-lista">
      <span className="fontes-rotulo">{rotulo}:</span>
      <ul>
        {urls.map((u) => {
          const f = fontePorUrl(u);
          return (
            <li key={u}>
              <a href={u} target="_blank" rel="noopener noreferrer" className={f?.tipo === 'oficial' ? 'fonte-oficial' : ''} title={f?.titulo}>
                {f?.veiculo ?? new URL(u).hostname}
                {f?.publicado && f.publicado.length >= 7 && <span className="fonte-data"> · {formatarData(f.publicado)}</span>}
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Lista de notas com status próprio (detalhes, extras, pontos). */
export function Notas({ itens }: { itens: { texto: string; status: Status; fontes: string[] }[] }) {
  if (!itens.length) return null;
  return (
    <ul className="notas">
      {itens.map((n, i) => (
        <li key={i}>
          <StatusBadge status={n.status} />
          <span>{n.texto}</span>
          <Fontes urls={n.fontes} rotulo="Fonte" />
        </li>
      ))}
    </ul>
  );
}

/* ---------- Seção com animação de entrada ---------- */

export function Secao({
  id, titulo, subtitulo, children, numero,
}: { id: string; titulo: string; subtitulo?: ReactNode; children: ReactNode; numero?: string }) {
  const ref = useRevelar<HTMLElement>();
  return (
    <section id={id} className="secao revelar" ref={ref} aria-labelledby={`${id}-titulo`}>
      <header className="secao-cabecalho">
        {numero && <span className="secao-numero" aria-hidden="true">{numero}</span>}
        <h2 id={`${id}-titulo`} className="secao-titulo">{titulo}</h2>
        {subtitulo && <p className="secao-subtitulo">{subtitulo}</p>}
      </header>
      {children}
    </section>
  );
}

/* ---------- Player do YouTube carregado só sob demanda ---------- */

export function VideoOficial({ id, titulo }: { id: string; titulo: string }) {
  const [ativo, setAtivo] = useState(false);
  if (ativo) {
    return (
      <div className="video-quadro">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={`${titulo} — player oficial do YouTube (canal Rockstar Games)`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    );
  }
  return (
    <div className="video-quadro video-capa">
      <button type="button" className="video-play" onClick={() => setAtivo(true)}>
        <svg viewBox="0 0 64 64" aria-hidden="true" width="56" height="56">
          <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeWidth="3" />
          <path d="M26 20 L46 32 L26 44 Z" fill="currentColor" />
        </svg>
        <span>Carregar “{titulo}”</span>
        <small>Player oficial do YouTube (canal Rockstar Games). O vídeo só carrega quando você clica.</small>
      </button>
      <a className="video-link" href={`https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noopener noreferrer">
        Abrir no YouTube ↗
      </a>
    </div>
  );
}
