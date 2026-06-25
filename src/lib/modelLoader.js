/**
 * 在瀏覽器端把 3D 檔案解析成 Three.js 物件 + 尺寸（mm）。
 * - STL：STLLoader（binary / ascii 自動判斷）
 * - OBJ：OBJLoader
 * - STEP/STP：occt-import-js（OpenCASCADE WASM）→ 只在第一次需要時才 lazy 載入 ~7.6MB WASM
 *
 * 單位：STL/OBJ 本身無單位，假設為 mm；STEP 通常即為 mm。
 */
import * as THREE from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import occtWasmUrl from 'occt-import-js/dist/occt-import-js.wasm?url'
import { getFileExtension } from '../logic/fileValidation.js'

const MODEL_MATERIAL = new THREE.MeshStandardMaterial({
  color: 0xcfd3d8,
  metalness: 0.15,
  roughness: 0.55,
  flatShading: false,
})

// occt 只 lazy 初始化一次（動態 import，避免一般 STL/OBJ 也載入 WASM glue）。
let occtPromise = null
function getOcct() {
  if (!occtPromise) {
    occtPromise = import('occt-import-js').then((mod) => {
      const factory = mod.default || mod
      return factory({ locateFile: () => occtWasmUrl })
    })
  }
  return occtPromise
}

function readAsArrayBuffer(file) {
  return file.arrayBuffer()
}
function readAsText(file) {
  return file.text()
}

async function loadStl(file) {
  const buffer = await readAsArrayBuffer(file)
  const geometry = new STLLoader().parse(buffer)
  if (!geometry.attributes.normal) geometry.computeVertexNormals()
  return new THREE.Mesh(geometry, MODEL_MATERIAL)
}

async function loadObj(file) {
  const text = await readAsText(file)
  const group = new OBJLoader().parse(text)
  group.traverse((child) => {
    if (child.isMesh) {
      child.material = MODEL_MATERIAL
      if (!child.geometry.attributes.normal) child.geometry.computeVertexNormals()
    }
  })
  return group
}

async function loadStep(file) {
  const buffer = await readAsArrayBuffer(file)
  const occt = await getOcct()
  const result = occt.ReadStepFile(new Uint8Array(buffer), null)
  if (!result || !result.success || !result.meshes?.length) {
    throw new Error('STEP 解析失敗或無可顯示的幾何')
  }
  const group = new THREE.Group()
  for (const m of result.meshes) {
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(m.attributes.position.array, 3),
    )
    if (m.attributes.normal) {
      geometry.setAttribute('normal', new THREE.Float32BufferAttribute(m.attributes.normal.array, 3))
    }
    if (m.index) geometry.setIndex(m.index.array)
    if (!m.attributes.normal) geometry.computeVertexNormals()
    group.add(new THREE.Mesh(geometry, MODEL_MATERIAL))
  }
  return group
}

function countTriangles(object) {
  let tris = 0
  object.traverse((child) => {
    if (child.isMesh) {
      const g = child.geometry
      tris += g.index ? g.index.count / 3 : g.attributes.position.count / 3
    }
  })
  return Math.round(tris)
}

/**
 * 載入並解析模型檔。
 * @param {File} file
 * @returns {Promise<{ object: THREE.Object3D, sizeMm: {x:number,y:number,z:number}, triangleCount: number }>}
 */
export async function loadModel(file) {
  const ext = getFileExtension(file.name)
  let object
  if (ext === 'stl') object = await loadStl(file)
  else if (ext === 'obj') object = await loadObj(file)
  else if (ext === 'step' || ext === 'stp') object = await loadStep(file)
  else throw new Error(`不支援預覽的格式：.${ext}`)

  const box = new THREE.Box3().setFromObject(object)
  const size = new THREE.Vector3()
  box.getSize(size)
  return {
    object,
    sizeMm: {
      x: Math.round(size.x * 100) / 100,
      y: Math.round(size.y * 100) / 100,
      z: Math.round(size.z * 100) / 100,
    },
    triangleCount: countTriangles(object),
  }
}
