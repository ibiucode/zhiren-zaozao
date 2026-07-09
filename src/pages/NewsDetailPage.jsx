import { Link, useParams } from 'react-router-dom'
import MediaImage from '../components/MediaImage.jsx'
import StateMessage from '../components/StateMessage.jsx'
import Button from '../components/Button.jsx'
import { useAsyncData } from '../lib/useAsyncData.js'
import { useSeo } from '../lib/useSeo.js'
import { getNewsById } from '../services/contentService.js'
import styles from './NewsDetailPage.module.css'

export default function NewsDetailPage() {
  const { id } = useParams()
  const { data: post, loading, error } = useAsyncData(() => getNewsById(id), [id])
  useSeo({ title: post?.title || '最新消息', description: post?.summary })

  if (loading) {
    return <div className="container section"><StateMessage variant="loading" /></div>
  }
  if (error || !post) {
    return (
      <div className={`container section ${styles.notFound}`}>
        <StateMessage variant="error">找不到這篇消息，可能已下架。</StateMessage>
        <Button to="/news" variant="outline">回最新消息</Button>
      </div>
    )
  }

  return (
    <article className="section">
      <div className={`container ${styles.wrap}`}>
        <Link to="/news" className={styles.back}>← 返回最新消息</Link>

        {post.coverImage && (
          <div className={styles.cover}>
            <MediaImage url={post.coverImage} alt={post.title} ratio="16/9" label="最新消息" icon="◆" />
          </div>
        )}

        <time className={styles.date}>{post.publishedAt}</time>
        <h1 className={styles.title}>{post.title}</h1>
        {post.summary && <p className={styles.summary}>{post.summary}</p>}
        <div className={styles.content}>{post.content}</div>

        <div className={styles.foot}>
          <Button to="/contact">有問題想詢問 → 聯絡我們</Button>
        </div>
      </div>
    </article>
  )
}
