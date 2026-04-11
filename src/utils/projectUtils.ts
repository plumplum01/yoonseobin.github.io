/** glob import 결과를 파일명 숫자 순으로 정렬한 값 배열을 반환한다 */
export function sortedEntries(glob: Record<string, unknown>): string[] {
  return Object.entries(glob)
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([, v]) => v as string)
}

/** name이 일치하는 항목의 image를 반환하고, 없으면 null을 반환한다 */
export function findOrNull(
  items: { name: string; image?: string }[],
  name: string,
): string | null {
  return items.find(s => s.name === name)?.image ?? null
}

/** glob import 결과를 { name, image } Scene 배열로 변환한다 (숫자 순 정렬) */
export function loadScenes(glob: Record<string, unknown>): { name: string; image: string }[] {
  return Object.entries(glob)
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([path, v]) => {
      const name = path.split('/').pop()?.replace('.webp', '') ?? ''
      return { name, image: v as string }
    })
}
