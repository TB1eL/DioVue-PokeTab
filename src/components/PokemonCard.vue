<template>
  <router-link :to="`/pokemon/${pokemon.name}`" class="card rise" :style="{ '--accent': accent, '--accent2': accent2, animationDelay: delay + 'ms' }">
        <span class="num">{{ number }}</span>
        <div class="img-wrap">
            <div class="aura"></div>
            <img :src="artwork" :alt="display" class="art" loading="lazy" @error="onError"/>
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
            pokemon: { type: Object, required: true },
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
        }
    }

    
</script>