import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { personagens, formatarData } from '../data';
import { fotosPersonagens, imagem } from '../midia';
import { EVENTO_NAVEGAR, rolarPara, type Destino } from '../navegacao';
import { Fontes, Notas, Secao, StatusBadge } from './comum';
import Foto from './Foto';

export default function Personagens() {
  const [atual, setAtual] = useState(personagens[0].id);
  const [foto, setFoto] = useState(0);
  const abasRef = useRef<(HTMLButtonElement | null)[]>([]);
  const p = personagens.find((x) => x.id === atual)!;
  const fotos = fotosPersonagens[p.id] ?? [];

  useEffect(() => {
    const ouvir = (e: Event) => {
      const d = (e as CustomEvent<Destino>).detail;
      if (d.secao !== 'personagens' || !d.alvo) return;
      setAtual(d.alvo.replace('per-', ''));
      setFoto(0);
      setTimeout(() => rolarPara('personagem-destaque'), 60);
    };
    window.addEventListener(EVENTO_NAVEGAR, ouvir);
    return () => window.removeEventListener(EVENTO_NAVEGAR, ouvir);
  }, []);

  const escolher = (id: string) => {
    setAtual(id);
    setFoto(0);
  };

  // setas do teclado entre as abas (padrão de tablist)
  const teclas = (e: KeyboardEvent, i: number) => {
    const n = personagens.length;
    const destino = e.key === 'ArrowRight' ? (i + 1) % n : e.key === 'ArrowLeft' ? (i - 1 + n) % n : -1;
    if (destino < 0) return;
    e.preventDefault();
    escolher(personagens[destino].id);
    abasRef.current[destino]?.focus();
  };

  return (
    <Secao id="personagens" rotulo="Pessoas de Leonida" titulo="Personagens" subtitulo="Os perfis divulgados pela Rockstar, recontados com nossas palavras." larga>
      <div className="seletor-personagens" role="tablist" aria-label="Escolha um personagem">
        {personagens.map((x, i) => {
          const capa = fotosPersonagens[x.id]?.[0];
          return (
            <button
              key={x.id}
              ref={(el) => { abasRef.current[i] = el; }}
              role="tab"
              type="button"
              id={`aba-${x.id}`}
              aria-selected={x.id === atual}
              aria-controls="personagem-destaque"
              tabIndex={x.id === atual ? 0 : -1}
              className={`aba-personagem ${x.id === atual ? 'ativa' : ''}`}
              onClick={() => escolher(x.id)}
              onKeyDown={(e) => teclas(e, i)}
            >
              {capa && <img src={imagem(capa).pequena} alt="" loading="lazy" decoding="async" />}
              <span>{x.titulo.replace(/ \(.*\)/, '')}</span>
            </button>
          );
        })}
      </div>

      <article
        key={p.id}
        id="personagem-destaque"
        role="tabpanel"
        aria-labelledby={`aba-${p.id}`}
        className="personagem-destaque"
        tabIndex={-1}
      >
        <div className="personagem-texto" id={`per-${p.id}`}>
          <h3 className="personagem-nome">{p.titulo}</h3>
          <p className="personagem-papel">{p.papel}</p>
          <p className="personagem-descricao">{p.descricao}</p>
          <ul className="tags">
            {p.destaques.map((d) => <li key={d}>{d}</li>)}
          </ul>
          <Notas itens={p.detalhes} />
          <p className="painel-data">
            <StatusBadge status={p.status} /> Perfil revelado em {formatarData(p.data, true)}
          </p>
          <Fontes urls={p.fontes} />
        </div>

        <div className="personagem-galeria">
          {fotos.length > 0 && (
            <Foto key={fotos[foto]} chave={fotos[foto]} className="galeria-principal" sizes="(max-width: 900px) 100vw, 60vw" />
          )}
          {fotos.length > 1 && (
            <div className="galeria-miniaturas" role="group" aria-label={`Fotos de ${p.titulo}`}>
              {fotos.map((f, i) => (
                <button
                  key={f}
                  type="button"
                  className={`miniatura ${i === foto ? 'ativa' : ''}`}
                  aria-pressed={i === foto}
                  aria-label={`Ver foto ${i + 1}: ${imagem(f).alt}`}
                  onClick={() => setFoto(i)}
                >
                  <img src={imagem(f).pequena} alt="" loading="lazy" decoding="async" />
                </button>
              ))}
            </div>
          )}
        </div>
      </article>
    </Secao>
  );
}
