import AboutSection from '@/components/features/home/AboutSection'
import ContactSection from '@/components/features/home/ContactSection'

export default function Home() {
	return (
		<main className="min-h-screen min-w-screen">
			<section className="px-4">
				<hgroup className="flex flex-col gap-6">
					<p className="font-mono text-caption uppercase tracking-caption text-neutral-500">
						Seobin Yoon
					</p>
					<h1 className="max-w-4xl text-6xl font-medium leading-none text-cjk md:text-8xl">
						Digital product designer building clear, tactile interfaces.
					</h1>
				</hgroup>
			</section>
			<AboutSection />
			<ContactSection />
		</main>
	)
}
