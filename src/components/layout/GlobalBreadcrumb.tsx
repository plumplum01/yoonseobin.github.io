import { site } from '@/registry/site'

export default function GlobalBreadcrumb() {
	return (
		<footer className="min-h-4 pl-2 pr-4 mix-blend-difference text-white w-screen grid place-items-center">
			<div className="flex w-full justify-between font-mono uppercase text-xxs gap-1">
				<span>
					ⓒ{site.year} All rights reserved, {site.name}. Busan, South Korea{' '}
				</span>
				<span>seoul</span>
			</div>
		</footer>
	)
}
