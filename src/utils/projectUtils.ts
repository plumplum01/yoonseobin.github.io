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
