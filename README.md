# Leonida Neon — guia de fã (não oficial) sobre GTA VI

> **Site de fã, não oficial. Não afiliado à Rockstar Games ou à Take-Two Interactive.**

Site estático e interativo que reúne o que se sabe sobre Grand Theft Auto VI até **31/10/2026**. Cada informação traz um status (Confirmado, Reportado ou Rumor/Vazamento), fontes (URLs) e data.

## Como rodar

Requer Node 20 ou mais recente.

```bash
npm install
npm run dev        # servidor de desenvolvimento (http://localhost:5173)
npm run build      # valida os dados + gera a versão de produção em dist/
npm run preview    # serve dist/ em http://localhost:4173
npm run validar    # só a validação dos dados
npm run testar     # teste com Playwright (desktop e 380 px); requer o preview rodando
```

A pasta `dist/` pode ser hospedada em qualquer serviço estático. Não há backend.

## Publicação no GitHub Pages

O workflow `.github/workflows/deploy.yml` gera e publica o site a cada push na `main`, em **https://jppegarare.github.io/leonidaneon/**.

1. No GitHub, abra **Settings → Pages** e, em **Build and deployment → Source**, escolha **GitHub Actions** (só precisa fazer isso uma vez).
2. Faça merge na `main`, ou rode o workflow manualmente pela aba **Actions**.

O `base: '/leonidaneon/'` do `vite.config.ts` precisa bater com o nome do repositório. Por isso, localmente o preview abre em http://localhost:4173/leonidaneon/.

## Por que Vite + React + TypeScript

- **Vite**: build rápido e saída 100% estática.
- **React**: as seções interativas (mapa, filtros, quiz, busca) ficam simples de manter.
- **TypeScript**: os tipos dos dados ajudam a garantir que todo item tem status, fontes e data.
- **Sem bibliotecas de UI**: CSS próprio, e as fontes livres (Fraunces e Outfit, licença OFL) são servidas localmente via `@fontsource`.
- **Visual (branch `visual-inspirado`)**: mesmo clima do site oficial (pôr do sol, fotos grandes, pouco neon), mas com identidade própria: títulos serifados, acentos coral/pêssego/verde-água, colagem de fotos no topo, menu em gaveta e cartões com borda em degradê. A branch `adiciona-site`/`main` tem a versão mais parecida com o oficial.

## Estrutura

```
data/                 dados estruturados (um JSON por tema)
  fontes.json         todas as referências (URL, veículo, data, tipo, forma de verificação)
  imagens.json        capturas oficiais usadas, com texto alternativo e crédito
  personagens.json  locais.json  mecanicas.json  timeline.json
  trilha.json  edicoes.json  info.json  comparativo.json  quiz.json
scripts/
  validar-dados.mjs   garante status, fontes (URLs cadastradas) e data em cada item, e confere as imagens
public/img/oficial/   capturas oficiais em WebP (800 e 1600 px)
  testar-site.cjs     teste de todas as seções + capturas de tela em capturas/
src/
  components/         uma seção por arquivo (Mapa, Personagens, LinhaDoTempo…)
  data.ts             tipos e utilitários dos dados
  navegacao.ts        navegação usada pela busca global
```

## Regras de conteúdo

- **Confirmado**: dito pela Rockstar/Take-Two ou mostrado em material oficial.
- **Reportado**: veículo confiável, sem confirmação oficial.
- **Rumor/Vazamento**: só quando foi amplamente noticiado, e sempre marcado.
- As fotos são capturas oficiais distribuídas pela Rockstar Games na [página de mídia do GTA VI](https://www.rockstargames.com/VI/media), sempre com o crédito "Imagem: Rockstar Games". Logotipo, capa e fontes tipográficas oficiais não são usados; o mapa e os ícones são originais.
- Vídeos oficiais aparecem só pelo player do YouTube (youtube-nocookie), e apenas quando o usuário clica.
- Nenhuma letra de música, só nomes de artistas, faixas e estações.
- Os textos são escritos com palavras próprias, com no máximo citações muito curtas e com fonte.

## Atualizando

Edite os JSON em `data/`. Se a fonte for nova, cadastre-a em `data/fontes.json` primeiro e rode `npm run validar`.

Para trocar ou acrescentar fotos, coloque `nome-800.webp` e `nome-1600.webp` em `public/img/oficial/`, cadastre o `nome` com texto alternativo em `data/imagens.json` e use a chave em `src/midia.ts`. O validador reclama de imagem sem cadastro, sem arquivo ou sem uso.
