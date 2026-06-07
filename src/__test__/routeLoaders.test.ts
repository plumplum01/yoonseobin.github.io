import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { LoaderFunctionArgs } from 'react-router-dom'
import { AppRouteError } from '@/app/errors/AppRouteError'
import { postDetailLoader, postsLoader, profileLoader } from '@/app/routes/routeLoaders'
import { loadProfile } from '@/registry/profile'
import { loadPost, loadPosts } from '@/registry/posts'

vi.mock('../registry/profile', () => ({
	loadProfile: vi.fn(),
}))

vi.mock('../registry/posts', () => ({
	loadPost: vi.fn(),
	loadPosts: vi.fn(),
}))

const mockedLoadProfile = vi.mocked(loadProfile)
const mockedLoadPost = vi.mocked(loadPost)
const mockedLoadPosts = vi.mocked(loadPosts)

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
		mockedLoadProfile.mockResolvedValue(profile)

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
		mockedLoadPosts.mockResolvedValue(posts)

		await expect(postsLoader()).resolves.toBe(posts)
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
		mockedLoadPost.mockResolvedValue(post)

		await expect(postDetailLoader(createLoaderArgs('test-post'))).resolves.toBe(post)
		expect(mockedLoadPost).toHaveBeenCalledWith('test-post')
	})

	it('throws notFound when a post route has no slug', async () => {
		await expectAppRouteError(() => postDetailLoader(createLoaderArgs()), {
			kind: 'notFound',
			message: 'Post slug is missing',
			status: 404,
		})
	})

	it('normalizes missing post documents into notFound errors', async () => {
		mockedLoadPost.mockRejectedValue(
			new Error('Invalid post payload: post document is missing'),
		)

		await expectAppRouteError(() => postDetailLoader(createLoaderArgs('missing-post')), {
			kind: 'notFound',
			message: 'Post document is missing',
			status: 404,
		})
	})

	it('normalizes invalid CMS payloads into contentInvalid errors', async () => {
		mockedLoadPosts.mockRejectedValue(
			new Error('Invalid post payload: post.title must be a string'),
		)

		await expectAppRouteError(() => postsLoader(), {
			kind: 'contentInvalid',
			message: 'Posts failed to load',
			status: 500,
		})
	})

	it('normalizes unexpected registry failures into contentUnavailable errors', async () => {
		mockedLoadProfile.mockRejectedValue(new Error('Network request failed'))

		await expectAppRouteError(() => profileLoader(), {
			kind: 'contentUnavailable',
			message: 'Profile failed to load',
			status: 500,
		})
	})
})
