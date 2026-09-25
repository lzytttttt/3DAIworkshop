/**
 * 人流：按当前时段的 occupancy 在各分区锚点摆人。
 * 人形是三个实例化网格（裤 / 躯干 / 头），共用同一套位姿，
 * 颜色逐实例给出，因此几十个人也只有 3 个 draw call。
 */

import { useMemo } from 'react'
import * as THREE from 'three'
import { buildHallScene, ZONE_ANCHORS, type HallLayout } from '../data/layouts'
import { ROOM, ZONES } from '../data/room'
import type { TimeMode } from '../data/timeModes'
import { Instanced, cyl, merged, type Pose } from './instancing'
import { M } from './Furniture'
import { C } from './palette'

const LEGS_GEO = merged([{ size: [0.3, 0.8, 0.24], pos: [0, 0.4, 0], color: '#ffffff' }])
const TORSO_GEO = merged([{ geo: cyl(0.155, 0.185, 0.64, 10), pos: [0, 1.03, 0], color: '#ffffff' }])
const HEAD_GEO = merged([
  { geo: new THREE.SphereGeometry(0.12, 12, 10), pos: [0, 1.48, 0], color: '#ffffff' },
])

const SHIRTS = [C.teal, '#e59266', '#889df0', '#f7cd67', '#c4694a', '#82d5bb', '#9a835a', '#4a6fa5']
const PANTS = ['#3b4a5a', '#4a3b32', '#5a5560', '#2f3b46']
const SKIN = ['#e8c9a8', '#dcb391', '#c99b76', '#f0d5b6']

interface Person {
  x: number
  z: number
  ry: number
  seated: boolean
  seed: number
}

function buildPeople(mode: TimeMode, layout: HallLayout): Person[] {
  const out: Person[] = []
  const hall = buildHallScene(layout)
  for (const zone of ZONES) {
    const count = mode.occupancy[zone.key]
    if (count <= 0) continue
    if (zone.key === 'hall') {
      hall.chairs
        .filter((c) => c.visible)
        .slice(0, count)
        .forEach((c, i) => out.push({ x: c.x, z: c.z, ry: c.rotY, seated: true, seed: i + 3 }))
      continue
    }
    ZONE_ANCHORS[zone.key].slice(0, count).forEach(([x, z], i) => {
      let ry = 0
      if (zone.key === 'table') ry = Math.atan2((x < 5.7 ? 4.7 : 6.9) - x, 0)
      if (zone.key === 'bar') ry = Math.PI
      if (zone.key === 'corr') ry = -Math.PI / 2 + (i % 2 ? 0.45 : -0.3)
      if (zone.key === 'back') ry = Math.PI * (i % 2 ? 0.9 : 0.1)
      out.push({ x, z, ry, seated: zone.key !== 'corr', seed: i * 5 + zone.name.length })
    })
  }
  return out
}

export function Occupants({ mode, layout }: { mode: TimeMode; layout: HallLayout }) {
  const data = useMemo(() => {
    const people = buildPeople(mode, layout)
    const all: Pose[] = []
    const standing: Pose[] = []
    const bodyColors: string[] = []
    const headColors: string[] = []
    const legColors: string[] = []
    people.forEach((p) => {
      const scale: [number, number, number] = p.seated ? [0.96, 0.78, 0.96] : [1, 1, 1]
      all.push({ p: [p.x, 0, p.z], ry: p.ry, s: scale })
      if (!p.seated) standing.push({ p: [p.x, 0, p.z], ry: p.ry })
      bodyColors.push(SHIRTS[p.seed % SHIRTS.length])
      headColors.push(SKIN[p.seed % SKIN.length])
      legColors.push(PANTS[p.seed % PANTS.length])
    })
    return { all, standing, bodyColors, headColors, legColors }
  }, [mode, layout])

  return (
    <group position={[...ROOM.offset]}>
      <Instanced geometry={TORSO_GEO} poses={data.all} colors={data.bodyColors} castShadow>
        <primitive object={M.vcol} attach="material" />
      </Instanced>
      <Instanced geometry={HEAD_GEO} poses={data.all} colors={data.headColors} castShadow>
        <primitive object={M.vcol} attach="material" />
      </Instanced>
      <Instanced geometry={LEGS_GEO} poses={data.standing} colors={data.legColors} castShadow>
        <primitive object={M.vcol} attach="material" />
      </Instanced>
    </group>
  )
}
