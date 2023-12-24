import { Spectrum } from 'echo-ui'
import { useEffect, useState } from 'react'

export const EchoSpectrum = () => {
  const [data, setData] = useState<{ frequency: number; amplitude: number }[]>([])
  useEffect(() => {
    const ti = setInterval(() => {
      const newData = Array.from({ length: 50 }, (_, i) => ({
        frequency: i,
        amplitude: Math.random() * 10,
      }))

      setData(newData)
    }, 1000)

    return () => {
      clearInterval(ti)
    }
  }, [])

  return <Spectrum data={data} />
}
