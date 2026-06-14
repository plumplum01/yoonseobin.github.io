import type { ReactNode } from 'react'
import { HeadingLabel } from '@/components/ui/HeadingLabel'

type PageHeadingProps = {
	label: ReactNode
	title: ReactNode
	description?: ReactNode
	blink?: boolean
}

export function PageHeading({ label, title, description, blink = false }: PageHeadingProps) {
	return (
		<div className="flex flex-col items-start gap-4 text-black">
			<HeadingLabel blink={blink} tone="dark">
				{label}
			</HeadingLabel>

			<hgroup className="flex flex-col justify-start items-start gap-2">
				<h2 className="text-3xl text-cjk text-start">{title}</h2>
				{description && (
					<p className="font-mono text-xs text-cjk text-start opacity-30 pl-1">
						{description}
					</p>
				)}
			</hgroup>
		</div>
	)
}
