import { Link, useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import MaterialCard from '../components/MaterialCard.jsx'
import StateMessage from '../components/StateMessage.jsx'
import Button from '../components/Button.jsx'
import { useAsyncData } from '../lib/useAsyncData.js'
import { useSeo } from '../lib/useSeo.js'
import { getMaterials } from '../services/contentService.js'
import { techServices } from '../data/servicePages.js'
import styles from './TechServicePage.module.css'

/**
 * FDM / SLA 服務頁（單一模板，內容由 techServices[tech] 驅動）。
 * 路由：/services/:tech（fdm | sla）。材料區走 API（後台可改）。
 */
export default function TechServicePage() {
  const { tech } = useParams()
  const config = techServices[tech]
  const { data: materials } = useAsyncData(getMaterials, [])

  useSeo({ title: config?.title || '服務', description: config?.description })

  if (!config) {
    return (
      <div className={`container section ${styles.notFound}`}>
        <StateMessage variant="error">找不到這個服務頁面。</StateMessage>
        <Button to="/services" variant="outline">回服務總覽</Button>
      </div>
    )
  }

  const pageMaterials = (materials || []).filter((m) => config.materialIds.includes(m.id))

  return (
    <>
      <PageHeader eyebrow={config.eyebrow} title={config.title} description={config.description} />

      {/* 特點 */}
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Why" title={`${config.title}適合什麼`} />
          <div className={`grid ${styles.strengthGrid}`}>
            {config.strengths.map((s) => (
              <div key={s.id} className={styles.strength}>
                <h3 className={styles.strengthTitle}>{s.title}</h3>
                <p className={styles.strengthDesc}>{s.desc}</p>
              </div>
            ))}
          </div>

          {/* 規格 */}
          <dl className={styles.specs}>
            {config.specs.map((sp) => (
              <div key={sp.label} className={styles.spec}>
                <dt>{sp.label}</dt>
                <dd>{sp.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 材料（來自後台 API） */}
      <section className="section section--alt">
        <div className="container">
          <SectionHeading eyebrow="Materials" title="可選材料" subtitle={config.materialNote} />
          {!materials ? (
            <StateMessage variant="loading" />
          ) : pageMaterials.length === 0 ? (
            <StateMessage variant="empty">材料資訊整理中，歡迎直接詢問。</StateMessage>
          ) : (
            <div className={`grid ${styles.materialGrid}`}>
              {pageMaterials.map((m) => (
                <MaterialCard key={m.id} material={m} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 適合案件 */}
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Use cases" title="常見案件類型" />
          <ul className={styles.cases}>
            {config.cases.map((c) => (
              <li key={c} className={styles.case}>{c}</li>
            ))}
          </ul>
          {config.crossLink && (
            <div className={styles.crossLink}>
              <Link to={config.crossLink.to}>{config.crossLink.label}</Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className={`container ${styles.ctaInner}`}>
          <div>
            <h2 className={styles.ctaTitle}>把檔案傳給我們評估</h2>
            <p className={styles.ctaDesc}>
              附上 STL / OBJ / STEP，可線上預覽尺寸並檢查破面，我們會盡快回覆報價。
            </p>
          </div>
          <Button to={`/contact?service=${encodeURIComponent(config.serviceId)}`} size="lg">
            前往詢價
          </Button>
        </div>
      </section>
    </>
  )
}
