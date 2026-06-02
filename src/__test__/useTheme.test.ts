import { act, renderHook } from '@testing-library/react'
import { useThemeStore } from '../features/theme/themeStore'
import { useTheme } from '../hooks/useTheme'

describe('useTheme', () => {
	beforeEach(() => {
		localStorage.clear()
		document.documentElement.classList.remove('dark')
		act(() => useThemeStore.setState({ isDark: false }))
	})

	it('theme store 상태와 액션을 UI용 훅으로 제공한다', () => {
		const { result } = renderHook(() => useTheme())

		expect(result.current.isDark).toBe(false)

		act(() => result.current.toggleTheme())

		expect(result.current.isDark).toBe(true)
		expect(document.documentElement.classList.contains('dark')).toBe(true)
		expect(localStorage.getItem('theme')).toBe('dark')
	})
})
