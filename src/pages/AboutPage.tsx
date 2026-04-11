import { type } from '../styles/typography'
import { colors, useColors } from '../styles/colors'
import { useThemeStore } from '../store/themeStore'
import aboutData from '../data/about.json'

// ─── 컴포넌트 ──────────────────────────────────────────────────────────────────

const { heading, paragraphs, education, awards, links } = aboutData

export default function AboutPage() {
  const c = useColors()
  const isDark = useThemeStore((s) => s.isDark)

  return (
    <section
      className="min-h-screen text-left"
      style={{
        backgroundColor: c.aboutBg,
        width: '100vw',
        marginLeft: 'calc((100% - 100vw) / 2)',
      }}
    >
      <div className="mx-auto" style={{ maxWidth: 466, paddingTop: 200, paddingBottom: 80 }}>

        {/* 페이지 헤딩 */}
        <h1
          className="font-semibold leading-[1.3]"
          style={{ ...type.sectionHeading, color: c.heading, marginBottom: 24, whiteSpace: 'pre-line' }}
        >
          {heading}
        </h1>

        {/* 본문 단락 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 103 }}>
          {paragraphs.map((p, i) => (
            <p key={i} style={{ ...type.body, color: c.textPrimary }}>
              {p}
            </p>
          ))}
        </div>

        <hr style={{ border: 'none', borderTop: `1px solid ${c.divider}`, marginBottom: 103 }} />

        {/* Education 섹션 */}
        <div style={{ marginBottom: 72 }}>
          <h2 className="font-semibold" style={{ ...type.sectionHeading, color: c.heading, marginBottom: 20 }}>
            Education
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {education.map((e) => (
              <div key={e.title} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16 }}>
                <span style={{ ...type.listTitle, color: c.heading }}>
                  {e.title}
                </span>
                <span style={{ ...type.listDetail, color: c.textPrimary, flexShrink: 0 }}>
                  {e.date}
                </span>
              </div>
            ))}
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: `1px solid ${c.divider}`, marginBottom: 72 }} />

        {/* Awards 섹션 */}
        <div style={{ marginBottom: 72 }}>
          <h2 className="font-semibold" style={{ ...type.sectionHeading, color: c.heading, marginBottom: 20 }}>
            Awards
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {awards.map((a) => (
              <div key={a.title} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span style={{ ...type.listTitle, color: c.heading }}>
                    {a.title}
                  </span>
                  <span style={{ ...type.listDetail, color: c.textPrimary, whiteSpace: 'pre-line' }}>
                    {a.desc}
                  </span>
                </div>
                <span style={{ ...type.listDetail, color: c.textPrimary, flexShrink: 0 }}>
                  {a.date}
                </span>
              </div>
            ))}
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: `1px solid ${c.divider}`, marginBottom: 39 }} />

        {/* 링크 버튼 */}
        <div style={{ display: 'flex', gap: 7 }}>
          {links.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...type.nav,
                flex: 1,
                height: 39,
                backgroundColor: c.btnBase,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                color: colors.white,
                fontWeight: 400,
                transition: 'background-color 0.15s',
                boxShadow: isDark ? 'inset 0 0 0 0.5px rgba(255,255,255,0.35)' : 'inset 0 0 0 0.5px rgba(0,0,0,0.45)',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = c.btnHover)}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = c.btnBase)}
            >
              {label}
            </a>
          ))}
        </div>

      </div>
    </section>
  )
}
