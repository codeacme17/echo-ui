import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { ComponentVariantMatrix } from '../docs/app/_components/component-variant-matrix'
import { restoreDocsDomObservers, stubDocsDomObservers } from './docs-dom-observers'

const toneBoundary = vi.hoisted(() => ({
  analyserDispose: vi.fn(),
  filterDispose: vi.fn(),
  loaded: vi.fn(async () => undefined),
  playerDispose: vi.fn(),
  playerStart: vi.fn(),
  playerStop: vi.fn(),
  start: vi.fn(async () => undefined),
}))

vi.mock('tone', async (importOriginal) => {
  const actual = await importOriginal<typeof import('tone')>()

  class Filter {
    connect() {
      return this
    }
    disconnect() {}
    dispose() {
      toneBoundary.filterDispose()
    }
    set() {}
    toDestination() {
      return this
    }
  }

  class Analyser extends Filter {
    dispose() {
      toneBoundary.analyserDispose()
    }
    getValue() {
      return new Float32Array([-72, -48, -24])
    }
  }

  class Player extends Filter {
    start() {
      toneBoundary.playerStart()
    }
    stop() {
      toneBoundary.playerStop()
    }
    dispose() {
      toneBoundary.playerDispose()
    }
  }

  return {
    ...actual,
    Analyser,
    Filter,
    Player,
    loaded: toneBoundary.loaded,
    start: toneBoundary.start,
  }
})

beforeAll(stubDocsDomObservers)

afterEach(cleanup)
afterAll(restoreDocsDomObservers)

const exampleNamed = (name: string) => {
  const section = screen.getByRole('heading', { name }).closest('section')
  if (!section) throw new Error(`Missing ${name} example section`)
  return Object.assign(within(section), { container: section })
}

describe('documentation component variants', () => {
  it('renders runtime-authoritative Input bilateral directions', () => {
    render(<ComponentVariantMatrix component="input" lang="en" />)

    const defaultInput = exampleNamed('Default').getByRole('spinbutton', {
      name: 'Default input',
    })
    const bilateralInput = exampleNamed('Bilateral Mode').getByRole('spinbutton', { name: 'Pan' })

    expect(defaultInput.getAttribute('data-bilateral')).toBe('positive')
    expect(bilateralInput.getAttribute('data-bilateral')).toBe('negative')
  })

  it('keeps Button, Checkbox, and Radio group previews and source controlled', () => {
    render(<ComponentVariantMatrix component="button" lang="en" />)
    let example = exampleNamed('Button Group')
    const square = example.getByRole('button', { name: 'Square' })
    expect(square.getAttribute('data-toggled')).toBe('false')
    fireEvent.click(square)
    expect(square.getAttribute('data-toggled')).toBe('true')
    fireEvent.click(example.getByRole('tab', { name: 'Code' }))
    expect(example.getByText(/const \[waveform, setWaveform\] = useState\('sine'\)/)).toBeTruthy()
    expect(example.getByText(/role="group"[\s\S]+setWaveform\(String\(nextValue\)\)/)).toBeTruthy()

    cleanup()
    render(<ComponentVariantMatrix component="checkbox" lang="en" />)
    example = exampleNamed('Checkbox Group')
    const reverb = example.getByRole('checkbox', { name: 'Reverb' })
    expect(
      reverb.getAttribute('aria-checked') ?? String((reverb as HTMLInputElement).checked),
    ).toBe('false')
    fireEvent.click(reverb)
    expect((reverb as HTMLInputElement).checked).toBe(true)
    fireEvent.click(example.getByRole('tab', { name: 'Code' }))
    expect(
      example.getByText(/const \[effects, setEffects\] = useState<unknown\[\]>\(\['delay'\]\)/),
    ).toBeTruthy()
    expect(
      example.getByText(/role="group"[\s\S]+setEffects\(event.value as unknown\[\]\)/),
    ).toBeTruthy()

    cleanup()
    render(<ComponentVariantMatrix component="radio" lang="en" />)
    example = exampleNamed('Radio Group')
    const draft = example.getByRole('radio', { name: 'Draft' })
    expect((draft as HTMLInputElement).checked).toBe(false)
    fireEvent.click(draft)
    expect((draft as HTMLInputElement).checked).toBe(true)
    fireEvent.click(example.getByRole('tab', { name: 'Code' }))
    expect(example.getByText(/const \[quality, setQuality\] = useState\('balanced'\)/)).toBeTruthy()
    expect(
      example.getByText(/role="radiogroup"[\s\S]+setQuality\(String\(event.value\)\)/),
    ).toBeTruthy()
  })

  it('keeps Switch and VU Meter custom-style source aligned with rendered runtime state', () => {
    render(<ComponentVariantMatrix component="switch" lang="en" />)
    let example = exampleNamed('Custom Styling')
    const customSwitch = example.getByText('Custom').closest('label')
    const switchTrack = customSwitch?.querySelector(':scope > span') as HTMLElement | null
    expect(switchTrack?.style.background).toBe('rgb(139, 92, 246)')
    fireEvent.click(example.getByRole('tab', { name: 'Code' }))
    expect(example.getByText(/styles=\{\{ button: \{ background: '#8b5cf6' \} \}\}/)).toBeTruthy()

    cleanup()
    render(<ComponentVariantMatrix component="vumeter" lang="en" />)
    example = exampleNamed('Custom Colors')
    const segments = example.container.querySelectorAll('[data-active]')
    expect(segments.length).toBeGreaterThan(0)
    for (const segment of segments) {
      expect(segment.className).toContain('data-[active=none]:bg-slate-700')
      expect(segment.className).toContain('data-[active=low]:bg-emerald-500')
      expect(segment.className).toContain('data-[active=medium]:bg-amber-400')
      expect(segment.className).toContain('data-[active=high]:bg-rose-500')
      expect(['none', 'low', 'medium', 'high']).toContain(segment.getAttribute('data-active'))
    }
    fireEvent.click(example.getByRole('tab', { name: 'Code' }))
    expect(example.getByText(/data-\[active=none\]:bg-slate-700/)).toBeTruthy()
    expect(example.queryByText(/data-\[active=true\]/)).toBeNull()
  })

  it('renders interactive 360°, 270°, and 180° Knob rotation ranges', () => {
    render(<ComponentVariantMatrix component="knob" lang="en" />)

    const example = exampleNamed('Rotation Angle Range')
    expect(example.getByText('360°')).toBeTruthy()
    expect(example.getByText('270°')).toBeTruthy()
    expect(example.getByText('180°')).toBeTruthy()

    const range = example.getByRole('slider', { name: '360° rotation range' })
    fireEvent.change(range, { target: { value: '65' } })
    expect(example.getByText('65')).toBeTruthy()
    fireEvent.click(example.getByRole('tab', { name: 'Code' }))
    expect(
      example.getByText(/type RotationRange = \(typeof rotationRanges\)\[number\]/),
    ).toBeTruthy()
    expect(
      example.getByText(/updateValue = \(rotationRange: RotationRange, value: number\)/),
    ).toBeTruthy()
  })

  it('runs and releases the Spectrogram EQ3 audio scenario with interactive bands', async () => {
    render(<ComponentVariantMatrix component="spectrogram" lang="en" />)

    const example = exampleNamed('Use Case: EQ3')
    const low = example.getByRole('slider', { name: 'LOW gain' })
    expect(example.getByRole('slider', { name: 'MID gain' })).toBeTruthy()
    expect(example.getByRole('slider', { name: 'HIGH gain' })).toBeTruthy()

    fireEvent.change(low, { target: { value: '6' } })
    expect(example.getByText('6 dB')).toBeTruthy()

    fireEvent.click(example.getByRole('button', { name: 'Start EQ3 audio' }))
    await waitFor(() => expect(example.getByRole('status').textContent).toBe('Playing'))
    expect(toneBoundary.start).toHaveBeenCalledOnce()
    expect(toneBoundary.playerStart).toHaveBeenCalledOnce()

    fireEvent.click(example.getByRole('tab', { name: 'Code' }))
    expect(example.getByText(/new Tone\.Player/)).toBeTruthy()
    expect(example.getByText(/new Tone\.Filter/)).toBeTruthy()
    expect(example.getByText(/LOW[\s\S]+MID[\s\S]+HIGH/)).toBeTruthy()
    expect(example.getByText(/type Eq3Graph/)).toBeTruthy()
    expect(example.getByText(/audioUrl = basePath \+ '\/audios\/loop-2\.mp3'/)).toBeTruthy()
    expect(example.getByText(/try \{[\s\S]+catch \{/)).toBeTruthy()
    expect(example.getByText(/disposeGraph\(\)/)).toBeTruthy()
    expect(example.getByText(/dispose\(\)/)).toBeTruthy()

    cleanup()
    expect(toneBoundary.playerStop).toHaveBeenCalled()
    expect(toneBoundary.playerDispose).toHaveBeenCalledOnce()
    expect(toneBoundary.analyserDispose).toHaveBeenCalledOnce()
    expect(toneBoundary.filterDispose).toHaveBeenCalledTimes(3)
  })
})
