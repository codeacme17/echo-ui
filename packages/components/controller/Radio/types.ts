interface AbstractRadioProps<T>
  extends Omit<React.HTMLAttributes<T>, 'onChange' | 'onClick' | 'onMouseEnter' | 'onMouseLeave'> {
  value?: any
  disabled?: boolean
  checked?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: string
  classNames?: { label?: string }
  styles?: { label?: React.CSSProperties }
  onChange?: (e: RadioChangeEvent) => void
}

export interface RadioProps extends AbstractRadioProps<HTMLInputElement> {
  onClick?: React.MouseEventHandler<HTMLInputElement>
  onMouseEnter?: React.MouseEventHandler<HTMLLabelElement>
  onMouseLeave?: React.MouseEventHandler<HTMLLabelElement>
}

export interface RadioGroupProps extends AbstractRadioProps<HTMLDivElement> {
  value?: any
  classNames?: { radio?: string } & AbstractRadioProps<HTMLDivElement>['classNames']
  styles?: { radio?: React.CSSProperties } & AbstractRadioProps<HTMLDivElement>['styles']
}

export interface RadioChangeEvent {
  value: any
  nativeEvent: React.ChangeEvent<HTMLInputElement>
}

export interface RadioRef extends HTMLLabelElement {}

export interface RadioGroupRef extends HTMLDivElement {}
