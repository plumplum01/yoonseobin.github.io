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
          name: 'image',
          title: 'Image',
          type: 'image',
          options: { hotspot: true },
          validation: (rule) => rule.required(),
        }),
        defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
        defineField({ name: 'caption', title: 'Caption', type: 'string' }),
      ],
    }),
    defineArrayMember({
      name: 'carouselBlock',
      title: 'Carousel',
      type: 'object',
      fields: [
        defineField({
          name: 'images',
          title: 'Images',
          type: 'array',
          of: [
            {
              type: 'image',
              options: { hotspot: true },
              fields: [
                defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
                defineField({ name: 'caption', title: 'Caption', type: 'string' }),
              ],
            },
          ],
          validation: (rule) => rule.required().min(1),
        }),
      ],
    }),
    defineArrayMember({
      name: 'videoBlock',
      title: 'Video',
      type: 'object',
      fields: [
        defineField({
          name: 'video',
          title: 'Video file',
          type: 'file',
          options: { accept: 'video/*' },
          validation: (rule) => rule.required(),
        }),
        defineField({ name: 'caption', title: 'Caption', type: 'string' }),
        defineField({ name: 'durationSeconds', title: 'Duration seconds', type: 'number' }),
      ],
    }),
  ],
})
