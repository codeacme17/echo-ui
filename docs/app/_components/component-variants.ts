export type DocumentationLocale = 'en' | 'zh'

export type ComponentVariant<Id extends string = string> = Readonly<{
  id: Id
  label: Readonly<Record<DocumentationLocale, string>>
  source: string
}>

const variant = <const Id extends string>(
  id: Id,
  en: string,
  zh: string,
  source: string,
): ComponentVariant<Id> => ({ id, label: { en, zh }, source })

export const componentVariantInventory = {
  button: [
    variant('default', 'Default', '默认', '<Button>Button</Button>'),
    variant('toggled', 'Toggle State', '切换状态', '<Button toggled>Toggled</Button>'),
    variant('disabled', 'Disabled State', '禁用状态', '<Button disabled>Disabled</Button>'),
    variant(
      'sizes',
      'Size',
      '尺寸',
      '<Button size="sm">Small</Button>\n<Button size="md">Medium</Button>\n<Button size="lg">Large</Button>',
    ),
    variant(
      'radii',
      'Rounded Corners',
      '圆角',
      '<Button radius="none">None</Button>\n<Button radius="sm">Small</Button>\n<Button radius="md">Medium</Button>\n<Button radius="lg">Large</Button>\n<Button radius="full">Full</Button>',
    ),
    variant(
      'group',
      'Button Group',
      '按钮组',
      '<Button.Group value="sine">\n  <Button value="sine">Sine</Button>\n  <Button value="square">Square</Button>\n</Button.Group>',
    ),
  ],
  checkbox: [
    variant('default', 'Default', '默认', '<Checkbox>Normalize</Checkbox>'),
    variant('disabled', 'Disabled State', '禁用状态', '<Checkbox disabled>Disabled</Checkbox>'),
    variant(
      'sizes',
      'Size',
      '尺寸',
      '<Checkbox size="sm">Small</Checkbox>\n<Checkbox size="md">Medium</Checkbox>\n<Checkbox size="lg">Large</Checkbox>',
    ),
    variant(
      'colors',
      'Color',
      '颜色',
      '<Checkbox color="#8b5cf6">Violet</Checkbox>\n<Checkbox color="#10b981">Green</Checkbox>',
    ),
    variant(
      'group',
      'Checkbox Group',
      '多选组',
      '<Checkbox.Group value={["delay"]}>\n  <Checkbox value="delay">Delay</Checkbox>\n  <Checkbox value="reverb">Reverb</Checkbox>\n</Checkbox.Group>',
    ),
  ],
  envelope: [
    variant(
      'adsr',
      'ADSR Envelope',
      'ADSR 包络',
      '<Envelope data={{ attack: 0.1, decay: 0.3, sustain: 0.65, release: 0.5 }} />',
    ),
    variant(
      'ahdsr',
      'AHDSR Envelope',
      'AHDSR 包络',
      '<Envelope data={{ attack: 0.1, hold: 0.2, decay: 0.3, sustain: 0.65, release: 0.5 }} />',
    ),
    variant(
      'dadsr',
      'Delay',
      'Delay 延迟',
      '<Envelope data={{ delay: 0.2, attack: 0.1, decay: 0.3, sustain: 0.65, release: 0.5 }} />',
    ),
  ],
  input: [
    variant('default', 'Default', '默认', '<Input value={30} />'),
    variant('disabled', 'Disabled State', '禁用状态', '<Input disabled value={30} />'),
    variant('bilateral', 'Bilateral Mode', '双边模式', '<Input bilateral min={-50} max={50} />'),
    variant('text', 'Text Mode', '文本模式', '<Input type="text" value="Lead synth" />'),
    variant(
      'sizes',
      'Size',
      '尺寸',
      '<Input size="sm" />\n<Input size="md" />\n<Input size="lg" />',
    ),
    variant(
      'radii',
      'Rounded Corners',
      '圆角',
      '<Input radius="none" />\n<Input radius="md" />\n<Input radius="full" />',
    ),
    variant(
      'progress-color',
      'Progress Bar Color',
      '进度条颜色',
      '<Input progressColor="#8b5cf6" value={60} />',
    ),
    variant(
      'min-max',
      'Minimum and Maximum Values',
      '最小值与最大值',
      '<Input min={-60} max={12} value={-6} />',
    ),
    variant(
      'step',
      'Step and Sensitivity',
      '步进与灵敏度',
      '<Input min={0} max={100} step={5} sensitivity={5} />',
    ),
  ],
  knob: [
    variant('default', 'Default', '默认', '<Knob value={30} />'),
    variant('disabled', 'Disabled', '禁用状态', '<Knob disabled value={30} />'),
    variant(
      'bilateral',
      'Bilateral Rotation Mode',
      '双向旋转模式',
      '<Knob bilateral min={-50} max={50} />',
    ),
    variant(
      'range',
      'Rotation Angle Range',
      '旋转角度范围',
      '<Knob rotationRange={180} value={30} />',
    ),
    variant(
      'labels',
      'Labels',
      '标签',
      '<Knob topLabel="Volume" bottomLabel="-6 dB" value={30} />',
    ),
    variant(
      'step',
      'Step and Sensitivity',
      '步进与灵敏度',
      '<Knob step={20} sensitivity={1} min={-100} max={100} />',
    ),
    variant(
      'size',
      'Size-Related',
      '尺寸相关',
      '<Knob size={80} trackWidth={3} pointerWidth={7} pointerHeight={7} />',
    ),
    variant(
      'colors',
      'Color-Related',
      '颜色相关',
      '<Knob trackColor="#6b7280" progressColor="#6366f1" buttonColor="#475569" pointerColor="#6366f1" />',
    ),
    variant(
      'group',
      'Knob Group',
      '旋钮组',
      '<Knob.Group size={80} trackWidth={3}>\n  <Knob />\n  <Knob />\n  <Knob />\n</Knob.Group>',
    ),
  ],
  radio: [
    variant('default', 'Default', '默认', '<Radio>Balanced</Radio>'),
    variant('disabled', 'Disabled State', '禁用状态', '<Radio disabled>Disabled</Radio>'),
    variant(
      'sizes',
      'Size',
      '尺寸',
      '<Radio size="sm">Small</Radio>\n<Radio size="md">Medium</Radio>\n<Radio size="lg">Large</Radio>',
    ),
    variant(
      'colors',
      'Color',
      '颜色',
      '<Radio color="#8b5cf6">Violet</Radio>\n<Radio color="#10b981">Green</Radio>',
    ),
    variant(
      'group',
      'Radio Group',
      '单选组',
      '<Radio.Group value="balanced">\n  <Radio value="draft">Draft</Radio>\n  <Radio value="balanced">Balanced</Radio>\n</Radio.Group>',
    ),
  ],
  slider: [
    variant('default', 'Default', '默认', '<Slider value={35} />'),
    variant('disabled', 'Disabled State', '禁用状态', '<Slider disabled value={35} />'),
    variant('vertical', 'Vertical Mode', '垂直模式', '<Slider vertical value={35} />'),
    variant('bilateral', 'Bilateral Mode', '双向模式', '<Slider bilateral min={-50} max={50} />'),
    variant('axis', 'Adding Coordinates', '加入坐标', '<Slider axis value={35} />'),
    variant('step', 'Step', '步进', '<Slider step={10} value={30} />'),
    variant(
      'custom',
      'Custom Styling',
      '自定义样式',
      "<Slider styles={{ progress: { background: '#8b5cf6' }, thumb: { background: '#6d28d9' } }} value={60} />",
    ),
    variant('uncontrolled', 'Uncontrolled Mode', '非控模式', '<Slider />'),
  ],
  switch: [
    variant('default', 'Default', '默认', '<Switch>Bypass</Switch>'),
    variant('toggled', 'Toggled State', '开启状态', '<Switch toggled>Bypass</Switch>'),
    variant('disabled', 'Disabled State', '禁用状态', '<Switch disabled>Bypass</Switch>'),
    variant(
      'sizes',
      'Size',
      '尺寸',
      '<Switch size="sm">Small</Switch>\n<Switch size="md">Medium</Switch>\n<Switch size="lg">Large</Switch>',
    ),
    variant(
      'custom',
      'Custom Styling',
      '自定义样式',
      '<Switch className="data-[toggled=true]:bg-violet-500">Custom</Switch>',
    ),
  ],
  lfo: [
    variant('default', 'Default', '默认', '<LFO frequency={4} amplitude={0.65} />'),
    variant('delay', 'Delay', '延迟设置', '<LFO frequency={4} amplitude={0.65} delay={120} />'),
  ],
  light: [
    variant('default', 'Default', '默认', '<Light />'),
    variant('on', 'On State', '开启状态', '<Light on />'),
    variant(
      'colors',
      'Light Color',
      '灯光颜色',
      '<Light on color="#10b981" />\n<Light on color="#f43f5e" />',
    ),
    variant('sizes', 'Size', '尺寸', '<Light on size="0.75rem" />\n<Light on size="1.25rem" />'),
  ],
  oscilloscope: [
    variant(
      'default',
      'Default',
      '默认',
      '<Oscilloscope data={samples} amplitudeRange={[-1, 1]} />',
    ),
  ],
  spectrogram: [
    variant(
      'default',
      'Audio Data',
      '音频数据',
      '<Spectrogram data={spectrum} amplitudeRange={[-120, 20]} />',
    ),
    variant(
      'axis',
      'Axis',
      '坐标轴',
      '<Spectrogram axis data={spectrum} amplitudeRange={[-120, 20]} />',
    ),
    variant(
      'grid',
      'Grid',
      '网格',
      '<Spectrogram grid data={spectrum} amplitudeRange={[-120, 20]} />',
    ),
    variant(
      'eq3',
      'Use Case: EQ3',
      '应用场景：EQ3',
      '<Spectrogram axis grid data={eq3Spectrum} amplitudeRange={[-120, 20]} />',
    ),
  ],
  vumeter: [
    variant('default', 'Default', '默认', '<VuMeter value={-18} />'),
    variant('horizontal', 'Horizontal Mode', '水平模式', '<VuMeter horizontal value={-18} />'),
    variant('stereo', 'Stereo Mode', '双声道模式', '<VuMeter value={[-18, -12]} />'),
    variant('compact', 'Compact Mode', '紧凑模式', '<VuMeter compact value={-18} />'),
    variant(
      'segments',
      'Number of Volume Bars',
      '音量条数量',
      '<VuMeter lumpsQuantity={12} value={-18} />',
    ),
    variant(
      'colors',
      'Custom Colors',
      '自定义颜色',
      '<VuMeter classNames={{ lump: "data-[active=true]:bg-violet-500" }} value={-18} />',
    ),
  ],
  waveform: [variant('default', 'Default', '默认', '<Waveform audioDuration={12} data={peaks} />')],
  card: [
    variant(
      'default',
      'Default',
      '默认',
      '<Card><Card.Header>Delay</Card.Header><Card.Body>Controls</Card.Body></Card>',
    ),
    variant(
      'active',
      'Active State',
      '激活状态',
      '<Card toggled><Card.Header>Delay</Card.Header><Card.Body>Active</Card.Body></Card>',
    ),
    variant(
      'scenario',
      'Real-World Scenario',
      '实际场景',
      '<Card toggled><Card.Header><Light on /> Tape delay</Card.Header><Card.Body><Knob value={35} /></Card.Body></Card>',
    ),
  ],
} as const

export type ComponentWithVariants = keyof typeof componentVariantInventory
export type ComponentVariantId<Component extends ComponentWithVariants> =
  (typeof componentVariantInventory)[Component][number]['id']
