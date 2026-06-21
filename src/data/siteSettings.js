/**
 * 網站設定 + 聯絡資訊 + 工作室特色 + 關於我們內容（placeholder）。
 * 結構對齊 SKILL.md 的 SiteSettings / ContactSettings 資料模型。
 * Phase 2 後改由 GET /api/site-settings 提供，欄位維持一致即可無痛替換。
 */
export const siteSettings = {
  siteName: '職人自造',
  siteNameEn: 'ZhiRen ZaoZao',
  tagline: '把你的想法，列印成真。',
  description:
    '職人自造是一間專業 3D 列印工作室，提供從建模、列印、修復到後處理的一站式服務。無論是工業原型、設計樣品或客製小物，我們都以工程級的精準與職人的手感為你完成。',
  footerText: '© 2026 職人自造 ZhiRen ZaoZao. 專業 3D 列印服務.',
  social: [
    { id: 'instagram', label: 'Instagram', url: '#' },
    { id: 'facebook', label: 'Facebook', url: '#' },
    { id: 'line', label: 'LINE', url: '#' },
  ],
}

/** 對齊 ContactSettings 資料模型。 */
export const contactSettings = {
  email: 'hello@zhiren-zaozao.example',
  phone: '+886-2-1234-5678',
  lineId: '@zhiren3d',
  address: '台北市內湖區創客路 88 號 2 樓',
  businessHours: '週一至週五 10:00 – 19:00（例假日預約制）',
}

/** 工作室特色（首頁與關於頁共用）。 */
export const studioFeatures = [
  {
    id: 'precision',
    icon: '◎',
    title: '工程級精度',
    description: '層厚最細可達 0.05mm，公差控制穩定，適合功能性原型與精密件。',
  },
  {
    id: 'materials',
    icon: '◆',
    title: '多元材料',
    description: 'PLA、PETG、ABS、TPU、樹脂與工程級耗材，依用途為你選對材料。',
  },
  {
    id: 'speed',
    icon: '⚡',
    title: '快速交付',
    description: '標準件最快 24 小時出件，急件可協調加速，量產也能排程。',
  },
  {
    id: 'craft',
    icon: '✦',
    title: '職人後處理',
    description: '研磨、補土、上色、拋光一應俱全，交付不只是列印件，而是成品。',
  },
]

/** 關於頁內容（對齊「製作流程 / 專業能力 / 品質承諾」需求）。 */
export const aboutContent = {
  intro:
    '我們相信，好的製造是技術與手感的結合。職人自造由一群熱愛動手做的工程師與設計師組成，從一台桌上型印表機開始，到今天能承接工業原型與小批量生產，我們始終堅持把每一件作品當成自己的作品。',
  process: [
    { id: 'p1', step: '01', title: '需求溝通', description: '了解用途、尺寸、材料與預算，給出最合適的建議。' },
    { id: 'p2', step: '02', title: '檔案檢查', description: '檢視模型的破面、壁厚與可印性，必要時協助修復。' },
    { id: 'p3', step: '03', title: '列印製作', description: '依需求選擇設備與參數，全程品管監控。' },
    { id: 'p4', step: '04', title: '後處理', description: '去支撐、研磨、上色等加工，讓成品符合期待。' },
    { id: 'p5', step: '05', title: '交付驗收', description: '出貨前檢驗，並提供保養與後續服務建議。' },
  ],
  capabilities: [
    'FDM 熔絲沉積列印（大尺寸、功能件）',
    'SLA / LCD 光固化列印（高細節模型）',
    '3D 建模與逆向工程',
    '模型修復與檔案最佳化',
    '客製化設計與小批量生產',
  ],
  promises: [
    { id: 'q1', title: '品質保證', description: '每件出貨皆經人工檢驗，不符規格免費重印。' },
    { id: 'q2', title: '透明報價', description: '事前確認費用，不做不透明的隱藏收費。' },
    { id: 'q3', title: '檔案保密', description: '你的設計就是你的資產，我們嚴格保密。' },
  ],
}
