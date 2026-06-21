import styles from './SectionHeading.module.css'

/**
 * 區塊標題：小標籤（eyebrow）+ 主標題 + 副說明。
 * align: left | center
 */
export default function SectionHeading({ eyebrow, title, subtitle, align = 'left' }) {
  return (
    <div className={`${styles.wrap} ${align === 'center' ? styles.center : ''}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className={styles.title}>{title}</h2>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  )
}
