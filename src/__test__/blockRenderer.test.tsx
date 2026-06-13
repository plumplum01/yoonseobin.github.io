import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BlockList } from '@/features/block-renderer'

describe('block renderer', () => {
	it('renders article blocks independently', () => {
		render(
			<BlockList
				blocks={[
					{ type: 'heading', level: 2, text: 'Heading' },
					{
						type: 'text',
						body: [
							{
								_type: 'block',
								_key: 'body-copy',
								style: 'normal',
								markDefs: [],
								children: [
									{
										_key: 'body-copy-span',
										_type: 'span',
										marks: [],
										text: 'Body copy',
									},
								],
							},
						],
					},
				]}
			/>,
		)

		expect(screen.getByRole('heading', { name: 'Heading' })).toBeInTheDocument()
		expect(screen.getByText('Body copy')).toBeInTheDocument()
	})

	it('renders image and video blocks', async () => {
		render(
			<BlockList
				blocks={[
					{
						type: 'image',
						aspectRatio: 'portrait',
						media: {
							id: 'image-1',
							title: 'Portrait image',
							type: 'image',
							url: 'https://cdn.sanity.io/portrait.webp',
							tags: [],
						},
					},
					{
						type: 'video',
						aspectRatio: 'wide',
						media: {
							id: 'video-1',
							title: 'Wide video',
							type: 'video',
							url: 'https://cdn.sanity.io/wide.mp4',
							tags: [],
						},
					},
				]}
			/>,
		)

		const image = await screen.findByRole('img', { name: 'Portrait image' })
		expect(image).toBeInTheDocument()

		const video = document.querySelector('video')
		expect(video).toBeInTheDocument()
	})

	it('renders carousel blocks through the shared carousel primitive', async () => {
		render(
			<BlockList
				blocks={[
					{
						type: 'carousel',
						mediaItems: [
							{
								id: 'media-1',
								title: 'First media',
								type: 'image',
								url: 'https://cdn.sanity.io/first.webp',
								caption: 'First caption',
								tags: [],
							},
							{
								id: 'media-2',
								title: 'Second media',
								type: 'image',
								url: 'https://cdn.sanity.io/second.webp',
								tags: [],
							},
						],
					},
				]}
			/>,
		)

		expect(
			await screen.findByRole('region', { name: 'Article media carousel' }),
		).toBeInTheDocument()
		expect(screen.getByRole('img', { name: 'First caption' })).toBeInTheDocument()
		expect(screen.getByRole('img', { name: 'Second media' })).toBeInTheDocument()
	})

	it('renders image stack blocks as ordered media items', async () => {
		render(
			<BlockList
				blocks={[
					{
						type: 'imageStack',
						mediaItems: [
							{
								id: 'stack-1',
								title: 'Stack first',
								type: 'image',
								url: 'https://cdn.sanity.io/stack-first.webp',
								caption: 'Stack first caption',
								tags: [],
							},
							{
								id: 'stack-2',
								title: 'Stack second',
								type: 'image',
								url: 'https://cdn.sanity.io/stack-second.webp',
								tags: [],
							},
						],
					},
				]}
			/>,
		)

		expect(await screen.findByRole('img', { name: 'Stack first caption' })).toBeInTheDocument()
		expect(screen.getByRole('img', { name: 'Stack second' })).toBeInTheDocument()
	})
})
