<template>
  <div class="pokedex">
    <!-- Cabeçalho -->
    <header class="dex-head">
      <p class="eyebrow">Pokédex Nacional</p>
      <h1 class="dex-title">Explore <span class="count">{{ index.length || '…' }}</span> Pokémon</h1>
      <p class="dex-sub">Busque por nome ou número e filtre por tipo e geração.</p>
    </header>

    <!-- Controles -->
    <div class="controls">
      <div class="search-box">
        <svg class="s-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
        </svg>
        <input
          v-model="search"
          @input="debouncedRebuild"
          type="text"
          class="search-input"
          placeholder="Buscar Pokémon por nome ou número…"
          aria-label="Buscar Pokémon"
        />
        <button v-if="search" class="clear-search" @click="search=''; rebuild()" aria-label="Limpar busca">✕</button>
      </div>

      <!-- Tipos -->
      <div class="chip-row">
        <button
          v-for="t in allTypes"
          :key="t"
          class="chip type-chip"
          :class="{ active: activeType === t }"
          :style="{ '--c': typeColor(t) }"
          @click="setType(t)"
        >{{ typeLabel(t) }}</button>
      </div>

      <!-- Gerações -->
      <div class="chip-row gens">
        <button
          v-for="g in generations"
          :key="g.id"
          class="chip gen-chip"
          :class="{ active: activeGen === g.id }"
          @click="setGen(g.id)"
        >{{ g.label }}</button>
        <button v-if="hasFilters" class="chip clear-all" @click="clearFilters">Limpar filtros ✕</button>
      </div>
    </div>

    <!-- Contagem -->
    <p v-if="ready" class="result-count">
      <strong>{{ pool.length }}</strong> Pokémon encontrados
      <span v-if="activeTypeLoading"> · carregando tipo…</span>
    </p>

    <!-- Estado inicial -->
    <PokeballLoader v-if="!ready" label="Carregando a Pokédex…" />

    <!-- Grid -->
    <div v-else-if="cards.length" class="grid">
      <PokemonCard
        v-for="(p, i) in cards"
        :key="p.id"
        :pokemon="p"
        :index="i % batch"
      />
    </div>

    <!-- Vazio -->
    <div v-else-if="!loadingMore" class="empty">
      <span class="empty-emoji">🔍</span>
      <p>Nenhum Pokémon encontrado.</p>
      <button class="btn" @click="clearFilters">Limpar filtros</button>
    </div>

    <!-- Sentinela / carregando mais -->
    <div ref="sentinel" class="sentinel"></div>
    <PokeballLoader v-if="loadingMore && cards.length" label="Carregando mais…" />
  </div>
</template>

<script>
import PokemonCard from '../components/PokemonCard.vue'
import PokeballLoader from '../components/PokeballLoader.vue'
import { getIndex, getPokemon, getByType } from '../api/pokeapi.js'
import { ALL_TYPES } from '../utils/typeChart.js'
import { GENERATIONS, typeColor, typeLabel, pad } from '../utils/format.js'

export default {
  name: 'Pokedex',
  components: { PokemonCard, PokeballLoader },
  data() {
    return {
      index: [],
      pool: [],
      cards: [],
      cursor: 0,
      batch: 24,
      search: '',
      activeType: null,
      activeGen: null,
      typeIds: null,
      activeTypeLoading: false,
      ready: false,
      loadingMore: false,
      observer: null,
      searchTimer: null,
      allTypes: ALL_TYPES,
      generations: GENERATIONS
    }
  },
  computed: {
    hasFilters() {
      return !!(this.activeType || this.activeGen || this.search)
    }
  },
  async mounted() {
    try {
      this.index = await getIndex()
    } catch (e) {
      console.error(e)
    }
    this.ready = true
    // Aplica o filtro de tipo vindo da URL (?type=fire), se houver, e monta a lista.
    await this.applyType(this.$route.query.type)
    this.$nextTick(this.setupObserver)
  },
  // Reage à mudança de ?type na URL — necessário quando já estamos na Pokédex
  // e clicamos num atalho de tipo na navbar (a view não é remontada).
  watch: {
    '$route.query.type'(val) {
      if (this.ready) this.applyType(val)
    }
  },
  beforeUnmount() {
    if (this.observer) this.observer.disconnect()
  },
  methods: {
    typeColor, typeLabel,

    setupObserver() {
      if (!this.$refs.sentinel) return
      this.observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) this.loadBatch()
      }, { rootMargin: '600px' })
      this.observer.observe(this.$refs.sentinel)
    },

    debouncedRebuild() {
      clearTimeout(this.searchTimer)
      this.searchTimer = setTimeout(() => this.rebuild(), 250)
    },

    // Lê o tipo a partir da URL, busca os IDs daquele tipo e reconstrói a lista.
    // É o único ponto que aplica o filtro de tipo, seja na montagem, ao clicar
    // num chip, ou ao usar os atalhos da navbar.
    async applyType(qType) {
      const token = Symbol()
      this._typeToken = token
      if (qType && ALL_TYPES.includes(qType)) {
        this.activeType = qType
        this.activeTypeLoading = true
        let ids = new Set()
        try {
          const list = await getByType(qType)
          ids = new Set(list.map(p => p.id))
        } catch (e) {
          ids = new Set()
        }
        if (this._typeToken !== token) return // resultado obsoleto, ignora
        this.typeIds = ids
        this.activeTypeLoading = false
      } else {
        this.activeType = null
        this.typeIds = null
      }
      if (this._typeToken !== token) return
      this.rebuild()
    },

    // Clique num chip de tipo: só altera a URL — o watcher cuida do resto.
    setType(t) {
      const query = this.activeType === t ? {} : { type: t }
      this.$router.replace({ query })
    },

    setGen(g) {
      this.activeGen = this.activeGen === g ? null : g
      this.rebuild()
    },

    clearFilters() {
      this.search = ''
      this.activeGen = null
      // Se há tipo na URL, o watcher limpa o tipo e reconstrói; senão, reconstrói direto.
      if (this.$route.query.type) {
        this.$router.replace({ query: {} })
      } else {
        this.activeType = null
        this.typeIds = null
        this.rebuild()
      }
    },

    rebuild() {
      let list = this.index
      if (this.typeIds) list = list.filter(p => this.typeIds.has(p.id))
      if (this.activeGen) {
        const g = GENERATIONS.find(x => x.id === this.activeGen)
        list = list.filter(p => p.id >= g.range[0] && p.id <= g.range[1])
      }
      const q = this.search.trim().toLowerCase()
      if (q) {
        const qNum = q.replace(/^#/, '')
        list = list.filter(p =>
          p.name.includes(q) ||
          String(p.id) === qNum ||
          pad(p.id).toLowerCase().includes(q)
        )
      }
      this.pool = list
      this.cards = []
      this.cursor = 0
      this.loadBatch()
    },

    async loadBatch() {
      if (this.loadingMore || this.cursor >= this.pool.length) return
      this.loadingMore = true
      const slice = this.pool.slice(this.cursor, this.cursor + this.batch)
      this.cursor += this.batch
      try {
        const details = await Promise.all(
          slice.map(p => getPokemon(p.id).catch(() => ({ id: p.id, name: p.name, types: [] })))
        )
        // Evita duplicar se o pool mudou no meio do caminho.
        const existing = new Set(this.cards.map(c => c.id))
        for (const d of details) {
          if (!existing.has(d.id)) this.cards.push({ id: d.id, name: d.name, types: d.types })
        }
      } catch (e) {
        console.error(e)
      }
      this.loadingMore = false
    }
  }
}
</script>

<style scoped>
.pokedex { padding-bottom: 2rem; }

.dex-head { margin-bottom: 1.6rem; }
.dex-title {
  font-family: var(--font-display);
  font-size: clamp(1.7rem, 4.5vw, 2.6rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0.35rem 0 0.4rem;
}
.count { color: var(--brand-soft); }
.dex-sub { color: var(--muted); font-size: 0.95rem; }

/* Controles */
.controls {
  display: flex; flex-direction: column; gap: 0.8rem;
  margin-bottom: 1.4rem;
}
.search-box {
  position: relative;
  display: flex; align-items: center;
}
.s-icon { position: absolute; left: 1rem; color: var(--muted); }
.search-input {
  width: 100%;
  padding: 0.85rem 2.6rem;
  border-radius: 999px;
  border: 1.5px solid var(--stroke-2);
  background: var(--surface);
  color: var(--text);
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s, background 0.2s;
}
.search-input:focus { border-color: var(--brand-soft); background: var(--surface-2); }
.search-input::placeholder { color: var(--faint); }
.clear-search {
  position: absolute; right: 0.9rem;
  background: none; border: none; color: var(--muted);
  cursor: pointer; font-size: 0.95rem; padding: 0.3rem;
}

.chip-row {
  display: flex; gap: 0.4rem;
  overflow-x: auto;
  padding-bottom: 0.55rem;
  /* máscara que esmaece as bordas, indicando que há mais conteúdo ao rolar */
  -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 14px, #000 calc(100% - 14px), transparent 100%);
  mask-image: linear-gradient(90deg, transparent 0, #000 14px, #000 calc(100% - 14px), transparent 100%);
  scrollbar-width: thin;
  scrollbar-color: var(--stroke-2) transparent;
}
.chip-row::-webkit-scrollbar { height: 5px; }
.chip-row::-webkit-scrollbar-track { background: transparent; }
.chip-row::-webkit-scrollbar-thumb {
  background: var(--stroke-2);
  border: none;
  border-radius: 99px;
}
.chip-row::-webkit-scrollbar-thumb:hover { background: var(--brand-soft); }
.chip {
  flex: 0 0 auto;
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  border: 1.5px solid var(--stroke-2);
  background: var(--surface);
  color: var(--muted);
  font-size: 0.8rem; font-weight: 600;
  cursor: pointer;
  transition: all 0.18s;
}
.chip:hover { color: var(--text); border-color: var(--stroke-2); }
.type-chip.active {
  background: var(--c);
  border-color: var(--c);
  color: #fff;
  box-shadow: 0 6px 16px -8px var(--c);
}
.gen-chip.active {
  background: var(--brand);
  border-color: var(--brand);
  color: #fff;
}
.clear-all { color: var(--brand-soft); border-color: color-mix(in srgb, var(--brand) 40%, transparent); }

.result-count { font-size: 0.85rem; color: var(--muted); margin-bottom: 1.2rem; }
.result-count strong { color: var(--text); }

/* Grid responsivo */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(168px, 1fr));
  gap: 1.1rem;
}
@media (max-width: 480px) {
  .grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 0.8rem; }
}

.empty { text-align: center; padding: 3rem 0; color: var(--muted); }
.empty-emoji { font-size: 2.4rem; display: block; margin-bottom: 0.8rem; }
.empty .btn { margin-top: 1rem; }

.sentinel { height: 1px; }
</style>
