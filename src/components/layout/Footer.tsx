import { cn } from '../../lib/cn'
import { site } from '../../registry/site'

export default function Footer() {
	return (
		<footer
			className={cn(
				'text-body text-sm flex items-center',
				'absolute inset-x-0 bottom-0 flex h-11 px-4',
			)}
		>
			<div className="flex w-full justify-center gap-1">
				<span>ⓒ{site.year}</span>
				<span>{site.name}</span>
			</div>
		</footer>
	)
}
