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

</style>
