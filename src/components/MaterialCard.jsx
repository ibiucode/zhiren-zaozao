import styles from './MaterialCard.module.css'

/**
 * 材料卡片（純 UI）。
 * @param {{ material: Material }} props
 */
export default function MaterialCard({ material }) {
  const { name, description, colorOptions = [], properties = {} } = material
  return (
    <article className={styles.card}>
      <h3 className={styles.title}>{name}</h3>
      <p className={styles.desc}>{description}</p>

      {Object.keys(properties).length > 0 && (
        <dl className={styles.props}>
          {properties.strength && (
            <div className={styles.prop}><dt>強度</dt><dd>{properties.strength}</dd></div>
          )}
          {properties.heatResistance && (
            <div className={styles.prop}><dt>耐溫</dt><dd>{properties.heatResistance}</dd></div>
          )}
          {properties.detail && (
            <div className={styles.prop}><dt>細節</dt><dd>{properties.detail}</dd></div>
          )}
        </dl>
      )}

      {colorOptions.length > 0 && (
        <div className={styles.colors}>
          <span className={styles.colorsLabel}>可選色</span>
          <ul className={styles.colorList}>
            {colorOptions.map((c) => (
              <li key={c} className={styles.colorChip}>{c}</li>
            ))}
          </ul>
        </div>
      )}
    </article>
  )
}
