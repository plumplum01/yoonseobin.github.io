import { useSurface } from '@/context/SurfaceProvider'
import { site } from '@/registry/site'

export default function Footer() {
	const surface = useSurface()

	return (
		<footer className="min-h-10 w-screen grid place-items-center mt-auto">
			{surface === 'scroll' && <ScrollFooter />}
			{surface === 'viewport' && <ViewportFooter />}
			{surface === 'detail' && <DetailFooter />}
		</footer>
	)
}

function ScrollFooter() {
	return (
		<div className="min-h-10 bg-neutral-900 w-screen text-white grid place-items-center mt-auto">
			<FooterContent />
		</div>
	)
}

function ViewportFooter() {
	return (
		<div className="mix-blend-difference text-white">
			<FooterContent />
		</div>
	)
}

function DetailFooter() {
	return (
		<div className="min-h-10 bg-neutral-900 w-screen text-white grid place-items-center mt-auto">
			<FooterContent />
		</div>
	)
}

function FooterContent() {
	return (
		<div className="inline-flex font-mono uppercase text-xxs justify-center gap-1">
			<span>
				ⓒ{site.year} All rights reserved, {site.name}. Busan, South Korea{' '}
			</span>
		</div>
	)
}
