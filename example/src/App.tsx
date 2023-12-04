import { useState } from 'react'
import { useTheme } from './components/theme-provider'
// import { KnobComponent } from './components/controls/Konb'
import {
  VuMeterMonoComponent,
  VuMeterSteroComponent,
} from './components/visualizaion/VuMeter'

function App() {
  const { theme, setTheme } = useTheme()

  const [size, setSize] = useState<'small' | 'medium' | 'large'>('medium')

  return (
    <main className="h-screen flex flex-col items-center pt-5 dark:bg-background ">
      <button
        className="mb-2 text-foreground"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Dark Mode
      </button>
      <button
        className="mb-5 text-foreground"
        onClick={() => setSize(size === 'medium' ? 'large' : 'medium')}>
        Size
      </button>

      {/* <KnobComponent size={size} /> */}
      <div className="flex gap-4">
        <VuMeterMonoComponent />
        <VuMeterSteroComponent />
      </div>
    </main>
  )
}

export default App
