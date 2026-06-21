import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

// 全站樣式：先載入設計 token，再載入全域基礎樣式。
import './styles/tokens.css'
import './styles/global.css'

// 使用 HashRouter：GitHub Pages 為靜態託管，HashRouter 可避免重新整理時的 404。
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </HashRouter>
  </React.StrictMode>,
)
