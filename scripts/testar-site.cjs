/* Teste de fumaça de todas as seções, no desktop e no celular (~380 px).
 * Uso: npm run build && npx vite preview --port 4173 & node scripts/testar-site.cjs
 * (ou: npm run testar, com o preview já rodando)
 * Requer Playwright disponível no ambiente.
 */
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');

const URL_BASE = process.env.URL_BASE || 'http://localhost:4173/';
const SAIDA = path.join(__dirname, '..', 'capturas');
fs.mkdirSync(SAIDA, { recursive: true });

const AVISO = 'Site de fã, não oficial. Não afiliado à Rockstar Games ou à Take-Two Interactive.';
const resultados = [];
const ok = (nome, cond, extra = '') => {
  resultados.push({ nome, ok: !!cond, extra });
  console.log(`${cond ? '✅' : '❌'} ${nome}${extra ? ' — ' + extra : ''}`);
};

async function rolarTudo(page) {
  await page.evaluate(async () => {
    const passo = window.innerHeight * 0.7;
    for (let y = 0; y < document.body.scrollHeight; y += passo) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(400);
}

async function testar(nome, viewport) {
  console.log(`\n=== ${nome} (${viewport.width}×${viewport.height}) ===`);
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1, reducedMotion: 'no-preference' });
  const page = await ctx.newPage();
  const erros = [];
  page.on('pageerror', (e) => erros.push('pageerror: ' + e.message));
  page.on('console', (m) => {
    // o iframe do YouTube pode falhar sem rede; isso não é erro do site
    if (m.type() === 'error' && !/youtube|ERR_|net::|Failed to load resource/i.test(m.text())) erros.push('console: ' + m.text());
  });

  await page.goto(URL_BASE, { waitUntil: 'networkidle' });

  // Aviso no topo e no rodapé
  ok(`[${nome}] aviso de site de fã no topo`, (await page.locator('.faixa-aviso').innerText()).includes(AVISO));
  ok(`[${nome}] aviso de site de fã no rodapé`, (await page.locator('.rodape-aviso').innerText()).includes(AVISO));

  // Sem imagens oficiais (nenhuma <img>) e links externos seguros
  ok(`[${nome}] nenhuma <img> na página`, (await page.locator('img').count()) === 0);
  const linksInseguros = await page.$$eval('a[href^="http"]', (as) => as.filter((a) => a.target !== '_blank' || !/noopener/.test(a.rel)).length);
  ok(`[${nome}] links externos abrem em nova aba com noopener`, linksInseguros === 0, `${linksInseguros} inseguros`);

  // Contagem regressiva anda
  const antes = await page.locator('.contador-rosa .contador-numero').nth(3).innerText();
  await page.waitForTimeout(1300);
  const depois = await page.locator('.contador-rosa .contador-numero').nth(3).innerText();
  ok(`[${nome}] contagem regressiva atualiza`, antes !== depois, `${antes} → ${depois}`);
  ok(`[${nome}] dois contadores`, (await page.locator('.contador').count()) === 2);

  // Mapa: cada região abre o painel
  const chips = page.locator('.mapa-botoes .chip');
  const nChips = await chips.count();
  let mapaOk = true;
  for (let i = 0; i < nChips; i++) {
    const rotulo = (await chips.nth(i).innerText()).trim();
    await chips.nth(i).click();
    await page.waitForTimeout(80);
    const titulo = await page.locator('.mapa-painel h3').innerText();
    if (!titulo.includes(rotulo)) mapaOk = false;
  }
  ok(`[${nome}] mapa: ${nChips} regiões abrem o painel`, mapaOk && nChips === 6);
  // clique direto no SVG
  await page.locator('g.regiao').first().click();
  ok(`[${nome}] mapa: clique no SVG seleciona região`, (await page.locator('g.regiao[aria-pressed="true"]').count()) === 1);
  // teclado
  await page.locator('g.regiao').nth(4).focus();
  await page.keyboard.press('Enter');
  ok(`[${nome}] mapa: seleção por teclado`, (await page.locator('g.regiao').nth(4).getAttribute('aria-pressed')) === 'true');

  // Personagens
  const cartoes = page.locator('.personagem-topo');
  const nPer = await cartoes.count();
  let perOk = true;
  for (let i = 0; i < nPer; i++) {
    await cartoes.nth(i).click();
    const id = await cartoes.nth(i).getAttribute('aria-controls');
    if (!(await page.locator(`#${id}`).isVisible())) perOk = false;
  }
  ok(`[${nome}] personagens: ${nPer} cartões expandem`, perOk && nPer === 8);

  // Linha do tempo
  const nEventos = await page.locator('.evento').count();
  ok(`[${nome}] linha do tempo com eventos`, nEventos >= 20, `${nEventos} eventos`);
  await page.locator('#linha-do-tempo .chip', { hasText: 'Adiamento' }).click();
  const nAdiamentos = await page.locator('.evento').count();
  ok(`[${nome}] filtro de adiamentos`, nAdiamentos === 2, `${nAdiamentos}`);
  await page.locator('#linha-do-tempo .chip', { hasText: 'Trailer' }).click();
  const nVideos = await page.locator('.video-play').count();
  ok(`[${nome}] trailers com player sob demanda`, nVideos === 4, `${nVideos} vídeos`);
  await page.locator('.video-play').first().click();
  const src = await page.locator('.video-quadro iframe').first().getAttribute('src');
  ok(`[${nome}] player oficial do YouTube carrega ao clicar`, /youtube-nocookie\.com\/embed\/QdBZY2fkU-0/.test(src || ''), src);
  await page.locator('#linha-do-tempo .chip', { hasText: 'Todos' }).click();

  // Mecânicas
  const totalMec = await page.locator('.cartao-mecanica').count();
  await page.fill('#mecanicas input[type="search"]', 'pesca');
  const nPesca = await page.locator('.cartao-mecanica').count();
  ok(`[${nome}] mecânicas: busca "pesca"`, nPesca >= 1 && nPesca < totalMec, `${nPesca}/${totalMec}`);
  await page.fill('#mecanicas input[type="search"]', '');
  await page.locator('#mecanicas .chip-confirmado').click();
  await page.locator('#mecanicas .chip-reportado').click();
  const soRumor = await page.locator('.cartao-mecanica').count();
  const badgesRumor = await page.locator('.cartao-mecanica .selo-rumor').count();
  ok(`[${nome}] mecânicas: filtro só rumor`, soRumor > 0 && soRumor === badgesRumor, `${soRumor}`);
  await page.locator('#mecanicas .chip-confirmado').click();
  await page.locator('#mecanicas .chip-reportado').click();
  await page.locator('#mecanicas .chip', { hasText: 'Polícia' }).click();
  const nPol = await page.locator('.cartao-mecanica').count();
  ok(`[${nome}] mecânicas: filtro por categoria`, nPol > 0 && nPol < totalMec, `${nPol}`);
  await page.locator('#mecanicas .chip', { hasText: 'Todas' }).click();

  // Trilha
  const abas = page.locator('.radio-botao');
  const nAbas = await abas.count();
  let triOk = true;
  for (let i = 0; i < nAbas; i++) {
    const t = (await abas.nth(i).innerText()).trim();
    await abas.nth(i).click();
    if (!(await page.locator('.radio-painel h3').innerText()).includes(t)) triOk = false;
    if ((await page.locator('.radio-painel .faixas li').count()) !== 3) triOk = false;
  }
  ok(`[${nome}] trilha: ${nAbas} rádios com 3 faixas cada`, triOk && nAbas === 6);
  const textoTrilha = await page.locator('#trilha').innerText();
  ok(`[${nome}] trilha: sem seção de letras`, !/letra:/i.test(textoTrilha));

  // Edições
  const conv1 = await page.locator('.cartao-edicao .precos dd').nth(1).innerText();
  await page.fill('.cotacao-ajuste input', '6');
  const conv2 = await page.locator('.cartao-edicao .precos dd').nth(1).innerText();
  ok(`[${nome}] edições: simulação de cotação`, conv1 !== conv2, `${conv1} → ${conv2}`);
  ok(`[${nome}] edições: preço oficial em R$`, (await page.locator('#ed-standard').innerText()).includes('449,90'));
  await page.locator('.cotacao-ajuste .botao-texto').click();

  // Vice City
  await page.locator('.vc-botao').first().click();
  ok(`[${nome}] 2002×VI: cartão vira`, (await page.locator('.vc-cartao.virado').count()) === 1);

  // Quiz completo
  for (let i = 0; i < 10; i++) {
    await page.locator('.quiz-opcao').first().click();
    await page.locator('.quiz-feedback .botao').click();
  }
  ok(`[${nome}] quiz: chega ao resultado`, (await page.locator('.quiz-fim').count()) === 1, await page.locator('.quiz-fim h3').innerText());
  await page.locator('.quiz-fim .botao').click();
  ok(`[${nome}] quiz: reinicia`, (await page.locator('.quiz-opcao').count()) === 4);

  // Busca global
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.keyboard.press('Escape');
  await page.locator('body').click({ position: { x: 5, y: 300 } });
  await page.keyboard.press('/');
  ok(`[${nome}] busca abre com "/"`, await page.locator('dialog.busca-dialogo').evaluate((d) => d.open));
  await page.keyboard.type('Brian');
  const nRes = await page.locator('.busca-resultados li').count();
  ok(`[${nome}] busca encontra resultados`, nRes > 0, `${nRes}`);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(900);
  ok(`[${nome}] busca leva ao personagem e abre o cartão`, await page.locator('#per-det-brian-heder').isVisible());
  await page.locator('.botao-busca').click();
  await page.keyboard.type('Grassrivers');
  await page.locator('.busca-resultados li').first().click();
  await page.waitForTimeout(900);
  ok(`[${nome}] busca seleciona região do mapa`, (await page.locator('.mapa-painel h3').innerText()).includes('Grassrivers'));

  // Sem rolagem horizontal
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  ok(`[${nome}] sem rolagem horizontal`, overflow <= 0, `excesso ${overflow}px`);

  // Capturas (sem rolagem suave e com o cabeçalho fixo fora do caminho)
  await page.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await rolarTudo(page);
  await page.screenshot({ path: path.join(SAIDA, `${nome}-pagina-inteira.png`), fullPage: true });
  await page.addStyleTag({ content: '.topo{position:static!important}' });
  for (const secao of ['contagem', 'mapa', 'personagens', 'linha-do-tempo', 'mecanicas', 'trilha', 'edicoes', 'vice-city', 'quiz']) {
    await page.locator(`#${secao}`).screenshot({ path: path.join(SAIDA, `${nome}-${secao}.png`) });
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.addStyleTag({ content: '.topo{position:sticky!important}' });
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(SAIDA, `${nome}-topo.png`) });

  if (nome === 'celular') {
    await page.locator('.botao-menu').click();
    ok(`[${nome}] menu móvel abre`, await page.locator('.nav-aberta').isVisible());
    await page.screenshot({ path: path.join(SAIDA, `${nome}-menu.png`) });
    await page.locator('.botao-menu').click();
  }

  // Página de fontes
  await page.goto(URL_BASE + '#/fontes', { waitUntil: 'networkidle' });
  const nFontes = await page.locator('.lista-fontes li').count();
  ok(`[${nome}] página de fontes lista tudo`, nFontes === 70, `${nFontes}`);
  ok(`[${nome}] fontes: aviso no topo e rodapé`, (await page.locator('.faixa-aviso').count()) === 1 && (await page.locator('.rodape-aviso').count()) === 1);
  await page.screenshot({ path: path.join(SAIDA, `${nome}-fontes.png`) });
  const overflowF = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  ok(`[${nome}] fontes sem rolagem horizontal`, overflowF <= 0, `excesso ${overflowF}px`);
  await page.locator('.voltar').click();
  await page.waitForTimeout(300);
  ok(`[${nome}] volta da página de fontes`, (await page.locator('#mapa').count()) === 1);

  ok(`[${nome}] sem erros de JavaScript`, erros.length === 0, erros.join(' | '));
  await browser.close();
}

(async () => {
  await testar('desktop', { width: 1366, height: 900 });
  await testar('celular', { width: 380, height: 800 });
  const falhas = resultados.filter((r) => !r.ok);
  console.log(`\n${resultados.length - falhas.length}/${resultados.length} verificações passaram.`);
  process.exit(falhas.length ? 1 : 0);
})();
