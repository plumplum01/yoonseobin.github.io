import type { Post } from '@portfolio/types'
import { useLoaderData } from 'react-router-dom'
import ArticleCard from '@/pages/Articles/components/ArticleCard'

export default function Articles() {
	const articles = useLoaderData() as Post[]
	return (
		<main className="box-border min-h-screen w-full p-4 pt-28">
			<div className="grid grid-cols-2 gap-4">
				{articles.map((article) => (
					<ArticleCard key={article.id} post={article} />
				))}
			</div>
		</main>
	)
}
