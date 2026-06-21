import styles from './PageHeader.module.css'

/**
 * 內頁頂部標題橫幅（services / gallery / news / faq / about / contact 共用）。
 */
export default function PageHeader({ eyebrow, title, description }) {
  return (
    <section className={styles.header}>
      <div className={`container ${styles.inner}`}>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.desc}>{description}</p>}
      </div>
    </section>
  )
}
