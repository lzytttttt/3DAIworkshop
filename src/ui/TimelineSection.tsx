import { Card, Progress, Tag } from 'animal-island-ui'
import { SECTIONS, TIMELINE_NOTES } from '../data/content'
import { LAYOUT_LABELS } from '../data/layouts'
import { TIME_MODES } from '../data/timeModes'
import { useSceneActions, useSceneState } from '../store/sceneStore'
import { SectionHead } from './Layout'

export function TimelineSection() {
  const { mode } = useSceneState()
  const { setMode } = useSceneActions()
  return (
    <section className="section wrap" id="timeline">
      <SectionHead {...SECTIONS.timeline} />
      <div className="timeline-grid">
        {TIME_MODES.map((t) => {
          const active = t.key === mode
          const people = Object.values(t.occupancy).reduce((a, b) => a + b, 0)
          return (
            <Card
              key={t.key}
              color={active ? t.color : 'default'}
              pattern={active ? t.color : 'none'}
              hoverable
              onClick={() => setMode(t.key)}
            >
              <div className="timeline-when">
                {t.range} ｜ {t.name}
                {active ? ' ｜ 当前展示' : ''}
              </div>
              <h3 className="timeline-title">{t.title}</h3>
              <p className="timeline-desc">{t.desc}</p>
              <div className="timeline-foot">
                <Tag variant="soft" color={t.color} size="small">
                  {LAYOUT_LABELS[t.layout]}
                </Tag>
                <Tag variant="outlined" color={t.color} size="small">
                  在场 {people} 人
                </Tag>
              </div>
              <div style={{ marginTop: 10 }}>
                <Progress
                  percent={t.revenuePct}
                  size="small"
                  variant="coffee-break"
                  aria-label={`${t.name}营收占比`}
                />
                <div className="stat-label" style={{ marginTop: 6 }}>
                  营收占比 {t.revenuePct}%
                </div>
              </div>
            </Card>
          )
        })}
      </div>
      <div className="grid-2" style={{ marginTop: 16 }}>
        {TIMELINE_NOTES.map((n) => (
          <Card key={n.key} color={n.color} pattern="none">
            <h3 className="timeline-title">{n.title}</h3>
            <p className="timeline-desc" style={{ minHeight: 0 }}>
              {n.body}
            </p>
          </Card>
        ))}
      </div>
    </section>
  )
}
