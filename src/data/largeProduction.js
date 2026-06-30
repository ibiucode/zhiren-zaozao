/**
 * 大型製作頁內容 + 首頁「大型製作關鍵流程」區塊（前端靜態內容；非 CMS）。
 * imageUrl 預留：未來填圖片 URL 即可替換 placeholder。
 */

// 大型製作服務項目（大型製作頁）
export const largeServices = [
  { id: 'body-print', title: '本體列印', desc: '大型本體與結構件的列印製作，依設備尺寸規劃分件與排版。', imageUrl: null },
  { id: 'split', title: '模型拆件', desc: '依接縫、強度與組裝順序拆件，兼顧外觀與製作可行性。', imageUrl: null },
  { id: 'base', title: '底座訂製', desc: '依展示與重心需求設計底座與支撐，穩固承載大型件。', imageUrl: null },
  { id: 'assembly', title: '組裝測試', desc: '列印後試組與配合確認，提早發現公差與接合問題。', imageUrl: null },
  { id: 'cleanup', title: '毛胚整理', desc: '去支撐、接縫修整與表面整平，建立後處理基礎。', imageUrl: null },
  { id: 'paint', title: '烤漆上色', desc: '底漆、噴塗與局部上色，依展示用途調整表面質感。', imageUrl: null },
  { id: 'advice', title: '材料與工法建議', desc: '依用途、強度與預算建議合適的材料與製程組合。', imageUrl: null },
  { id: 'integration', title: '展示整合', desc: '結合底座、結構與表面處理，交付可直接展示的成品。', imageUrl: null },
]

// 大型製作關鍵流程（大型製作頁）
export const largeProcess = [
  { step: '01', title: '需求確認', desc: '了解用途、數量、時程與展示情境。' },
  { step: '02', title: '尺寸與用途評估', desc: '評估成品尺寸、結構與承載需求。' },
  { step: '03', title: '拆件與工法規劃', desc: '規劃分件、接縫、強度與製程順序。' },
  { step: '04', title: '本體列印', desc: '依設備尺寸排版並進行本體列印。' },
  { step: '05', title: '試組與毛胚整理', desc: '試組確認配合，整理接縫與表面。' },
  { step: '06', title: '底座與展示結構', desc: '製作底座、支撐與展示結構。' },
  { step: '07', title: '表面處理與上色', desc: '依展示需求進行表面處理與烤漆上色。' },
  { step: '08', title: '交付與後續調整', desc: '交付成品並協助後續微調與維護。' },
]

// 適合的案件類型（大型製作頁）
export const caseTypes = [
  '商業展示模型',
  '活動道具',
  '展覽展示件',
  '大型公仔 / 造型物',
  '工程原型',
  '設計驗證模型',
  '小量客製零件',
  '教學 / 展示用模型',
]

// 首頁「大型製作的關鍵流程／特點」區塊（取代原「為什麼選擇」）
export const homeHighlights = [
  { id: 'local', title: '台灣本地製作', desc: '在地溝通、調整與交付，縮短來回時間。' },
  { id: 'splitting', title: '大型件拆件規劃', desc: '依尺寸與結構分件，兼顧強度與組裝。' },
  { id: 'structure', title: '本體列印與結構處理', desc: '處理大型本體列印與內部支撐結構。' },
  { id: 'base', title: '底座訂製', desc: '依展示需求設計底座與承載結構。' },
  { id: 'surface', title: '表面處理與烤漆上色', desc: '從毛胚整理到上色，貼近展示用途。' },
  { id: 'material', title: '材料與工法建議', desc: '依用途與預算建議合適的材料與製程。' },
]
