/**
 * 可复用家具与设备零件。
 * 全部以企划书平面坐标（X 0→12 西→东，Z 0→8.33 北→南）书写，
 * 调用方把这些组件放进带 ROOM.offset 的 group 即可。
 * 约定：椅子、吧凳、软座模型默认朝 +Z，用 faceTowards() 求朝向角。
 */

import * as THREE from 'three'
import { C, menuBoardTexture, slideTexture, whiteboardTexture } from './palette'
import { Instanced, ball, cyl, merged } from './instancing'

const std = (color: string, roughness = 0.8, metalness = 0) =>
  new THREE.MeshStandardMaterial({ color, roughness, metalness })

export const M = {
  wood: std(C.wood, 0.75),
  woodDark: std(C.woodDark, 0.8),
  woodLight: std(C.woodLight, 0.7),
  top: std(C.top, 0.55),
  wall: std(C.wall, 0.95),
  wallCap: std(C.wallCap, 0.8),
  base: std(C.base, 0.85),
  steel: std(C.steel, 0.32, 0.65),
  steelDark: std(C.steelDark, 0.45, 0.55),
  concrete: std(C.concrete, 0.95),
  charcoal: std(C.charcoal, 0.8),
  paper: std(C.paper, 0.9),
  vcol: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.78 }),
  vcolSoft: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.92 }),
  glass: new THREE.MeshStandardMaterial({
    color: C.glass,
    transparent: true,
    opacity: 0.22,
    roughness: 0.06,
    metalness: 0.1,
    side: THREE.DoubleSide,
  }),
  mug: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85 }),
}

/** 四根柱脚，供各家具拼装 */
function Legs({
  x,
  z,
  h,
  t,
  color,
}: {
  x: number
  z: number
  h: number
  t: number
  color: THREE.Material
}) {
  return (
    <>
      {(
        [
          [x, z],
          [x, -z],
          [-x, z],
          [-x, -z],
        ] as const
      ).map(([lx, lz], i) => (
        <mesh key={i} material={color} position={[lx, h / 2, lz]} castShadow>
          <boxGeometry args={[t, h, t]} />
        </mesh>
      ))}
    </>
  )
}

/** 餐椅：木框 + 软垫，坐高 0.45 */
export const CHAIR_GEO = merged([
  { size: [0.44, 0.05, 0.44], pos: [0, 0.45, 0], color: C.fabric },
  { size: [0.42, 0.42, 0.05], rot: [-0.12, 0, 0], pos: [0, 0.68, -0.2], color: C.woodDark },
  { size: [0.045, 0.45, 0.045], pos: [0.185, 0.225, 0.185], color: C.woodDark },
  { size: [0.045, 0.45, 0.045], pos: [0.185, 0.225, -0.185], color: C.woodDark },
  { size: [0.045, 0.45, 0.045], pos: [-0.185, 0.225, 0.185], color: C.woodDark },
  { size: [0.045, 0.45, 0.045], pos: [-0.185, 0.225, -0.185], color: C.woodDark },
])

/** 折叠椅：金属腿更轻，讲座角 40 把 */
export const FOLDING_GEO = merged([
  { size: [0.4, 0.035, 0.4], pos: [0, 0.44, 0], color: C.woodLight },
  { size: [0.4, 0.36, 0.035], rot: [-0.1, 0, 0], pos: [0, 0.66, -0.19], color: C.woodLight },
  { size: [0.38, 0.03, 0.03], pos: [0, 0.16, 0.17], color: C.steelDark },
  { size: [0.035, 0.44, 0.035], pos: [0.17, 0.22, 0.17], color: C.steelDark },
  { size: [0.035, 0.44, 0.035], pos: [0.17, 0.22, -0.17], color: C.steelDark },
  { size: [0.035, 0.44, 0.035], pos: [-0.17, 0.22, 0.17], color: C.steelDark },
  { size: [0.035, 0.44, 0.035], pos: [-0.17, 0.22, -0.17], color: C.steelDark },
])

/** 吧凳：坐高 0.75 */
export const STOOL_GEO = merged([
  { geo: cyl(0.17, 0.17, 0.06, 16), pos: [0, 0.74, 0], color: C.woodLight },
  { geo: cyl(0.035, 0.035, 0.68, 10), pos: [0, 0.37, 0], color: C.steelDark },
  {
    geo: new THREE.TorusGeometry(0.145, 0.014, 6, 16),
    rot: [Math.PI / 2, 0, 0],
    pos: [0, 0.22, 0],
    color: C.steelDark,
  },
  { geo: cyl(0.17, 0.2, 0.03, 14), pos: [0, 0.015, 0], color: C.steelDark },
])

/** 静音区软座 */
export const ARMCHAIR_GEO = merged([
  { size: [0.68, 0.34, 0.62], pos: [0, 0.19, 0], color: C.woodDark },
  { size: [0.6, 0.14, 0.56], pos: [0, 0.42, 0.01], color: C.fabric },
  { size: [0.68, 0.46, 0.13], rot: [-0.1, 0, 0], pos: [0, 0.63, -0.25], color: C.fabric },
  { size: [0.1, 0.24, 0.56], pos: [0.29, 0.5, 0], color: C.fabricDeep },
  { size: [0.1, 0.24, 0.56], pos: [-0.29, 0.5, 0], color: C.fabricDeep },
  { size: [0.06, 0.12, 0.06], pos: [0.27, 0.06, 0.24], color: C.woodDark },
  { size: [0.06, 0.12, 0.06], pos: [0.27, 0.06, -0.24], color: C.woodDark },
  { size: [0.06, 0.12, 0.06], pos: [-0.27, 0.06, 0.24], color: C.woodDark },
  { size: [0.06, 0.12, 0.06], pos: [-0.27, 0.06, -0.24], color: C.woodDark },
])

/** 绿植：陶盆 + 阔叶，约 1.4 m */
export const PLANT_GEO = merged([
  { geo: cyl(0.155, 0.12, 0.3, 14), pos: [0, 0.15, 0], color: C.pot },
  { geo: cyl(0.17, 0.17, 0.045, 14), pos: [0, 0.3, 0], color: C.pot },
  { geo: cyl(0.15, 0.15, 0.03, 12), pos: [0, 0.31, 0], color: '#4a3a2a' },
  { geo: cyl(0.022, 0.032, 0.6, 8), pos: [0, 0.62, 0], color: C.wood },
  { geo: ball(0.3, 10), scale: [1, 0.42, 1], pos: [0, 1.05, 0], color: C.green },
  { geo: ball(0.24, 10), scale: [1, 0.42, 1], rot: [0, 0.9, -0.25], pos: [0.18, 0.94, 0.1], color: C.greenDeep },
  { geo: ball(0.25, 10), scale: [1, 0.42, 1], rot: [0, 1.8, 0.3], pos: [-0.19, 0.98, -0.06], color: C.green },
  { geo: ball(0.22, 10), scale: [1, 0.42, 1], rot: [0, 2.7, -0.25], pos: [0.08, 1.18, -0.14], color: C.greenDeep },
  { geo: ball(0.23, 10), scale: [1, 0.42, 1], rot: [0, 3.6, 0.3], pos: [-0.1, 1.14, 0.16], color: C.green },
  { geo: ball(0.19, 10), scale: [1, 0.42, 1], rot: [0, 4.5, -0.25], pos: [0.22, 1.24, -0.02], color: C.greenDeep },
  { geo: ball(0.18, 10), scale: [1, 0.42, 1], rot: [0, 5.4, 0.3], pos: [-0.24, 1.26, 0.04], color: C.green },
])

/** 笔记本电脑（屏幕朝 +Z） */
export const LAPTOP_GEO = merged([
  { size: [0.32, 0.018, 0.22], pos: [0, 0.012, 0], color: C.steelDark },
  { size: [0.26, 0.006, 0.13], pos: [0, 0.024, 0.03], color: C.steel },
  { size: [0.32, 0.2, 0.014], rot: [-1.18, 0, 0], pos: [0, 0.1, -0.12], color: C.screen },
])

/** 马克杯 */
export const MUG_GEO = merged([
  { geo: cyl(0.038, 0.032, 0.09, 10), pos: [0, 0.045, 0], color: C.paper },
  {
    geo: new THREE.TorusGeometry(0.032, 0.008, 5, 10),
    rot: [0, 0, Math.PI / 2],
    pos: [0.045, 0.05, 0],
    color: C.paper,
  },
])

/** 展墙作品：外框统一木色，画芯用逐实例颜色铺彩色块面 */
export const FRAME_GEO = merged([{ size: [0.3, 0.36, 0.03], color: C.woodDark }])
export const ART_GEO = merged([{ size: [0.24, 0.3, 0.012], color: '#ffffff' }])

/** 书脊一束：宽度给定，颜色多样 */
export function bookStack(width: number, seed: number): THREE.BufferGeometry {
  const palette = ['#c4694a', '#2e6b5e', '#f7cd67', '#889df0', '#9a835a', '#82d5bb', '#e59266']
  const parts: { size: [number, number, number]; pos: [number, number, number]; color: string }[] = []
  let x = -width / 2 + 0.03
  let i = 0
  while (x < width / 2 - 0.04) {
    const w = 0.03 + ((seed + i * 7) % 3) * 0.012
    const h = 0.18 + ((seed + i * 5) % 4) * 0.022
    parts.push({ size: [w, h, 0.16], pos: [x + w / 2, h / 2, 0], color: palette[(seed + i) % 7] })
    x += w + 0.004
    i++
  }
  return merged(parts)
}

export function Plant({ x, z, scale = 1 }: { x: number; z: number; scale?: number }) {
  return <mesh geometry={PLANT_GEO} material={M.vcol} position={[x, 0, z]} scale={scale} castShadow />
}

/** 8 人实木长桌（长边沿 Z） */
export function LongTable({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh material={M.top} position={[0, 0.745, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.72, 0.07, 3.3]} />
      </mesh>
      <Legs x={0.26} z={1.4} h={0.71} t={0.08} color={M.woodDark} />
      <mesh material={M.woodDark} position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.1, 0.06, 2.9]} />
      </mesh>
      <mesh material={M.steelDark} position={[0, 0.7, 0]}>
        <boxGeometry args={[0.16, 0.03, 2.6]} />
      </mesh>
    </group>
  )
}

/** 吧台岛柜（长边沿 X）+ 糕点柜 + 3 个高脚位 */
export function BarCounter() {
  return (
    <group position={[1.6, 0, 0.95]}>
      <mesh material={M.woodDark} position={[0, 0.44, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.82, 0.86, 0.6]} />
      </mesh>
      <mesh material={M.top} position={[0, 0.9, 0]} castShadow>
        <boxGeometry args={[1.96, 0.07, 0.72]} />
      </mesh>
      <mesh material={M.wood} position={[0, 0.42, 0.315]}>
        <boxGeometry args={[1.72, 0.72, 0.02]} />
      </mesh>
      <mesh material={M.charcoal} position={[0, 0.04, 0]}>
        <boxGeometry args={[1.9, 0.08, 0.66]} />
      </mesh>
      <group position={[-0.62, 0.94, 0]}>
        <mesh material={M.glass} position={[0, 0.2, 0]}>
          <boxGeometry args={[0.5, 0.4, 0.44]} />
        </mesh>
        <mesh material={M.top} position={[0, 0.02, 0]}>
          <boxGeometry args={[0.5, 0.04, 0.4]} />
        </mesh>
        {[-0.14, 0, 0.14].map((ox, i) => (
          <mesh key={i} material={M.steelDark} position={[ox, 0.13, 0.16]}>
            <boxGeometry args={[0.11, 0.12, 0.08]} />
          </mesh>
        ))}
      </group>
      <Instanced
        geometry={MUG_GEO}
        poses={[{ p: [0.62, 0.94, -0.12] }, { p: [0.44, 0.94, 0.16] }]}
      >
        <primitive object={M.mug} attach="material" />
      </Instanced>
    </group>
  )
}

/** 吧台后场：操作台 + 咖啡机 + 吊柜（贴西墙） */
export function BackCounter() {
  return (
    <group position={[0.34, 0, 1.75]}>
      <mesh material={M.woodDark} position={[0, 0.44, 0]} castShadow>
        <boxGeometry args={[0.56, 0.86, 2.5]} />
      </mesh>
      <mesh material={M.steel} position={[0, 0.9, 0]}>
        <boxGeometry args={[0.62, 0.05, 2.5]} />
      </mesh>
      <mesh material={M.charcoal} position={[0, 1.16, 0.62]} castShadow>
        <boxGeometry args={[0.5, 0.48, 0.44]} />
      </mesh>
      <mesh material={M.steel} position={[0, 1.4, 0.62]}>
        <boxGeometry args={[0.52, 0.06, 0.46]} />
      </mesh>
      <mesh material={M.charcoal} position={[0, 1.11, -0.3]} castShadow>
        <boxGeometry args={[0.46, 0.36, 0.36]} />
      </mesh>
      <mesh material={M.steelDark} position={[0, 0.9, -0.95]}>
        <boxGeometry args={[0.44, 0.06, 0.34]} />
      </mesh>
      {[1.55, 1.92].map((y, i) => (
        <mesh key={i} material={M.wood} position={[0.1, y, 0]}>
          <boxGeometry args={[0.3, 0.045, 2.3]} />
        </mesh>
      ))}
      <Instanced
        geometry={MUG_GEO}
        poses={[{ p: [0.08, 1.6, -0.5] }, { p: [0.08, 1.6, -0.42] }, { p: [0.08, 1.97, 0.4] }]}
      >
        <primitive object={M.mug} attach="material" />
      </Instanced>
    </group>
  )
}

/** 菜单与活动看板（贴西墙，面朝 +X） */
export function MenuBoard() {
  const tex = menuBoardTexture()
  return (
    <group position={[0.06, 1.95, 3.3]} rotation={[0, Math.PI / 2, 0]}>
      <mesh material={M.charcoal}>
        <boxGeometry args={[0.72, 0.94, 0.05]} />
      </mesh>
      <mesh position={[0, 0, 0.032]}>
        <planeGeometry args={[0.64, 0.86]} />
        <meshStandardMaterial
          map={tex}
          emissiveMap={tex}
          emissive="#ffffff"
          emissiveIntensity={0.35}
          roughness={0.6}
        />
      </mesh>
    </group>
  )
}

/** 移动白板 */
export function Whiteboard({ x, z, ry = 0 }: { x: number; z: number; ry?: number }) {
  const tex = whiteboardTexture()
  return (
    <group position={[x, 0, z]} rotation={[0, ry, 0]}>
      <mesh material={M.steel} position={[0, 1.0, 0]} castShadow>
        <boxGeometry args={[1.2, 1.5, 0.06]} />
      </mesh>
      <mesh position={[0, 1.02, 0.037]}>
        <planeGeometry args={[1.12, 1.42]} />
        <meshStandardMaterial map={tex} roughness={0.75} />
      </mesh>
      {[-0.5, 0.5].map((lx) => (
        <mesh key={lx} material={M.steelDark} position={[lx, 0.12, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 1.2, 8]} />
        </mesh>
      ))}
    </group>
  )
}

/** 可移动 55 寸投屏 */
export function RollingScreen({ x, z, ry = 0 }: { x: number; z: number; ry?: number }) {
  const tex = slideTexture('demo')
  return (
    <group position={[x, 0, z]} rotation={[0, ry, 0]}>
      <mesh material={M.charcoal} position={[0, 1.32, 0]} castShadow>
        <boxGeometry args={[1.2, 0.7, 0.06]} />
      </mesh>
      <mesh position={[0, 1.32, 0.036]}>
        <planeGeometry args={[1.14, 0.64]} />
        <meshStandardMaterial
          map={tex}
          emissiveMap={tex}
          emissive="#ffffff"
          emissiveIntensity={0.5}
          roughness={0.5}
        />
      </mesh>
      <mesh material={M.steelDark} position={[0, 0.5, 0]}>
        <boxGeometry args={[0.1, 0.95, 0.1]} />
      </mesh>
      <mesh material={M.steelDark} position={[0, 0.04, 0]} castShadow>
        <boxGeometry args={[0.7, 0.06, 0.42]} />
      </mesh>
    </group>
  )
}

/** 靠墙书柜（面朝 +Z） */
export function Bookshelf({
  x,
  z,
  width = 3.6,
  ry = 0,
}: {
  x: number
  z: number
  width?: number
  ry?: number
}) {
  const shelves = [0.34, 0.76, 1.18, 1.52]
  return (
    <group position={[x, 0, z]} rotation={[0, ry, 0]}>
      <mesh material={M.woodDark} position={[0, 0.86, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, 1.72, 0.34]} />
      </mesh>
      {shelves.map((y, i) => (
        <mesh key={i} material={M.wood} position={[0, y, 0.05]}>
          <boxGeometry args={[width - 0.08, 0.04, 0.28]} />
        </mesh>
      ))}
      {shelves.slice(0, 3).map((y, i) => (
        <mesh
          key={i}
          geometry={bookStack(width - 1.4, i * 3 + 1)}
          material={M.vcol}
          position={[-width / 2 + 0.4 + (i % 2) * 0.35, y + 0.02, 0.06]}
        />
      ))}
    </group>
  )
}

/** 静音区隔断屏风 */
export function Screen({ x, z, len = 1.7 }: { x: number; z: number; len?: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh material={M.woodDark} position={[0, 0.72, 0]} castShadow>
        <boxGeometry args={[0.07, 1.44, len]} />
      </mesh>
      <mesh material={M.wood} position={[0, 1.46, 0]}>
        <boxGeometry args={[0.12, 0.05, len + 0.06]} />
      </mesh>
    </group>
  )
}

/** 隔音电话亭（门朝 +Z） */
export function PhoneBooth({ x, z, ry = 0 }: { x: number; z: number; ry?: number }) {
  return (
    <group position={[x, 0, z]} rotation={[0, ry, 0]}>
      <mesh material={M.woodDark} position={[0, 1.08, -0.2]} castShadow>
        <boxGeometry args={[0.8, 2.16, 0.36]} />
      </mesh>
      <mesh material={M.woodDark} position={[0.38, 1.08, 0.05]}>
        <boxGeometry args={[0.04, 2.16, 0.5]} />
      </mesh>
      <mesh material={M.woodDark} position={[-0.38, 1.08, 0.05]}>
        <boxGeometry args={[0.04, 2.16, 0.5]} />
      </mesh>
      <mesh material={M.glass} position={[0, 1.12, 0.29]}>
        <boxGeometry args={[0.72, 1.96, 0.03]} />
      </mesh>
      <mesh material={M.wood} position={[0, 2.22, 0.02]}>
        <boxGeometry args={[0.86, 0.12, 0.66]} />
      </mesh>
      <mesh material={M.charcoal} position={[0, 0.52, -0.24]}>
        <boxGeometry args={[0.64, 0.04, 0.28]} />
      </mesh>
      <mesh material={M.steel} position={[0.3, 1.05, 0.32]}>
        <boxGeometry args={[0.03, 0.3, 0.03]} />
      </mesh>
    </group>
  )
}

/** 双门冷柜（默认面朝 +X） */
export function Fridge({ x, z, ry = Math.PI / 2 }: { x: number; z: number; ry?: number }) {
  return (
    <group position={[x, 0, z]} rotation={[0, ry, 0]}>
      <mesh material={M.steel} position={[0, 1.02, 0]} castShadow>
        <boxGeometry args={[1.3, 2.04, 0.72]} />
      </mesh>
      {[-0.33, 0.33].map((ox) => (
        <mesh key={ox} position={[ox, 1.02, 0.37]}>
          <planeGeometry args={[0.6, 1.86]} />
          <meshStandardMaterial
            color={C.screen}
            emissive={C.glowWarm}
            emissiveIntensity={0.22}
            roughness={0.3}
          />
        </mesh>
      ))}
      {[-0.13, 0.53].map((ox) => (
        <mesh key={ox} material={M.steelDark} position={[ox, 1.02, 0.4]}>
          <boxGeometry args={[0.04, 0.9, 0.04]} />
        </mesh>
      ))}
    </group>
  )
}

/** 洗涤槽与消毒柜（沿南墙，面朝 -Z） */
export function SinkCounter({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh material={M.steel} position={[0, 0.44, 0]} castShadow>
        <boxGeometry args={[1.5, 0.86, 0.6]} />
      </mesh>
      <mesh material={M.steelDark} position={[0, 0.88, 0]}>
        <boxGeometry args={[1.54, 0.04, 0.64]} />
      </mesh>
      <mesh material={M.charcoal} position={[-0.34, 0.86, 0]}>
        <boxGeometry args={[0.5, 0.08, 0.42]} />
      </mesh>
      <mesh material={M.steelDark} position={[0.34, 1.06, -0.16]}>
        <cylinderGeometry args={[0.02, 0.02, 0.36, 8]} />
      </mesh>
      <mesh material={M.paper} position={[0.34, 1.16, 0.04]}>
        <boxGeometry args={[0.16, 0.12, 0.16]} />
      </mesh>
    </group>
  )
}

/** 储物架（面朝 +X） */
export function StorageRack({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]} rotation={[0, Math.PI / 2, 0]}>
      <mesh material={M.steelDark} position={[0, 0.86, 0]} castShadow>
        <boxGeometry args={[1.2, 1.72, 0.42]} />
      </mesh>
      {[0.4, 0.78, 1.16, 1.54].map((y, i) => (
        <mesh key={i} material={M.wood} position={[0, y, 0.04]}>
          <boxGeometry args={[1.16, 0.035, 0.34]} />
        </mesh>
      ))}
      {(
        [
          [0.3, 0.42, 0.24],
          [-0.32, 0.8, 0.3],
          [0.1, 1.2, 0.26],
          [-0.25, 1.58, 0.22],
        ] as const
      ).map(([ox, oy, w], i) => (
        <mesh key={i} material={M.wood} position={[ox, oy + 0.11, 0.02]} castShadow>
          <boxGeometry args={[w, 0.22, 0.28]} />
        </mesh>
      ))}
    </group>
  )
}

/** 员工位（含监控画面） */
export function StaffDesk({ x, z, ry = 0 }: { x: number; z: number; ry?: number }) {
  return (
    <group position={[x, 0, z]} rotation={[0, ry, 0]}>
      <mesh material={M.top} position={[0, 0.73, 0]} castShadow>
        <boxGeometry args={[1.5, 0.06, 0.72]} />
      </mesh>
      <Legs x={0.64} z={0.28} h={0.7} t={0.06} color={M.steelDark} />
      <mesh material={M.charcoal} position={[0, 0.93, -0.2]}>
        <boxGeometry args={[0.6, 0.36, 0.05]} />
      </mesh>
      <mesh position={[0, 0.93, -0.17]}>
        <planeGeometry args={[0.55, 0.31]} />
        <meshStandardMaterial
          color={C.screen}
          emissive={C.glowWarm}
          emissiveIntensity={0.5}
          roughness={0.4}
        />
      </mesh>
      <mesh material={M.steelDark} position={[0, 0.78, -0.2]}>
        <boxGeometry args={[0.36, 0.06, 0.2]} />
      </mesh>
    </group>
  )
}

/** 卫生间体块，两扇门朝北 */
export function ToiletBlock() {
  return (
    <group>
      <mesh material={M.concrete} position={[5.2, 1.15, 8.16]} castShadow receiveShadow>
        <boxGeometry args={[1.9, 2.3, 0.34]} />
      </mesh>
      <mesh material={M.concrete} position={[6.15, 1.15, 7.66]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 2.3, 1.34]} />
      </mesh>
      <mesh material={M.concrete} position={[4.25, 1.15, 7.66]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 2.3, 1.34]} />
      </mesh>
      <mesh material={M.concrete} position={[5.2, 1.15, 6.99]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 2.3, 0.22]} />
      </mesh>
      {[4.75, 5.65].map((ox) => (
        <mesh key={ox} material={M.concrete} position={[ox, 2.15, 6.99]}>
          <boxGeometry args={[0.7, 0.3, 0.22]} />
        </mesh>
      ))}
      {[4.75, 5.65].map((ox) => (
        <mesh key={ox} material={M.woodDark} position={[ox, 1.0, 6.86]}>
          <boxGeometry args={[0.66, 2.0, 0.06]} />
        </mesh>
      ))}
      {[5.03, 5.93].map((ox) => (
        <mesh key={ox} material={M.steel} position={[ox, 0.98, 6.82]}>
          <boxGeometry args={[0.04, 0.16, 0.04]} />
        </mesh>
      ))}
      {[4.6, 5.5].map((ox) => (
        <mesh key={ox} material={M.paper} position={[ox, 1.72, 6.85]}>
          <boxGeometry args={[0.24, 0.18, 0.02]} />
        </mesh>
      ))}
    </group>
  )
}

/** 夜谈用的低圆桌 */
export function RoundTable({ x, z, r = 0.78 }: { x: number; z: number; r?: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh material={M.top} position={[0, 0.72, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[r, r, 0.06, 24]} />
      </mesh>
      <mesh material={M.woodDark} position={[0, 0.36, 0]}>
        <cylinderGeometry args={[0.09, 0.12, 0.7, 12]} />
      </mesh>
      <mesh material={M.woodDark} position={[0, 0.03, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.44, 0.06, 20]} />
      </mesh>
      <Instanced
        geometry={MUG_GEO}
        poses={[{ p: [0.3, 0.75, 0.2] }, { p: [-0.34, 0.75, -0.1] }, { p: [0.05, 0.75, -0.4] }]}
      >
        <primitive object={M.mug} attach="material" />
      </Instanced>
    </group>
  )
}

/** 门口的立式导视牌：菜单与价目在门口可见（可达性参数） */
export function SignPost({ x, z, ry = 0 }: { x: number; z: number; ry?: number }) {
  const tex = menuBoardTexture()
  return (
    <group position={[x, 0, z]} rotation={[0, ry, 0]}>
      <mesh material={M.woodDark} position={[0, 0.62, 0]} rotation={[-0.14, 0, 0]} castShadow>
        <boxGeometry args={[0.6, 0.86, 0.05]} />
      </mesh>
      <mesh position={[0, 0.66, 0.035]} rotation={[-0.14, 0, 0]}>
        <planeGeometry args={[0.52, 0.76]} />
        <meshStandardMaterial
          map={tex}
          emissiveMap={tex}
          emissive="#ffffff"
          emissiveIntensity={0.25}
          roughness={0.6}
        />
      </mesh>
      <mesh material={M.steelDark} position={[0, 0.2, 0]}>
        <boxGeometry args={[0.08, 0.4, 0.08]} />
      </mesh>
      <mesh material={M.steelDark} position={[0, 0.03, 0]}>
        <boxGeometry args={[0.44, 0.06, 0.3]} />
      </mesh>
    </group>
  )
}


