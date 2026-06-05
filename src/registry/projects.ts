/**
 * projects registry 엔트리포인트.
 *
 * 순수 로컬 원본은 `src/data/`에 두고, 이 파일은 앱이 소비하는 Project 배열로 변환한다.
 * 이후 Sanity 전환 시 이 파일의 source만 Sanity query 기반으로 교체한다.
 */

import projectsData from '@/data/projects.json'
import { buildProjects, groupImagesByProject, groupScenesByProject } from '@/registry/projectLoader'
import type { ProjectData } from '@portfolio/types'

export type { Project, Scene, SceneVideo } from '@portfolio/types'

// Vite가 정적 분석할 수 있도록 glob 인자는 리터럴 문자열이어야 한다.
const projectImagesGlob = import.meta.glob('../data/media/projects/*/*.webp', {
	eager: true,
	import: 'default',
})

const sceneImagesGlob = import.meta.glob('../data/media/projects/*/full/*.webp', {
	eager: true,
	import: 'default',
})

const imagesByProject = groupImagesByProject(projectImagesGlob)
const scenesByProject = groupScenesByProject(sceneImagesGlob)

export const projects = buildProjects(
	projectsData as ProjectData[],
	imagesByProject,
	scenesByProject,
)
