import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'spendwise-theme'

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

    localStorage.setItem(
      STORAGE_KEY,
      isDark.value ? 'dark' : 'light'
    )

    applyTheme()
  }

  function initializeTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEY)

    isDark.value = savedTheme === 'dark'

    applyTheme()
  }

  return {
    isDark,
    toggleTheme,
    initializeTheme
  }
})