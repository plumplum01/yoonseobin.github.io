import { useThemeStore } from '@/features/theme/themeStore'

export function useTheme() {
	const isDark = useThemeStore((state) => state.isDark)
	const toggleTheme = useThemeStore((state) => state.toggleTheme)

	return {
		isDark,
		toggleTheme,
	}
}
