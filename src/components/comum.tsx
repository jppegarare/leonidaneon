import type { ReactNode } from 'react';
import { useRevelar } from '../navegacao';
import Foto from './Foto';
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
  id, titulo, subtitulo, children, rotulo, fundo, larga = false,
}: { id: string; titulo: string; subtitulo?: ReactNode; children: ReactNode; rotulo?: string; fundo?: string; larga?: boolean }) {
  const ref = useRevelar<HTMLElement>();
  return (
    <section id={id} className={`secao revelar ${fundo ? 'secao-com-fundo' : ''} ${larga ? 'secao-larga' : ''}`} ref={ref} aria-labelledby={`${id}-titulo`}>
      {fundo && (
        <div className="secao-fundo" aria-hidden="true">
          <Foto chave={fundo} sizes="100vw" credito={false} decorativa />
        </div>
      )}
      <div className="secao-miolo">
        <header className="secao-cabecalho">
          {rotulo && <p className="secao-rotulo">{rotulo}</p>}
          <h2 id={`${id}-titulo`} className="secao-titulo">{titulo}</h2>
          {subtitulo && <p className="secao-subtitulo">{subtitulo}</p>}
        </header>
        {children}
      </div>
      {fundo && <span className="credito credito-fundo">Imagem de fundo: Rockstar Games</span>}
    </section>
  );
}

/* ---------- Player do YouTube carregado só sob demanda ---------- */

export function PlayerYouTube({ id, titulo }: { id: string; titulo: string }) {
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
