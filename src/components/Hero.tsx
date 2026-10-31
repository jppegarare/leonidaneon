import { info, formatarData } from '../data';
import Foto from './Foto';

export default function Hero() {
  return (
    <div className="hero" id="inicio">
      <div className="hero-ceu" aria-hidden="true">
        <span className="hero-sol" />
        <span className="hero-faixas" />
      </div>
      <div className="hero-grade">
        <div className="hero-conteudo">
          <p className="hero-sobretitulo">Guia de fã · não oficial</p>
          <h1 className="hero-titulo">
            Tudo sobre <em>GTA VI</em>, do anúncio ao lançamento
          </h1>
          <p className="hero-texto">
            O que já se sabe sobre Grand Theft Auto VI até {formatarData('2026-10-31', true)}. Cada informação traz status e fonte.
          </p>
          <div className="hero-rodape">
            <a className="botao botao-pilula" href="#contagem">Contagem regressiva</a>
            <a className="botao botao-contorno" href="#videos">Ver trailers</a>
          </div>
          <dl className="hero-fatos">
            <div><dt>Lançamento</dt><dd>{info.lancamento.valor}</dd></div>
            <div><dt>Plataformas</dt><dd>PS5 e Xbox Series X|S</dd></div>
          </dl>
        </div>
        <div className="hero-colagem">
          <Foto chave="jason-and-lucia-01" className="colagem-a" sizes="(max-width: 900px) 70vw, 34vw" prioridade />
          <Foto chave="vice-city-02" className="colagem-b" sizes="(max-width: 900px) 50vw, 22vw" prioridade />
          <Foto chave="leonida-keys-01" className="colagem-c" sizes="(max-width: 900px) 50vw, 22vw" />
        </div>
      </div>
    </div>
  );
}
