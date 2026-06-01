import { defineArrayMember, defineField, defineType } from 'sanity'

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
      name: 'quoteBlock',
      title: 'Quote',
      type: 'object',
      fields: [
        defineField({
          name: 'text',
          title: 'Text',
          type: 'text',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'attribution',
          title: 'Attribution',
          type: 'string',
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
      ],
      preview: {
        select: {
          title: 'media.title',
          media: 'media.image',
        },
      },
    }),
    defineArrayMember({
      name: 'carouselBlock',
      title: 'Carousel',
      type: 'object',
      fields: [
        defineField({
          name: 'mediaItems',
          title: 'Media items',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'reference',
              to: [{ type: 'mediaAsset' }],
              options: {
                filter: 'type == $type',
                filterParams: { type: 'image' },
              },
            }),
          ],
          validation: (rule) => rule.required().min(2),
        }),
      ],
      preview: {
        select: {
          firstTitle: 'mediaItems.0.title',
          secondTitle: 'mediaItems.1.title',
          thirdTitle: 'mediaItems.2.title',
          firstImage: 'mediaItems.0.image',
        },
        prepare: ({ firstTitle, secondTitle, thirdTitle, firstImage }) => {
          const titles = [firstTitle, secondTitle, thirdTitle].filter(Boolean)

          return {
            title: 'Carousel',
            subtitle: titles.length > 0 ? titles.join(', ') : 'Select at least two media items',
            media: firstImage,
          }
        },
      },
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
      ],
      preview: {
        select: {
          title: 'media.title',
        },
      },
    }),
  ],
})
