'use client'

import {
  Button,
  Card,
  Checkbox,
  Envelope,
  Input,
  Knob,
  LFO,
  Light,
  Oscilloscope,
  Radio,
  Slider,
  Spectrogram,
  Switch,
  VuMeter,
  Waveform,
} from '@nafr/echo-ui'
import type { CSSProperties, FC, ReactNode } from 'react'
import { useEffect, useState } from 'react'
import {
  componentVariantInventory,
  type ComponentVariantId,
  type ComponentWithVariants,
  type DocumentationLocale,
} from './component-variants'
import { ExampleFrame } from './example-frame'

const rowStyle: CSSProperties = {
  alignItems: 'center',
  display: 'flex',
  flexWrap: 'wrap',
  gap: 16,
  justifyContent: 'center',
  width: '100%',
}

const graphStyle: CSSProperties = { height: 160, width: 'min(100%, 560px)' }
const sliderStyle: CSSProperties = { minWidth: 220, width: '70%' }

const spectrum = Array.from({ length: 48 }, (_, index) => ({
  amplitude: -90 + Math.sin(index / 5) * 24,
  frequency: 30 * 1.12 ** index,
}))
const eq3Spectrum = spectrum.map(({ amplitude, frequency }) => ({
  amplitude:
    amplitude + (frequency < 250 ? 18 : frequency < 2500 ? -12 : frequency < 8000 ? 15 : -6),
  frequency,
}))
const oscilloscope = Array.from({ length: 96 }, (_, index) => ({
  amplitude: Math.sin(index / 7) * 0.7,
  index,
}))
const waveform = Array.from({ length: 96 }, (_, index) => Math.sin(index / 4) * 0.8)

const useDelayedGraphData = <Sample,>(samples: Sample[], height: number) => {
  const [data, setData] = useState<Sample[]>([])
  const [renderHeight, setRenderHeight] = useState(height - 1)

  useEffect(() => {
    let timer: number | undefined
    const frame = window.requestAnimationFrame(() => {
      setRenderHeight(height)
      timer = window.setTimeout(() => setData(samples), 150)
    })

    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(timer)
    }
  }, [height, samples])

  return { data, height: renderHeight }
}

const SpectrogramPreview: FC<{
  axis: boolean
  data: typeof spectrum
  grid: boolean
}> = ({ axis, data: samples, grid }) => {
  const { data, height } = useDelayedGraphData(samples, 160)

  return (
    <div style={{ ...graphStyle, height }}>
      <Spectrogram amplitudeRange={[-120, 20]} axis={axis} data={data} grid={grid} />
    </div>
  )
}

const OscilloscopePreview: FC = () => {
  const { data, height } = useDelayedGraphData(oscilloscope, 160)

  return (
    <div style={{ ...graphStyle, height }}>
      <Oscilloscope amplitudeRange={[-1, 1]} data={data} />
    </div>
  )
}

const WaveformPreview: FC = () => {
  const { data, height } = useDelayedGraphData(waveform, 120)

  return (
    <div style={{ ...graphStyle, height }}>
      <Waveform audioDuration={12} data={data} />
    </div>
  )
}

const buttonPreview = (id: ComponentVariantId<'button'>): ReactNode => {
  if (id === 'toggled') return <Button toggled>Toggled</Button>
  if (id === 'disabled') return <Button disabled>Disabled</Button>
  if (id === 'sizes') {
    return (
      <div style={rowStyle}>
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </div>
    )
  }
  if (id === 'radii') {
    return (
      <div style={rowStyle}>
        {(['none', 'sm', 'md', 'lg', 'full'] as const).map((radius) => (
          <Button key={radius} radius={radius}>
            {radius}
          </Button>
        ))}
      </div>
    )
  }
  if (id === 'group') {
    return (
      <Button.Group aria-label="Waveform" role="group" value="sine">
        <Button value="sine">Sine</Button>
        <Button value="square">Square</Button>
      </Button.Group>
    )
  }
  return <Button>Button</Button>
}

const checkboxPreview = (id: ComponentVariantId<'checkbox'>): ReactNode => {
  if (id === 'disabled') return <Checkbox disabled>Disabled</Checkbox>
  if (id === 'sizes') {
    return (
      <div style={rowStyle}>
        {(['sm', 'md', 'lg'] as const).map((size) => (
          <Checkbox key={size} size={size}>
            {size}
          </Checkbox>
        ))}
      </div>
    )
  }
  if (id === 'colors') {
    return (
      <div style={rowStyle}>
        <Checkbox color="#8b5cf6">Violet</Checkbox>
        <Checkbox color="#10b981">Green</Checkbox>
      </div>
    )
  }
  if (id === 'group') {
    return (
      <Checkbox.Group aria-label="Effects" role="group" value={['delay']}>
        <Checkbox value="delay">Delay</Checkbox>
        <Checkbox value="reverb">Reverb</Checkbox>
      </Checkbox.Group>
    )
  }
  return <Checkbox>Normalize</Checkbox>
}

const envelopePreview = (id: ComponentVariantId<'envelope'>): ReactNode => {
  const data =
    id === 'ahdsr'
      ? { attack: 0.1, decay: 0.3, hold: 0.2, release: 0.5, sustain: 0.65 }
      : id === 'dadsr'
        ? { attack: 0.1, decay: 0.3, delay: 0.2, release: 0.5, sustain: 0.65 }
        : { attack: 0.1, decay: 0.3, release: 0.5, sustain: 0.65 }
  return (
    <div style={graphStyle}>
      <Envelope data={data} />
    </div>
  )
}

const inputPreview = (id: ComponentVariantId<'input'>): ReactNode => {
  if (id === 'disabled') return <Input aria-label="Disabled input" disabled value={30} />
  if (id === 'bilateral') return <Input aria-label="Pan" bilateral max={50} min={-50} value={-20} />
  if (id === 'text') return <Input aria-label="Track name" type="text" value="Lead synth" />
  if (id === 'sizes') {
    return (
      <div style={rowStyle}>
        {(['sm', 'md', 'lg'] as const).map((size) => (
          <Input aria-label={`${size} input`} key={size} size={size} value={30} />
        ))}
      </div>
    )
  }
  if (id === 'radii') {
    return (
      <div style={rowStyle}>
        {(['none', 'md', 'full'] as const).map((radius) => (
          <Input aria-label={`${radius} input`} key={radius} radius={radius} value={30} />
        ))}
      </div>
    )
  }
  if (id === 'progress-color')
    return <Input aria-label="Violet progress" progressColor="#8b5cf6" value={60} />
  if (id === 'min-max') return <Input aria-label="Gain" max={12} min={-60} value={-6} />
  if (id === 'step')
    return (
      <Input aria-label="Stepped input" max={100} min={0} sensitivity={5} step={5} value={30} />
    )
  return <Input aria-label="Default input" value={30} />
}

const knobPreview = (id: ComponentVariantId<'knob'>): ReactNode => {
  if (id === 'disabled') return <Knob disabled value={30} />
  if (id === 'bilateral') return <Knob bilateral max={50} min={-50} value={-20} />
  if (id === 'range') return <Knob rotationRange={180} value={30} />
  if (id === 'labels') return <Knob bottomLabel="-6 dB" topLabel="Volume" value={30} />
  if (id === 'step') return <Knob max={100} min={-100} sensitivity={1} step={20} value={20} />
  if (id === 'size')
    return <Knob pointerHeight={7} pointerWidth={7} size={80} trackWidth={3} value={30} />
  if (id === 'colors')
    return (
      <Knob
        buttonColor="#475569"
        pointerColor="#6366f1"
        progressColor="#6366f1"
        trackColor="#6b7280"
        value={30}
      />
    )
  if (id === 'group')
    return (
      <Knob.Group size={80} trackWidth={3}>
        <Knob value={20} />
        <Knob value={45} />
        <Knob value={70} />
      </Knob.Group>
    )
  return <Knob value={30} />
}

const radioPreview = (id: ComponentVariantId<'radio'>): ReactNode => {
  if (id === 'disabled') return <Radio disabled>Disabled</Radio>
  if (id === 'sizes')
    return (
      <div style={rowStyle}>
        {(['sm', 'md', 'lg'] as const).map((size) => (
          <Radio key={size} size={size}>
            {size}
          </Radio>
        ))}
      </div>
    )
  if (id === 'colors')
    return (
      <div style={rowStyle}>
        <Radio color="#8b5cf6">Violet</Radio>
        <Radio color="#10b981">Green</Radio>
      </div>
    )
  if (id === 'group')
    return (
      <Radio.Group aria-label="Quality" role="radiogroup" value="balanced">
        <Radio value="draft">Draft</Radio>
        <Radio value="balanced">Balanced</Radio>
      </Radio.Group>
    )
  return <Radio>Balanced</Radio>
}

const sliderPreview = (id: ComponentVariantId<'slider'>): ReactNode => {
  const vertical = id === 'vertical'
  return (
    <div style={vertical ? { height: 150 } : sliderStyle}>
      <Slider
        axis={id === 'axis'}
        bilateral={id === 'bilateral'}
        disabled={id === 'disabled'}
        max={id === 'bilateral' ? 50 : 100}
        min={id === 'bilateral' ? -50 : 0}
        step={id === 'step' ? 10 : 1}
        styles={
          id === 'custom'
            ? { progress: { background: '#8b5cf6' }, thumb: { background: '#6d28d9' } }
            : undefined
        }
        value={id === 'uncontrolled' ? undefined : id === 'bilateral' ? -20 : 35}
        vertical={vertical}
      />
    </div>
  )
}

const switchPreview = (id: ComponentVariantId<'switch'>): ReactNode => {
  if (id === 'disabled') return <Switch disabled>Bypass</Switch>
  if (id === 'sizes')
    return (
      <div style={rowStyle}>
        {(['sm', 'md', 'lg'] as const).map((size) => (
          <Switch key={size} size={size}>
            {size}
          </Switch>
        ))}
      </div>
    )
  if (id === 'custom') return <Switch styles={{ button: { background: '#8b5cf6' } }}>Custom</Switch>
  return <Switch toggled={id === 'toggled'}>Bypass</Switch>
}

const lfoPreview = (id: ComponentVariantId<'lfo'>): ReactNode => (
  <div style={graphStyle}>
    <LFO amplitude={0.65} delay={id === 'delay' ? 120 : 0} frequency={4} />
  </div>
)

const lightPreview = (id: ComponentVariantId<'light'>): ReactNode => {
  if (id === 'colors')
    return (
      <div style={rowStyle}>
        <Light color="#10b981" on />
        <Light color="#f43f5e" on />
      </div>
    )
  if (id === 'sizes')
    return (
      <div style={rowStyle}>
        <Light on size="0.75rem" />
        <Light on size="1.25rem" />
      </div>
    )
  return <Light on={id === 'on'} />
}

const oscilloscopePreview = (): ReactNode => <OscilloscopePreview />

const spectrogramPreview = (id: ComponentVariantId<'spectrogram'>): ReactNode => (
  <SpectrogramPreview
    axis={id === 'axis' || id === 'eq3'}
    data={id === 'eq3' ? eq3Spectrum : spectrum}
    grid={id === 'grid' || id === 'eq3'}
  />
)

const vuMeterPreview = (id: ComponentVariantId<'vumeter'>): ReactNode => (
  <div style={id === 'horizontal' ? { height: 100, width: '80%' } : { height: 220 }}>
    <VuMeter
      classNames={id === 'colors' ? { lump: 'data-[active=true]:bg-violet-500' } : undefined}
      compact={id === 'compact'}
      horizontal={id === 'horizontal'}
      lumpsQuantity={id === 'segments' ? 12 : 30}
      value={id === 'stereo' ? [-18, -12] : -18}
    />
  </div>
)

const waveformPreview = (): ReactNode => <WaveformPreview />

const cardPreview = (id: ComponentVariantId<'card'>): ReactNode => {
  return (
    <Card toggled={id === 'active' || id === 'scenario'}>
      <Card.Header>{id === 'scenario' && <Light on />} Tape delay</Card.Header>
      <Card.Body>
        {id === 'scenario' ? <Knob value={35} /> : id === 'active' ? 'Active' : 'Controls'}
      </Card.Body>
    </Card>
  )
}

type VariantRendererMap = {
  [Component in ComponentWithVariants]: (id: ComponentVariantId<Component>) => ReactNode
}

const previewRenderers = {
  button: buttonPreview,
  card: cardPreview,
  checkbox: checkboxPreview,
  envelope: envelopePreview,
  input: inputPreview,
  knob: knobPreview,
  lfo: lfoPreview,
  light: lightPreview,
  oscilloscope: oscilloscopePreview,
  radio: radioPreview,
  slider: sliderPreview,
  spectrogram: spectrogramPreview,
  switch: switchPreview,
  vumeter: vuMeterPreview,
  waveform: waveformPreview,
} satisfies VariantRendererMap

const renderVariant = <Component extends ComponentWithVariants>(
  component: Component,
  id: ComponentVariantId<Component>,
) => {
  const renderer = previewRenderers[component] as (
    variantId: ComponentVariantId<Component>,
  ) => ReactNode
  return renderer(id)
}

type ComponentVariantMatrixProps<Component extends ComponentWithVariants> = Readonly<{
  component: Component
  lang: DocumentationLocale
}>

export const ComponentVariantMatrix = <Component extends ComponentWithVariants>({
  component,
  lang,
}: ComponentVariantMatrixProps<Component>) => {
  const variants = componentVariantInventory[component]

  return (
    <div data-component-variant-matrix={component}>
      {variants.map((variant) => (
        <ExampleFrame
          key={variant.id}
          label={variant.label[lang]}
          lang={lang}
          preview={renderVariant(component, variant.id)}
          source={variant.source}
        />
      ))}
    </div>
  )
}
