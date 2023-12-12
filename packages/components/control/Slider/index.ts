import { SliderProps } from './types'
import { Slider as _Slider } from './Slider'

type CompoundedComponent = React.ForwardRefExoticComponent<SliderProps>
const Slider = _Slider as CompoundedComponent

export { Slider }
export default Slider
export type { SliderProps } from './types'
