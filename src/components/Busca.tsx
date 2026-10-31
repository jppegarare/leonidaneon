import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import {
  album, bonus, comparativo, edicoes, fontes, info, leonida, locaisExtras, mecanicas, musicasTrailers,
  normalizar, personagens, radios, regioes, score, timeline, type Status,
} from '../data';
import { StatusBadge } from './comum';
import { navegar, type Destino } from '../navegacao';

interface Entrada {
  chave: string;
  titulo: string;
  texto: string;
  secao: string;
  rotuloSecao: string;
  status?: Status;
  destino: Destino;
  indice: string;
}

function montarIndice(): Entrada[] {
  const e: Entrada[] = [];
  const add = (x: Omit<Entrada, 'indice'>) => e.push({ ...x, indice: normalizar(`${x.titulo} ${x.texto}`) });

  personagens.forEach((p) => add({
    chave: `per-${p.id}`, titulo: p.titulo, texto: `${p.papel}. ${p.descricao} ${p.destaques.join(' ')}`,
    secao: 'personagens', rotuloSecao: 'Personagens', status: p.status, destino: { secao: 'personagens', alvo: `per-${p.id}` },
  }));
  regioes.forEach((r) => add({
    chave: `loc-${r.id}`, titulo: r.titulo, texto: `${r.inspiracao}. ${r.descricao} ${r.destaques.join(' ')} ${r.pontos.map((p) => p.texto).join(' ')}`,
    secao: 'mapa', rotuloSecao: 'Mapa de Leonida', status: r.status, destino: { secao: 'mapa', regiao: r.id },
  }));
  [leonida, ...locaisExtras].forEach((l) => add({
    chave: `loc-${l.id}`, titulo: l.titulo, texto: l.descricao, secao: 'mapa', rotuloSecao: 'Mapa de Leonida', status: l.status,
    destino: { secao: 'mapa', alvo: `loc-${l.id}` },
  }));
  timeline.forEach((t) => add({
    chave: `tl-${t.id}`, titulo: t.titulo, texto: `${t.data} ${t.descricao}`, secao: 'linha-do-tempo', rotuloSecao: 'Linha do tempo',
    status: t.status, destino: { secao: 'linha-do-tempo', alvo: `tl-${t.id}` },
  }));
  mecanicas.forEach((m) => add({
    chave: `mec-${m.id}`, titulo: m.titulo, texto: `${m.categoria}. ${m.descricao}`, secao: 'mecanicas', rotuloSecao: 'Mecânicas',
    status: m.status, destino: { secao: 'mecanicas', alvo: `mec-${m.id}` },
  }));
  radios.forEach((r) => add({
    chave: `tr-${r.id}`, titulo: `Rádio ${r.titulo}`, texto: `${r.genero}. ${r.apresentadores}. ${r.identidadeReal}. ${r.faixas.map((f) => `${f.faixa} ${f.artista}`).join(' ')}`,
    secao: 'trilha', rotuloSecao: 'Trilha sonora', status: r.status, destino: { secao: 'trilha', alvo: 'radio-painel' },
  }));
  [album, score].forEach((a) => add({
    chave: `tr-${a.id}`, titulo: a.titulo, texto: `${a.descricao} ${a.singles.map((f) => `${f.faixa} ${f.artista}`).join(' ')}`,
    secao: 'trilha', rotuloSecao: 'Trilha sonora', status: a.status, destino: { secao: 'trilha', alvo: `tr-${a.id}` },
  }));
  musicasTrailers.forEach((m) => add({
    chave: `tr-${m.id}`, titulo: `Música do ${m.titulo}`, texto: `${m.faixa} ${m.artista} ${m.descricao}`, secao: 'trilha', rotuloSecao: 'Trilha sonora',
    status: m.status, destino: { secao: 'trilha', alvo: `tr-${m.id}` },
  }));
  [...edicoes, ...bonus].forEach((x) => add({
    chave: `ed-${x.id}`, titulo: x.titulo, texto: x.descricao, secao: 'edicoes', rotuloSecao: 'Edições e preços', status: x.status,
    destino: { secao: 'edicoes', alvo: `ed-${x.id}` },
  }));
  [info.plataformas, ...info.temas, ...info.adiamentos, ...info.marketing].forEach((x) => add({
    chave: `info-${x.id}`, titulo: x.titulo, texto: x.descricao, secao: 'essencial', rotuloSecao: 'O essencial', status: x.status,
    destino: { secao: 'essencial', alvo: `info-${x.id}` },
  }));
  [info.lancamento, info.preload, info.horario].forEach((x) => add({
    chave: `cont-${x.id}`, titulo: x.titulo, texto: x.descricao, secao: 'contagem', rotuloSecao: 'Contagem regressiva', status: x.status,
    destino: { secao: 'contagem', alvo: 'contagem' },
  }));
  comparativo.forEach((c) => add({
    chave: `vc-${c.id}`, titulo: `Vice City 2002 × VI: ${c.aspecto}`, texto: `${c.classico} ${c.novo}`, secao: 'vice-city',
    rotuloSecao: 'Vice City 2002 × VI', status: c.status, destino: { secao: 'vice-city', alvo: `vc-${c.id}` },
  }));
  fontes.forEach((f) => add({
    chave: `f-${f.id}`, titulo: f.titulo, texto: `${f.veiculo} ${f.url}`, secao: 'fontes', rotuloSecao: 'Fontes',
    destino: { secao: 'fontes' },
  }));
  return e;
}

export default function Busca({ aberta, fechar }: { aberta: boolean; fechar: () => void }) {
  const indice = useMemo(() => montarIndice(), []);
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (aberta && !d.open) {
      d.showModal();
      setTimeout(() => inputRef.current?.focus(), 10);
    } else if (!aberta && d.open) d.close();
  }, [aberta]);

  const termos = normalizar(q).split(/\s+/).filter(Boolean);
  const resultados = termos.length
    ? indice
        .filter((x) => termos.every((t) => x.indice.includes(t)))
        .sort((a, b) => Number(normalizar(b.titulo).includes(termos[0])) - Number(normalizar(a.titulo).includes(termos[0])))
        .slice(0, 40)
    : [];

  const ir = (r: Entrada) => {
    fechar();
    setQ('');
    setTimeout(() => navegar(r.destino), 30);
  };

  const teclas = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSel((s) => Math.min(s + 1, resultados.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSel((s) => Math.max(s - 1, 0));
    } else if (e.key === 'Enter' && resultados[sel]) {
      e.preventDefault();
      ir(resultados[sel]);
    }
  };

  const trecho = (texto: string) => {
    if (!termos.length) return texto.slice(0, 120);
    const n = normalizar(texto);
    const pos = Math.max(0, n.indexOf(termos[termos.length - 1]) - 40);
    return (pos > 0 ? '…' : '') + texto.slice(pos, pos + 140) + (texto.length > pos + 140 ? '…' : '');
  };

  return (
    <dialog
      ref={dialogRef}
      className="busca-dialogo"
      aria-labelledby="busca-titulo"
      onClose={fechar}
      onClick={(e) => { if (e.target === dialogRef.current) fechar(); }}
    >
      <div className="busca-caixa">
        <div className="busca-topo">
          <h2 id="busca-titulo" className="sr-only">Busca no site</h2>
          <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20"><circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M15 15 L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          <input
            ref={inputRef}
            type="search"
            role="combobox"
            aria-expanded={resultados.length > 0}
            aria-controls="busca-resultados"
            aria-activedescendant={resultados[sel] ? `res-${resultados[sel].chave}` : undefined}
            aria-label="Buscar em todo o site"
            placeholder="Buscar personagens, lugares, músicas, datas…"
            value={q}
            onChange={(e) => { setQ(e.target.value); setSel(0); }}
            onKeyDown={teclas}
          />
          <button type="button" className="botao-texto" onClick={fechar}>Fechar <kbd>Esc</kbd></button>
        </div>
        <p className="sr-only" role="status">
          {termos.length ? `${resultados.length} resultado(s)` : ''}
        </p>
        {termos.length > 0 && resultados.length === 0 && <p className="vazio">Nenhum resultado para “{q}”.</p>}
        {!termos.length && (
          <div className="busca-sugestoes">
            <p>Experimente:</p>
            {['Lucia', 'Flash FM', 'adiamento', 'Netflix', 'PC', 'Grassrivers', 'Justice', 'preço'].map((s) => (
              <button key={s} type="button" className="chip" onClick={() => { setQ(s); inputRef.current?.focus(); }}>{s}</button>
            ))}
          </div>
        )}
        <ul id="busca-resultados" role="listbox" className="busca-resultados" aria-label="Resultados">
          {resultados.map((r, i) => (
            <li
              key={r.chave}
              id={`res-${r.chave}`}
              role="option"
              aria-selected={i === sel}
              className={i === sel ? 'selecionado' : ''}
              onMouseEnter={() => setSel(i)}
              onClick={() => ir(r)}
            >
              <span className="busca-secao">{r.rotuloSecao}</span>
              <span className="busca-titulo">{r.titulo} {r.status && <StatusBadge status={r.status} compacto />}</span>
              <span className="busca-trecho">{trecho(r.texto)}</span>
            </li>
          ))}
        </ul>
      </div>
    </dialog>
  );
}
