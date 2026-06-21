/**
 * 服務項目（placeholder）。對齊 SKILL.md 的 ServiceItem 資料模型：
 * id, name, description, icon, details, is_active(=isActive), sort_order(=sortOrder)
 * Phase 2 後改由 GET /api/services 提供。
 */
export const services = [
  {
    id: 'fdm-printing',
    name: '3D 列印服務',
    icon: '⬢',
    description: '提供 FDM 與光固化列印，從原型到成品，依用途選擇最合適的設備與材料。',
    details: [
      'FDM 大尺寸與功能性零件',
      'SLA / LCD 高細節模型',
      '多色與多材料選擇',
      '小批量複製',
    ],
    isActive: true,
    sortOrder: 1,
  },
  {
    id: 'model-repair',
    name: '模型修復／檔案檢查',
    icon: '⛯',
    description: '檢查模型破面、壁厚、尺寸與可印性，並協助修復，讓檔案真正可以印得出來。',
    details: [
      '破面 / 非封閉網格修復',
      '壁厚與最小特徵檢查',
      '尺寸與比例確認',
      '輸出格式最佳化（STL / OBJ / STEP）',
    ],
    isActive: true,
    sortOrder: 2,
  },
  {
    id: 'post-processing',
    name: '後處理服務',
    icon: '✦',
    description: '去支撐、研磨、補土、上色與拋光，讓列印件從半成品變成可交付的成品。',
    details: ['去支撐與修邊', '表面研磨與補土', '噴漆 / 手繪上色', '亮面拋光與保護塗層'],
    isActive: true,
    sortOrder: 3,
  },
  {
    id: 'custom-build',
    name: '客製化製作',
    icon: '◈',
    description: '從草圖或需求出發，協助建模與設計，量身打造專屬的模型與產品。',
    details: ['3D 建模與設計', '逆向工程', '功能性原型開發', '客製禮品 / 小物'],
    isActive: true,
    sortOrder: 4,
  },
  {
    id: 'materials-guide',
    name: '材料介紹',
    icon: '◆',
    description: '不確定要用什麼材料？我們提供各種耗材的特性說明，協助你做最合適的選擇。',
    details: ['常見耗材特性比較', '依用途推薦材料', '強度 / 耐溫 / 外觀建議'],
    isActive: true,
    sortOrder: 5,
    // 此項在服務頁作為「材料介紹入口」，導向材料區塊。
    linkTo: '/services#materials',
  },
]
