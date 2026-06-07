import { defineArrayMember, defineField, defineType } from 'sanity'
import type { ReactNode } from 'react'

const mediaAspectRatioOptions = [
	{ title: 'Square 1:1', value: 'square' },
	{ title: 'Video 16:9', value: 'video' },
	{ title: 'Portrait 4:5', value: 'portrait' },
	{ title: 'Wide 21:9', value: 'wide' },
]

function aspectRatioField() {
	return defineField({
		name: 'aspectRatio',
		title: 'Aspect ratio',
		type: 'string',
		initialValue: 'video',
		options: {
			layout: 'radio',
			list: mediaAspectRatioOptions,
		},
		validation: (rule) => rule.required(),
	})
}

function imageReferenceMember() {
	return defineArrayMember({
		type: 'reference',
		to: [{ type: 'mediaAsset' }],
		options: {
			filter: 'type == $type',
			filterParams: { type: 'image' },
		},
	})
}

function mediaItemsField(title: string) {
	return defineField({
		name: 'mediaItems',
		title,
		type: 'array',
		of: [imageReferenceMember()],
		validation: (rule) => rule.required().min(2),
	})
}

function mediaItemsPreview(title: string) {
	return {
		select: {
			firstImage: 'mediaItems.0.image',
			firstTitle: 'mediaItems.0.title',
			secondTitle: 'mediaItems.1.title',
			thirdTitle: 'mediaItems.2.title',
		},
		prepare: ({
			firstTitle,
			secondTitle,
			thirdTitle,
			firstImage,
		}: {
			firstTitle?: string
			secondTitle?: string
			thirdTitle?: string
			firstImage?: ReactNode
		}) => {
			const titles = [firstTitle, secondTitle, thirdTitle].filter(Boolean)

			return {
				title,
				subtitle: titles.length > 0 ? titles.join(', ') : 'Select at least two media items',
				media: firstImage,
			}
		},
	}
}

export const blockContentType = defineType({
	name: 'blockContent',
	title: 'Block content',
	type: 'array',
	of: [
		defineArrayMember({
			name: 'textBlock',
			title: 'Text',
			type: 'object',
			fields: [
				defineField({
					name: 'body',
					title: 'Body',
					type: 'array',
					of: [{ type: 'block' }],
					validation: (rule) => rule.required(),
				}),
			],
		}),
		defineArrayMember({
			name: 'headingBlock',
			title: 'Heading',
			type: 'object',
			fields: [
				defineField({
					name: 'level',
					title: 'Level',
					type: 'number',
					initialValue: 2,
					options: { list: [2, 3, 4] },
					validation: (rule) => rule.required().integer().min(2).max(4),
				}),
				defineField({
					name: 'text',
					title: 'Text',
					type: 'string',
					validation: (rule) => rule.required(),
				}),
			],
		}),
		defineArrayMember({
			name: 'imageBlock',
			title: 'Image',
			type: 'object',
			fields: [
				defineField({
					name: 'media',
					title: 'Media',
					type: 'reference',
					to: [{ type: 'mediaAsset' }],
					options: {
						filter: 'type == $type',
						filterParams: { type: 'image' },
					},
					validation: (rule) => rule.required(),
				}),
				aspectRatioField(),
			],
			preview: {
				select: {
					title: 'media.title',
					subtitle: 'aspectRatio',
					media: 'media.image',
				},
			},
		}),
		defineArrayMember({
			name: 'imageStackBlock',
			title: 'Image Stack',
			type: 'object',
			fields: [mediaItemsField('Images')],
			preview: mediaItemsPreview('Image Stack'),
		}),
		defineArrayMember({
			name: 'carouselBlock',
			title: 'Carousel',
			type: 'object',
			fields: [mediaItemsField('Media items')],
			preview: mediaItemsPreview('Carousel'),
		}),
		defineArrayMember({
			name: 'videoBlock',
			title: 'Video',
			type: 'object',
			fields: [
				defineField({
					name: 'media',
					title: 'Media',
					type: 'reference',
					to: [{ type: 'mediaAsset' }],
					options: {
						filter: 'type == $type',
						filterParams: { type: 'video' },
					},
					validation: (rule) => rule.required(),
				}),
				aspectRatioField(),
			],
			preview: {
				select: {
					title: 'media.title',
					subtitle: 'aspectRatio',
				},
			},
		}),
	],
})
