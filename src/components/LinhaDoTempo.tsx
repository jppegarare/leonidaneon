import { useEffect, useMemo, useState } from 'react';
import { timeline, formatarData, type EventoTimeline } from '../data';
import { Fontes, Notas, Secao, StatusBadge, VideoOficial } from './comum';
import { EVENTO_NAVEGAR, rolarPara, useRevelar, type Destino } from '../navegacao';

const TIPOS: Record<string, { rotulo: string; icone: string }> = {
  anuncio: { rotulo: 'Anúncio', icone: '📣' },
  trailer: { rotulo: 'Trailer/vídeo', icone: '🎬' },
  adiamento: { rotulo: 'Adiamento', icone: '⏳' },
  marketing: { rotulo: 'Marketing', icone: '🌴' },
  musica: { rotulo: 'Música', icone: '🎧' },
  negocios: { rotulo: 'Take-Two/negócios', icone: '📈' },
  entrevista: { rotulo: 'Entrevista', icone: '🎙️' },
  vazamento: { rotulo: 'Vazamento', icone: '🔓' },
  lancamento: { rotulo: 'Lançamento', icone: '🚀' },
};

function Evento({ e, lado }: { e: EventoTimeline; lado: 'esq' | 'dir' }) {
  const ref = useRevelar<HTMLLIElement>();
  const t = TIPOS[e.tipo] ?? { rotulo: e.tipo, icone: '•' };
  return (
    <li ref={ref} id={`tl-${e.id}`} className={`evento revelar evento-${lado} evento-${e.tipo} ${e.futuro ? 'evento-futuro' : ''}`}>
      <span className="evento-ponto" aria-hidden="true">{t.icone}</span>
      <article className="evento-cartao">
        <header>
          <time dateTime={e.data} className="evento-data">{formatarData(e.data, true)}</time>
          <span className="evento-tipo">{t.rotulo}{e.futuro ? ' · previsto' : ''}</span>
        </header>
        <h3>{e.titulo}</h3>
        <p>{e.descricao}</p>
        {e.duracao && <p className="evento-duracao">Duração oficial: {e.duracao}</p>}
        {e.video && <VideoOficial id={e.video} titulo={e.titulo} />}
        {e.link && !e.video && (
          <a className="link-oficial" href={e.link} target="_blank" rel="noopener noreferrer">Ver vídeo oficial no YouTube ↗</a>
        )}
        {e.extras && <Notas itens={e.extras} />}
        <footer>
          <StatusBadge status={e.status} />
          <Fontes urls={e.fontes} />
        </footer>
      </article>
    </li>
  );
}

export default function LinhaDoTempo() {
  const [filtro, setFiltro] = useState<string>('todos');
  const tiposPresentes = useMemo(() => Array.from(new Set(timeline.map((e) => e.tipo))), []);
  const lista = timeline.filter((e) => filtro === 'todos' || e.tipo === filtro);

  useEffect(() => {
    const ouvir = (ev: Event) => {
      const d = (ev as CustomEvent<Destino>).detail;
      if (d.secao !== 'linha-do-tempo' || !d.alvo) return;
      setFiltro('todos');
      setTimeout(() => {
        document.getElementById(d.alvo!)?.classList.add('visivel');
        rolarPara(d.alvo!);
      }, 60);
    };
    window.addEventListener(EVENTO_NAVEGAR, ouvir);
    return () => window.removeEventListener(EVENTO_NAVEGAR, ouvir);
  }, []);

  return (
    <Secao
      id="linha-do-tempo"
      numero="05"
      titulo="Linha do tempo"
      subtitulo="Revelações, trailers e adiamentos de 2022 até o lançamento. Os vídeos usam o player oficial do YouTube."
    >
      <div className="filtros" role="group" aria-label="Filtrar eventos por tipo">
        <button type="button" className={`chip ${filtro === 'todos' ? 'chip-ativo' : ''}`} aria-pressed={filtro === 'todos'} onClick={() => setFiltro('todos')}>
          Todos ({timeline.length})
        </button>
        {tiposPresentes.map((t) => (
          <button key={t} type="button" className={`chip ${filtro === t ? 'chip-ativo' : ''}`} aria-pressed={filtro === t} onClick={() => setFiltro(t)}>
            {TIPOS[t]?.icone} {TIPOS[t]?.rotulo ?? t}
          </button>
        ))}
      </div>
      <ol className="linha" key={filtro}>
        {lista.map((e, i) => <Evento key={e.id} e={e} lado={i % 2 === 0 ? 'esq' : 'dir'} />)}
      </ol>
    </Secao>
  );
}
