import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ExampleFrame } from '../docs/app/_components/example-frame'

describe('documentation example source affordance', () => {
  const writeText = vi.fn()

  beforeEach(() => {
    writeText.mockReset()
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })
  })

  it('switches Preview and Code with tabs and copies the adjacent source', async () => {
    render(
      <ExampleFrame
        label="Default"
        lang="en"
        preview={<button type="button">Rendered example</button>}
        source="<Button>Button</Button>"
      />,
    )

    const previewTab = screen.getByRole('tab', { name: 'Preview' })
    const codeTab = screen.getByRole('tab', { name: 'Code' })
    expect(previewTab.getAttribute('aria-selected')).toBe('true')
    expect(screen.getByRole('button', { name: 'Rendered example' })).toBeTruthy()

    fireEvent.keyDown(previewTab, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(codeTab)
    expect(codeTab.getAttribute('aria-selected')).toBe('true')
    expect(screen.getByText('<Button>Button</Button>')).toBeTruthy()

    fireEvent.keyDown(codeTab, { key: 'ArrowLeft' })
    expect(document.activeElement).toBe(previewTab)
    fireEvent.keyDown(previewTab, { key: 'End' })
    expect(document.activeElement).toBe(codeTab)
    fireEvent.keyDown(codeTab, { key: 'Home' })
    expect(document.activeElement).toBe(previewTab)
    fireEvent.keyDown(previewTab, { key: 'End' })

    fireEvent.click(screen.getByRole('button', { name: 'Copy source' }))
    expect(writeText).toHaveBeenCalledWith('<Button>Button</Button>')
    expect((await screen.findByRole('status')).textContent).toBe('Copied')
  })
})
