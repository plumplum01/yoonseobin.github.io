import { useTheme } from '../context/ThemeContext'

export default function AboutPage() {
  const { isDark } = useTheme()

  const textColor = isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.85)'
  const subTextColor = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'
  const dividerColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
  const btnBg = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'
  const btnHoverBg = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'

  return (
    <section
      style={{
        width: '100vw',
        marginLeft: 'calc((100% - 100vw) / 2)',
        minHeight: '100vh',
        backgroundColor: 'var(--bg)',
        paddingTop: '120px',
        paddingBottom: '80px',
        paddingLeft: '32px',
        paddingRight: '32px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ maxWidth: '680px' }}>
        {/* Heading */}
        <h1
          style={{
            fontSize: '32px',
            fontWeight: 600,
            lineHeight: 1.35,
            letterSpacing: '-0.5px',
            color: textColor,
            marginBottom: '32px',
          }}
        >
          모든 신호 사이<br />
          사람과 닿는 접점을<br />
          설계합니다.
        </h1>

        {/* Body text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
          <p style={{ fontSize: '15px', lineHeight: 1.7, color: subTextColor, letterSpacing: '-0.15px' }}>
            저는 UX/UI 디자이너 윤서빈입니다. 사용자의 행동과 맥락을 읽고, 그 안에서 가장 자연스러운 흐름을 만드는 것에 집중합니다.
          </p>
          <p style={{ fontSize: '15px', lineHeight: 1.7, color: subTextColor, letterSpacing: '-0.15px' }}>
            복잡한 정보를 명확하게 구조화하고, 브랜드의 언어를 시각적으로 번역하는 작업을 즐깁니다. 좋은 디자인은 사용자가 의식하지 못할 때 가장 잘 작동한다고 믿습니다.
          </p>
          <p style={{ fontSize: '15px', lineHeight: 1.7, color: subTextColor, letterSpacing: '-0.15px' }}>
            현재는 프로덕트 디자인과 브랜드 경험 사이의 교차점에서 작업하고 있습니다.
          </p>
        </div>

        <hr style={{ border: 'none', borderTop: `1px solid ${dividerColor}`, marginBottom: '40px' }} />

        {/* Awards */}
        <div style={{ marginBottom: '40px' }}>
          <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', color: subTextColor, marginBottom: '20px', textTransform: 'uppercase' }}>
            Awards
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 500, color: textColor, letterSpacing: '-0.14px' }}>
                  Red Dot Design Award
                </p>
                <p style={{ fontSize: '13px', color: subTextColor, letterSpacing: '-0.13px', marginTop: '2px' }}>
                  Concept — UX/UI Design
                </p>
              </div>
              <span style={{ fontSize: '13px', color: subTextColor, flexShrink: 0, marginLeft: '24px' }}>2025</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 500, color: textColor, letterSpacing: '-0.14px' }}>
                  iF Design Award
                </p>
                <p style={{ fontSize: '13px', color: subTextColor, letterSpacing: '-0.13px', marginTop: '2px' }}>
                  Professional Concept
                </p>
              </div>
              <span style={{ fontSize: '13px', color: subTextColor, flexShrink: 0, marginLeft: '24px' }}>2025</span>
            </div>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: `1px solid ${dividerColor}`, marginBottom: '32px' }} />

        {/* Links */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { label: 'LinkedIn', href: 'https://linkedin.com' },
            { label: 'Github', href: 'https://github.com/plumplum01' },
            { label: 'Instagram', href: 'https://instagram.com' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '36px',
                paddingLeft: '16px',
                paddingRight: '16px',
                borderRadius: '8px',
                backgroundColor: btnBg,
                color: textColor,
                fontSize: '14px',
                fontWeight: 500,
                letterSpacing: '-0.14px',
                textDecoration: 'none',
                transition: 'background-color 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = btnHoverBg)}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = btnBg)}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
