/**
 * ThemeToggle
 *
 * 다크/라이트 모드 전환 버튼. useTheme 훅을 통해 테마 상태를 구독하며
 * 상위에서 prop을 받지 않는다. GlobalNavigationBar에서 사용 중이지만 향후 다른
 * 설정/프로필 UI에도 재사용 가능하도록 네비 전용 폴더 대신
 * components/ 최상위에 둔다.
 */

import { Moon, Sun } from 'lucide-react'
import { IconButton } from '@/components/ui'
import { useTheme } from '@/hooks/useTheme'

const ICON_SIZE = 16

export default function ThemeToggle() {
	const { isDark, toggleTheme } = useTheme()

	return (
		<IconButton
			type="button"
			className="mb-0.5 text-[var(--on-dark-default)]"
			aria-label="모드 전환"
			onClick={toggleTheme}
		>
			{isDark ? <Moon size={ICON_SIZE} /> : <Sun size={ICON_SIZE} />}
		</IconButton>
	)
}
