/**
 * NavHeader — 네비게이션 패널 상단 행
 *
 * 이름(클릭 시 홈으로 이동)과 메뉴 열기/닫기 토글 버튼.
 * 패널 열림/닫힘과 무관하게 항상 표시되며, isOpen에 따라
 * 토글 아이콘만 Menu ↔ X로 바뀐다.
 *
 * 텍스트와 아이콘 색은 CSS 커스텀 프로퍼티 --nav-fg 를 통해
 * 부모(.panel/.isOpen)가 결정한다 — lucide 아이콘은 currentColor로
 * 상속되므로 JSX에서 색을 지정하지 않는다.
 */

import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import site from "../../data/site.json";
import styles from "./NavHeader.module.css";

const MotionX = motion.create(X);
const MotionMenu = motion.create(Menu);

const iconMotion = {
    initial: { opacity: 0, scale: 0.5, filter: "blur(4px)" },
    animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
    exit: { opacity: 0, scale: 0.5, filter: "blur(4px)" },
};

const ICON_SIZE = 16;

interface Props {
    isOpen: boolean;
    onToggle: () => void;
    onClose: () => void;
}

export default function NavHeader({ isOpen, onToggle, onClose }: Props) {
    const navigate = useNavigate();

    const goHome = () => {
        navigate("/");
        onClose();
    };

    return (
        <header className={styles.header}>
            <span className={`t-nav ${styles.name}`} onClick={goHome}>
                {site.name}
            </span>
            <button
                onClick={onToggle}
                className={styles.menuToggle}
                aria-label={isOpen ? "메뉴 닫기" : "메뉴 열기"}
            >
                <AnimatePresence>
                    {isOpen ? (
                        <MotionX key="close" size={ICON_SIZE} {...iconMotion} />
                    ) : (
                        <MotionMenu
                            key="menu"
                            size={ICON_SIZE}
                            {...iconMotion}
                        />
                    )}
                </AnimatePresence>
            </button>
        </header>
    );
}
