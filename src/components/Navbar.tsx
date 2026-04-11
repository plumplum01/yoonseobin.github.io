import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeStore } from "../store/themeStore";
import { useScrollLock } from "../hooks/useScrollLock";
import site from "../data/site.json";
import styles from "./Navbar.module.css";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
    const { isDark, toggleTheme } = useThemeStore();
    const { lock, unlock } = useScrollLock();

    useEffect(() => {
        const handler = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handler);
        return () => window.removeEventListener("resize", handler);
    }, []);

    const navigate = useNavigate();
    const location = useLocation();
    const isHome = location.pathname === "/";

    // 메뉴 열릴 때 배경 스크롤 잠금
    useEffect(() => {
        if (isOpen) lock();
        else unlock();
    }, [isOpen, lock, unlock]);

    const panelClassName = [
        styles.panel,
        isMobile ? styles.panelMobile : styles.panelDesktop,
        isOpen ? styles.panelOpen : '',
    ].filter(Boolean).join(' ');

    const menuButtonsClassName = [
        styles.menuButtons,
        isMobile ? styles.menuButtonsMobile : styles.menuButtonsDesktop,
    ].join(' ');

    return (
        <>
            {/* 배경 블러 오버레이 */}
            <motion.div
                className={styles.backdrop}
                initial={false}
                animate={{ opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                style={{ pointerEvents: isOpen ? "auto" : "none" }}
                onClick={() => setIsOpen(false)}
            />

            <nav className={styles.nav}>
                <div className={panelClassName}>
                    {/* 상단 타이틀 + 메뉴 버튼 */}
                    <div className={styles.header}>
                        <div />

                        {/* 이름 (홈으로 이동) */}
                        <span
                            className={`t-nav ${styles.name}`}
                            onClick={() => {
                                navigate("/");
                                setIsOpen(false);
                            }}
                        >
                            {site.name}
                        </span>

                        {/* 메뉴 열기/닫기 버튼 */}
                        <button
                            onClick={() => setIsOpen((o) => !o)}
                            className={styles.menuToggle}
                            aria-label={isOpen ? "메뉴 닫기" : "메뉴 열기"}
                        >
                            {isOpen ? "✕" : "≡"}
                        </button>
                    </div>

                    {/* 메뉴 콘텐츠 (열렸을 때) */}
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.15, delay: 0.08 }}
                                className={styles.menuContent}
                            >
                                {/* 페이지 이동 버튼 */}
                                <div className={menuButtonsClassName}>
                                    {/* Home에선 About, About에선 Home 버튼 표시 */}
                                    {isHome ? (
                                        <button
                                            className={`t-nav ${styles.menuButton}`}
                                            onClick={() => {
                                                navigate("/about");
                                                setIsOpen(false);
                                            }}
                                        >
                                            About
                                        </button>
                                    ) : (
                                        <button
                                            className={`t-nav ${styles.menuButton}`}
                                            onClick={() => {
                                                navigate("/");
                                                setIsOpen(false);
                                            }}
                                        >
                                            Home
                                        </button>
                                    )}

                                    {/* 이메일 링크 */}
                                    <a
                                        href={`mailto:${site.email}`}
                                        className={`t-nav ${styles.menuButton}`}
                                    >
                                        Email
                                    </a>
                                </div>

                                {/* 하단: 크레딧 + 다크모드 토글 */}
                                <div className={styles.footer}>
                                    <span className={`t-caption ${styles.credit}`}>
                                        {site.credit}
                                    </span>

                                    {/* 다크/라이트 모드 토글 */}
                                    <button
                                        className={styles.themeToggle}
                                        aria-label="모드 전환"
                                        onClick={toggleTheme}
                                    >
                                        {isDark ? (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                <path
                                                    d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"
                                                    fill="rgba(255,255,255,0.75)"
                                                />
                                            </svg>
                                        ) : (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                <circle cx="12" cy="12" r="4" fill="rgba(255,255,255,0.85)" />
                                                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                                                    <line
                                                        key={deg}
                                                        x1={12 + 6.5 * Math.cos((deg * Math.PI) / 180)}
                                                        y1={12 + 6.5 * Math.sin((deg * Math.PI) / 180)}
                                                        x2={12 + 9 * Math.cos((deg * Math.PI) / 180)}
                                                        y2={12 + 9 * Math.sin((deg * Math.PI) / 180)}
                                                        stroke="rgba(255,255,255,0.85)"
                                                        strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                    />
                                                ))}
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </nav>
        </>
    );
}
