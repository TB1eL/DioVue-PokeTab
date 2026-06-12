<template>
  <!-- Card que navega para a página de detalhes (router-link = redirecionamento correto) -->
  <router-link
    :to="`/pokemon/${pokemon.name}`"
    class="card rise"
    :style="{ '--accent': accent, '--accent2': accent2, animationDelay: delay + 'ms' }"
  >
    <span class="num">{{ number }}</span>

    <div class="img-wrap">
      <div class="aura"></div>
      <img
        :src="artwork"
        :alt="display"
        class="art"
        loading="lazy"
        @error="onError"
      />
    </div>

    <h3 class="name">{{ display }}</h3>

    <div class="types">
      <TypeBadge v-for="t in pokemon.types" :key="t" :type="t" small />
    </div>
  </router-link>
</template>

<script>
import TypeBadge from './TypeBadge.vue'
import { artworkUrl, spriteUrl } from '../api/pokeapi.js'
import { pad, prettyName, typeColor } from '../utils/format.js'

export default {
  name: 'PokemonCard',
  components: { TypeBadge },
  props: {
    pokemon: { type: Object, required: true }, // { id, name, types }
    index: { type: Number, default: 0 }
  },
  data() {
    return { src: artworkUrl(this.pokemon.id), triedSprite: false }
  },
  computed: {
    artwork() { return this.src },
    number() { return pad(this.pokemon.id) },
    display() { return prettyName(this.pokemon.name) },
    accent() { return typeColor(this.pokemon.types?.[0]) },
    accent2() { return typeColor(this.pokemon.types?.[1] || this.pokemon.types?.[0]) },
    delay() { return Math.min(this.index, 11) * 45 }
  },
  methods: {
    onError() {
      // Cai para o sprite menor caso a arte oficial não exista.
      if (!this.triedSprite) {
        this.triedSprite = true
        this.src = spriteUrl(this.pokemon.id)
      }
    }
  }
}
</script>

<style scoped>
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  padding: 1.4rem 1rem 1.1rem;
  border-radius: var(--r);
  background:
    radial-gradient(120% 80% at 50% -10%, color-mix(in srgb, var(--accent) 24%, transparent), transparent 60%),
    var(--surface);
  border: 1px solid var(--stroke);
  overflow: hidden;
  transition: transform 0.22s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.22s, box-shadow 0.22s;
}
.card::before {
  /* faixa de tipo no topo */
  content: '';
  position: absolute; inset: 0 0 auto 0; height: 3px;
  background: linear-gradient(90deg, var(--accent), var(--accent2));
  opacity: 0.9;
}
.card:hover {
  transform: translateY(-6px);
  border-color: color-mix(in srgb, var(--accent) 55%, transparent);
  box-shadow: 0 22px 44px -22px var(--accent);
}
.card:hover .art { transform: scale(1.1) translateY(-3px); }
.card:hover .aura { opacity: 0.85; transform: scale(1.12); }

.num {
  align-self: flex-end;
  font-family: var(--font-pixel);
  font-size: 0.5rem;
  color: var(--faint);
}
.img-wrap {
  position: relative;
  width: 116px; height: 116px;
  display: grid; place-items: center;
}
.aura {
  position: absolute; inset: 12px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--accent), transparent 68%);
  opacity: 0.5;
  filter: blur(8px);
  transition: opacity 0.3s, transform 0.3s;
}
.art {
  position: relative;
  width: 104px; height: 104px;
  object-fit: contain;
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.4));
}
.name {
  font-family: var(--font-display);
  font-size: 1.02rem;
  font-weight: 700;
  letter-spacing: 0.01em;
}
.types { display: flex; gap: 0.35rem; flex-wrap: wrap; justify-content: center; margin-top: 0.15rem; }
</style>
