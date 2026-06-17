import { act, render, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ViewportVideo } from '@/blocks/article/ViewportVideo'

type ObserverCallback = IntersectionObserverCallback

let observerCallback: ObserverCallback | undefined
let observeMock: ReturnType<typeof vi.fn>
let disconnectMock: ReturnType<typeof vi.fn>

class TestIntersectionObserver implements IntersectionObserver {
	readonly root = null
	readonly rootMargin = ''
	readonly thresholds = []

	constructor(callback: ObserverCallback) {
		observerCallback = callback
	}

	disconnect = disconnectMock
	observe = observeMock
	takeRecords = vi.fn(() => [])
	unobserve = vi.fn()
}

describe('ViewportVideo', () => {
	beforeEach(() => {
		observerCallback = undefined
		observeMock = vi.fn()
		disconnectMock = vi.fn()
		Object.defineProperty(window, 'IntersectionObserver', {
			writable: true,
			value: TestIntersectionObserver,
		})
		vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined)
		vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined)
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('plays when visible and pauses when leaving the viewport', async () => {
		render(<ViewportVideo src="https://cdn.sanity.io/video.mp4" />)

		await waitFor(() => expect(observeMock).toHaveBeenCalledTimes(1))
		const video = observeMock.mock.calls[0]?.[0] as HTMLVideoElement
		expect(video).toBeInstanceOf(HTMLVideoElement)

		act(() => {
			observerCallback?.(
				[{ isIntersecting: true } as IntersectionObserverEntry],
				{} as IntersectionObserver,
			)
		})
		expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1)

		Object.defineProperty(video, 'paused', {
			configurable: true,
			value: false,
		})

		act(() => {
			observerCallback?.(
				[{ isIntersecting: false } as IntersectionObserverEntry],
				{} as IntersectionObserver,
			)
		})
		expect(HTMLMediaElement.prototype.pause).toHaveBeenCalledTimes(1)

		Object.defineProperty(video, 'paused', {
			configurable: true,
			value: true,
		})
	})
})
