import { describe, expect, it } from 'vitest'
import { routes } from '@/app/router'
import { pageRoutes } from '@/app/routes/pageRoutes'

describe('router config', () => {
	it('defines unique page route paths', () => {
		const paths = pageRoutes.map((route) => route.path)

		expect(new Set(paths).size).toBe(paths.length)
	})

	it('maps page route paths into the root layout children', () => {
		expect(routes[0]?.children?.map((route) => route.path)).toEqual(
			pageRoutes.map((route) => route.path),
		)
	})

	it('includes required public pages', () => {
		expect(pageRoutes).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ id: 'home', path: '/', title: 'Home' }),
				expect.objectContaining({ id: 'about', path: '/about', title: 'About' }),
				expect.objectContaining({ id: 'posts', path: '/posts', title: 'Posts' }),
				expect.objectContaining({ id: 'post-detail', path: '/posts/:slug', title: 'Post' }),
			]),
		)
	})

	it('controls smooth scroll per page route', () => {
		expect(pageRoutes).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ id: 'home', smoothScroll: true }),
				expect.objectContaining({ id: 'about', smoothScroll: false }),
				expect.objectContaining({ id: 'posts', smoothScroll: false }),
				expect.objectContaining({ id: 'post-detail', smoothScroll: false }),
			]),
		)
	})

	it('loads data at route level for CMS-backed pages', () => {
		expect(pageRoutes).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ id: 'home', loader: undefined }),
				expect.objectContaining({ id: 'about', loader: expect.any(Function) }),
				expect.objectContaining({ id: 'posts', loader: expect.any(Function) }),
				expect.objectContaining({ id: 'post-detail', loader: expect.any(Function) }),
			]),
		)
	})

	it('defines route-level error boundaries for outlet data loading', () => {
		expect(routes[0]?.errorElement).toBeTruthy()
		expect(routes[0]?.children?.every((route) => route.errorElement)).toBe(true)
	})
})
