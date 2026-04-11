/**
 * projects.json과 Vite glob 결과를 합쳐 완전한 Project 배열을 만든다.
 *
 * JSON에는 순수 데이터만 담기고, 이미지 URL은 런타임에 glob으로 해석된다.
 */

export interface SceneVideo {
  src: string
  delay?: number
}

export interface SceneData {
  name: string
  imageKey?: string
  videos?: SceneVideo[]
}

export interface ProjectData {
  id: string
  title: string
  subtitle: string
  period: string
  role: string
  client: string
  tools: string
  description: string
  scenes?: SceneData[]
}

export interface Scene {
  name: string
  image?: string
  videos?: SceneVideo[]
}

export interface Project {
  id: string
  title: string
  subtitle: string
  period: string
  role: string
  client: string
  tools: string
  description: string
  thumbnail: string
  images: string[]
  scenes?: Scene[]
}

/**
 * glob 경로에서 마지막 디렉토리/파일명 토큰을 추출한다.
 *
 * 예: '../assets/projects/watt-a-lot/watt 1.webp'
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
 * 예: '../assets/projects/watt-a-lot/full/Main.webp'
 *   → { projectId: 'watt-a-lot', filename: 'Main.webp' }
 */
function parseScenePath(path: string): { projectId: string; filename: string } | null {
  const match = path.match(/projects\/([^/]+)\/full\/([^/]+\.webp)$/)
  if (!match) return null
  return { projectId: match[1], filename: match[2] }
}

/**
 * 이미지 glob 결과를 프로젝트 id 기준으로 그룹화한다.
 * 각 그룹은 파일명 숫자 순으로 정렬된다.
 */
export function groupImagesByProject(
  glob: Record<string, unknown>,
): Record<string, string[]> {
  const groups: Record<string, Array<{ filename: string; url: string }>> = {}

  for (const [path, value] of Object.entries(glob)) {
    const parsed = parseProjectPath(path)
    if (!parsed) continue
    if (!groups[parsed.projectId]) groups[parsed.projectId] = []
    groups[parsed.projectId].push({ filename: parsed.filename, url: value as string })
  }

  const result: Record<string, string[]> = {}
  for (const [id, entries] of Object.entries(groups)) {
    result[id] = entries
      .sort((a, b) => a.filename.localeCompare(b.filename, undefined, { numeric: true }))
      .map((e) => e.url)
  }
  return result
}

/**
 * full/ 하위 scene 이미지를 프로젝트 id 기준으로 그룹화한다.
 * 각 그룹은 { name, image } 객체의 배열이며, 파일명 기준 정렬된다.
 */
export function groupScenesByProject(
  glob: Record<string, unknown>,
): Record<string, { name: string; image: string }[]> {
  const groups: Record<string, Array<{ filename: string; url: string }>> = {}

  for (const [path, value] of Object.entries(glob)) {
    const parsed = parseScenePath(path)
    if (!parsed) continue
    if (!groups[parsed.projectId]) groups[parsed.projectId] = []
    groups[parsed.projectId].push({ filename: parsed.filename, url: value as string })
  }

  const result: Record<string, { name: string; image: string }[]> = {}
  for (const [id, entries] of Object.entries(groups)) {
    result[id] = entries
      .sort((a, b) => a.filename.localeCompare(b.filename, undefined, { numeric: true }))
      .map((e) => ({ name: e.filename.replace(/\.webp$/, ''), image: e.url }))
  }
  return result
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
