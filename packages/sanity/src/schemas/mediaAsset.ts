import { defineField, defineType } from 'sanity'

export const mediaAssetType = defineType({
	name: 'mediaAsset',
	title: 'Media Asset',
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'type',
			title: 'Type',
			type: 'string',
			initialValue: 'image',
			options: {
				layout: 'radio',
				list: [
					{ title: 'Image', value: 'image' },
					{ title: 'Video', value: 'video' },
				],
			},
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'image',
			title: 'Image',
			type: 'image',
			options: { hotspot: true },
			hidden: ({ document }) => document?.type !== 'image',
			validation: (rule) =>
				rule.custom((value, context) => {
					if (context.document?.type === 'image' && !value) return 'Image is required'
					return true
				}),
		}),
		defineField({
			name: 'video',
			title: 'Video',
			type: 'file',
			options: { accept: 'video/*' },
			hidden: ({ document }) => document?.type !== 'video',
			validation: (rule) =>
				rule.custom((value, context) => {
					if (context.document?.type === 'video' && !value) return 'Video is required'
					return true
				}),
		}),
		defineField({
			name: 'caption',
			title: 'Caption',
			type: 'string',
		}),
		defineField({
			name: 'durationSeconds',
			title: 'Duration seconds',
			type: 'number',
			hidden: ({ document }) => document?.type !== 'video',
			validation: (rule) => rule.min(0),
		}),
		defineField({
			name: 'tags',
			title: 'Tags',
			type: 'array',
			of: [
				{
					type: 'reference',
					to: [{ type: 'mediaTag' }],
				},
			],
		}),
	],
	preview: {
		select: {
			title: 'title',
			subtitle: 'type',
			image: 'image',
		},
		prepare: ({ title, subtitle, image }) => ({
			title,
			subtitle,
			media: image,
		}),
	},
})
