import { useEffect, useRef, useState } from 'react';
import { timeline, formatarData } from '../data';
import { capasVideos } from '../midia';
import { EVENTO_NAVEGAR, rolarPara, type Destino } from '../navegacao';
import { Fontes, PlayerYouTube, Secao } from './comum';
import Foto from './Foto';

const TITULOS: Record<string, string> = {
  rz1B4B2yBZY: 'Trailer de lançamento',
  tJbzMqJGH4k: 'An Extended Look',
  VQRLujxTm3c: 'Trailer 2',
  'QdBZY2fkU-0': 'Trailer 1',
};

// do mais recente para o mais antigo, como no site oficial
const videos = timeline.filter((e) => e.video).slice().reverse();

function Play() {
  return (
    <svg viewBox="0 0 48 48" width="48" height="48" aria-hidden="true">
      <circle cx="24" cy="24" r="23" fill="rgba(255,255,255,.88)" />
      <path d="M19 15 L34 24 L19 33 Z" fill="#1b1530" />
    </svg>
  );
}

export default function Videos() {
  const [atual, setAtual] = useState(videos[0].video!);
  const [tocando, setTocando] = useState(false);
  const palcoRef = useRef<HTMLDivElement>(null);
  const v = videos.find((x) => x.video === atual)!;

  useEffect(() => {
    const ouvir = (e: Event) => {
      const d = (e as CustomEvent<Destino>).detail;
      if (d.secao !== 'videos') return;
      if (d.alvo) {
        setAtual(d.alvo);
        setTocando(false);
      }
      setTimeout(() => rolarPara('videos-palco'), 60);
    };
    window.addEventListener(EVENTO_NAVEGAR, ouvir);
    return () => window.removeEventListener(EVENTO_NAVEGAR, ouvir);
  }, []);

  const escolher = (id: string) => {
    setAtual(id);
    setTocando(true);
    setTimeout(() => palcoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 40);
  };

  return (
    <Secao id="videos" rotulo="Assista" titulo="Trailers e vídeos" subtitulo="Os quatro vídeos oficiais, tocados pelo player do YouTube só quando você clica.">
      <div className="palco" id="videos-palco" ref={palcoRef} tabIndex={-1}>
        {tocando ? (
          <PlayerYouTube id={v.video!} titulo={v.titulo} />
        ) : (
          <button type="button" className="palco-capa" onClick={() => setTocando(true)}>
            <Foto chave={capasVideos[v.video!]} sizes="(max-width: 1100px) 100vw, 1100px" decorativa />
            <span className="palco-texto">
              <span className="palco-rotulo">Assistir</span>
              <span className="palco-titulo">{TITULOS[v.video!] ?? v.titulo}</span>
              <span className="palco-data">{formatarData(v.data, true)}{v.duracao ? ` · ${v.duracao}` : ''}</span>
            </span>
            <span className="palco-play"><Play /><span className="sr-only">Tocar {v.titulo} (player oficial do YouTube)</span></span>
          </button>
        )}
      </div>
      <div className="palco-info">
        <p>{v.descricao}</p>
        <Fontes urls={v.fontes} />
      </div>

      <ul className="cartoes-video">
        {videos.map((x) => (
          <li key={x.video}>
            <button
              type="button"
              className={`cartao-video ${x.video === atual ? 'ativo' : ''}`}
              aria-pressed={x.video === atual}
              onClick={() => escolher(x.video!)}
            >
              <Foto chave={capasVideos[x.video!]} sizes="(max-width: 700px) 50vw, 280px" credito={false} decorativa />
              <span className="cartao-video-play"><Play /></span>
              <span className="cartao-video-rotulo">Assistir</span>
              <span className="cartao-video-titulo">{TITULOS[x.video!] ?? x.titulo}</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="credito-linha">Capas: capturas oficiais · Rockstar Games</p>
    </Secao>
  );
}
