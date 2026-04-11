/**
 * ThemeToggle
 *
 * 다크/라이트 모드 전환 버튼. themeStore에 직접 구독하며
 * 상위에서 prop을 받지 않는다. Navbar에서 사용 중이지만 향후 다른
 * 설정/프로필 UI에도 재사용 가능하도록 네비 전용 폴더 대신
 * components/ 최상위에 둔다.
 */

import { Sun, Moon } from "lucide-react";
import { useThemeStore } from "../store/themeStore";
import styles from "./ThemeToggle.module.css";

const ICON_SIZE = 16;

export default function ThemeToggle() {
    const { isDark, toggleTheme } = useThemeStore();

    return (
        <button
            className={styles.root}
            aria-label="모드 전환"
            onClick={toggleTheme}
        >
            {isDark ? <Moon size={ICON_SIZE} /> : <Sun size={ICON_SIZE} />}
        </button>
    );
}
