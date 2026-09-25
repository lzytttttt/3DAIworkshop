/**
 * 分区标签：用 drei 的 Html 在场景上方挂 DOM 药丸标签（样式见 global.css 的 .zone-tag-3d）。
 * 标签只作信息展示、不吃指针事件，点选仍由 3D 里的分区地面负责。
 */

import { Html } from '@react-three/drei'
import { LAYOUT_LABELS } from '../data/layouts'
import { ZONES, zoneWorldCenter } from '../data/room'
import { TIME_MODE_BY_KEY } from '../data/timeModes'
import { useSceneState } from '../store/sceneStore'

export function ZoneLabels() {
  const { mode, layout, selectedZone } = useSceneState()
  const occupancy = TIME_MODE_BY_KEY[mode].occupancy
  return (
    <>
      {ZONES.map((zone) => {
        const [wx, , wz] = zoneWorldCenter(zone.key)
        const dim = selectedZone !== null && selectedZone !== zone.key
        const n = occupancy[zone.key]
        return (
          <Html
            key={zone.key}
            position={[wx, 2.2, wz]}
            distanceFactor={10.5}
            zIndexRange={[24, 0]}
            pointerEvents="none"
          >
            <div className="zone-tag-3d" style={{ opacity: dim ? 0.4 : 1 }}>
              {zone.name} · {zone.area}㎡ · {n > 0 ? `${n} 人` : '空置'}
              {zone.key === 'hall' ? ` · ${LAYOUT_LABELS[layout]}` : ''}
            </div>
          </Html>
        )
      })}
      <Html position={[-4.15, 1.5, 3.95]} distanceFactor={10.5} zIndexRange={[24, 0]} pointerEvents="none">
        <div className="zone-tag-3d" style={{ background: 'rgba(31,76,66,0.86)' }}>
          ↑ 主入口
        </div>
      </Html>
    </>
  )
}
