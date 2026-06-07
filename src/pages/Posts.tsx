import type { Post } from '@portfolio/types'
import { useLoaderData } from 'react-router-dom'
import Article from '@/components/layouts/articles/Article'

export default function Posts() {
	const posts = useLoaderData() as Post[]
	console.log(posts)
	return (
		<main className="box-border min-h-screen w-full p-4 pt-28">
			<div className="grid grid-cols-1 gap-8">
				{posts.map((post) => (
					<Article key={post.id} post={post} />
				))}
			</div>
		</main>
	)
}
