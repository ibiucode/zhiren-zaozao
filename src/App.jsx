import { lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout.jsx'

// 路由層級的 code-splitting：各頁 lazy 載入，縮小首屏 bundle。
// 載入中的 fallback 由 MainLayout 內的 Suspense 提供（保留 navbar/footer）。
const HomePage = lazy(() => import('./pages/HomePage.jsx'))
const LargeProductionPage = lazy(() => import('./pages/LargeProductionPage.jsx'))
const ServicesPage = lazy(() => import('./pages/ServicesPage.jsx'))
const GalleryPage = lazy(() => import('./pages/GalleryPage.jsx'))
const PortfolioDetailPage = lazy(() => import('./pages/PortfolioDetailPage.jsx'))
const NewsPage = lazy(() => import('./pages/NewsPage.jsx'))
const NewsDetailPage = lazy(() => import('./pages/NewsDetailPage.jsx'))
const FaqPage = lazy(() => import('./pages/FaqPage.jsx'))
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'))
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'))

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="large-production" element={<LargeProductionPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="gallery/:id" element={<PortfolioDetailPage />} />
        <Route path="news" element={<NewsPage />} />
        <Route path="news/:id" element={<NewsDetailPage />} />
        <Route path="faq" element={<FaqPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
