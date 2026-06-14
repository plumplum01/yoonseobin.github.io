import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import HomeCard from './components/HomeCard'

const TITLE_DATA = [
	['Product designer making', 'things that work and feel', 'like someone cared'],
	['잘 동작하고', '배려가 느껴지는', '경험을 설계합니다'],
]

export default function Home() {
	const [titleIndex, setTitleIndex] = useState(0)
	const titleLines = TITLE_DATA[titleIndex]

	useEffect(() => {
		const timer = window.setInterval(() => {
			setTitleIndex((current) => (current + 1) % TITLE_DATA.length)
		}, 3000)

		return () => window.clearInterval(timer)
	}, [])

	return (
		<main className="relative grid h-full min-h-0 place-items-center">
			<section className="px-4">
				<hgroup className="flex flex-col items-center gap-6 mix-blend-difference text-white">
					<AnimatePresence mode="popLayout">
						<motion.h1
							key={titleIndex}
							className="max-w-6xl text-5xl leading-tight md:leading-25 md:text-8xl"
							initial="hidden"
							animate="show"
							exit="exit"
							variants={{
								hidden: {},
								show: {
									transition: {
										staggerChildren: 0.15,
									},
								},
								exit: {
									transition: {
										staggerChildren: 0,
										staggerDirection: -1,
									},
								},
							}}
						>
							{titleLines.map((line) => (
								<motion.span
									className="block"
									key={line}
									variants={{
										hidden: { opacity: 0, filter: 'blur(6px)', y: 30 },
										show: {
											opacity: 1,
											filter: 'blur(0px)',
											y: 0,
											transition: { duration: 1.5, ease: 'easeOut' },
										},
										exit: {
											opacity: 0,
											filter: 'blur(32px)',
											y: -30,
											transition: { duration: 0.5, ease: 'easeOut' },
										},
									}}
								>
									{line}
								</motion.span>
							))}
						</motion.h1>
					</AnimatePresence>
				</hgroup>
			</section>
			<div className="absolute inset-x-0 bottom-4 flex px-4 md:bottom-16">
				<div className="mx-auto">
					<HomeCard
						initial={{ opacity: 0, filter: 'blur(6px)', y: 15 }}
						animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
						transition={{ duration: 1.2, ease: 'easeOut', delay: 0.8 }}
					/>
				</div>
			</div>
		</main>
	)
}
