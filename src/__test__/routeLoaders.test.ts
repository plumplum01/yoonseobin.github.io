import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { LoaderFunctionArgs } from 'react-router-dom'
import { AppRouteError } from '@/app/errors/AppRouteError'
import {
	articleDetailLoader,
	articlesLoader,
	profileLoader,
	reelsLoader,
} from '@/app/routes/routeLoaders'
import { resolveProfile } from '@/registry/resolveProfile'
import { resolveArticle, resolveArticles, resolveReels } from '@/registry/resolvePosts'

vi.mock('../registry/resolveProfile', () => ({
	resolveProfile: vi.fn(),
}))

vi.mock('../registry/resolvePosts', () => ({
	resolveArticle: vi.fn(),
	resolveArticles: vi.fn(),
	resolveReels: vi.fn(),
}))

const mockedResolveProfile = vi.mocked(resolveProfile)
const mockedResolveArticle = vi.mocked(resolveArticle)
const mockedResolveArticles = vi.mocked(resolveArticles)
const mockedResolveReels = vi.mocked(resolveReels)

function createLoaderArgs(slug?: string) {
	return {
		params: slug ? { slug } : {},
		request: new Request('http://localhost/articles/test-post'),
		context: {},
	} as LoaderFunctionArgs
}

async function expectAppRouteError(
	action: () => Promise<unknown>,
	expected: { kind: AppRouteError['kind']; message: string; status: number },
) {
	try {
		await action()
		throw new Error('Expected loader to throw')
	} catch (error) {
		expect(error).toBeInstanceOf(AppRouteError)
		expect(error).toMatchObject(expected)
	}
}

describe('route loaders', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('loads profile data through the profile registry', async () => {
		const profile = {
			heading: 'About',
			paragraphs: ['Hello'],
			education: [],
			awards: [],
			links: [],
		}
		mockedResolveProfile.mockResolvedValue(profile)

		await expect(profileLoader()).resolves.toBe(profile)
	})

	it('loads article list data through the articles registry', async () => {
		const articles = [
			{
				id: 'post-1',
				type: 'article' as const,
				slug: 'test-post',
				title: 'Test post',
				status: 'published' as const,
			},
		]
		mockedResolveArticles.mockResolvedValue(articles)

		await expect(articlesLoader()).resolves.toBe(articles)
	})

	it('loads reel list data through the reels registry', async () => {
		const reels = [
			{
				id: 'reel-1',
				type: 'reel' as const,
				slug: 'test-reel',
				title: 'Test reel',
				status: 'published' as const,
				blocks: [],
			},
		]
		mockedResolveReels.mockResolvedValue(reels)

		await expect(reelsLoader()).resolves.toBe(reels)
	})

	it('loads an article detail by route slug', async () => {
		const article = {
			id: 'post-1',
			type: 'article' as const,
			slug: 'test-post',
			title: 'Test post',
			status: 'published' as const,
			blocks: [],
		}
		mockedResolveArticle.mockResolvedValue(article)

		await expect(articleDetailLoader(createLoaderArgs('test-post'))).resolves.toBe(article)
		expect(mockedResolveArticle).toHaveBeenCalledWith('test-post')
	})

	it('throws notFound when an article route has no slug', async () => {
		await expectAppRouteError(() => articleDetailLoader(createLoaderArgs()), {
			kind: 'notFound',
			message: 'Article slug is missing',
			status: 404,
		})
	})

	it('normalizes missing article documents into notFound errors', async () => {
		mockedResolveArticle.mockRejectedValue(
			new Error('Invalid post payload: post document is missing'),
		)

		await expectAppRouteError(() => articleDetailLoader(createLoaderArgs('missing-post')), {
			kind: 'notFound',
			message: 'Article document is missing',
			status: 404,
		})
	})

	it('normalizes invalid CMS payloads into contentInvalid errors', async () => {
		mockedResolveArticles.mockRejectedValue(
			new Error('Invalid post payload: post.title must be a string'),
		)

		await expectAppRouteError(() => articlesLoader(), {
			kind: 'contentInvalid',
			message: 'Articles failed to load',
			status: 500,
		})
	})

	it('normalizes invalid reel payloads into contentInvalid errors', async () => {
		mockedResolveReels.mockRejectedValue(
			new Error('Invalid post payload: post.title must be a string'),
		)

		await expectAppRouteError(() => reelsLoader(), {
			kind: 'contentInvalid',
			message: 'Reels failed to load',
			status: 500,
		})
	})

	it('normalizes unexpected registry failures into contentUnavailable errors', async () => {
		mockedResolveProfile.mockRejectedValue(new Error('Network request failed'))

		await expectAppRouteError(() => profileLoader(), {
			kind: 'contentUnavailable',
			message: 'Profile failed to load',
			status: 500,
		})
	})
})
