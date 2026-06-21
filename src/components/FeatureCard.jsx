import styles from './FeatureCard.module.css'

/**
 * 工作室特色卡片（純 UI）。
 * @param {{ feature: { icon, title, description } }} props
 */
export default function FeatureCard({ feature }) {
  return (
    <div className={styles.card}>
      <span className={styles.icon} aria-hidden="true">{feature.icon}</span>
      <div>
        <h3 className={styles.title}>{feature.title}</h3>
        <p className={styles.desc}>{feature.description}</p>
      </div>
    </div>
  )
}
