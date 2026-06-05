import { describe, expect, it } from 'vitest'
import { AppRouteError } from '@/app/errors/AppRouteError'
import { getRouteErrorView } from '@/app/routes/routeErrors'

describe('route error views', () => {
	it('normalizes missing posts into a user-facing not found message', () => {
		const view = getRouteErrorView(new AppRouteError('notFound', 'Post document is missing'))

		expect(view).toEqual({
			title: 'Post not found',
			message: 'The post may have been removed or is not published yet.',
			backTo: '/posts',
			backLabel: 'Back to posts',
		})
	})

	it('does not expose internal invalid payload messages', () => {
		const view = getRouteErrorView(
			new AppRouteError('contentInvalid', 'Invalid post payload: title must be a string'),
		)

		expect(view.title).toBe('Content is unavailable')
		expect(view.message).not.toContain('Invalid post payload')
	})
})
