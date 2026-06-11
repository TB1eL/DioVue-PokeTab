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