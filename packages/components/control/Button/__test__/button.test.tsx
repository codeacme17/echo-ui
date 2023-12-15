import { describe, it, expect, beforeEach, vi, Mock } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { Button } from '..'

describe('Button', () => {
  let onClickMock: Mock<any, any>, onToggleChangeMock: Mock<any, any>

  beforeEach(() => {
    onClickMock = vi.fn()
    onToggleChangeMock = vi.fn()
  })

  it('renders without crashing', () => {
    render(<Button>Test</Button>)
  })

  it('calls onClick when clicked', () => {
    const { getByText } = render(<Button onClick={onClickMock}>Click Me</Button>)
    fireEvent.click(getByText('Click Me'))
    expect(onClickMock).toHaveBeenCalled()
  })

  it('does not call onClick when disabled', () => {
    const { getByText } = render(
      <Button disabled onClick={onClickMock}>
        Click Me
      </Button>,
    )
    fireEvent.click(getByText('Click Me'))
    expect(onClickMock).not.toHaveBeenCalled()
  })

  it('applies toggled styles when toggled is true', () => {
    const toggledStyle = { color: 'red' }
    const { getByText } = render(
      <Button toggled toggledStyle={toggledStyle}>
        Toggle Me
      </Button>,
    )
    expect(getByText('Toggle Me')).toHaveStyle(toggledStyle)
  })

  it('calls onToggleChange when toggled changes', () => {
    render(
      <Button toggled onToggleChange={onToggleChangeMock}>
        Toggle Me
      </Button>,
    )
    expect(onToggleChangeMock).toHaveBeenCalledWith(true)
  })
})
