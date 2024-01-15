import React from 'react'
import { APITable, APITableDataType } from '.'
import { Code } from '@nextui-org/react'

export const SpectrogramAPITable = () => {
  const data: APITableDataType[] = [
    {
      attribute: 'data*',
      description: 'Array data passed to the spectrogram(required)',
      type: <Code>SpectrogramDataPoint[]</Code>,
      default: '-',
    },
    {
      attribute: 'fftSize',
      description: 'Size of the Fast Fourier Transform (FFT) (must be a power of 2)',
      type: <Code>number</Code>,
      default: <Code>1024</Code>,
    },
    {
      attribute: 'amplitudeRange',
      description: 'Amplitude range, this property specifies the range of the Y-axis',
      type: <Code>[number, number]</Code>,
      default: <Code>[-100, 10]</Code>,
    },
    {
      attribute: 'lineColor',
      description: 'Line color',
      type: <Code>string</Code>,
      default: <Code>'var(--echo-primary)'</Code>,
    },
    {
      attribute: 'lineWidth',
      description: 'Line width',
      type: <Code>number</Code>,
      default: <Code>2</Code>,
    },
    {
      attribute: 'axis',
      description: 'Whether to display the axis',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'axisColor',
      description: 'Axis font color',
      type: <Code>string</Code>,
      default: <Code>'var(--echo-muted-foreground)'</Code>,
    },
    {
      attribute: 'xAxisTicks',
      description: 'Ticks displayed on the X-axis',
      type: <Code>number[]</Code>,
      default: <Code>[50, 100, 200, 500, 1000, 2000, 5000, 10000]</Code>,
    },
    {
      attribute: 'yAxisTicks',
      description: 'Ticks displayed on the Y-axis',
      type: <Code>number[]</Code>,
      default: <Code>[-80, -60, -20, 0]</Code>,
    },
    {
      attribute: 'grid',
      description: 'Whether to display grid lines',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'gridColor',
      description: 'Grid line color',
      type: <Code>string</Code>,
      default: <Code>'var(--echo-background)'</Code>,
    },
    {
      attribute: 'shadow',
      description: 'Whether to display shadow',
      type: <Code>boolean</Code>,
      default: <Code>false</Code>,
    },
    {
      attribute: 'shadowColor',
      description: 'Shadow color',
      type: <Code>string</Code>,
      default: <Code>'var(--echo-primary)'</Code>,
    },
    {
      attribute: 'shadowDirection',
      description: 'Shadow direction',
      type: <Code>'top' | 'bottom'</Code>,
      default: <Code>'bottom'</Code>,
    },
    {
      attribute: 'shadowHeight',
      description: 'Shadow height',
      type: <Code>number</Code>,
      default: <Code>20</Code>,
    },
  ]

  return <APITable data={data} />
}
