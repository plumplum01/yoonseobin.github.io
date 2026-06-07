import type { Project, ProjectData, Scene } from '@portfolio/types'

/**
 * projects.json과 Vite glob 결과를 합쳐 완전한 Project 배열을 만든다.
 *
 * JSON에는 순수 데이터만 담기고, 이미지 URL은 런타임에 glob으로 해석된다.
 */

/**
 * glob 경로에서 마지막 디렉토리/파일명 토큰을 추출한다.
 *
 * 예: '../data/media/projects/watt-a-lot/watt 1.webp'
 *   → { projectId: 'watt-a-lot', filename: 'watt 1.webp' }
 */
function parseProjectPath(path: string): { projectId: string; filename: string } | null {
	const match = path.match(/projects\/([^/]+)\/([^/]+\.webp)$/)
	if (!match) return null
	return { projectId: match[1], filename: match[2] }
}

/**
 * full/ 하위 scene 경로에서 프로젝트 id와 파일명을 추출한다.
 *
 * 예: '../data/media/projects/watt-a-lot/full/Main.webp'
 *   → { projectId: 'watt-a-lot', filename: 'Main.webp' }
 */
function parseScenePath(path: string): { projectId: string; filename: string } | null {
	const match = path.match(/projects\/([^/]+)\/full\/([^/]+\.webp)$/)
	if (!match) return null
	return { projectId: match[1], filename: match[2] }
}

type ProjectAssetPath = {
	projectId: string
	filename: string
}

type ProjectAssetEntry = ProjectAssetPath & {
	url: string
}

function groupProjectAssets<TAsset>(
	glob: Record<string, unknown>,
	parsePath: (path: string) => ProjectAssetPath | null,
	mapEntry: (entry: ProjectAssetEntry) => TAsset,
): Record<string, TAsset[]> {
	const groups: Record<string, ProjectAssetEntry[]> = {}

	for (const [path, value] of Object.entries(glob)) {
		const parsed = parsePath(path)
		if (!parsed) continue
		groups[parsed.projectId] ??= []
		groups[parsed.projectId].push({ ...parsed, url: value as string })
	}

	return Object.fromEntries(
		Object.entries(groups).map(([id, entries]) => [
			id,
			entries
				.sort((a, b) => a.filename.localeCompare(b.filename, undefined, { numeric: true }))
				.map(mapEntry),
		]),
	)
}

/**
 * 이미지 glob 결과를 프로젝트 id 기준으로 그룹화한다.
 * 각 그룹은 파일명 숫자 순으로 정렬된다.
 */
export function groupImagesByProject(glob: Record<string, unknown>): Record<string, string[]> {
	return groupProjectAssets(glob, parseProjectPath, (entry) => entry.url)
}

/**
 * full/ 하위 scene 이미지를 프로젝트 id 기준으로 그룹화한다.
 * 각 그룹은 { name, image } 객체의 배열이며, 파일명 기준 정렬된다.
 */
export function groupScenesByProject(
	glob: Record<string, unknown>,
): Record<string, { name: string; image: string }[]> {
	return groupProjectAssets(glob, parseScenePath, (entry) => ({
		name: entry.filename.replace(/\.webp$/, ''),
		image: entry.url,
	}))
}

/**
 * 프로젝트 데이터 배열을 에셋 맵과 결합해 완전한 Project 배열로 빌드한다.
 */
export function buildProjects(
	data: ProjectData[],
	imagesByProject: Record<string, string[]>,
	scenesByProject: Record<string, { name: string; image: string }[]>,
): Project[] {
	return data.map((p) => {
		const images = imagesByProject[p.id] ?? []
		const sceneAssets = scenesByProject[p.id] ?? []

		const scenes: Scene[] | undefined = p.scenes?.map((s) => {
			const image = s.imageKey
				? sceneAssets.find((a) => a.name === s.imageKey)?.image
				: undefined
			return {
				name: s.name,
				image,
				...(s.videos ? { videos: s.videos } : {}),
			}
		})

		return {
			id: p.id,
			title: p.title,
			subtitle: p.subtitle,
			period: p.period,
			role: p.role,
			client: p.client,
			tools: p.tools,
			description: p.description,
			thumbnail: images[0],
			images,
			...(scenes ? { scenes } : {}),
		}
	})
}
