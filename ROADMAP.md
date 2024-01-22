# Roadmap for echo-ui

## Components

### Control Components

- [x] **Button**: Functions like play, stop, record, etc.
- [x] **Checkbox**: Select multiple settings, like audio effect options.
- [ ] **Dropdown**: Select presets or audio output options.
- [x] **Envelope**: Interactive linear ramp visualization.
- [ ] **Equalizer Curve**: Show and manipulate EQ settings.
- [x] **Input**: Input precise parameter values.
- [x] **Knob**: Adjust parameters like volume, frequency, etc.
- [x] **Radio**: Select a single option, such as audio channel selection.
- [x] **Slider**: Control parameters for audio effects, such as EQ gain.
- [x] **Switch**: Enable or disable audio effects.

### Visualization Components

- [x] **Axis**: component is a component used to display axes in a chart.
- [x] **Light**: Show the status of audio effects.
- [x] **Oscilloscope**: Visualizes audio waveforms in real-time, showing changes in signal amplitude and frequency over time.
- [x] **Spectrogram**: Display audio Spectrogram.
- [x] **VU-Meter**: Display realtime audio volume levels.
- [x] **Waveform**: Show audio waveform.

### Container Components

- [x] **Card**: Contain related information.
- [ ] **Panel**: Containers holding related components.
- [ ] **Group**: Combine related controls together.

## Hooks

- [x] **useFetchAudio**: Fetch audio file from url.
- [x] **usePlayer**: Player to handle audio events.
- [x] **useWaveform**: Generate waveform data.
- [ ] **useSpectrogram**: Generate spectrogram data.
- [ ] **useOscilloscope**: Generate oscilloscope data.
- [x] **useVUMeter**: Generate VU-Meter data.
- [ ] **useEnvelope**: Generate and modify envelope data.
