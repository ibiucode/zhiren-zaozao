import { useParams } from 'react-router-dom'
import ResourceManager from '../components/ResourceManager.jsx'
import { resources } from '../config/resources.js'

export default function ResourcePage() {
  const { resource } = useParams()
  const config = resources[resource]

  if (!config) {
    return <div className="alert alert-error">未知的資源：{resource}</div>
  }
  // key=resource 確保切換資源時重置內部狀態（重新載入）。
  return <ResourceManager key={resource} config={config} />
}
