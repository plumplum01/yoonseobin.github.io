import type { Post } from '@portfolio/types'
import { motion } from 'framer-motion'
import { useLoaderData } from 'react-router-dom'
import { PageHeading } from '@/components/ui'
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
				{/*<article className="col-span-2 aspect-video">hello</article>*/}
				<header className="flex flex-col items-center">
					<section className="flex flex-col w-120 pt-20">
						<PageHeading
							label="articles"
							title={
								<>
									작업 뒤에 남은 생각들을 <br />
									만들고, 관찰하고, 기록하기
								</>
							}
							description="Notes since 2025"
							blink
						/>
					</section>
				</header>
				{articles.map((article, index) => (
					<ArticleCard key={article.id} post={article} index={index} />
				))}
			</motion.div>
		</main>
	)
}
