import { useTheme } from './components/theme-provider'
import { Knob } from '@/copmponent/control/Knob'

function App() {
  const { theme, setTheme } = useTheme()

  return (
    <main className="h-screen flex flex-col items-center pt-5 dark:bg-background ">
      <button
        className="mb-10 text-foreground"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Dark Mode
      </button>

      <Knob label="Knob" className="" value={10} />
    </main>
  )
}

export default App
