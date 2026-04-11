import aboutData from '../data/about.json'
import styles from './AboutPage.module.css'

const { heading, paragraphs, education, awards, links } = aboutData

export default function AboutPage() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>

        {/* 페이지 헤딩 */}
        <h1 className={`t-section-heading ${styles.heading}`}>
          {heading}
        </h1>

        {/* 본문 단락 */}
        <div className={styles.intro}>
          {paragraphs.map((p, i) => (
            <p key={i} className={`t-body ${styles.introParagraph}`}>
              {p}
            </p>
          ))}
        </div>

        <hr className={`${styles.divider} ${styles.dividerIntro}`} />

        {/* Education 섹션 */}
        <div className={styles.sectionBlock}>
          <h2 className={`t-section-heading ${styles.sectionTitle}`}>
            Education
          </h2>
          <div className={`${styles.list} ${styles.listEducation}`}>
            {education.map((e) => (
              <div key={e.title} className={styles.row}>
                <span className={`t-list-title ${styles.eduTitle}`}>
                  {e.title}
                </span>
                <span className={`t-list-detail ${styles.eduDate}`}>
                  {e.date}
                </span>
              </div>
            ))}
          </div>
        </div>

        <hr className={`${styles.divider} ${styles.dividerSection}`} />

        {/* Awards 섹션 */}
        <div className={styles.sectionBlock}>
          <h2 className={`t-section-heading ${styles.sectionTitle}`}>
            Awards
          </h2>
          <div className={`${styles.list} ${styles.listAwards}`}>
            {awards.map((a) => (
              <div key={a.title} className={styles.row}>
                <div className={styles.awardBody}>
                  <span className={`t-list-title ${styles.awardTitle}`}>
                    {a.title}
                  </span>
                  <span className={`t-list-detail ${styles.awardDesc}`}>
                    {a.desc}
                  </span>
                </div>
                <span className={`t-list-detail ${styles.awardDate}`}>
                  {a.date}
                </span>
              </div>
            ))}
          </div>
        </div>

        <hr className={`${styles.divider} ${styles.dividerLinks}`} />

        {/* 링크 버튼 */}
        <div className={styles.links}>
          {links.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`t-nav ${styles.linkButton}`}
            >
              {label}
            </a>
          ))}
        </div>

      </div>
    </section>
  )
}
