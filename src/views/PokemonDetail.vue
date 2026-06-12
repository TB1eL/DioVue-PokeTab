<template>
  <div class="detail">
    <!-- Carregando -->
    <PokeballLoader v-if="loading" label="Carregando Pokémon…" />

    <!-- Erro -->
    <div v-else-if="error" class="error">
      <span class="err-emoji">😕</span>
      <h2>Pokémon não encontrado</h2>
      <p>Não foi possível carregar "{{ name }}".</p>
      <router-link to="/pokedex" class="btn btn-brand">Voltar à Pokédex</router-link>
    </div>

    <!-- Conteúdo -->
    <template v-else>
      <!-- Navegação topo -->
      <div class="topbar">
        <router-link to="/pokedex" class="back">← Pokédex</router-link>
        <div class="pager">
          <button class="pg" :disabled="poke.id <= 1" @click="goTo(poke.id - 1)" aria-label="Anterior">‹</button>
          <span class="pg-num">{{ number }}</span>
          <button class="pg" :disabled="poke.id >= 1025" @click="goTo(poke.id + 1)" aria-label="Próximo">›</button>
        </div>
      </div>

      <!-- Cabeçalho -->
      <header class="head" :style="{ '--accent': accent, '--accent2': accent2 }">
        <div class="head-glow"></div>
        <div class="head-art">
          <div class="art-aura"></div>
          <img :src="poke.artwork" :alt="display" class="art" @error="onArtError" />
        </div>
        <div class="head-info rise">
          <span class="number pixel">{{ number }}</span>
          <h1 class="name">{{ display }}</h1>
          <p v-if="species.genus" class="genus">{{ species.genus }}</p>
          <div class="head-badges">
            <TypeBadge v-for="t in poke.types" :key="t" :type="t" />
            <span class="gen-badge">{{ gen }}</span>
            <span v-if="rarity" class="rare-badge">{{ rarity }}</span>
          </div>
        </div>
      </header>

      <!-- Entrada da Pokédex (curiosidade) -->
      <section v-if="species.flavorText" class="card entry">
        <h2 class="card-title">📖 Entrada da Pokédex</h2>
        <p class="entry-text">{{ species.flavorText }}</p>
      </section>

      <div class="cols">
        <!-- Coluna esquerda -->
        <div class="col">
          <!-- Físico -->
          <section class="card">
            <h2 class="card-title">📐 Dados físicos</h2>
            <div class="facts">
              <div class="fact"><span>Altura</span><strong>{{ poke.height.toFixed(1) }} m</strong></div>
              <div class="fact"><span>Peso</span><strong>{{ poke.weight.toFixed(1) }} kg</strong></div>
              <div class="fact"><span>Exp. base</span><strong>{{ poke.baseExperience || '—' }}</strong></div>
              <div class="fact"><span>Felicidade</span><strong>{{ species.baseHappiness ?? '—' }}</strong></div>
            </div>
          </section>

          <!-- Habilidades -->
          <section class="card">
            <h2 class="card-title">🎯 Habilidades</h2>
            <div class="abilities">
              <span v-for="a in poke.abilities" :key="a.name" class="ability" :class="{ hidden: a.hidden }">
                {{ prettyName(a.name) }}
                <em v-if="a.hidden">oculta</em>
              </span>
            </div>
          </section>

          <!-- Evolução -->
          <section v-if="evolution.length > 1" class="card">
            <h2 class="card-title">🔄 Linha evolutiva</h2>
            <div class="evo">
              <template v-for="(e, i) in evolution" :key="e.id">
                <router-link :to="`/pokemon/${e.name}`" class="evo-item" :class="{ current: e.id === poke.id }">
                  <img :src="evoSprite(e.id)" :alt="prettyName(e.name)" loading="lazy" />
                  <span>{{ prettyName(e.name) }}</span>
                </router-link>
                <span v-if="i < evolution.length - 1" class="evo-arrow">→</span>
              </template>
            </div>
          </section>
        </div>

        <!-- Coluna direita -->
        <div class="col">
          <!-- Stats -->
          <section class="card">
            <h2 class="card-title">📊 Status base</h2>
            <StatBar
              v-for="s in poke.stats"
              :key="s.name"
              :name="s.name"
              :value="s.value"
              :color="accent"
            />
            <div class="total">
              <span>Total</span>
              <strong>{{ poke.totalStats }}</strong>
            </div>
          </section>

          <!-- Fraquezas e resistências -->
          <section class="card">
            <h2 class="card-title">⚔️ Efetividade de tipo</h2>

            <div class="matchup-group" v-if="matchups.weaknesses.length">
              <p class="matchup-label weak">Fraco contra</p>
              <div class="matchup-row">
                <span v-for="m in matchups.weaknesses" :key="m.type" class="matchup" :style="{ '--c': typeColor(m.type) }">
                  {{ typeLabel(m.type) }} <b>{{ multLabel(m.multiplier) }}</b>
                </span>
              </div>
            </div>

            <div class="matchup-group" v-if="matchups.resistances.length">
              <p class="matchup-label resist">Resiste a</p>
              <div class="matchup-row">
                <span v-for="m in matchups.resistances" :key="m.type" class="matchup" :style="{ '--c': typeColor(m.type) }">
                  {{ typeLabel(m.type) }} <b>{{ multLabel(m.multiplier) }}</b>
                </span>
              </div>
            </div>

            <div class="matchup-group" v-if="matchups.immunities.length">
              <p class="matchup-label immune">Imune a</p>
              <div class="matchup-row">
                <span v-for="m in matchups.immunities" :key="m.type" class="matchup" :style="{ '--c': typeColor(m.type) }">
                  {{ typeLabel(m.type) }} <b>0×</b>
                </span>
              </div>
            </div>
          </section>

          <!-- Mais curiosidades -->
          <section class="card">
            <h2 class="card-title">🔎 Mais sobre</h2>
            <div class="facts">
              <div v-if="species.habitat" class="fact"><span>Habitat</span><strong>{{ prettyName(species.habitat) }}</strong></div>
              <div v-if="species.growthRate" class="fact"><span>Crescimento</span><strong>{{ prettyName(species.growthRate) }}</strong></div>
              <div v-if="species.eggGroups.length" class="fact"><span>Grupo ovo</span><strong>{{ species.eggGroups.map(prettyName).join(', ') }}</strong></div>
              <div class="fact"><span>Captura</span><strong>{{ species.captureRate ?? '—' }}/255</strong></div>
            </div>
          </section>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import TypeBadge from '../components/TypeBadge.vue'
import StatBar from '../components/StatBar.vue'
import PokeballLoader from '../components/PokeballLoader.vue'
import { getPokemon, getSpecies, getEvolutionChain, spriteUrl, artworkUrl } from '../api/pokeapi.js'
import { typeMatchups } from '../utils/typeChart.js'
import { typeColor, typeLabel, pad, prettyName, genFromId } from '../utils/format.js'

export default {
  name: 'PokemonDetail',
  components: { TypeBadge, StatBar, PokeballLoader },
  props: { name: String },
  data() {
    return {
      loading: true,
      error: false,
      poke: null,
      species: { eggGroups: [] },
      evolution: []
    }
  },
  computed: {
    display() { return prettyName(this.poke.name) },
    number() { return pad(this.poke.id) },
    gen() { return genFromId(this.poke.id) },
    accent() { return typeColor(this.poke.types[0]) },
    accent2() { return typeColor(this.poke.types[1] || this.poke.types[0]) },
    matchups() { return typeMatchups(this.poke.types) },
    rarity() {
      if (this.species.isMythical) return '✦ Mítico'
      if (this.species.isLegendary) return '★ Lendário'
      return ''
    }
  },
  watch: {
    // Recarrega ao navegar entre Pokémon (evolução, anterior/próximo).
    name() { this.load() }
  },
  mounted() { this.load() },
  methods: {
    typeColor, typeLabel, prettyName,
    evoSprite(id) { return spriteUrl(id) },
    multLabel(m) {
      if (m === 4) return '4×'
      if (m === 2) return '2×'
      if (m === 0.5) return '½'
      if (m === 0.25) return '¼'
      return m + '×'
    },
    onArtError(e) { e.target.src = spriteUrl(this.poke.id) },
    goTo(id) { this.$router.push(`/pokemon/${id}`) },

    async load() {
      this.loading = true
      this.error = false
      try {
        const poke = await getPokemon(this.name)
        this.poke = poke
        const species = await getSpecies(poke.id)
        this.species = species
        this.evolution = species.evolutionChainUrl
          ? await getEvolutionChain(species.evolutionChainUrl)
          : []
      } catch (e) {
        console.error(e)
        this.error = true
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.detail { padding-bottom: 2rem; }

/* Topbar */
.topbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.2rem; }
.back { font-weight: 600; font-size: 0.88rem; color: var(--muted); }
.back:hover { color: var(--text); }
.pager { display: flex; align-items: center; gap: 0.6rem; }
.pg {
  width: 36px; height: 36px; border-radius: 50%;
  border: 1.5px solid var(--stroke-2); background: var(--surface);
  color: var(--text); font-size: 1.2rem; cursor: pointer;
  display: grid; place-items: center;
  transition: background 0.2s, transform 0.15s;
}
.pg:hover:not(:disabled) { background: var(--surface-2); transform: scale(1.08); }
.pg:disabled { opacity: 0.35; cursor: not-allowed; }
.pg-num { font-family: var(--font-pixel); font-size: 0.6rem; color: var(--muted); }

/* Cabeçalho */
.head {
  position: relative;
  display: grid;
  grid-template-columns: 280px 1fr;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  border-radius: var(--r-lg);
  border: 1px solid var(--stroke);
  background:
    radial-gradient(120% 120% at 0% 0%, color-mix(in srgb, var(--accent) 28%, transparent), transparent 55%),
    var(--surface);
  overflow: hidden;
  margin-bottom: 1.2rem;
}
.head-glow {
  position: absolute; top: -40%; right: -10%;
  width: 360px; height: 360px; border-radius: 50%;
  background: radial-gradient(circle, color-mix(in srgb, var(--accent2) 35%, transparent), transparent 65%);
  filter: blur(20px);
}
.head-art { position: relative; display: grid; place-items: center; height: 240px; }
.art-aura {
  position: absolute; width: 200px; height: 200px; border-radius: 50%;
  background: radial-gradient(circle, var(--accent), transparent 65%);
  opacity: 0.55; filter: blur(10px);
  animation: pulse-aura 4s ease-in-out infinite;
}
.art {
  position: relative; width: 220px; height: 220px; object-fit: contain;
  filter: drop-shadow(0 14px 22px rgba(0, 0, 0, 0.45));
  animation: float 4.5s ease-in-out infinite;
}
.head-info { position: relative; }
.number { font-size: 0.7rem; color: var(--faint); }
.name {
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 5vw, 2.8rem);
  font-weight: 800; letter-spacing: -0.02em;
  margin: 0.2rem 0;
}
.genus { color: var(--muted); font-size: 0.95rem; margin-bottom: 0.8rem; }
.head-badges { display: flex; gap: 0.45rem; flex-wrap: wrap; align-items: center; }
.gen-badge, .rare-badge {
  font-size: 0.72rem; font-weight: 700;
  padding: 0.3rem 0.7rem; border-radius: 999px;
  border: 1px solid var(--stroke-2); color: var(--muted);
}
.rare-badge { color: var(--gold); border-color: color-mix(in srgb, var(--gold) 45%, transparent); }

/* Cards */
.card {
  background: var(--surface);
  border: 1px solid var(--stroke);
  border-radius: var(--r);
  padding: 1.4rem;
  margin-bottom: 1.2rem;
}
.card-title { font-family: var(--font-display); font-size: 1.05rem; font-weight: 700; margin-bottom: 1rem; }
.entry-text { color: var(--muted); line-height: 1.65; font-size: 0.95rem; }

.cols { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; }
.col { min-width: 0; }

/* Facts */
.facts { display: grid; grid-template-columns: 1fr 1fr; gap: 0.9rem; }
.fact { display: flex; flex-direction: column; gap: 0.2rem; }
.fact span { font-size: 0.72rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; }
.fact strong { font-size: 0.95rem; font-weight: 700; }

/* Habilidades */
.abilities { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.ability {
  padding: 0.5rem 0.9rem; border-radius: 999px;
  background: var(--surface-2); border: 1px solid var(--stroke-2);
  font-size: 0.85rem; font-weight: 600;
}
.ability em { font-style: normal; color: var(--gold); font-size: 0.7rem; margin-left: 0.3rem; }

/* Evolução */
.evo { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
.evo-item {
  display: flex; flex-direction: column; align-items: center; gap: 0.2rem;
  padding: 0.6rem; border-radius: var(--r-sm);
  border: 1px solid transparent; transition: background 0.2s, border-color 0.2s, transform 0.2s;
}
.evo-item img { width: 64px; height: 64px; object-fit: contain; }
.evo-item span { font-size: 0.78rem; font-weight: 600; }
.evo-item:hover { background: var(--surface-2); transform: translateY(-2px); }
.evo-item.current { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 14%, transparent); }
.evo-arrow { color: var(--faint); font-size: 1.1rem; }

/* Total de stats */
.total {
  display: flex; align-items: center; justify-content: space-between;
  margin-top: 0.6rem; padding-top: 0.8rem;
  border-top: 1px solid var(--stroke);
}
.total span { font-size: 0.8rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; }
.total strong { font-family: var(--font-display); font-size: 1.3rem; font-weight: 800; }

/* Efetividade */
.matchup-group { margin-bottom: 1rem; }
.matchup-group:last-child { margin-bottom: 0; }
.matchup-label { font-size: 0.74rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.5rem; }
.matchup-label.weak { color: #ff8a6b; }
.matchup-label.resist { color: #7ddf9e; }
.matchup-label.immune { color: var(--muted); }
.matchup-row { display: flex; gap: 0.4rem; flex-wrap: wrap; }
.matchup {
  display: inline-flex; align-items: center; gap: 0.3rem;
  padding: 0.32rem 0.6rem; border-radius: 8px;
  font-size: 0.76rem; font-weight: 600;
  background: color-mix(in srgb, var(--c) 16%, transparent);
  border: 1px solid color-mix(in srgb, var(--c) 40%, transparent);
  color: var(--text);
}
.matchup b { color: var(--c); }

/* Erro */
.error { text-align: center; padding: 4rem 1rem; }
.err-emoji { font-size: 3rem; display: block; margin-bottom: 1rem; }
.error h2 { font-family: var(--font-display); margin-bottom: 0.4rem; }
.error p { color: var(--muted); margin-bottom: 1.4rem; }

/* Responsivo */
@media (max-width: 720px) {
  .head { grid-template-columns: 1fr; text-align: center; padding: 1.6rem; }
  .head-art { height: 200px; }
  .art, .art-aura { width: 180px; height: 180px; }
  .head-badges { justify-content: center; }
  .cols { grid-template-columns: 1fr; }
}
</style>
