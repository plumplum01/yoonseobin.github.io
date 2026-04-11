/**
 * MobileCard
 *
 * MobileHero 세로 목록용 카드 래퍼.
 * lazy 이미지 로딩 등 모바일 고유 설정만 담당하고 실제 렌더링은
 * ProjectCard에 위임한다.
 */

import { projects } from '../../lib/projects'
import ProjectCard from './ProjectCard'
import styles from './MobileCard.module.css'

interface MobileCardProps {
    n: number
    onSelect: (n: number) => void
}

export default function MobileCard({ n, onSelect }: MobileCardProps) {
    const project = projects[(n - 1) % projects.length]

    return (
        <ProjectCard
            project={project}
            className={styles.card}
            imageClassName={styles.cardImage}
            textClassName={styles.cardText}
            titleClassName={`t-card-title ${styles.cardTitle}`}
            subtitleClassName={`t-card-subtitle ${styles.cardSubtitle}`}
            imageLoading="lazy"
            onClick={() => onSelect(n)}
        />
    )
}
