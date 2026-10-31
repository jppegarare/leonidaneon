import { useState } from 'react';
import { comparativo } from '../data';
import { Fontes, Secao, StatusBadge } from './comum';

export default function ViceCity() {
  const [virados, setVirados] = useState<Set<string>>(new Set());
  const todosVirados = virados.size === comparativo.length;

  const alternar = (id: string) => {
    const n = new Set(virados);
    if (n.has(id)) n.delete(id);
    else n.add(id);
    setVirados(n);
  };

  return (
    <Secao
      id="vice-city"
      rotulo="Então e agora" fundo="vintage-01"
      titulo="Vice City 2002 × GTA VI"
      subtitulo="O que mudou entre o clássico de 2002 e o novo jogo. Toque num cartão para virar a fita."
    >
      <div className="filtros">
        <button
          type="button"
          className="chip chip-ativo"
          onClick={() => setVirados(todosVirados ? new Set() : new Set(comparativo.map((c) => c.id)))}
        >
          {todosVirados ? '⏪ Mostrar tudo em 2002' : '⏩ Mostrar tudo em GTA VI'}
        </button>
      </div>
      <ul className="grade-vc">
        {comparativo.map((c) => {
          const virado = virados.has(c.id);
          return (
            <li key={c.id} id={`vc-${c.id}`} className={`vc-cartao ${virado ? 'virado' : ''}`}>
              <button
                type="button"
                className="vc-botao"
                aria-pressed={virado}
                aria-label={`${c.aspecto}: mostrando ${virado ? 'GTA VI' : 'Vice City de 2002'}. Toque para alternar.`}
                onClick={() => alternar(c.id)}
              >
                <span className="vc-interno">
                  <span className="vc-face vc-frente">
                    <span className="vc-ano">2002</span>
                    <span className="vc-aspecto">{c.aspecto}</span>
                    <span className="vc-texto">{c.classico}</span>
                  </span>
                  <span className="vc-face vc-verso">
                    <span className="vc-ano">VI</span>
                    <span className="vc-aspecto">{c.aspecto}</span>
                    <span className="vc-texto">{c.novo}</span>
                  </span>
                </span>
              </button>
              <div className="vc-rodape">
                <StatusBadge status={c.status} />
                <Fontes urls={c.fontes} />
              </div>
            </li>
          );
        })}
      </ul>
    </Secao>
  );
}
