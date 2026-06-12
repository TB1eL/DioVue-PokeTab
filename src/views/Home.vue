<template>
  <div class="home">
    <!-- ============ HERO ============ -->
    <section class="hero">
      <div class="hero-copy rise">
        <p class="eyebrow">Pokédex Nacional · {{ totalLabel }} Pokémon</p>
        <h1 class="hero-title">
          Conheça cada Pokémon no <span class="grad">Poketab</span>
        </h1>
        <p class="hero-sub">
          Busque, filtre por tipo e geração e descubra stats, fraquezas,
          evoluções e curiosidades — tudo em um só lugar.
        </p>
        <div class="hero-actions">
          <router-link to="/pokedex" class="btn btn-brand">Abrir Pokédex →</router-link>
          <router-link to="/pokemon/pikachu" class="btn">Ver Pikachu</router-link>
        </div>
        <div class="hero-stats">
          <div><strong>{{ totalLabel }}</strong><span>Pokémon</span></div>
          <div><strong>18</strong><span>Tipos</span></div>
          <div><strong>9</strong><span>Gerações</span></div>
        </div>
      </div>

      <!-- Signature: radar com Pokébola girando -->
      <div class="hero-art" aria-hidden="true">
        <div class="radar">
          <span class="ring r1"></span>
          <span class="ring r2"></span>
          <span class="ring r3"></span>
          <span class="sweep"></span>
        </div>
        <div class="ball">
          <span class="ball-top"></span>
          <span class="ball-band"></span>
          <span class="ball-btn"></span>
        </div>
      </div>
    </section>

    <!-- ============ TIPOS ============ -->
    <section class="block">
      <div class="block-head">
        <h2 class="block-title">Explorar por tipo</h2>
        <router-link to="/pokedex" class="block-link">Ver todos →</router-link>
      </div>
      <div class="type-grid">
        <router-link
          v-for="t in featuredTypes"
          :key="t"
          :to="`/pokedex?type=${t}`"
          class="type-tile"
          :style="{ '--c': typeColor(t) }"
        >
          <span class="type-emoji">{{ emoji(t) }}</span>
          <span class="type-name">{{ typeLabel(t) }}</span>
        </router-link>
      </div>
    </section>

    <!-- ============ DESTAQUES ============ -->
    <section class="block">
      <div class="block-head">
        <h2 class="block-title">Pokémon em destaque</h2>
        <router-link to="/pokedex" class="block-link">Explorar →</router-link>
      </div>
      <div v-if="featured.length" class="featured-grid">
        <PokemonCard v-for="(p, i) in featured" :key="p.id" :pokemon="p" :index="i" />
      </div>
      <div v-else class="featured-grid">
        <div v-for="n in 5" :key="n" class="skeleton card-skel"></div>
      </div>
    </section>


  </div>
</template>

<script>
import PokemonCard from '../components/PokemonCard.vue'
import { getPokemon } from '../api/pokeapi.js'
import { typeColor, typeLabel, TYPE_EMOJI } from '../utils/format.js'

export default {
  name: 'Home',
  components: { PokemonCard },
  data() {
    return {
      featured: [],
      totalLabel: '1025',
      featuredTypes: ['fire', 'water', 'grass', 'electric', 'psychic', 'dragon', 'dark', 'fairy', 'ice', 'ghost'],
      // Conjunto rotativo de ícones para os destaques.
      pool: [3, 6, 9, 25, 94, 149, 248, 448, 658, 887, 778, 282, 380, 700],
      curiosities: [
        { icon: '🧬', title: 'Mais de mil espécies', text: 'A Pokédex Nacional já passou de 1000 Pokémon desde a 9ª geração, em Paldea.' },
        { icon: '🌈', title: 'Combinações de tipo', text: 'Cada Pokémon pode ter até dois tipos, somando 18 tipos e centenas de combinações possíveis.' },
        { icon: '✨', title: 'Pokémon Shiny', text: 'Versões "shiny" têm cores raras e aparecem por volta de 1 a cada 4096 encontros.' },
        { icon: '🦊', title: 'Rei das evoluções', text: 'Eevee pode evoluir para oito Pokémon diferentes — o maior número de evoluções da franquia.' },
        { icon: '🐟', title: 'Do fraco ao temível', text: 'Magikarp é famoso por ser quase inútil, mas evolui para o poderoso Gyarados.' },
        { icon: '⚡', title: 'O mascote', text: 'Pikachu é o rosto oficial da franquia e o Pokémon mais reconhecido do mundo.' }
      ],
      news: [
        { tag: 'Geração IX', color: '#a14de0', title: 'Bem-vindo a Paldea', text: 'Scarlet & Violet trouxeram um mundo aberto e dezenas de novos Pokémon para a Pokédex.' },
        { tag: 'Poketab', color: '#ec4747', title: 'Pokédex completa via API', text: 'Agora o Poketab carrega toda a Pokédex Nacional em tempo real através da PokeAPI.' },
        { tag: 'Detalhes', color: '#4d90d5', title: 'Fraquezas e curiosidades', text: 'Cada Pokémon mostra fraquezas, resistências, evoluções e entradas da Pokédex.' }
      ]
    }
  },
  async mounted() {
    // Sorteia 5 destaques diferentes a cada visita.
    const ids = [...this.pool].sort(() => Math.random() - 0.5).slice(0, 5)
    try {
      const list = await Promise.all(ids.map(id => getPokemon(id).catch(() => null)))
      this.featured = list.filter(Boolean).map(d => ({ id: d.id, name: d.name, types: d.types }))
    } catch (e) {
      console.error(e)
    }
  },
  methods: {
    typeColor, typeLabel,
    emoji(t) { return TYPE_EMOJI[t] || '◓' }
  }
}
</script>

<style scoped>
.home { padding-bottom: 1rem; }

/* ---------- HERO ---------- */
.hero {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  align-items: center;
  gap: 2rem;
  padding: 2.4rem 0 3.2rem;
}
.hero-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5.2vw, 3.4rem);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.025em;
  margin: 0.5rem 0 0.9rem;
}
.grad {
  background: linear-gradient(100deg, var(--brand-soft), var(--gold));
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.hero-sub { color: var(--muted); font-size: 1.02rem; line-height: 1.6; max-width: 34rem; }
.hero-actions { display: flex; gap: 0.7rem; margin: 1.4rem 0 1.8rem; flex-wrap: wrap; }
.hero-stats { display: flex; gap: 2.2rem; }
.hero-stats div { display: flex; flex-direction: column; }
.hero-stats strong { font-family: var(--font-display); font-size: 1.5rem; font-weight: 800; }
.hero-stats span { font-size: 0.78rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; }

/* Signature: radar + pokébola */
.hero-art {
  position: relative;
  display: grid; place-items: center;
  height: 320px;
}
.radar {
  position: absolute; inset: 0;
  display: grid; place-items: center;
}
.ring {
  position: absolute; border-radius: 50%;
  border: 1.5px solid var(--stroke-2);
}
.r1 { width: 300px; height: 300px; }
.r2 { width: 220px; height: 220px; }
.r3 { width: 140px; height: 140px; }
.sweep {
  position: absolute; width: 300px; height: 300px; border-radius: 50%;
  background: conic-gradient(from 0deg, transparent 0deg, rgba(236,71,71,0.28) 35deg, transparent 70deg);
  animation: radar 4s linear infinite;
}
.ball {
  position: relative; width: 132px; height: 132px;
  border-radius: 50%;
  background: #f4f7fc;
  border: 5px solid #0a0d18;
  overflow: hidden;
  box-shadow: 0 24px 50px -18px rgba(236, 71, 71, 0.6);
  animation: float 4.5s ease-in-out infinite;
}
.ball-top { position: absolute; inset: 0 0 50% 0; background: linear-gradient(180deg, #ff6b6b, #e23030); }
.ball-band { position: absolute; top: 50%; left: 0; right: 0; height: 9px; transform: translateY(-50%); background: #0a0d18; }
.ball-btn {
  position: absolute; top: 50%; left: 50%; width: 34px; height: 34px;
  transform: translate(-50%, -50%);
  border-radius: 50%; background: #f4f7fc; border: 5px solid #0a0d18;
  box-shadow: 0 0 0 3px #f4f7fc;
}

/* ---------- Blocos ---------- */
.block { margin: 2.6rem 0; }
.block-head {
  display: flex; align-items: baseline; justify-content: space-between;
  gap: 1rem; margin-bottom: 1.2rem;
}
.block-title {
  font-family: var(--font-display);
  font-size: clamp(1.3rem, 3.2vw, 1.7rem);
  font-weight: 800; letter-spacing: -0.01em;
}
.block-link { font-size: 0.85rem; font-weight: 600; color: var(--brand-soft); }
.block-link:hover { text-decoration: underline; }
.block-tag {
  font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em;
  color: var(--muted); border: 1px solid var(--stroke-2); padding: 0.3rem 0.7rem; border-radius: 999px;
}

/* Tipos */
.type-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 0.8rem;
}
.type-tile {
  display: flex; flex-direction: column; align-items: center; gap: 0.4rem;
  padding: 1.1rem 0.6rem;
  border-radius: var(--r);
  background: radial-gradient(120% 100% at 50% 0%, color-mix(in srgb, var(--c) 26%, transparent), var(--surface));
  border: 1px solid var(--stroke);
  transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
}
.type-tile:hover {
  transform: translateY(-4px);
  border-color: var(--c);
  box-shadow: 0 16px 30px -18px var(--c);
}
.type-emoji { font-size: 1.7rem; }
.type-name { font-weight: 700; font-size: 0.88rem; }

/* Destaques */
.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(168px, 1fr));
  gap: 1.1rem;
}
.card-skel { height: 226px; }

/* ---------- Responsivo ---------- */
@media (max-width: 760px) {
  .hero { grid-template-columns: 1fr; gap: 1rem; padding: 1.2rem 0 2rem; }
  .hero-art { height: 230px; order: -1; }
  .ball { width: 104px; height: 104px; }
  .r1 { width: 220px; height: 220px; } .sweep { width: 220px; height: 220px; }
  .r2 { width: 160px; height: 160px; } .r3 { width: 100px; height: 100px; }
  .hero-stats { gap: 1.6rem; }
  .news { flex-direction: column; align-items: flex-start; gap: 0.6rem; }
}
</style>
