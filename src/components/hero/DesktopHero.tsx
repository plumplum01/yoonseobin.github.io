/**
 * DesktopHero
 *
 * md(768px) 이상에서 표시되는 데스크탑 메인 화면입니다.
 *
 * 구성:
 * - 무한 슬라이더: 프로젝트 카드를 가로로 나열하고 자동 스크롤합니다.
 *   마우스 휠/트랙패드 세로 입력이 가로 이동에 연결됩니다.
 * - 콘텐츠 오버레이: 카드를 클릭하면 블러 배경 위로 상세 패널이 열립니다.
 * - Footer: 화면 하단에 이름과 이메일을 표시합니다.
 */

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
    AnimatePresence,
    motion,
    useMotionValue,
    useAnimationFrame,
} from "framer-motion";
import Lenis from "lenis";
import { projects } from "../../lib/projects";
import site from "../../data/site.json";
import ContentContainer from "../ContentContainer";
import { useScrollLock } from "../../hooks/useScrollLock";
import {
    DESKTOP_ITEMS,
    DESKTOP_ITEM_WIDTH_VW,
    DESKTOP_ITEM_GAP,
    AUTO_SCROLL_SPEED,
    ITEM_COUNT,
    WHEEL_SENSITIVITY,
    type SelectedCard,
} from "./constants";
import styles from "./DesktopHero.module.css";

export default function DesktopHero() {
    // ─── 슬라이더 상태 ────────────────────────────────────────────────────────

    /** 슬라이더의 현재 X 위치 (framer-motion MotionValue) */
    const x = useMotionValue(0);

    /** 카드 한 세트의 전체 너비 (px) — resize 시 재계산 */
    const oneSetWidthRef = useRef(0);

    /** wheel 이벤트 리스너를 붙일 section 엘리먼트 참조 (Lenis wrapper) */
    const sectionRef = useRef<HTMLElement>(null);

    /**
     * Lenis의 content 대상으로 쓸 보이지 않는 wide element 참조.
     * Lenis는 wrapper/content 차이로 scroll limit을 계산하므로 content가
     * wrapper보다 커야 scroll 델타가 발생한다. 실제 카드 이동은 x MotionValue
     * 기반이라 이 element 자체의 transform은 시각적으로 무의미 — scroll
     * 소스 역할만 한다.
     */
    const lenisContentRef = useRef<HTMLDivElement>(null);

    // ─── 오버레이 상태 ────────────────────────────────────────────────────────

    /** 현재 열려 있는 카드 정보 (null이면 닫힌 상태) */
    const [selectedCard, setSelectedCard] = useState<SelectedCard | null>(null);
    const { lock, unlock } = useScrollLock();

    /**
     * ref로도 selectedCard를 추적합니다.
     * useAnimationFrame 내부에서는 state 클로저가 stale해지므로
     * ref를 통해 최신값을 참조합니다.
     */
    const selectedCardRef = useRef<SelectedCard | null>(null);

    // ─── 카드 선택/해제 ───────────────────────────────────────────────────────

    const selectCard = (card: SelectedCard | null) => {
        selectedCardRef.current = card;
        if (card) {
            // 슬라이더를 먼저 멈추고 한 프레임 뒤에 렌더링
            // → framer-motion이 velocity 없는 안정된 위치를 측정하도록
            requestAnimationFrame(() => setSelectedCard(card));
        } else {
            setSelectedCard(null);
        }
    };

    const handleClose = () => selectCard(null);

    // ─── 썸네일 이미지 프리디코드 ───────────────────────────────────────────
    // loading="eager"만으로는 브라우저가 뷰포트 바깥 카드 이미지를 fetch만 하고
    // 실제 decode는 paint 직전에야 한다. 스크롤 경계에서 카드가 진입하는 순간
    // decode 지연으로 빈 프레임이 보이는 현상을 방지하려고, 마운트 시점에
    // 모든 썸네일을 강제로 decode 요청해 브라우저 decoded bitmap 캐시에 올려둔다.

    useEffect(() => {
        projects.forEach((project) => {
            if (!project.thumbnail) return;
            const img = new Image();
            img.src = project.thumbnail;
            img.decode().catch(() => {
                /* decode 실패는 무시 — 최악의 경우 기존 동작과 동일 */
            });
        });
    }, []);

    // ─── 슬라이더 초기화 및 리사이즈 대응 ────────────────────────────────────

    useEffect(() => {
        const init = () => {
            const w =
                ITEM_COUNT *
                (window.innerWidth * (DESKTOP_ITEM_WIDTH_VW / 100) +
                    DESKTOP_ITEM_GAP);
            oneSetWidthRef.current = w;
            x.set(-w); // 중간 세트에서 시작
        };
        init();
        window.addEventListener("resize", init);
        return () => window.removeEventListener("resize", init);
    }, [x]);

    // ─── 무한 루프: 경계 도달 시 중간 세트로 순간이동 ────────────────────────

    useEffect(() => {
        return x.on("change", (latest) => {
            const w = oneSetWidthRef.current;
            if (!w) return;
            if (latest <= -2 * w) x.set(latest + w);
            else if (latest >= 0) x.set(latest - w);
        });
    }, [x]);

    // ─── 자동 스크롤: 오버레이가 열리면 멈춤 ─────────────────────────────

    useAnimationFrame(() => {
        if (!selectedCardRef.current) {
            x.set(x.get() - AUTO_SCROLL_SPEED);
        }
    });

    // ─── ESC 키로 오버레이 닫기 ───────────────────────────────────────────────

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") handleClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    // ─── 오버레이 열릴 때 body 스크롤 잠금 ───────────────────────────────────

    useEffect(() => {
        if (selectedCard) lock();
        else unlock();
    }, [selectedCard, lock, unlock]);

    // ─── 휠 → 가로 이동 연결 (Lenis 스무딩) ────────────────────────────────
    // Lenis 인스턴스가 hero section의 wheel 이벤트를 가로채 lerp 기반
    // 부드러운 가상 스크롤로 변환한다. 가상 스크롤 델타(lenis.scroll의 프레임
    // 간 변화량)를 x MotionValue에 가산하면 카드가 관성을 가진 채 움직인다.
    //
    // - orientation: 'horizontal' + gestureOrientation: 'vertical'
    //   → 세로 휠 입력이 가로 가상 스크롤로 매핑
    // - smoothWheel + lerp: 0.1 → 부드러운 감속
    // - wheelMultiplier: WHEEL_SENSITIVITY → 기존 민감도 유지
    // - naiveDimensions + content === wrapper → 실제 DOM 스크롤 없이 가상값만 사용
    // - autoRaf → lenis가 RAF 루프 자체 운영
    //
    // 기존 auto-scroll(useAnimationFrame)과 무한 루프 핸들러(x.on('change'))는
    // 그대로 유지되고, 셋 다 x에만 독립적으로 쓴다.

    useEffect(() => {
        const wrapper = sectionRef.current;
        const content = lenisContentRef.current;
        if (!wrapper || !content) return;

        const lenis = new Lenis({
            wrapper,
            content,
            orientation: "horizontal",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: WHEEL_SENSITIVITY,
            lerp: 0.1,
            autoRaf: true,
        });

        let lastScroll = lenis.scroll;
        const unsubscribe = lenis.on("scroll", (instance: Lenis) => {
            const delta = instance.scroll - lastScroll;
            lastScroll = instance.scroll;
            // lenis scroll이 증가하면 카드는 왼쪽으로 (x 감소)
            x.set(x.get() - delta);
        });

        return () => {
            unsubscribe();
            lenis.destroy();
        };
    }, [x]);

    // ─── 렌더 ─────────────────────────────────────────────────────────────────

    return (
        <section ref={sectionRef} className={styles.section}>
            {/*
              * Lenis 가상 scroll 범위 확보용 invisible content.
              * 10M px 폭으로 lenis scroll limit을 충분히 잡아둔다. 카드 이동은
              * x MotionValue가 담당하므로 이 element는 시각적 역할 없음.
              */}
            <div
                ref={lenisContentRef}
                aria-hidden
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "10000000px",
                    height: "1px",
                    visibility: "hidden",
                    pointerEvents: "none",
                }}
            />
            {/* 무한 슬라이더 */}
            <div className={styles.sliderViewport}>
                <motion.div
                    style={{ x, gap: DESKTOP_ITEM_GAP }}
                    className={styles.sliderTrack}
                >
                    {DESKTOP_ITEMS.map((n, i) => {
                        const isEven = n % 2 === 0;
                        const bg = isEven
                            ? "var(--card-even)"
                            : "var(--card-odd)";

                        return (
                            <div
                                key={i}
                                className={styles.card}
                                style={{
                                    width: `${DESKTOP_ITEM_WIDTH_VW}vw`,
                                    marginTop: isEven ? "17.7vh" : "30.2vh",
                                }}
                                onClick={() =>
                                    selectCard({ index: i, n, bg })
                                }
                            >
                                {/* 카드 이미지 */}
                                <div
                                    className={styles.cardImage}
                                    style={{
                                        height: isEven ? "63.7vh" : "51.1vh",
                                        backgroundColor: bg,
                                    }}
                                >
                                    {projects[(n - 1) % projects.length]
                                        .thumbnail && (
                                        <img
                                            src={
                                                projects[
                                                    (n - 1) % projects.length
                                                ].thumbnail
                                            }
                                            alt={
                                                projects[
                                                    (n - 1) % projects.length
                                                ].title
                                            }
                                            loading="eager"
                                            decoding="async"
                                            draggable={false}
                                        />
                                    )}
                                </div>

                                {/* 카드 텍스트 */}
                                <div className={styles.cardText}>
                                    <p
                                        className={`t-card-title ${styles.cardTitle}`}
                                    >
                                        {
                                            projects[(n - 1) % projects.length]
                                                .title
                                        }
                                    </p>
                                    <p
                                        className={`t-card-subtitle ${styles.cardSubtitle}`}
                                    >
                                        {
                                            projects[(n - 1) % projects.length]
                                                .subtitle
                                        }
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </motion.div>
            </div>

            {/* 하단 Footer */}
            <footer className={`t-footer ${styles.footer}`}>
                <span>{site.nameDisplay}</span>
                <span>ⓒ2026</span>
                <a href={`mailto:${site.email}`}>{site.email}</a>
            </footer>

            {/* 콘텐츠 오버레이 — body에 Portal로 렌더링 (z-index 스택 충돌 방지) */}
            {createPortal(
                <>
                    {/* 블러 배경 — 항상 DOM에 존재하여 GPU 레이어를 미리 확보, opacity만 전환 */}
                    <motion.div
                        className={styles.backdrop}
                        initial={false}
                        animate={{ opacity: selectedCard ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            pointerEvents: selectedCard ? "auto" : "none",
                        }}
                        onClick={handleClose}
                    />

                    {/* 콘텐츠 패널 */}
                    <AnimatePresence>
                        {selectedCard !== null && (
                            <motion.div
                                key="scroll-overlay"
                                className={styles.overlay}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    transition: {
                                        duration: 0.3,
                                        ease: [0.4, 0, 0.2, 1],
                                    },
                                }}
                                exit={{
                                    opacity: 0,
                                    y: -80,
                                    transition: {
                                        duration: 0.35,
                                        ease: [0.4, 0, 0.6, 1],
                                    },
                                }}
                                onClick={handleClose}
                            >
                                <motion.div
                                    className={styles.panel}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <ContentContainer
                                        project={
                                            projects[
                                                (selectedCard.n - 1) %
                                                    projects.length
                                            ]
                                        }
                                        onClose={handleClose}
                                    />
                                </motion.div>

                                {/* 하단 닫기 버튼 — 블러 영역 */}
                                <div className={styles.closeWrapper}>
                                    <button
                                        className={styles.closeButton}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleClose();
                                        }}
                                    >
                                        <svg
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                        >
                                            <path d="M18 6L6 18M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>,
                document.body,
            )}
        </section>
    );
}
