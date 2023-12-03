import { useEffect, useState } from 'react'
import { scaleLinear } from 'd3'
import { cn } from '@/lib/utils'
import './index.css'

interface VuMeterProps extends React.HTMLAttributes<HTMLDivElement> {
  dB: number
  colors?: Colors
  lumpQuantity?: number
  onDBChange?: (value: number) => void
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

const MAX = 6
const MAX_THRESHOLD = 0
const MIN_THRESHOLD = -16
const MIN = -60

export const VuMeter = ({
  dB = MIN,
  onDBChange,
  colors = {
    lowColor: '#76f77c',
    mediumColor: '#f7f77c',
    highColor: '#f7a57c',
  },
  className,
  lumpQuantity = 30,
}: VuMeterProps) => {
  const [lumps, setLumps] = useState<LumpValue[]>(Array(lumpQuantity).fill(0))

  const scale = scaleLinear().domain([MIN, MAX]).range([0, lumps.length])
  const dBValue = scale(dB)
  const minThresholdValue = scale(MIN_THRESHOLD)
  const maxThresholdValue = scale(MAX_THRESHOLD)

  useEffect(() => {
    onDBChange && onDBChange(dB)

    const newLumps = lumps.map((_, index) => (index < dBValue ? 1 : 0))

    setLumps(newLumps)
  }, [dBValue, onDBChange])

  const getLumpColor = (index: number, lumpValue: LumpValue) => {
    if (lumpValue === 0) return 'var(--muted)'
    if (index < minThresholdValue) return colors.lowColor
    if (index < maxThresholdValue) return colors.mediumColor
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
