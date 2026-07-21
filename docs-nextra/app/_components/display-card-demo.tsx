'use client'

import { Card, Light } from '@nafr/echo-ui'
import type { FC } from 'react'
import { useState } from 'react'
import { DemoFrame, type Locale } from './display-demo-frame'
import styles from './display-docs.module.css'

export const CardDemo: FC<{ lang: Locale }> = ({ lang }) => {
  const [enabled, setEnabled] = useState(true)
  const [mix, setMix] = useState(38)

  return (
    <DemoFrame
      display="card"
      lang={lang}
      status={
        enabled
          ? lang === 'zh'
            ? '延迟已启用'
            : 'Delay enabled'
          : lang === 'zh'
            ? '延迟已旁通'
            : 'Delay bypassed'
      }
    >
      <div className={styles.cardStage}>
        <Card className={styles.effectCard} toggled={enabled}>
          <Card.Header>
            <Light color="oklch(72% 0.18 64)" on={enabled} />
            <span>{lang === 'zh' ? '磁带延迟' : 'Tape delay'}</span>
            <button
              aria-pressed={enabled}
              className={styles.cardToggle}
              onClick={() => setEnabled((value) => !value)}
            >
              {enabled ? (lang === 'zh' ? '旁通' : 'Bypass') : lang === 'zh' ? '启用' : 'Enable'}
            </button>
          </Card.Header>
          <Card.Body>
            <label className={styles.mixControl}>
              <span>{lang === 'zh' ? '干湿比' : 'Wet mix'}</span>
              <output>{mix}%</output>
              <input
                disabled={!enabled}
                max={100}
                min={0}
                type="range"
                value={mix}
                onChange={(event) => setMix(Number(event.target.value))}
              />
            </label>
          </Card.Body>
        </Card>
      </div>
    </DemoFrame>
  )
}
