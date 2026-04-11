import { act, renderHook } from '@testing-library/react'
import { useThemeStore } from '../store/themeStore'

describe('useThemeStore', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
    act(() => useThemeStore.setState({ isDark: false }))
  })

  it('기본 상태는 isDark: false이다', () => {
    const { result } = renderHook(() => useThemeStore())
    expect(result.current.isDark).toBe(false)
  })

  it('toggleTheme 호출 시 isDark가 true로 바뀐다', () => {
    const { result } = renderHook(() => useThemeStore())
    act(() => result.current.toggleTheme())
    expect(result.current.isDark).toBe(true)
  })

  it('toggleTheme 두 번 호출 시 원래 상태로 돌아온다', () => {
    const { result } = renderHook(() => useThemeStore())
    act(() => { result.current.toggleTheme(); result.current.toggleTheme() })
    expect(result.current.isDark).toBe(false)
  })

  it('isDark가 true가 되면 document.documentElement에 dark 클래스가 추가된다', () => {
    const { result } = renderHook(() => useThemeStore())
    act(() => result.current.toggleTheme())
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('isDark가 false가 되면 document.documentElement에서 dark 클래스가 제거된다', () => {
    act(() => useThemeStore.setState({ isDark: true }))
    document.documentElement.classList.add('dark')
    const { result } = renderHook(() => useThemeStore())
    act(() => result.current.toggleTheme())
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('toggleTheme 호출 시 localStorage에 "dark"가 저장된다', () => {
    const { result } = renderHook(() => useThemeStore())
    act(() => result.current.toggleTheme())
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('toggleTheme 두 번 호출 시 localStorage에 "light"가 저장된다', () => {
    const { result } = renderHook(() => useThemeStore())
    act(() => { result.current.toggleTheme(); result.current.toggleTheme() })
    expect(localStorage.getItem('theme')).toBe('light')
  })
})
