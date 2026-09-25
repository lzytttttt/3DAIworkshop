/**
 * 右侧分区面板：默认是六分区总览表（行可点选），
 * 选中某个分区后换成该区的活动、配置与当前时段人数。
 */

import { Button, Card, Progress, Table, Tag, Title } from 'animal-island-ui'
import { LAYOUT_HINTS, LAYOUT_LABELS } from '../data/layouts'
import { ZONES, ZONE_BY_KEY, type ZoneKey } from '../data/room'
import { TIME_MODE_BY_KEY } from '../data/timeModes'
import { useSceneActions, useSceneState } from '../store/sceneStore'

export function ZonePanel() {
  const { selectedZone, mode, layout } = useSceneState()
  const { selectZone, resetView } = useSceneActions()
  const current = TIME_MODE_BY_KEY[mode]

  if (!selectedZone) {
    const total = Object.values(current.occupancy).reduce((a, b) => a + b, 0)
    return (
      <div className="zone-panel">
        <Card color="app-teal" pattern="none">
          <Title variant="tab" size="small" color="app-teal">
            六分区与面积配比
          </Title>
          <p className="panel-empty" style={{ margin: '10px 0 12px' }}>
            点按舞台里的地面色块，或直接点下表里的任意一行，看该区的主要活动与关键配置。
          </p>
          <Table
            rowKey="key"
            columns={[
              { title: '分区', dataIndex: 'name' },
              { title: '面积', dataIndex: 'area', align: 'right', width: 78 },
              { title: '人数', dataIndex: 'people', align: 'right', width: 58 },
            ]}
            dataSource={ZONES.map((z) => ({
              key: z.key,
              name: z.name,
              area: `${z.area} ㎡`,
              people: current.occupancy[z.key],
            }))}
            onRow={(record) => ({
              onClick: () => selectZone(record.key as ZoneKey),
              style: { cursor: 'pointer' },
            })}
          />
          <div className="panel-row" style={{ marginTop: 10 }}>
            <span className="k">当前时段</span>
            <span className="v">
              {current.range} ｜ {current.name} · 全场 {total} 人
            </span>
          </div>
          <div className="panel-row">
            <span className="k">合计</span>
            <span className="v">100 ㎡ · 有效座位 45–55 个</span>
          </div>
        </Card>
      </div>
    )
  }

  const zone = ZONE_BY_KEY[selectedZone]
  const total = Object.values(current.occupancy).reduce((a, b) => a + b, 0)
  const share = total > 0 ? Math.round((current.occupancy[zone.key] / total) * 100) : 0
  return (
    <div className="zone-panel">
      <Card color={zone.color} pattern="none">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Title variant="tab" size="small" color={zone.color}>
            {zone.name}
          </Title>
          <Tag variant="solid" color={zone.color} size="small">
            {zone.area} ㎡
          </Tag>
        </div>
        <div style={{ marginTop: 12 }}>
          <div className="panel-row">
            <span className="k">占全屋</span>
            <span className="v">{share}% ／ 100 ㎡</span>
          </div>
          <div className="panel-row">
            <span className="k">当前人数</span>
            <span className="v">
              {current.occupancy[zone.key]} 人（{current.name}）
            </span>
          </div>
          <div className="panel-row">
            <span className="k">主要活动</span>
            <span className="v">{zone.activities}</span>
          </div>
          <div className="panel-row">
            <span className="k">关键配置</span>
            <span className="v">{zone.config}</span>
          </div>
          {zone.key === 'hall' ? (
            <div className="panel-row">
              <span className="k">当前形态</span>
              <span className="v">
                {LAYOUT_LABELS[layout]}：{LAYOUT_HINTS[layout]}
              </span>
            </div>
          ) : null}
        </div>
        <div style={{ marginTop: 12 }}>
          <Progress
            percent={share}
            size="small"
            variant="coffee-break"
            showInfo
            aria-label={`${zone.name}本时段人数占比`}
          />
          <div className="stat-label" style={{ marginTop: 6 }}>
            本时段全场 {total} 人里占 {share}%
          </div>
        </div>
        <div className="panel-actions">
          <Button type="primary" size="small" onClick={resetView}>
            复位视角
          </Button>
          <Button type="default" size="small" onClick={() => selectZone(null)}>
            返回分区总览
          </Button>
        </div>
      </Card>
    </div>
  )
}
