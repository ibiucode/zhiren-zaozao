import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import styles from './ModelViewer.module.css'

const ACCENT = 0xff6a1a

/**
 * 3D 模型預覽（純 UI）：可旋轉縮放，畫 bounding box 框線；尺寸（mm）以 overlay 顯示。
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

    const setModel = (m) => {
      if (content) {
        scene.remove(content)
        content.traverse((o) => {
          if (o.geometry) o.geometry.dispose?.()
        })
        content = null
      }
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

      const maxDim = Math.max(x, y, z, 1)
      camera.near = maxDim / 100
      camera.far = maxDim * 100
      camera.position.set(maxDim * 1.6, maxDim * 1.15, maxDim * 2.1)
      camera.updateProjectionMatrix()
      controls.target.set(0, 0, 0)
      controls.update()
    }
    apiRef.current = { setModel }

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
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      controls.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
      apiRef.current = null
    }
  }, [])

  useEffect(() => {
    apiRef.current?.setModel(model || null)
  }, [model])

  const dims = model?.sizeMm

  return (
    <div className={styles.viewer}>
      <div ref={mountRef} className={styles.canvas} />

      {dims && !loading && !error && (
        <div className={styles.dims}>
          <span><b>X</b> {dims.x}</span>
          <span><b>Y</b> {dims.y}</span>
          <span><b>Z</b> {dims.z}</span>
          <span className={styles.unit}>mm</span>
        </div>
      )}

      {(loading || error || !model) && (
        <div className={styles.overlay}>
          {loading ? '模型載入中…' : error ? error : emptyHint}
        </div>
      )}

      {model && !loading && !error && <div className={styles.hint}>拖曳旋轉 · 滾輪縮放</div>}
    </div>
  )
}
