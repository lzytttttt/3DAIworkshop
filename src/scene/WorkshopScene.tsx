/**
 * 3D 舞台装配：Canvas + 光照 + 房间外壳 + 分区 + 人流 + 标签 + 机位。
 * 场景底色不给 WebGL，而是留给 .stage 的 CSS 背景（随时段过渡），画布保持透明。
 */

import { Canvas } from '@react-three/fiber'
import { DEFAULT_VIEW } from '../data/room'
import { TIME_MODE_BY_KEY } from '../data/timeModes'
import { useSceneActions, useSceneState } from '../store/sceneStore'
import { CameraRig } from './CameraRig'
import { Lighting } from './Lighting'
import { Occupants } from './Occupants'
import { RoomShell } from './RoomShell'
import { ZoneLabels } from './ZoneLabels'
import { Zones } from './Zones'

export function WorkshopScene() {
  const { mode, layout, selectedZone, hoveredZone, showOccupants, showLabels } = useSceneState()
  const { selectZone, hoverZone } = useSceneActions()
  const current = TIME_MODE_BY_KEY[mode]

  return (
    <Canvas
      shadows="percentage"
      dpr={[1, 1.8]}
      gl={{ antialias: true, powerPreference: 'high-performance', toneMappingExposure: 1.16 }}
      camera={{ position: [...DEFAULT_VIEW.position], fov: 42, near: 0.1, far: 90 }}
      onPointerMissed={() => selectZone(null)}
    >
      <Lighting mode={current} />
      <RoomShell glow={current.lights.campusGlow} />
      <Zones
        layout={layout}
        selected={selectedZone}
        hovered={hoveredZone}
        onSelect={selectZone}
        onHover={hoverZone}
      />
      {showOccupants && <Occupants mode={current} layout={layout} />}
      {showLabels && <ZoneLabels />}
      <CameraRig />
    </Canvas>
  )
}
