import ImagePlaceholder from './ImagePlaceholder.jsx'
import styles from './PortfolioCard.module.css'

/**
 * 作品卡片（純 UI）。
 * @param {{ item: PortfolioItem, categoryLabel?: string, materialName?: string }} props
 * categoryLabel / materialName 由使用端（頁面）依 id 對照後傳入，卡片本身不查資料。
 */
export default function PortfolioCard({ item, categoryLabel, materialName }) {
  return (
    <article className={styles.card}>
      <div className={styles.media}>
        <ImagePlaceholder label={item.title} ratio="4/3" icon="◈" />
        {categoryLabel && <span className={styles.badge}>{categoryLabel}</span>}
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{item.title}</h3>
        {materialName && <span className={styles.material}>材料：{materialName}</span>}
        <p className={styles.desc}>{item.description}</p>
        {item.tags?.length > 0 && (
          <ul className={styles.tags}>
            {item.tags.map((t) => (
              <li key={t} className={styles.tag}>#{t}</li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}
