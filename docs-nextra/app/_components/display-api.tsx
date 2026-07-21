import type { FC } from 'react'
import { ApiTable, localizedText as text, type ApiSection, type Locale } from './api-reference'

export type DisplayName =
  'lfo' | 'light' | 'oscilloscope' | 'spectrogram' | 'vumeter' | 'waveform' | 'card'

type DisplayApiDefinition = Readonly<{
  main: ApiSection
  compound?: readonly ApiSection[]
}>

const definitions: Record<DisplayName, DisplayApiDefinition> = {
  lfo: {
    main: {
      name: 'LFO',
      inherited: text(
        'Also accepts React.HTMLAttributes<HTMLDivElement>. The visualization fills its parent and forwards className and style.',
        '同时接受 React.HTMLAttributes<HTMLDivElement>。可视化会填满父容器，并透传 className 与 style。',
      ),
      rows: [
        {
          name: 'frequency',
          type: 'number',
          defaultValue: '1',
          description: text(
            'Number of waveform cycles across the graph.',
            '图表中显示的波形周期数。',
          ),
        },
        {
          name: 'amplitude',
          type: 'number',
          defaultValue: '0.5',
          description: text(
            'Normalized amplitude, clamped from 0 to 1.',
            '归一化振幅，限制在 0 到 1。',
          ),
        },
        {
          name: 'delay',
          type: 'number',
          defaultValue: '0',
          description: text(
            'Flat lead-in before the waveform, clamped from 0 to 1000 milliseconds.',
            '波形前的平直延迟，限制在 0 到 1000 毫秒。',
          ),
        },
        {
          name: 'type',
          type: "'sine' | 'square' | 'triangle'",
          defaultValue: "'sine'",
          description: text('Waveform shape.', '波形形状。'),
        },
        {
          name: 'lineColor',
          type: 'string',
          defaultValue: 'var(--echo-primary)',
          description: text('CSS color used for the waveform.', '波形使用的 CSS 颜色。'),
        },
        {
          name: 'lineWidth',
          type: 'number',
          defaultValue: '3',
          description: text('Waveform stroke width in pixels.', '波形描边宽度（像素）。'),
        },
      ],
    },
  },
  light: {
    main: {
      name: 'Light',
      inherited: text(
        'Also accepts React.HTMLAttributes<HTMLDivElement>. Add an accessible text status when color or glow communicates application state.',
        '同时接受 React.HTMLAttributes<HTMLDivElement>。当颜色或发光表示应用状态时，请提供可访问的文字状态。',
      ),
      rows: [
        {
          name: 'on',
          type: 'boolean',
          defaultValue: 'false',
          description: text('Controls the illuminated state.', '控制指示灯是否点亮。'),
        },
        {
          name: 'size',
          type: 'number | string',
          defaultValue: "'0.75rem'",
          description: text('Sets both width and height.', '同时设置宽度和高度。'),
        },
        {
          name: 'color',
          type: 'string',
          defaultValue: 'var(--echo-primary)',
          description: text(
            'CSS color for the active fill and glow.',
            '点亮填充与光晕使用的 CSS 颜色。',
          ),
        },
      ],
    },
  },
  oscilloscope: {
    main: {
      name: 'Oscilloscope',
      inherited: text(
        'Also accepts React.HTMLAttributes<HTMLDivElement>. Supply indexed time-domain samples from an AnalyserNode.',
        '同时接受 React.HTMLAttributes<HTMLDivElement>。请传入来自 AnalyserNode 的带索引时域采样。',
      ),
      rows: [
        {
          name: 'data',
          type: 'OscilloscopeDataPoint[]',
          defaultValue: '—',
          required: true,
          description: text('Indexed amplitude samples to draw.', '要绘制的带索引振幅采样。'),
        },
        {
          name: 'amplitudeRange',
          type: '[number, number]',
          defaultValue: '[-2, 2]',
          description: text(
            'Minimum and maximum values on the vertical scale.',
            '纵向刻度的最小值与最大值。',
          ),
        },
        {
          name: 'lineColor',
          type: 'string',
          defaultValue: 'var(--echo-primary)',
          description: text('CSS color used for the trace.', '轨迹使用的 CSS 颜色。'),
        },
        {
          name: 'lineWidth',
          type: 'number',
          defaultValue: '3',
          description: text('Trace width in pixels.', '轨迹宽度（像素）。'),
        },
      ],
    },
  },
  spectrogram: {
    main: {
      name: 'Spectrogram',
      inherited: text(
        'Also accepts React.HTMLAttributes<HTMLDivElement>. The component plots one FFT frame as a logarithmic frequency spectrum.',
        '同时接受 React.HTMLAttributes<HTMLDivElement>。组件会将一帧 FFT 数据绘制为对数频率频谱。',
      ),
      rows: [
        {
          name: 'data',
          type: 'SpectrogramDataPoint[]',
          defaultValue: '—',
          required: true,
          description: text('Frequency-bin amplitudes to draw.', '要绘制的频率分箱振幅。'),
        },
        {
          name: 'fftSize',
          type: 'number',
          defaultValue: '1024',
          description: text(
            'Number of analyser bins used to map indexes to hertz; use data.length for native AnalyserNode output.',
            '用于将索引映射为赫兹的分析器分箱数量；使用原生 AnalyserNode 输出时请传入 data.length。',
          ),
        },
        {
          name: 'amplitudeRange',
          type: '[number, number]',
          defaultValue: '[-100, 10]',
          description: text('Displayed decibel range.', '显示的分贝范围。'),
        },
        {
          name: 'lineColor',
          type: 'string',
          defaultValue: 'var(--echo-primary)',
          description: text('CSS color used for the spectrum trace.', '频谱轨迹使用的 CSS 颜色。'),
        },
        {
          name: 'lineWidth',
          type: 'number',
          defaultValue: '2',
          description: text('Spectrum trace width in pixels.', '频谱轨迹宽度（像素）。'),
        },
        {
          name: 'axis',
          type: 'boolean',
          defaultValue: 'false',
          description: text('Shows frequency and amplitude axes.', '显示频率轴与振幅轴。'),
        },
        {
          name: 'axisColor',
          type: 'string',
          defaultValue: 'var(--echo-muted-foreground)',
          description: text('CSS color for axes and labels.', '坐标轴与标签使用的 CSS 颜色。'),
        },
        {
          name: 'xAxisTicks',
          type: 'number[]',
          defaultValue: '[50, 100, 200, 500, 1000, 2000, 5000, 10000]',
          description: text('Frequency tick values in hertz.', '以赫兹为单位的频率刻度值。'),
        },
        {
          name: 'yAxisTicks',
          type: 'number[]',
          defaultValue: '[-80, -60, -20, 0]',
          description: text('Amplitude tick values in decibels.', '以分贝为单位的振幅刻度值。'),
        },
        {
          name: 'grid',
          type: 'boolean',
          defaultValue: 'false',
          description: text('Draws grid lines at configured ticks.', '在配置的刻度处绘制网格线。'),
        },
        {
          name: 'gridColor',
          type: 'string',
          defaultValue: 'var(--echo-background)',
          description: text('CSS color for grid lines.', '网格线使用的 CSS 颜色。'),
        },
        {
          name: 'shadow',
          type: 'boolean',
          defaultValue: 'false',
          description: text(
            'Fills the area above or below the spectrum.',
            '填充频谱上方或下方区域。',
          ),
        },
        {
          name: 'shadowColor',
          type: 'string',
          defaultValue: 'var(--echo-primary)',
          description: text(
            'CSS color at the solid edge of the fill.',
            '填充实色边缘使用的 CSS 颜色。',
          ),
        },
        {
          name: 'shadowDirection',
          type: "'top' | 'bottom'",
          defaultValue: "'bottom'",
          description: text('Chooses the fill direction.', '选择填充方向。'),
        },
        {
          name: 'shadowHeight',
          type: 'number',
          defaultValue: '20',
          description: text('Gradient stop position as a percentage.', '渐变停止位置（百分比）。'),
        },
      ],
    },
  },
  vumeter: {
    main: {
      name: 'VuMeter',
      inherited: text(
        'Also accepts React.HTMLAttributes<HTMLDivElement> except the native onChange. Pass one dB value for mono or two for stereo.',
        '同时接受除原生 onChange 外的 React.HTMLAttributes<HTMLDivElement>。传入一个分贝值表示单声道，两个值表示立体声。',
      ),
      rows: [
        {
          name: 'value',
          type: 'number | number[]',
          defaultValue: '—',
          required: true,
          description: text(
            'Current mono or stereo level in dB, expected between -60 and 5.',
            '当前单声道或立体声音量（dB），预期范围为 -60 到 5。',
          ),
        },
        {
          name: 'horizontal',
          type: 'boolean',
          defaultValue: 'false',
          description: text('Lays the meter out horizontally.', '横向排列电平表。'),
        },
        {
          name: 'compact',
          type: 'boolean',
          defaultValue: 'false',
          description: text('Reduces spacing between meter parts.', '减小电平表各部分之间的间距。'),
        },
        {
          name: 'lumpsQuantity',
          type: 'number',
          defaultValue: '30',
          description: text(
            'Number of illuminated segments per channel.',
            '每个声道的发光分段数量。',
          ),
        },
        {
          name: 'hideAxis',
          type: 'boolean',
          defaultValue: 'false',
          description: text('Hides the decibel axis.', '隐藏分贝坐标轴。'),
        },
        {
          name: 'axisProps',
          type: "Omit<AxisProps, 'min' | 'max' | 'className' | 'style'>",
          defaultValue: '—',
          description: text(
            'Configures ticks and orientation on the built-in axis.',
            '配置内置坐标轴的刻度与方向。',
          ),
        },
        {
          name: 'classNames',
          type: '{ axis?: string; lump?: string; lumps?: string }',
          defaultValue: '—',
          description: text('Classes for named meter slots.', '电平表命名插槽的类名。'),
        },
        {
          name: 'styles',
          type: '{ axis?: CSSProperties; lump?: CSSProperties; lumps?: CSSProperties }',
          defaultValue: '—',
          description: text('Inline styles for named meter slots.', '电平表命名插槽的行内样式。'),
        },
        {
          name: 'onChange',
          type: '(value: number | number[]) => void',
          defaultValue: '—',
          description: text('Runs when the supplied value changes.', '传入值变化时调用。'),
        },
      ],
    },
  },
  waveform: {
    main: {
      name: 'Waveform',
      inherited: text(
        'Also accepts React.HTMLAttributes<HTMLDivElement> except native onClick and onMouseMove. Mono arrays are mirrored; a two-array value draws stereo data.',
        '同时接受除原生 onClick 与 onMouseMove 外的 React.HTMLAttributes<HTMLDivElement>。单数组会镜像绘制，双数组用于立体声数据。',
      ),
      rows: [
        {
          name: 'data',
          type: 'number[] | number[][]',
          defaultValue: '—',
          required: true,
          description: text('Normalized waveform peak samples.', '归一化的波形峰值采样。'),
        },
        {
          name: 'audioDuration',
          type: 'number',
          defaultValue: '—',
          required: true,
          description: text(
            'Audio duration in seconds for cursor labels and seek events.',
            '用于光标标签与定位事件的音频时长（秒）。',
          ),
        },
        {
          name: 'percentage',
          type: 'number',
          defaultValue: '0',
          description: text(
            'Controlled playback or selection progress from 0 to 100.',
            '0 到 100 的受控播放或选区进度。',
          ),
        },
        {
          name: 'hideCursor',
          type: 'boolean',
          defaultValue: 'false',
          description: text('Hides the hover cursor.', '隐藏悬停光标。'),
        },
        {
          name: 'cursorWidth',
          type: 'number',
          defaultValue: '2',
          description: text('Cursor width in pixels.', '光标宽度（像素）。'),
        },
        {
          name: 'cursorColor',
          type: 'string',
          defaultValue: 'var(--echo-muted-foreground)',
          description: text(
            'CSS color for the hover cursor and label.',
            '悬停光标与标签使用的 CSS 颜色。',
          ),
        },
        {
          name: 'hideCursorLabel',
          type: 'boolean',
          defaultValue: 'false',
          description: text('Hides the cursor time label.', '隐藏光标时间标签。'),
        },
        {
          name: 'disableAnimation',
          type: 'boolean',
          defaultValue: 'false',
          description: text('Disables the initial waveform reveal.', '禁用波形首次显示动画。'),
        },
        {
          name: 'animationDuration',
          type: 'number',
          defaultValue: '300',
          description: text(
            'Initial reveal duration in milliseconds.',
            '首次显示动画时长（毫秒）。',
          ),
        },
        {
          name: 'waveHeight',
          type: 'number',
          defaultValue: '100',
          description: text(
            'Wave height as a percentage of the container.',
            '波形高度占容器的百分比。',
          ),
        },
        {
          name: 'waveColor',
          type: 'string',
          defaultValue: 'var(--echo-wave)',
          description: text('CSS color for unplayed audio.', '未播放音频使用的 CSS 颜色。'),
        },
        {
          name: 'maskColor',
          type: 'string',
          defaultValue: 'var(--echo-primary)',
          description: text('CSS color for the played portion.', '已播放部分使用的 CSS 颜色。'),
        },
        {
          name: 'onClick',
          type: '(event: WaveformMouseEvent) => void',
          defaultValue: '—',
          description: text(
            'Reports time, percentage, and native event when seeking.',
            '定位时返回时间、百分比与原生事件。',
          ),
        },
        {
          name: 'onMouseMove',
          type: '(event: WaveformMouseEvent) => void',
          defaultValue: '—',
          description: text(
            'Reports the hovered time and percentage.',
            '返回悬停位置的时间与百分比。',
          ),
        },
        {
          name: 'onMouseLeave',
          type: '(event: React.MouseEvent) => void',
          defaultValue: '—',
          description: text('Runs when the pointer leaves the waveform.', '指针离开波形时调用。'),
        },
      ],
    },
  },
  card: {
    main: {
      name: 'Card',
      inherited: text(
        'Also accepts React.HTMLAttributes<HTMLDivElement>. Card is a compound component with Header and Body layout slots.',
        '同时接受 React.HTMLAttributes<HTMLDivElement>。Card 是包含 Header 与 Body 布局插槽的复合组件。',
      ),
      rows: [
        {
          name: 'toggled',
          type: 'boolean',
          defaultValue: 'false',
          description: text(
            'Controls the highlighted border and data-toggled attribute.',
            '控制高亮边框与 data-toggled 属性。',
          ),
        },
      ],
    },
    compound: [
      {
        name: 'Card.Header',
        inherited: text(
          'Accepts React.HTMLAttributes<HTMLDivElement>.',
          '接受 React.HTMLAttributes<HTMLDivElement>。',
        ),
        rows: [],
      },
      {
        name: 'Card.Body',
        inherited: text(
          'Accepts React.HTMLAttributes<HTMLDivElement>.',
          '接受 React.HTMLAttributes<HTMLDivElement>。',
        ),
        rows: [],
      },
    ],
  },
}

type DisplayApiProps = Readonly<{
  display: DisplayName
  lang: Locale
}>

export const DisplayApi: FC<DisplayApiProps> = ({ display, lang }) => {
  const definition = definitions[display]

  return (
    <div data-display-api={display}>
      <ApiTable lang={lang} section={definition.main} />
      {definition.compound?.map((section) => (
        <ApiTable key={section.name} lang={lang} section={section} />
      ))}
    </div>
  )
}
