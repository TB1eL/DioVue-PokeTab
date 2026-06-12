<template>
  <div id="app-wrapper">
    <NavBar />
    <main>
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <footer class="footer">
      <div class="footer-inner">
        <span class="f-brand">Poke<span class="accent">tab</span></span>
        <p class="f-credits">
          Dados por <a href="https://pokeapi.co" target="_blank" rel="noopener">PokeAPI</a> ·
          Projeto de Gabriel, João &amp; Gabi
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'
export default {
  name: 'App',
  components: { NavBar }
}
</script>

<style>
#app-wrapper { display: flex; flex-direction: column; min-height: 100vh; }
main {
  flex: 1;
  width: 100%;
  max-width: var(--maxw);
  margin: 0 auto;
  padding: 2rem 1.2rem 3rem;
}
@media (max-width: 600px) { main { padding: 1.4rem 0.9rem 2.5rem; } }

.footer { border-top: 1px solid var(--stroke); margin-top: 2rem; }
.footer-inner {
  max-width: var(--maxw); margin: 0 auto;
  padding: 1.6rem 1.2rem;
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 0.6rem;
}
.f-brand { font-family: var(--font-display); font-weight: 800; font-size: 1.05rem; }
.f-brand .accent { color: var(--brand-soft); }
.f-credits { color: var(--muted); font-size: 0.82rem; }
.f-credits a { color: var(--brand-soft); }
</style>
