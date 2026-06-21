import { useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import PortfolioCard from '../components/PortfolioCard.jsx'
import StateMessage from '../components/StateMessage.jsx'
import { useAsyncData } from '../lib/useAsyncData.js'
import { useSeo } from '../lib/useSeo.js'
import { getPortfolio, getMaterials } from '../services/contentService.js'
import styles from './GalleryPage.module.css'

export default function GalleryPage() {
  useSeo({ title: '作品集', description: '職人自造的 3D 列印作品：工業原型、公仔模型、產品設計與客製小物。' })
  const { data: portfolio, loading, error } = useAsyncData(getPortfolio, [])
  const { data: materials } = useAsyncData(getMaterials, [])
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = portfolio?.categories || []
  const items = portfolio?.items || []
  const visibleItems =
    activeCategory === 'all'
      ? items
      : items.filter((i) => i.category === activeCategory)

  const categoryLabel = (id) => categories.find((c) => c.id === id)?.label
  const materialName = (id) => materials?.find((m) => m.id === id)?.name

  return (
    <>
      <PageHeader
        eyebrow="Portfolio"
        title="作品集"
        description="我們完成過的部分專案，涵蓋工業原型、公仔模型、產品設計與客製小物。"
      />

      <section className="section">
        <div className="container">
          {loading && <StateMessage variant="loading" />}
          {error && <StateMessage variant="error" />}

          {portfolio && (
            <>
              {/* 分類篩選 */}
              <div className={styles.filters}>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    className={`${styles.filter} ${
                      activeCategory === c.id ? styles.filterActive : ''
                    }`}
                    onClick={() => setActiveCategory(c.id)}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {visibleItems.length === 0 ? (
                <StateMessage variant="empty">此分類目前沒有作品。</StateMessage>
              ) : (
                <div className={`grid ${styles.grid}`}>
                  {visibleItems.map((item) => (
                    <PortfolioCard
                      key={item.id}
                      item={item}
                      categoryLabel={categoryLabel(item.category)}
                      materialName={materialName(item.materialId)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}
