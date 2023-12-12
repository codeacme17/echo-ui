import { Slider as _Slider } from './Slider'
import { SliderProps, SliderRef } from './types'

type CompoundedComponent = React.ForwardRefExoticComponent<
  SliderProps & React.RefAttributes<SliderRef>
>

const Slider = _Slider as CompoundedComponent

export { Slider }
export default Slider
export type { SliderProps, SliderRef } from './types'
