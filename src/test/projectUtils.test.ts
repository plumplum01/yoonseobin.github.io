import { sortedEntries, findOrNull } from '../utils/projectUtils'

describe('sortedEntries', () => {
  it('숫자 순서로 정렬된 값 배열을 반환한다', () => {
    const glob = {
      '../assets/img 10.webp': 'url10',
      '../assets/img 2.webp':  'url2',
      '../assets/img 1.webp':  'url1',
    }
    expect(sortedEntries(glob)).toEqual(['url1', 'url2', 'url10'])
  })

  it('빈 객체면 빈 배열을 반환한다', () => {
    expect(sortedEntries({})).toEqual([])
  })
})

describe('findOrNull', () => {
  const items = [
    { name: 'Main', image: 'main.webp' },
    { name: 'Finish', image: 'finish.webp' },
  ]

  it('name이 일치하는 항목의 image를 반환한다', () => {
    expect(findOrNull(items, 'Main')).toBe('main.webp')
  })

  it('일치하는 항목이 없으면 null을 반환한다', () => {
    expect(findOrNull(items, 'Missing')).toBeNull()
  })

  it('image가 없는 항목이면 null을 반환한다', () => {
    const noImage = [{ name: 'Main' }] as { name: string; image?: string }[]
    expect(findOrNull(noImage, 'Main')).toBeNull()
  })
})
