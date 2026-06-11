<template>
  <span class="badge" :style="{ '--c': color }" :class="{ sm: small }">
    <span class="dot"></span>{{ label }}
  </span>
</template>

<script>
    import { typeColor, typeLabel } from '../utils/format.js'
    export default {
        name: 'TypeBadge',
        props: {
            type: String,
            small: Boolean
        },
        computed: {
            color() { return typeColor(this.type) },
            label() { return typeLabel(this.type) }
        }
    }
</script>

<style scoped>
    .badge {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.28rem 0.7rem;
        border-radius: 999px;
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.02em;
        color: #fff;
        background: color-mix(in srgb, var(--c) 88%, #000 12%);
        border: 1px solid color-mix(in srgb, var(--c) 60%, #fff 10%);
        box-shadow: 0 4px 12px -6px var(--c);
        text-transform: none;
        white-space: nowrap;
    }

    .badge.sm { font-size: 0.64rem; padding: 0.2rem 0.55rem; }

    .dot {
        width: 7px; height: 7px; border-radius: 50%;
        background: #fff;
        opacity: 0.9;
        box-shadow: 0 0 6px rgba(255, 255, 255, 0.7);
    }
</style>