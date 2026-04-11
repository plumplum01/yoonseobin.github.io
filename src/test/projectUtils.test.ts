import { sortedEntries, findOrNull, loadScenes } from '../utils/projectUtils'

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

describe('loadScenes', () => {
  it('glob을 숫자 순서로 정렬하고 { name, image } 배열로 변환한다', () => {
    const glob = {
      '../assets/projects/watt/full/10-finish.webp': 'url-finish',
      '../assets/projects/watt/full/2-question.webp': 'url-question',
      '../assets/projects/watt/full/1-main.webp': 'url-main',
    }
    expect(loadScenes(glob)).toEqual([
      { name: '1-main',    image: 'url-main' },
      { name: '2-question', image: 'url-question' },
      { name: '10-finish', image: 'url-finish' },
    ])
  })

  it('빈 glob이면 빈 배열을 반환한다', () => {
    expect(loadScenes({})).toEqual([])
  })

  it('파일명에서 .webp 확장자를 제거한다', () => {
    const glob = { '../assets/Main.webp': 'url-main' }
    expect(loadScenes(glob)[0].name).toBe('Main')
  })

  it('경로에서 파일명(마지막 세그먼트)만 추출한다', () => {
    const glob = { '../deeply/nested/path/Scene.webp': 'url' }
    expect(loadScenes(glob)[0].name).toBe('Scene')
  })
})
