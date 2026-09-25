import { Card } from 'animal-island-ui'
import { HERO, SECTIONS, SENSE_PARAMS } from '../data/content'
import { SectionHead } from './Layout'

export function SenseSection() {
  return (
    <section className="section wrap" id="senses">
      <SectionHead {...SECTIONS.senses} />
      <div className="sense-grid">
        {SENSE_PARAMS.map((s) => (
          <Card key={s.key} color={s.color} pattern="none">
            <h3 className="timeline-title">{s.dimension}</h3>
            <div className="sense-body">
              <div className="sense-params">{s.params}</div>
              {s.standard}
            </div>
          </Card>
        ))}
      </div>
      <blockquote className="quote">
        <p>{HERO.quote}</p>
        <cite>—— {HERO.quoteCite}</cite>
      </blockquote>
    </section>
  )
}
