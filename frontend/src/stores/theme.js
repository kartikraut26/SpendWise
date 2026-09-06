import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'spendwise-theme'


function getSavedTheme() {
  const savedTheme =
    localStorage.getItem(STORAGE_KEY)

  if (
    savedTheme === 'dark' ||
    savedTheme === 'light'
  ) {
    return savedTheme
  }

  return 'light'
}


function applyTheme(theme) {
  document.documentElement.setAttribute(
    'data-theme',
    theme
  )
}


export const useThemeStore = defineStore(
  'theme',
  () => {

    const theme = ref(
      getSavedTheme()
    )


    const isDark = computed(
      () => theme.value === 'dark'
    )


    /*
     * Initialize the application theme.
     *
     * App.vue calls this when the application
     * starts, so this function MUST exist.
     */
    function initializeTheme() {

      const savedTheme =
        getSavedTheme()

      theme.value =
        savedTheme

      applyTheme(
        savedTheme
      )

      return savedTheme
    }


    /*
     * Change the theme explicitly.
     */
    function setTheme(
      newTheme
    ) {

      if (
        newTheme !== 'dark' &&
        newTheme !== 'light'
      ) {
        return
      }

      theme.value =
        newTheme

      localStorage.setItem(
        STORAGE_KEY,
        newTheme
      )

      applyTheme(
        newTheme
      )
    }


    /*
     * Toggle between light and dark.
     */
    function toggleTheme() {

      setTheme(
        isDark.value
          ? 'light'
          : 'dark'
      )
    }


    /*
     * Make sure the current theme is
     * applied as soon as the store is created.
     */
    applyTheme(
      theme.value
    )


    return {
      theme,
      isDark,

      initializeTheme,
      setTheme,
      toggleTheme
    }

  }
)