<template>
    <div class="type-page">
        <div class="page-header" :style="{ '--accent': accent, '--glow': glow }">
            <span class="page-icon">{{ icon }}</span>
            <div>
                <h1 class="page-title pixel">{{ title }}</h1>
                <p class="page-sub">{{ pokemon.length }} Pokémon iniciais • todas as gerações</p>
            </div>
        </div>

        <div class="search-wrap">
            <input v-model="search" type="text" class="search-input" placeholder="Buscar por nome ou número..." :style="{ '--accent': accent }"/>
            <div class="gen-filter">
                <button v-for="g in generations" :key="g" class="gen-btn" :class="{ active: activeGen === g }" :style="activeGen === g ?
                { background: accent, borderColor: accent } : { borderColor: accent + '55', color: accent }"
                @click="toggleGen(g)"> {{ g }}</button>
            </div>
        </div>

        <p class="result-count">
            Mostrando <strong>{{ filtered.length }}</strong> de {{ pokemon.length }} Pokémon
        </p>

        <div class="grid" v-if="filtered.length">
            <PokemonCard v-for="p in filtered" :key="p.id" :number="p.number" :name="p.name" :sprite="spriteUrl(p.id)"
            :spriteBig="spriteBigUrl(p.id)" :types="p.types" :accent="accent" :stats="p.stats" :height="p.height"
            :weight="p.weight" :gen="p.gen" :description="p.description"/>
        </div>

        <p class="empty" v-else>Nenhum Pokémon encontrado para "{{ search }}".</p>
  </div>
</template>

<script>
    import PokemonCard from './PokemonCard.vue'

    export default {
        name: 'TypePage',
        components: { PokemonCard },
        props: {
            title: String,
            icon: String,
            accent: String,
            glow: String,
            pokemon: Array
        },

        data() {
            return {
            search: '',
            activeGen: null
            }
        },

        computed: {
            generations() {
            const set = new Set(this.pokemon.map(p => p.gen))
            return [...set].sort()
            },
            filtered() {
            return this.pokemon.filter(p => {
                const q = this.search.toLowerCase()
                const matchSearch = p.name.toLowerCase().includes(q) || p.number.includes(q)
                const matchGen = !this.activeGen || p.gen === this.activeGen
                return matchSearch && matchGen
            })
            }
        },

        methods: {
            toggleGen(g) {
            this.activeGen = this.activeGen === g ? null : g
            },
            spriteUrl(id) {
            return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
            },
            spriteBigUrl(id) {
            return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
            }
        }
    }
</script>

<style scoped>
    .type-page { padding-bottom: 3rem; }

    .page-header {
        display: flex;
        align-items: center;
        gap: 1.2rem;
        background: linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));
        border: 1px solid rgba(255,255,255,0.06);
        border-left: 4px solid var(--accent);
        border-radius: 12px;
        padding: 1.2rem 1.5rem;
        margin-bottom: 1.8rem;
    }
    .page-icon { font-size: 2.2rem; }

    .page-title {
        font-family: 'Press Start 2P', monospace;
        font-size: clamp(0.7rem, 2.5vw, 1rem);
        color: var(--accent);
        margin-bottom: 0.35rem;
    }
    .page-sub { font-size: 0.8rem; color: #7a8ca0; }

    .search-wrap { margin-bottom: 1rem; }

    .search-input {
        width: 100%;
        padding: 0.65rem 1.1rem;
        border-radius: 999px;
        border: 2px solid rgba(255,255,255,0.08);
        background: #16213e;
        color: #eaeaea;
        font-size: 0.88rem;
        outline: none;
        transition: border-color 0.2s;
        margin-bottom: 0.8rem;
    }

    .search-input:focus { border-color: var(--accent); }

    .gen-filter { display: flex; gap: 0.4rem; flex-wrap: wrap; }

    .gen-btn {
        padding: 0.28rem 0.75rem;
        border-radius: 999px;
        border: 2px solid;
        background: none;
        font-size: 0.72rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.15s;
    }

    .gen-btn.active { color: #fff !important; }

    .result-count { font-size: 0.78rem; color: #7a8ca0; margin-bottom: 1.2rem; }
    .result-count strong { color: #eaeaea; }

    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(165px, 1fr));
        gap: 1rem;
    }

    .empty { text-align: center; color: #7a8ca0; margin-top: 3rem; font-size: 0.9rem; }
    
    .pixel { font-family: 'Press Start 2P', monospace; }
</style>