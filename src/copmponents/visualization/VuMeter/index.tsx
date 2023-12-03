import { useEffect, useState } from 'react'
import { scaleLinear } from 'd3'
import { cn } from '@/lib/utils'
import './index.css'

interface VuMeterProps extends React.HTMLAttributes<HTMLDivElement> {
  volumn: number
  onVolumnChange?: (value: number) => void
  colors: Colors
  gate?: number
  min?: number
  max?: number
  lumpQuantity?: number
}

type Colors = {
  lowColor: string
  mediumColor: string
  highColor: string
  lowColorDark?: string
  mediumColorDark?: string
  highColorDark?: string
}

type LumpValue = 0 | 1

export const VuMeter = ({
  volumn = 0,
  onVolumnChange,
  colors = {
    lowColor: '#76f77c',
    mediumColor: '#f7f77c',
    highColor: '#f7a57c',
  },
  className,
  min = -60,
  max = 20,
  gate = 0,
  lumpQuantity = 30,
}: VuMeterProps) => {
  const [lumps, setLumps] = useState<LumpValue[]>(Array(lumpQuantity).fill(0))
  const scale = scaleLinear().domain([min, max]).range([0, lumps.length])
  const volumeValue = scale(volumn)
  const gateValue = scale(gate)

  useEffect(() => {
    onVolumnChange && onVolumnChange(volumn)

    const newLumps = lumps.map((_, index) => (index < volumeValue ? 1 : 0))
    setLumps(newLumps)
  }, [volumeValue, onVolumnChange])

  const getLumpColor = (index: number, lumpValue: LumpValue) => {
    if (lumpValue === 0) return 'muted'

    if (index < gateValue) return colors.lowColor
    if (index < (lumps.length * 8.5) / 10) return colors.mediumColor
    return colors.highColor
  }

  return (
    <div className="vumeter">
      {lumps.map((lumpValue: LumpValue, index: number) => (
        <div
          key={index}
          className={cn('vumeter-lump', className)}
          style={{ backgroundColor: getLumpColor(index, lumpValue) }}
        />
      ))}
    </div>
  )
}
