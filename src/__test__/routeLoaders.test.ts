import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { LoaderFunctionArgs } from 'react-router-dom'
import { AppRouteError } from '@/app/errors/AppRouteError'
import {
	postDetailLoader,
	postsLoader,
	profileLoader,
	reelsLoader,
} from '@/app/routes/routeLoaders'
import { resolveProfile } from '@/registry/resolveProfile'
import { resolvePost, resolvePosts, resolveReels } from '@/registry/resolvePosts'

vi.mock('../registry/resolveProfile', () => ({
	resolveProfile: vi.fn(),
}))

vi.mock('../registry/resolvePosts', () => ({
	resolvePost: vi.fn(),
	resolvePosts: vi.fn(),
	resolveReels: vi.fn(),
}))

const mockedResolveProfile = vi.mocked(resolveProfile)
const mockedResolvePost = vi.mocked(resolvePost)
const mockedResolvePosts = vi.mocked(resolvePosts)
const mockedResolveReels = vi.mocked(resolveReels)

function createLoaderArgs(slug?: string) {
	return {
		params: slug ? { slug } : {},
		request: new Request('http://localhost/posts/test-post'),
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

	it('loads post list data through the posts registry', async () => {
		const posts = [
			{
				id: 'post-1',
				type: 'article' as const,
				slug: 'test-post',
				title: 'Test post',
				status: 'published' as const,
			},
		]
		mockedResolvePosts.mockResolvedValue(posts)

		await expect(postsLoader()).resolves.toBe(posts)
	})

	it('loads reel list data through the reels registry', async () => {
		const reels = [
			{
				id: 'reel-1',
				type: 'reel' as const,
				slug: 'test-reel',
				title: 'Test reel',
				status: 'published' as const,
			},
		]
		mockedResolveReels.mockResolvedValue(reels)

		await expect(reelsLoader()).resolves.toBe(reels)
	})

	it('loads a post detail by route slug', async () => {
		const post = {
			id: 'post-1',
			type: 'article' as const,
			slug: 'test-post',
			title: 'Test post',
			status: 'published' as const,
			blocks: [],
		}
		mockedResolvePost.mockResolvedValue(post)

		await expect(postDetailLoader(createLoaderArgs('test-post'))).resolves.toBe(post)
		expect(mockedResolvePost).toHaveBeenCalledWith('test-post')
	})

	it('throws notFound when a post route has no slug', async () => {
		await expectAppRouteError(() => postDetailLoader(createLoaderArgs()), {
			kind: 'notFound',
			message: 'Post slug is missing',
			status: 404,
		})
	})

	it('normalizes missing post documents into notFound errors', async () => {
		mockedResolvePost.mockRejectedValue(
			new Error('Invalid post payload: post document is missing'),
		)

		await expectAppRouteError(() => postDetailLoader(createLoaderArgs('missing-post')), {
			kind: 'notFound',
			message: 'Post document is missing',
			status: 404,
		})
	})

	it('normalizes invalid CMS payloads into contentInvalid errors', async () => {
		mockedResolvePosts.mockRejectedValue(
			new Error('Invalid post payload: post.title must be a string'),
		)

		await expectAppRouteError(() => postsLoader(), {
			kind: 'contentInvalid',
			message: 'Posts failed to load',
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
