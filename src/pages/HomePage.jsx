import { Link } from 'react-router-dom'
import Button from '../components/Button.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import ServiceCard from '../components/ServiceCard.jsx'
import PortfolioCard from '../components/PortfolioCard.jsx'
import CapabilityCard from '../components/CapabilityCard.jsx'
import StateMessage from '../components/StateMessage.jsx'
import { useAsyncData } from '../lib/useAsyncData.js'
import { useSeo } from '../lib/useSeo.js'
import { getServices, getPortfolio } from '../services/contentService.js'
import { capabilities } from '../data/capabilities.js'
import { homeHighlights } from '../data/largeProduction.js'
import styles from './HomePage.module.css'

export default function HomePage() {
  useSeo({
    description:
      '職人自造提供大型列印製作、模型拆件與組裝規劃、工程原型打樣，以及底座與表面處理。',
  })
  const { data: services } = useAsyncData(getServices, [])
  const { data: portfolio } = useAsyncData(getPortfolio, [])

  const featuredWorks = (portfolio?.items || []).filter((i) => i.isFeatured).slice(0, 3)
  const categoryLabel = (id) => portfolio?.categories?.find((c) => c.id === id)?.label

  return (
    <>
      {/* 第一屏：我們的專業（能力說明型） */}
      <section className={styles.expertise}>
        <div className="container">
          <div className={styles.expertiseHead}>
            <span className="eyebrow">Our Expertise</span>
            <h1 className={styles.expertiseTitle}>我們的專業</h1>
            <p className={styles.expertiseSub}>
              大型列印製作｜拆件與組裝規劃｜工程原型打樣｜底座與表面處理
            </p>
          </div>

          <div className={`grid ${styles.capGrid}`}>
            {capabilities.map((c) => (
              <CapabilityCard key={c.id} {...c} />
            ))}
          </div>

          <div className={styles.expertiseCta}>
            <Button to="/large-production" size="lg">查看大型製作服務</Button>
            <Button to="/contact" size="lg" variant="outline">聯絡我們</Button>
          </div>
        </div>
      </section>

      {/* 大型製作的關鍵流程／特點（取代「為什麼選擇」） */}
      <section className="section section--alt">
        <div className="container">
          <SectionHeading
            eyebrow="Large-format"
            title="大型製作的關鍵流程"
            subtitle="從拆件、本體列印到底座與表面處理，依結構與交付需求規劃製程。"
            align="center"
          />
          <div className={`grid ${styles.highlightGrid}`}>
            {homeHighlights.map((h) => (
              <div key={h.id} className={styles.highlight}>
                <h3 className={styles.highlightTitle}>{h.title}</h3>
                <p className={styles.highlightDesc}>{h.desc}</p>
              </div>
            ))}
          </div>
          <div className={styles.moreLink}>
            <Link to="/large-production">了解大型製作 →</Link>
          </div>
        </div>
      </section>

      {/* 服務摘要 */}
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Our Services"
            title="我們能為你做什麼"
            subtitle="從一個想法到一件成品，每個環節都交給專業。"
          />
          {!services ? (
            <StateMessage variant="loading" />
          ) : (
            <div className={`grid ${styles.servicesGrid}`}>
              {services.slice(0, 4).map((s) => (
                <ServiceCard key={s.id} service={s} compact />
              ))}
            </div>
          )}
          <div className={styles.moreLink}>
            <Link to="/services">查看完整服務內容 →</Link>
          </div>
        </div>
      </section>

      {/* 作品摘要 */}
      <section className="section section--alt">
        <div className="container">
          <SectionHeading
            eyebrow="Selected Works"
            title="精選作品"
            subtitle="看看我們最近完成的一些專案。"
          />
          {!portfolio ? (
            <StateMessage variant="loading" />
          ) : (
            <div className={`grid ${styles.worksGrid}`}>
              {featuredWorks.map((item) => (
                <PortfolioCard
                  key={item.id}
                  item={item}
                  categoryLabel={categoryLabel(item.category)}
                />
              ))}
            </div>
          )}
          <div className={styles.moreLink}>
            <Link to="/gallery">看更多作品 →</Link>
          </div>
        </div>
      </section>

      {/* 詢價 CTA */}
      <section className={styles.cta}>
        <div className={`container ${styles.ctaInner}`}>
          <div>
            <h2 className={styles.ctaTitle}>有專案想討論？</h2>
            <p className={styles.ctaDesc}>
              告訴我們你的需求，無論是大型展示件或一個 3D 檔案，我們都能幫你評估。
            </p>
          </div>
          <Button to="/contact" size="lg">開始免費詢價</Button>
        </div>
      </section>
    </>
  )
}
