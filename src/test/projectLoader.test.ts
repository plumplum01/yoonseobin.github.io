import {
  buildProjects,
  groupImagesByProject,
  groupScenesByProject,
  type ProjectData,
} from '../lib/projectLoader'

describe('groupImagesByProject', () => {
  it('경로를 프로젝트 id 기준으로 그룹화하고 숫자 순으로 정렬한다', () => {
    const glob = {
      '../assets/projects/watt-a-lot/watt 1.webp': 'w1',
      '../assets/projects/watt-a-lot/watt 10.webp': 'w10',
      '../assets/projects/watt-a-lot/watt 2.webp': 'w2',
      '../assets/projects/grounds/gro 1.webp': 'g1',
    }
    expect(groupImagesByProject(glob)).toEqual({
      'watt-a-lot': ['w1', 'w2', 'w10'],
      grounds: ['g1'],
    })
  })

  it('빈 입력이면 빈 객체를 반환한다', () => {
    expect(groupImagesByProject({})).toEqual({})
  })
})

describe('groupScenesByProject', () => {
  it('full/ 하위 경로를 프로젝트 id 기준으로 그룹화하고 { name, image } 배열로 변환한다', () => {
    const glob = {
      '../assets/projects/watt-a-lot/full/Main.webp': 'w-main',
      '../assets/projects/watt-a-lot/full/Q.webp': 'w-q',
      '../assets/projects/aster/full/typeA.webp': 'a-typeA',
    }
    expect(groupScenesByProject(glob)).toEqual({
      'watt-a-lot': [
        { name: 'Main', image: 'w-main' },
        { name: 'Q', image: 'w-q' },
      ],
      aster: [{ name: 'typeA', image: 'a-typeA' }],
    })
  })

  it('빈 입력이면 빈 객체를 반환한다', () => {
    expect(groupScenesByProject({})).toEqual({})
  })
})

describe('buildProjects', () => {
  const baseData: ProjectData = {
    id: 'example',
    title: 'Example',
    subtitle: 'sub',
    period: 'p',
    role: 'r',
    client: 'c',
    tools: 't',
    description: 'd',
  }

  it('id/meta를 그대로 복사하고 이미지 배열을 매핑한다', () => {
    const result = buildProjects([baseData], { example: ['img1', 'img2'] }, {})
    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({
      id: 'example',
      title: 'Example',
      subtitle: 'sub',
      period: 'p',
      role: 'r',
      client: 'c',
      tools: 't',
      description: 'd',
      thumbnail: 'img1',
      images: ['img1', 'img2'],
    })
    expect(result[0].scenes).toBeUndefined()
  })

  it('scenes가 있으면 imageKey를 sceneAssets에서 찾아 image로 채운다', () => {
    const data: ProjectData = {
      ...baseData,
      id: 'watt',
      scenes: [
        { name: 'Main', imageKey: 'Main' },
        { name: 'Question', imageKey: 'Q', videos: [{ src: 'q.mp4' }] },
      ],
    }
    const result = buildProjects(
      [data],
      { watt: ['w1'] },
      {
        watt: [
          { name: 'Main', image: 'main.webp' },
          { name: 'Q', image: 'q.webp' },
        ],
      },
    )
    expect(result[0].scenes).toEqual([
      { name: 'Main', image: 'main.webp' },
      { name: 'Question', image: 'q.webp', videos: [{ src: 'q.mp4' }] },
    ])
  })

  it('imageKey가 없으면 image는 undefined', () => {
    const data: ProjectData = {
      ...baseData,
      id: 'grounds',
      scenes: [{ name: 'GNB', videos: [{ src: 'g.mp4' }] }],
    }
    const result = buildProjects(
      [data],
      { grounds: ['g1'] },
      { grounds: [] },
    )
    expect(result[0].scenes).toEqual([
      { name: 'GNB', image: undefined, videos: [{ src: 'g.mp4' }] },
    ])
  })

  it('imageKey가 sceneAssets에 없으면 image는 undefined', () => {
    const data: ProjectData = {
      ...baseData,
      id: 'aster',
      scenes: [{ name: 'Type A', imageKey: 'typeA' }],
    }
    const result = buildProjects(
      [data],
      { aster: ['a1'] },
      { aster: [{ name: 'typeB', image: 'b.webp' }] },
    )
    expect(result[0].scenes![0].image).toBeUndefined()
  })

  it('video delay는 그대로 전달된다', () => {
    const data: ProjectData = {
      ...baseData,
      id: 'watt',
      scenes: [
        {
          name: 'Q',
          imageKey: 'Q',
          videos: [
            { src: 'a.mp4' },
            { src: 'b.mp4', delay: 4000 },
          ],
        },
      ],
    }
    const result = buildProjects(
      [data],
      { watt: ['w1'] },
      { watt: [{ name: 'Q', image: 'q.webp' }] },
    )
    expect(result[0].scenes![0].videos).toEqual([
      { src: 'a.mp4' },
      { src: 'b.mp4', delay: 4000 },
    ])
  })
})
