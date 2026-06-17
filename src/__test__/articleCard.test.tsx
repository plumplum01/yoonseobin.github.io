import { render, screen } from '@testing-library/react'
import type { Post } from '@portfolio/types'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import ArticleCard from '@/pages/Articles/components/ArticleCard'

const post: Post = {
	id: 'article-1',
	type: 'article',
	title: 'Priority article',
	slug: 'priority-article',
	summary: 'Article summary',
	thumbnailUrl: 'https://cdn.sanity.io/thumbnail.webp',
}

function renderArticleCard(index: number) {
	return render(
		<MemoryRouter>
			<ArticleCard post={post} index={index} />
		</MemoryRouter>,
	)
}

describe('ArticleCard', () => {
	it('prioritizes thumbnails that are likely visible on initial load', () => {
		renderArticleCard(0)

		const image = screen.getByRole('img', { name: 'Priority article' })
		expect(image).toHaveAttribute('loading', 'eager')
		expect(image).toHaveAttribute('fetchpriority', 'high')
	})

	it('keeps below-the-fold thumbnails lazy', () => {
		renderArticleCard(2)

		const image = screen.getByRole('img', { name: 'Priority article' })
		expect(image).toHaveAttribute('loading', 'lazy')
		expect(image).toHaveAttribute('fetchpriority', 'auto')
	})
})
