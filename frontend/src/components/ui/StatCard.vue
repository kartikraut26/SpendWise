<template>
  <div class="glass-surface stat-card">
    <p class="stat-card-title">
      {{ title }}
    </p>

    <p class="stat-card-value">
      {{ value }}
    </p>

    <p
      v-if="subtitle"
      class="stat-card-subtitle"
    >
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },

  value: {
    type: String,
    required: true
  },

  subtitle: {
    type: String,
    default: ''
  }
})
</script>