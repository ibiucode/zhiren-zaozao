import { statusColor, statusLabel } from '../config/inquiries.js'

/** 詢價狀態徽章（純 UI）。 */
export default function StatusBadge({ status }) {
  const color = statusColor(status)
  return (
    <span className="badge" style={{ color, borderColor: color }}>
      {statusLabel(status)}
    </span>
  )
}
