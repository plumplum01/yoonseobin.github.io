/**
 * ProjectCard
 *
 * 데스크탑/모바일 카드의 공통 표현 계층. DOM 구조와 데이터 바인딩만 담당하고
 * 레이아웃·색상·이미지 로딩 전략 등은 모두 props로 주입받는다.
 * 실제 사용처는 DesktopCard/MobileCard 얇은 래퍼를 통한다.
 */

import type { CSSProperties, MouseEventHandler } from 'react'
import type { Project } from '../../lib/projects'

interface ProjectCardProps {
    project: Project
    className?: string
    style?: CSSProperties
    imageClassName?: string
    imageStyle?: CSSProperties
    textClassName?: string
    titleClassName?: string
    subtitleClassName?: string
    imageLoading?: 'eager' | 'lazy'
    imageDecoding?: 'async' | 'sync' | 'auto'
    onClick?: MouseEventHandler<HTMLDivElement>
    dataCursor?: string
}

export default function ProjectCard({
    project,
    className,
    style,
    imageClassName,
    imageStyle,
    textClassName,
    titleClassName,
    subtitleClassName,
    imageLoading,
    imageDecoding,
    onClick,
    dataCursor,
}: ProjectCardProps) {
    return (
        <div className={className} style={style} onClick={onClick} data-cursor={dataCursor}>
            <div className={imageClassName} style={imageStyle}>
                {project.thumbnail && (
                    <img
                        src={project.thumbnail}
                        alt={project.title}
                        loading={imageLoading}
                        decoding={imageDecoding}
                        draggable={false}
                    />
                )}
            </div>
            <div className={textClassName}>
                <p className={titleClassName}>{project.title}</p>
                <p className={subtitleClassName}>{project.subtitle}</p>
            </div>
        </div>
    )
}
