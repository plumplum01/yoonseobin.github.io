import { PostBlocks, getPortableTextParagraphs } from '@portfolio/renderer'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

describe('post renderer', () => {
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
      <PostBlocks
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
})
