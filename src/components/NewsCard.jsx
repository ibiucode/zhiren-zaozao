import { Link } from 'react-router-dom'
import MediaImage from './MediaImage.jsx'
import styles from './NewsCard.module.css'

/**
 * 最新消息卡片（純 UI）。整張卡可點擊 → /news/{id} 詳情頁。
 * 有 coverImage 時顯示真實圖片，否則顯示 placeholder。
 * @param {{ post: NewsPost }} props
 */
export default function NewsCard({ post }) {
  return (
    <Link to={`/news/${post.id}`} className={styles.card}>
      <div className={styles.media}>
        <MediaImage url={post.coverImage} alt={post.title} ratio="16/9" label="最新消息" icon="◆" />
      </div>
      <div className={styles.body}>
        <time className={styles.date}>{post.publishedAt}</time>
        <h3 className={styles.title}>{post.title}</h3>
        <p className={styles.summary}>{post.summary}</p>
        <span className={styles.readMore}>閱讀全文 →</span>
      </div>
    </Link>
  )
}
