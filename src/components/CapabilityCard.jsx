import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './CapabilityCard.module.css'

/**
 * 能力 / 服務卡（純 UI，首頁與大型製作頁共用）。
 * 圖片區：有 imageUrl 就用 <img object-fit:cover>，失敗或沒有則顯示工業風 placeholder。
 * 有 to 則整張卡可點擊（導向該路由）。
 * @param {{ title:string, desc:string, imageUrl?:string|null, to?:string, icon?:string, ratio?:string }} props
 */
export default function CapabilityCard({ title, desc, imageUrl, to, icon = '◧', ratio = '16 / 9' }) {
  const [imgOk, setImgOk] = useState(Boolean(imageUrl))

  const inner = (
    <>
      <div className={styles.media} style={{ aspectRatio: ratio }}>
        {imageUrl && imgOk ? (
          <img
            className={styles.img}
            src={imageUrl}
            alt={title}
            loading="lazy"
            onError={() => setImgOk(false)}
          />
        ) : (
          <div className={styles.placeholder} aria-hidden="true">
            <span className={styles.phIcon}>{icon}</span>
            <span className={styles.phLabel}>{title}</span>
          </div>
        )}
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>
          {title}
          {to && <span className={styles.arrow} aria-hidden="true">→</span>}
        </h3>
        <p className={styles.desc}>{desc}</p>
      </div>
    </>
  )

  if (to) {
    return (
      <Link to={to} className={`${styles.card} ${styles.linkCard}`}>
        {inner}
      </Link>
    )
  }
  return <article className={styles.card}>{inner}</article>
}
