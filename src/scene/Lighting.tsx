/**
 * 时段光照：一份 lights 配置驱动环境光、半球光、太阳与 9 盏吊灯。
 * 灯位与数量在四个时段之间保持恒定（只改强度），
 * 避免切换时段时重新编译着色器造成的卡顿。
 */

import { ROOM } from '../data/room'
import type { TimeMode } from '../data/timeModes'
import { PendantLamps } from './RoomShell'

export function Lighting({ mode }: { mode: TimeMode }) {
  const l = mode.lights
  return (
    <>
      <ambientLight intensity={l.ambient.intensity * 1.35} color={l.ambient.color} />
      <hemisphereLight
        intensity={l.hemi.intensity * 1.3}
        color={l.hemi.sky}
        groundColor={l.hemi.ground}
      />
      <directionalLight
        position={l.sun.position}
        intensity={l.sun.intensity * 1.15}
        color={l.sun.color}
        castShadow={l.sun.intensity > 0}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-9.5}
        shadow-camera-right={9.5}
        shadow-camera-top={9.5}
        shadow-camera-bottom={-9.5}
        shadow-camera-near={0.5}
        shadow-camera-far={40}
        shadow-bias={-0.0004}
        shadow-normalBias={0.022}
      />
      {/* 室内补光：靠近相机一侧的暖色低强度补光，避免南侧家具全黑 */}
      <pointLight
        position={[ROOM.width / 2 + 3.5, 3.4, ROOM.depth / 2 + 3]}
        intensity={l.sun.intensity > 0 ? 2.4 : 0.9}
        color="#ffe6c4"
        distance={16}
        decay={1.6}
      />
      <PendantLamps lights={l} />
    </>
  )
}
