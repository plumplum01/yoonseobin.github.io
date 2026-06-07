/**
 * MobileHero
 *
 * md(768px) 미만에서 표시되는 모바일 메인 화면입니다.
 *
 * 구성:
 * - 프로젝트 카드 세로 목록
 * - 하단 이름/이메일 (Footer)
 * - 콘텐츠 오버레이: 카드를 탭하면 블러 배경 위로 상세 패널이 열립니다.
 */

import { useCallback, useState } from 'react'
import { projects } from '@/registry/projects'
import Footer from '@/components/layout/Footer'
import MobileCard from '@/components/features/projects/MobileCard'
import { ITEMS } from '@/components/features/home/hero/constants'
import ProjectOverlay from '@/components/features/home/hero/ProjectOverlay'
import styles from '@/components/features/home/hero/MobileHero.module.css'

export default function MobileHero() {
	/** 현재 열려 있는 카드 번호 (null이면 닫힌 상태) */
	const [selectedN, setSelectedN] = useState<number | null>(null)
	const selectedProject = selectedN === null ? null : projects[(selectedN - 1) % projects.length]

	const handleClose = useCallback(() => setSelectedN(null), [])

	// ─── 렌더 ─────────────────────────────────────────────────────────────────

	return (
		<section className={styles.section}>
			{/* 프로젝트 카드 목록 */}
			<div className={styles.cardList}>
				{ITEMS.map((n) => (
					<MobileCard key={n} n={n} onSelect={setSelectedN} />
				))}
			</div>

			{/* 하단 이름/이메일 */}
			<Footer variant="mobile" />

			<div className={styles.spacer} />

			<ProjectOverlay
				project={selectedProject}
				onClose={handleClose}
				overlayKey="mobile-scroll-overlay"
				styles={styles}
				motionProps={{
					initial: { opacity: 0, y: 20 },
					animate: {
						opacity: 1,
						y: 0,
						transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
					},
					exit: {
						opacity: 0,
						y: -80,
						transition: { duration: 0.35, ease: [0.4, 0, 0.6, 1] },
					},
				}}
			/>
		</section>
	)
}
