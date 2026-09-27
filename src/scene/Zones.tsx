/**
 * 五个固定分区的家具布置（讲座角见 HallZone）。
 * 坐标全部为企划书平面坐标，由 WorkshopScene 统一套上 ROOM.offset 平移。
 * 分区地面色块承担悬停/点选，家具本身不额外处理事件。
 */

import type { ReactNode } from 'react'
import { ZONE_ANCHORS, type HallLayout } from '../data/layouts'
import { ROOM, ZONES, type Zone, type ZoneKey } from '../data/room'
import { Instanced, cyl, merged, type Pose } from './instancing'
import { C, slideTexture } from './palette'
import {
  ARMCHAIR_GEO,
  ART_GEO,
  BarCounter,
  BackCounter,
  Bookshelf,
  CHAIR_GEO,
  FRAME_GEO,
  Fridge,
  LAPTOP_GEO,
  LongTable,
  M,
  MUG_GEO,
  MenuBoard,
  PhoneBooth,
  Plant,
  QuietSign,
  RollingScreen,
  SIDE_TABLE_GEO,
  STOOL_GEO,
  Screen,
  SignPost,
  SinkCounter,
  StaffDesk,
  StorageRack,
  ToiletBlock,
  Whiteboard,
} from './Furniture'
import { HallZone } from './HallZone'

/** 分区地面色块：常驻淡底色，悬停/选中时加浓并描边 */
export function ZoneFloor({
  zone,
  hovered,
  selected,
  dim,
}: {
  zone: Zone
  hovered: boolean
  selected: boolean
  dim: boolean
}) {
  const w = zone.x[1] - zone.x[0] - 0.1
  const d = zone.z[1] - zone.z[0] - 0.1
  const cx = (zone.x[0] + zone.x[1]) / 2
  const cz = (zone.z[0] + zone.z[1]) / 2
  const on = hovered || selected
  const opacity = dim ? 0.05 : selected ? 0.3 : hovered ? 0.2 : 0.12
  const border: { s: [number, number, number]; p: [number, number, number] }[] = [
    { s: [w, 0.02, 0.04], p: [0, 0, -d / 2] },
    { s: [w, 0.02, 0.04], p: [0, 0, d / 2] },
    { s: [0.04, 0.02, d], p: [-w / 2, 0, 0] },
    { s: [0.04, 0.02, d], p: [w / 2, 0, 0] },
  ]
  return (
    <group position={[cx, 0.012, cz]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w, d]} />
        <meshBasicMaterial color={zone.hex} transparent opacity={opacity} depthWrite={false} />
      </mesh>
      {on &&
        border.map((b, i) => (
          <mesh key={i} position={b.p}>
            <boxGeometry args={b.s} />
            <meshBasicMaterial color={zone.hex} transparent opacity={0.85} depthWrite={false} />
          </mesh>
        ))}
    </group>
  )
}

const TABLE_CHAIRS: Pose[] = [4.2, 5.2, 6.4, 7.4].flatMap((x, ci) =>
  [1.5, 2.35, 3.2, 4.05].map((z) => ({
    p: [x, 0, z] as [number, number, number],
    ry: ci % 2 ? -Math.PI / 2 : Math.PI / 2,
  })),
)

const LAPTOPS: Pose[] = [
  { p: [4.62, 0.78, 1.62], ry: -Math.PI / 2 },
  { p: [4.84, 0.78, 2.5], ry: Math.PI / 2 },
  { p: [4.62, 0.78, 3.36], ry: -Math.PI / 2 },
  { p: [4.84, 0.78, 4.05], ry: Math.PI / 2 },
  { p: [6.62, 0.78, 1.62], ry: -Math.PI / 2 },
  { p: [6.82, 0.78, 2.5], ry: Math.PI / 2 },
  { p: [6.62, 0.78, 3.36], ry: -Math.PI / 2 },
  { p: [6.82, 0.78, 4.05], ry: Math.PI / 2 },
]

const MUGS: Pose[] = [
  { p: [4.5, 0.78, 1.95] },
  { p: [4.95, 0.78, 3.1] },
  { p: [4.45, 0.78, 4.3] },
  { p: [6.5, 0.78, 2.2] },
  { p: [7.1, 0.78, 3.8] },
  { p: [6.45, 0.78, 4.35] },
]

const BAR_STOOLS: Pose[] = ZONE_ANCHORS.bar.map(([x, z]) => ({ p: [x, 0, z], ry: Math.PI }))

const ART_COLORS = ['#e59266', '#82d5bb', '#889df0', '#f7cd67', '#c4694a', '#2e6b5e', '#9a835a', '#d8b892']

const FRAMES: Pose[] = []
const ARTS: Pose[] = []
for (let i = 0; i < 10; i++) {
  const z = 4.45 + i * 0.4
  for (const y of [1.24, 1.98]) {
    FRAMES.push({ p: [0.07, y, z], ry: Math.PI / 2 })
    ARTS.push({ p: [0.1, y, z], ry: Math.PI / 2 })
  }
}

/** 轨道射灯：灯体 + 暖色灯面 */
const TRACK_GEO = merged([
  { geo: cyl(0.045, 0.055, 0.14, 10), rot: [0, 0, -0.9], pos: [0, -0.08, 0], color: C.charcoal },
  { geo: cyl(0.05, 0.05, 0.014, 10), rot: [0, 0, -0.9], pos: [-0.055, -0.14, 0], color: '#ffe6b8' },
])

const TRACKS: Pose[] = Array.from({ length: 12 }, (_, i) => ({ p: [0.44, 2.72, 4.45 + i * 0.33] }))

/**
 * 静音专注区：三排软座工位（每座配一块侧前小桌板）+ 隔断屏风 + 2 个电话亭 + 书架。
 * 布点原则——高构件（书架 / 电话亭）全部贴北墙，离东南机位最远；东侧留纵向主通道；
 * 西、南两侧留环形通道。净距与通行经脚本核验：全部在界内、无穿模、各工位可达。
 */
const QUIET_COL_X = [9.35, 10.2, 11.05]
const QUIET_ROW_Z = [1.2, 1.98, 2.76]

const QUIET_CHAIRS: Pose[] = [
  ...QUIET_ROW_Z.flatMap((z) =>
    QUIET_COL_X.map((x) => ({ p: [x, 0, z] as [number, number, number] })),
  ),
  { p: [8.45, 0, 2.68], ry: -Math.PI / 2 },
]

/** 小桌板：前两排在座位正前方，末排与次排背靠背（避免越南界）；末位是西南角单人位的桌板 */
const QUIET_TABLES: Pose[] = [
  ...QUIET_COL_X.flatMap((x) => [
    { p: [x, 0, QUIET_ROW_Z[0] + 0.45] as [number, number, number] },
    { p: [x, 0, QUIET_ROW_Z[1] + 0.45] as [number, number, number] },
    { p: [x, 0, QUIET_ROW_Z[2] - 0.45] as [number, number, number] },
  ]),
  { p: [8.45, 0, 2.28] as [number, number, number] },
]

/** 静音专注区 */
function QuietZone() {
  return (
    <>
      <Bookshelf x={8.85} z={0.2} width={1.5} />
      <PhoneBooth x={10.6} z={0.42} />
      <PhoneBooth x={11.52} z={0.42} />
      <QuietSign x={11.9} z={1.9} ry={Math.PI / 2} />
      <Instanced geometry={ARMCHAIR_GEO} poses={QUIET_CHAIRS} castShadow receiveShadow>
        <primitive object={M.vcolSoft} attach="material" />
      </Instanced>
      <Instanced geometry={SIDE_TABLE_GEO} poses={QUIET_TABLES} castShadow receiveShadow>
        <primitive object={M.vcol} attach="material" />
      </Instanced>
      {/* 屏风放在西、东两侧空档（列间仅 17cm，放不下） */}
      <Screen x={8.6} z={1.55} len={0.9} />
      <Screen x={11.7} z={1.55} len={0.9} />
      <Plant x={8.35} z={0.75} scale={0.8} />
      <Plant x={11.7} z={2.85} scale={0.8} />
    </>
  )
}

/** 共创长桌区 */
function TableZone() {
  return (
    <>
      <LongTable x={4.7} z={2.78} />
      <LongTable x={6.9} z={2.78} />
      <Instanced geometry={CHAIR_GEO} poses={TABLE_CHAIRS} castShadow receiveShadow>
        <primitive object={M.vcolSoft} attach="material" />
      </Instanced>
      <Instanced geometry={LAPTOP_GEO} poses={LAPTOPS}>
        <primitive object={M.vcol} attach="material" />
      </Instanced>
      <Instanced geometry={MUG_GEO} poses={MUGS}>
        <primitive object={M.mug} attach="material" />
      </Instanced>
      <Whiteboard x={4.0} z={0.62} />
      <Whiteboard x={7.6} z={0.66} />
      <RollingScreen x={7.74} z={4.72} ry={-Math.PI / 2} />
      <Plant x={3.35} z={0.62} scale={0.95} />
      <Plant x={7.78} z={1.1} scale={0.85} />
      <Plant x={3.4} z={4.8} scale={1.1} />
    </>
  )
}

/** 吧台与点单区 */
function BarZone() {
  return (
    <>
      <BarCounter />
      <BackCounter />
      <MenuBoard />
      <Instanced geometry={STOOL_GEO} poses={BAR_STOOLS} castShadow receiveShadow>
        <primitive object={M.vcol} attach="material" />
      </Instanced>
      <Plant x={2.72} z={3.75} scale={1.05} />
      <Plant x={0.78} z={3.95} scale={0.9} />
    </>
  )
}

/** 展墙与主通道 */
function CorridorZone() {
  const info = slideTexture('info')
  return (
    <>
      <mesh material={M.steelDark} position={[0.44, 2.79, 6.25]}>
        <boxGeometry args={[0.07, 0.05, 3.9]} />
      </mesh>
      <Instanced geometry={FRAME_GEO} poses={FRAMES}>
        <primitive object={M.vcol} attach="material" />
      </Instanced>
      <Instanced geometry={ART_GEO} poses={ARTS} colors={ART_COLORS}>
        <primitive object={M.vcol} attach="material" />
      </Instanced>
      <Instanced geometry={TRACK_GEO} poses={TRACKS}>
        <primitive object={M.vcol} attach="material" />
      </Instanced>
      <group position={[2.55, 0, 4.62]} rotation={[0.06, 0, 0]}>
        <mesh material={M.charcoal} position={[0, 1.45, 0]} castShadow>
          <boxGeometry args={[0.62, 1.06, 0.06]} />
        </mesh>
        <mesh position={[0, 1.45, 0.036]}>
          <planeGeometry args={[0.56, 1.0]} />
          <meshStandardMaterial
            map={info}
            emissiveMap={info}
            emissive="#ffffff"
            emissiveIntensity={0.75}
            roughness={0.5}
          />
        </mesh>
        <mesh material={M.steelDark} position={[0, 0.45, 0]}>
          <boxGeometry args={[0.08, 0.9, 0.08]} />
        </mesh>
        <mesh material={M.steelDark} position={[0, 0.03, 0]}>
          <boxGeometry args={[0.5, 0.06, 0.34]} />
        </mesh>
      </group>
      <SignPost x={2.8} z={7.9} ry={-0.45} />
      <Plant x={2.78} z={6.5} scale={0.95} />
      <Plant x={2.82} z={4.38} scale={0.8} />
    </>
  )
}

/**
 * 后勤区：隔断、储物、卫生间、员工位。
 * 布点原则——高体块（卫生间）贴南侧并背对东南机位，湿区设备（洗涤槽 / 冷柜）贴北缘，
 * 西缘 x≈3（隔断以北）留出入通道。
 */
function BackZone() {
  return (
    <>
      <mesh material={M.wall} position={[3.08, 1.15, 7.215]} castShadow receiveShadow>
        <boxGeometry args={[0.12, 2.3, 2.23]} />
      </mesh>
      <mesh material={M.wallCap} position={[3.08, 2.34, 7.215]}>
        <boxGeometry args={[0.18, 0.08, 2.29]} />
      </mesh>
      <StorageRack x={4.3} z={5.42} ry={0} />
      <StorageRack x={4.3} z={5.86} ry={0} />
      <ToiletBlock x={4.3} z={7.6} />
      <SinkCounter x={6.0} z={5.53} />
      <Fridge x={7.6} z={5.9} ry={-Math.PI / 2} />
      <StaffDesk x={6.5} z={7.1} ry={Math.PI} />
      <Instanced geometry={CHAIR_GEO} poses={[{ p: [6.5, 0, 6.4] }]} castShadow>
        <primitive object={M.vcolSoft} attach="material" />
      </Instanced>
    </>
  )
}

function furnitureFor(key: ZoneKey, layout: HallLayout): ReactNode {
  switch (key) {
    case 'bar':
      return <BarZone />
    case 'table':
      return <TableZone />
    case 'quiet':
      return <QuietZone />
    case 'corr':
      return <CorridorZone />
    case 'back':
      return <BackZone />
    case 'hall':
      return <HallZone layout={layout} />
  }
}

/** 六个分区：地面色块负责悬停/点选，家具挂在同一组里 */
export function Zones({
  layout,
  selected,
  hovered,
  onSelect,
  onHover,
}: {
  layout: HallLayout
  selected: ZoneKey | null
  hovered: ZoneKey | null
  onSelect: (zone: ZoneKey | null) => void
  onHover: (zone: ZoneKey | null) => void
}) {
  return (
    <group position={[...ROOM.offset]}>
      {ZONES.map((zone) => (
        <group
          key={zone.key}
          onClick={(e) => {
            e.stopPropagation()
            onSelect(zone.key)
          }}
          onPointerOver={(e) => {
            e.stopPropagation()
            onHover(zone.key)
          }}
          onPointerOut={() => onHover(null)}
        >
          <ZoneFloor
            zone={zone}
            hovered={hovered === zone.key}
            selected={selected === zone.key}
            dim={selected !== null && selected !== zone.key}
          />
          {furnitureFor(zone.key, layout)}
        </group>
      ))}
    </group>
  )
}
