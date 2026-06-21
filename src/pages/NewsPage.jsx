import PageHeader from '../components/PageHeader.jsx'
import NewsCard from '../components/NewsCard.jsx'
import StateMessage from '../components/StateMessage.jsx'
import { useAsyncData } from '../lib/useAsyncData.js'
import { useSeo } from '../lib/useSeo.js'
import { getNews } from '../services/contentService.js'
import styles from './NewsPage.module.css'

export default function NewsPage() {
  useSeo({ title: '最新消息', description: '職人自造工作室的最新動態、優惠活動與材料／設備更新。' })
  const { data: news, loading, error } = useAsyncData(getNews, [])

  return (
    <>
      <PageHeader
        eyebrow="News"
        title="最新消息"
        description="工作室的最新動態、優惠活動與材料／設備更新。"
      />

      <section className="section">
        <div className="container">
          {loading && <StateMessage variant="loading" />}
          {error && <StateMessage variant="error" />}
          {news && news.length === 0 && (
            <StateMessage variant="empty">目前還沒有最新消息。</StateMessage>
          )}
          {news && news.length > 0 && (
            <div className={`grid ${styles.grid}`}>
              {news.map((post) => (
                <NewsCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
