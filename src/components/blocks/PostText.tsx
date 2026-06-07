import { cn } from '@/lib/cn'

export function PostText({
	children,
	className,
	...props
}: {
	children: React.ReactNode
	className?: string
}) {
	return (
		<p
			className={cn(
				'text-cjk max-w-4xl leading-loose text-base text-left text-white',
				className,
			)}
			{...props}
		>
			{children}
		</p>
	)
}
