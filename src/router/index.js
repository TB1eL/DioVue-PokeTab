import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'

// Lazy loading das páginas pesadas (melhora o carregamento inicial).
const Pokedex = () => import('../views/Pokedex.vue')
const PokemonDetail = () => import('../views/PokemonDetail.vue')

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/pokedex', name: 'pokedex', component: Pokedex },
  { path: '/pokemon/:name', name: 'detail', component: PokemonDetail, props: true },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
