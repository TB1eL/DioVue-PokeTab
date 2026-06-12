<template>
  <TypePage
    title="Pokémon de Planta"
    icon="🌿"
    accent="#4caf50"
    glow="rgba(76,175,80,0.15)"
    :pokemon="GRASS_STARTERS"
  />
</template>

<script>
import TypePage from '../components/TypePage.vue'
import { GRASS_STARTERS } from '../data/pokemon.js'

export default {
  name: 'Grass',
  components: { TypePage },
  data() { return { GRASS_STARTERS } }
}
</script>
