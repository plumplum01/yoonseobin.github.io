import { create } from 'zustand'

interface ThemeState {
  isDark: boolean
  toggleTheme: () => void
}

/**
 * 테마 상태 스토어
 *
 * isDark 변경 시 DOM 클래스와 localStorage를 동기화합니다.
 * ThemeContext 대신 이 스토어를 사용하세요.
 *
 *   import { useThemeStore } from '../store/themeStore'
 *   const { isDark, toggleTheme } = useThemeStore()
 */
export const useThemeStore = create<ThemeState>((set, get) => ({
  isDark: typeof window !== 'undefined' && localStorage.getItem('theme') === 'dark',
  toggleTheme: () => {
    const next = !get().isDark
    set({ isDark: next })
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', next)
      localStorage.setItem('theme', next ? 'dark' : 'light')
    }
  },
}))

// 앱 시작 시 저장된 테마를 DOM에 즉시 적용
if (typeof window !== 'undefined') {
  document.documentElement.classList.toggle(
    'dark',
    localStorage.getItem('theme') === 'dark',
  )
}
