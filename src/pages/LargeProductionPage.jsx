import PageHeader from '../components/PageHeader.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import CapabilityCard from '../components/CapabilityCard.jsx'
import Button from '../components/Button.jsx'
import { useSeo } from '../lib/useSeo.js'
import { largeServices, largeProcess, caseTypes } from '../data/largeProduction.js'
import styles from './LargeProductionPage.module.css'

export default function LargeProductionPage() {
  useSeo({
    title: '大型製作',
    description: '從大型本體列印、模型拆件到展示整合，依尺寸、結構與交付需求規劃製作流程。',
  })

  return (
    <>
      <PageHeader
        eyebrow="Large-format Production"
        title="大型製作"
        description="從大型本體列印、模型拆件到展示整合，依尺寸、結構與交付需求規劃製作流程。"
      />

      {/* 服務項目 */}
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Services"
            title="大型製作服務項目"
            subtitle="從本體列印到展示整合，依需求組合製程。"
          />
          <div className={`grid ${styles.serviceGrid}`}>
            {largeServices.map((s) => (
              <CapabilityCard
                key={s.id}
                title={s.title}
                desc={s.desc}
                imageUrl={s.imageUrl}
                icon="▣"
                ratio="4 / 3"
              />
            ))}
          </div>
        </div>
      </section>

      {/* 關鍵流程 */}
      <section className="section section--alt">
        <div className="container">
          <SectionHeading eyebrow="Process" title="大型製作的關鍵流程" align="center" />
          <ol className={styles.process}>
            {largeProcess.map((p) => (
              <li key={p.step} className={styles.step}>
                <span className={styles.stepNum}>{p.step}</span>
                <h3 className={styles.stepTitle}>{p.title}</h3>
                <p className={styles.stepDesc}>{p.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 適合案件 */}
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Use Cases"
            title="適合的案件類型"
            subtitle="商業展示與設計打樣都能對應。"
          />
          <ul className={styles.cases}>
            {caseTypes.map((c) => (
              <li key={c} className={styles.case}>{c}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className={`container ${styles.ctaInner}`}>
          <div>
            <h2 className={styles.ctaTitle}>有大型製作需求？</h2>
            <p className={styles.ctaDesc}>
              告訴我們尺寸、用途與時程，我們協助評估拆件、製程與交付方式。
            </p>
          </div>
          <Button to="/contact" size="lg">前往詢價</Button>
        </div>
      </section>
    </>
  )
}
