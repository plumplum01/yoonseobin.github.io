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
import { X } from "lucide-react";
import { projects } from "../../lib/projects";
import ContentContainer from "../ContentContainer";
import Footer from "../Footer";
import DesktopCard from "../card/DesktopCard";
import { useScrollLock } from "../../hooks/useScrollLock";

const ICON_SIZE = 16;
import {
    DESKTOP_ITEMS,
    DESKTOP_ITEM_WIDTH_VW,
    DESKTOP_ITEM_GAP,
    ITEM_COUNT,
    WHEEL_SENSITIVITY,
    stepHeroFrame,
    type SelectedCard,
} from "./constants";
import styles from "./DesktopHero.module.css";

export default function DesktopHero() {
    // ─── 슬라이더 상태 ────────────────────────────────────────────────────────

    /** 슬라이더의 현재 X 위치 (framer-motion MotionValue) */
    const x = useMotionValue(0);

    /** 카드 한 세트의 전체 너비 (px) — resize 시 재계산 */
    const oneSetWidthRef = useRef(0);

    /** section 엘리먼트 참조 (Lenis eventsTarget 전용 — wheel 캡처) */
    const sectionRef = useRef<HTMLElement>(null);

    /**
     * Lenis wrapper 전용 invisible element. Lenis가 이 element에 scroll/
     * transform을 적용하지만 `visibility: hidden`이라 화면상 영향 없음.
     * section 자체를 wrapper로 쓰면 푸터/오버레이까지 함께 움직이는
     * 문제가 있어 별도 element로 격리.
     */
    const lenisWrapperRef = useRef<HTMLDivElement>(null);

    /**
     * Lenis content 대상 wide element. wrapper와의 폭 차이로 scroll limit이
     * 결정되며, 넉넉한 10M px을 잡아 실사용 범위를 초과 걱정 없이 둔다.
     */
    const lenisContentRef = useRef<HTMLDivElement>(null);

    /**
     * Lenis 인스턴스 ref. 단일 RAF 루프에서 `lenis.raf(time)`으로 수동 tick
     * 하기 위해 ref에 저장한다 (autoRaf: false).
     */
    const lenisRef = useRef<Lenis | null>(null);

    /** Lenis가 마지막으로 관측한 scroll 값 — 매 프레임 delta 계산용 */
    const lastLenisScrollRef = useRef(0);

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

    // ─── 단일 RAF 루프: Lenis tick → stepHeroFrame → x.set ────────────────
    // 이전에는 두 개의 RAF가 병렬로 돌았다 (Lenis autoRaf + useAnimationFrame).
    // 그리고 teleport는 x.on('change')에서 동기로 끼어들었다.
    // 문제: 서로 다른 프레임 실행 + teleport가 delta 중간에 끼어듦.
    //
    // 해결: autoRaf 끄고 우리 RAF 한 개에서 순서대로 처리.
    //   1) lenis.raf(time) — Lenis 내부 상태 진행
    //   2) lenisDelta 읽기
    //   3) stepHeroFrame(...) — delta + auto-scroll + 경계 wrap을 순수 함수로 계산
    //   4) x.set(next) — 프레임당 한 번만 MotionValue에 커밋
    //
    // 계산 로직은 stepHeroFrame에 격리되어 단위 테스트로 검증된다.
    // RAF 루프는 Lenis tick과 MotionValue I/O만 담당.

    useAnimationFrame((time) => {
        const lenis = lenisRef.current;
        let lenisDelta = 0;
        if (lenis) {
            lenis.raf(time);
            const current = lenis.scroll;
            lenisDelta = current - lastLenisScrollRef.current;
            lastLenisScrollRef.current = current;
        }

        const next = stepHeroFrame({
            x: x.get(),
            lenisDelta,
            autoScrollEnabled: !selectedCardRef.current,
            oneSetWidth: oneSetWidthRef.current,
        });
        x.set(next);
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

    // ─── Lenis 인스턴스 생성 (autoRaf: false) ──────────────────────────────
    // Lenis는 hero section의 wheel 이벤트를 lerp 기반 가상 스크롤로 변환만
    // 담당한다. RAF tick은 위의 단일 useAnimationFrame에서 수동으로 돌린다.
    //
    // - orientation: 'horizontal' + gestureOrientation: 'vertical'
    //   → 세로 휠 입력이 가로 가상 스크롤로 매핑
    // - smoothWheel + lerp: 0.08 → 부드러운 감속
    // - wheelMultiplier: WHEEL_SENSITIVITY → 튜닝된 민감도
    // - autoRaf: false → 단일 RAF 루프에서 lenis.raf(time) 수동 호출
    //
    // ref에 저장해 RAF 루프가 접근할 수 있게 한다. x는 의존성에 없어도
    // RAF 루프가 closure로 접근하므로 재구독 필요 없음.

    useEffect(() => {
        const section = sectionRef.current;
        const wrapper = lenisWrapperRef.current;
        const content = lenisContentRef.current;
        if (!section || !wrapper || !content) return;

        const lenis = new Lenis({
            wrapper,
            content,
            eventsTarget: section,
            orientation: "horizontal",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: WHEEL_SENSITIVITY,
            lerp: 0.08,
            autoRaf: false,
        });

        lenisRef.current = lenis;
        lastLenisScrollRef.current = lenis.scroll;

        return () => {
            lenis.destroy();
            lenisRef.current = null;
        };
    }, []);

    // ─── 렌더 ─────────────────────────────────────────────────────────────────

    return (
        <section ref={sectionRef} className={styles.section}>
            {/*
              * Lenis 전용 invisible scroll 컨테이너.
              * section 자체를 wrapper로 쓰면 Lenis가 section 전체에 scroll/
              * transform을 적용해 푸터까지 함께 움직이는 문제가 있어 별도
              * element로 격리. eventsTarget은 section이라 wheel 이벤트는
              * section 위 어디에서든 캡처된다.
              */}
            <div
                ref={lenisWrapperRef}
                aria-hidden
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "1px",
                    height: "1px",
                    overflow: "hidden",
                    visibility: "hidden",
                    pointerEvents: "none",
                }}
            >
                <div
                    ref={lenisContentRef}
                    style={{
                        width: "10000000px",
                        height: "1px",
                    }}
                />
            </div>
            {/* 무한 슬라이더 */}
            <div className={styles.sliderViewport}>
                <motion.div
                    style={{ x, gap: DESKTOP_ITEM_GAP }}
                    className={styles.sliderTrack}
                >
                    {DESKTOP_ITEMS.map((n, i) => (
                        <DesktopCard
                            key={i}
                            index={i}
                            n={n}
                            onSelect={selectCard}
                        />
                    ))}
                </motion.div>
            </div>

            {/* 하단 Footer */}
            <Footer variant="desktop" />

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
                                        <X size={ICON_SIZE} />
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
