import { cleanup, fireEvent, render, screen } from '@testing-library/react'
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
})
