import type { ReactNode } from 'react'
import { HeadingLabel } from '@/components/ui/HeadingLabel'

type ContentHeadingProps = {
	label: ReactNode
	title: ReactNode
	description?: ReactNode
}

export function ContentHeading({ label, title, description }: ContentHeadingProps) {
	return (
		<div className="flex flex-col items-start gap-4 text-white">
			<HeadingLabel tone="light">{label}</HeadingLabel>

			<hgroup className="flex flex-col justify-start items-start gap-1">
				<h2 className="text-base text-cjk text-start">{title}</h2>
				{description && (
					<p className="font-mono text-xs text-cjk text-start opacity-40">{description}</p>
				)}
			</hgroup>
		</div>
	)
}
