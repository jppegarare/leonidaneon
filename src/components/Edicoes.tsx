import { useState } from 'react';
import { bonus, brl, cotacao, edicoes, formatarData, usd } from '../data';
import { Fontes, Secao, StatusBadge } from './comum';

export default function Edicoes() {
  const [taxa, setTaxa] = useState(cotacao.valorBRL);
  const jogo = edicoes.filter((e) => e.id === 'standard' || e.id === 'ultimate');
  const outros = edicoes.filter((e) => !jogo.includes(e));

  return (
    <Secao
      id="edicoes"
      numero="08"
      titulo="Edições e preços"
      subtitulo="Comparativo das edições, com o preço oficial em reais nas lojas e uma conversão aproximada do valor em dólar."
    >
      <div className="cotacao-caixa" role="note">
        <p>
          <strong>Cotação usada:</strong> US$ 1 = {brl(cotacao.valorBRL)} (PTAX de venda, {formatarData(cotacao.data, true)}).{' '}
          {cotacao.descricao}
        </p>
        <label className="cotacao-ajuste">
          Simular outra cotação (R$ por dólar):
          <input
            type="number"
            min="1"
            max="20"
            step="0.01"
            value={taxa}
            onChange={(e) => setTaxa(Number(e.target.value) || cotacao.valorBRL)}
          />
          {taxa !== cotacao.valorBRL && (
            <button type="button" className="botao-texto" onClick={() => setTaxa(cotacao.valorBRL)}>restaurar</button>
          )}
        </label>
        <Fontes urls={cotacao.fontes} />
      </div>

      <div className="grade-edicoes">
        {jogo.map((e) => (
          <article key={e.id} id={`ed-${e.id}`} className={`cartao-edicao ${e.id === 'ultimate' ? 'edicao-destaque' : ''}`}>
            <header>
              <h3>{e.titulo}</h3>
              <StatusBadge status={e.status} />
            </header>
            <p className="preco-usd">{usd(e.precoUSD)}</p>
            <dl className="precos">
              <div>
                <dt>Preço oficial no Brasil (PS Store / Microsoft Store)</dt>
                <dd>{e.precoBRLOficial != null ? brl(e.precoBRLOficial) : '—'}</dd>
              </div>
              <div>
                <dt>Conversão direta (aproximada)</dt>
                <dd>≈ {brl(e.precoUSD * taxa)}</dd>
              </div>
            </dl>
            <p>{e.descricao}</p>
            <ul className="lista-check">
              {e.inclui.map((i) => <li key={i}>{i}</li>)}
            </ul>
            <Fontes urls={[...e.fontes, ...e.precoBRLFontes.filter((u) => !e.fontes.includes(u))]} />
          </article>
        ))}
      </div>

      <div className="tabela-rolagem" tabIndex={0} role="region" aria-label="Tabela comparativa das edições">
        <table className="tabela-comparativa">
          <caption>Comparativo rápido</caption>
          <thead>
            <tr><th scope="col">Item</th><th scope="col">Standard</th><th scope="col">Ultimate</th></tr>
          </thead>
          <tbody>
            {[
              ['Jogo completo', true, true],
              ['Vintage Vice City Pack (compras até 19/11/2026)', true, true],
              ['1 mês de GTA+ (pré-venda digital)', true, true],
              ['Veículos, armas e roupas exclusivos', false, true],
              ['Lojas e oficinas exclusivas', false, true],
              ['Versão física anunciada (código na caixa)', true, false],
            ].map(([nome, s, u]) => (
              <tr key={nome as string}>
                <th scope="row">{nome}</th>
                <td>{s ? <span className="sim">✓ <span className="sr-only">sim</span></span> : <span className="nao">— <span className="sr-only">não</span></span>}</td>
                <td>{u ? <span className="sim">✓ <span className="sr-only">sim</span></span> : <span className="nao">— <span className="sr-only">não</span></span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="texto-suave">
          Na versão física, só a Standard foi anunciada em caixa (código, sem disco). A Ultimate pode ser obtida como melhoria digital.
        </p>
      </div>

      <div className="grade-extras">
        {outros.map((e) => (
          <article key={e.id} id={`ed-${e.id}`} className="cartao-mini">
            <header><h4>{e.titulo}</h4><StatusBadge status={e.status} /></header>
            <p className="preco-mini">{usd(e.precoUSD)} <span className="texto-suave">(≈ {brl(e.precoUSD * taxa)})</span></p>
            <p>{e.descricao}</p>
            <Fontes urls={e.fontes} />
          </article>
        ))}
        {bonus.map((b) => (
          <article key={b.id} id={`ed-${b.id}`} className="cartao-mini">
            <header><h4>{b.titulo}</h4><StatusBadge status={b.status} /></header>
            <p>{b.descricao}</p>
            <Fontes urls={b.fontes} />
          </article>
        ))}
      </div>
    </Secao>
  );
}
