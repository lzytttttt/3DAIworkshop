/**
 * 讲座角：40 把折叠椅 + 可移动隔断（挂 86 寸大屏）+ 夜谈圆桌 + 角落椅堆。
 * 三种形态之间切换时，椅子、隔断、圆桌、椅堆都做插值过渡，
 * 让「同一空间换个形态」这件事在 3D 里看得见。
 */

import { useFrame } from '@react-three/fiber'
import { useMemo, useRef, type RefObject } from 'react'
import * as THREE from 'three'
import {
  buildHallScene,
  CHAIR_STACKS,
  CHAIR_TOTAL,
  type HallLayout,
  type Pose,
} from '../data/layouts'
import { FOLDING_GEO, M, RoundTable } from './Furniture'
import { C, slideTexture } from './palette'
import { merged } from './instancing'

/** 折叠椅堆：8 层嵌套的椅子 + 带轮推车，示意收起的 20 把 */
const STACK_GEO = merged([
  ...Array.from({ length: 8 }, (_, i) => [
    {
      size: [0.4, 0.03, 0.4] as [number, number, number],
      pos: [0, 0.22 + i * 0.1, i * 0.014] as [number, number, number],
      color: C.woodLight,
    },
    {
      size: [0.4, 0.32, 0.03] as [number, number, number],
      rot: [-0.14, 0, 0] as [number, number, number],
      pos: [0, 0.4 + i * 0.1, -0.17 + i * 0.014] as [number, number, number],
      color: C.woodLight,
    },
    {
      size: [0.38, 0.03, 0.03] as [number, number, number],
      pos: [0, 0.08 + i * 0.1, 0.16 + i * 0.014] as [number, number, number],
      color: C.steelDark,
    },
  ]).flat(),
  { size: [0.5, 0.06, 0.5], pos: [0, 0.06, 0], color: C.steelDark },
  { geo: new THREE.CylinderGeometry(0.045, 0.045, 0.03, 8), rot: [0, 0, Math.PI / 2], pos: [0.2, 0.03, 0.2], color: '#2c2c2c' },
  { geo: new THREE.CylinderGeometry(0.045, 0.045, 0.03, 8), rot: [0, 0, Math.PI / 2], pos: [-0.2, 0.03, 0.2], color: '#2c2c2c' },
  { geo: new THREE.CylinderGeometry(0.045, 0.045, 0.03, 8), rot: [0, 0, Math.PI / 2], pos: [0.2, 0.03, -0.2], color: '#2c2c2c' },
  { geo: new THREE.CylinderGeometry(0.045, 0.045, 0.03, 8), rot: [0, 0, Math.PI / 2], pos: [-0.2, 0.03, -0.2], color: '#2c2c2c' },
])

/** 可移动隔断：长边沿本地 Z，屏幕面朝本地 +X */
export function Partition({
  screenOn,
  groupRef,
}: {
  screenOn: boolean
  groupRef: RefObject<THREE.Group | null>
}) {
  const tex = slideTexture('lecture')
  const mat = useRef<THREE.MeshStandardMaterial>(null)
  useFrame((_, dt) => {
    if (!mat.current) return
    const k = 1 - Math.pow(0.004, dt)
    const target = screenOn ? 1.1 : 0
    mat.current.emissiveIntensity += (target - mat.current.emissiveIntensity) * k
  })
  return (
    <group ref={groupRef}>
      <mesh material={M.woodDark} position={[0, 1.22, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 2.44, 3.4]} />
      </mesh>
      <mesh material={M.wood} position={[0.06, 1.22, 0]}>
        <boxGeometry args={[0.03, 2.44, 3.4]} />
      </mesh>
      <mesh material={M.wallCap} position={[0, 2.48, 0]}>
        <boxGeometry args={[0.16, 0.08, 3.44]} />
      </mesh>
      {[-1.5, 1.5].map((lz) => (
        <mesh key={lz} material={M.steelDark} position={[0, 0.06, lz]}>
          <boxGeometry args={[0.4, 0.1, 0.14]} />
        </mesh>
      ))}
      <group position={[0.1, 1.42, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh material={M.charcoal}>
          <boxGeometry args={[2.1, 1.22, 0.06]} />
        </mesh>
        <mesh position={[0, 0, 0.036]}>
          <planeGeometry args={[2.02, 1.14]} />
          <meshStandardMaterial
            ref={mat}
            map={tex}
            emissiveMap={tex}
            emissive="#ffffff"
            emissiveIntensity={0}
            roughness={0.5}
          />
        </mesh>
      </group>
    </group>
  )
}

/** 角落椅堆 */
export function ChairStack({ x, z, ry }: { x: number; z: number; ry: number }) {
  return (
    <mesh geometry={STACK_GEO} material={M.vcol} position={[x, 0, z]} rotation={[0, ry, 0]} castShadow />
  )
}

/** 音响支架 */
function Speaker({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh material={M.steelDark} position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.9, 8]} />
      </mesh>
      <mesh material={M.steelDark} position={[0, 0.02, 0]}>
        <boxGeometry args={[0.3, 0.04, 0.3]} />
      </mesh>
      <mesh material={M.charcoal} position={[0, 1.02, 0]} castShadow>
        <boxGeometry args={[0.24, 0.34, 0.22]} />
      </mesh>
      <mesh material={M.steel} position={[0, 1.02, 0.12]}>
        <cylinderGeometry args={[0.06, 0.06, 0.02, 10]} />
      </mesh>
    </group>
  )
}

const lerp = (a: number, b: number, k: number) => a + (b - a) * k

function shortest(from: number, to: number) {
  let d = to - from
  while (d > Math.PI) d -= Math.PI * 2
  while (d < -Math.PI) d += Math.PI * 2
  return d
}

const _m = new THREE.Matrix4()
const _q = new THREE.Quaternion()
const _e = new THREE.Euler()
const _v = new THREE.Vector3()
const _s = new THREE.Vector3()

export function HallZone({ layout }: { layout: HallLayout }) {
  const scene = useMemo(() => buildHallScene(layout), [layout])
  const chairs = useRef<THREE.InstancedMesh>(null)
  const partition = useRef<THREE.Group>(null)
  const stack = useRef<THREE.Group>(null)
  const table = useRef<THREE.Group>(null)

  const targets = useMemo<(Pose & { s: number })[]>(() => {
    const stacks = Math.max(scene.stacks, 1)
    return scene.chairs.map((pose, i) => {
      if (pose.visible) return { ...pose, s: 1 }
      const at = CHAIR_STACKS[i % stacks]
      return { x: at.x, z: at.z, rotY: at.rotY, visible: false, s: 0.001 }
    })
  }, [scene])

  const cur = useRef(
    targets.map((t) => ({ x: t.x, z: t.z, rotY: t.rotY, s: 0.001 })),
  )

  useFrame((_, dt) => {
    const k = 1 - Math.pow(0.0016, Math.min(dt, 0.05))
    const mesh = chairs.current
    if (mesh) {
      for (let i = 0; i < CHAIR_TOTAL; i++) {
        const a = cur.current[i]
        const t = targets[i]
        a.x = lerp(a.x, t.x, k)
        a.z = lerp(a.z, t.z, k)
        a.s = lerp(a.s, t.s, k)
        a.rotY += shortest(a.rotY, t.rotY) * k
        _e.set(0, a.rotY, 0)
        _q.setFromEuler(_e)
        _s.setScalar(Math.max(a.s, 0.0001))
        _m.compose(_v.set(a.x, 0, a.z), _q, _s)
        mesh.setMatrixAt(i, _m)
      }
      mesh.instanceMatrix.needsUpdate = true
      mesh.computeBoundingSphere()
    }
    if (partition.current) {
      const p = partition.current
      p.position.x = lerp(p.position.x, scene.partition.x, k)
      p.position.z = lerp(p.position.z, scene.partition.z, k)
      p.rotation.y += shortest(p.rotation.y, scene.partition.rotY) * k
    }
    if (stack.current) {
      const target = scene.stacks > 0 ? 1 : 0.0001
      const s = lerp(stack.current.scale.x, target, k)
      stack.current.scale.setScalar(s)
    }
    if (table.current) {
      const target = scene.roundTableVisible ? 1 : 0.0001
      const s = lerp(table.current.scale.x, target, k)
      table.current.scale.setScalar(s)
    }
  })

  return (
    <group>
      <instancedMesh
        ref={chairs}
        args={[FOLDING_GEO, undefined, CHAIR_TOTAL]}
        castShadow
        receiveShadow
        frustumCulled={false}
      >
        <primitive object={M.vcol} attach="material" />
      </instancedMesh>
      <Partition screenOn={scene.screenOn} groupRef={partition} />
      <group ref={stack}>
        {CHAIR_STACKS.slice(0, Math.max(scene.stacks, 1)).map((at, i) => (
          <ChairStack key={i} x={at.x} z={at.z} ry={at.rotY} />
        ))}
      </group>
      <group ref={table} position={[10, 0, 4.7]}>
        <RoundTable x={0} z={0} r={0.82} />
      </group>
      <Speaker x={8.55} z={3.5} />
      <Speaker x={8.55} z={6.35} />
    </group>
  )
}
