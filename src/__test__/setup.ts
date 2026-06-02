import '@testing-library/jest-dom'
import { vi } from 'vitest'

Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: vi.fn().mockImplementation((query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
})

class MockIntersectionObserver implements IntersectionObserver {
	readonly root = null
	readonly rootMargin = ''
	readonly thresholds = []

	disconnect = vi.fn()
	observe = vi.fn()
	takeRecords = vi.fn(() => [])
	unobserve = vi.fn()
}

Object.defineProperty(window, 'IntersectionObserver', {
	writable: true,
	value: MockIntersectionObserver,
})

class MockResizeObserver implements ResizeObserver {
	disconnect = vi.fn()
	observe = vi.fn()
	unobserve = vi.fn()
}

Object.defineProperty(window, 'ResizeObserver', {
	writable: true,
	value: MockResizeObserver,
})
