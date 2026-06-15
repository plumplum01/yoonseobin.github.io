/**
 * Cursor
 *
 * 커스텀 커서 + 컨텍스트 변형 인터랙션.
 * - pointer: fine 기기(마우스)에서만 렌더
 * - 기본: 작은 dot / 카드 위: "OPEN" 원형 확장 / 캐러셀: 방향 화살표 / 링크·버튼: 중간 dot
 * - mix-blend-difference로 배경 대비 확보
 */

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import styles from '@/components/layout/GlobalCursor.module.css'

type CursorState = 'default' | 'card' | 'carouselNext' | 'carouselPrev' | 'link'

function getCursorState(event: MouseEvent): CursorState {
	const target = event.target
	if (!(target instanceof Element)) return 'default'

	if (target.closest('[data-cursor="card"]')) return 'card'
	if (target.closest('a, button, [data-cursor="link"]')) return 'link'
	if (target.closest('video')) return 'default'

	const carousel = target.closest('[data-cursor="carousel"]')
	if (!carousel) return 'default'

	const rect = carousel.getBoundingClientRect()
	const midpoint = rect.left + rect.width / 2
	return event.clientX < midpoint ? 'carouselPrev' : 'carouselNext'
}

function CursorContent({ state }: { state: CursorState }) {
	if (state === 'card') return <span className={styles.label}>OPEN</span>
	if (state === 'carouselPrev') return <ChevronLeft className={styles.icon} strokeWidth={2} />
	if (state === 'carouselNext') return <ChevronRight className={styles.icon} strokeWidth={2} />
	return null
}

export default function Cursor() {
	const dotRef = useRef<HTMLDivElement>(null)
	const [pressed, setPressed] = useState(false)
	const [state, setState] = useState<CursorState>('default')
	const [visible, setVisible] = useState(false)

	useEffect(() => {
		if (!window.matchMedia('(pointer: fine)').matches) return

		const onMouseMove = (e: MouseEvent) => {
			if (dotRef.current) {
				dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%) scale(var(--cursor-scale, 1))`
			}
			setVisible(true)
			setState(getCursorState(e))
		}

		const onMouseOver = (e: MouseEvent) => {
			setState(getCursorState(e))
		}

		const onMouseLeave = () => setVisible(false)
		const onMouseEnter = () => setVisible(true)
		const onMouseDown = () => setPressed(true)
		const onMouseUp = () => setPressed(false)

		document.addEventListener('mousemove', onMouseMove)
		document.addEventListener('mouseover', onMouseOver)
		document.addEventListener('mousedown', onMouseDown)
		document.addEventListener('mouseup', onMouseUp)
		document.documentElement.addEventListener('mouseleave', onMouseLeave)
		document.documentElement.addEventListener('mouseenter', onMouseEnter)

		return () => {
			document.removeEventListener('mousemove', onMouseMove)
			document.removeEventListener('mouseover', onMouseOver)
			document.removeEventListener('mousedown', onMouseDown)
			document.removeEventListener('mouseup', onMouseUp)
			document.documentElement.removeEventListener('mouseleave', onMouseLeave)
			document.documentElement.removeEventListener('mouseenter', onMouseEnter)
		}
	}, [])

	return (
		<div
			ref={dotRef}
			className={[
				styles.dot,
				styles[state],
				visible ? styles.visible : '',
				pressed ? styles.pressed : '',
			].join(' ')}
			aria-hidden="true"
		>
			<CursorContent state={state} />
		</div>
	)
}
