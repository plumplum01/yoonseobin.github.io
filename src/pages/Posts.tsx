import type { Post } from '@portfolio/types'
import { useLoaderData } from 'react-router-dom'
import Article from '@/components/layouts/articles/Article'

export default function Posts() {
	const posts = useLoaderData() as Post[]
	return (
		<main className="box-border min-h-screen w-full p-4 pt-28">
			<div className="grid grid-cols-2 gap-4">
				{posts.map((post) => (
					<Article key={post.id} post={post} />
				))}
			</div>
		</main>
	)
}
