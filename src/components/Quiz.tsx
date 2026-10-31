import { useRef, useState } from 'react';
import { quiz } from '../data';
import { Fontes, Secao } from './comum';

const TOTAL = 10;

function embaralhar<T>(lista: T[]): T[] {
  const a = [...lista];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Quiz() {
  const sortear = () => embaralhar(quiz).slice(0, Math.min(TOTAL, quiz.length));
  const [rodada, setRodada] = useState(0);
  const [perguntas, setPerguntas] = useState(sortear);
  const [indice, setIndice] = useState(0);
  const [escolha, setEscolha] = useState<number | null>(null);
  const [acertos, setAcertos] = useState(0);
  const tituloRef = useRef<HTMLHeadingElement>(null);

  const fim = indice >= perguntas.length;
  const p = perguntas[indice];

  const responder = (i: number) => {
    if (escolha !== null) return;
    setEscolha(i);
    if (i === p.correta) setAcertos((a) => a + 1);
  };

  const proxima = () => {
    setEscolha(null);
    setIndice((x) => x + 1);
    setTimeout(() => tituloRef.current?.focus(), 30);
  };

  const reiniciar = () => {
    setRodada((r) => r + 1);
    setPerguntas(sortear());
    setIndice(0);
    setEscolha(null);
    setAcertos(0);
    setTimeout(() => tituloRef.current?.focus(), 30);
  };

  const mensagem = (n: number, t: number) =>
    n === t ? 'Gabaritou! Cidadão honorário de Leonida. 🌴' :
    n >= t * 0.7 ? 'Mandou bem, você acompanha de perto.' :
    n >= t * 0.4 ? 'Nada mal. Dá uma passada na linha do tempo e tenta de novo.' :
    'Hora de revisar o guia e tentar outra vez!';

  return (
    <Secao
      id="quiz"
      numero="10"
      titulo="Quiz: quanto você sabe de GTA VI?"
      subtitulo={`${TOTAL} perguntas sorteadas, só com informações confirmadas oficialmente.`}
    >
      <div className="quiz-caixa">
        <div className="quiz-progresso" aria-hidden="true">
          <span style={{ width: `${(Math.min(indice, perguntas.length) / perguntas.length) * 100}%` }} />
        </div>
        {fim ? (
          <div className="quiz-fim" role="status">
            <h3 ref={tituloRef} tabIndex={-1} className="quiz-pergunta">Resultado: {acertos} de {perguntas.length}</h3>
            <p className="quiz-placar">{mensagem(acertos, perguntas.length)}</p>
            <button type="button" className="botao botao-primario" onClick={reiniciar}>Jogar de novo</button>
          </div>
        ) : (
          <div key={`${rodada}-${indice}`} className="quiz-cartao">
            <p className="quiz-contador">Pergunta {indice + 1} de {perguntas.length} · {acertos} acerto(s)</p>
            <h3 ref={tituloRef} tabIndex={-1} className="quiz-pergunta">{p.pergunta}</h3>
            <ul className="quiz-opcoes">
              {p.opcoes.map((o, i) => {
                let classe = '';
                if (escolha !== null) {
                  if (i === p.correta) classe = 'certa';
                  else if (i === escolha) classe = 'errada';
                }
                return (
                  <li key={o}>
                    <button type="button" className={`quiz-opcao ${classe}`} onClick={() => responder(i)} disabled={escolha !== null}>
                      <span className="quiz-letra" aria-hidden="true">{String.fromCharCode(65 + i)}</span>
                      {o}
                      {classe === 'certa' && <span className="sr-only"> (resposta correta)</span>}
                      {classe === 'errada' && <span className="sr-only"> (sua resposta, incorreta)</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
            {escolha !== null && (
              <div className={`quiz-feedback ${escolha === p.correta ? 'ok' : 'erro'}`} role="status">
                <strong>{escolha === p.correta ? 'Acertou!' : 'Não foi dessa vez.'}</strong> {p.explicacao}
                <Fontes urls={p.fontes} rotulo="Fonte" />
                <button type="button" className="botao botao-primario" onClick={proxima}>
                  {indice + 1 < perguntas.length ? 'Próxima pergunta →' : 'Ver resultado'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </Secao>
  );
}
