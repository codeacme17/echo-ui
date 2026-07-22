import type { FC } from 'react'
import { hookNames } from '../../hook-manifest.mjs'
import { ApiTable, localizedText as text, type ApiSection, type Locale } from './api-reference'

export type HookName = (typeof hookNames)[number]

type HookApiDefinition = Readonly<{
  parameters: ApiSection
  returns: ApiSection
}>

const definitions: Record<HookName, HookApiDefinition> = {
  useFetchAudio: {
    parameters: {
      name: 'UseFetchAudioProps',
      inherited: text(
        'Configuration for requesting and decoding one audio resource.',
        '用于请求并解码单个音频资源的配置。',
      ),
      rows: [
        {
          name: 'url',
          type: 'string',
          defaultValue: '—',
          required: true,
          description: text('Relative or absolute audio URL.', '音频资源的相对或绝对地址。'),
        },
        {
          name: 'requestOptions',
          type: 'RequestInit',
          defaultValue: '—',
          description: text('Options passed to fetch.', '传递给 fetch 的请求选项。'),
        },
        {
          name: 'onSuccess',
          type: '() => void',
          defaultValue: '—',
          description: text('Runs after a successful request.', '请求成功后调用。'),
        },
        {
          name: 'onError',
          type: '() => void',
          defaultValue: '—',
          description: text('Runs when requesting or decoding fails.', '请求或解码失败时调用。'),
        },
      ],
    },
    returns: {
      name: 'Return object',
      inherited: text(
        'Request state, decoded audio, and the command that starts the request.',
        '包含请求状态、解码后的音频以及启动请求的方法。',
      ),
      rows: [
        {
          name: 'fetchAudio',
          type: '() => Promise<void>',
          defaultValue: '—',
          description: text('Requests and decodes the configured URL.', '请求并解码配置的地址。'),
        },
        {
          name: 'audioBuffer',
          type: 'AudioBuffer | null',
          defaultValue: 'null',
          description: text('Decoded audio data when available.', '解码成功后的音频数据。'),
        },
        {
          name: 'pending',
          type: 'boolean',
          defaultValue: 'true',
          description: text('Whether the initial request is pending.', '初始请求是否处于等待状态。'),
        },
        {
          name: 'fetched',
          type: 'boolean',
          defaultValue: 'false',
          description: text('Whether the response was successful.', '响应是否成功。'),
        },
        {
          name: 'error',
          type: 'boolean',
          defaultValue: 'false',
          description: text('Whether requesting or decoding failed.', '请求或解码是否失败。'),
        },
        {
          name: 'errorMessage',
          type: 'string',
          defaultValue: "''",
          description: text('Failure details suitable for diagnostics.', '用于诊断的失败详情。'),
        },
        {
          name: 'response',
          type: 'Response | null',
          defaultValue: 'null',
          description: text('The fetch response when one was received.', '收到响应时对应的 fetch Response。'),
        },
      ],
    },
  },
  useOscilloscope: {
    parameters: {
      name: 'UseOscilloscopeProps',
      inherited: text('Configuration for a waveform analyser.', '波形分析器的配置。'),
      rows: [
        {
          name: 'fftSize',
          type: 'number',
          defaultValue: '1024',
          description: text(
            'Power-of-two analyser size from 16 through 16384.',
            '16 到 16384 之间、且为 2 的幂的分析器大小。',
          ),
        },
        {
          name: 'onReady',
          type: '() => void',
          defaultValue: '—',
          description: text('Runs after init creates the analyser.', 'init 创建分析器后调用。'),
        },
        {
          name: 'onError',
          type: '() => void',
          defaultValue: '—',
          description: text('Runs when analyser work fails.', '分析器操作失败时调用。'),
        },
      ],
    },
    returns: {
      name: 'Return object',
      inherited: text('Waveform analyser state and lifecycle commands.', '波形分析器状态与生命周期方法。'),
      rows: [
        {
          name: 'init',
          type: '() => void',
          defaultValue: '—',
          description: text('Creates the Tone waveform analyser.', '创建 Tone 波形分析器。'),
        },
        {
          name: 'analyser',
          type: 'MutableRefObject<Tone.Analyser | null>',
          defaultValue: 'null',
          description: text('Analyser node to connect to the source chain.', '连接到音频源链的分析器节点。'),
        },
        {
          name: 'data',
          type: 'OscilloscopeDataPoint[]',
          defaultValue: '[]',
          description: text('Latest indexed time-domain samples.', '最新的带索引时域采样。'),
        },
        {
          name: 'getData',
          type: '() => void',
          defaultValue: '—',
          description: text('Reads one waveform frame.', '读取一帧波形数据。'),
        },
        {
          name: 'observer',
          type: '() => void',
          defaultValue: '—',
          description: text('Starts requestAnimationFrame sampling.', '启动 requestAnimationFrame 采样。'),
        },
        {
          name: 'cancelObserve',
          type: '() => void',
          defaultValue: '—',
          description: text('Stops sampling and clears data.', '停止采样并清空数据。'),
        },
        {
          name: 'error',
          type: 'boolean',
          defaultValue: 'false',
          description: text('Whether analyser work failed.', '分析器操作是否失败。'),
        },
        {
          name: 'errorMessage',
          type: 'string',
          defaultValue: "''",
          description: text('Failure details.', '失败详情。'),
        },
      ],
    },
  },
  usePlayer: {
    parameters: {
      name: 'UsePlayerProps',
      inherited: text('Initial playback values and lifecycle callbacks.', '初始播放值与生命周期回调。'),
      rows: [
        {
          name: 'volume',
          type: 'number',
          defaultValue: '5',
          description: text('Initial gain in decibels.', '初始增益（分贝）。'),
        },
        {
          name: 'loop',
          type: 'boolean',
          defaultValue: 'false',
          description: text('Whether playback repeats.', '是否循环播放。'),
        },
        {
          name: 'mute',
          type: 'boolean',
          defaultValue: 'false',
          description: text('Whether playback starts muted.', '是否以静音状态开始。'),
        },
        ...['onReady', 'onPlay', 'onPause', 'onStop', 'onFinish', 'onError'].map((name) => ({
          name,
          type: '() => void',
          defaultValue: '—',
          description: text(
            `Runs for the ${name.slice(2).toLowerCase()} lifecycle event.`,
            `在 ${name.slice(2).toLowerCase()} 生命周期事件发生时调用。`,
          ),
        })),
      ],
    },
    returns: {
      name: 'Return object',
      inherited: text('Player state, controls, and observation commands.', '播放器状态、控制与监听方法。'),
      rows: [
        {
          name: 'init',
          type: '(audioBuffer: AudioBuffer, chain?: Tone.InputNode[]) => void',
          defaultValue: '—',
          description: text('Creates a player and connects its node chain.', '创建播放器并连接节点链。'),
        },
        {
          name: 'player',
          type: 'MutableRefObject<Tone.Player | null>',
          defaultValue: 'null',
          description: text('Underlying Tone Player.', '底层 Tone Player。'),
        },
        {
          name: 'audioDuration',
          type: 'MutableRefObject<number>',
          defaultValue: '0',
          description: text('Loaded duration in seconds.', '已加载音频时长（秒）。'),
        },
        ...[
          ['isReady', 'boolean', 'false', 'Whether init completed.', 'init 是否完成。'],
          ['isPlaying', 'boolean', 'false', 'Whether playback is active.', '是否正在播放。'],
          ['isFinish', 'boolean', 'false', 'Whether playback reached the end.', '播放是否已结束。'],
          ['volume', 'number', '5', 'Current gain in decibels.', '当前增益（分贝）。'],
          ['loop', 'boolean', 'false', 'Current loop setting.', '当前循环设置。'],
          ['mute', 'boolean', 'false', 'Current mute setting.', '当前静音设置。'],
          ['time', 'number', '0', 'Observed playback time in seconds.', '监听到的播放时间（秒）。'],
          ['percentage', 'number', '0', 'Observed progress from 0 to 100.', '0 到 100 的播放进度。'],
          ['pickTime', 'MutableRefObject<number>', '0', 'Requested playback offset.', '请求的播放偏移量。'],
        ].map(([name, type, defaultValue, en, zh]) => ({
          name,
          type,
          defaultValue,
          description: text(en, zh),
        })),
        ...[
          ['play', '() => void', 'Starts or resumes playback.', '开始或继续播放。'],
          ['pause', '() => void', 'Pauses and keeps the current offset.', '暂停并保留当前位置。'],
          ['stop', '() => void', 'Stops and resets playback.', '停止并重置播放。'],
          ['getTime', '() => void', 'Reads the current time into state.', '将当前时间读取到状态中。'],
          ['setPickTime', '(time: number) => void', 'Sets the next playback offset.', '设置下一次播放偏移量。'],
          ['setVolume', 'Dispatch<SetStateAction<number>>', 'Updates gain.', '更新增益。'],
          ['setLoop', 'Dispatch<SetStateAction<boolean>>', 'Updates loop mode.', '更新循环模式。'],
          ['setMute', 'Dispatch<SetStateAction<boolean>>', 'Updates mute mode.', '更新静音模式。'],
          ['observe', '() => void', 'Starts animation-frame progress updates.', '启动动画帧进度更新。'],
          ['cancelObserve', '() => void', 'Stops progress updates.', '停止进度更新。'],
        ].map(([name, type, en, zh]) => ({
          name,
          type,
          defaultValue: '—',
          description: text(en, zh),
        })),
        {
          name: 'error',
          type: 'boolean',
          defaultValue: 'false',
          description: text('Whether player work failed.', '播放器操作是否失败。'),
        },
        {
          name: 'errorMessage',
          type: 'string',
          defaultValue: "''",
          description: text('Failure details.', '失败详情。'),
        },
      ],
    },
  },
  useSpectrogram: {
    parameters: {
      name: 'UseSpectrogramProps',
      inherited: text('Configuration for an FFT analyser.', 'FFT 分析器的配置。'),
      rows: [
        {
          name: 'fftSize',
          type: 'number',
          defaultValue: '1024',
          description: text(
            'Power-of-two analyser size from 16 through 16384.',
            '16 到 16384 之间、且为 2 的幂的分析器大小。',
          ),
        },
        {
          name: 'onReady',
          type: '() => void',
          defaultValue: '—',
          description: text('Optional ready callback.', '可选的就绪回调。'),
        },
        {
          name: 'onError',
          type: '() => void',
          defaultValue: '—',
          description: text('Optional error callback.', '可选的错误回调。'),
        },
      ],
    },
    returns: {
      name: 'Return object',
      inherited: text('FFT analyser state and lifecycle commands.', 'FFT 分析器状态与生命周期方法。'),
      rows: [
        {
          name: 'init',
          type: '() => void',
          defaultValue: '—',
          description: text('Creates the Tone FFT analyser.', '创建 Tone FFT 分析器。'),
        },
        {
          name: 'analyser',
          type: 'MutableRefObject<Tone.Analyser | null>',
          defaultValue: 'null',
          description: text('Analyser node to connect to the source chain.', '连接到音频源链的分析器节点。'),
        },
        {
          name: 'data',
          type: 'SpectrogramDataPoint[]',
          defaultValue: '[]',
          description: text('Latest frequency-bin amplitudes.', '最新的频率分箱振幅。'),
        },
        {
          name: 'getData',
          type: '() => void',
          defaultValue: '—',
          description: text('Reads one FFT frame.', '读取一帧 FFT 数据。'),
        },
        {
          name: 'observe',
          type: '() => void',
          defaultValue: '—',
          description: text('Starts requestAnimationFrame sampling.', '启动 requestAnimationFrame 采样。'),
        },
        {
          name: 'cancelObserve',
          type: '() => void',
          defaultValue: '—',
          description: text('Stops sampling and clears data.', '停止采样并清空数据。'),
        },
        {
          name: 'error',
          type: 'boolean',
          defaultValue: 'false',
          description: text('Whether analyser work failed.', '分析器操作是否失败。'),
        },
        {
          name: 'errorMessage',
          type: 'string',
          defaultValue: "''",
          description: text('Failure details.', '失败详情。'),
        },
      ],
    },
  },
  useVuMeter: {
    parameters: {
      name: 'UseVuMeterProps',
      inherited: text('Initial mono or stereo meter state and callbacks.', '初始单声道或立体声电平与回调。'),
      rows: [
        {
          name: 'value',
          type: 'number | number[]',
          defaultValue: '—',
          required: true,
          description: text('Initial mono value or stereo pair in dB.', '初始单声道值或立体声分贝值对。'),
        },
        {
          name: 'onReady',
          type: '() => void',
          defaultValue: '—',
          description: text('Runs after init creates the meter.', 'init 创建电平表后调用。'),
        },
        {
          name: 'onError',
          type: '() => void',
          defaultValue: '—',
          description: text('Runs when meter work fails.', '电平表操作失败时调用。'),
        },
      ],
    },
    returns: {
      name: 'Return object',
      inherited: text('Meter state and lifecycle commands.', '电平表状态与生命周期方法。'),
      rows: [
        {
          name: 'init',
          type: '() => void',
          defaultValue: '—',
          description: text('Creates a one- or two-channel Tone 15 meter.', '创建单声道或双声道 Tone 15 电平表。'),
        },
        {
          name: 'meter',
          type: 'MutableRefObject<Tone.Meter | null>',
          defaultValue: 'null',
          description: text('Node to connect to the source chain.', '连接到音频源链的节点。'),
        },
        {
          name: 'value',
          type: 'number | number[]',
          defaultValue: 'input value',
          description: text('Latest mono or stereo reading.', '最新的单声道或立体声读数。'),
        },
        {
          name: 'getValue',
          type: '() => void',
          defaultValue: '—',
          description: text('Reads one meter value.', '读取一次电平值。'),
        },
        {
          name: 'observe',
          type: '() => void',
          defaultValue: '—',
          description: text('Starts requestAnimationFrame readings.', '启动 requestAnimationFrame 读数。'),
        },
        {
          name: 'cancelObserve',
          type: '() => void',
          defaultValue: '—',
          description: text('Stops readings and restores the initial value.', '停止读数并恢复初始值。'),
        },
        {
          name: 'error',
          type: 'boolean',
          defaultValue: 'false',
          description: text('Whether meter work failed.', '电平表操作是否失败。'),
        },
        {
          name: 'errorMessage',
          type: 'string',
          defaultValue: "''",
          description: text('Failure details.', '失败详情。'),
        },
      ],
    },
  },
  useWaveform: {
    parameters: {
      name: 'UseWaveformProps',
      inherited: text('Configuration for simplifying decoded audio.', '简化已解码音频的配置。'),
      rows: [
        {
          name: 'audioBuffer',
          type: 'AudioBuffer | null',
          defaultValue: '—',
          required: true,
          description: text('Decoded source audio.', '已解码的源音频。'),
        },
        {
          name: 'channel',
          type: '1 | 2',
          defaultValue: '2',
          description: text('Number of channels to simplify.', '要简化的声道数量。'),
        },
        {
          name: 'samples',
          type: 'number',
          defaultValue: '1024',
          description: text('Output sample count per channel.', '每个声道的输出采样数量。'),
        },
      ],
    },
    returns: {
      name: 'Return object',
      inherited: text('Simplified waveform data and processing state.', '简化后的波形数据与处理状态。'),
      rows: [
        {
          name: 'data',
          type: 'number[] | number[][]',
          defaultValue: '[]',
          description: text('One mono array or an array per channel.', '一个单声道数组或每声道一个数组。'),
        },
        {
          name: 'audioDuration',
          type: 'MutableRefObject<number>',
          defaultValue: '0',
          description: text('Buffer duration in seconds.', '缓冲区时长（秒）。'),
        },
        {
          name: 'error',
          type: 'boolean',
          defaultValue: 'false',
          description: text('Whether waveform processing failed.', '波形处理是否失败。'),
        },
        {
          name: 'errorMessage',
          type: 'string',
          defaultValue: "''",
          description: text('Failure details.', '失败详情。'),
        },
      ],
    },
  },
}

type HookApiProps = Readonly<{
  hook: HookName
  lang: Locale
  section: keyof HookApiDefinition
}>

export const HookApi: FC<HookApiProps> = ({ hook, lang, section }) => (
  <div data-hook-api={hook} data-hook-api-section={section}>
    <ApiTable lang={lang} section={definitions[hook][section]} />
  </div>
)
