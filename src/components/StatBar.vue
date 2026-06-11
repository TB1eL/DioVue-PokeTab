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