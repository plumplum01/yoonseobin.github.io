import type { PostDetail as PostDetailModel } from '@portfolio/types'
import { useLoaderData } from 'react-router-dom'
import { PostText } from '@/components/blocks/PostText'
import { BlockList } from '@/features/post-block-renderer'
import { formatKoDate } from '@/lib/dateFormat'

function formatPublishedDate(post: PostDetailModel): string | undefined {
	if (!post.publishedAt) return undefined
	return formatKoDate(post.publishedAt, 'long')
}

function PostHeader({ post }: { post: PostDetailModel }) {
	const publishedDate = formatPublishedDate(post)
	return (
		<header className="absolute bottom-12 left-8 max-w-4xl flex flex-col items-start text-white mix-blend-difference">
			{publishedDate && <p className="text-sm font-medium">{publishedDate}</p>}
			<hgroup className="flex flex-col gap-16 items-start">
				<h1 className="text-6xl font-medium text-start">{post.title}</h1>
			</hgroup>
		</header>
	)
}

function PostThumbnail({ post }: { post: PostDetailModel }) {
	return (
		<div>
			<img
				src={post.thumbnailUrl}
				alt={post.title}
				decoding="async"
				className="size-full object-contain"
			/>
		</div>
	)
}

export default function PostDetail() {
	const post = useLoaderData() as PostDetailModel

	return (
		<>
			<figure className="relative aspect-square w-fullgrid place-item-center overflow-hidden">
				<PostHeader post={post} />
				<PostThumbnail post={post} />
			</figure>
			<main className="mx-auto min-h-screen w-screen pt-28 pb-20">
				<article className="flex flex-col items-center gap-4 md:gap-24">
					<PostText> {post.summary}</PostText>
					<BlockList blocks={post.blocks} />
				</article>
			</main>
		</>
	)
}
