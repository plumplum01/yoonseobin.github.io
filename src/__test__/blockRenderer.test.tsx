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
})
