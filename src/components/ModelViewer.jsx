import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import styles from './ModelViewer.module.css'

const ACCENT = 0xff6a1a

/**
 * 3D 模型預覽（純 UI）：可旋轉縮放，畫 bounding box 框線，
 * 並把 X/Y/Z 邊長（mm）標籤手動投影貼在對應的框線旁（會隨旋轉移動）。
 * @param {{ model: {object: THREE.Object3D, sizeMm: {x,y,z}} | null, loading?: boolean, error?: string, emptyHint?: string }} props
 */
export default function ModelViewer({ model, loading, error, emptyHint = '選擇檔案以預覽 3D 模型' }) {
  const mountRef = useRef(null)
  const apiRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x121419)

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1_000_000)
    camera.position.set(120, 90, 150)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mount.appendChild(renderer.domElement)

    // 標籤圖層（HTML，手動投影定位）
    const labelLayer = document.createElement('div')
    labelLayer.className = styles.labels
    mount.appendChild(labelLayer)

    scene.add(new THREE.AmbientLight(0xffffff, 0.75))
    const d1 = new THREE.DirectionalLight(0xffffff, 0.9)
    d1.position.set(1, 1.4, 1)
    scene.add(d1)
    const d2 = new THREE.DirectionalLight(0xffffff, 0.4)
    d2.position.set(-1, 0.3, -1)
    scene.add(d2)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08

    let content = null
    let labels = [] // { el, pos: Vector3 }

    const clearLabels = () => {
      labels.forEach((l) => l.el.remove())
      labels = []
    }

    const setModel = (m) => {
      if (content) {
        scene.remove(content)
        content.traverse((o) => o.geometry?.dispose?.())
        content = null
      }
      clearLabels()
      if (!m) return

      const group = new THREE.Group()
      const holder = new THREE.Group()
      holder.add(m.object)
      const box = new THREE.Box3().setFromObject(holder)
      const center = box.getCenter(new THREE.Vector3())
      holder.position.sub(center) // 置中至原點
      group.add(holder)

      const { x, y, z } = m.sizeMm
      const edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(x || 1, y || 1, z || 1))
      group.add(new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.9 }),
      ))
      scene.add(group)
      content = group

      // X/Y/Z 標籤錨點：放在三條相鄰邊的中點、稍微往外推
      const hx = x / 2, hy = y / 2, hz = z / 2
      const pad = Math.max(x, y, z, 1) * 0.06
      const mk = (text, pos) => {
        const el = document.createElement('div')
        el.className = styles.dimLabel
        el.textContent = text
        labelLayer.appendChild(el)
        labels.push({ el, pos })
      }
      mk(`X ${x} mm`, new THREE.Vector3(0, -hy - pad, hz + pad))
      mk(`Y ${y} mm`, new THREE.Vector3(hx + pad, 0, hz + pad))
      mk(`Z ${z} mm`, new THREE.Vector3(hx + pad, -hy - pad, 0))

      const maxDim = Math.max(x, y, z, 1)
      camera.near = maxDim / 100
      camera.far = maxDim * 100
      camera.position.set(maxDim * 1.6, maxDim * 1.15, maxDim * 2.1)
      camera.updateProjectionMatrix()
      controls.target.set(0, 0, 0)
      controls.update()
    }
    apiRef.current = { setModel }

    const tmp = new THREE.Vector3()
    const projectLabels = (w, h) => {
      for (const l of labels) {
        tmp.copy(l.pos).project(camera)
        const behind = tmp.z > 1
        l.el.style.display = behind ? 'none' : 'block'
        if (!behind) {
          const px = (tmp.x * 0.5 + 0.5) * w
          const py = (-tmp.y * 0.5 + 0.5) * h
          l.el.style.transform = `translate(-50%, -50%) translate(${px}px, ${py}px)`
        }
      }
    }

    let raf = 0
    let lw = 0
    let lh = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)
      const w = mount.clientWidth
      const h = mount.clientHeight
      if (w > 0 && h > 0 && (w !== lw || h !== lh)) {
        lw = w
        lh = h
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
      }
      controls.update()
      renderer.render(scene, camera)
      projectLabels(w, h)
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      clearLabels()
      controls.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
      if (labelLayer.parentNode === mount) mount.removeChild(labelLayer)
      apiRef.current = null
    }
  }, [])

  useEffect(() => {
    apiRef.current?.setModel(model || null)
  }, [model])

  return (
    <div className={styles.viewer}>
      <div ref={mountRef} className={styles.canvas} />

      {(loading || error || !model) && (
        <div className={styles.overlay}>
          {loading ? '模型載入中…' : error ? error : emptyHint}
        </div>
      )}

      {model && !loading && !error && <div className={styles.hint}>拖曳旋轉 · 滾輪縮放</div>}
    </div>
  )
}
