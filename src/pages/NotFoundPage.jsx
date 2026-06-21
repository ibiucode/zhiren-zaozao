import Button from '../components/Button.jsx'
import { useSeo } from '../lib/useSeo.js'
import styles from './NotFoundPage.module.css'

export default function NotFoundPage() {
  useSeo({ title: '找不到頁面' })
  return (
    <section className={`section ${styles.wrap}`}>
      <div className="container">
        <span className={styles.code}>404</span>
        <h1 className={styles.title}>找不到這個頁面</h1>
        <p className={styles.desc}>你要找的頁面可能已移除或網址有誤。</p>
        <Button to="/" size="lg">回到首頁</Button>
      </div>
    </section>
  )
}
