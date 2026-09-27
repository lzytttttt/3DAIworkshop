/**
 * 3D 场景区：时段按钮 + 舞台（Canvas 与四角浮层）+ 讲座角形态切换 + 分区面板。
 * 舞台底色用 CSS 背景色承接时段（有 0.6s 过渡），Canvas 保持透明叠在上面。
 */

import { Button, Switch } from 'animal-island-ui'
import { BulbIcon, CoffeeIcon, FlowerIcon, MoonIcon, RefreshIcon, SunIcon } from 'naive-icons'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
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

/** naive-icons 无全屏图标，用内联 SVG 画四角括号（展开 / 收起两态） */
function FullScreenIcon({ active }: { active: boolean }) {
  const d = active
    ? 'M6 10H3V7M6 6V3H3M10 6V3h3v3M10 10h3V7'
    : 'M3 6h3V3M7 3h3v3M11 7v3h3M14 11h-3v3M7 14H4v-3'
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d={d} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

type FullscreenEl = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void
}
type FullscreenDoc = Document & {
  webkitExitFullscreen?: () => Promise<void> | void
  webkitFullscreenElement?: Element | null
}

export function SceneSection() {
  const { mode, layout, showOccupants, showLabels } = useSceneState()
  const { setMode, setLayout, toggleOccupants, toggleLabels, resetView } = useSceneActions()
  const current = TIME_MODE_BY_KEY[mode]

  const stageRef = useRef<HTMLDivElement | null>(null)
  const [fullscreen, setFullscreen] = useState(false)
  const [fullscreenSupported, setFullscreenSupported] = useState(true)

  // Esc 与浏览器全屏快捷键都会触发 fullscreenchange，据此回写按钮状态
  useEffect(() => {
    const sync = () => {
      const doc = document as FullscreenDoc
      const el = document.fullscreenElement ?? doc.webkitFullscreenElement ?? null
      setFullscreen(el === stageRef.current)
    }
    document.addEventListener('fullscreenchange', sync)
    document.addEventListener('webkitfullscreenchange', sync)
    setFullscreenSupported(
      typeof stageRef.current?.requestFullscreen === 'function' ||
        typeof (stageRef.current as FullscreenEl | null)?.webkitRequestFullscreen === 'function',
    )
    return () => {
      document.removeEventListener('fullscreenchange', sync)
      document.removeEventListener('webkitfullscreenchange', sync)
    }
  }, [])

  const toggleFullscreen = useCallback(() => {
    const el = stageRef.current as FullscreenEl | null
    if (!el) return
    const doc = document as FullscreenDoc
    if (document.fullscreenElement ?? doc.webkitFullscreenElement) {
      const exit = doc.exitFullscreen ?? doc.webkitExitFullscreen
      exit?.call(document)
    } else {
      const enter = el.requestFullscreen ?? el.webkitRequestFullscreen
      enter?.call(el)
    }
  }, [])

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
          <div className="stage" ref={stageRef} style={{ background: current.lights.skyColor }}>
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
              <Button
                size="small"
                type="default"
                icon={<FullScreenIcon active={fullscreen} />}
                onClick={toggleFullscreen}
                disabled={!fullscreenSupported}
                aria-label={fullscreen ? '退出全屏' : '全屏查看 3D 场景'}
              >
                {fullscreen ? '退出全屏' : '全屏'}
              </Button>
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
