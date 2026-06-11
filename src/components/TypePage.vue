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