'use client'

import {
  Button,
  Checkbox,
  Envelope,
  Input,
  Knob,
  Radio,
  Slider,
  Switch,
  type EnvelopeData,
} from '@nafr/echo-ui'
import type { FC, KeyboardEvent, ReactNode } from 'react'
import { useState } from 'react'
import type { ControllerName } from './controller-api'
import styles from './controller-docs.module.css'

type Locale = 'en' | 'zh'

type DemoFrameProps = Readonly<{
  children: ReactNode
  controller: ControllerName
  lang: Locale
  status: string
  tall?: boolean
}>

const DemoFrame: FC<DemoFrameProps> = ({ children, controller, lang, status, tall }) => (
  <section className={styles.demo} data-controller-demo={controller}>
    <header className={styles.demoHeader}>
      <span className={styles.demoLabel}>{lang === 'zh' ? '预览' : 'Preview'}</span>
      <p className={styles.demoStatus} aria-live="polite">
        {status}
      </p>
    </header>
    <div className={`${styles.demoSurface} ${tall ? styles.demoSurfaceTall : ''}`}>{children}</div>
  </section>
)

const ButtonDemo: FC<{ lang: Locale }> = ({ lang }) => {
  const [auditioning, setAuditioning] = useState(false)
  const [waveform, setWaveform] = useState('sine')

  return (
    <DemoFrame
      controller="button"
      lang={lang}
      status={
        lang === 'zh'
          ? `${auditioning ? '试听中' : '已停止'} · 波形：${waveform}`
          : `${auditioning ? 'Auditioning' : 'Stopped'} · Wave: ${waveform}`
      }
    >
      <div className={styles.demoStack}>
        <div className={styles.demoRow}>
          <Button
            aria-pressed={auditioning}
            toggled={auditioning}
            onClick={() => setAuditioning((current) => !current)}
          >
            {lang === 'zh' ? '试听音色' : 'Audition sound'}
          </Button>
        </div>
        <Button.Group
          aria-label={lang === 'zh' ? '波形' : 'Waveform'}
          role="group"
          value={waveform}
          onChange={(nextValue) => setWaveform(String(nextValue))}
        >
          <Button value="sine">Sine</Button>
          <Button value="triangle">Triangle</Button>
          <Button value="square">Square</Button>
        </Button.Group>
      </div>
    </DemoFrame>
  )
}

const CheckboxDemo: FC<{ lang: Locale }> = ({ lang }) => {
  const [effects, setEffects] = useState<unknown[]>(['delay'])

  return (
    <DemoFrame
      controller="checkbox"
      lang={lang}
      status={
        lang === 'zh'
          ? `已启用：${effects.length ? effects.join('、') : '无'}`
          : `Enabled: ${effects.length ? effects.join(', ') : 'none'}`
      }
    >
      <Checkbox.Group
        aria-label={lang === 'zh' ? '效果器' : 'Effects'}
        role="group"
        value={effects}
        onChange={(event) => setEffects(event.value as unknown[])}
      >
        <Checkbox value="delay">Delay</Checkbox>
        <Checkbox value="chorus">Chorus</Checkbox>
        <Checkbox value="reverb">Reverb</Checkbox>
      </Checkbox.Group>
    </DemoFrame>
  )
}

const initialEnvelope: EnvelopeData = {
  attack: 0.16,
  decay: 0.28,
  sustain: 0.58,
  release: 0.45,
}

const envelopeFields: Array<keyof EnvelopeData> = ['attack', 'decay', 'sustain', 'release']

const EnvelopeDemo: FC<{ lang: Locale }> = ({ lang }) => {
  const [data, setData] = useState<EnvelopeData>(initialEnvelope)

  const updateField = (field: keyof EnvelopeData, value: number) => {
    setData((current) => ({ ...current, [field]: value }))
  }

  return (
    <DemoFrame
      controller="envelope"
      lang={lang}
      status={`A ${data.attack.toFixed(2)} · D ${data.decay.toFixed(2)} · S ${data.sustain.toFixed(2)} · R ${data.release.toFixed(2)}`}
      tall
    >
      <div className={styles.demoStack}>
        <div className={styles.envelope} aria-hidden="true">
          <Envelope data={data} onChange={setData} />
        </div>
        <div className={styles.envelopeFields}>
          {envelopeFields.map((field) => (
            <label className={styles.demoField} key={field}>
              <span>{field}</span>
              <input
                aria-label={field}
                max={field === 'sustain' ? 1 : undefined}
                min={0}
                step={0.01}
                type="number"
                value={data[field]}
                onChange={(event) => updateField(field, Number(event.target.value))}
              />
            </label>
          ))}
        </div>
      </div>
    </DemoFrame>
  )
}

const InputDemo: FC<{ lang: Locale }> = ({ lang }) => {
  const [gain, setGain] = useState<number | string>(-6)

  return (
    <DemoFrame
      controller="input"
      lang={lang}
      status={lang === 'zh' ? `增益：${gain} dB` : `Gain: ${gain} dB`}
    >
      <label className={styles.demoField}>
        <span>{lang === 'zh' ? '增益（可输入或上下拖动）' : 'Gain (type or drag vertically)'}</span>
        <Input
          aria-label={lang === 'zh' ? '增益' : 'Gain'}
          bilateral
          max={12}
          min={-60}
          step={0.5}
          value={gain}
          onChange={(event) => setGain(event.value)}
        />
      </label>
    </DemoFrame>
  )
}

const KnobDemo: FC<{ lang: Locale }> = ({ lang }) => {
  const [gain, setGain] = useState(-3)
  const [pan, setPan] = useState(0)

  return (
    <DemoFrame
      controller="knob"
      lang={lang}
      status={lang === 'zh' ? `增益 ${gain} dB · 声像 ${pan}` : `Gain ${gain} dB · Pan ${pan}`}
      tall
    >
      <div className={styles.demoStack}>
        <Knob.Group size="5rem" step={1}>
          <Knob
            bottomLabel={`${gain} dB`}
            max={12}
            min={-60}
            topLabel={lang === 'zh' ? '增益' : 'Gain'}
            value={gain}
            onChange={setGain}
          />
          <Knob
            bilateral
            bottomLabel={`${pan}`}
            max={50}
            min={-50}
            topLabel={lang === 'zh' ? '声像' : 'Pan'}
            value={pan}
            onChange={setPan}
          />
        </Knob.Group>
        <label className={styles.demoField}>
          <span>
            {lang === 'zh' ? '键盘可用的增益镜像输入' : 'Keyboard-accessible gain mirror'}
          </span>
          <input
            aria-label={lang === 'zh' ? '增益镜像输入' : 'Gain mirror input'}
            max={12}
            min={-60}
            step={1}
            type="range"
            value={gain}
            onChange={(event) => setGain(Number(event.target.value))}
          />
        </label>
      </div>
    </DemoFrame>
  )
}

const RadioDemo: FC<{ lang: Locale }> = ({ lang }) => {
  const [quality, setQuality] = useState('balanced')

  return (
    <DemoFrame
      controller="radio"
      lang={lang}
      status={lang === 'zh' ? `渲染质量：${quality}` : `Render quality: ${quality}`}
    >
      <Radio.Group
        aria-label={lang === 'zh' ? '渲染质量' : 'Render quality'}
        role="radiogroup"
        value={quality}
        onChange={(event) => setQuality(String(event.value))}
      >
        <Radio value="draft">{lang === 'zh' ? '草稿' : 'Draft'}</Radio>
        <Radio value="balanced">{lang === 'zh' ? '均衡' : 'Balanced'}</Radio>
        <Radio value="studio">{lang === 'zh' ? '录音室' : 'Studio'}</Radio>
      </Radio.Group>
    </DemoFrame>
  )
}

const SliderDemo: FC<{ lang: Locale }> = ({ lang }) => {
  const [mix, setMix] = useState(35)

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const change = event.key === 'ArrowRight' || event.key === 'ArrowUp' ? 5 : -5
    if (!['ArrowRight', 'ArrowUp', 'ArrowLeft', 'ArrowDown'].includes(event.key)) return
    event.preventDefault()
    setMix((current) => Math.min(100, Math.max(0, current + change)))
  }

  return (
    <DemoFrame
      controller="slider"
      lang={lang}
      status={lang === 'zh' ? `干湿比：${mix}%` : `Wet mix: ${mix}%`}
    >
      <div className={styles.demoStack}>
        <Slider
          aria-label={lang === 'zh' ? '干湿比' : 'Wet mix'}
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={mix}
          axis
          className={styles.slider}
          max={100}
          min={0}
          role="slider"
          tabIndex={0}
          value={mix}
          onChange={setMix}
          onKeyDown={handleKeyDown}
        />
      </div>
    </DemoFrame>
  )
}

const SwitchDemo: FC<{ lang: Locale }> = ({ lang }) => {
  const [bypassed, setBypassed] = useState(false)

  const handleKeyDown = (event: KeyboardEvent<HTMLLabelElement>) => {
    if (event.key !== ' ' && event.key !== 'Enter') return
    event.preventDefault()
    setBypassed((current) => !current)
  }

  return (
    <DemoFrame
      controller="switch"
      lang={lang}
      status={
        lang === 'zh'
          ? `效果器：${bypassed ? '已旁通' : '处理中'}`
          : `Effect: ${bypassed ? 'bypassed' : 'processing'}`
      }
    >
      <Switch
        aria-checked={bypassed}
        role="switch"
        tabIndex={0}
        toggled={bypassed}
        onChange={setBypassed}
        onKeyDown={handleKeyDown}
      >
        {lang === 'zh' ? '旁通效果器' : 'Bypass effect'}
      </Switch>
    </DemoFrame>
  )
}

type ControllerDemoProps = Readonly<{
  controller: ControllerName
  lang: Locale
}>

export const ControllerDemo: FC<ControllerDemoProps> = ({ controller, lang }) => {
  switch (controller) {
    case 'button':
      return <ButtonDemo lang={lang} />
    case 'checkbox':
      return <CheckboxDemo lang={lang} />
    case 'envelope':
      return <EnvelopeDemo lang={lang} />
    case 'input':
      return <InputDemo lang={lang} />
    case 'knob':
      return <KnobDemo lang={lang} />
    case 'radio':
      return <RadioDemo lang={lang} />
    case 'slider':
      return <SliderDemo lang={lang} />
    case 'switch':
      return <SwitchDemo lang={lang} />
  }
}
