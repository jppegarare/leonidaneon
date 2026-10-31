import { info, formatarData, edicoes, usd } from '../data';
import { Fontes, Secao, StatusBadge } from './comum';

export default function Essencial() {
  const std = edicoes.find((e) => e.id === 'standard')!;
  const ult = edicoes.find((e) => e.id === 'ultimate')!;
  return (
    <Secao
      id="essencial"
      numero="02"
      titulo="O essencial"
      subtitulo="Datas, plataformas, adiamentos e o que é (ou não é) oficial sobre online, PC e classificação."
    >
      <div className="grade-fatos">
        <article className="fato" id="info-plataformas">
          <h3>Plataformas</h3>
          <p className="fato-valor">{info.plataformas.valor}</p>
          <p>{info.plataformas.descricao}</p>
          <StatusBadge status={info.plataformas.status} />
          <Fontes urls={info.plataformas.fontes} />
        </article>
        <article className="fato">
          <h3>Preço (EUA)</h3>
          <p className="fato-valor">{usd(std.precoUSD)} / {usd(ult.precoUSD)}</p>
          <p>Standard e Ultimate. Em reais e com conversão, veja a seção <a href="#edicoes">Edições e preços</a>.</p>
          <StatusBadge status={std.status} />
          <Fontes urls={std.fontes} />
        </article>
        {info.temas.map((t) => (
          <article className="fato" key={t.id} id={`info-${t.id}`}>
            <h3>{t.titulo}</h3>
            <p>{t.descricao}</p>
            <StatusBadge status={t.status} />
            <Fontes urls={t.fontes} />
          </article>
        ))}
      </div>

      <h3 className="sub-titulo">Histórico de datas e adiamentos</h3>
      <ol className="adiamentos">
        {info.adiamentos.map((a, i) => (
          <li key={a.id} id={`info-${a.id}`} className={i === info.adiamentos.length - 1 ? 'adiamento-atual' : ''}>
            <span className="adiamento-data">{formatarData(a.data)}</span>
            <strong>{a.titulo}</strong>
            <span>{a.descricao}</span>
            <StatusBadge status={a.status} />
            <Fontes urls={a.fontes} />
          </li>
        ))}
      </ol>

      <h3 className="sub-titulo">Ações de marketing</h3>
      <div className="grade-marketing">
        {info.marketing.map((m) => (
          <article className="cartao-mini" key={m.id} id={`info-${m.id}`}>
            <header>
              <h4>{m.titulo}</h4>
              <StatusBadge status={m.status} />
            </header>
            <p>{m.descricao}</p>
            <Fontes urls={m.fontes} />
          </article>
        ))}
      </div>
    </Secao>
  );
}
