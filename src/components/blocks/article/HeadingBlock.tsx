import type { PostBlock } from '@portfolio/types'

export function HeadingBlock({ block }: { block: Extract<PostBlock, { type: 'heading' }> }) {
	const HeadingTag = `h${block.level}` as const
	const className =
		block.level === 2
			? 'text-section-heading font-semibold leading-tight tracking-heading'
			: 'text-body font-semibold leading-tight tracking-tight'

	return (
		<HeadingTag className={`${className} text-cjk text-text-primary`}>{block.text}</HeadingTag>
	)
}
