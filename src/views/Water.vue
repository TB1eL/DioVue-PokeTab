<template>
  <TypePage
    title="Pokémon de Água"
    icon="💧"
    accent="#2196f3"
    glow="rgba(33,150,243,0.15)"
    :pokemon="WATER_STARTERS"
  />
</template>

<script>
import TypePage from '../components/TypePage.vue'
import { WATER_STARTERS } from '../data/pokemon.js'

export default {
  name: 'Water',
  components: { TypePage },
  data() { return { WATER_STARTERS } }
}
</script>
