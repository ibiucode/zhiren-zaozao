# 部署指南（職人自造 3D 列印網站）

三個可部署單元：

| 單元 | 目錄 | 技術 | 建議平台 |
|---|---|---|---|
| 前台（對外網站） | `/`（root） | React + Vite（HashRouter） | GitHub Pages |
| 後台（Admin CMS） | `admin/` | React + Vite（HashRouter） | GitHub Pages（子路徑 `/admin/`）或 Netlify/Vercel |
| 後端 API | `backend/` | FastAPI + PostgreSQL | Render |

部署順序建議：**先後端**（取得 API 網址）→ 再前台 / 後台（填入該網址）。

---

## 1. 後端（Render + PostgreSQL）

已附 [render.yaml](render.yaml) Blueprint（位於 repo 根，服務程式碼在 `backend/`）。

1. Render → New → **Blueprint** → 指向此 repo。會建立一個 Web Service + 一個 PostgreSQL。
2. 在 Service 的 **Environment** 補上（render.yaml 標為 `sync:false` 的）：
   - `ADMIN_PASSWORD`：管理員密碼（**務必設定強密碼**）。
   - `CORS_ORIGINS`：前台與後台的網址，逗號分隔，例如
     `https://<user>.github.io`（GitHub Pages 網域）。
   - `JWT_SECRET` 由 Render 自動產生（`generateValue: true`），不需手動填。
3. `ENVIRONMENT=production` 已設；若仍使用預設密鑰/密碼，**後端會拒絕啟動**（見〈安全強化〉）。
4. 啟動指令：`uvicorn app.main:app --host 0.0.0.0 --port $PORT`（已在 blueprint）。
   啟動時自動 `create_all` 建表並建立預設管理員。
5. 首次若要灌入示範內容，可在 Render Shell 執行：`python -m app.db.seed`。

> `DATABASE_URL`：Render 提供 `postgres://...`，後端會自動正規化為 `postgresql+psycopg2://...`。

### 手動部署（非 Blueprint）
- Build：`pip install -r requirements.txt`
- Start：`uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- 環境變數見 [backend/.env.example](backend/.env.example)。

---

## 2. 前台 + 後台（GitHub Pages，CI 自動部署）

已附 [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml)：push 到 `main` 時，
把前台 build 到 `dist/`、後台 build 到 `dist/admin/`，一起發佈到 Pages。

設定步驟：
1. Repo → **Settings → Pages → Source** 選 **GitHub Actions**。
2. Repo → **Settings → Secrets and variables → Actions → Variables** 新增
   `VITE_API_BASE_URL` = 你的後端網址（例如 `https://zhiren-zaozao-api.onrender.com`）。
   - 未設定時，前台會 fallback 到 `src/data` 的 mock 資料（仍可瀏覽，但無即時後端 / 無法送出詢價）。
3. push 到 `main`（或手動觸發 workflow）。完成後：
   - 前台：`https://<user>.github.io/<repo>/`
   - 後台：`https://<user>.github.io/<repo>/admin/`（用 `ADMIN_USERNAME` / `ADMIN_PASSWORD` 登入）

> 已使用 **HashRouter** + `base: './'`，故 Pages 子路徑與重新整理都不會 404，不需 404.html 技巧。

### 本機手動 build
```bash
# 前台
VITE_API_BASE_URL=https://你的後端 VITE_USE_MOCK=false npm run build   # 產物在 dist/
# 後台
cd admin && VITE_API_BASE_URL=https://你的後端 npm run build           # 產物在 admin/dist/
```

---

## 3. 環境變數總覽

### 後端（backend/.env）
| 變數 | 說明 |
|---|---|
| `ENVIRONMENT` | `development` / `production`。production 會強制覆蓋預設密鑰。 |
| `DATABASE_URL` | PostgreSQL 連線字串（未設則用本機 SQLite）。 |
| `JWT_SECRET` | JWT 簽章密鑰（正式環境必設隨機值，例如 `openssl rand -hex 32`）。 |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | 預設管理員帳密。 |
| `CORS_ORIGINS` | 允許的前端來源（逗號分隔）。 |
| `MAX_UPLOAD_MB` / `ALLOWED_FILE_FORMATS` / `MAX_PRINT_DIMENSION_MM` | 檔案上傳設定。 |

### 前端（前台 / 後台，build 時注入）
| 變數 | 說明 |
|---|---|
| `VITE_API_BASE_URL` | 後端 API 網址。 |
| `VITE_USE_MOCK` | 前台是否用 mock 資料（未設 API 時自動為 true）。 |

---

## 4. 安全強化（Production Hardening）

- **正式環境必改**：`JWT_SECRET`、`ADMIN_PASSWORD`。`ENVIRONMENT=production` 時若仍是預設值，
  後端啟動會丟出 `RuntimeError` 直接擋下（見 `app/main.py` 的 `_check_security`）。
- 後端已加基本安全標頭：`X-Content-Type-Options`、`X-Frame-Options`、`Referrer-Policy`。
- 未預期錯誤統一回傳乾淨 JSON（不洩漏堆疊）。
- `CORS_ORIGINS` 僅放實際前端網域，勿用 `*`。
- `.env`、`dev.db`、`uploads/` 皆已 gitignore，勿提交。

## 5. 已知限制 / 後續

- **上傳檔案**：目前存本機磁碟（`backend/uploads/`）；Render 容器檔案系統為短暫性，
  正式環境請改接物件儲存（S3 / GCS）並改用簽名 URL 下載。
- **資料表建立**用 `create_all`；schema 有變動時，正式環境建議導入 Alembic migration。
- **token 存 localStorage**：後台 MVP 做法，之後可評估改 httpOnly cookie。
- **自動估價 / STEP 網格分析 / 壁厚分析**：尚未實作（未來工作）。
