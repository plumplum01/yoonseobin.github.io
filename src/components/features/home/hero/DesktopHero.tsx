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

import { motion, useAnimationFrame, useMotionValue } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
	DESKTOP_ITEM_GAP,
	DESKTOP_ITEM_WIDTH_VW,
	DESKTOP_ITEMS,
	ITEM_COUNT,
	type SelectedCard,
	stepHeroFrame,
	WHEEL_SENSITIVITY,
} from '@/components/features/home/hero/constants'
import styles from '@/components/features/home/hero/DesktopHero.module.css'
import ProjectOverlay from '@/components/features/home/hero/ProjectOverlay'
import DesktopCard from '@/components/features/projects/DesktopCard'
import Footer from '@/components/layouts/globals/GlobalFooter'
import { useMediaPreload } from '@/hooks/useMediaPreload'
import { useSmoothScroll } from '@/hooks/useSmoothScroll'
import { projects } from '@/registry/projects'

const projectThumbnailUrls = projects.map((project) => project.thumbnail)

type Props = {
	smoothScrollEnabled: boolean
}

export default function DesktopHero({ smoothScrollEnabled }: Props) {
	// ─── 슬라이더 상태 ────────────────────────────────────────────────────────

	/** 슬라이더의 현재 X 위치 (framer-motion MotionValue) */
	const x = useMotionValue(0)

	/** 카드 한 세트의 전체 너비 (px) — resize 시 재계산 */
	const oneSetWidthRef = useRef(0)

	/** section 엘리먼트 참조 (Lenis eventsTarget 전용 — wheel 캡처) */
	const sectionRef = useRef<HTMLElement>(null)

	/**
	 * Lenis wrapper 전용 invisible element. Lenis가 이 element에 scroll/
	 * transform을 적용하지만 `visibility: hidden`이라 화면상 영향 없음.
	 * section 자체를 wrapper로 쓰면 푸터/오버레이까지 함께 움직이는
	 * 문제가 있어 별도 element로 격리.
	 */
	const lenisWrapperRef = useRef<HTMLDivElement>(null)

	/**
	 * Lenis content 대상 wide element. wrapper와의 폭 차이로 scroll limit이
	 * 결정되며, 넉넉한 10M px을 잡아 실사용 범위를 초과 걱정 없이 둔다.
	 */
	const lenisContentRef = useRef<HTMLDivElement>(null)

	const { readScrollDelta } = useSmoothScroll({
		enabled: smoothScrollEnabled,
		wrapperRef: lenisWrapperRef,
		contentRef: lenisContentRef,
		eventsTargetRef: sectionRef,
		orientation: 'horizontal',
		gestureOrientation: 'vertical',
		smoothWheel: true,
		wheelMultiplier: WHEEL_SENSITIVITY,
		lerp: 0.08,
	})

	// ─── 오버레이 상태 ────────────────────────────────────────────────────────

	/** 현재 열려 있는 카드 정보 (null이면 닫힌 상태) */
	const [selectedCard, setSelectedCard] = useState<SelectedCard | null>(null)
	const selectedProject =
		selectedCard === null ? null : projects[(selectedCard.n - 1) % projects.length]

	/**
	 * ref로도 selectedCard를 추적합니다.
	 * useAnimationFrame 내부에서는 state 클로저가 stale해지므로
	 * ref를 통해 최신값을 참조합니다.
	 */
	const selectedCardRef = useRef<SelectedCard | null>(null)

	// ─── 카드 선택/해제 ───────────────────────────────────────────────────────

	const selectCard = useCallback((card: SelectedCard | null) => {
		selectedCardRef.current = card
		if (card) {
			// 슬라이더를 먼저 멈추고 한 프레임 뒤에 렌더링
			// → framer-motion이 velocity 없는 안정된 위치를 측정하도록
			requestAnimationFrame(() => setSelectedCard(card))
		} else {
			setSelectedCard(null)
		}
	}, [])

	const handleClose = useCallback(() => selectCard(null), [selectCard])

	// ─── 썸네일 이미지 프리디코드 ───────────────────────────────────────────
	// loading="eager"만으로는 브라우저가 뷰포트 바깥 카드 이미지를 fetch만 하고
	// 실제 decode는 paint 직전에야 한다. 스크롤 경계에서 카드가 진입하는 순간
	// decode 지연으로 빈 프레임이 보이는 현상을 방지하려고, 마운트 시점에
	// 모든 썸네일을 강제로 decode 요청해 브라우저 decoded bitmap 캐시에 올려둔다.

	useMediaPreload({
		images: projectThumbnailUrls,
	})

	// ─── 슬라이더 초기화 및 리사이즈 대응 ────────────────────────────────────

	useEffect(() => {
		const init = () => {
			const w =
				ITEM_COUNT * (window.innerWidth * (DESKTOP_ITEM_WIDTH_VW / 100) + DESKTOP_ITEM_GAP)
			oneSetWidthRef.current = w
			x.set(-w) // 중간 세트에서 시작
		}
		init()
		window.addEventListener('resize', init)
		return () => window.removeEventListener('resize', init)
	}, [x])

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
		const lenisDelta = readScrollDelta(time)

		const next = stepHeroFrame({
			x: x.get(),
			lenisDelta,
			autoScrollEnabled: !selectedCardRef.current,
			oneSetWidth: oneSetWidthRef.current,
		})
		x.set(next)
	})

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
					position: 'absolute',
					top: 0,
					left: 0,
					width: '1px',
					height: '1px',
					overflow: 'hidden',
					visibility: 'hidden',
					pointerEvents: 'none',
				}}
			>
				<div
					ref={lenisContentRef}
					style={{
						width: '10000000px',
						height: '1px',
					}}
				/>
			</div>
			{/* 무한 슬라이더 */}
			<div className={styles.sliderViewport}>
				<motion.div style={{ x, gap: DESKTOP_ITEM_GAP }} className={styles.sliderTrack}>
					{DESKTOP_ITEMS.map((n, i) => (
						<DesktopCard key={i} index={i} n={n} onSelect={selectCard} />
					))}
				</motion.div>
			</div>

			{/* 하단 Footer */}
			<Footer variant="desktop" />

			<ProjectOverlay
				project={selectedProject}
				onClose={handleClose}
				overlayKey="scroll-overlay"
				styles={styles}
				motionProps={{
					initial: { opacity: 0, y: 60 },
					animate: {
						opacity: 1,
						y: 0,
						transition: {
							duration: 0.3,
							ease: [0.25, 0.1, 0.25, 1],
						},
					},
					exit: {
						opacity: 0,
						y: -30,
						transition: {
							duration: 0.2,
							ease: [0.25, 0.1, 0.25, 1],
						},
					},
				}}
			/>
		</section>
	)
}
