import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { getPortableTextParagraphs } from '../components/blocks/post'
import { BlockList } from '../features/post-block-renderer'

describe('block renderer', () => {
  it('extracts paragraphs from portable text blocks', () => {
    expect(
      getPortableTextParagraphs([
        {
          _type: 'block',
          children: [{ text: 'Hello ' }, { text: 'post' }],
        },
      ]),
    ).toEqual(['Hello post'])
  })

  it('renders post blocks independently', () => {
    render(
      <BlockList
        blocks={[
          { type: 'heading', level: 2, text: 'Heading' },
          {
            type: 'text',
            body: [
              {
                _type: 'block',
                children: [{ text: 'Body copy' }],
              },
            ],
          },
        ]}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Heading' })).toBeInTheDocument()
    expect(screen.getByText('Body copy')).toBeInTheDocument()
  })

  it('renders carousel blocks through the shared carousel primitive', () => {
    render(
      <BlockList
        blocks={[
          {
            type: 'carousel',
            mediaItems: [
              {
                id: 'media-1',
                title: 'First media',
                type: 'image',
                url: 'https://cdn.sanity.io/first.webp',
                caption: 'First caption',
                tags: [],
              },
              {
                id: 'media-2',
                title: 'Second media',
                type: 'image',
                url: 'https://cdn.sanity.io/second.webp',
                tags: [],
              },
            ],
          },
        ]}
      />,
    )

    expect(screen.getByRole('region', { name: 'Post media carousel' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'First caption' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Second media' })).toBeInTheDocument()
    expect(screen.getByText('First caption')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Previous slide' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next slide' })).toBeInTheDocument()
  })

  it('lets the carousel slide frame own media sizing', () => {
    render(
      <BlockList
        blocks={[
          {
            type: 'carousel',
            mediaItems: [
              {
                id: 'media-1',
                title: 'First media',
                type: 'image',
                url: 'https://cdn.sanity.io/first.webp',
                tags: [],
              },
              {
                id: 'media-2',
                title: 'Second media',
                type: 'image',
                url: 'https://cdn.sanity.io/second.webp',
                tags: [],
              },
            ],
          },
        ]}
      />,
    )

    const image = screen.getByRole('img', { name: 'First media' })
    expect(image).toHaveClass('size-full', 'object-cover')
    expect(image.parentElement).toHaveClass('aspect-video', 'w-full', 'overflow-hidden')
  })
})
