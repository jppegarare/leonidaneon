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

A pasta `dist/` pode ser hospedada em qualquer serviço estático (GitHub Pages, Netlify, Vercel). Não há backend.

## Por que Vite + React + TypeScript

- **Vite**: build rápido e saída 100% estática.
- **React**: as seções interativas (mapa, filtros, quiz, busca) ficam simples de manter.
- **TypeScript**: os tipos dos dados ajudam a garantir que todo item tem status, fontes e data.
- **Sem bibliotecas de UI**: CSS próprio, e as fontes livres (Audiowide e Inter, licença OFL) são servidas localmente via `@fontsource`.

## Estrutura

```
data/                 dados estruturados (um JSON por tema)
  fontes.json         todas as referências (URL, veículo, data, tipo, forma de verificação)
  personagens.json  locais.json  mecanicas.json  timeline.json
  trilha.json  edicoes.json  info.json  comparativo.json  quiz.json
scripts/
  validar-dados.mjs   garante status válido, fontes (URLs cadastradas) e data em cada item
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
- Nenhuma imagem, captura, arte, capa ou logotipo oficial. Toda a arte é original, em SVG/CSS.
- Vídeos oficiais aparecem só pelo player do YouTube (youtube-nocookie), e apenas quando o usuário clica.
- Nenhuma letra de música, só nomes de artistas, faixas e estações.
- Os textos são escritos com palavras próprias, com no máximo citações muito curtas e com fonte.

## Atualizando

Edite os JSON em `data/`. Se a fonte for nova, cadastre-a em `data/fontes.json` primeiro e rode `npm run validar`.
