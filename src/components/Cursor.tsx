/**
 * Cursor
 *
 * 커스텀 커서 + 컨텍스트 변형 인터랙션.
 * - pointer: fine 기기(마우스)에서만 렌더
 * - 기본: 작은 dot / 카드 위: "OPEN" 원형 확장 / 링크·버튼: 중간 dot
 * - 다크/라이트모드 색상 자동 전환 (CSS .dark 클래스 기반)
 */

import { useEffect, useRef, useState } from 'react'
import styles from './Cursor.module.css'

type CursorState = 'default' | 'card' | 'link'

export default function Cursor() {
    const dotRef = useRef<HTMLDivElement>(null)
    const [state, setState] = useState<CursorState>('default')
    const [visible, setVisible] = useState(false)
    const mouse = useRef({ x: -200, y: -200 })
    const pos = useRef({ x: -200, y: -200 })
    const rafRef = useRef<number>(undefined)

    useEffect(() => {
        if (!window.matchMedia('(pointer: fine)').matches) return

        const onMouseMove = (e: MouseEvent) => {
            mouse.current = { x: e.clientX, y: e.clientY }
            if (!visible) setVisible(true)
        }

        const onMouseOver = (e: MouseEvent) => {
            const target = e.target as Element
            if (target.closest('[data-cursor="card"]')) {
                setState('card')
            } else if (target.closest('a, button, [data-cursor="link"]')) {
                setState('link')
            } else {
                setState('default')
            }
        }

        const onMouseLeave = () => setVisible(false)
        const onMouseEnter = () => setVisible(true)

        document.addEventListener('mousemove', onMouseMove)
        document.addEventListener('mouseover', onMouseOver)
        document.documentElement.addEventListener('mouseleave', onMouseLeave)
        document.documentElement.addEventListener('mouseenter', onMouseEnter)

        const animate = () => {
            const speed = 0.16
            pos.current.x += (mouse.current.x - pos.current.x) * speed
            pos.current.y += (mouse.current.y - pos.current.y) * speed
            if (dotRef.current) {
                dotRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%)`
            }
            rafRef.current = requestAnimationFrame(animate)
        }
        rafRef.current = requestAnimationFrame(animate)

        return () => {
            document.removeEventListener('mousemove', onMouseMove)
            document.removeEventListener('mouseover', onMouseOver)
            document.documentElement.removeEventListener('mouseleave', onMouseLeave)
            document.documentElement.removeEventListener('mouseenter', onMouseEnter)
            if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current)
        }
    }, [visible])

    return (
        <div
            ref={dotRef}
            className={[
                styles.dot,
                styles[state],
                visible ? styles.visible : '',
            ].join(' ')}
            aria-hidden="true"
        >
            <span className={styles.label}>OPEN</span>
        </div>
    )
}
