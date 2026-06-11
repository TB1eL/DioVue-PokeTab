<template>
    <header class="nav-shell">
        <nav class="navbar">
            <router-link to="/" class="brand" @click="close">
                <img src="/favicon.svg" alt="" class="brand-mark" width="30" height="30" />
                <span class="brand-name">Poke<span class="brand-accent">tab</span></span>
            </router-link>

            <div class="links" :class="{ open: menuOpen }">
                <router-link to="/" class="link" exact-active-class="active" @click="close">Início</router-link>
                <router-link to="/pokedex" class="link" active-class="active" @click="close">Pokédex</router-link>
                <span class="sep"></span>
                <router-link v-for="q in quickTypes" :key="q.type" :to="`/pokedex?type=${q.type}`" class="link type-link" :style="{ '--c': q.color }" @click="close">{{ q.emoji }} {{ q.label }}</router-link>
            </div>

            <button class="hamburger" :class="{ active: menuOpen }" @click="menuOpen = !menuOpen" aria-label="Menu">
                <span></span><span></span><span></span>
            </button>
        </nav>
    </header>
</template>

