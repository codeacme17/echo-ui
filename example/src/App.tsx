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
import { DynamicSlider, HorizontalSlider } from './components/controls/Slider'

function App() {
  const { theme, setTheme } = useTheme()

  return (
    <main className="flex flex-col gap-10 items-center py-5 dark:bg-background">
      <div className="flex w-full">
        <button
          className="mb-2 text-foreground ml-auto mr-10"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          {theme === 'light' ? <Sun /> : <Moon />}
        </button>
      </div>

      <KnobComponent />

      <div className="flex gap-6">
        <VuMeterMonoComponent />
        <VuMeterStereoComponent />
      </div>

      <VuMeterRecordComponent />

      {/* <div className="my-10"></div> */}

      {/* <RadioComponent /> */}

      {/* <CheckboxComponent /> */}

      <HorizontalSlider />

      <DynamicSlider />
    </main>
  )
}

export default App
