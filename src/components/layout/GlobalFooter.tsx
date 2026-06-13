import { site } from '@/registry/site'

export default function Footer() {
	return (
		<footer className="min-h-10 bg-neutral-900 w-screen text-white grid place-items-center mt-auto">
			<div className="flex w-full font-mono uppercase text-xxs justify-center gap-1">
				<span>
					ⓒ{site.year} All rights reserved, {site.name}. Busan, South Korea{' '}
				</span>
			</div>
		</footer>
	)
}
