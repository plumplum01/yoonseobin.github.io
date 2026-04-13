/**
 * DesktopCard
 *
 * DesktopHero 슬라이더용 카드 래퍼.
 * 짝/홀수 레이아웃 계산, 배경색, eager 이미지 로딩, SelectedCard payload
 * 구성 등 데스크탑 고유 로직을 담당하고 실제 렌더링은 ProjectCard에 위임한다.
 */

import { projects } from '../../lib/projects'
import { DESKTOP_ITEM_WIDTH_VW, type SelectedCard } from '../hero/constants'
import ProjectCard from './ProjectCard'
import styles from './DesktopCard.module.css'

interface DesktopCardProps {
    index: number
    n: number
    onSelect: (card: SelectedCard) => void
}

export default function DesktopCard({ index, n, onSelect }: DesktopCardProps) {
    const project = projects[(n - 1) % projects.length]
    const isEven = n % 2 === 0
    const bg = isEven ? 'var(--card-even)' : 'var(--card-odd)'

    return (
        <ProjectCard
            project={project}
            className={styles.card}
            style={{
                width: `${DESKTOP_ITEM_WIDTH_VW}vw`,
                marginTop: isEven ? '17.7vh' : '30.2vh',
            }}
            imageClassName={styles.cardImage}
            imageStyle={{
                height: isEven ? '63.7vh' : '51.1vh',
                backgroundColor: bg,
            }}
            textClassName={styles.cardText}
            titleClassName={`t-card-title ${styles.cardTitle}`}
            subtitleClassName={`t-card-subtitle ${styles.cardSubtitle}`}
            imageLoading="eager"
            imageDecoding="async"
            onClick={() => onSelect({ index, n, bg })}
            dataCursor="card"
        />
    )
}
