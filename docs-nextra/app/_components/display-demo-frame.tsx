'use client'

import type { FC, ReactNode } from 'react'
import type { DisplayName } from './display-api'
import styles from './display-docs.module.css'

export type Locale = 'en' | 'zh'
export type AudioStatus = 'idle' | 'connecting' | 'ready' | 'playing' | 'stopped' | 'error'

export const demoCopy = {
  en: {
    connectError: 'The audio graph could not start. Reload the page and try again.',
    connected: 'Signal graph ready',
    connecting: 'Connecting signal graph',
    idle: 'Signal graph idle',
    playing: 'Live signal running',
    reconnect: 'Reconnect graph',
    start: 'Start signal',
    stop: 'Stop signal',
    stopped: 'Signal stopped',
  },
  zh: {
    connectError: '音频图无法启动。请重新加载页面后重试。',
    connected: '信号图已就绪',
    connecting: '正在连接信号图',
    idle: '信号图空闲',
    playing: '实时信号运行中',
    reconnect: '重新连接音频图',
    start: '启动信号',
    stop: '停止信号',
    stopped: '信号已停止',
  },
} as const

export const getStatusText = (status: AudioStatus, lang: Locale) => {
  const labels = demoCopy[lang]
  if (status === 'connecting') return labels.connecting
  if (status === 'ready') return labels.connected
  if (status === 'playing') return labels.playing
  if (status === 'stopped') return labels.stopped
  if (status === 'error') return labels.connectError
  return labels.idle
}

type DemoFrameProps = Readonly<{
  active?: boolean
  children: ReactNode
  connected?: boolean
  connectionCount?: number
  display: DisplayName
  lang: Locale
  status: string
  statusCode?: string
}>

export const DemoFrame: FC<DemoFrameProps> = ({
  active = false,
  children,
  connected = false,
  connectionCount = 0,
  display,
  lang,
  status,
  statusCode = 'not-applicable',
}) => (
  <section
    className={styles.demo}
    data-animation-active={active}
    data-audio-state={statusCode}
    data-connection-count={connectionCount}
    data-display-demo={display}
    data-graph-connected={connected}
  >
    <header className={styles.demoHeader}>
      <span className={styles.signalLabel}>{lang === 'zh' ? '预览' : 'Preview'}</span>
      <p className={styles.demoStatus} aria-live="polite">
        {status}
      </p>
    </header>
    {children}
  </section>
)
