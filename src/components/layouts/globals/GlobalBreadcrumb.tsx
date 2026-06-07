import { site } from '@/registry/site'

export default function GlobalBreadcrumb() {
	return (
		<footer className="min-h-4 bg-neutral-900 w-screen text-white grid place-items-center">
			<div className="flex w-full font-mono uppercase text-xxs justify-center gap-1">
				<span>
					ⓒ{site.year} All rights reserved, {site.name}. Busan, South Korea{' '}
				</span>
			</div>
		</footer>
	)
}
