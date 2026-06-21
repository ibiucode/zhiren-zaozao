import { useState } from 'react'
import styles from './FaqItem.module.css'

/**
 * FAQ 折疊項（純 UI，自帶開合狀態）。
 * @param {{ item: FAQItem }} props
 */
export default function FaqItem({ item }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`${styles.item} ${open ? styles.itemOpen : ''}`}>
      <button
        className={styles.question}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span>{item.question}</span>
        <span className={styles.sign} aria-hidden="true">{open ? '−' : '+'}</span>
      </button>
      {open && <div className={styles.answer}>{item.answer}</div>}
    </div>
  )
}
