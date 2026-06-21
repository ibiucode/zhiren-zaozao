import styles from './ImagePlaceholder.module.css'

/**
 * 圖片佔位區塊。Phase 1 的內容資料尚無真實圖片（image/images = null），
 * 以樣式化色塊呈現，避免外部圖片相依與破圖。
 * 未來資料帶入真實圖片 URL 後，可在使用端改為 <img>，此元件作為 fallback。
 * ratio: '4/3' | '16/9' | '1/1'
 */
export default function ImagePlaceholder({ label = '圖片', ratio = '4/3', icon = '◈' }) {
  return (
    <div className={styles.box} style={{ aspectRatio: ratio }}>
      <span className={styles.icon} aria-hidden="true">{icon}</span>
      <span className={styles.label}>{label}</span>
    </div>
  )
}
