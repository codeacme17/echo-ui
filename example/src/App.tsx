import { useState } from 'react'
import { useTheme } from './components/theme-provider'
import { KnobComponent } from './components/Controls/Konb'

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

      <KnobComponent size={size} />
    </main>
  )
}

export default App
