import { site } from '@/registry/site'

export default function Footer() {
	return (
		<footer className="min-h-20 bg-neutral-900 w-screen text-white grid place-items-center">
			<div className="flex w-full font-mono uppercase text-xs justify-center gap-1">
				<span>ⓒ{site.year} All rights reserved, {site.name}. Busan, South Korea </span>
			</div>
		</footer>
	)
}
