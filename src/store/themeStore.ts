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
function getInitialIsDark(): boolean {
  if (typeof window === 'undefined') return false
  const stored = localStorage.getItem('theme')
  if (stored !== null) return stored === 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  isDark: getInitialIsDark(),
  toggleTheme: () => {
    const next = !get().isDark
    set({ isDark: next })
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', next)
      localStorage.setItem('theme', next ? 'dark' : 'light')
    }
  },
}))

// 앱 시작 시 테마를 DOM에 즉시 적용
if (typeof window !== 'undefined') {
  document.documentElement.classList.toggle('dark', getInitialIsDark())
}
