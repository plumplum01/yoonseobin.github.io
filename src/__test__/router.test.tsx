import { describe, expect, it } from 'vitest'
import { routes } from '@/app/router'
import { PAGE_ROUTES as pageRoutes } from '@/app/routes/pageRoutes'

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
				expect.objectContaining({ id: 'articles', path: '/articles', title: 'Articles' }),
				expect.objectContaining({ id: 'reels', path: '/reels', title: 'Reels' }),
				expect.objectContaining({ id: 'projects', path: '/projects', title: 'Projects' }),
				expect.objectContaining({
					id: 'article-detail',
					path: '/articles/:slug',
					title: 'Article',
				}),
				expect.objectContaining({
					id: 'project-detail',
					path: '/projects/:slug',
					title: 'Project',
				}),
			]),
		)
	})

	it('controls smooth scroll per page route', () => {
		expect(pageRoutes).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ id: 'home', smoothScroll: false }),
				expect.objectContaining({ id: 'about', smoothScroll: false }),
				expect.objectContaining({ id: 'articles', smoothScroll: false }),
				expect.objectContaining({ id: 'reels', smoothScroll: false }),
				expect.objectContaining({ id: 'projects', smoothScroll: false }),
				expect.objectContaining({ id: 'article-detail', smoothScroll: false }),
				expect.objectContaining({ id: 'project-detail', smoothScroll: false }),
			]),
		)
	})

	it('loads data at route level for CMS-backed pages', () => {
		expect(pageRoutes).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ id: 'home', loader: undefined }),
				expect.objectContaining({ id: 'about', loader: expect.any(Function) }),
				expect.objectContaining({ id: 'articles', loader: expect.any(Function) }),
				expect.objectContaining({ id: 'reels', loader: expect.any(Function) }),
				expect.objectContaining({ id: 'projects', loader: expect.any(Function) }),
				expect.objectContaining({ id: 'article-detail', loader: expect.any(Function) }),
				expect.objectContaining({ id: 'project-detail', loader: expect.any(Function) }),
			]),
		)
	})

	it('defines route-level error boundaries for outlet data loading', () => {
		expect(routes[0]?.errorElement).toBeTruthy()
		expect(routes[0]?.children?.every((route) => route.errorElement)).toBe(true)
	})
})
