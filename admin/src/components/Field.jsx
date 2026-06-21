/**
 * 依 field.type 渲染單一表單欄位（純 UI）。
 * value 為「表單值」（list/keyval 為多行字串），由上層做 API 轉換。
 */
export default function Field({ field, value, onChange, disabled }) {
  const id = `field-${field.name}`

  if (field.type === 'boolean') {
    return (
      <label className="checkbox">
        <input
          type="checkbox"
          checked={!!value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span>{field.label}</span>
      </label>
    )
  }

  const control =
    field.type === 'textarea' || field.type === 'list' || field.type === 'keyval' ? (
      <textarea
        id={id}
        className="input"
        rows={field.type === 'textarea' ? 4 : 3}
        value={value}
        disabled={disabled}
        placeholder={field.placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    ) : (
      <input
        id={id}
        className="input"
        type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
        value={value}
        disabled={disabled}
        placeholder={field.placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    )

  return (
    <div className="field">
      <label htmlFor={id} className="field-label">
        {field.label}
        {field.required && <span className="req"> *</span>}
      </label>
      {control}
    </div>
  )
}
