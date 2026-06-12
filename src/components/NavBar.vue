<template>
  <header class="nav-shell">
    <nav class="navbar">
      <router-link to="/" class="brand" @click="close">
        <img src="/favicon.ico" alt="" class="brand-mark" width="30" height="30" />
        <span class="brand-name">Poke<span class="brand-accent">tab</span></span>
      </router-link>

      <div class="links" :class="{ open: menuOpen }">
        <router-link to="/" class="link" exact-active-class="active" @click="close">Início</router-link>
        <router-link to="/pokedex" class="link" active-class="active" @click="close">Pokédex</router-link>
        <span class="sep"></span>
        <router-link
          v-for="q in quickTypes"
          :key="q.type"
          :to="`/pokedex?type=${q.type}`"
          class="link type-link"
          :style="{ '--c': q.color }"
          @click="close"
        >{{ q.emoji }} {{ q.label }}</router-link>
      </div>

      <button class="hamburger" :class="{ active: menuOpen }" @click="menuOpen = !menuOpen" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </nav>
  </header>
</template>

<script>
import { TYPE_EMOJI, typeColor, typeLabel } from '../utils/format.js'

export default {
  name: 'NavBar',
  data() {
    return {
      menuOpen: false,
      quickTypes: ['fire', 'water', 'grass', 'electric'].map(type => ({
        type,
        emoji: TYPE_EMOJI[type],
        label: typeLabel(type),
        color: typeColor(type)
      }))
    }
  },
  watch: {
    $route() { this.close() }
  },
  methods: {
    close() { this.menuOpen = false }
  }
}
</script>

<style scoped>
.nav-shell {
  position: sticky; top: 0; z-index: 100;
  background: rgba(10, 13, 24, 0.72);
  backdrop-filter: blur(14px) saturate(140%);
  border-bottom: 1px solid var(--stroke);
}
.navbar {
  max-width: var(--maxw);
  margin: 0 auto;
  height: var(--nav-h);
  padding: 0 1.2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.brand { display: flex; align-items: center; gap: 0.6rem; }
.brand-mark { transition: transform 0.4s; }
.brand:hover .brand-mark { transform: rotate(20deg); }
.brand-name {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 1.32rem;
  letter-spacing: -0.01em;
}
.brand-accent { color: var(--brand-soft); }

.links { display: flex; align-items: center; gap: 0.35rem; margin-left: auto; }
.sep { width: 1px; height: 22px; background: var(--stroke-2); margin: 0 0.4rem; }

.link {
  padding: 0.5rem 0.85rem;
  border-radius: 999px;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--muted);
  transition: color 0.2s, background 0.2s;
}
.link:hover { color: var(--text); background: var(--surface); }
.link.active { color: var(--text); background: var(--surface-2); }
.type-link { font-size: 0.82rem; }
.type-link:hover { color: var(--c); }

.hamburger {
  display: none;
  flex-direction: column; gap: 5px;
  background: none; border: none; cursor: pointer;
  margin-left: auto;
  padding: 6px;
}
.hamburger span {
  display: block; width: 24px; height: 2.5px;
  background: var(--text); border-radius: 2px;
  transition: transform 0.3s, opacity 0.2s;
}
.hamburger.active span:nth-child(1) { transform: translateY(7.5px) rotate(45deg); }
.hamburger.active span:nth-child(2) { opacity: 0; }
.hamburger.active span:nth-child(3) { transform: translateY(-7.5px) rotate(-45deg); }

@media (max-width: 820px) {
  .hamburger { display: flex; }
  .links {
    position: absolute; top: var(--nav-h); left: 0; right: 0;
    flex-direction: column; align-items: stretch;
    gap: 0.15rem;
    margin: 0;
    padding: 0.6rem;
    background: rgba(10, 13, 24, 0.97);
    border-bottom: 1px solid var(--stroke);
    transform: translateY(-12px);
    opacity: 0; pointer-events: none;
    transition: transform 0.25s ease, opacity 0.25s ease;
  }
  .links.open { transform: translateY(0); opacity: 1; pointer-events: auto; }
  .link { padding: 0.8rem 1rem; font-size: 0.95rem; }
  .sep { display: none; }
}
</style>
