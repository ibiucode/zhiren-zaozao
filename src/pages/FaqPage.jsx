import PageHeader from '../components/PageHeader.jsx'
import FaqItem from '../components/FaqItem.jsx'
import StateMessage from '../components/StateMessage.jsx'
import Button from '../components/Button.jsx'
import { useAsyncData } from '../lib/useAsyncData.js'
import { useSeo } from '../lib/useSeo.js'
import { getFaq } from '../services/contentService.js'
import styles from './FaqPage.module.css'

export default function FaqPage() {
  useSeo({ title: '常見問題', description: '關於 3D 列印檔案、材料、交期與報價的常見問題整理。' })
  const { data: faq, loading, error } = useAsyncData(getFaq, [])

  return (
    <>
      <PageHeader
        eyebrow="FAQ"
        title="常見問題"
        description="關於檔案、材料、交期與報價，這裡整理了大家最常問的問題。"
      />

      <section className="section">
        <div className={`container ${styles.wrap}`}>
          {loading && <StateMessage variant="loading" />}
          {error && <StateMessage variant="error" />}
          {faq && faq.map((item) => <FaqItem key={item.id} item={item} />)}

          <div className={styles.more}>
            <p>找不到你的問題？直接問我們吧。</p>
            <Button to="/contact" variant="outline">聯絡我們</Button>
          </div>
        </div>
      </section>
    </>
  )
}
