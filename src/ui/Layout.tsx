/**
 * 页面骨架的共享零件：顶栏、章节标题区、页脚。
 */

import { BackTop, Button, Footer } from 'animal-island-ui'
import type { ReactNode } from 'react'
import { FOOTER_NOTE } from '../data/content'
import { useSceneActions } from '../store/sceneStore'

export function TopBar() {
  const { resetView } = useSceneActions()
  const jump = (id: string) => () =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="brand">
          <div className="brand-badge">AI</div>
          <div>
            <div className="brand-title">校园 AI 创作工坊</div>
            <div className="brand-sub">100 ㎡ · 六分区 · 四时段 · 3D 空间展示</div>
          </div>
        </div>
        <nav className="nav-links" aria-label="页面导航">
          <Button type="text" onClick={jump('scene')}>
            空间分区
          </Button>
          <Button type="text" onClick={jump('timeline')}>
            一天四张脸
          </Button>
          <Button type="text" onClick={jump('senses')}>
            五感参数
          </Button>
          <Button type="text" onClick={jump('foot')}>
            测算说明
          </Button>
        </nav>
        <Button type="default" size="small" onClick={resetView}>
          复位视角
        </Button>
      </div>
    </header>
  )
}

export function SectionHead({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string
  title: string
  lede: string
}) {
  return (
    <div className="section-head">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <p className="lede">{lede}</p>
    </div>
  )
}

export function PageFooter({ children }: { children?: ReactNode }) {
  return (
    <footer className="section wrap" id="foot">
      <div className="footer-note" style={{ marginBottom: 18 }}>
        <p style={{ marginBottom: 8 }}>
          <b>数据说明 · </b>
          {FOOTER_NOTE.disclaimer}
        </p>
        <p>
          <b>来源 · </b>
          {FOOTER_NOTE.source}
        </p>
      </div>
      {children}
      <Footer text="校园 AI 创作工坊 · 空间与场景设计（第三章）" />
      <div className="backtop">
        <BackTop />
      </div>
    </footer>
  )
}
