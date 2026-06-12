<template>
  <TypePage
    title="Pokémon de Fogo"
    icon="🔥"
    accent="#f44336"
    glow="rgba(244,67,54,0.15)"
    :pokemon="FIRE_STARTERS"
  />
</template>

<script>
import TypePage from '../components/TypePage.vue'
import { FIRE_STARTERS } from '../data/pokemon.js'

export default {
  name: 'Fire',
  components: { TypePage },
  data() { return { FIRE_STARTERS } }
}
</script>
