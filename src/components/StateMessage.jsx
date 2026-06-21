import styles from './StateMessage.module.css'

/**
 * 共用的載入 / 錯誤 / 空狀態訊息（純 UI）。
 * variant: loading | error | empty
 */
export default function StateMessage({ variant = 'loading', children }) {
  const text =
    children ||
    (variant === 'loading' ? '載入中…' : variant === 'error' ? '載入失敗，請稍後再試。' : '目前沒有資料。')
  return <div className={`${styles.msg} ${styles[variant]}`}>{text}</div>
}
