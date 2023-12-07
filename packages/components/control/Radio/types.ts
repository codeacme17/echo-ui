export interface RadioProps extends React.HTMLAttributes<HTMLInputElement> {
  value: any
  disabled?: boolean
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (e: RadioChangeEvent) => void
}

export interface RadioGroupProps extends RadioProps {}

export interface RadioChangeEventTarget extends RadioProps {
  value: any
}

export interface RadioChangeEvent {
  target: RadioChangeEventTarget
  nativeEvent: MouseEvent
}
