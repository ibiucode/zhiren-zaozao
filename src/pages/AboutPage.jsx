import PageHeader from '../components/PageHeader.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { useSeo } from '../lib/useSeo.js'
import { aboutContent } from '../data/siteSettings.js'
import styles from './AboutPage.module.css'

export default function AboutPage() {
  useSeo({ title: '關於我們', description: '認識職人自造：製作流程、專業能力與品質承諾。' })
  const { intro, process, capabilities, promises } = aboutContent

  return (
    <>
      <PageHeader
        eyebrow="About Us"
        title="關於職人自造"
        description="技術與手感的結合，是我們對每一件作品的堅持。"
      />

      {/* 工作室介紹 */}
      <section className="section">
        <div className={`container ${styles.intro}`}>
          <p>{intro}</p>
        </div>
      </section>

      {/* 製作流程 */}
      <section className="section section--alt">
        <div className="container">
          <SectionHeading eyebrow="Process" title="製作流程" align="center" />
          <ol className={styles.process}>
            {process.map((p) => (
              <li key={p.id} className={styles.step}>
                <span className={styles.stepNum}>{p.step}</span>
                <h3 className={styles.stepTitle}>{p.title}</h3>
                <p className={styles.stepDesc}>{p.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 專業能力 */}
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Capabilities" title="專業能力" />
          <ul className={styles.capabilities}>
            {capabilities.map((c) => (
              <li key={c} className={styles.capability}>{c}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* 品質承諾 */}
      <section className="section section--alt">
        <div className="container">
          <SectionHeading eyebrow="Our Promise" title="品質承諾" align="center" />
          <div className={`grid ${styles.promises}`}>
            {promises.map((q) => (
              <div key={q.id} className={styles.promise}>
                <h3 className={styles.promiseTitle}>{q.title}</h3>
                <p className={styles.promiseDesc}>{q.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
