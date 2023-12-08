// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Moon, Sun } from 'lucide-react'
import { useTheme } from './components/theme-provider'

import {
  VuMeterMonoComponent,
  VuMeterStereoComponent,
  VuMeterRecordComponent,
} from './components/visualizaion/VuMeter'
import { KnobComponent } from './components/controls/Konb'
import { RadioComponent } from './components/controls/Radio'
import { CheckboxComponent } from './components/controls/Checkbox'
import { SliderComponent } from './components/controls/Slider'

function App() {
  const { theme, setTheme } = useTheme()

  return (
    <main className="h-screen flex flex-col items-center pt-5 dark:bg-background">
      <div className="flex w-full mb-10">
        <button
          className="mb-2 text-foreground ml-auto mr-10"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          {theme === 'light' ? <Sun /> : <Moon />}
        </button>
      </div>

      {/* <KnobComponent /> */}

      <div className="flex gap-4 my-3">
        <VuMeterMonoComponent />
        {/* <VuMeterStereoComponent /> */}
        {/* <VuMeterRecordComponent /> */}
      </div>

      {/* <div className="mb-5">
        <RadioComponent />
      </div> */}

      {/* <CheckboxComponent /> */}

      <SliderComponent />
    </main>
  )
}

export default App
