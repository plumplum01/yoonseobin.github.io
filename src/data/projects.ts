export interface Scene {
  name: string
  image: string
}

export interface Project {
  id: string
  title: string
  subtitle: string
  period: string
  role: string
  client: string
  tools: string
  description: string
  thumbnail: string
  images: string[]
  scenes?: Scene[]
}

function sorted(glob: Record<string, unknown>): string[] {
  return Object.entries(glob)
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([, v]) => v as string)
}

const wattImages = sorted(import.meta.glob('../assets/projects/watt-a-lot/*.webp', { eager: true, import: 'default' }))
const groundsImages = sorted(import.meta.glob('../assets/projects/grounds/*.webp', { eager: true, import: 'default' }))
const asterImages = sorted(import.meta.glob('../assets/projects/aster/*.webp', { eager: true, import: 'default' }))
const catchtableImages = sorted(import.meta.glob('../assets/projects/catchtable/*.webp', { eager: true, import: 'default' }))
const plugwayImages = sorted(import.meta.glob('../assets/projects/plugway/*.webp', { eager: true, import: 'default' }))
const preLoanImages = sorted(import.meta.glob('../assets/projects/pre-loan-onboarding/*.webp', { eager: true, import: 'default' }))
const earningsVote1Images = sorted(import.meta.glob('../assets/projects/earnings-vote-1/*.webp', { eager: true, import: 'default' }))
const earningsVote2Images = sorted(import.meta.glob('../assets/projects/earnings-vote-2/*.webp', { eager: true, import: 'default' }))

function loadScenes(glob: Record<string, unknown>): Scene[] {
  return Object.entries(glob)
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([path, v]) => {
      const filename = path.split('/').pop()?.replace('.webp', '') ?? ''
      return { name: filename, image: v as string }
    })
}

const wattScenes = loadScenes(import.meta.glob('../assets/projects/watt-a-lot/full/*.webp', { eager: true, import: 'default' }))
const groundsScenesRaw = loadScenes(import.meta.glob('../assets/projects/grounds/full/*.webp', { eager: true, import: 'default' }))
const groundsScenes = ['Main', 'Explore', 'PIP', 'Shop List']
  .map(name => groundsScenesRaw.find(s => s.name === name))
  .filter((s): s is Scene => s !== undefined)
const asterScenesRaw = loadScenes(import.meta.glob('../assets/projects/aster/full/*.webp', { eager: true, import: 'default' }))
const asterScenes: Scene[] = [['typeA', 'Type A'], ['typeB', 'Type B'], ['PIP', 'PIP'], ['Login', 'Login'], ['Finish', 'Finish']]
  .flatMap(([file, label]) => {
    const found = asterScenesRaw.find(s => s.name === file)
    return found ? [{ name: label, image: found.image }] : []
  })

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
    thumbnail: wattImages[0],
    images: wattImages,
    scenes: wattScenes,
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
    thumbnail: groundsImages[0],
    images: groundsImages,
    scenes: groundsScenes,
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
    thumbnail: asterImages[0],
    images: asterImages,
    scenes: asterScenes,
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
    thumbnail: catchtableImages[0],
    images: catchtableImages,
  },
  {
    id: 'plugway',
    title: 'PLUGWAY',
    subtitle: 'EV Charging & Navigation App',
    period: '2024년 11월 – 2025년 2월',
    role: 'UI/UX Designer',
    client: 'Self Initiated',
    tools: 'Figma',
    description:
      '플러그웨이는 EV 충전 브랜드들을 비교하고 결제할 수 있는 플랫폼 서비스입니다. 실시간 충전기 현황과 주변 즐길 거리를 함께 큐레이션해 충전 대기 시간을 탐색과 휴식의 시간으로 바꾸는 모빌리티 UX를 설계했습니다.',
    thumbnail: plugwayImages[0],
    images: plugwayImages,
  },
  {
    id: 'pre-loan-onboarding',
    title: '신용대출 안내 온보딩',
    subtitle: 'Pre-loan Notice Onboarding',
    period: '2025년 9월 – 10월',
    role: 'UI/UX Designer',
    client: 'TOSS 인터랙션 디자인 캠프',
    tools: 'Figma, Protopie',
    description:
      '신용대출 받기 전 꼭 알아야 할 내용을 그냥 넘기지 않도록 설계했습니다. 스크롤 인터랙션과 컬러 강조로 중요한 안내가 실제로 읽히는 온보딩입니다.',
    thumbnail: preLoanImages[0],
    images: preLoanImages,
  },
  {
    id: 'earnings-vote-1',
    title: '어닝콜 이후 주가 투표하기 (1)',
    subtitle: 'Earnings Reaction Voting',
    period: '2025년 9월 – 10월',
    role: 'UI/UX Designer',
    client: 'TOSS 인터랙션 디자인 캠프',
    tools: 'Figma',
    description:
      '어닝콜 직후 주가 흐름을 예측하고 투표하는 기능입니다. 상승·하락 요인을 카드로 분리해, 복잡한 어닝콜 내용을 오해 없이 전달하는 데 집중했습니다.',
    thumbnail: earningsVote1Images[0],
    images: earningsVote1Images,
  },
  {
    id: 'earnings-vote-2',
    title: '어닝콜 이후 주가 투표하기 (2)',
    subtitle: 'Earnings Reaction Voting',
    period: '2025년 9월 – 10월',
    role: 'UI/UX Designer',
    client: 'TOSS 인터랙션 디자인 캠프',
    tools: 'Figma',
    description:
      '어닝콜 직후, 상승·하락 포인트 개수를 먼저 보여줘 빠른 판단을 유도합니다. 빠른 참여를 이끌면서도 어닝콜 내용이 자연스럽게 읽히도록 설계했습니다.',
    thumbnail: earningsVote2Images[0],
    images: earningsVote2Images,
  },
]
