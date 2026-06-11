<template>
  <span class="badge" :style="{ '--c': color }" :class="{ sm: small }">
    <span class="dot"></span>{{ label }}
  </span>
</template>