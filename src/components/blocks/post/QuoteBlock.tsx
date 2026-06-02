import type { PostBlock } from '@portfolio/types'

export function QuoteBlock({ block }: { block: Extract<PostBlock, { type: 'quote' }> }) {
	return (
		<figure className="border-l border-text-primary/30 pl-5">
			<blockquote className="text-body font-medium leading-loose tracking-tight text-cjk text-text-primary">
				{block.text}
			</blockquote>
			{block.attribution && (
				<figcaption className="mt-3 text-caption font-medium leading-tight tracking-caption text-[var(--caption-gray)]">
					{block.attribution}
				</figcaption>
			)}
		</figure>
	)
}
