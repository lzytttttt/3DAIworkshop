/**
 * 页面文案与数字，逐项对齐企划书第三章与 README 核心数字。
 * 全部为测算值，非实际经营数据。
 */

import type { IslandColor } from './room'

/** 3.3 五感氛围参数（表 3-2） */
export interface SenseParam {
  key: string
  dimension: string
  params: string
  standard: string
  color: IslandColor
}

export const SENSE_PARAMS: SenseParam[] = [
  {
    key: 'sight',
    dimension: '视觉',
    params: '主色比例、照明色温、木质占比',
    standard:
      '暖木与琥珀为主、墨绿点缀；主照明 2700–3000K；裸露木质表面不低于可见墙面与家具面积的 40%；绿植不少于 12 盆且必须真实存活（假植物破坏信任感）',
    color: 'app-yellow',
  },
  {
    key: 'sound',
    dimension: '听觉',
    params: '分区音量上限',
    standard:
      '静音区 ≤ 45 dB（含人声）、共创区 55–65 dB、讲座角扩声 ≤ 75 dB；策划歌单以器乐与低频为主，音量中午与夜间各降一档；不用流行歌曲，避免版权与注意力争夺',
    color: 'app-blue',
  },
  {
    key: 'smell',
    dimension: '嗅觉',
    params: '气味来源与排除项',
    standard:
      '以现磨咖啡与烘焙为气味主体；禁止在店内加热气味强烈的食物；静音区与后勤区之间加装排风，避免清洁剂气味回流',
    color: 'app-orange',
  },
  {
    key: 'touch',
    dimension: '触觉',
    params: '久坐友好度',
    standard:
      '长桌桌面实木、边缘倒角；座椅坐深 ≥ 45 cm 且带靠背；每座必须触手可及一个插座；冬季桌面下方无冷风直吹',
    color: 'brown',
  },
  {
    key: 'access',
    dimension: '可达性',
    params: '入门心理门槛',
    standard:
      '不设前台迎宾话术；菜单与价目在门口可见；首次到店可自助扫码领「首杯体验券」与 15 分钟引导预约；不要求任何消费即可进店参观',
    color: 'app-teal',
  },
]

/** 核心数字条 */
export interface StatItem {
  value: string
  unit: string
  label: string
  color: IslandColor
  pattern: boolean
}

export const STATS: StatItem[] = [
  { value: '100', unit: '㎡', label: '单校区试点店', color: 'app-teal', pattern: true },
  { value: '45–55', unit: '座', label: '讲座模式 40 座', color: 'app-yellow', pattern: true },
  { value: '38.5', unit: '万', label: '启动投入', color: 'app-orange', pattern: true },
  { value: '7.2', unit: '万', label: '稳态月收入', color: 'app-green', pattern: true },
  { value: '51', unit: '单', label: '日均饮品盈亏平衡', color: 'app-blue', pattern: true },
  { value: '第 9 月', unit: '', label: '单月现金流转正', color: 'warm-peach-pink', pattern: true },
]

export const HERO = {
  eyebrow: '空间与场景设计 · 第三章',
  title: '把「便士大学」搬进 AI 时代',
  lede: '100 ㎡ 里要同时容纳四种互相打扰的活动：一个人的专注、两个人的争论、八个人的共创、四十个人的讲座。空间设计的全部难点，在于让这四件事在同一屋檐下互不干扰地发生。',
  logic:
    '分区不是按「功能」切，而是按噪音与停留时长切。从主入口进入，动线依次经过最热闹的展墙通道、最活跃的共创长桌，最后抵达最安静的静音区——噪音从外到内递减，客人可以在中途任何一点停下。',
  quote: '一个人愿不愿意第二次来，取决于他第一次坐下后五分钟内有没有人跟他说上一句话。',
  quoteCite: '空间设计的第一性原则：把人连起来，而不是把桌子摆满',
}

export const FOOTER_NOTE = {
  disclaimer:
    '站内全部财务与运营数字为基于公开行业经验与合理推演的测算值，非实际经营数据，不作为投资或收益承诺。假设清单与校准方式见企划书附录 E。',
  source:
    '空间尺寸、分区配比、家具配置与五感参数取自《校园 AI 创作工坊 · 项目企划书》第三章「空间与场景设计」，3D 模型按 12×8 格网 1:1 建模。',
}

/** 三个章节的标题区文案 */
export const SECTIONS = {
  scene: {
    eyebrow: '交互式 3D 模型',
    title: '100 ㎡ 的一间屋子，六种用法、四张脸',
    lede:
      '拖动可以旋转视角、滚轮缩放、点按地面色块看该区的活动与配置。上面的时段按钮会同时改变灯光、人群与家具形态——这是同一间屋子的早上、中午、傍晚与深夜。',
  },
  timeline: {
    eyebrow: '3.2 一天的四张脸',
    title: '同一空间，四个时段服务完全不同的人',
    lede:
      '校园店与商业咖啡店最大的区别是：客流曲线由课程表而不是通勤路线决定。因此空间的灯光、桌椅形态与音量上限，都按时段切换。',
  },
  senses: {
    eyebrow: '3.3 氛围参数',
    title: '把「轻松惬意」翻译成可执行的数字',
    lede:
      '「氛围好」不能只靠装修。下表把抽象感受拆成可验收的参数，写进装修验收单与日常巡检表——每一条都能被测量，也都能被追责。',
  },
} as const

/** 3.2 的两张说明卡 */
export const TIMELINE_NOTES = [
  {
    key: 'menu',
    title: '为什么按「时段」而不是「品类」设计菜单与活动',
    body:
      '商业咖啡店的逻辑是全天服务同一类人。校园店的逻辑相反：早上卖安静的座位，中午卖插座与网络，傍晚卖课程，晚上卖圈子。同一杯饮品在不同时段承载的价值完全不同，因此定价与促销应随时段浮动——例如 16:00 后的「夜谈套餐」，以及工作坊学员的饮品折扣。',
    color: 'app-teal' as const,
  },
  {
    key: 'holiday',
    title: '寒暑假的空窗如何填',
    body:
      '假期是没有课程表的两个月，也是校园店最大的经营风险（见 9.2）。空间的应对方式是切换客群：面向留校生、周边社区、中小学夏令营与校友开放，同时把活动转为线上营与远程项目制，用预付费年卡与储值把收入平滑到全年。',
    color: 'app-yellow' as const,
  },
]

/** 讲座角三种形态的展示顺序 */
export const HALL_LAYOUTS = ['lecture', 'circle', 'merged'] as const
