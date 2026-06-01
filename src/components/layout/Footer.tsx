import { cn } from '../../lib/cn'

interface FooterProps {
	variant: 'desktop' | 'mobile'
}

export default function Footer({ variant }: FooterProps) {
	const isMobile = variant === 'mobile'
	return (
		<footer
			className={cn(
				'text-body text-sm flex items-center',
				isMobile ? 'mt-10 flex flex-col p-3' : 'absolute inset-x-0 bottom-0 flex h-11 px-4',
			)}
		>
			<div className="flex w-full justify-center">
				<span>ⓒ2026</span>
			</div>
		</footer>
	)
}
