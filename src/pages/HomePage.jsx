import { Link } from 'react-router-dom'
import Button from '../components/Button.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import ServiceCard from '../components/ServiceCard.jsx'
import FeatureCard from '../components/FeatureCard.jsx'
import PortfolioCard from '../components/PortfolioCard.jsx'
import StateMessage from '../components/StateMessage.jsx'
import { useAsyncData } from '../lib/useAsyncData.js'
import { useSeo } from '../lib/useSeo.js'
import { getServices, getPortfolio, getSiteSettings } from '../services/contentService.js'
import { studioFeatures } from '../data/siteSettings.js'
import styles from './HomePage.module.css'

export default function HomePage() {
  useSeo({ description: '職人自造是一間專業 3D 列印工作室，提供從建模、列印、修復到後處理的一站式服務。' })
  const { data: site } = useAsyncData(getSiteSettings, [])
  const { data: services } = useAsyncData(getServices, [])
  const { data: portfolio } = useAsyncData(getPortfolio, [])

  const featuredWorks = (portfolio?.items || []).filter((i) => i.isFeatured).slice(0, 3)
  const categoryLabel = (id) =>
    portfolio?.categories?.find((c) => c.id === id)?.label

  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroText}>
            <span className="eyebrow">職人自造 · 3D Printing Studio</span>
            <h1 className={styles.heroTitle}>
              {site?.tagline || '把你的想法，列印成真。'}
            </h1>
            <p className={styles.heroDesc}>
              {site?.description ||
                '從建模、列印到後處理的一站式 3D 列印服務。工程級精度，職人級手感。'}
            </p>
            <div className={styles.heroActions}>
              <Button to="/contact" size="lg">免費詢價</Button>
              <Button to="/gallery" size="lg" variant="outline">瀏覽作品</Button>
            </div>
          </div>

          <div className={styles.heroVisual} aria-hidden="true">
            <div className={styles.layers}>
              <span /><span /><span /><span /><span />
            </div>
            <div className={styles.heroBadge}>
              <strong>0.05mm</strong>
              <small>最細層厚</small>
            </div>
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

      {/* 工作室特色 */}
      <section className="section section--alt">
        <div className="container">
          <SectionHeading
            eyebrow="Why Us"
            title="為什麼選擇職人自造"
            align="center"
          />
          <div className={`grid ${styles.featureGrid}`}>
            {studioFeatures.map((f) => (
              <FeatureCard key={f.id} feature={f} />
            ))}
          </div>
        </div>
      </section>

      {/* 作品摘要 */}
      <section className="section">
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
              告訴我們你的需求，無論是一張草圖或一個 3D 檔案，我們都能幫你評估。
            </p>
          </div>
          <Button to="/contact" size="lg">開始免費詢價</Button>
        </div>
      </section>
    </>
  )
}
