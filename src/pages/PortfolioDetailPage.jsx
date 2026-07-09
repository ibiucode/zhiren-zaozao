import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import MediaImage from '../components/MediaImage.jsx'
import PortfolioCard from '../components/PortfolioCard.jsx'
import StateMessage from '../components/StateMessage.jsx'
import Button from '../components/Button.jsx'
import { useAsyncData } from '../lib/useAsyncData.js'
import { useSeo } from '../lib/useSeo.js'
import { getPortfolio, getMaterials, getServices } from '../services/contentService.js'
import styles from './PortfolioDetailPage.module.css'

export default function PortfolioDetailPage() {
  const { id } = useParams()
  const { data: portfolio, loading, error } = useAsyncData(getPortfolio, [])
  const { data: materials } = useAsyncData(getMaterials, [])
  const { data: services } = useAsyncData(getServices, [])
  const [activeImg, setActiveImg] = useState(0)

  const item = portfolio?.items?.find((i) => i.id === id)
  useSeo({ title: item?.title || '作品', description: item?.description })

  if (loading) {
    return <div className="container section"><StateMessage variant="loading" /></div>
  }
  if (error || !item) {
    return (
      <div className={`container section ${styles.notFound}`}>
        <StateMessage variant="error">找不到這件作品，可能已下架。</StateMessage>
        <Button to="/gallery" variant="outline">回作品集</Button>
      </div>
    )
  }

  const categoryLabel = portfolio.categories?.find((c) => c.id === item.category)?.label
  const materialName = materials?.find((m) => m.id === item.materialId)?.name
  const serviceName = services?.find((s) => s.id === item.serviceId)?.name
  const images = Array.isArray(item.images) ? item.images : []
  const mainImg = images[activeImg] ?? images[0] ?? null

  const related = (portfolio.items || [])
    .filter((i) => i.category === item.category && i.id !== item.id)
    .slice(0, 3)

  const quoteLink = item.serviceId
    ? `/contact?service=${encodeURIComponent(item.serviceId)}`
    : '/contact'

  return (
    <div className="section">
      <div className="container">
        <nav className={styles.crumb}>
          <Link to="/gallery">作品集</Link>
          <span className={styles.crumbSep}>/</span>
          <span>{item.title}</span>
        </nav>

        <div className={styles.layout}>
          {/* 圖片區 */}
          <div className={styles.gallery}>
            <div className={styles.mainImg}>
              <MediaImage url={mainImg} alt={item.title} ratio="4/3" label={item.title} icon="◈" />
            </div>
            {images.length > 1 && (
              <div className={styles.thumbs}>
                {images.map((url, i) => (
                  <button
                    key={url + i}
                    type="button"
                    className={`${styles.thumb} ${i === activeImg ? styles.thumbActive : ''}`}
                    onClick={() => setActiveImg(i)}
                    aria-label={`圖片 ${i + 1}`}
                  >
                    <MediaImage url={url} alt="" ratio="4/3" label="" icon="◈" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 資訊區 */}
          <aside className={styles.info}>
            {categoryLabel && <span className={styles.badge}>{categoryLabel}</span>}
            <h1 className={styles.title}>{item.title}</h1>
            <p className={styles.desc}>{item.description}</p>

            <dl className={styles.meta}>
              {materialName && (
                <div className={styles.metaRow}><dt>材料</dt><dd>{materialName}</dd></div>
              )}
              {serviceName && (
                <div className={styles.metaRow}><dt>服務</dt><dd>{serviceName}</dd></div>
              )}
              {item.tags?.length > 0 && (
                <div className={styles.metaRow}><dt>標籤</dt><dd>{item.tags.join(' · ')}</dd></div>
              )}
            </dl>

            <Button to={quoteLink} size="lg" className={styles.cta}>我想做類似的 → 詢價</Button>
          </aside>
        </div>

        {/* 相關作品 */}
        {related.length > 0 && (
          <div className={styles.related}>
            <h2 className={styles.relatedTitle}>相關作品</h2>
            <div className={`grid ${styles.relatedGrid}`}>
              {related.map((r) => (
                <PortfolioCard
                  key={r.id}
                  item={r}
                  categoryLabel={portfolio.categories?.find((c) => c.id === r.category)?.label}
                  materialName={materials?.find((m) => m.id === r.materialId)?.name}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
