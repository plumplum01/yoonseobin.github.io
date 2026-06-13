import HomeCard from './components/HomeCard'

export default function Home() {
	return (
		<main className="relative grid h-full min-h-0 place-items-center">
			<section className="px-4">
				<hgroup className="flex flex-col items-center gap-6 mix-blend-difference text-white">
					<h1 className="max-w-6xl text-6xl tracking-tight text-cjk md:text-8xl">
						Digital product designer building clear, tactile interfaces.
					</h1>
				</hgroup>
			</section>
			<div className="absolute inset-x-0 bottom-4 flex px-4 md:bottom-16">
				<div className="mx-auto">
					<HomeCard />
				</div>
			</div>
		</main>
	)
}
