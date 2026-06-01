import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BlockList } from '../features/post-block-renderer'

describe('block renderer', () => {
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

  it('renders image and video blocks', () => {
    render(
      <BlockList
        blocks={[
          {
            type: 'image',
            aspectRatio: 'portrait',
            media: {
              id: 'image-1',
              title: 'Portrait image',
              type: 'image',
              url: 'https://cdn.sanity.io/portrait.webp',
              tags: [],
            },
          },
          {
            type: 'video',
            aspectRatio: 'wide',
            media: {
              id: 'video-1',
              title: 'Wide video',
              type: 'video',
              url: 'https://cdn.sanity.io/wide.mp4',
              tags: [],
            },
          },
        ]}
      />,
    )

    const image = screen.getByRole('img', { name: 'Portrait image' })
    expect(image).toBeInTheDocument()

    const video = document.querySelector('video')
    expect(video).toBeInTheDocument()
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
  })
})
