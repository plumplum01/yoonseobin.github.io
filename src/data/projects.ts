export interface Project {
  id: string
  title: string
  subtitle: string
  period: string
  role: string
  client: string
  tools: string
  description: string
  thumbnail?: string
}

export const projects: Project[] = [
  {
    id: 'watt-a-lot',
    title: 'WATT A LOT',
    subtitle: 'EV Curation Platform',
    period: '2025년 6월 – 12월',
    role: 'UI/UX Designer',
    client: 'Self Initiated',
    tools: 'Figma, Midjourney, Protopie',
    description:
      '와트어랏은 여러 브랜드의 전기차를 한 곳에서 비교하고 계약까지 할 수 있는 EV 큐레이션 플랫폼입니다. 단계별 개인화로 나에게 맞는 차를 쉽게 찾고, 차량 자체에 몰입하는 프리미엄 경험을 설계했습니다.',
  },
  {
    id: 'grounds',
    title: 'GROUNDS',
    subtitle: 'Branded Shopping Platform',
    period: '2025년 11월 – 2026년 1월',
    role: 'UI/UX Designer',
    client: 'Self Initiated',
    tools: 'Figma, Midjourney, Protopie',
    description:
      '그라운즈는 \'중력을 거스르는 부유감\'을 실루엣으로 구현하는 슈즈 브랜드입니다. 자사몰의 획일화된 탐색 구조를 개선한 웹사이트 리디자인으로, 브랜드 철학을 담은 내비게이션과 유영하는 2D 탐색 경험을 설계했습니다.',
  },
  {
    id: 'aster',
    title: 'ASTER',
    subtitle: 'Branded Shopping Platform',
    period: '2025년 6월 – 12월',
    role: 'UI/UX Designer',
    client: 'Self Initiated',
    tools: 'Figma, Midjourney, Protopie',
    description:
      '아스터(ASTER)는 정해진 틀을 깨고, 자기다움을 패션으로 드러내는 고프코어 브랜드입니다. 자사몰 UX를 새로 설계한 콘셉트 작업으로, 쇼핑하는 과정에서 브랜드에 자연스럽게 몰입할 수 있도록 구성했습니다.',
  },
  {
    id: 'catchtable',
    title: 'CatchTable',
    subtitle: 'Dining Reservation Platform',
    period: '2025년 11월 – 12월',
    role: 'UI/UX Designer',
    client: 'Self Initiated',
    tools: 'Figma, Midjourney, Protopie',
    description:
      '캐치테이블은 특별한 날의 식사를 더 특별하게 만드는 하이엔드 파인다이닝 예약 플랫폼입니다. 일반 식당과 다를 바 없던 예약 과정을 프리미엄 다이닝에 어울리는 경험으로 새로 설계한 UX/UI 리뉴얼로, 사용자가 예약 피로와 실수 없이 \'대접받는 경험\' 자체에 집중할 수 있도록 했습니다.',
  },
]
