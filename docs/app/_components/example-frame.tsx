'use client'

import type { FC, KeyboardEvent, ReactNode } from 'react'
import { useId, useRef, useState } from 'react'
import type { DocumentationLocale } from './component-variants'
import styles from './example-frame.module.css'

type ExampleTab = 'preview' | 'code'

type ExampleFrameProps = Readonly<{
  label: string
  lang: DocumentationLocale
  preview: ReactNode
  source: string
}>

const copy = {
  en: {
    code: 'Code',
    copied: 'Copied',
    copy: 'Copy source',
    copyError: 'Copy failed',
    preview: 'Preview',
  },
  zh: {
    code: '代码',
    copied: '已复制',
    copy: '复制源码',
    copyError: '复制失败',
    preview: '预览',
  },
} as const

export const ExampleFrame: FC<ExampleFrameProps> = ({ label, lang, preview, source }) => {
  const [activeTab, setActiveTab] = useState<ExampleTab>('preview')
  const [copyStatus, setCopyStatus] = useState('')
  const previewRef = useRef<HTMLButtonElement>(null)
  const codeRef = useRef<HTMLButtonElement>(null)
  const id = useId()
  const labels = copy[lang]

  const selectTab = (tab: ExampleTab, focus = false) => {
    setActiveTab(tab)
    if (focus) {
      const target = tab === 'preview' ? previewRef : codeRef
      target.current?.focus()
    }
  }

  const handleTabKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    let nextTab: ExampleTab | undefined
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp' || event.key === 'Home') {
      nextTab = 'preview'
    }
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown' || event.key === 'End') {
      nextTab = 'code'
    }
    if (!nextTab) return
    event.preventDefault()
    selectTab(nextTab, true)
  }

  const copySource = async () => {
    try {
      await navigator.clipboard.writeText(source)
      setCopyStatus(labels.copied)
    } catch {
      setCopyStatus(labels.copyError)
    }
  }

  return (
    <section className={styles.example} data-example-label={label}>
      <h3 className={styles.heading}>{label}</h3>
      <div aria-label={`${label} example`} className={styles.tabs} role="tablist">
        <button
          aria-controls={`${id}-preview-panel`}
          aria-selected={activeTab === 'preview'}
          className={styles.tab}
          id={`${id}-preview-tab`}
          ref={previewRef}
          role="tab"
          tabIndex={activeTab === 'preview' ? 0 : -1}
          type="button"
          onClick={() => selectTab('preview')}
          onKeyDown={handleTabKey}
        >
          {labels.preview}
        </button>
        <button
          aria-controls={`${id}-code-panel`}
          aria-selected={activeTab === 'code'}
          className={styles.tab}
          id={`${id}-code-tab`}
          ref={codeRef}
          role="tab"
          tabIndex={activeTab === 'code' ? 0 : -1}
          type="button"
          onClick={() => selectTab('code')}
          onKeyDown={handleTabKey}
        >
          {labels.code}
        </button>
      </div>
      {activeTab === 'preview' ? (
        <div
          aria-labelledby={`${id}-preview-tab`}
          className={styles.preview}
          id={`${id}-preview-panel`}
          role="tabpanel"
        >
          {preview}
        </div>
      ) : (
        <div
          aria-labelledby={`${id}-code-tab`}
          className={styles.codePanel}
          id={`${id}-code-panel`}
          role="tabpanel"
        >
          <button className={styles.copy} type="button" onClick={copySource}>
            {labels.copy}
          </button>
          <pre className={styles.source}>
            <code>{source}</code>
          </pre>
          <span className={styles.status} role="status">
            {copyStatus}
          </span>
        </div>
      )}
    </section>
  )
}
