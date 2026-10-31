import { useState } from 'react';
import { album, avisoTrilha, musicasTrailers, radios, radiosNota, score, formatarData } from '../data';
import { Fontes, Secao, StatusBadge } from './comum';

const CORES: Record<string, string> = {
  rosa: '#ff4d8d', ciano: '#22d3ee', roxo: '#a78bfa', amarelo: '#ffd166', laranja: '#ff8a5b', verde: '#34d399',
};

export default function Trilha() {
  const [estacao, setEstacao] = useState(radios[0].id);
  const r = radios.find((x) => x.id === estacao)!;
  const indice = radios.findIndex((x) => x.id === estacao);
  const cor = CORES[r.cor] ?? CORES.rosa;

  return (
    <Secao
      id="trilha"
      numero="07"
      titulo="Trilha sonora e rádios"
      subtitulo="Estações, apresentadores, artistas e faixas anunciados oficialmente."
    >
      <p className="aviso-pequeno" role="note">🎵 {avisoTrilha} Para ouvir as prévias oficiais, visite a <a href="https://www.rockstargames.com/VI/music" target="_blank" rel="noopener noreferrer">página de música da Rockstar ↗</a>.</p>

      <div className="radio-layout" style={{ ['--cor' as string]: cor }}>
        <div className="radio-aparelho">
          <div className="radio-visor" aria-hidden="true">
            <span className="radio-freq">{(88.1 + indice * 3.7).toFixed(1)} FM</span>
            <div className="radio-escala">
              {radios.map((x, i) => (
                <span key={x.id} className={`radio-marca ${i === indice ? 'ativa' : ''}`} />
              ))}
              <span className="radio-agulha" style={{ left: `${(indice / (radios.length - 1)) * 100}%` }} />
            </div>
            <div className="radio-eq">
              {Array.from({ length: 12 }).map((_, i) => <span key={i} style={{ animationDelay: `${(i * 0.13) % 1}s` }} />)}
            </div>
          </div>
          <div className="radio-sintonia" role="tablist" aria-label="Estações de rádio reveladas">
            {radios.map((x) => (
              <button
                key={x.id}
                role="tab"
                type="button"
                id={`tab-${x.id}`}
                aria-selected={x.id === estacao}
                aria-controls="radio-painel"
                className={`radio-botao ${x.id === estacao ? 'ativo' : ''}`}
                style={{ ['--cor-botao' as string]: CORES[x.cor] }}
                onClick={() => setEstacao(x.id)}
              >
                {x.titulo}
              </button>
            ))}
          </div>
        </div>

        <article id="radio-painel" role="tabpanel" aria-labelledby={`tab-${r.id}`} className="radio-painel">
          <div id={`tr-${r.id}`}>
            <header>
              <h3 style={{ color: cor }}>{r.titulo}</h3>
              <StatusBadge status={r.status} />
            </header>
            <p className="radio-genero">{r.genero}</p>
            <p>{r.descricao}</p>
            <p>
              <strong>Apresentadores no jogo:</strong> {r.apresentadores}
            </p>
            <p className="radio-identidade">
              <strong>Quem são:</strong> {r.identidadeReal} <StatusBadge status={r.identidadeStatus} />
            </p>
            <Fontes urls={r.identidadeFontes} rotulo="Identidade segundo" />
            <h4>Faixas confirmadas na prévia oficial</h4>
            <ol className="faixas">
              {r.faixas.map((f) => (
                <li key={f.faixa}>
                  <span className="faixa-nome">{f.faixa}</span>
                  <span className="faixa-artista">{f.artista}</span>
                </li>
              ))}
            </ol>
            <Fontes urls={r.fontes} />
          </div>
        </article>
      </div>
      <p className="nota-linha">
        <StatusBadge status={radiosNota.status} /> {radiosNota.texto}
      </p>

      <div className="grade-albuns">
        <article className="cartao-album" id={`tr-${album.id}`}>
          <div className="disco" aria-hidden="true"><span /></div>
          <header>
            <h3>{album.titulo}</h3>
            <StatusBadge status={album.status} />
          </header>
          <p>{album.descricao}</p>
          <p className="painel-data">Lançamento: {formatarData(album.data, true)}</p>
          <h4>Singles anunciados</h4>
          <ul className="faixas faixas-compactas">
            {album.singles.map((f) => (
              <li key={f.faixa}><span className="faixa-nome">{f.faixa}</span><span className="faixa-artista">{f.artista}</span></li>
            ))}
          </ul>
          <Fontes urls={album.fontes} />
        </article>

        <article className="cartao-album cartao-score" id={`tr-${score.id}`}>
          <div className="disco disco-score" aria-hidden="true"><span /></div>
          <header>
            <h3>{score.titulo}</h3>
            <StatusBadge status={score.status} />
          </header>
          <p><strong>Compositores:</strong> {score.compositor}</p>
          <p>{score.descricao}</p>
          <p className="painel-data">Lançamento: {formatarData(score.data, true)}</p>
          <h4>Singles</h4>
          <ul className="faixas faixas-compactas">
            {score.singles.map((f) => (
              <li key={f.faixa}><span className="faixa-nome">{f.faixa}</span><span className="faixa-artista">{f.artista}</span></li>
            ))}
          </ul>
          <Fontes urls={score.fontes} />
        </article>
      </div>

      <h3 className="sub-titulo">Músicas dos trailers</h3>
      <ul className="grade-trailers-musica">
        {musicasTrailers.map((m) => (
          <li key={m.id} id={`tr-${m.id}`} className="cartao-mini">
            <header><h4>{m.titulo}</h4><StatusBadge status={m.status} /></header>
            <p><span className="faixa-nome">{m.faixa}</span> — {m.artista}</p>
            <p className="texto-suave">{m.descricao}</p>
            <Fontes urls={m.fontes} />
          </li>
        ))}
      </ul>
    </Secao>
  );
}
