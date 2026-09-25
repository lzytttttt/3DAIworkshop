/**
 * 3D 层材质色板与程序化贴图。
 * 色板与 global.css 的 :root 变量、企划书 assets/style.css 同源，
 * 使 3D 场景与页面 UI（animal-island-ui 奶油风）看起来是同一套设计语言。
 */

import * as THREE from 'three'

export const C = {
  floor: '#d3a674',
  floorSeam: '#a8703f',
  wall: '#f2e5d2',
  wallCap: '#6b4a32',
  base: '#5c3d28',
  teal: '#2e6b5e',
  amber: '#d98a3d',
  terracotta: '#c4694a',
  wood: '#8f613c',
  woodDark: '#5e3f29',
  woodLight: '#c69c6d',
  top: '#e9d6b8',
  steel: '#c2c9cf',
  steelDark: '#828d95',
  glass: '#cfe2f0',
  fabric: '#b07a52',
  fabricDeep: '#8b5c3b',
  cushion: '#d8b892',
  green: '#417d51',
  greenDeep: '#2d5b3a',
  pot: '#b5654a',
  paper: '#fffdf9',
  screen: '#1b222e',
  screenGlow: '#ffd9a0',
  lamp: '#f6e0bd',
  charcoal: '#3b2a21',
  concrete: '#d5cec2',
  glowWarm: '#ffbf6e',
} as const

function paint(size: number, draw: (ctx: CanvasRenderingContext2D, s: number) => void): THREE.CanvasTexture {
  const el = document.createElement('canvas')
  el.width = el.height = size
  const ctx = el.getContext('2d')!
  draw(ctx, size)
  const tex = new THREE.CanvasTexture(el)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

let floorTex: THREE.CanvasTexture | null = null

/** 暖木地板：横向长条 + 板缝 + 木纹 */
export function woodFloorTexture(): THREE.CanvasTexture {
  if (floorTex) return floorTex
  floorTex = paint(512, (ctx, s) => {
    ctx.fillStyle = C.floor
    ctx.fillRect(0, 0, s, s)
    const rows = 8
    const h = s / rows
    for (let r = 0; r < rows; r++) {
      const y = r * h
      // 每块板轻微色差
      ctx.fillStyle = `rgba(120,72,36,${0.02 + ((r * 37) % 7) * 0.008})`
      ctx.fillRect(0, y, s, h)
      // 木纹
      ctx.strokeStyle = 'rgba(126,78,40,0.1)'
      ctx.lineWidth = 1
      for (let i = 0; i < 7; i++) {
        const gy = y + 6 + i * (h / 8)
        ctx.beginPath()
        ctx.moveTo(0, gy)
        for (let x = 0; x <= s; x += 32) {
          ctx.lineTo(x, gy + Math.sin((x + r * 40 + i * 13) * 0.03) * 1.6)
        }
        ctx.stroke()
      }
      // 板缝
      ctx.fillStyle = 'rgba(84,48,22,0.22)'
      ctx.fillRect(0, y, s, 2)
      // 板端缝
      const stagger = (r % 2) * 128
      for (let k = 0; k < 2; k++) {
        const x = (stagger + k * 256) % s
        ctx.fillStyle = 'rgba(84,48,22,0.16)'
        ctx.fillRect(x, y, 2, h)
      }
    }
  })
  floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping
  floorTex.repeat.set(3, 2)
  floorTex.anisotropy = 4
  return floorTex
}

const slides: Record<string, THREE.CanvasTexture> = {}

/** 86/100 寸大屏与信息屏上显示的幻灯片（同一套视觉：奶油底 + 青绿 + 琥珀） */
export function slideTexture(kind: 'lecture' | 'talk' | 'demo' | 'info'): THREE.CanvasTexture {
  if (slides[kind]) return slides[kind]
  const dark = kind === 'info'
  slides[kind] = paint(512, (ctx, s) => {
    ctx.fillStyle = dark ? '#22303a' : C.paper
    ctx.fillRect(0, 0, s, s)
    const pad = 44
    if (dark) {
      // 活动信息屏：色块标题栏 + 条目
      ctx.fillStyle = C.glowWarm
      ctx.fillRect(pad, pad, 150, 16)
      ctx.fillStyle = 'rgba(255,253,249,0.9)'
      ctx.font = 'bold 40px sans-serif'
      ctx.fillText('今日活动', pad, pad + 74)
      const items = ['19:00  夜谈 · 第 12 期', '20:30  Demo Day 报名', '周三   AI 入门工作坊']
      ctx.font = '22px sans-serif'
      items.forEach((t, i) => {
        ctx.fillStyle = 'rgba(255,253,249,0.82)'
        ctx.fillText(t, pad, pad + 130 + i * 40)
        ctx.fillStyle = 'rgba(255,217,160,0.5)'
        ctx.fillRect(pad, pad + 146 + i * 40, 360, 1)
      })
      ctx.fillStyle = '#19c8b9'
      ctx.fillRect(pad, s - pad - 26, 120, 26)
    } else {
      const titles: Record<string, string> = {
        lecture: '从 0 到 1 做一个小工具',
        talk: '夜谈 · 我们为什么做这个空间',
        demo: 'Demo Day · 本月作品',
      }
      ctx.fillStyle = '#19c8b9'
      ctx.fillRect(pad, pad, 96, 14)
      ctx.fillStyle = '#5d3d1e'
      ctx.font = 'bold 46px sans-serif'
      ctx.fillText(titles[kind].slice(0, 8), pad, pad + 88)
      ctx.font = 'bold 46px sans-serif'
      ctx.fillText(titles[kind].slice(8), pad, pad + 146)
      // 三个要点块
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = ['#f7cd67', '#82d5bb', '#e59266'][i]
        ctx.fillRect(pad + i * 146, s - pad - 150, 120, 96)
        ctx.fillStyle = 'rgba(93,61,30,0.55)'
        ctx.fillRect(pad + i * 146, s - pad - 92, 78, 8)
        ctx.fillRect(pad + i * 146, s - pad - 76, 96, 8)
      }
      ctx.fillStyle = 'rgba(93,61,30,0.18)'
      ctx.fillRect(pad, s - pad - 22, s - pad * 2, 3)
    }
  })
  return slides[kind]
}

let boardTex: THREE.CanvasTexture | null = null

/** 移动白板：白底 + 彩色手绘框线与便签 */
export function whiteboardTexture(): THREE.CanvasTexture {
  if (boardTex) return boardTex
  boardTex = paint(512, (ctx, s) => {
    ctx.fillStyle = '#fbfaf7'
    ctx.fillRect(0, 0, s, s)
    ctx.strokeStyle = '#19c8b9'
    ctx.lineWidth = 5
    ctx.strokeRect(30, 30, 200, 120)
    ctx.strokeStyle = '#e59266'
    ctx.strokeRect(270, 60, 190, 90)
    ctx.strokeStyle = 'rgba(93,61,30,0.5)'
    ctx.lineWidth = 4
    for (let i = 0; i < 4; i++) {
      ctx.beginPath()
      ctx.moveTo(40, 230 + i * 34)
      ctx.lineTo(220 - i * 18, 230 + i * 34)
      ctx.stroke()
    }
    const notes = ['#f7cd67', '#82d5bb', '#889df0', '#e59266']
    notes.forEach((color, i) => {
      ctx.fillStyle = color
      ctx.fillRect(250 + (i % 2) * 130, 230 + Math.floor(i / 2) * 120, 110, 96)
    })
  })
  return boardTex
}

let towerTex: THREE.CanvasTexture | null = null

function drawWindows(ctx: CanvasRenderingContext2D, s: number, facade: string, dark: string, lit: string) {
  const cols = 6
  const rows = 8
  const w = s / cols
  const h = s / rows
  ctx.fillStyle = facade
  ctx.fillRect(0, 0, s, s)
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const on = (r * 7 + c * 13) % 5 < 2
      ctx.fillStyle = on ? lit : dark
      ctx.fillRect(c * w + w * 0.22, r * h + h * 0.2, w * 0.56, h * 0.5)
    }
    ctx.fillStyle = 'rgba(60,50,44,0.25)'
    ctx.fillRect(0, r * h, s, 2)
  }
}

/** 窗外校园楼体（白天看：浅色立面 + 深浅不一的窗） */
export function towerTexture(): THREE.CanvasTexture {
  if (towerTex) return towerTex
  towerTex = paint(256, (ctx, s) => drawWindows(ctx, s, '#b3a795', '#6d6559', '#cdbfa5'))
  towerTex.wrapS = towerTex.wrapT = THREE.RepeatWrapping
  return towerTex
}

let towerGlowTex: THREE.CanvasTexture | null = null

/** 楼体亮灯通道：只有窗格发光，立面全黑，避免夜里整栋楼一起亮 */
export function towerGlowTexture(): THREE.CanvasTexture {
  if (towerGlowTex) return towerGlowTex
  towerGlowTex = paint(256, (ctx, s) => drawWindows(ctx, s, '#000000', '#000000', '#ffe0a8'))
  towerGlowTex.wrapS = towerGlowTex.wrapT = THREE.RepeatWrapping
  return towerGlowTex
}

let menuTex: THREE.CanvasTexture | null = null

/** 吧台菜单与活动看板 */
export function menuBoardTexture(): THREE.CanvasTexture {
  if (menuTex) return menuTex
  menuTex = paint(256, (ctx, s) => {
    ctx.fillStyle = '#2f2a24'
    ctx.fillRect(0, 0, s, s)
    ctx.fillStyle = C.glowWarm
    ctx.fillRect(24, 22, 96, 14)
    ctx.font = 'bold 26px sans-serif'
    ctx.fillStyle = 'rgba(255,253,249,0.92)'
    ctx.fillText('咖啡 · 轻食', 24, 76)
    const rows = ['手冲  18', '拿铁  16', '美式  12', '贝果  14']
    rows.forEach((t, i) => {
      ctx.font = '20px sans-serif'
      ctx.fillStyle = 'rgba(255,253,249,0.78)'
      ctx.fillText(t, 24, 120 + i * 32)
    })
    ctx.fillStyle = 'rgba(255,217,160,0.35)'
    ctx.fillRect(24, 240, 208, 2)
  })
  return menuTex
}
