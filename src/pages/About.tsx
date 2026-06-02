import type { Profile } from '@portfolio/types'
import { motion } from 'framer-motion'
import { useLoaderData } from 'react-router-dom'
import styles from './About.module.css'

const container = {
	hidden: {},
	show: {
		transition: {
			staggerChildren: 0.08,
			delayChildren: 0.05,
		},
	},
}

const fadeUp = {
	hidden: { opacity: 0, y: 20 },
	show: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
	},
}

export default function About() {
	const profile = useLoaderData() as Profile
	const { heading, paragraphs, education, awards, links } = profile

	return (
		<section className={styles.section}>
			<motion.div
				className={styles.container}
				variants={container}
				initial="hidden"
				animate="show"
			>
				{/* 페이지 헤딩 */}
				<motion.h1
					variants={fadeUp}
					className={`text-section-heading font-semibold tracking-heading ${styles.heading}`}
				>
					{heading}
				</motion.h1>

				{/* 본문 단락 */}
				<div className={styles.intro}>
					{paragraphs.map((p, i) => (
						<motion.p
							key={i}
							variants={fadeUp}
							className={`text-body font-medium leading-loose tracking-tight text-cjk ${styles.introParagraph}`}
						>
							{p}
						</motion.p>
					))}
				</div>

				<motion.hr
					variants={fadeUp}
					className={`${styles.divider} ${styles.dividerIntro}`}
				/>

				{/* Education 섹션 */}
				<div className={styles.sectionBlock}>
					<motion.h2
						variants={fadeUp}
						className={`text-section-heading font-semibold tracking-heading ${styles.sectionTitle}`}
					>
						Education
					</motion.h2>
					<div className={`${styles.list} ${styles.listEducation}`}>
						{education.map((e) => (
							<motion.div key={e.title} variants={fadeUp} className={styles.row}>
								<span
									className={`text-body font-semibold leading-tight tracking-tight ${styles.eduTitle}`}
								>
									{e.title}
								</span>
								<span
									className={`text-body font-medium leading-tight tracking-tight ${styles.eduDate}`}
								>
									{e.displayPeriod}
								</span>
							</motion.div>
						))}
					</div>
				</div>

				<motion.hr
					variants={fadeUp}
					className={`${styles.divider} ${styles.dividerSection}`}
				/>

				{/* Awards 섹션 */}
				<div className={styles.sectionBlock}>
					<motion.h2
						variants={fadeUp}
						className={`text-section-heading font-semibold tracking-heading ${styles.sectionTitle}`}
					>
						Awards
					</motion.h2>
					<div className={`${styles.list} ${styles.listAwards}`}>
						{awards.map((a) => (
							<motion.div key={a.title} variants={fadeUp} className={styles.row}>
								<div className={styles.awardBody}>
									<span
										className={`text-body font-semibold leading-tight tracking-tight ${styles.awardTitle}`}
									>
										{a.title}
									</span>
									<span
										className={`text-body font-medium leading-tight tracking-tight ${styles.awardDesc}`}
									>
										{a.desc}
									</span>
								</div>
								<span
									className={`text-body font-medium leading-tight tracking-tight ${styles.awardDate}`}
								>
									{a.displayDate}
								</span>
							</motion.div>
						))}
					</div>
				</div>

				<motion.hr
					variants={fadeUp}
					className={`${styles.divider} ${styles.dividerLinks}`}
				/>

				{/* 링크 버튼 */}
				<motion.div variants={fadeUp} className={styles.links}>
					{links.map(({ label, href }) => (
						<a
							key={label}
							href={href}
							target="_blank"
							rel="noopener noreferrer"
							className={`text-nav font-medium leading-none tracking-nav ${styles.linkButton}`}
						>
							{label}
						</a>
					))}
				</motion.div>
			</motion.div>
		</section>
	)
}
