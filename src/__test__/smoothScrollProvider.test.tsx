import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SmoothScrollProvider } from '@/context/SmoothScrollProvider'

const lenisMock = vi.hoisted(() => ({
	constructor: vi.fn(),
	destroy: vi.fn(),
}))

vi.mock('lenis', () => ({
	default: class Lenis {
		constructor(options: unknown) {
			lenisMock.constructor(options)
		}

		destroy() {
			lenisMock.destroy()
		}
	},
}))

describe('SmoothScrollProvider', () => {
	beforeEach(() => {
		lenisMock.constructor.mockClear()
		lenisMock.destroy.mockClear()
		window.matchMedia = vi.fn().mockReturnValue({ matches: false })
	})

	it('mounts and destroys Lenis when smooth scroll is enabled', () => {
		const { unmount } = render(
			<SmoothScrollProvider enabled>
				<div>content</div>
			</SmoothScrollProvider>,
		)

		expect(lenisMock.constructor).toHaveBeenCalledWith(
			expect.objectContaining({
				autoRaf: true,
				lerp: 0.1,
				smoothWheel: true,
			}),
		)

		unmount()

		expect(lenisMock.destroy).toHaveBeenCalledTimes(1)
	})

	it('does not mount Lenis when smooth scroll is disabled', () => {
		render(
			<SmoothScrollProvider enabled={false}>
				<div>content</div>
			</SmoothScrollProvider>,
		)

		expect(lenisMock.constructor).not.toHaveBeenCalled()
	})

	it('respects reduced motion preference', () => {
		window.matchMedia = vi.fn().mockReturnValue({ matches: true })

		render(
			<SmoothScrollProvider enabled>
				<div>content</div>
			</SmoothScrollProvider>,
		)

		expect(lenisMock.constructor).not.toHaveBeenCalled()
	})
})
