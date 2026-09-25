/**
 * 讲座角三种形态的家具位姿。
 * 讲座角范围：X 8–12，Z 3.13–8.33（21㎡）。
 * 可移动隔断沿 X=8 布置（西侧边界），86 寸大屏挂在隔断上随其移动。
 */

import type { ZoneKey } from './room'

export type HallLayout = 'lecture' | 'circle' | 'merged'

export interface Pose {
  x: number
  z: number
  rotY: number
  /** 是否出现（0 表示收进角落的折叠椅堆） */
  visible: boolean
}

export interface HallScene {
  chairs: Pose[]
  /** 可移动隔断（含 86 寸大屏） */
  partition: { x: number; z: number; rotY: number }
  /** 大屏是否点亮 */
  screenOn: boolean
  /** 夜谈用的低圆桌 */
  roundTableVisible: boolean
  /** 角落折叠椅堆的组数 */
  stacks: number
}

export const CHAIR_TOTAL = 40

const HALL = { x0: 8, x1: 12, z0: 3.13, z1: 8.33 } as const

/** 折叠椅堆放点（讲座角东南角） */
export const CHAIR_STACKS: Array<{ x: number; z: number; rotY: number }> = [
  { x: 11.45, z: 7.75, rotY: -Math.PI / 2 },
  { x: 10.75, z: 7.75, rotY: -Math.PI / 2 },
]

/** 椅子模型默认朝 +Z；给出朝向角，使椅子面向 (dx, dz) 方向 */
export function faceTowards(dx: number, dz: number): number {
  return Math.atan2(dx, dz)
}

function hidden(): Pose[] {
  return Array.from({ length: CHAIR_TOTAL }, () => ({ x: 0, z: 0, rotY: 0, visible: false }))
}

/** 讲座：8 列（沿 Z）× 5 排（沿 X），全部面朝西侧的隔断大屏 */
function lectureChairs(): Pose[] {
  const poses = hidden()
  const rows = 5
  const cols = 8
  let i = 0
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      poses[i++] = {
        x: 9.15 + r * 0.62,
        z: 3.62 + c * 0.58,
        rotY: faceTowards(-1, 0),
        visible: true,
      }
    }
  }
  return poses
}

/** 夜谈：14 把围成圆桌，其余收进角落 */
function circleChairs(): Pose[] {
  const poses = hidden()
  const cx = 10
  const cz = 4.7
  const radius = 1.5
  const count = 14
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2
    const x = cx + radius * Math.cos(angle)
    const z = cz + radius * Math.sin(angle)
    poses[i] = { x, z, rotY: faceTowards(cx - x, cz - z), visible: true }
  }
  return poses
}

export function buildHallScene(layout: HallLayout): HallScene {
  switch (layout) {
    case 'lecture':
      return {
        chairs: lectureChairs(),
        partition: { x: HALL.x0 + 0.06, z: 4.86, rotY: 0 },
        screenOn: true,
        roundTableVisible: false,
        stacks: 0,
      }
    case 'circle':
      return {
        chairs: circleChairs(),
        partition: { x: HALL.x0 + 0.06, z: 6.78, rotY: 0 },
        screenOn: false,
        roundTableVisible: true,
        stacks: 1,
      }
    case 'merged':
      return {
        chairs: hidden(),
        partition: { x: 10.05, z: HALL.z1 - 0.18, rotY: Math.PI / 2 },
        screenOn: false,
        roundTableVisible: false,
        stacks: 2,
      }
  }
}

export const LAYOUT_LABELS: Record<HallLayout, string> = {
  lecture: '讲座模式',
  circle: '夜谈圆桌',
  merged: '并入共创区',
}

export const LAYOUT_HINTS: Record<HallLayout, string> = {
  lecture: '40 把折叠椅排成 8×5，全部面朝隔断上的 86 寸大屏',
  circle: '14 把椅子围成圆桌、不设讲台，其余椅子收进角落',
  merged: '隔断转至南侧、椅子全部收起，21㎡ 并入共创区扩容',
}

/** 各分区的固定座位/站位锚点（供人流使用），坐标为企划书平面坐标 */
export const ZONE_ANCHORS: Record<ZoneKey, Array<[number, number]>> = {
  // 吧台：3 个高脚位
  bar: [
    [1.05, 1.5],
    [1.5, 1.5],
    [1.95, 1.5],
  ],
  // 共创长桌：2 张 8 人长桌，每张 4 人对坐
  table: [
    [4.3, 1.5],
    [4.3, 2.35],
    [4.3, 3.2],
    [4.3, 4.05],
    [5.1, 1.5],
    [5.1, 2.35],
    [5.1, 3.2],
    [5.1, 4.05],
    [6.5, 1.5],
    [6.5, 2.35],
    [6.5, 3.2],
    [6.5, 4.05],
    [7.3, 1.5],
    [7.3, 2.35],
    [7.3, 3.2],
    [7.3, 4.05],
  ],
  // 静音专注：10 个软座
  quiet: [
    [8.7, 0.75],
    [9.5, 0.75],
    [10.3, 0.75],
    [11.1, 0.75],
    [8.7, 1.7],
    [9.5, 1.7],
    [10.3, 1.7],
    [11.1, 1.7],
    [8.9, 2.6],
    [11.0, 2.6],
  ],
  // 展墙与主通道：沿通道站立
  corr: [
    [2.3, 5.1],
    [2.3, 6.1],
    [2.3, 7.1],
    [1.5, 7.7],
  ],
  // 后勤区：员工位与员工动线
  back: [
    [6.9, 6.95],
    [3.9, 6.2],
    [5.6, 5.5],
  ],
  // 讲座角由当前布局的椅子位次决定，此处仅作兜底
  hall: [
    [10, 4.5],
    [10.6, 4.9],
    [9.4, 4.9],
    [10, 5.3],
  ],
}
