import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false)

  function applyTheme() {
    document.documentElement.setAttribute(
      'data-theme',
      isDark.value ? 'dark' : 'light'
    )
  }

  function toggleTheme() {
    isDark.value = !isDark.value
    applyTheme()
  }

  function initializeTheme() {
    isDark.value = false
    applyTheme()
  }

  return {
    isDark,
    toggleTheme,
    initializeTheme
  }
})