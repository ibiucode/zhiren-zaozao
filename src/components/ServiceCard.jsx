import styles from './ServiceCard.module.css'

/**
 * 服務卡片（純 UI，只吃 props）。
 * @param {{ service: { name, icon, description, details? } }} props
 */
export default function ServiceCard({ service, compact = false }) {
  return (
    <article className={`${styles.card} ${compact ? styles.compact : ''}`}>
      <span className={styles.icon} aria-hidden="true">{service.icon}</span>
      <h3 className={styles.title}>{service.name}</h3>
      <p className={styles.desc}>{service.description}</p>
      {!compact && service.details?.length > 0 && (
        <ul className={styles.list}>
          {service.details.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      )}
    </article>
  )
}
