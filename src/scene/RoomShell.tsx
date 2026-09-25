/**
 * 房间外壳：地板、墙、北向玻璃幕墙、天花梁、主入口与窗外校园。
 * 视图是「娃娃屋」剖切：南墙与东墙只砌到 0.8 m，西墙与北墙做满高，
 * 于是从东南上方俯视时能看进屋内，同时保有围合感。
 */

import { towerGlowTexture, towerTexture, woodFloorTexture } from './palette'
import { M } from './Furniture'
import { ROOM } from '../data/room'
import type { LightConfig } from '../data/timeModes'

const WALL_H = ROOM.height
const CUT_H = 0.8
const T = 0.14

/** 墙体 + 深棕压顶（压顶是企划书插画里最醒目的轮廓线） */
function Wall({
  w,
  h,
  d,
  x,
  z,
  cap = true,
}: {
  w: number
  h: number
  d: number
  x: number
  z: number
  cap?: boolean
}) {
  return (
    <group position={[x, 0, z]}>
      <mesh material={M.wall} position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
      </mesh>
      {cap && (
        <mesh material={M.wallCap} position={[0, h + 0.045, 0]}>
          <boxGeometry args={[w + 0.06, 0.09, d + 0.06]} />
        </mesh>
      )}
    </group>
  )
}

/** 北向落地窗：8 米玻璃 + 竖梃 + 上下横档 */
function GlassWall() {
  const posts = [0.12, 1.72, 3.32, 4.92, 6.52, 7.94]
  return (
    <group>
      <mesh position={[4, 1.55, -0.07]}>
        <planeGeometry args={[8, 2.94]} />
        <primitive object={M.glass} attach="material" />
      </mesh>
      {posts.map((px) => (
        <mesh key={px} material={M.wallCap} position={[px, 1.55, -0.07]}>
          <boxGeometry args={[0.09, 3.1, 0.16]} />
        </mesh>
      ))}
      {[0.06, 3.02].map((py) => (
        <mesh key={py} material={M.wallCap} position={[4, py, -0.07]}>
          <boxGeometry args={[8.1, 0.12, 0.16]} />
        </mesh>
      ))}
    </group>
  )
}

/** 主入口：门套 + 双开玻璃门 + 门垫（南墙留 1.4 m 洞口） */
function Entrance() {
  return (
    <group>
      {[1.1, 2.5].map((px) => (
        <mesh key={px} material={M.wallCap} position={[px, 1.05, 8.4]} castShadow>
          <boxGeometry args={[0.16, 2.1, 0.22]} />
        </mesh>
      ))}
      <mesh material={M.wallCap} position={[1.8, 2.14, 8.4]} castShadow>
        <boxGeometry args={[1.56, 0.14, 0.22]} />
      </mesh>
      {[
        { px: 1.15, off: 0.32, rot: 0.45 },
        { px: 2.45, off: -0.32, rot: -0.45 },
      ].map((d) => (
        <group key={d.px} position={[d.px, 0, 8.38]} rotation={[0, d.rot, 0]}>
          <mesh position={[d.off, 1.0, 0]}>
            <boxGeometry args={[0.62, 1.94, 0.04]} />
            <primitive object={M.glass} attach="material" />
          </mesh>
          <mesh material={M.woodDark} position={[d.off, 1.95, 0]}>
            <boxGeometry args={[0.66, 0.08, 0.05]} />
          </mesh>
          <mesh material={M.woodDark} position={[d.off, 0.06, 0]}>
            <boxGeometry args={[0.66, 0.1, 0.05]} />
          </mesh>
        </group>
      ))}
      <mesh material={M.concrete} position={[1.8, 0.012, 8.02]}>
        <boxGeometry args={[1.5, 0.03, 0.66]} />
      </mesh>
    </group>
  )
}

/** 窗外校园：地面、几栋楼与行道树，亮灯强度由时段决定 */
function Campus({ glow }: { glow: number }) {
  const tex = towerTexture()
  const glowTex = towerGlowTexture()
  const buildings: { s: [number, number, number]; p: [number, number, number] }[] = [
    { s: [6, 4.4, 4], p: [-3.4, 2.2, -8.6] },
    { s: [3.2, 8.4, 3], p: [-0.6, 4.2, -12.4] },
    { s: [4.4, 6.2, 3.4], p: [4.2, 3.1, -13.2] },
    { s: [2.6, 10.2, 2.6], p: [9.2, 5.1, -15] },
    { s: [5.2, 4.6, 3.2], p: [12.6, 2.3, -10.6] },
    { s: [3.6, 3.2, 3], p: [-8.2, 1.6, -9.8] },
  ]
  return (
    <group>
      <mesh position={[2, -0.05, -11]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[52, 32]} />
        <meshStandardMaterial color="#9aa189" roughness={1} />
      </mesh>
      <mesh position={[4, -0.02, -1.7]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[28, 3.6]} />
        <meshStandardMaterial color="#cbc6b2" roughness={0.95} />
      </mesh>
      {buildings.map((b, i) => (
        <mesh key={i} position={b.p} castShadow>
          <boxGeometry args={b.s} />
          <meshStandardMaterial
            map={tex}
            emissiveMap={glowTex}
            emissive="#ffe0a8"
            emissiveIntensity={glow * 1.4}
            roughness={0.9}
          />
        </mesh>
      ))}
      {[
        [-4.6, -3.4],
        [-1.4, -3.9],
        [5.6, -3.6],
        [9.4, -4.2],
        [12.6, -3.4],
        [-7.6, -4.4],
      ].map(([tx, tz], i) => (
        <group key={i} position={[tx, 0, tz]}>
          <mesh material={M.woodDark} position={[0, 0.5, 0]} castShadow>
            <cylinderGeometry args={[0.09, 0.13, 1, 8]} />
          </mesh>
          <mesh position={[0, 1.35, 0]} castShadow>
            <sphereGeometry args={[0.6, 10, 8]} />
            <meshStandardMaterial color={i % 2 ? '#4d7a52' : '#568055'} roughness={0.95} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export function RoomShell({ glow }: { glow: number }) {
  return (
    <group position={[...ROOM.offset]}>
      {/* 地台与地板 */}
      <mesh material={M.concrete} position={[6, -0.17, 4.165]} receiveShadow>
        <boxGeometry args={[ROOM.width + 0.6, 0.34, ROOM.depth + 0.6]} />
      </mesh>
      <mesh position={[6, 0.002, 4.165]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM.width + 0.3, ROOM.depth + 0.3]} />
        <meshStandardMaterial map={woodFloorTexture()} roughness={0.62} />
      </mesh>
      {/* 西墙 + 北墙实体段（满高） */}
      <Wall w={T} h={WALL_H} d={ROOM.depth + 0.28} x={-T / 2} z={ROOM.depth / 2} />
      <Wall w={4.28} h={WALL_H} d={T} x={10.07} z={-T / 2} />
      <GlassWall />
      {/* 南墙、东墙剖切到 0.8 m */}
      <Wall w={1.1} h={CUT_H} d={T} x={0.55} z={ROOM.depth + T / 2} />
      <Wall w={9.64} h={CUT_H} d={T} x={7.18} z={ROOM.depth + T / 2} />
      <Wall w={T} h={CUT_H} d={ROOM.depth + 0.28} x={ROOM.width + T / 2} z={ROOM.depth / 2} />
      <Entrance />
      {/* 踢脚 */}
      <mesh material={M.base} position={[0.035, 0.05, ROOM.depth / 2]}>
        <boxGeometry args={[0.06, 0.1, ROOM.depth]} />
      </mesh>
      <mesh material={M.base} position={[10, 0.05, 0.035]}>
        <boxGeometry args={[4, 0.1, 0.06]} />
      </mesh>
      {/* 天花梁 */}
      {[2, 6, 10].map((bx) => (
        <group key={bx}>
          <mesh material={M.paper} position={[bx, 3.04, ROOM.depth / 2]} castShadow>
            <boxGeometry args={[0.18, 0.2, ROOM.depth + 0.2]} />
          </mesh>
        </group>
      ))}
      <Campus glow={glow} />
    </group>
  )
}

/** 9 盏吊灯沿中线自北向南排布，开启数量与亮度由时段决定 */
export function PendantLamps({ lights }: { lights: LightConfig }) {
  return (
    <group position={[...ROOM.offset]}>
      {Array.from({ length: 9 }, (_, i) => {
        const lit = i < lights.pendantsOn
        return (
          <group key={i} position={[6, 0, 0.8 + i * 0.85]}>
            <mesh material={M.steelDark} position={[0, 2.75, 0]}>
              <cylinderGeometry args={[0.009, 0.009, 0.62, 6]} />
            </mesh>
            <mesh material={M.paper} position={[0, 2.32, 0]} castShadow>
              <coneGeometry args={[0.2, 0.26, 16, 1, true]} />
            </mesh>
            <mesh position={[0, 2.21, 0]}>
              <sphereGeometry args={[0.06, 10, 8]} />
              <meshStandardMaterial
                color="#fff6e2"
                emissive={lights.pendant.color}
                emissiveIntensity={lit ? 1.8 : 0.04}
                roughness={0.4}
              />
            </mesh>
            <pointLight
              color={lights.pendant.color}
              intensity={lit ? lights.pendant.intensity * 0.5 : 0}
              distance={7.5}
              decay={2}
              position={[0, 2.14, 0]}
            />
          </group>
        )
      })}
    </group>
  )
}
