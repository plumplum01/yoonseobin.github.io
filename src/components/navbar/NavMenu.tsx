/**
 * NavMenu — 열렸을 때의 메뉴 내부 콘텐츠
 *
 * 페이지 이동 버튼(Home/About + Email)과 하단 크레딧 + 테마 토글을
 * 담당한다. AnimatePresence 아래에서 조건부 마운트되며, 자체 fade
 * 모션을 소유한다. 부모(Navbar)는 "언제 보일지"만 결정하고
 * "어떻게 나타날지"는 이 컴포넌트가 책임진다.
 */

import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import site from "../../data/site.json";
import ThemeToggle from "../ThemeToggle";
import styles from "./NavMenu.module.css";

interface Props {
    onClose: () => void;
}

export default function NavMenu({ onClose }: Props) {
    const navigate = useNavigate();
    const location = useLocation();
    const isHome = location.pathname === "/";

    const goTo = (path: string) => {
        navigate(path);
        onClose();
    };

    return (
        <motion.div
            className={styles.root}
            initial={{
                scale: 0.9,
                opacity: 0,
                filter: "blur(5px)",
            }}
            animate={{
                scale: 1,
                opacity: 1,
                filter: "blur(0px)",
                transition: { delay: 0.05 },
            }}
            exit={{
                scale: 0.9,
                opacity: 0,
                filter: "blur(5px)",
            }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
        >
            {/* 페이지 이동 버튼 */}
            <div className={styles.buttons}>
                {/* Home에선 About, About에선 Home 버튼 표시 */}
                {isHome ? (
                    <button
                        className={`t-nav ${styles.button}`}
                        onClick={() => goTo("/about")}
                    >
                        About
                    </button>
                ) : (
                    <button
                        className={`t-nav ${styles.button}`}
                        onClick={() => goTo("/")}
                    >
                        Home
                    </button>
                )}

                {/* 이메일 링크 */}
                <a
                    href={`mailto:${site.email}`}
                    className={`t-nav ${styles.button}`}
                >
                    Email
                </a>
            </div>

            {/* 하단: 크레딧 + 다크모드 토글 */}
            <footer className={styles.footer}>
                <span className={`t-caption ${styles.credit}`}>
                    {site.credit}
                </span>
                <div className={styles.toggle}>
                    <ThemeToggle />
                </div>
            </footer>
        </motion.div>
    );
}
