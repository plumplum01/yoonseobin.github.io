import { describe, expect, it } from 'vitest'
import { getLoopedIndex } from '@/components/features/projects/lightboxIndex'

describe('getLoopedIndex', () => {
	it('moves forward within the image list', () => {
		expect(getLoopedIndex(1, 1, 4)).toBe(2)
	})

	it('wraps from the last image to the first image', () => {
		expect(getLoopedIndex(3, 1, 4)).toBe(0)
	})

	it('wraps from the first image to the last image', () => {
		expect(getLoopedIndex(0, -1, 4)).toBe(3)
	})

	it('keeps the current index when there are no images', () => {
		expect(getLoopedIndex(2, 1, 0)).toBe(2)
	})
})
