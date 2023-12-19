// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Moon, Sun } from 'lucide-react'
import { useTheme } from './components/theme-provider'

import { InputComponent } from './components/controls/EchoInput'
import { VuMeterMono, VueMeterStereo, VuMeterRecord } from './components/visualizaion/VuMeter'
import { KnobComponent } from './components/controls/EchoKonb'
import { RadioComponent } from './components/controls/EchoRadio'
import { CheckboxComponent } from './components/controls/EchoCheckbox'
import { DynamicSlider, HorizontalSlider } from './components/controls/EchoSlider'
import { EchoIndicatorLight } from './components/visualizaion/EchoIndicatorLight'
import { EchoCard } from './components/container/EchoCard'

function App() {
  const { theme, setTheme } = useTheme()

  return (
    <main className="flex flex-col gap-10 items-center py-5 dark:bg-background">
      <div className="flex w-full px-8 fixed">
        <img src="/logo.svg" alt="" className="w-10 h-10" />

        <button
          className="mb-2 text-foreground ml-auto"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          {theme === 'light' ? <Sun /> : <Moon />}
        </button>
      </div>

      <div className="mt-20"></div>

      <EchoCard />

      <InputComponent />

      <EchoIndicatorLight />

      <KnobComponent />

      <div className="flex gap-10">
        <VuMeterMono />
        <VueMeterStereo />
        <VuMeterRecord />
      </div>

      <RadioComponent />

      <CheckboxComponent />

      <HorizontalSlider />

      <DynamicSlider />
    </main>
  )
}

export default App
