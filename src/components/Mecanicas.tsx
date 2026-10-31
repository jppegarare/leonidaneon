import { useEffect, useMemo, useState } from 'react';
import { categoriasMecanicas, mecanicas, normalizar, STATUS_INFO, type Status } from '../data';
import { Fontes, Secao, StatusBadge } from './comum';
import { EVENTO_NAVEGAR, rolarPara, type Destino } from '../navegacao';

const TODOS_STATUS: Status[] = ['confirmado', 'reportado', 'rumor'];

export default function Mecanicas() {
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('todas');
  const [status, setStatus] = useState<Set<Status>>(new Set(TODOS_STATUS));

  useEffect(() => {
    const ouvir = (e: Event) => {
      const d = (e as CustomEvent<Destino>).detail;
      if (d.secao !== 'mecanicas' || !d.alvo) return;
      setBusca('');
      setCategoria('todas');
      setStatus(new Set(TODOS_STATUS));
      setTimeout(() => rolarPara(d.alvo!), 80);
    };
    window.addEventListener(EVENTO_NAVEGAR, ouvir);
    return () => window.removeEventListener(EVENTO_NAVEGAR, ouvir);
  }, []);

  const contagem = useMemo(() => {
    const c: Record<Status, number> = { confirmado: 0, reportado: 0, rumor: 0 };
    mecanicas.forEach((m) => c[m.status]++);
    return c;
  }, []);

  const termos = normalizar(busca).split(/\s+/).filter(Boolean);
  const lista = mecanicas.filter((m) => {
    if (categoria !== 'todas' && m.categoria !== categoria) return false;
    if (!status.has(m.status)) return false;
    if (!termos.length) return true;
    const alvo = normalizar(`${m.titulo} ${m.descricao} ${m.categoria}`);
    return termos.every((t) => alvo.includes(t));
  });

  const alternarStatus = (s: Status) => {
    const n = new Set(status);
    if (n.has(s)) n.delete(s);
    else n.add(s);
    setStatus(n.size ? n : new Set(TODOS_STATUS));
  };

  return (
    <Secao
      id="mecanicas"
      rotulo="Como se joga"
      titulo="Explorador de mecânicas"
      subtitulo="Sistemas e recursos confirmados, mostrados ou só reportados. Filtre por categoria e por status."
    >
      <div className="painel-filtros">
        <label className="campo-busca">
          <span className="sr-only">Pesquisar mecânicas</span>
          <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18"><circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M15 15 L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          <input
            type="search"
            placeholder="Ex.: polícia, pesca, PC, rádio…"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </label>
        <div className="filtros" role="group" aria-label="Filtrar por status">
          {TODOS_STATUS.map((s) => (
            <button
              key={s}
              type="button"
              className={`chip chip-status chip-${s} ${status.has(s) ? 'chip-ativo' : ''}`}
              aria-pressed={status.has(s)}
              onClick={() => alternarStatus(s)}
            >
              {STATUS_INFO[s].icone} {STATUS_INFO[s].rotulo} ({contagem[s]})
            </button>
          ))}
        </div>
        <div className="filtros filtros-rolagem" role="group" aria-label="Filtrar por categoria">
          <button type="button" className={`chip ${categoria === 'todas' ? 'chip-ativo' : ''}`} aria-pressed={categoria === 'todas'} onClick={() => setCategoria('todas')}>
            Todas
          </button>
          {categoriasMecanicas.map((c) => (
            <button key={c} type="button" className={`chip ${categoria === c ? 'chip-ativo' : ''}`} aria-pressed={categoria === c} onClick={() => setCategoria(c)}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <p className="resultado-contagem" role="status">
        {lista.length} de {mecanicas.length} itens
      </p>

      {lista.length === 0 ? (
        <p className="vazio">Nada encontrado. Tente outro termo ou limpe os filtros.</p>
      ) : (
        <ul className="grade-mecanicas">
          {lista.map((m) => (
            <li key={m.id} id={`mec-${m.id}`} className={`cartao-mecanica borda-${m.status}`}>
              <header>
                <span className="mecanica-categoria">{m.categoria}</span>
                <StatusBadge status={m.status} />
              </header>
              <h3>{m.titulo}</h3>
              <p>{m.descricao}</p>
              <Fontes urls={m.fontes} />
            </li>
          ))}
        </ul>
      )}
    </Secao>
  );
}
