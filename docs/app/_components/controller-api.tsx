import type { FC } from 'react'
import { ApiTable, localizedText as text, type ApiSection, type Locale } from './api-reference'

export type ControllerName =
  'button' | 'checkbox' | 'envelope' | 'input' | 'knob' | 'radio' | 'slider' | 'switch'

type ControllerApiDefinition = Readonly<{
  main: ApiSection
  group?: ApiSection
}>

const definitions: Record<ControllerName, ControllerApiDefinition> = {
  button: {
    main: {
      name: 'Button',
      inherited: text(
        'Also accepts React.HTMLAttributes<HTMLButtonElement>. Native button children and click handlers are forwarded.',
        '同时接受 React.HTMLAttributes<HTMLButtonElement>；原生按钮的子内容与点击处理函数会继续传递。',
      ),
      rows: [
        {
          name: 'value',
          type: 'unknown',
          defaultValue: '—',
          description: text(
            'Option value used only when the button is inside Button.Group.',
            '仅在按钮位于 Button.Group 内时使用的选项值。',
          ),
        },
        {
          name: 'disabled',
          type: 'boolean',
          defaultValue: 'false',
          description: text('Disables the native button.', '禁用原生按钮。'),
        },
        {
          name: 'size',
          type: "'sm' | 'md' | 'lg'",
          defaultValue: "'md'",
          description: text('Controls button padding and type size.', '控制按钮内边距和字号。'),
        },
        {
          name: 'radius',
          type: "'none' | 'sm' | 'md' | 'lg' | 'full'",
          defaultValue: "'md'",
          description: text('Sets the button corner radius.', '设置按钮圆角。'),
        },
        {
          name: 'toggled',
          type: 'boolean',
          defaultValue: 'false',
          description: text(
            'Controls the visual pressed state; a standalone Button does not toggle itself.',
            '控制视觉按下状态；独立 Button 不会自行切换该状态。',
          ),
        },
        {
          name: 'onToggleChange',
          type: '(toggled: boolean) => void',
          defaultValue: '—',
          description: text(
            'Runs after mount and whenever the effective toggled state changes.',
            '挂载后以及有效 toggled 状态变化时调用。',
          ),
        },
      ],
    },
    group: {
      name: 'Button.Group',
      inherited: text(
        'Also accepts React.HTMLAttributes<HTMLDivElement>. Group selection is controlled: update value from onChange.',
        '同时接受 React.HTMLAttributes<HTMLDivElement>。分组选择为受控模式：请在 onChange 中更新 value。',
      ),
      rows: [
        {
          name: 'value',
          type: 'unknown | unknown[]',
          defaultValue: '[]',
          description: text(
            'Selected value for single-select, or selected values for multi-select.',
            '单选时为一个选中值，多选时为选中值数组。',
          ),
        },
        {
          name: 'disabled',
          type: 'boolean',
          defaultValue: 'false',
          description: text('Disables every grouped button.', '禁用组内所有按钮。'),
        },
        {
          name: 'size',
          type: "'sm' | 'md' | 'lg'",
          defaultValue: "'md'",
          description: text('Default size inherited by children.', '子按钮继承的默认尺寸。'),
        },
        {
          name: 'radius',
          type: "'none' | 'sm' | 'md' | 'lg' | 'full'",
          defaultValue: "'md'",
          description: text('Outer radius inherited by children.', '子按钮继承的外侧圆角。'),
        },
        {
          name: 'classNames',
          type: '{ button?: string }',
          defaultValue: '—',
          description: text('Class applied to every child button.', '应用到每个子按钮的类名。'),
        },
        {
          name: 'styles',
          type: '{ button?: React.CSSProperties }',
          defaultValue: '—',
          description: text(
            'Inline style applied to every child button.',
            '应用到每个子按钮的行内样式。',
          ),
        },
        {
          name: 'onChange',
          type: '(values: unknown | unknown[]) => void',
          defaultValue: '—',
          description: text('Reports the next controlled selection.', '返回下一次受控选择值。'),
        },
      ],
    },
  },
  checkbox: {
    main: {
      name: 'Checkbox',
      inherited: text(
        'Accepts React.HTMLAttributes<HTMLInputElement>. Echo UI renders a native input[type="checkbox"] inside a label, but input-specific props such as name are not part of the public type.',
        '接受 React.HTMLAttributes<HTMLInputElement>。Echo UI 会在 label 内渲染原生 input[type="checkbox"]，但 name 等输入框专属属性不在公开类型中。',
      ),
      rows: [
        {
          name: 'value',
          type: 'unknown',
          defaultValue: '—',
          description: text(
            'Option value reported inside Checkbox.Group.',
            '在 Checkbox.Group 中回传的选项值。',
          ),
        },
        {
          name: 'checked',
          type: 'boolean',
          defaultValue: 'false',
          description: text(
            'Initial and externally synchronized checked state.',
            '初始选中状态，并可由外部同步更新。',
          ),
        },
        {
          name: 'disabled',
          type: 'boolean',
          defaultValue: 'false',
          description: text('Disables the native checkbox.', '禁用原生复选框。'),
        },
        {
          name: 'size',
          type: "'sm' | 'md' | 'lg'",
          defaultValue: "'md'",
          description: text('Sets control and label size.', '设置控件和标签尺寸。'),
        },
        {
          name: 'color',
          type: 'string',
          defaultValue: 'var(--echo-primary)',
          description: text('Color of the checked indicator.', '选中指示块的颜色。'),
        },
        {
          name: 'classNames',
          type: '{ label?: string }',
          defaultValue: '—',
          description: text('Class for the visible label.', '可见标签的类名。'),
        },
        {
          name: 'styles',
          type: '{ label?: React.CSSProperties }',
          defaultValue: '—',
          description: text('Inline style for the visible label.', '可见标签的行内样式。'),
        },
        {
          name: 'onChange',
          type: '(event: CheckboxChangeEvent) => void',
          defaultValue: '—',
          description: text(
            'Reports { value, nativeEvent }; standalone value is the next boolean.',
            '返回 { value, nativeEvent }；独立使用时 value 是下一布尔值。',
          ),
        },
      ],
    },
    group: {
      name: 'Checkbox.Group',
      inherited: text(
        'Also accepts React.HTMLAttributes<HTMLDivElement>. Keep value in state to use the group as one controlled field.',
        '同时接受 React.HTMLAttributes<HTMLDivElement>。请把 value 保存在状态中，将分组作为一个受控字段使用。',
      ),
      rows: [
        {
          name: 'value',
          type: 'unknown[]',
          defaultValue: '[]',
          description: text('Currently selected child values.', '当前选中的子项值。'),
        },
        {
          name: 'disabled',
          type: 'boolean',
          defaultValue: 'false',
          description: text('Disables every checkbox.', '禁用组内所有复选框。'),
        },
        {
          name: 'checked',
          type: 'boolean',
          defaultValue: '—',
          description: text(
            'Present in the public group type but not propagated to children; prefer value.',
            '存在于公开分组类型中，但不会传给子项；应优先使用 value。',
          ),
        },
        {
          name: 'size',
          type: "'sm' | 'md' | 'lg'",
          defaultValue: "'md'",
          description: text('Default child size.', '子项默认尺寸。'),
        },
        {
          name: 'color',
          type: 'string',
          defaultValue: 'var(--echo-primary)',
          description: text('Default checked color.', '默认选中颜色。'),
        },
        {
          name: 'classNames',
          type: '{ checkbox?: string; label?: string }',
          defaultValue: '—',
          description: text(
            'Classes shared by child controls and labels.',
            '子控件和标签共享的类名。',
          ),
        },
        {
          name: 'styles',
          type: '{ checkbox?: CSSProperties; label?: CSSProperties }',
          defaultValue: '—',
          description: text(
            'Inline styles shared by child controls and labels.',
            '子控件和标签共享的行内样式。',
          ),
        },
        {
          name: 'onChange',
          type: '(event: CheckboxChangeEvent) => void',
          defaultValue: '—',
          description: text(
            'Reports the next value array and native event.',
            '返回下一值数组和原生事件。',
          ),
        },
      ],
    },
  },
  envelope: {
    main: {
      name: 'Envelope',
      inherited: text(
        'Also accepts React.HTMLAttributes<HTMLDivElement>. The visualization uses pointer-driven SVG nodes; provide equivalent form inputs when keyboard access is required.',
        '同时接受 React.HTMLAttributes<HTMLDivElement>。可视化使用指针拖动 SVG 节点；需要键盘访问时，请提供等价表单输入。',
      ),
      rows: [
        {
          name: 'data',
          type: 'EnvelopeData',
          defaultValue: '—',
          required: true,
          description: text(
            'ADSR, AHDSR, or DADSR values to display and edit.',
            '要显示和编辑的 ADSR、AHDSR 或 DADSR 数值。',
          ),
        },
        {
          name: 'limits',
          type: 'EnvelopeLimits',
          defaultValue: '{ delay: 1, attack: 1, hold: 1, decay: 1, release: 1 }',
          description: text(
            'Maximum duration for each time stage. Omitted delay or hold stages receive a zero limit.',
            '各时间阶段的最大时长；省略 delay 或 hold 时，对应上限为 0。',
          ),
        },
        {
          name: 'lineColor',
          type: 'string',
          defaultValue: 'var(--echo-primary)',
          description: text('Envelope line color.', '包络线颜色。'),
        },
        {
          name: 'lineWidth',
          type: 'number',
          defaultValue: '3',
          description: text('Envelope line width in SVG units.', '包络线宽度（SVG 单位）。'),
        },
        {
          name: 'nodeColor',
          type: 'string',
          defaultValue: 'var(--echo-secondary)',
          description: text('Drag-node outline color.', '拖动节点轮廓颜色。'),
        },
        {
          name: 'nodeSize',
          type: 'number',
          defaultValue: '6',
          description: text('Drag-node radius in SVG units.', '拖动节点半径（SVG 单位）。'),
        },
        {
          name: 'onChange',
          type: '(data: EnvelopeData) => void',
          defaultValue: '—',
          description: text('Reports values during dragging.', '拖动过程中持续返回数值。'),
        },
        {
          name: 'onChangeEnd',
          type: '(data: EnvelopeData) => void',
          defaultValue: '—',
          description: text('Reports final values when dragging ends.', '拖动结束时返回最终数值。'),
        },
      ],
    },
  },
  input: {
    main: {
      name: 'Input',
      inherited: text(
        'Accepts React.InputHTMLAttributes<HTMLInputElement> except children, size, and the native onChange signature.',
        '接受 React.InputHTMLAttributes<HTMLInputElement>，但 children、size 与原生 onChange 签名除外。',
      ),
      rows: [
        {
          name: 'value',
          type: 'string | number',
          defaultValue: '0',
          description: text(
            'Initial and externally synchronized value.',
            '初始值，并可由外部同步更新。',
          ),
        },
        {
          name: 'type',
          type: "'text' | 'number'",
          defaultValue: "'number'",
          description: text(
            'Selects text entry or numeric entry with drag editing.',
            '选择文本输入，或支持拖动编辑的数字输入。',
          ),
        },
        {
          name: 'size',
          type: "'sm' | 'md' | 'lg'",
          defaultValue: "'md'",
          description: text('Input size.', '输入框尺寸。'),
        },
        {
          name: 'radius',
          type: "'none' | 'sm' | 'md' | 'lg' | 'full'",
          defaultValue: "'md'",
          description: text('Input corner radius.', '输入框圆角。'),
        },
        {
          name: 'bilateral',
          type: 'boolean',
          defaultValue: 'false',
          description: text(
            'Draws progress outward from the range midpoint.',
            '让进度从数值范围中点向外绘制。',
          ),
        },
        {
          name: 'min',
          type: 'number',
          defaultValue: '0',
          description: text('Minimum numeric value.', '数字最小值。'),
        },
        {
          name: 'max',
          type: 'number',
          defaultValue: '100',
          description: text('Maximum numeric value.', '数字最大值。'),
        },
        {
          name: 'step',
          type: 'number',
          defaultValue: '1',
          description: text('Increment used while dragging.', '拖动时使用的步进值。'),
        },
        {
          name: 'sensitivity',
          type: '1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10',
          defaultValue: '5',
          description: text('Vertical drag sensitivity.', '垂直拖动灵敏度。'),
        },
        {
          name: 'prohibitDrag',
          type: 'boolean',
          defaultValue: 'false',
          description: text('Disables pointer drag editing.', '禁用指针拖动编辑。'),
        },
        {
          name: 'hideProgress',
          type: 'boolean',
          defaultValue: 'false',
          description: text('Hides the numeric progress fill.', '隐藏数字进度填充。'),
        },
        {
          name: 'progressColor',
          type: 'string',
          defaultValue: 'var(--echo-primary)',
          description: text('Numeric progress fill color.', '数字进度填充颜色。'),
        },
        {
          name: 'onChange',
          type: '(event: InputChangeEvent) => void',
          defaultValue: '—',
          description: text(
            'Reports { value, nativeEvent? } for typing and dragging.',
            '输入或拖动时返回 { value, nativeEvent? }。',
          ),
        },
      ],
    },
  },
  knob: {
    main: {
      name: 'Knob',
      inherited: text(
        'Also accepts React.HTMLAttributes<HTMLDivElement>. The current control is pointer-driven; mirror it with a keyboard-operable input for accessible forms.',
        '同时接受 React.HTMLAttributes<HTMLDivElement>。当前控件由指针驱动；无障碍表单应同时提供可键盘操作的输入。',
      ),
      rows: [
        {
          name: 'value',
          type: 'number',
          defaultValue: '0',
          description: text(
            'Initial and externally synchronized value.',
            '初始值，并可由外部同步更新。',
          ),
        },
        {
          name: 'min',
          type: 'number',
          defaultValue: '-10',
          description: text('Minimum value.', '最小值。'),
        },
        {
          name: 'max',
          type: 'number',
          defaultValue: '10',
          description: text('Maximum value.', '最大值。'),
        },
        {
          name: 'step',
          type: 'number',
          defaultValue: '1',
          description: text('Drag increment.', '拖动步进值。'),
        },
        {
          name: 'disabled',
          type: 'boolean',
          defaultValue: 'false',
          description: text('Disables pointer interaction.', '禁用指针交互。'),
        },
        {
          name: 'rotationRange',
          type: 'number',
          defaultValue: '270',
          description: text(
            'Available rotation in degrees, clamped from 90 to 360.',
            '可用旋转角度，限制在 90 到 360 度。',
          ),
        },
        {
          name: 'bilateral',
          type: 'boolean',
          defaultValue: 'false',
          description: text('Draws progress from the range midpoint.', '从数值范围中点绘制进度。'),
        },
        {
          name: 'sensitivity',
          type: '1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10',
          defaultValue: '1',
          description: text('Vertical drag sensitivity.', '垂直拖动灵敏度。'),
        },
        {
          name: 'size',
          type: 'number | string',
          defaultValue: "'4rem'",
          description: text('Knob width and height.', '旋钮宽度和高度。'),
        },
        {
          name: 'buttonColor',
          type: 'string',
          defaultValue: 'var(--echo-button)',
          description: text('Center button color.', '中心按钮颜色。'),
        },
        {
          name: 'trackColor',
          type: 'string',
          defaultValue: 'var(--echo-input)',
          description: text('Track color.', '轨道颜色。'),
        },
        {
          name: 'trackWidth',
          type: 'number | string',
          defaultValue: "'0.5rem'",
          description: text('Track thickness.', '轨道厚度。'),
        },
        {
          name: 'progressColor',
          type: 'string',
          defaultValue: 'var(--echo-primary)',
          description: text('Progress arc color.', '进度弧颜色。'),
        },
        {
          name: 'pointerWidth',
          type: 'number | string',
          defaultValue: "'0.375rem'",
          description: text('Pointer width.', '指针宽度。'),
        },
        {
          name: 'pointerHeight',
          type: 'number | string',
          defaultValue: "'1rem'",
          description: text('Pointer height.', '指针高度。'),
        },
        {
          name: 'pointerColor',
          type: 'string',
          defaultValue: 'var(--echo-primary)',
          description: text('Pointer color.', '指针颜色。'),
        },
        {
          name: 'topLabel',
          type: 'string | ReactNode',
          defaultValue: '—',
          description: text('Content above the knob.', '旋钮上方内容。'),
        },
        {
          name: 'bottomLabel',
          type: 'string | ReactNode',
          defaultValue: '—',
          description: text('Content below the knob.', '旋钮下方内容。'),
        },
        {
          name: 'classNames',
          type: '{ button?: string; topLabel?: string; bottomLabel?: string }',
          defaultValue: '—',
          description: text('Classes for named knob slots.', '各旋钮插槽的类名。'),
        },
        {
          name: 'styles',
          type: '{ button?: CSSProperties; topLabel?: CSSProperties; bottomLabel?: CSSProperties }',
          defaultValue: '—',
          description: text('Inline styles for named knob slots.', '各旋钮插槽的行内样式。'),
        },
        {
          name: 'onChange',
          type: '(value: number) => void',
          defaultValue: '—',
          description: text('Reports values while dragging.', '拖动时持续返回数值。'),
        },
        {
          name: 'onChangeEnd',
          type: '(value: number) => void',
          defaultValue: '—',
          description: text('Reports the final drag value.', '返回拖动结束时的最终值。'),
        },
      ],
    },
    group: {
      name: 'Knob.Group',
      inherited: text(
        'Also accepts React.HTMLAttributes<HTMLDivElement>. It shares presentation and range props; each Knob keeps its own value and callbacks.',
        '同时接受 React.HTMLAttributes<HTMLDivElement>。它共享外观与范围属性；每个 Knob 保留自己的 value 和回调。',
      ),
      rows: [
        {
          name: 'min, max, step',
          type: 'number',
          defaultValue: '-10, 10, 1',
          description: text('Shared range and increment.', '共享的范围和步进值。'),
        },
        {
          name: 'disabled',
          type: 'boolean',
          defaultValue: 'false',
          description: text('Disables all child knobs.', '禁用所有子旋钮。'),
        },
        {
          name: 'rotationRange',
          type: 'number',
          defaultValue: '270',
          description: text('Shared rotation range.', '共享旋转范围。'),
        },
        {
          name: 'bilateral',
          type: 'boolean',
          defaultValue: 'false',
          description: text('Shared bilateral mode.', '共享双向模式。'),
        },
        {
          name: 'sensitivity',
          type: '1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10',
          defaultValue: '1',
          description: text('Shared drag sensitivity.', '共享拖动灵敏度。'),
        },
        {
          name: 'size',
          type: 'number | string',
          defaultValue: "'4rem'",
          description: text('Shared knob size.', '共享旋钮尺寸。'),
        },
        {
          name: 'buttonColor, trackColor, progressColor, pointerColor',
          type: 'string',
          defaultValue: 'Echo theme tokens',
          description: text('Shared control colors.', '共享控件颜色。'),
        },
        {
          name: 'trackWidth, pointerWidth, pointerHeight',
          type: 'number | string',
          defaultValue: "'0.5rem', '0.375rem', '1rem'",
          description: text('Shared track and pointer dimensions.', '共享轨道和指针尺寸。'),
        },
        {
          name: 'classNames',
          type: '{ knob?: string; button?: string; topLabel?: string; bottomLabel?: string }',
          defaultValue: '—',
          description: text(
            'Classes applied across child knob slots.',
            '应用到各子旋钮插槽的类名。',
          ),
        },
        {
          name: 'styles',
          type: '{ knob?: CSSProperties; button?: CSSProperties; topLabel?: CSSProperties; bottomLabel?: CSSProperties }',
          defaultValue: '—',
          description: text(
            'Inline styles applied across child knob slots.',
            '应用到各子旋钮插槽的行内样式。',
          ),
        },
      ],
    },
  },
  radio: {
    main: {
      name: 'Radio',
      inherited: text(
        'Accepts React.HTMLAttributes<HTMLInputElement>. Echo UI renders a native input[type="radio"] inside a label, but input-specific props such as name are not part of the public type.',
        '接受 React.HTMLAttributes<HTMLInputElement>。Echo UI 会在 label 内渲染原生 input[type="radio"]，但 name 等输入框专属属性不在公开类型中。',
      ),
      rows: [
        {
          name: 'value',
          type: 'unknown',
          defaultValue: '—',
          description: text(
            'Option value reported by Radio.Group.',
            '由 Radio.Group 回传的选项值。',
          ),
        },
        {
          name: 'checked',
          type: 'boolean',
          defaultValue: 'false',
          description: text('Standalone checked state.', '独立使用时的选中状态。'),
        },
        {
          name: 'disabled',
          type: 'boolean',
          defaultValue: 'false',
          description: text('Disables the native radio.', '禁用原生单选框。'),
        },
        {
          name: 'size',
          type: "'sm' | 'md' | 'lg'",
          defaultValue: "'md'",
          description: text('Sets control and label size.', '设置控件和标签尺寸。'),
        },
        {
          name: 'color',
          type: 'string',
          defaultValue: 'var(--echo-primary)',
          description: text('Selected indicator color.', '选中指示点颜色。'),
        },
        {
          name: 'classNames',
          type: '{ label?: string }',
          defaultValue: '—',
          description: text('Class for the visible label.', '可见标签的类名。'),
        },
        {
          name: 'styles',
          type: '{ label?: React.CSSProperties }',
          defaultValue: '—',
          description: text('Inline style for the visible label.', '可见标签的行内样式。'),
        },
        {
          name: 'onChange',
          type: '(event: RadioChangeEvent) => void',
          defaultValue: '—',
          description: text('Reports the option value and native event.', '返回选项值和原生事件。'),
        },
      ],
    },
    group: {
      name: 'Radio.Group',
      inherited: text(
        'Also accepts React.HTMLAttributes<HTMLDivElement>. Selection is controlled. Radio.Group does not add radiogroup semantics or a shared native name automatically.',
        '同时接受 React.HTMLAttributes<HTMLDivElement>。选择为受控模式。Radio.Group 不会自动添加 radiogroup 语义或共享的原生 name。',
      ),
      rows: [
        {
          name: 'value',
          type: 'unknown',
          defaultValue: '—',
          description: text('Currently selected child value.', '当前选中的子项值。'),
        },
        {
          name: 'disabled',
          type: 'boolean',
          defaultValue: 'false',
          description: text('Disables every radio.', '禁用组内所有单选框。'),
        },
        {
          name: 'size',
          type: "'sm' | 'md' | 'lg'",
          defaultValue: "'md'",
          description: text('Default child size.', '子项默认尺寸。'),
        },
        {
          name: 'color',
          type: 'string',
          defaultValue: 'var(--echo-primary)',
          description: text('Default selected color.', '默认选中颜色。'),
        },
        {
          name: 'classNames',
          type: '{ radio?: string; label?: string }',
          defaultValue: '—',
          description: text(
            'Classes shared by child controls and labels.',
            '子控件和标签共享的类名。',
          ),
        },
        {
          name: 'styles',
          type: '{ radio?: CSSProperties; label?: CSSProperties }',
          defaultValue: '—',
          description: text(
            'Inline styles shared by child controls and labels.',
            '子控件和标签共享的行内样式。',
          ),
        },
        {
          name: 'onChange',
          type: '(event: RadioChangeEvent) => void',
          defaultValue: '—',
          description: text(
            'Reports the selected value and native event.',
            '返回选中值和原生事件。',
          ),
        },
      ],
    },
  },
  slider: {
    main: {
      name: 'Slider',
      inherited: text(
        'Also accepts React HTML attributes for a div. The current slider is pointer-driven; add role, ARIA values, focus, and a keyboard handler when it is the only value editor.',
        '同时接受 div 的 React HTML 属性。当前滑动条由指针驱动；当它是唯一数值编辑器时，请补充 role、ARIA 数值、焦点与键盘处理。',
      ),
      rows: [
        {
          name: 'value',
          type: 'number',
          defaultValue: '0',
          description: text(
            'Initial and externally synchronized value.',
            '初始值，并可由外部同步更新。',
          ),
        },
        {
          name: 'min',
          type: 'number',
          defaultValue: '0',
          description: text('Minimum value.', '最小值。'),
        },
        {
          name: 'max',
          type: 'number',
          defaultValue: '100',
          description: text('Maximum value.', '最大值。'),
        },
        {
          name: 'step',
          type: 'number',
          defaultValue: '1',
          description: text('Pointer increment.', '指针步进值。'),
        },
        {
          name: 'disabled',
          type: 'boolean',
          defaultValue: 'false',
          description: text('Disables pointer interaction.', '禁用指针交互。'),
        },
        {
          name: 'vertical',
          type: 'boolean',
          defaultValue: 'false',
          description: text('Uses vertical orientation.', '使用垂直方向。'),
        },
        {
          name: 'bilateral',
          type: 'boolean',
          defaultValue: 'false',
          description: text('Draws progress from the midpoint.', '从中点绘制进度。'),
        },
        {
          name: 'hideThumb',
          type: 'boolean',
          defaultValue: 'false',
          description: text('Hides the thumb.', '隐藏滑块。'),
        },
        {
          name: 'hideThumbLabel',
          type: 'boolean',
          defaultValue: 'false',
          description: text(
            'Hides the value label shown while dragging.',
            '隐藏拖动时显示的数值标签。',
          ),
        },
        {
          name: 'prohibitInteraction',
          type: 'boolean',
          defaultValue: 'false',
          description: text(
            'Makes the slider display-only without disabled styling.',
            '让滑动条仅展示数值，但不显示禁用样式。',
          ),
        },
        {
          name: 'classNames',
          type: '{ progress?: string; thumb?: string; thumbLabel?: string; axis?: string }',
          defaultValue: '—',
          description: text('Classes for named slider slots.', '各滑动条插槽的类名。'),
        },
        {
          name: 'styles',
          type: '{ progress?: CSSProperties; thumb?: CSSProperties; thumbLabel?: CSSProperties; axis?: CSSProperties }',
          defaultValue: '—',
          description: text('Inline styles for named slider slots.', '各滑动条插槽的行内样式。'),
        },
        {
          name: 'axis',
          type: 'boolean',
          defaultValue: 'false',
          description: text(
            'Displays an Axis beneath or beside the track.',
            '在轨道下方或旁边显示 Axis。',
          ),
        },
        {
          name: 'axisProps',
          type: "Omit<AxisProps, 'className' | 'style'>",
          defaultValue: '—',
          description: text('Configures the optional Axis.', '配置可选的 Axis。'),
        },
        {
          name: 'onChange',
          type: '(value: number) => void',
          defaultValue: '—',
          description: text('Reports values while dragging.', '拖动时持续返回数值。'),
        },
        {
          name: 'onChangeEnd',
          type: '(value: number) => void',
          defaultValue: '—',
          description: text('Reports the final drag value.', '返回拖动结束时的最终值。'),
        },
      ],
    },
  },
  switch: {
    main: {
      name: 'Switch',
      inherited: text(
        'Also accepts React.HTMLAttributes<HTMLLabelElement>. The base component renders spans rather than an input; add switch role, ARIA state, focus, and keyboard handling for standalone use.',
        '同时接受 React.HTMLAttributes<HTMLLabelElement>。基础组件渲染 span 而非 input；独立使用时请补充 switch role、ARIA 状态、焦点与键盘处理。',
      ),
      rows: [
        {
          name: 'toggled',
          type: 'boolean',
          defaultValue: 'false',
          description: text(
            'Initial and externally synchronized on/off state.',
            '初始开关状态，并可由外部同步更新。',
          ),
        },
        {
          name: 'disabled',
          type: 'boolean',
          defaultValue: 'false',
          description: text('Disables pointer interaction.', '禁用指针交互。'),
        },
        {
          name: 'size',
          type: "'sm' | 'md' | 'lg'",
          defaultValue: "'md'",
          description: text('Track, thumb, and label size.', '轨道、滑块和标签尺寸。'),
        },
        {
          name: 'classNames',
          type: '{ label?: string; button?: string; thumb?: string }',
          defaultValue: '—',
          description: text('Classes for named switch slots.', '各开关插槽的类名。'),
        },
        {
          name: 'styles',
          type: '{ label?: CSSProperties; button?: CSSProperties; thumb?: CSSProperties }',
          defaultValue: '—',
          description: text('Inline styles for named switch slots.', '各开关插槽的行内样式。'),
        },
        {
          name: 'onChange',
          type: '(toggled: boolean) => void',
          defaultValue: '—',
          description: text(
            'Runs on mount and after the internal state changes.',
            '挂载时以及内部状态变化后调用。',
          ),
        },
      ],
    },
  },
}

type ControllerApiProps = Readonly<{
  controller: ControllerName
  lang: Locale
}>

export const ControllerApi: FC<ControllerApiProps> = ({ controller, lang }) => {
  const definition = definitions[controller]

  return (
    <div data-controller-api={controller}>
      <ApiTable lang={lang} section={definition.main} />
      {definition.group && <ApiTable lang={lang} section={definition.group} />}
    </div>
  )
}
