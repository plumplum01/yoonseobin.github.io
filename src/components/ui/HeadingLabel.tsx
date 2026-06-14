import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type HeadingLabelTone = 'dark' | 'light'

type HeadingLabelProps = {
	children: ReactNode
	tone?: HeadingLabelTone
	blink?: boolean
}

const dotClassName: Record<HeadingLabelTone, string> = {
	dark: 'bg-black',
	light: 'bg-white',
}

export function HeadingLabel({ children, tone = 'dark', blink = false }: HeadingLabelProps) {
	return (
		<p className="flex items-center gap-2">
			<span
				className={cn(
					'inline-block min-w-1 aspect-square',
					dotClassName[tone],
					blink && 'animate-[label-dot-blink_1.1s_steps(1,end)_infinite]',
				)}
				aria-hidden="true"
			/>
			<span className="font-mono text-xxs uppercase">{children}</span>
		</p>
	)
}
