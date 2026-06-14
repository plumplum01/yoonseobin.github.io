import type { Post } from '@portfolio/types'
import { motion } from 'framer-motion'
import { useLoaderData } from 'react-router-dom'
import { staggerListVariants } from '@/features/animation/staggerPresets'
import ArticleCard from '@/pages/Articles/components/ArticleCard'

export default function Articles() {
	const articles = useLoaderData() as Post[]
	return (
		<main className="box-border min-h-screen w-full p-4 pt-28">
			<motion.div
				className="grid grid-cols-2 gap-4"
				variants={staggerListVariants}
				initial="hidden"
				animate="show"
			>
				<article className="col-span-2 aspect-video">hello</article>
				<header className="">
					<h1 className="text-3xl font-bold">Articles</h1>
				</header>
				{articles.map((article) => (
					<ArticleCard key={article.id} post={article} />
				))}
			</motion.div>
		</main>
	)
}
