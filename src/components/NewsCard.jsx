import ImagePlaceholder from './ImagePlaceholder.jsx'
import styles from './NewsCard.module.css'

/**
 * 最新消息卡片（純 UI）。
 * @param {{ post: NewsPost }} props
 */
export default function NewsCard({ post }) {
  return (
    <article className={styles.card}>
      <div className={styles.media}>
        <ImagePlaceholder label="最新消息" ratio="16/9" icon="◆" />
      </div>
      <div className={styles.body}>
        <time className={styles.date}>{post.publishedAt}</time>
        <h3 className={styles.title}>{post.title}</h3>
        <p className={styles.summary}>{post.summary}</p>
      </div>
    </article>
  )
}
