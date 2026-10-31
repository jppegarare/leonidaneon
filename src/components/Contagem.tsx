import { useEffect, useState } from 'react';
import { info, formatarData } from '../data';
import { Fontes, Secao, StatusBadge } from './comum';

/** Meia-noite local da data ISO (horário oficial de liberação não foi confirmado). */
const alvoLocal = (iso: string) => {
  const [a, m, d] = iso.split('-').map(Number);
  return new Date(a, m - 1, d, 0, 0, 0);
};

function partes(ms: number) {
  const t = Math.max(0, Math.floor(ms / 1000));
  return {
    dias: Math.floor(t / 86400),
    horas: Math.floor((t % 86400) / 3600),
    minutos: Math.floor((t % 3600) / 60),
    segundos: t % 60,
  };
}

function Digito({ valor, rotulo }: { valor: number; rotulo: string }) {
  const txt = String(valor).padStart(2, '0');
  return (
    <div className="contador-bloco">
      {/* key força a animação de "virada" a cada mudança */}
      <span className="contador-numero" key={txt}>{txt}</span>
      <span className="contador-rotulo">{rotulo}</span>
    </div>
  );
}

function Relogio({ titulo, iso, valor, cor }: { titulo: string; iso: string; valor: string; cor: 'rosa' | 'ciano' }) {
  const alvo = alvoLocal(iso).getTime();
  const [agora, setAgora] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setAgora(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const restante = alvo - agora;
  const p = partes(restante);
  const acabou = restante <= 0;
  return (
    <article className={`contador contador-${cor}`}>
      <h3 className="contador-titulo">{titulo}</h3>
      <p className="contador-data">{valor}</p>
      {acabou ? (
        <p className="contador-fim" role="status">Chegou o dia! 🌴</p>
      ) : (
        <>
          <div className="contador-digitos" aria-hidden="true">
            <Digito valor={p.dias} rotulo="dias" />
            <span className="contador-sep">:</span>
            <Digito valor={p.horas} rotulo="horas" />
            <span className="contador-sep">:</span>
            <Digito valor={p.minutos} rotulo="min" />
            <span className="contador-sep">:</span>
            <Digito valor={p.segundos} rotulo="seg" />
          </div>
          {/* versão estática para leitores de tela (sem anunciar a cada segundo) */}
          <p className="sr-only">
            Faltam {p.dias} dias e {p.horas} horas para {titulo.toLowerCase()}, em {formatarData(iso, true)}.
          </p>
        </>
      )}
    </article>
  );
}

export default function Contagem() {
  return (
    <Secao
      id="contagem"
      numero="01"
      titulo="Contagem regressiva"
      subtitulo="Até o pré-download e até o lançamento, contados até a meia-noite no seu fuso horário."
    >
      <div className="contadores">
        <Relogio titulo="Pré-download" iso={info.preload.iso} valor={info.preload.valor} cor="ciano" />
        <Relogio titulo="Lançamento" iso={info.lancamento.iso} valor={info.lancamento.valor} cor="rosa" />
      </div>
      <div className="contador-notas">
        <p>
          <StatusBadge status={info.lancamento.status} /> {info.lancamento.descricao}
        </p>
        <Fontes urls={info.lancamento.fontes} />
        <p>
          <StatusBadge status={info.preload.status} /> {info.preload.descricao}
        </p>
        <Fontes urls={info.preload.fontes} />
        <p>
          <StatusBadge status={info.horario.status} /> {info.horario.descricao}
        </p>
        <Fontes urls={info.horario.fontes} />
      </div>
    </Secao>
  );
}
