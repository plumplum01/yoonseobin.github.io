import { defineField, defineType } from 'sanity'

export const postType = defineType({
	name: 'post',
	title: 'Post',
	type: 'document',
	fields: [
		defineField({
			name: 'type',
			title: 'Type',
			type: 'string',
			options: {
				layout: 'radio',
				list: [
					{ title: 'Blog', value: 'blog' },
					{ title: 'Shorts', value: 'shorts' },
					{ title: 'About', value: 'about' },
				],
			},
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'slug',
			title: 'Slug',
			type: 'slug',
			options: { source: 'title', maxLength: 96 },
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
		defineField({ name: 'subtitle', title: 'Subtitle', type: 'string' }),
		defineField({ name: 'summary', title: 'Summary', type: 'text' }),
		defineField({
			name: 'thumbnail',
			title: 'Thumbnail',
			type: 'image',
			options: { hotspot: true },
			fields: [
				defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
				defineField({ name: 'caption', title: 'Caption', type: 'string' }),
			],
		}),
		defineField({
			name: 'status',
			title: 'Status',
			type: 'string',
			initialValue: 'draft',
			options: {
				layout: 'radio',
				list: [
					{ title: 'Draft', value: 'draft' },
					{ title: 'Published', value: 'published' },
				],
			},
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'publishedAt',
			title: 'Published at',
			type: 'datetime',
			hidden: ({ document }) => document?.status !== 'published',
		}),
		defineField({
			name: 'blocks',
			title: 'Blocks',
			type: 'blockContent',
		}),
	],
	preview: {
		select: {
			title: 'title',
			subtitle: 'type',
			media: 'thumbnail',
		},
	},
})
