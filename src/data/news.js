/**
 * 最新消息（placeholder）。對齊 SKILL.md 的 NewsPost 資料模型：
 * id, title, slug, summary, content, cover_image(=coverImage),
 * is_published(=isPublished), published_at(=publishedAt), created_at(=createdAt)
 * Phase 2 後改由 GET /api/news 與 GET /api/news/{id} 提供。
 */
export const newsPosts = [
  {
    id: 'news-001',
    title: '職人自造工作室正式開幕',
    slug: 'studio-opening',
    summary: '我們的新工作室正式對外開放，提供 FDM 與光固化列印的一站式服務。',
    content:
      '經過數月籌備，職人自造工作室正式開幕。新空間導入多台工業級設備，從大尺寸 FDM 到高細節光固化一應俱全，歡迎預約參觀與洽談合作。',
    coverImage: null,
    isPublished: true,
    publishedAt: '2026-06-10',
    createdAt: '2026-06-08',
  },
  {
    id: 'news-002',
    title: '新增工程級耗材：耐高溫 ABS',
    slug: 'new-abs-material',
    summary: '針對需要耐溫與耐衝擊的應用，我們新增了工程級 ABS 耗材選項。',
    content:
      '為了滿足工業客戶對耐用度的需求，我們新增了工程級 ABS 耗材，適合外殼、機構件與需要後製拋光的零件。歡迎來電詢問適用性。',
    coverImage: null,
    isPublished: true,
    publishedAt: '2026-05-28',
    createdAt: '2026-05-27',
  },
  {
    id: 'news-003',
    title: '六月限定：學生專案優惠',
    slug: 'june-student-offer',
    summary: '出示學生證，專題與課程作業列印享 8 折優惠，名額有限。',
    content:
      '我們長期支持教育與創客。即日起至六月底，學生憑學生證進行專題或課程作業列印，可享 8 折優惠。歡迎透過詢價表單與我們聯繫。',
    coverImage: null,
    isPublished: true,
    publishedAt: '2026-06-01',
    createdAt: '2026-05-30',
  },
]
