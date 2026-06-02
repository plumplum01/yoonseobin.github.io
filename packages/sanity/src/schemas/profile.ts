import { defineArrayMember, defineField, defineType } from 'sanity'

function formatPreviewDate(date: unknown): string | undefined {
	if (typeof date !== 'string') return undefined
	const match = date.match(/^(\d{4})-(\d{2})-\d{2}$/)
	if (!match) return date
	return `${match[1]}.${match[2]}`
}

export const profileType = defineType({
	name: 'profile',
	title: 'Profile',
	type: 'document',
	fields: [
		defineField({
			name: 'heading',
			title: 'Heading',
			type: 'text',
			rows: 3,
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'paragraphs',
			title: 'Paragraphs',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'text',
					rows: 4,
				}),
			],
			validation: (rule) => rule.required().min(1),
		}),
		defineField({
			name: 'education',
			title: 'Education',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					fields: [
						defineField({
							name: 'title',
							title: 'Title',
							type: 'string',
							validation: (rule) => rule.required(),
						}),
						defineField({
							name: 'startDate',
							title: 'Start date',
							type: 'date',
							validation: (rule) => rule.required(),
						}),
						defineField({
							name: 'endDate',
							title: 'End date',
							type: 'date',
							hidden: ({ parent }) => parent?.isCurrent === true,
						}),
						defineField({
							name: 'isCurrent',
							title: 'Currently active',
							type: 'boolean',
							initialValue: false,
						}),
					],
					preview: {
						select: {
							title: 'title',
							startDate: 'startDate',
							endDate: 'endDate',
							isCurrent: 'isCurrent',
						},
						prepare: ({ title, startDate, endDate, isCurrent }) => ({
							title,
							subtitle:
								[
									formatPreviewDate(startDate),
									isCurrent ? 'Present' : formatPreviewDate(endDate),
								]
									.filter(Boolean)
									.join(' - ') || 'Date not set',
						}),
					},
				}),
			],
		}),
		defineField({
			name: 'awards',
			title: 'Awards',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					fields: [
						defineField({
							name: 'title',
							title: 'Title',
							type: 'string',
							validation: (rule) => rule.required(),
						}),
						defineField({
							name: 'desc',
							title: 'Description',
							type: 'text',
							rows: 3,
						}),
						defineField({
							name: 'awardedAt',
							title: 'Awarded at',
							type: 'date',
							validation: (rule) => rule.required(),
						}),
					],
					preview: {
						select: {
							title: 'title',
							awardedAt: 'awardedAt',
						},
						prepare: ({ title, awardedAt }) => ({
							title,
							subtitle: formatPreviewDate(awardedAt) ?? 'Date not set',
						}),
					},
				}),
			],
		}),
		defineField({
			name: 'links',
			title: 'Links',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					fields: [
						defineField({
							name: 'label',
							title: 'Label',
							type: 'string',
							validation: (rule) => rule.required(),
						}),
						defineField({
							name: 'href',
							title: 'URL',
							type: 'url',
							validation: (rule) => rule.required(),
						}),
					],
					preview: {
						select: {
							title: 'label',
							subtitle: 'href',
						},
					},
				}),
			],
		}),
	],
	preview: {
		select: {
			title: 'heading',
		},
		prepare: ({ title }) => ({
			title: 'Profile',
			subtitle: title,
		}),
	},
})
