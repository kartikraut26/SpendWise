<template>
  <button class="glass-button">
    <slot />
  </button>
</template>

<style scoped>
.glass-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-height: 42px;
  padding: 0 18px;

  border: 1px solid var(--button-border);
  border-radius: 12px;

  background: var(--button-bg);
  color: var(--button-text);

  font-size: 0.9rem;
  font-weight: 600;

  cursor: pointer;

  transition:
    transform 0.2s ease,
    background-color 0.3s ease;
}

.glass-button:hover {
  transform: translateY(-1px);
}

.glass-button:active {
  transform: translateY(0);
}
</style>