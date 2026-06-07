import { PortableText, type PortableTextComponents } from '@portabletext/react'
import type { PostBlock } from '@portfolio/types'

const portableTextComponents: PortableTextComponents = {
	block: {
		normal: ({ children }) => (
			<p className="text-base leading-loose tracking-tight text-left text-cjk text-text-primary">
				{children}
			</p>
		),
	},
	marks: {
		link: ({ children, value }) => (
			<a
				className="underline decoration-text-primary/30 underline-offset-4 hover:decoration-text-primary"
				href={typeof value?.href === 'string' ? value.href : undefined}
				rel="noreferrer"
				target="_blank"
			>
				{children}
			</a>
		),
	},
}

export function TextBlock({ block }: { block: Extract<PostBlock, { type: 'text' }> }) {
	return (
		<div className="flex flex-col gap-5 max-w-4xl">
			<PortableText value={block.body} components={portableTextComponents} />
		</div>
	)
}
