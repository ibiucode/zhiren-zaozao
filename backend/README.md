# 職人自造 backend — Phase 2 Backend Foundation

FastAPI + SQLAlchemy + (PostgreSQL / SQLite) 的後端骨架，提供前台所需的 public API。
開發規範見 [../skills/3d-printing-studio-website/SKILL.md](../skills/3d-printing-studio-website/SKILL.md)。

## 本次（Phase 2）範圍

- ✅ FastAPI 專案骨架、CORS、`/docs`（Swagger）
- ✅ 資料庫連線（PostgreSQL 為主，SQLite 為本機 fallback）
- ✅ 基本資料模型（services / materials / portfolio / news / faq / site & contact settings / inquiries）
- ✅ Public GET API + `POST /api/inquiries`
- ✅ seed data（內容對齊前端 `src/data`，回應為 camelCase）
- ⛔ 不含 admin / login / 權限（Phase 3）、詢價狀態管理（Phase 4）、檔案上傳與估價（Phase 5）

## 快速開始

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# （可選）設定環境變數；不設定則預設用 SQLite dev.db
cp .env.example .env

# 建表 + 灌入 seed 資料
python -m app.db.seed

# 啟動開發伺服器
uvicorn app.main:app --reload --port 8000
```

啟動後：
- API 文件（Swagger UI）：http://localhost:8000/docs
- 健康檢查：http://localhost:8000/api/health

## 資料庫

- 預設 `DATABASE_URL = sqlite:///./dev.db`（免安裝，立即可跑）。
- 正式環境 / Render：於 `.env` 設定 `postgresql+psycopg2://...`。
- 建表方式：啟動時 `Base.metadata.create_all()`（Phase 2 foundation）。需要版本化 schema 時再導入 Alembic。

## API 端點（Public）

| Method | Path | 說明 |
|---|---|---|
| GET | `/api/site-settings` | 網站設定 + 聯絡資訊 |
| GET | `/api/services` | 服務項目 |
| GET | `/api/materials` | 材料 |
| GET | `/api/portfolio` | 作品集（items + categories） |
| GET | `/api/news` | 最新消息列表 |
| GET | `/api/news/{id}` | 單篇最新消息 |
| GET | `/api/faq` | 常見問題 |
| POST | `/api/inquiries` | 送出詢價單 |
| GET | `/api/health` | 健康檢查 |

## 與前端串接（下一步，非本次範圍）

回應已採 camelCase，結構對齊前端 `src/data`。未來要讓前端改打此 API：
在前端 `.env` 設定 `VITE_API_BASE_URL=http://localhost:8000` 並 `VITE_USE_MOCK=false`。
（前端 `submitInquiry` 目前檢查 `result.ok`，串接時需改為依 201 + 回傳的 inquiry 物件判斷。）
