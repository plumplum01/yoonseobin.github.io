import type { CSSProperties, HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

const cjkTextStyle: CSSProperties = {
	wordBreak: 'keep-all',
	overflowWrap: 'normal',
	wordWrap: 'normal',
	hyphens: 'manual',
}

export function ArticleText({
	children,
	className,
	lang,
	style,
	...props
}: HTMLAttributes<HTMLParagraphElement>) {
	return (
		<p
			className={cn(
				'mx-auto text-cjk max-w-3xl leading-loose text-base text-left text-white',
				className,
			)}
			lang={lang ?? 'ko'}
			style={{ ...cjkTextStyle, ...style }}
			{...props}
		>
			{children}
		</p>
	)
}
