interface AbstractRadioProps<T> extends Omit<
  React.HTMLAttributes<T>,
  'onChange' | 'onClick' | 'onMouseEnter' | 'onMouseLeave'
> {
  value?: unknown
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: string
  classNames?: { label?: string }
  styles?: { label?: React.CSSProperties }
  onChange?: (e: RadioChangeEvent) => void
}

export interface RadioProps extends AbstractRadioProps<HTMLInputElement> {
  checked?: boolean
  onClick?: React.MouseEventHandler<HTMLInputElement>
  onMouseEnter?: React.MouseEventHandler<HTMLLabelElement>
  onMouseLeave?: React.MouseEventHandler<HTMLLabelElement>
}

export interface RadioGroupProps extends AbstractRadioProps<HTMLDivElement> {
  value?: unknown
  classNames?: { radio?: string } & AbstractRadioProps<HTMLDivElement>['classNames']
  styles?: { radio?: React.CSSProperties } & AbstractRadioProps<HTMLDivElement>['styles']
}

export interface RadioChangeEvent {
  value: unknown
  nativeEvent: React.ChangeEvent<HTMLInputElement>
}

export type RadioRef = HTMLLabelElement

export type RadioGroupRef = HTMLDivElement
