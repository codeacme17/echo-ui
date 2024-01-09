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
import { HorizontalSlider } from './components/controls/EchoSlider'
import { EchoIndicatorLight } from './components/visualizaion/EchoIndicatorLight'
import { EchoCard } from './components/container/EchoCard'
import { EchoButton } from './components/controls/EchoButton'
import { EchoSwitch } from './components/controls/EchoSwitch'
import { EchoSpectrum, SpectrumDefault } from './components/visualizaion/EchoSpectrum'
import { UncontrolledSlider } from './components/controls/UncontrolledSlider'
import { EchoOsci } from './components/visualizaion/EchoOsci'

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

      <div className="mt-10"></div>

      <EchoSwitch />

      <EchoButton />

      <EchoSpectrum />

      <EchoOsci />

      {/* <SpectrumDefault /> */}

      <EchoCard />

      <InputComponent />

      <EchoIndicatorLight />

      <KnobComponent />

      <VuMeterMono />
      <VueMeterStereo />
      <VuMeterRecord />

      <RadioComponent />

      <CheckboxComponent />

      <HorizontalSlider />

      <UncontrolledSlider />
    </main>
  )
}

export default App
