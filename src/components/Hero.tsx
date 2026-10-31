import { info, formatarData } from '../data';
import Foto from './Foto';

export default function Hero() {
  return (
    <div className="hero" id="inicio">
      <Foto chave="jason-and-lucia-01" className="hero-foto" sizes="100vw" prioridade credito={false} />
      <div className="hero-veu" aria-hidden="true" />
      <div className="hero-conteudo">
        <p className="hero-sobretitulo">Guia de fã · não oficial</p>
        <h1 className="hero-titulo">
          <span>Tudo sobre</span> GTA VI
        </h1>
        <p className="hero-texto">
          O que já se sabe sobre Grand Theft Auto VI até {formatarData('2026-10-31', true)}, com status e fonte em cada informação.
        </p>
        <div className="hero-rodape">
          <p className="hero-data">
            <span>Chega em</span>
            <strong>{info.lancamento.valor}</strong>
          </p>
          <a className="botao botao-pilula" href="#contagem">Ver contagem</a>
          <p className="hero-plataformas">PS5<br />Xbox Series X|S</p>
        </div>
      </div>
      <span className="credito credito-hero">Imagem: Rockstar Games</span>
      <a href="#contagem" className="hero-seta" aria-label="Rolar para a contagem regressiva">
        <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path d="M5 9 L12 16 L19 9" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </a>
    </div>
  );
}
