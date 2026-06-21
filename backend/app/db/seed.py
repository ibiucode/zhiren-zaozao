"""Seed 資料：內容對齊前端 src/data 的 placeholder，讓 API 回傳與前端 mock 一致。

用法：
    cd backend
    python -m app.db.seed

會建立資料表（若不存在）並重置「內容類」資料表後重新插入（可重複執行）。
不會刪除 inquiries（保留已送出的詢價）。
"""
from datetime import date

from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.services.admin_service import ensure_default_admin
from app.models.content import (
    ContactSettings,
    FaqItem,
    Material,
    NewsPost,
    PortfolioCategory,
    PortfolioItem,
    Service,
    SiteSettings,
)

SERVICES = [
    dict(id="fdm-printing", name="3D 列印服務", icon="⬢",
         description="提供 FDM 與光固化列印，從原型到成品，依用途選擇最合適的設備與材料。",
         details=["FDM 大尺寸與功能性零件", "SLA / LCD 高細節模型", "多色與多材料選擇", "小批量複製"],
         is_active=True, sort_order=1, link_to=None),
    dict(id="model-repair", name="模型修復／檔案檢查", icon="⛯",
         description="檢查模型破面、壁厚、尺寸與可印性，並協助修復，讓檔案真正可以印得出來。",
         details=["破面 / 非封閉網格修復", "壁厚與最小特徵檢查", "尺寸與比例確認", "輸出格式最佳化（STL / OBJ / STEP）"],
         is_active=True, sort_order=2, link_to=None),
    dict(id="post-processing", name="後處理服務", icon="✦",
         description="去支撐、研磨、補土、上色與拋光，讓列印件從半成品變成可交付的成品。",
         details=["去支撐與修邊", "表面研磨與補土", "噴漆 / 手繪上色", "亮面拋光與保護塗層"],
         is_active=True, sort_order=3, link_to=None),
    dict(id="custom-build", name="客製化製作", icon="◈",
         description="從草圖或需求出發，協助建模與設計，量身打造專屬的模型與產品。",
         details=["3D 建模與設計", "逆向工程", "功能性原型開發", "客製禮品 / 小物"],
         is_active=True, sort_order=4, link_to=None),
    dict(id="materials-guide", name="材料介紹", icon="◆",
         description="不確定要用什麼材料？我們提供各種耗材的特性說明，協助你做最合適的選擇。",
         details=["常見耗材特性比較", "依用途推薦材料", "強度 / 耐溫 / 外觀建議"],
         is_active=True, sort_order=5, link_to="/services#materials"),
]

MATERIALS = [
    dict(id="pla", name="PLA", description="最易列印、表面細緻，適合外觀件、模型與一般展示用途。",
         color_options=["白", "黑", "灰", "紅", "橘", "透明"],
         properties={"strength": "中", "heatResistance": "低", "detail": "高"},
         image=None, is_active=True, sort_order=1),
    dict(id="petg", name="PETG", description="兼具強度與韌性、耐候性佳，適合功能件與戶外使用。",
         color_options=["黑", "白", "透明", "藍"],
         properties={"strength": "高", "heatResistance": "中", "detail": "中"},
         image=None, is_active=True, sort_order=2),
    dict(id="abs", name="ABS", description="耐溫耐衝擊，可後製拋光，常用於工業零件與外殼。",
         color_options=["黑", "白", "灰"],
         properties={"strength": "高", "heatResistance": "高", "detail": "中"},
         image=None, is_active=True, sort_order=3),
    dict(id="tpu", name="TPU 軟性", description="具彈性與耐磨性，適合護套、墊片與需要彎曲的零件。",
         color_options=["黑", "白", "紅"],
         properties={"strength": "中", "heatResistance": "中", "detail": "中"},
         image=None, is_active=True, sort_order=4),
    dict(id="resin", name="光固化樹脂", description="極高細節與光滑表面，適合公仔、珠寶與精密原型。",
         color_options=["灰", "白", "透明", "膚色"],
         properties={"strength": "中", "heatResistance": "中", "detail": "極高"},
         image=None, is_active=True, sort_order=5),
]

PORTFOLIO_CATEGORIES = [
    dict(id="all", label="全部", sort_order=0),
    dict(id="prototype", label="工業原型", sort_order=1),
    dict(id="figure", label="公仔模型", sort_order=2),
    dict(id="product", label="產品設計", sort_order=3),
    dict(id="custom", label="客製小物", sort_order=4),
]

PORTFOLIO_ITEMS = [
    dict(id="pf-001", title="工業夾具原型", category="prototype", material_id="petg",
         service_id="fdm-printing", description="為自動化產線開發的客製夾具，經多次迭代驗證後量產。",
         images=None, tags=["功能件", "PETG", "迭代開發"], is_featured=True, sort_order=1),
    dict(id="pf-002", title="角色公仔（光固化）", category="figure", material_id="resin",
         service_id="post-processing", description="高細節光固化列印，含手工上色與保護塗層的完整後處理。",
         images=None, tags=["樹脂", "上色", "高細節"], is_featured=True, sort_order=2),
    dict(id="pf-003", title="消費電子外殼", category="product", material_id="abs",
         service_id="custom-build", description="從 3D 建模到成品，協助新創團隊完成產品外觀打樣。",
         images=None, tags=["ABS", "外殼", "打樣"], is_featured=True, sort_order=3),
    dict(id="pf-004", title="客製鑰匙圈系列", category="custom", material_id="pla",
         service_id="fdm-printing", description="企業活動小物，雙色列印，小批量快速交付。",
         images=None, tags=["PLA", "雙色", "小批量"], is_featured=False, sort_order=4),
    dict(id="pf-005", title="機構連桿原型", category="prototype", material_id="abs",
         service_id="model-repair", description="客戶提供之模型先行修復破面，再列印驗證機構運作。",
         images=None, tags=["ABS", "機構", "修復"], is_featured=False, sort_order=5),
    dict(id="pf-006", title="桌面收納設計", category="product", material_id="pla",
         service_id="custom-build", description="模組化桌面收納，依使用者需求客製尺寸與配色。",
         images=None, tags=["PLA", "模組化", "設計"], is_featured=False, sort_order=6),
]

NEWS = [
    dict(id="news-001", title="職人自造工作室正式開幕", slug="studio-opening",
         summary="我們的新工作室正式對外開放，提供 FDM 與光固化列印的一站式服務。",
         content="經過數月籌備，職人自造工作室正式開幕。新空間導入多台工業級設備，從大尺寸 FDM 到高細節光固化一應俱全，歡迎預約參觀與洽談合作。",
         cover_image=None, is_published=True,
         published_at=date(2026, 6, 10), created_at=date(2026, 6, 8)),
    dict(id="news-002", title="新增工程級耗材：耐高溫 ABS", slug="new-abs-material",
         summary="針對需要耐溫與耐衝擊的應用，我們新增了工程級 ABS 耗材選項。",
         content="為了滿足工業客戶對耐用度的需求，我們新增了工程級 ABS 耗材，適合外殼、機構件與需要後製拋光的零件。歡迎來電詢問適用性。",
         cover_image=None, is_published=True,
         published_at=date(2026, 5, 28), created_at=date(2026, 5, 27)),
    dict(id="news-003", title="六月限定：學生專案優惠", slug="june-student-offer",
         summary="出示學生證，專題與課程作業列印享 8 折優惠，名額有限。",
         content="我們長期支持教育與創客。即日起至六月底，學生憑學生證進行專題或課程作業列印，可享 8 折優惠。歡迎透過詢價表單與我們聯繫。",
         cover_image=None, is_published=True,
         published_at=date(2026, 6, 1), created_at=date(2026, 5, 30)),
]

FAQ = [
    dict(id="faq-001", question="我沒有 3D 檔案，可以幫忙建模嗎？",
         answer="可以。我們提供 3D 建模與設計服務，你只需要提供草圖、照片或描述需求，我們會協助完成可列印的模型。",
         category="建模", sort_order=1, is_published=True),
    dict(id="faq-002", question="支援哪些檔案格式？",
         answer="常見的 STL、OBJ 與 STEP 都支援。若檔案有破面或尺寸問題，我們會在列印前協助檢查與修復。",
         category="檔案", sort_order=2, is_published=True),
    dict(id="faq-003", question="一般要多久可以拿到成品？",
         answer="視尺寸與數量而定，標準件通常 2–5 個工作天。急件可另行協調加速，會在報價時一併告知。",
         category="交期", sort_order=3, is_published=True),
    dict(id="faq-004", question="費用怎麼計算？",
         answer="報價會綜合材料用量、列印時間、後處理與數量等因素。目前估價由專人確認，未來將提供線上估價工具。",
         category="報價", sort_order=4, is_published=True),
    dict(id="faq-005", question="可以幫忙上色或後處理嗎？",
         answer="可以。我們提供去支撐、研磨、補土、噴漆、手繪與拋光等後處理服務，讓成品更接近你的期待。",
         category="後處理", sort_order=5, is_published=True),
    dict(id="faq-006", question="我的設計會被保密嗎？",
         answer="會。我們嚴格保護客戶的檔案與設計，不會用於其他用途或對外公開，必要時可簽署保密協議。",
         category="保密", sort_order=6, is_published=True),
]

SITE_SETTINGS = dict(
    id=1, site_name="職人自造", site_name_en="ZhiRen ZaoZao",
    tagline="把你的想法，列印成真。",
    description="職人自造是一間專業 3D 列印工作室，提供從建模、列印、修復到後處理的一站式服務。無論是工業原型、設計樣品或客製小物，我們都以工程級的精準與職人的手感為你完成。",
    footer_text="© 2026 職人自造 ZhiRen ZaoZao. 專業 3D 列印服務.",
    social=[
        {"id": "instagram", "label": "Instagram", "url": "#"},
        {"id": "facebook", "label": "Facebook", "url": "#"},
        {"id": "line", "label": "LINE", "url": "#"},
    ],
)

CONTACT_SETTINGS = dict(
    id=1, email="hello@zhiren-zaozao.example", phone="+886-2-1234-5678",
    line_id="@zhiren3d", address="台北市內湖區創客路 88 號 2 樓",
    business_hours="週一至週五 10:00 – 19:00（例假日預約制）",
)


def seed() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # 重置內容類資料表（可重複執行）；不動 inquiries。
        for model in (
            Service, Material, PortfolioItem, PortfolioCategory,
            NewsPost, FaqItem, SiteSettings, ContactSettings,
        ):
            db.query(model).delete()
        db.commit()

        db.add_all([Service(**s) for s in SERVICES])
        db.add_all([Material(**m) for m in MATERIALS])
        db.add_all([PortfolioCategory(**c) for c in PORTFOLIO_CATEGORIES])
        db.add_all([PortfolioItem(**p) for p in PORTFOLIO_ITEMS])
        db.add_all([NewsPost(**n) for n in NEWS])
        db.add_all([FaqItem(**f) for f in FAQ])
        db.add(SiteSettings(**SITE_SETTINGS))
        db.add(ContactSettings(**CONTACT_SETTINGS))
        db.commit()

        # 確保預設管理員存在（不重置既有管理員）。
        admin = ensure_default_admin(db)

        print("Seed 完成：")
        print(f"  services={len(SERVICES)} materials={len(MATERIALS)} "
              f"portfolio={len(PORTFOLIO_ITEMS)} categories={len(PORTFOLIO_CATEGORIES)}")
        print(f"  news={len(NEWS)} faq={len(FAQ)} site_settings=1 contact_settings=1")
        print(f"  admin_user='{admin.username}'（預設密碼見 .env / settings）")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
