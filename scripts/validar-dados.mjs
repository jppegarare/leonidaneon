// Valida os arquivos de dados em /data.
// Regras: todo item informativo precisa ter título, descrição, status válido,
// ao menos uma fonte (URL presente em data/fontes.json) e data.
// Uso: node scripts/validar-dados.mjs
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..', 'data');
const ler = (n) => JSON.parse(readFileSync(join(raiz, n), 'utf8'));

const STATUS = new Set(['confirmado', 'reportado', 'rumor']);
const fontes = ler('fontes.json').fontes;
const urls = new Set(fontes.map((f) => f.url));
const usadas = new Set();
const erros = [];
let total = 0;

function checarFontes(lista, onde) {
  if (!Array.isArray(lista) || lista.length === 0) {
    erros.push(`${onde}: sem fontes`);
    return;
  }
  for (const u of lista) {
    if (!/^https?:\/\//.test(u)) erros.push(`${onde}: fonte não é URL (${u})`);
    else if (!urls.has(u)) erros.push(`${onde}: URL fora de fontes.json (${u})`);
    usadas.add(u);
  }
}

function checarItem(item, onde, { titulo = 'titulo', descricao = 'descricao', exigeData = true } = {}) {
  total++;
  const id = `${onde}#${item.id ?? item[titulo]}`;
  if (!item[titulo]) erros.push(`${id}: sem ${titulo}`);
  if (descricao && !item[descricao]) erros.push(`${id}: sem ${descricao}`);
  if (!STATUS.has(item.status)) erros.push(`${id}: status inválido (${item.status})`);
  if (exigeData && !item.data) erros.push(`${id}: sem data`);
  checarFontes(item.fontes, id);
}

const p = ler('personagens.json');
p.itens.forEach((i) => {
  checarItem(i, 'personagens');
  i.detalhes.forEach((d, k) => {
    if (!STATUS.has(d.status)) erros.push(`personagens#${i.id}.detalhes[${k}]: status inválido`);
    checarFontes(d.fontes, `personagens#${i.id}.detalhes[${k}]`);
  });
});

const l = ler('locais.json');
checarItem(l.estado, 'locais.estado');
l.itens.forEach((i) => {
  checarItem(i, 'locais');
  if (!STATUS.has(i.inspiracaoStatus)) erros.push(`locais#${i.id}: inspiracaoStatus inválido`);
  i.pontos.forEach((d, k) => {
    if (!STATUS.has(d.status)) erros.push(`locais#${i.id}.pontos[${k}]: status inválido`);
    checarFontes(d.fontes, `locais#${i.id}.pontos[${k}]`);
  });
});
l.extras.forEach((i) => checarItem(i, 'locais.extras'));

const m = ler('mecanicas.json');
m.itens.forEach((i) => {
  checarItem(i, 'mecanicas');
  if (!m.categorias.includes(i.categoria)) erros.push(`mecanicas#${i.id}: categoria desconhecida`);
});

const t = ler('timeline.json');
t.itens.forEach((i) => {
  checarItem(i, 'timeline');
  (i.extras ?? []).forEach((d, k) => {
    if (!STATUS.has(d.status)) erros.push(`timeline#${i.id}.extras[${k}]: status inválido`);
    checarFontes(d.fontes, `timeline#${i.id}.extras[${k}]`);
  });
});

const tr = ler('trilha.json');
tr.radios.forEach((i) => {
  checarItem(i, 'trilha.radios');
  checarFontes(i.identidadeFontes, `trilha.radios#${i.id}.identidade`);
});
checarItem({ ...tr.radiosNota, titulo: 'nota', descricao: tr.radiosNota.texto, id: 'radiosNota' }, 'trilha', { exigeData: false });
checarItem(tr.album, 'trilha.album');
checarItem(tr.score, 'trilha.score');
tr.trailers.forEach((i) => checarItem(i, 'trilha.trailers'));

const e = ler('edicoes.json');
checarFontes(e.cotacao.fontes, 'edicoes.cotacao');
e.itens.forEach((i) => {
  checarItem(i, 'edicoes');
  if (i.precoBRLOficial != null) checarFontes(i.precoBRLFontes, `edicoes#${i.id}.precoBRL`);
});
e.bonus.forEach((i) => checarItem(i, 'edicoes.bonus'));

const inf = ler('info.json');
['lancamento', 'preload', 'horario', 'plataformas'].forEach((k) => checarItem(inf[k], 'info'));
inf.adiamentos.forEach((i) => checarItem(i, 'info.adiamentos'));
inf.temas.forEach((i) => checarItem(i, 'info.temas'));
inf.marketing.forEach((i) => checarItem(i, 'info.marketing'));

const c = ler('comparativo.json');
c.itens.forEach((i) => checarItem(i, 'comparativo', { titulo: 'aspecto', descricao: 'novo' }));

const q = ler('quiz.json');
q.itens.forEach((i) => {
  checarItem(i, 'quiz', { titulo: 'pergunta', descricao: 'explicacao', exigeData: false });
  if (i.status !== 'confirmado') erros.push(`quiz#${i.id}: o quiz só pode usar informação confirmada`);
  if (!(i.correta >= 0 && i.correta < i.opcoes.length)) erros.push(`quiz#${i.id}: índice da resposta inválido`);
});

// Imagens oficiais: arquivos presentes, texto alternativo, crédito e fonte cadastrada.
const im = ler('imagens.json');
const pastaImg = join(raiz, '..', 'public', 'img', 'oficial');
if (!im.credito) erros.push('imagens.json: sem crédito');
checarFontes([im.fonte], 'imagens.json');
const usoSrc = readdirSync(join(raiz, '..', 'src'), { recursive: true })
  .filter((f) => /\.(ts|tsx)$/.test(f))
  .map((f) => readFileSync(join(raiz, '..', 'src', f), 'utf8'))
  .join('\n');
let nImagens = 0;
for (const [chave, meta] of Object.entries(im.itens)) {
  nImagens++;
  if (!meta.alt || meta.alt.length < 10) erros.push(`imagens#${chave}: texto alternativo ausente ou curto`);
  for (const w of [800, 1600]) {
    if (!existsSync(join(pastaImg, `${chave}-${w}.webp`))) erros.push(`imagens#${chave}: falta ${chave}-${w}.webp`);
  }
  if (!usoSrc.includes(`'${chave}'`) && !usoSrc.includes(`"${chave}"`)) erros.push(`imagens#${chave}: não é usada no site`);
}
// Galeria: todas as imagens com arquivo, título, texto alternativo e categoria válida.
const gal = ler('galeria.json');
checarFontes([gal.fonte], 'galeria.json');
const chavesGaleria = new Set();
for (const g of gal.itens) {
  if (chavesGaleria.has(g.chave)) erros.push(`galeria#${g.chave}: chave repetida`);
  chavesGaleria.add(g.chave);
  if (!g.titulo) erros.push(`galeria#${g.chave}: sem título`);
  if (!g.alt || g.alt.length < 10) erros.push(`galeria#${g.chave}: texto alternativo ausente ou curto`);
  if (!gal.categorias.includes(g.categoria)) erros.push(`galeria#${g.chave}: categoria desconhecida (${g.categoria})`);
  if (g.video && !/^https:\/\/www\.youtube\.com\/watch\?v=/.test(g.video)) erros.push(`galeria#${g.chave}: link de vídeo inválido`);
  for (const w of [800, 1600]) {
    if (!existsSync(join(pastaImg, `${g.chave}-${w}.webp`))) erros.push(`galeria#${g.chave}: falta ${g.chave}-${w}.webp`);
  }
}

const arquivosImg = existsSync(pastaImg) ? readdirSync(pastaImg) : [];
for (const a of arquivosImg) {
  const chave = a.replace(/-(800|1600)\.webp$/, '');
  if (!im.itens[chave] && !chavesGaleria.has(chave)) erros.push(`public/img/oficial/${a}: imagem sem cadastro em imagens.json nem galeria.json`);
}

// Arquivos de dados não podem ter campos de letra de música.
for (const arq of readdirSync(raiz)) {
  const txt = readFileSync(join(raiz, arq), 'utf8');
  if (/"(letra|lyrics?)"\s*:/i.test(txt)) erros.push(`${arq}: contém campo de letra de música`);
}

const naoUsadas = fontes.filter((f) => !usadas.has(f.url)).map((f) => f.id);

console.log(`Itens verificados: ${total} | imagens em destaque: ${nImagens} | imagens na galeria: ${gal.itens.length}`);
console.log(`Fontes cadastradas: ${fontes.length} | usadas: ${usadas.size}`);
if (naoUsadas.length) console.log(`Fontes cadastradas e não usadas: ${naoUsadas.join(', ')}`);
if (erros.length) {
  console.error(`\n${erros.length} problema(s):\n- ` + erros.join('\n- '));
  process.exit(1);
}
console.log('OK: todos os itens têm status, fontes (URLs) e data.');
