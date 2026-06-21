import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import ServiceCard from '../components/ServiceCard.jsx'
import MaterialCard from '../components/MaterialCard.jsx'
import StateMessage from '../components/StateMessage.jsx'
import Button from '../components/Button.jsx'
import { useAsyncData } from '../lib/useAsyncData.js'
import { useSeo } from '../lib/useSeo.js'
import { getServices, getMaterials } from '../services/contentService.js'
import styles from './ServicesPage.module.css'

export default function ServicesPage() {
  useSeo({ title: '服務項目', description: '3D 列印、模型修復／檔案檢查、後處理與客製化製作，並提供材料介紹。' })
  const { data: services, loading: loadingServices, error: errorServices } =
    useAsyncData(getServices, [])
  const { data: materials, loading: loadingMaterials } = useAsyncData(getMaterials, [])
  const { hash } = useLocation()

  // 支援由「材料介紹入口」帶 #materials 進來時自動捲動到材料區。
  useEffect(() => {
    if (hash === '#materials') {
      document.getElementById('materials')?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [hash, materials])

  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="服務項目"
        description="從 3D 列印、模型修復、後處理到客製化製作，提供完整的一站式服務。"
      />

      <section className="section">
        <div className="container">
          {loadingServices && <StateMessage variant="loading" />}
          {errorServices && <StateMessage variant="error" />}
          {services && (
            <div className={`grid ${styles.grid}`}>
              {services.map((s) => (
                <ServiceCard key={s.id} service={s} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 材料介紹 */}
      <section id="materials" className="section section--alt">
        <div className="container">
          <SectionHeading
            eyebrow="Materials"
            title="材料介紹"
            subtitle="不同材料各有特性，我們協助你依用途選擇最合適的耗材。"
          />
          {loadingMaterials && <StateMessage variant="loading" />}
          {materials && (
            <div className={`grid ${styles.materialGrid}`}>
              {materials.map((m) => (
                <MaterialCard key={m.id} material={m} />
              ))}
            </div>
          )}
          <div className={styles.cta}>
            <p>不確定要用哪種材料？讓我們依你的需求給建議。</p>
            <Button to="/contact">諮詢材料建議</Button>
          </div>
        </div>
      </section>
    </>
  )
}
