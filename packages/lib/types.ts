export interface AbstractProps<T = HTMLElement> {
  id?: string
  className?: string
  style?: React.CSSProperties
  ref?: React.RefObject<T>
  children?: React.ReactNode

  onClick?: React.MouseEventHandler
  onMouseEnter?: React.MouseEventHandler
  onMouseLeave?: React.MouseEventHandler
  onFocus?: React.FocusEventHandler
  onBlur?: React.FocusEventHandler
}
