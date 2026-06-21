---
name: 3d-printing-studio-website
description: 3D 列印工作室網站（品牌：職人自造）開發指南 — 規範 frontend / logic / backend(admin) 三層架構、資料模型、API contract、開發階段與品質檢查。後續 agent 接任務前必讀。
---

# 3D 列印工作室網站開發 Skill（職人自造）

> 本文件為「職人自造」3D 列印工作室網站的開發總綱。任何 agent 在接手本專案任務前，**必須先完整閱讀本文件**，並依照〈Agent Operating Procedure〉執行。

---

## 1. Project Overview（專案概觀）

### 網站用途
本網站為 3D 列印工作室「**職人自造**」的對外服務網站，目標讓使用者能夠：

- 瀏覽工作室提供的列印服務、材料與服務項目
- 瀏覽作品集（portfolio）
- 閱讀最新消息（news）與常見問題（FAQ）
- 透過聯絡／詢價表單與工作室聯繫，提交需求

長期則擴充為具備後台 CMS、詢價單管理、3D 檔案上傳與估價能力的完整平台。

### 三層架構
專案在概念上分為三層，**職責必須清楚分離，不可混雜**：

1. **frontend（前台對外網站）**
   - 負責：UI、頁面、表單、內容展示
   - 技術方向：**React + Vite**
   - 部署方向：**GitHub Pages**

2. **logic（商業邏輯層）**
   - 負責：詢價流程、材料規則、檔案檢查規則、估價前置判斷等商業規則
   - 原則：**不得直接寫在 React component 裡**
   - 初期可使用 placeholder / mock logic
   - 未來可接 STL / OBJ / STEP 檔案分析與 FastAPI 估價核心
   - 註：MVP 階段 logic 以前端模組形式存在（`src/logic`）；後端建立後，重邏輯會逐步下移到 backend 的 `app/services`，前端 logic 收斂為輸入驗證與展示前處理。

3. **backend(admin)（後端 API 與後台管理）**
   - 負責：資料庫、public API、admin API、登入驗證、CMS 管理
   - 技術方向：**FastAPI + PostgreSQL**
   - 部署方向：**Render**
   - 後台管理內容：詢價單、作品集、最新消息、FAQ、材料、服務項目、網站設定

### MVP 目標（短期）
- 建立前台網站，使用 placeholder content
- 清楚分離 UI、資料（data）、API client（services）、商業邏輯（logic）
- 提供聯絡／詢價表單介面
- **不**實作正式檔案上傳
- **不**實作正式自動估價

### 長期擴充方向
- 建立後台 CMS，管理詢價單與網站內容
- 支援 3D 檔案上傳
- 檢查檔案大小、格式、破面、尺寸
- 讓客戶確認模型尺寸
- 後台人工估價
- 未來再接自動估價核心

---

## 2. Architecture Rules（架構規範）

以下規則為**強制性**，後續開發必須遵守：

1. **frontend 只負責 UI**：頁面、版面（layout）、表單、展示。不放商業規則。
2. **logic 負責商業規則**：詢價規則、材料規則、檔案檢查規則、估價前置判斷一律放在 logic 層，**不得寫進 component**。
3. **backend(admin) 負責 API / 資料庫 / 驗證 / CMS**：所有持久化與權限相關行為都在後端。
4. **React component 不直接寫**詢價規則、估價規則、檔案驗證規則 — 這些都呼叫 logic 層。
5. **API client 必須集中管理**：所有對後端的呼叫集中在 `src/services`，component 不直接 `fetch` / `axios` 打 API。
6. **placeholder data 必須可被替換**：placeholder content（`src/data`）的資料結構，必須與未來 API response 的結構一致，讓未來能無痛換成真實 API。
7. **不要把大量文字內容硬編碼在 component 裡**：文案、清單、設定等內容放入 `src/data`（MVP）或由 API 提供（未來）。
8. **環境設定外部化**：API base URL、環境差異等使用環境變數（Vite 的 `import.meta.env`），不寫死在程式碼。
9. **單向相依方向**：`pages` → `components` / `logic` / `services` / `data`；`components` 保持純 UI，盡量只吃 props。logic 不得相依 React。

---

## 3. Recommended Folder Structure（建議資料夾結構）

> ⚠️ 目前 repo 為空（見〈Current Repo Notes〉），以下為**建議目標結構**，待實際建立 frontend / backend 時採用。

### Frontend（React + Vite）

```
frontend/                  # 或專案根目錄，視最終決定而定
├── public/
├── src/
│   ├── pages/             # route page（每個路由對應一頁）
│   ├── components/        # 純 UI component（盡量只吃 props）
│   ├── layouts/           # 共用版面（header / footer / page shell）
│   ├── data/              # 暫存 placeholder content（結構需對齊未來 API response）
│   ├── services/          # API client（集中管理所有後端呼叫）
│   ├── logic/             # 詢價、材料、檔案檢查、估價前置規則（不依賴 React）
│   ├── lib/               # 共用工具函式 / helpers
│   └── styles/            # 全域樣式 / theme
├── index.html
├── package.json
└── vite.config.*
```

各資料夾職責：
- **src/pages**：route page
- **src/components**：純 UI component
- **src/layouts**：可重用的頁面框架
- **src/data**：placeholder content（未來替換為 API response）
- **src/services**：API client（集中管理）
- **src/logic**：詢價、材料、檔案檢查、估價前置規則
- **src/lib**：通用工具
- **src/styles**：樣式 / theme

### Backend（FastAPI）

```
backend/                   # 或獨立 repo / 子目錄
├── app/
│   ├── api/               # public API 與 admin API routes
│   ├── models/            # database models（ORM）
│   ├── schemas/           # Pydantic schemas（request / response）
│   ├── services/          # 商業邏輯（詢價、估價、規則）
│   ├── db/                # database session / migration
│   ├── admin/             # 後台相關功能
│   ├── core/              # config / auth / security
│   └── main.py            # FastAPI app 進入點
├── requirements.txt 或 pyproject.toml
└── .env.example           # 範例環境變數（不含真實 secret）
```

各資料夾職責：
- **app/api**：public API 與 admin API routes
- **app/models**：database models
- **app/schemas**：Pydantic schemas
- **app/services**：商業邏輯
- **app/db**：database session / migration
- **app/admin**：後台相關功能
- **app/core**：config / auth / security

---

## 4. Data Model Draft（資料模型草案）

> 以下為資料概念規劃，**不需要真的建表**，僅列主要欄位作為設計依據。實際欄位於 Phase 2 建立 models 時再定案。

- **AdminUser**：`id`, `username`, `email`, `password_hash`, `role`, `is_active`, `created_at`
- **Inquiry（詢價單）**：`id`, `name`, `email`, `phone`, `message`, `service_id`, `material_id`, `status`（new/in_review/quoted/closed）, `admin_note`, `created_at`, `updated_at`
- **InquiryFile（詢價附件）**：`id`, `inquiry_id`, `filename`, `file_path`, `file_size`, `file_format`（STL/OBJ/STEP）, `check_status`, `check_result`, `created_at`
- **NewsPost（最新消息）**：`id`, `title`, `slug`, `summary`, `content`, `cover_image`, `is_published`, `published_at`, `created_at`
- **PortfolioItem（作品集）**：`id`, `title`, `description`, `images`, `material_id`, `service_id`, `tags`, `is_featured`, `sort_order`, `created_at`
- **FAQItem（常見問題）**：`id`, `question`, `answer`, `category`, `sort_order`, `is_published`
- **Material（材料）**：`id`, `name`, `description`, `color_options`, `properties`, `image`, `is_active`, `sort_order`
- **ServiceItem（服務項目）**：`id`, `name`, `description`, `icon`, `details`, `is_active`, `sort_order`
- **SiteSettings（網站設定）**：`id`, `site_name`, `logo`, `tagline`, `footer_text`, `social_links`, `theme`
- **ContactSettings（聯絡設定）**：`id`, `email`, `phone`, `address`, `business_hours`, `map_embed`, `line_id`
- **SEOSettings（SEO 設定）**：`id`, `default_title`, `default_description`, `keywords`, `og_image`, `analytics_id`
- **PriceSettings（估價設定）**：`id`, `base_fee`, `price_per_gram`, `price_per_hour`, `material_multipliers`, `min_order_amount`, `currency`

---

## 5. API Contract Draft（API 介面草案）

> 以下為 API 規劃，**不需要實作**。response 結構應與 frontend `src/data` 的 placeholder 結構對齊。

### Public API
- `GET /api/site-settings`
- `GET /api/news`
- `GET /api/news/{id}`
- `GET /api/portfolio`
- `GET /api/faq`
- `GET /api/materials`
- `GET /api/services`
- `POST /api/inquiries`

### Future Public API（未來）
- `POST /api/quote/check-file` — 上傳檔案檢查（大小／格式／破面／尺寸）
- `POST /api/quote/estimate` — 估價

### Admin API
- `POST /api/admin/login`
- `GET /api/admin/inquiries`
- `GET /api/admin/inquiries/{id}`
- `PATCH /api/admin/inquiries/{id}`（更新狀態 / 備註）
- `CRUD /api/admin/news`
- `CRUD /api/admin/portfolio`
- `CRUD /api/admin/faq`
- `CRUD /api/admin/materials`
- `CRUD /api/admin/services`
- `PATCH /api/admin/site-settings`
- `PATCH /api/admin/contact-settings`
- `PATCH /api/admin/seo-settings`
- `PATCH /api/admin/price-settings`

> 註：`CRUD /api/admin/<resource>` 代表該資源的完整增刪改查（`GET` 列表 / `GET {id}` / `POST` / `PATCH {id}` / `DELETE {id}`）。

---

## 6. Implementation Phases（開發階段）

> 後續 agent 必須先判斷目前處於哪個 phase（見〈Agent Operating Procedure〉），再進行對應工作。

### Phase 1：Frontend MVP
- 首頁
- 服務頁
- 作品頁
- 最新消息頁
- FAQ
- 關於我們
- 聯絡／詢價頁
- RWD（響應式）
- placeholder content

### Phase 2：Backend Foundation
- FastAPI 專案骨架
- PostgreSQL 連線
- public API
- 基本資料模型
- seed data

### Phase 3：Admin CMS
- admin login
- 管理 news
- 管理 portfolio
- 管理 FAQ
- 管理 services
- 管理 materials
- 管理 site settings

### Phase 4：Inquiry System
- 前台送出詢價
- 後台查看詢價
- 詢價狀態管理
- 後台備註
- 客戶聯絡資訊管理

### Phase 5：3D File / Quote Logic
- 檔案上傳
- STL / OBJ / STEP 檢查
- 檔案大小限制
- 模型尺寸檢查
- 破面或錯誤提醒
- 客戶確認尺寸
- 人工估價
- 未來接自動估價核心

### Phase 6：Production Polish
- SEO
- sitemap
- performance
- error handling
- deployment docs
- admin permission hardening

---

## 7. Agent Operating Procedure（Agent 作業流程）

後續 agent 每次接任務時，**必須**依序執行：

1. **先閱讀本 SKILL.md**
2. **檢查目前 repo 結構**（實際看檔案，不靠記憶）
3. **判斷目前屬於哪個 phase**
4. **只修改與任務直接相關的檔案**
5. **不做未被要求的大型重構**
6. **不破壞現有可運行版本**
7. **不確定時，在回報中明確標記 assumption**
8. **完成後依以下格式回報**：
   - changed files（變更檔案清單）
   - what changed（做了什麼）
   - how to test（如何測試）
   - risks（風險）
   - suggested next step（建議下一步）

---

## 8. Quality Gates（品質檢查）

每次修改後應檢查：

### Frontend
- `npm install` 是否成功
- `npm run dev` 是否能啟動
- `npm run build` 是否成功
- 主要頁面是否能開啟
- mobile responsive 是否正常

### Backend
- server 是否能啟動
- database connection 是否正常
- API smoke test 是否通過
- auth route 是否正常
- admin route 是否正常

### General
- 不留下明顯 dead code
- 不硬編碼敏感資料
- 不提交 `.env`（應有 `.gitignore` 與 `.env.example`）
- 不把 secret 寫入前端
- 不讓 placeholder data 阻礙未來接 API（結構需對齊 API contract）

---

## 9. Current Repo Notes（目前 Repo 現況）

**更新時間**：2026-06-21（Phase 1–6 已完成）

### 階段進度
- ✅ Phase 1 Frontend MVP　✅ Phase 2 Backend Foundation　✅ Phase 3 Admin CMS
- ✅ Phase 4 Inquiry System　✅ Phase 5 3D File / Quote　✅ Phase 6 Production Polish
- 前後端已端到端整合並驗證。

### 實際結構（三個可部署單元）
```
/                    前台（React + Vite，HashRouter，base './'）
├── src/{pages,components,layouts,data,services,logic,lib,styles}
├── public/{robots.txt,sitemap.xml}
├── index.html       含 SEO / OG / JSON-LD
├── admin/           後台 Admin CMS（獨立 Vite app，port 5174）
│   └── src/{pages,components,auth,services,config,lib}
├── backend/         FastAPI + SQLAlchemy
│   └── app/{api,core,db,models,schemas,services,admin}
├── .github/workflows/deploy-pages.yml
├── DEPLOYMENT.md
└── skills/3d-printing-studio-website/SKILL.md
```

### 與目標架構的差異 / 取捨（已知）
- **網格分析用標準庫**（不裝 trimesh/numpy）：STL/OBJ 可算尺寸/面數/破面；STEP 僅格式檢查。
- **建表用 `create_all`**（非 Alembic）：schema 變動時本機需 `rm dev.db && python -m app.db.seed`。
- **上傳檔存本機磁碟**（`backend/uploads/`）：正式環境應改物件儲存。
- **自動估價 `/api/quote/estimate`** 尚未實作（人工估價已可用）。

> 本 repo 已形成完整三層架構（frontend / logic / backend(admin)），可運行並可部署。

---

## 10. First Recommended Next Step（下一步建議）

六階段 MVP 已完成。後續可考慮：

1. 正式部署（依 [DEPLOYMENT.md](../../DEPLOYMENT.md)）：Render 後端 + GitHub Pages 前台/後台，設定 secrets 與 CORS。
2. 上傳檔案改接物件儲存（S3 / GCS），下載改簽名 URL。
3. 導入 Alembic migration 取代 `create_all`。
4. 接自動估價核心（`/api/quote/estimate` + PriceSettings）與 STEP / 壁厚分析。
5. 觀測性與通知：詢價 email 通知、錯誤監控、基本分析。
