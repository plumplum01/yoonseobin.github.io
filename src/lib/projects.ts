/**
 * projects 데이터 엔트리포인트.
 *
 * 순수 데이터(JSON)는 `src/data/`에, 에셋 해석과 병합 로직은 `projectLoader.ts`에
 * 분리되어 있다. 이 파일은 두 소스를 연결하는 얇은 글루다.
 */

import projectsData from '../data/projects.json'
import {
  buildProjects,
  groupImagesByProject,
  groupScenesByProject,
  type ProjectData,
} from './projectLoader'

export type { Project, Scene, SceneVideo } from './projectLoader'

// Vite가 정적 분석할 수 있도록 glob 인자는 리터럴 문자열이어야 한다.
const projectImagesGlob = import.meta.glob('../assets/projects/*/*.webp', {
  eager: true,
  import: 'default',
})

const sceneImagesGlob = import.meta.glob('../assets/projects/*/full/*.webp', {
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
