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