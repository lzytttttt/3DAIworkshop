/**
 * 合并几何与实例化工具。
 * 场景里重复出现的零件（椅子、绿植、画框、书本、轨道灯、人流）都先合并成一个几何体，
 * 再用 instancedMesh 一次画完，避免几百个 draw call。
 */

import { useLayoutEffect, useRef, type ReactNode } from 'react'
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

export interface Part {
  /** 盒体尺寸 */
  size?: [number, number, number]
  /** 或自定义几何（圆柱 / 球 / 圆锥），与 size 二选一 */
  geo?: THREE.BufferGeometry
  pos?: [number, number, number]
  rot?: [number, number, number]
  scale?: [number, number, number]
  /** 顶点色，用于在同一材质里拼出多色零件 */
  color?: string
}

function colored(geo: THREE.BufferGeometry, color: string): THREE.BufferGeometry {
  const c = new THREE.Color(color).convertSRGBToLinear()
  const n = geo.attributes.position.count
  const arr = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    arr[i * 3] = c.r
    arr[i * 3 + 1] = c.g
    arr[i * 3 + 2] = c.b
  }
  geo.setAttribute('color', new THREE.BufferAttribute(arr, 3))
  return geo
}

export function merged(parts: Part[]): THREE.BufferGeometry {
  const withColor = parts.some((p) => p.color)
  const geos = parts.map((p) => {
    const g = p.geo ? p.geo.clone() : new THREE.BoxGeometry(...(p.size ?? [1, 1, 1]))
    if (p.scale) g.scale(...p.scale)
    if (p.rot) {
      g.rotateX(p.rot[0])
      g.rotateY(p.rot[1])
      g.rotateZ(p.rot[2])
    }
    if (p.pos) g.translate(...p.pos)
    return withColor ? colored(g, p.color ?? '#ffffff') : g
  })
  return mergeGeometries(geos)!
}

export const cyl = (rTop: number, rBottom: number, h: number, seg = 12) =>
  new THREE.CylinderGeometry(rTop, rBottom, h, seg)

export const ball = (r: number, seg = 12) => new THREE.SphereGeometry(r, seg, seg)

export interface Pose {
  p: [number, number, number]
  /** 绕 Y 轴朝向 */
  ry?: number
  s?: number | [number, number, number]
}

interface InstancedProps {
  geometry: THREE.BufferGeometry
  poses: Pose[]
  children: ReactNode
  /** 逐实例颜色：几何体需要带白色 color 属性，材质开 vertexColors 才会生效 */
  colors?: string[]
  castShadow?: boolean
  receiveShadow?: boolean
}

/** 静态实例化：pose 变化时重算矩阵 */
export function Instanced({ geometry, poses, children, colors, castShadow, receiveShadow }: InstancedProps) {
  const ref = useRef<THREE.InstancedMesh>(null)
  useLayoutEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const e = new THREE.Euler()
    const v = new THREE.Vector3()
    const s = new THREE.Vector3()
    poses.forEach((pose, i) => {
      e.set(0, pose.ry ?? 0, 0)
      q.setFromEuler(e)
      const sc = pose.s ?? 1
      s.set(...(Array.isArray(sc) ? sc : ([sc, sc, sc] as [number, number, number])))
      m.compose(v.set(...pose.p), q, s)
      mesh.setMatrixAt(i, m)
      if (colors) mesh.setColorAt(i, new THREE.Color(colors[i % colors.length]))
    })
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    mesh.computeBoundingSphere()
  }, [poses, colors])

  return (
    <instancedMesh
      ref={ref}
      args={[geometry, undefined, poses.length]}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
      frustumCulled={false}
    >
      {children}
    </instancedMesh>
  )
}
