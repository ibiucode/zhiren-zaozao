import { useState } from 'react'
import ImagePlaceholder from './ImagePlaceholder.jsx'
import styles from './MediaImage.module.css'

/**
 * 內容圖片（純 UI）：有 url 用 <img object-fit:cover>，載入失敗或無 url 時
 * 顯示工業風 placeholder（不破版）。固定比例由 ratio 控制。
 * @param {{ url?: string|null, alt?: string, ratio?: string, label?: string, icon?: string }} props
 */
export default function MediaImage({ url, alt = '', ratio = '4/3', label = '圖片', icon = '◈' }) {
  const [ok, setOk] = useState(true)

  if (!url || !ok) {
    return <ImagePlaceholder label={label} ratio={ratio} icon={icon} />
  }
  return (
    <div className={styles.box} style={{ aspectRatio: ratio }}>
      <img
        className={styles.img}
        src={url}
        alt={alt}
        loading="lazy"
        onError={() => setOk(false)}
      />
    </div>
  )
}
