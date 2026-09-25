/**
 * 3D 场景区：时段按钮 + 舞台（Canvas 与四角浮层）+ 讲座角形态切换 + 分区面板。
 * 舞台底色用 CSS 背景色承接时段（有 0.6s 过渡），Canvas 保持透明叠在上面。
 */

import { Button, Switch } from 'animal-island-ui'
import { BulbIcon, CoffeeIcon, FlowerIcon, MoonIcon, RefreshIcon, SunIcon } from 'naive-icons'
import type { ReactNode } from 'react'
import { HALL_LAYOUTS, SECTIONS } from '../data/content'
import { LAYOUT_HINTS, LAYOUT_LABELS, type HallLayout } from '../data/layouts'
import { ZONES } from '../data/room'
import { TIME_MODES, TIME_MODE_BY_KEY, type TimeModeKey } from '../data/timeModes'
import { WorkshopScene } from '../scene/WorkshopScene'
import { useSceneActions, useSceneState } from '../store/sceneStore'
import { SectionHead } from './Layout'
import { ZonePanel } from './ZonePanel'

const MODE_ICON: Record<TimeModeKey, ReactNode> = {
  morning: <SunIcon size={16} />,
  cocreate: <CoffeeIcon size={16} />,
  class: <BulbIcon size={16} />,
  night: <MoonIcon size={16} />,
}

export function SceneSection() {
  const { mode, layout, showOccupants, showLabels } = useSceneState()
  const { setMode, setLayout, toggleOccupants, toggleLabels, resetView } = useSceneActions()
  const current = TIME_MODE_BY_KEY[mode]

  return (
    <section className="section wrap" id="scene">
      <SectionHead {...SECTIONS.scene} />

      <div className="mode-bar">
        {TIME_MODES.map((t) => (
          <Button
            key={t.key}
            type={t.key === mode ? 'primary' : 'default'}
            icon={MODE_ICON[t.key]}
            onClick={() => setMode(t.key)}
          >
            {t.range.slice(0, 5)} {t.name}
          </Button>
        ))}
        <span className="mode-note">
          {current.title} · {current.lights.note}
        </span>
      </div>

      <div className="scene-layout">
        <div>
          <div className="stage" style={{ background: current.lights.skyColor }}>
            <WorkshopScene />

            <div className="stage-overlay stage-tl" aria-hidden="true">
              {ZONES.map((z) => (
                <span
                  key={z.key}
                  className="stage-hint"
                  style={{ pointerEvents: 'none', display: 'inline-flex', alignItems: 'center', gap: 5 }}
                >
                  <i
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 3,
                      background: z.hex,
                      display: 'inline-block',
                    }}
                  />
                  {z.name.replace(/（.*）/, '')}
                </span>
              ))}
            </div>

            <div className="stage-overlay stage-tr">
              <Switch
                size="small"
                checked={showOccupants}
                onChange={toggleOccupants}
                checkedChildren="显示人流"
                unCheckedChildren="隐藏人流"
                aria-label="显示人流"
              />
              <Switch
                size="small"
                checked={showLabels}
                onChange={toggleLabels}
                checkedChildren="显示标签"
                unCheckedChildren="隐藏标签"
                aria-label="显示分区标签"
              />
              <Button size="small" type="default" icon={<RefreshIcon size={14} />} onClick={resetView}>
                复位
              </Button>
            </div>

            <div className="stage-overlay stage-bl">
              <div className="mode-caption">
                <h4>
                  {current.range} ｜ {current.name} · {current.title}
                </h4>
                <p>{current.desc}</p>
              </div>
            </div>

            <div className="stage-overlay stage-br">
              <span className="stage-hint">拖拽旋转 · 滚轮缩放 · 点按地面色块看分区</span>
            </div>
          </div>

          <div className="layout-bar">
            <FlowerIcon size={18} color="#8a7767" />
            <span className="stat-label" style={{ marginRight: 2 }}>
              讲座角形态
            </span>
            {HALL_LAYOUTS.map((k) => (
              <Button
                key={k}
                size="small"
                type={k === layout ? 'primary' : 'dashed'}
                onClick={() => setLayout(k as HallLayout)}
              >
                {LAYOUT_LABELS[k]}
              </Button>
            ))}
            <span className="layout-hint">{LAYOUT_HINTS[layout]}</span>
          </div>
        </div>

        <ZonePanel />
      </div>
    </section>
  )
}
