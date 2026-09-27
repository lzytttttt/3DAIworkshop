/**
 * 一天四张脸：同一空间在四个时段服务完全不同的人。
 * 客流曲线由课程表决定，因此灯光、人群、家具形态都按时段切换。
 * 文案与营收占比取自企划书 03-space.html 表 3-1 / 3.2 节。
 */

import type { HallLayout } from './layouts'
import type { IslandColor, ZoneKey } from './room'

export type TimeModeKey = 'morning' | 'cocreate' | 'class' | 'night'

export interface LightConfig {
  ambient: { intensity: number; color: string }
  hemi: { intensity: number; sky: string; ground: string }
  /** 透过北向落地窗的日光；intensity 为 0 表示关闭 */
  sun: { intensity: number; color: string; position: [number, number, number] }
  /** 9 盏吊灯中开启的数量（自北向南依次点亮） */
  pendantsOn: number
  pendant: { intensity: number; color: string }
  /** 窗外校园楼亮灯强度 0–1 */
  campusGlow: number
  /** 3D 舞台的底色 */
  skyColor: string
  /** 半场灯等说明 */
  note: string
}

export interface TimeMode {
  key: TimeModeKey
  /** 时段名 */
  name: string
  range: string
  /** 一天四张脸的小标题 */
  title: string
  desc: string
  revenuePct: number
  /** 该时段讲座角的强制形态 */
  layout: HallLayout
  /** 卡片与标签配色（animal-island-ui 色板） */
  color: IslandColor
  /** 各分区人数 */
  occupancy: Record<ZoneKey, number>
  lights: LightConfig
}

export const TIME_MODES: TimeMode[] = [
  {
    key: 'morning',
    color: 'app-yellow',
    name: '安静期',
    range: '08:30 – 10:30',
    title: '自习与早咖啡',
    desc: '客流少、停留长、噪音最低。主力是备考与写论文的学生。此阶段只开半场灯与静音区，员工利用空档做备料与设备巡检。',
    revenuePct: 10,
    layout: 'merged',
    occupancy: { bar: 1, table: 2, quiet: 3, corr: 0, back: 1, hall: 0 },
    lights: {
      ambient: { intensity: 0.5, color: '#FFF3E0' },
      hemi: { intensity: 0.56, sky: '#FFF6E5', ground: '#6B4A32' },
      sun: { intensity: 1.05, color: '#FFE9C7', position: [8, 6, -6] },
      pendantsOn: 3,
      pendant: { intensity: 6, color: '#FFD9A0' },
      campusGlow: 0,
      skyColor: '#F5EDE0',
      note: '只开半场灯与静音区独立回路',
    },
  },
  {
    key: 'cocreate',
    color: 'app-teal',
    name: '共创期',
    range: '10:30 – 16:30',
    title: '长桌最满的四小时',
    desc: '没课的学生集中出现，跨专业混坐自然发生，引导员在场提供 15 分钟上手帮助。这是饮品销量的主峰，也是作品产出最集中的时段。',
    revenuePct: 40,
    layout: 'merged',
    occupancy: { bar: 2, table: 16, quiet: 6, corr: 2, back: 1, hall: 0 },
    lights: {
      ambient: { intensity: 0.6, color: '#FFF3E0' },
      hemi: { intensity: 0.76, sky: '#FFF6E5', ground: '#6B4A32' },
      sun: { intensity: 1.45, color: '#FFF8EC', position: [4, 10, -5] },
      pendantsOn: 9,
      pendant: { intensity: 6, color: '#FFD9A0' },
      campusGlow: 0,
      skyColor: '#FBF5EA',
      note: '全亮，吊灯全开',
    },
  },
  {
    key: 'class',
    color: 'app-orange',
    name: '课程期',
    range: '16:30 – 19:00',
    title: '工作坊与项目制训练营',
    desc: '讲座角转为教学场地，每周固定 3–4 场入门工作坊。学员从「来喝咖啡的人」转化为「付费上课的人」，这是培训收入的主要来源时段。',
    revenuePct: 25,
    layout: 'lecture',
    occupancy: { bar: 2, table: 8, quiet: 4, corr: 1, back: 1, hall: 14 },
    lights: {
      ambient: { intensity: 0.46, color: '#FFF0DA' },
      hemi: { intensity: 0.52, sky: '#FFEEDA', ground: '#6B4A32' },
      sun: { intensity: 0.88, color: '#FFC08A', position: [-6, 5, -5] },
      pendantsOn: 6,
      pendant: { intensity: 7, color: '#FFD29A' },
      campusGlow: 0.25,
      skyColor: '#F6E6D3',
      note: '午后转暖，讲座角扩声 ≤ 75 dB',
    },
  },
  {
    key: 'night',
    color: 'purple',
    name: '夜谈期',
    range: '19:00 – 22:00',
    title: '夜谈、Demo Day 与黑客松',
    desc: '校园社交的黄金时段。周三夜谈、周五 Demo Day、月末黑客松都在此时段发生，也是最容易产生传播素材与社群粘性的窗口。',
    revenuePct: 25,
    layout: 'circle',
    occupancy: { bar: 2, table: 6, quiet: 2, corr: 1, back: 1, hall: 14 },
    lights: {
      ambient: { intensity: 0.24, color: '#FFE9CC' },
      hemi: { intensity: 0.2, sky: '#55647A', ground: '#46362C' },
      sun: { intensity: 0, color: '#FFC08A', position: [-6, 5, -5] },
      pendantsOn: 9,
      pendant: { intensity: 9, color: '#FFD9A0' },
      campusGlow: 1,
      skyColor: '#414A5E',
      note: '吊灯暖光为主，音量降一档，座位摆成圆桌、不设讲台',
    },
  },
]

export const TIME_MODE_BY_KEY = Object.fromEntries(TIME_MODES.map((m) => [m.key, m])) as Record<
  TimeModeKey,
  TimeMode
>
