# Poketab — Pokédex completa

Pokédex moderna construída em Vue 3 + Vite, consumindo a [PokeAPI](https://pokeapi.co)
com os **1025 Pokémon** da Pokédex Nacional. Busca, filtros por tipo e geração,
páginas de detalhe ricas (fraquezas, evolução, curiosidades) e visual animado.

## Grupo
- Gabriel • João • Gabi

## Tecnologias
- Vue.js 3 • Vue Router 4 • Vite • PokeAPI • HTML5 • CSS3 • JavaScript ES6+

## Como executar

```bash
npm install
npm run dev
# Acesse: http://localhost:5173
```

Build de produção: `npm run build` (saída em `dist/`).

## Páginas
| Rota | Conteúdo |
|---|---|
| `/` | Início: hero animado, explorar por tipo, destaques, curiosidades e novidades |
| `/pokedex` | Lista completa da PokeAPI com busca, filtro por tipo/geração e scroll infinito |
| `/pokedex?type=fire` | Mesma listagem já filtrada por um tipo (usado pelos atalhos da navbar) |
| `/pokemon/:name` | Página de detalhe do Pokémon |

## Funcionalidades
1. **API completa** — todos os 1025 Pokémon via PokeAPI, com cache em memória.
2. **Busca** por nome ou número (com debounce) e **scroll infinito**.
3. **Filtros** por 18 tipos e 9 gerações.
4. **Página de detalhe** com stats animados, **fraquezas/resistências/imunidades**
   (calculadas pela tabela de tipos), cadeia de **evolução** clicável, entrada da
   Pokédex, habilidades, dados físicos e raridade (Lendário/Mítico).
5. **Curiosidades** e **Novidades** na página inicial.
6. **Animações** — radar do hero, Pokébola flutuante, hover dos cards, preenchimento
   das barras de status, transições de página (respeitando `prefers-reduced-motion`).
7. **Responsivo** em todos os breakpoints + **ícone próprio** (`public/favicon.svg`).

## Estrutura
```
src/
├── api/pokeapi.js        — cliente da PokeAPI (índice, pokémon, espécie, evolução)
├── assets/global.css     — design tokens, animações e estilos base
├── components/
│   ├── NavBar.vue         — navegação responsiva (logo Poketab + atalhos)
│   ├── PokemonCard.vue    — card que navega para a página de detalhe
│   ├── StatBar.vue        — barra de estatística animada
│   ├── TypeBadge.vue      — badge colorido de tipo
│   └── PokeballLoader.vue — loader em SVG
├── router/index.js
├── utils/
│   ├── format.js          — cores/labels de tipo, gerações, helpers
│   └── typeChart.js       — tabela de efetividade de tipos (fraquezas)
└── views/
    ├── Home.vue • Pokedex.vue • PokemonDetail.vue
```