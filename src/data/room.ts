/**
 * 空间几何与六分区定义。
 * 与企划书 03-space.html 的 12×8 格网 1:1 对应：
 *   X 0→12 为西→东，Z 0→8.33 为北→南，每格约 1m × 1.04m。
 * 场景中所有分区包在 <group position={[-6, 0, -4.165]}> 内，使原点即房间中心。
 */

export const ROOM = {
  width: 12,
  depth: 8.33,
  height: 3.2,
  /** 场景根偏移：把企划书坐标平移成以房间中心为原点 */
  offset: [-6, 0, -4.165] as [number, number, number],
} as const

/** animal-island-ui 的 Card / Tag 配色名 */
export type IslandColor =
  | 'default'
  | 'app-pink'
  | 'purple'
  | 'app-blue'
  | 'app-yellow'
  | 'app-orange'
  | 'app-teal'
  | 'app-green'
  | 'app-red'
  | 'lime-green'
  | 'yellow-green'
  | 'brown'
  | 'warm-peach-pink'

export const ZONE_KEYS = ['bar', 'table', 'quiet', 'corr', 'back', 'hall'] as const
export type ZoneKey = (typeof ZONE_KEYS)[number]

export interface Zone {
  key: ZoneKey
  /** 分区名（与表 3-1 一致） */
  name: string
  /** 面积，㎡ */
  area: number
  /** 企划书格网 grid-area，仅作对照留档 */
  gridArea: string
  /** 平面范围 [min, max] */
  x: [number, number]
  z: [number, number]
  /** 该区在图例、卡片、高亮中使用的颜色 */
  color: IslandColor
  /** 场景高亮/展墙等实体用色（与 animal-island-ui 调色板同源） */
  hex: string
  /** 表 3-1：主要活动 */
  activities: string
  /** 表 3-1：关键配置 */
  config: string
  /** 点击分区时相机的相对机位（相对该区中心） */
  camOffset: [number, number, number]
}

export const ZONES: Zone[] = [
  {
    key: 'bar',
    name: '吧台与点单区',
    area: 12,
    gridArea: '1/1/5/4',
    x: [0, 3],
    z: [0, 4.17],
    color: 'app-orange',
    hex: '#e59266',
    activities: '点单、取餐、站立快聊、首次到店的接待与引导',
    config:
      '半自动咖啡机、磨豆机、冷藏与制冰、水处理、糕点柜、3 个高脚位、菜单与活动看板',
    camOffset: [3.6, 4.0, 4.4],
  },
  {
    key: 'table',
    name: '共创长桌区',
    area: 26,
    gridArea: '1/4/6/9',
    x: [3, 8],
    z: [0, 5.21],
    color: 'app-teal',
    hex: '#82d5bb',
    activities: '主力共创、跨专业混坐、组队、轻量工作坊',
    config:
      '2 张 8 人实木长桌、每座独立插座与 USB-C、2 块移动白板、1 台可移动 55 寸投屏',
    camOffset: [1.2, 5.2, 6.6],
  },
  {
    key: 'quiet',
    name: '静音专注区',
    area: 13,
    gridArea: '1/9/4/13',
    x: [8, 12],
    z: [0, 3.13],
    color: 'app-blue',
    hex: '#889df0',
    activities: '独立写稿、剪辑、渲染等待、远程面试',
    config: '10 个软座工位、隔断屏风、2 个隔音电话亭、独立照明回路、静音标识',
    camOffset: [3.4, 4.2, 4.2],
  },
  {
    key: 'corr',
    name: '展墙与主通道',
    area: 12,
    gridArea: '5/1/9/4',
    x: [0, 3],
    z: [4.17, 8.33],
    color: 'app-yellow',
    hex: '#f7cd67',
    activities: '作品展示、通行、海报与活动信息',
    config: '磁吸展墙 8 米（轨道射灯 12 盏）、可更换作品框 20 个、活动信息屏 1 台',
    camOffset: [3.8, 4.0, 4.6],
  },
  {
    key: 'back',
    name: '后勤区',
    area: 16,
    gridArea: '6/4/9/9',
    x: [3, 8],
    z: [5.21, 8.33],
    color: 'brown',
    hex: '#9a835a',
    activities: '备料、清洁、储物、员工休息与办公',
    config: '双门冷柜、洗涤槽与消毒柜、储物架、员工位与监控主机、卫生间',
    camOffset: [2.4, 4.2, 4.6],
  },
  {
    key: 'hall',
    name: '讲座角（可变形）',
    area: 21,
    gridArea: '4/9/9/13',
    x: [8, 12],
    z: [3.13, 8.33],
    color: 'warm-peach-pink',
    hex: '#e18c6f',
    activities: '夜谈、讲座、Demo Day、企业宣讲、40 人以内活动',
    config: '可折叠座椅 40 把、100 寸激光投影或 86 寸大屏、无线麦克 2 支、可移动隔断、小型音响',
    camOffset: [3.8, 4.6, 5.2],
  },
]

export const ZONE_BY_KEY = Object.fromEntries(ZONES.map((z) => [z.key, z])) as Record<
  ZoneKey,
  Zone
>

export function zoneCenter(key: ZoneKey): [number, number] {
  const z = ZONE_BY_KEY[key]
  return [(z.x[0] + z.x[1]) / 2, (z.z[0] + z.z[1]) / 2]
}

/** 分区中心换算到场景世界坐标（房间中心为原点） */
export function zoneWorldCenter(key: ZoneKey): [number, number, number] {
  const [cx, cz] = zoneCenter(key)
  return [cx - ROOM.width / 2, 0, cz - ROOM.depth / 2]
}

/** 默认机位与视点（娃娃屋视角，从东南方俯视） */
export const DEFAULT_VIEW = {
  position: [10.5, 11.5, 12.5] as [number, number, number],
  target: [0, 0.4, 0] as [number, number, number],
}
