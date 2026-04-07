import { useTheme } from '../context/ThemeContext'

const education = [
  { title: '부산대학교 디자인전공 시각디자인학과 졸업', date: '20. 03 – 25. 02' },
  { title: '토스 인터랙션 디자인 캠프 수료', date: '25. 09 – 25. 10' },
  { title: 'KAKAO X Goorm 프로덕트 디자이너 교육 과정 수료', date: '24. 11 – 25. 06' },
]

const awards = [
  {
    title: '한국디자인학회 봄 국제학술대회',
    desc: 'P2P 카셰어링 활성화를 위한 서비스 제안\n고령층 유휴차량 활용과 신뢰도 향상을 중심으로',
    date: '23. 05',
  },
  {
    title: '9oormthon 딥다이브 해커톤 우수상',
    desc: "하이퍼로컬 기반 어린이 심부름 연습 서비스 '똑띠' 제안",
    date: '24. 12',
  },
]

const links = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/%EC%84%9C%EB%B9%88-%EC%9C%A4-8a59342b8/' },
  { label: 'Github',   href: 'https://github.com/plumplum01' },
  { label: 'Instagram', href: 'https://www.instagram.com/pllummmmie/' },
]

export default function AboutPage() {
  const { isDark } = useTheme()

  const text     = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)'
  const heading  = isDark ? '#ffffff' : '#000000'
  const divider  = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'
  const btnBase  = isDark ? '#3a3838' : 'rgb(153,149,149)'
  const btnHover = isDark ? '#555353' : 'rgb(110,107,107)'

  return (
    <section
      className="min-h-screen text-left"
      style={{
        backgroundColor: isDark ? '#141414' : '#fafafa',
        width: '100vw',
        marginLeft: 'calc((100% - 100vw) / 2)',
      }}
    >
      <div
        className="mx-auto"
        style={{ maxWidth: 466, paddingTop: 200, paddingBottom: 80 }}
      >
        {/* Heading */}
        <h1
          className="font-semibold leading-[1.3]"
          style={{ fontSize: 24, color: heading, marginBottom: 24, letterSpacing: '-0.24px' }}
        >
          모든 신호 사이<br />사람과 닿는 접점을 설계합니다.
        </h1>

        {/* Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 103 }}>
          <p style={{ fontSize: 13, color: text, lineHeight: 1.7, letterSpacing: '-0.13px', fontWeight: 500 }}>
            인터페이스를 서로 다른 요소 간에 정보나 신호를 주고받는 접점, 또는 약속이라고 여기며 데이터를 바탕으로 정보의 흐름을 정리하고, 디자인 시스템으로 일관된 경험을 만듭니다. UI 하나하나에 브랜드의 가치를 담아, 그냥 작동하는 것 이상의 제품을 만듭니다.
          </p>
          <p style={{ fontSize: 13, color: text, lineHeight: 1.7, letterSpacing: '-0.13px', fontWeight: 500 }}>
            뉴하스(Neuhas)에서 꾸준히 스터디를 합니다. 다양한 관심 분야를 가진 멤버들과 타이포그래피, 브랜드, 그래픽, 모션에 대해 이야기 합니다. 다른 분야를 볼수록 디자인도 다르게 보입니다. 시야가 좁아지면 작업도 좁아지니까요.
          </p>
          <p style={{ fontSize: 13, color: text, lineHeight: 1.7, letterSpacing: '-0.13px', fontWeight: 500 }}>
            지금은 함께할 팀을 찾고 있습니다. 비주얼과 인터랙션을 타협하지 않는 팀을 만나고 싶습니다. 만들고 싶은 것이 있다면 편하게 이야기 걸어주세요.
          </p>
        </div>

        {/* Divider */}
        <hr style={{ border: 'none', borderTop: `1px solid ${divider}`, marginBottom: 103 }} />

        {/* Education */}
        <div style={{ marginBottom: 103 }}>
          <h2
            className="font-semibold"
            style={{ fontSize: 24, color: heading, letterSpacing: '-0.24px', marginBottom: 9 }}
          >
            Education
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {education.map((e) => (
              <div key={e.title} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: heading, letterSpacing: '-0.13px', lineHeight: 1.35 }}>
                  {e.title}
                </span>
                <span style={{ fontSize: 13, fontWeight: 500, color: text, letterSpacing: '-0.13px', flexShrink: 0, lineHeight: 1.35 }}>
                  {e.date}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <hr style={{ border: 'none', borderTop: `1px solid ${divider}`, marginBottom: 103 }} />

        {/* Awards */}
        <div style={{ marginBottom: 103 }}>
          <h2
            className="font-semibold"
            style={{ fontSize: 24, color: heading, letterSpacing: '-0.24px', marginBottom: 9 }}
          >
            Awards
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {awards.map((a) => (
              <div key={a.title} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: heading, letterSpacing: '-0.13px' }}>
                    {a.title}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: text, letterSpacing: '-0.13px', whiteSpace: 'pre-line', lineHeight: 1.35 }}>
                    {a.desc}
                  </span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 500, color: text, letterSpacing: '-0.13px', flexShrink: 0, lineHeight: 1.35 }}>
                  {a.date}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <hr style={{ border: 'none', borderTop: `1px solid ${divider}`, marginBottom: 39 }} />

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 7 }}>
          {links.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                height: 39,
                backgroundColor: btnBase,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                color: 'rgba(250,250,250,1)',
                fontSize: 15,
                fontWeight: 400,
                letterSpacing: '-0.15px',
                transition: 'background-color 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = btnHover)}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = btnBase)}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
