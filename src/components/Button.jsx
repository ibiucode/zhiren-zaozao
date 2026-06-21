import { Link } from 'react-router-dom'
import styles from './Button.module.css'

/**
 * 共用按鈕。可渲染為：
 *  - 內部路由連結（傳 to）
 *  - 外部連結（傳 href）
 *  - 一般按鈕（傳 onClick / type）
 * variant: primary | outline | ghost；size: md | lg
 */
export default function Button({
  children,
  to,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  ...rest
}) {
  const cls = `${styles.btn} ${styles[variant]} ${styles[size]} ${className}`.trim()

  if (to) {
    return (
      <Link to={to} className={cls} {...rest}>
        {children}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={cls} {...rest}>
        {children}
      </a>
    )
  }
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  )
}
