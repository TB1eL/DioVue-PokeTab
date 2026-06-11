<template>
  <div class="stat-row">
        <span class="stat-name">{{ label }}</span>
        <span class="stat-value">{{ value }}</span>
        <div class="stat-bar-bg">
            <div class="stat-bar-fill" :style="{ width: percent + '%', background: color }"></div>
        </div>
  </div>
</template>

<script>
    import { statLabel } from '../utils/format.js'
    export default {
        name: 'StatBar',
        props: {
            name: String,
            value: Number,
            max: { type: Number, default: 200 },
            color: { type: String, default: '#ec4747' }
        },
        computed: {
            percent() { return Math.min((this.value / this.max) * 100, 100) },
            label() { return statLabel(this.name) }
        }
    }
</script>

<style scoped>
    .stat-row {
        display: grid;
        grid-template-columns: 86px 36px 1fr;
        align-items: center;
        gap: 0.7rem;
        margin-bottom: 0.6rem;
    }

    .stat-name {
        font-size: 0.72rem;
        font-weight: 600;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.04em;
    }

    .stat-value {
        font-size: 0.85rem;
        font-weight: 700;
        text-align: right;
        font-variant-numeric: tabular-nums;
    }

    
</style>