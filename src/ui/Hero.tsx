import { Card } from 'animal-island-ui'
import { HERO, STATS } from '../data/content'

export function Hero() {
  return (
    <section className="hero wrap">
      <div className="section-head" style={{ marginBottom: 4 }}>
        <span className="eyebrow">{HERO.eyebrow}</span>
      </div>
      <h1 className="hero-title">{HERO.title}</h1>
      <p className="hero-lede">{HERO.lede}</p>
      <div className="stat-strip">
        {STATS.map((s) => (
          <Card key={s.label} color={s.color} pattern={s.pattern ? s.color : 'none'}>
            <div className="stat-value">
              {s.value}
              {s.unit ? <small>{s.unit}</small> : null}
            </div>
            <div className="stat-label">{s.label}</div>
          </Card>
        ))}
      </div>
      <p className="hero-lede" style={{ marginTop: 22 }}>
        {HERO.logic}
      </p>
    </section>
  )
}
