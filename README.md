# 職人自造 ZhiRen ZaoZao — 3D 列印工作室網站

Phase 1 Frontend MVP（React + Vite）。對外前台網站，使用 placeholder 內容，
清楚分離 UI（pages/components/layouts）、資料（data）、API client（services）、商業邏輯（logic）。

> 開發規範請見 [skills/3d-printing-studio-website/SKILL.md](skills/3d-printing-studio-website/SKILL.md)。

## 開發指令

```bash
npm install     # 安裝相依套件
npm run dev     # 啟動本機開發伺服器（預設 http://localhost:5173）
npm run build   # 產生正式版（輸出至 dist/）
npm run preview # 預覽 build 結果
```

## 目錄結構（前端）

```
src/
├── pages/        # 路由頁面（Home / Services / Gallery / News / FAQ / About / Contact）
├── components/   # 可重用的純 UI 元件
├── layouts/      # MainLayout / Navbar / Footer
├── data/         # placeholder 內容（結構對齊未來 API response）
├── services/     # API client（集中管理，Phase 1 回傳 mock 資料）
├── logic/        # 詢價 / 材料 / 檔案檢查的邏輯骨架（不依賴 React）
├── lib/          # 共用工具（useAsyncData hook）
└── styles/       # 設計 token 與全域樣式
```

## 環境變數

複製 `.env.example` 為 `.env` 後填值。Phase 1 留空即可（自動使用 `src/data` 的 mock）。

- `VITE_API_BASE_URL`：後端 FastAPI 的 base URL（Phase 2 才需要）
- `VITE_USE_MOCK`：是否使用前端 mock 資料

## 目前範圍與限制（Phase 1）

- ✅ 前台 7 個頁面、RWD、placeholder 內容、詢價表單 UI
- ⛔ 不含 backend / admin / 資料庫 / 登入 / 檔案上傳 / 自動估價 / 付款
- 詢價表單目前僅 `console.log`（mock），尚未實際送至後端
- 部署方向：GitHub Pages（已使用 HashRouter + 相對 base 以利靜態託管）
