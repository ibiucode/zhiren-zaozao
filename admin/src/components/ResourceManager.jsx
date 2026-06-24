import { useCallback, useEffect, useState } from 'react'
import Field from './Field.jsx'
import { useToast } from './Toast.jsx'
import {
  createResource,
  deleteResource,
  listResource,
  updateResource,
} from '../services/adminApi.js'
import { defaultFormValue, displayCell, toApiValue, toFormValue } from '../lib/formUtils.js'

/**
 * 通用內容管理器：依 config（resources.js）渲染列表 + 新增/編輯表單 + 刪除。
 * @param {{ config: { label, endpoint, columns, fields } }} props
 */
export default function ResourceManager({ config }) {
  const toast = useToast()
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null) // null | { mode, id, form }
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const load = useCallback(async () => {
    setStatus('loading')
    setError('')
    try {
      setItems(await listResource(config.endpoint))
      setStatus('ready')
    } catch (e) {
      setError(e.message)
      setStatus('error')
    }
  }, [config.endpoint])

  useEffect(() => {
    load()
  }, [load])

  const openNew = () => {
    const form = {}
    config.fields.forEach((f) => {
      form[f.name] = defaultFormValue(f)
    })
    setFormError('')
    setEditing({ mode: 'new', id: null, form })
  }

  const openEdit = (item) => {
    const form = {}
    config.fields.forEach((f) => {
      form[f.name] = toFormValue(f, item[f.name])
    })
    setFormError('')
    setEditing({ mode: 'edit', id: item.id, form })
  }

  const setField = (name, value) =>
    setEditing((prev) => ({ ...prev, form: { ...prev.form, [name]: value } }))

  const save = async () => {
    // 必填檢查
    for (const f of config.fields) {
      if (f.required) {
        if (editing.mode === 'edit' && f.createOnly) continue
        if (!String(editing.form[f.name] ?? '').trim()) {
          setFormError(`「${f.label}」為必填`)
          return
        }
      }
    }
    const payload = {}
    config.fields.forEach((f) => {
      if (editing.mode === 'edit' && f.createOnly) return
      payload[f.name] = toApiValue(f, editing.form[f.name])
    })

    const isNew = editing.mode === 'new'
    setSaving(true)
    setFormError('')
    try {
      if (isNew) {
        await createResource(config.endpoint, payload)
      } else {
        await updateResource(config.endpoint, editing.id, payload)
      }
      setEditing(null)
      await load()
      toast.success(isNew ? '已新增' : '已儲存')
    } catch (e) {
      setFormError(e.message)
      toast.error(`儲存失敗：${e.message}`)
    } finally {
      setSaving(false)
    }
  }

  const remove = async (item) => {
    if (!window.confirm(`確定要刪除「${item.title || item.name || item.question || item.id}」嗎？`)) return
    try {
      await deleteResource(config.endpoint, item.id)
      await load()
      toast.success('已刪除')
    } catch (e) {
      setError(e.message)
      toast.error(`刪除失敗：${e.message}`)
    }
  }

  return (
    <div>
      <div className="page-head">
        <h1>{config.label}</h1>
        <button className="btn btn-primary" onClick={openNew}>
          + 新增
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {status === 'loading' && <div className="muted">載入中…</div>}

      {status === 'ready' && (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                {config.columns.map((c) => (
                  <th key={c}>{c}</th>
                ))}
                <th className="actions-col">操作</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={config.columns.length + 1} className="muted center">
                    目前沒有資料
                  </td>
                </tr>
              )}
              {items.map((item) => (
                <tr key={item.id}>
                  {config.columns.map((c) => (
                    <td key={c}>{displayCell(item[c])}</td>
                  ))}
                  <td className="actions-col">
                    <button className="btn btn-sm" onClick={() => openEdit(item)}>
                      編輯
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => remove(item)}>
                      刪除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="modal-overlay" onClick={() => !saving && setEditing(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>{editing.mode === 'new' ? `新增${config.label}` : `編輯${config.label}`}</h2>
              <button className="icon-btn" onClick={() => setEditing(null)} disabled={saving}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              {config.fields.map((f) => (
                <Field
                  key={f.name}
                  field={f}
                  value={editing.form[f.name]}
                  disabled={saving || (editing.mode === 'edit' && f.createOnly)}
                  onChange={(v) => setField(f.name, v)}
                />
              ))}
              {formError && <div className="alert alert-error">{formError}</div>}
            </div>
            <div className="modal-foot">
              <button className="btn" onClick={() => setEditing(null)} disabled={saving}>
                取消
              </button>
              <button className="btn btn-primary" onClick={save} disabled={saving}>
                {saving ? '儲存中…' : '儲存'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
