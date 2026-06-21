import { Component } from 'react'

/**
 * 全站錯誤邊界：攔截 render 期間的未預期錯誤，顯示友善畫面而非白屏。
 * （資料載入的錯誤由各頁的 StateMessage 處理，這裡是最後一道防線。）
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // 正式環境可改為回報到監控服務。
    console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '2rem',
            gap: '0.75rem',
          }}
        >
          <h1 style={{ fontSize: '1.75rem' }}>頁面發生了一點問題</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>請重新整理，或稍後再試。</p>
          <a
            href="#/"
            onClick={() => window.location.reload()}
            style={{
              marginTop: '0.5rem',
              padding: '0.6rem 1.4rem',
              borderRadius: '999px',
              background: 'var(--color-accent)',
              color: 'var(--color-on-accent)',
              fontWeight: 700,
            }}
          >
            回到首頁
          </a>
        </div>
      )
    }
    return this.props.children
  }
}
