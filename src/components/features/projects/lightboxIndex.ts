export function getLoopedIndex(currentIndex: number, delta: number, total: number): number {
	if (total <= 0) return currentIndex
	return (currentIndex + delta + total) % total
}
