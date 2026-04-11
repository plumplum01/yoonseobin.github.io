/**
 * Navbar — 네비게이션 최상위 컨테이너
 *
 * 상태(열림 여부) 관리, 반응형 클래스 선택, 스크롤 잠금, 패널 wrapper와
 * 배경 blur overlay 렌더만 담당한다. 실제 내용은 NavHeader(항상)와
 * NavMenu(열림 시) 서브컴포넌트로 위임하여, 각 섹션이 자체 모션을
 * 독립적으로 정의할 수 있도록 경계를 긋는다.
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollLock } from "../../hooks/useScrollLock";
import { useIsMobile } from "../../hooks/useIsMobile";
import NavHeader from "./NavHeader";
import NavMenu from "./NavMenu";
import styles from "./Navbar.module.css";

// ─── 패널 지오메트리 (framer-motion spring) ──────────────────────────────
// CSS는 색상·outline·블러·padding만 담당하고, width/height/border-radius는
// 아래 값을 타겟으로 JS-driven spring으로 애니메이션된다.
//
// ⚠ PANEL_CLOSED_HEIGHT(47) 는 Navbar.module.css 의 --nav-header-height 와
//    중복이다. 둘 중 하나를 수정하면 반드시 나머지도 맞춰야 한다
//    (NavHeader / NavMenu 가 CSS 변수 쪽을 cascade 로 참조 중).

const PANEL_WIDTH = { desktop: 300, mobile: 280 } as const;
const PANEL_EXPAND = { desktop: 120, mobile: 30 } as const;
const PANEL_CLOSED_HEIGHT = 47;
const PANEL_OPEN_HEIGHT = 200;
const PANEL_CLOSED_RADIUS = 100;
const PANEL_OPEN_RADIUS = 32;

const panelSpring = {
    type: "spring",
    bounce: 0.2,
    duration: 0.6,
} as const;

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const isMobile = useIsMobile();
    const { lock, unlock } = useScrollLock();

    // 메뉴 열릴 때 배경 스크롤 잠금
    useEffect(() => {
        if (isOpen) lock();
        else unlock();
    }, [isOpen, lock, unlock]);

    const variant = isMobile ? "mobile" : "desktop";
    const baseWidth = PANEL_WIDTH[variant];
    const openWidth = baseWidth + PANEL_EXPAND[variant];

    const panelClassName = [styles.panel, isOpen ? styles.isOpen : ""]
        .filter(Boolean)
        .join(" ");

    // 네비 본체는 닫힘 상태에서 translateY(40) 만큼 아래로 "숨어" 있다가
    // 메뉴가 열릴 때 0 으로 올라온다. CSS 의 .nav { top: 40px } 와 합쳐
    // 닫힘 = 80px, 열림 = 40px 의 위치가 된다. 열림 시 네비가 살짝
    // "떠오르는" 느낌을 주기 위한 의도적 디자인.
    const navAnimate = {
        translateY: isOpen ? 0 : 40,
    };

    const panelAnimate = {
        width: isOpen ? openWidth : baseWidth,
        height: isOpen ? PANEL_OPEN_HEIGHT : PANEL_CLOSED_HEIGHT,
        borderRadius: isOpen ? PANEL_OPEN_RADIUS : PANEL_CLOSED_RADIUS,
    };

    const closeMenu = () => setIsOpen(false);
    const toggleMenu = () => setIsOpen((o) => !o);

    return (
        <>
            {/* 배경 블러 오버레이 */}
            <motion.div
                className={styles.backdrop}
                initial={false}
                animate={{ opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                style={{ pointerEvents: isOpen ? "auto" : "none" }}
                onClick={closeMenu}
            />

            <motion.nav
                className={styles.nav}
                initial={false}
                animate={navAnimate}
                transition={panelSpring}
            >
                <motion.div
                    className={panelClassName}
                    initial={false}
                    animate={panelAnimate}
                    transition={panelSpring}
                >
                    <NavHeader
                        isOpen={isOpen}
                        onToggle={toggleMenu}
                        onClose={closeMenu}
                    />
                    <AnimatePresence>
                        {isOpen && (
                            <NavMenu key="nav-menu" onClose={closeMenu} />
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.nav>
        </>
    );
}
