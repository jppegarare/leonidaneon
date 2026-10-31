import fontesJson from '../data/fontes.json';
import personagensJson from '../data/personagens.json';
import locaisJson from '../data/locais.json';
import mecanicasJson from '../data/mecanicas.json';
import timelineJson from '../data/timeline.json';
import trilhaJson from '../data/trilha.json';
import edicoesJson from '../data/edicoes.json';
import infoJson from '../data/info.json';
import comparativoJson from '../data/comparativo.json';
import quizJson from '../data/quiz.json';

export type Status = 'confirmado' | 'reportado' | 'rumor';

export interface Fonte {
  id: string;
  url: string;
  titulo: string;
  veiculo: string;
  tipo: 'oficial' | 'entrevista' | 'imprensa' | 'referencia';
  publicado: string | null;
  verificacao: string;
}

export interface Nota {
  texto: string;
  status: Status;
  fontes: string[];
}

export interface ItemBase {
  id: string;
  titulo: string;
  descricao: string;
  status: Status;
  data: string;
  fontes: string[];
}

export interface Personagem extends ItemBase {
  papel: string;
  cor: string;
  destaques: string[];
  detalhes: Nota[];
}

export interface Regiao extends ItemBase {
  inspiracao: string;
  inspiracaoStatus: Status;
  destaques: string[];
  pontos: Nota[];
}

export interface Mecanica extends ItemBase {
  categoria: string;
}

export interface EventoTimeline extends ItemBase {
  tipo: string;
  video?: string;
  duracao?: string;
  link?: string;
  futuro?: boolean;
  extras?: Nota[];
}

export interface Faixa {
  artista: string;
  faixa: string;
}

export interface Radio extends ItemBase {
  genero: string;
  apresentadores: string;
  identidadeReal: string;
  identidadeStatus: Status;
  identidadeFontes: string[];
  cor: string;
  faixas: Faixa[];
}

export interface Edicao extends ItemBase {
  precoUSD: number;
  precoBRLOficial: number | null;
  precoBRLFontes: string[];
  inclui: string[];
}

export interface Comparacao {
  id: string;
  aspecto: string;
  classico: string;
  novo: string;
  status: Status;
  data: string;
  fontes: string[];
}

export interface Pergunta {
  id: string;
  pergunta: string;
  opcoes: string[];
  correta: number;
  explicacao: string;
  status: Status;
  fontes: string[];
}

export const fontes = fontesJson.fontes as Fonte[];
export const fontesMeta = { acesso: fontesJson.acessoPadrao, observacao: fontesJson.observacao };
const porUrl = new Map(fontes.map((f) => [f.url, f]));
export const fontePorUrl = (url: string): Fonte | undefined => porUrl.get(url);

export const personagens = personagensJson.itens as Personagem[];
export const leonida = locaisJson.estado as ItemBase;
export const regioes = locaisJson.itens as Regiao[];
export const locaisExtras = locaisJson.extras as ItemBase[];
export const avisoMapa = locaisJson.aviso;

export const categoriasMecanicas = mecanicasJson.categorias;
export const mecanicas = mecanicasJson.itens as Mecanica[];

export const timeline = timelineJson.itens as EventoTimeline[];

export const radios = trilhaJson.radios as Radio[];
export const radiosNota = trilhaJson.radiosNota as Nota;
export const album = trilhaJson.album as ItemBase & { singles: Faixa[] };
export const score = trilhaJson.score as ItemBase & { compositor: string; singles: Faixa[] };
export const musicasTrailers = trilhaJson.trailers as (ItemBase & Faixa)[];
export const avisoTrilha = trilhaJson.aviso;

export const cotacao = edicoesJson.cotacao;
export const edicoes = edicoesJson.itens as Edicao[];
export const bonus = edicoesJson.bonus as ItemBase[];

export const info = {
  lancamento: infoJson.lancamento as ItemBase & { valor: string; iso: string },
  preload: infoJson.preload as ItemBase & { valor: string; iso: string },
  horario: infoJson.horario as ItemBase,
  plataformas: infoJson.plataformas as ItemBase & { valor: string },
  adiamentos: infoJson.adiamentos as ItemBase[],
  temas: infoJson.temas as ItemBase[],
  marketing: infoJson.marketing as ItemBase[],
};

export const comparativo = comparativoJson.itens as Comparacao[];
export const quiz = quizJson.itens as Pergunta[];

export const STATUS_INFO: Record<Status, { rotulo: string; icone: string; explicacao: string }> = {
  confirmado: {
    rotulo: 'Confirmado',
    icone: '✓',
    explicacao: 'Dito pela Rockstar ou pela Take-Two, ou mostrado em material oficial.',
  },
  reportado: {
    rotulo: 'Reportado',
    icone: '!',
    explicacao: 'Informado por veículo confiável, sem confirmação oficial.',
  },
  rumor: {
    rotulo: 'Rumor/Vazamento',
    icone: '?',
    explicacao: 'Especulação ou vazamento amplamente noticiado. Trate com cautela.',
  },
};

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const MESES_LONGOS = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];

/** Formata datas parciais ("2026", "2026-09", "2026-09-24") em pt-BR. */
export function formatarData(iso: string | null | undefined, longo = false): string {
  if (!iso) return 'sem data';
  const [a, m, d] = iso.split('-');
  if (!m) return a;
  const mes = (longo ? MESES_LONGOS : MESES)[Number(m) - 1];
  if (!d) return longo ? `${mes} de ${a}` : `${mes}/${a}`;
  return longo ? `${Number(d)} de ${mes} de ${a}` : `${d}/${m}/${a}`;
}

/** Remove acentos e baixa a caixa para buscas. */
export const normalizar = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export const brl = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
export const usd = (v: number) =>
  'US$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Quantas vezes cada URL de fonte é citada nos dados. */
export function contarUsos(): Map<string, number> {
  const mapa = new Map<string, number>();
  const visitar = (o: unknown): void => {
    if (Array.isArray(o)) o.forEach(visitar);
    else if (o && typeof o === 'object') {
      for (const [k, v] of Object.entries(o)) {
        if (/fontes$/i.test(k) && Array.isArray(v)) {
          v.forEach((u) => typeof u === 'string' && mapa.set(u, (mapa.get(u) ?? 0) + 1));
        } else visitar(v);
      }
    }
  };
  [personagensJson, locaisJson, mecanicasJson, timelineJson, trilhaJson, edicoesJson, infoJson, comparativoJson, quizJson].forEach(visitar);
  return mapa;
}
