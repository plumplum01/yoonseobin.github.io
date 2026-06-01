type PortableTextBlock = {
  _type?: unknown
  children?: unknown
}

type PortableTextChild = {
  text?: unknown
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function getChildText(child: unknown): string {
  if (!isRecord(child)) return ''

  const value = (child as PortableTextChild).text
  return typeof value === 'string' ? value : ''
}

export function getPortableTextParagraphs(blocks: unknown[]): string[] {
  return blocks
    .map((block) => {
      if (!isRecord(block)) return ''

      const portableBlock = block as PortableTextBlock
      if (portableBlock._type !== 'block' || !Array.isArray(portableBlock.children)) return ''

      return portableBlock.children.map(getChildText).join('').trim()
    })
    .filter((text) => text.length > 0)
}
