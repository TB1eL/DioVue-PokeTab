<template>
  <div class="stat-row">
        <span class="stat-name">{{ label }}</span>
        <span class="stat-value">{{ value }}</span>
        <div class="stat-bar-bg">
            <div class="stat-bar-fill" :style="{ width: percent + '%', background: color }"></div>
        </div>
  </div>
</template>