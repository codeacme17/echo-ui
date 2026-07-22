import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { StrictMode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Button } from '../packages/components/controller/Button'

afterEach(cleanup)

describe('Button', () => {
  it('notifies consumers when the user activates it', () => {
    const onClick = vi.fn()

    render(<Button onClick={onClick}>Play</Button>)
    fireEvent.click(screen.getByRole('button', { name: 'Play' }))

    expect(onClick).toHaveBeenCalledOnce()
  })

  it('runs callback ref cleanup when Strict Mode detaches the button', () => {
    const detach = vi.fn()
    const ref = vi.fn((element: HTMLButtonElement | null) => {
      if (element) return detach
    })
    const { unmount } = render(
      <StrictMode>
        <Button ref={ref}>Play</Button>
      </StrictMode>,
    )

    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement))
    unmount()

    expect(detach).toHaveBeenCalled()
  })

  it('forwards native div attributes from Button.Group', () => {
    render(
      <Button.Group aria-label="Waveform" data-testid="waveform-group" role="group">
        <Button value="sine">Sine</Button>
      </Button.Group>,
    )

    const group = screen.getByTestId('waveform-group')
    expect(group.getAttribute('aria-label')).toBe('Waveform')
    expect(group.getAttribute('role')).toBe('group')
  })

  it.each([0, false, ''])('reports a falsy grouped value (%j)', (value) => {
    const onChange = vi.fn()

    render(
      <Button.Group value="selected" onChange={onChange}>
        <Button value={value}>Option</Button>
      </Button.Group>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Option' }))

    expect(onChange).toHaveBeenCalledWith(value)
  })
})
