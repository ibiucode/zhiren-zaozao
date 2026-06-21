import styles from './FileCheckCard.module.css'

const STATUS_TEXT = {
  ok: '檢查通過',
  warning: '可列印（有提醒）',
  error: '無法使用',
  unsupported: '需專人確認',
}

function formatSize(bytes) {
  if (bytes == null) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

/**
 * 顯示 backend 檔案檢查結果（純 UI）。
 * @param {{ result: { fileName, fileSize, fileFormat, checkStatus, checkResult } }} props
 */
export default function FileCheckCard({ result }) {
  if (!result) return null
  const { fileName, fileSize, fileFormat, checkStatus, checkResult } = result
  const cr = checkResult || {}
  const dims = cr.dimensionsMm

  return (
    <div className={`${styles.card} ${styles[checkStatus] || ''}`}>
      <div className={styles.head}>
        <span className={styles.name}>{fileName}</span>
        <span className={styles.badge}>{STATUS_TEXT[checkStatus] || checkStatus}</span>
      </div>

      <dl className={styles.meta}>
        <div><dt>格式</dt><dd>{(fileFormat || '').toUpperCase()}</dd></div>
        <div><dt>大小</dt><dd>{formatSize(fileSize)}</dd></div>
        {dims && (
          <div><dt>尺寸 (mm)</dt><dd>{dims.x} × {dims.y} × {dims.z}</dd></div>
        )}
        {cr.triangleCount != null && (
          <div><dt>三角面</dt><dd>{cr.triangleCount.toLocaleString()}</dd></div>
        )}
        {cr.watertight != null && (
          <div>
            <dt>封閉性</dt>
            <dd>{cr.watertight ? '✓ 封閉' : '⚠ 可能破面'}</dd>
          </div>
        )}
      </dl>

      {cr.errors?.length > 0 && (
        <ul className={styles.errors}>
          {cr.errors.map((e, i) => <li key={i}>{e}</li>)}
        </ul>
      )}
      {cr.warnings?.length > 0 && (
        <ul className={styles.warnings}>
          {cr.warnings.map((w, i) => <li key={i}>{w}</li>)}
        </ul>
      )}
    </div>
  )
}
