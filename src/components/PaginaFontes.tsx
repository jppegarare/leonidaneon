import { useMemo, useState } from 'react';
import { contarUsos, fontes, fontesMeta, formatarData, normalizar, STATUS_INFO, type Fonte, type Status } from '../data';
import { StatusBadge } from './comum';

const GRUPOS: { tipo: Fonte['tipo']; titulo: string; texto: string }[] = [
  { tipo: 'oficial', titulo: 'Fontes oficiais', texto: 'Rockstar Games, Take-Two Interactive, canais oficiais de vídeo e lojas das plataformas. Inclui a página de mídia de onde vêm as fotos e a cotação do Banco Central.' },
  { tipo: 'entrevista', titulo: 'Entrevistas', texto: 'Falas de pessoas da Rockstar ou da Take-Two a veículos de imprensa (aqui, via traduções).' },
  { tipo: 'imprensa', titulo: 'Imprensa e análises', texto: 'Veículos de games, música e tecnologia que analisaram trailers ou deram notícias.' },
  { tipo: 'referencia', titulo: 'Referência histórica', texto: 'Usadas só para fatos do GTA: Vice City de 2002.' },
];

export default function PaginaFontes() {
  const usos = useMemo(() => contarUsos(), []);
  const [q, setQ] = useState('');
  const termo = normalizar(q);
  const filtradas = fontes.filter((f) => !termo || normalizar(`${f.titulo} ${f.veiculo} ${f.url}`).includes(termo));

  return (
    <main id="conteudo" className="pagina-fontes" tabIndex={-1}>
      <a href="#inicio" className="voltar">← Voltar ao guia</a>
      <h1 className="secao-titulo">Fontes e metodologia</h1>
      <p>
        Cada informação do site traz um selo de status e links para as fontes. Todas as referências foram acessadas em{' '}
        {formatarData(fontesMeta.acesso, true)}. {fontesMeta.observacao}
      </p>

      <div className="legenda-status">
        {(Object.keys(STATUS_INFO) as Status[]).map((s) => (
          <p key={s}><StatusBadge status={s} /> {STATUS_INFO[s].explicacao}</p>
        ))}
      </div>

      <div className="caixa-regras">
        <h2>Direitos autorais e identidade</h2>
        <ul>
          <li>Site de fã, não oficial. Não afiliado à Rockstar Games ou à Take-Two Interactive.</li>
          <li>As fotos são capturas oficiais distribuídas pela Rockstar Games na <a href="https://www.rockstargames.com/VI/media" target="_blank" rel="noopener noreferrer">página de mídia do GTA VI</a>, sempre com crédito. Logotipos, capa e fontes tipográficas oficiais não são usados; mapa, ícones e ilustrações restantes são originais.</li>
          <li>Os textos foram escritos com nossas palavras, com no máximo citações muito curtas e sempre com fonte.</li>
          <li>Vídeos oficiais só são exibidos pelo player oficial do YouTube, e apenas quando você clica.</li>
          <li>Nenhuma letra de música é reproduzida, só nomes de artistas, faixas e estações.</li>
          <li>Grand Theft Auto, GTA, Rockstar Games e marcas relacionadas pertencem aos respectivos donos.</li>
        </ul>
      </div>

      <label className="campo-busca campo-largo">
        <span className="sr-only">Filtrar fontes</span>
        <input type="search" placeholder="Filtrar por veículo, título ou endereço…" value={q} onChange={(e) => setQ(e.target.value)} />
      </label>
      <p className="resultado-contagem" role="status">{filtradas.length} de {fontes.length} fontes</p>

      {GRUPOS.map((g) => {
        const lista = filtradas.filter((f) => f.tipo === g.tipo);
        if (!lista.length) return null;
        return (
          <section key={g.tipo} className="grupo-fontes" aria-labelledby={`g-${g.tipo}`}>
            <h2 id={`g-${g.tipo}`}>{g.titulo} <span className="texto-suave">({lista.length})</span></h2>
            <p className="texto-suave">{g.texto}</p>
            <ol className="lista-fontes">
              {lista.map((f) => (
                <li key={f.id} id={`f-${f.id}`}>
                  <a href={f.url} target="_blank" rel="noopener noreferrer">{f.titulo}<span className="sr-only"> (abre em nova aba)</span></a>
                  <span className="fonte-meta">
                    {f.veiculo} · publicado: {formatarData(f.publicado)} · {f.verificacao} · citada {usos.get(f.url) ?? 0}×
                  </span>
                  <span className="fonte-url">{f.url}</span>
                </li>
              ))}
            </ol>
          </section>
        );
      })}
    </main>
  );
}
