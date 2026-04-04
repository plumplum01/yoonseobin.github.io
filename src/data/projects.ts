export interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  thumbnail: string
}

export const projects: Project[] = [
  // 프로젝트 추가 예시:
  // {
  //   id: 'project-1',
  //   title: '프로젝트 이름',
  //   description: '프로젝트 설명',
  //   tags: ['UI/UX', 'Mobile'],
  //   thumbnail: '/images/project-1.png',
  // },
]
