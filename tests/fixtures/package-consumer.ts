import {
  Button,
  useFetchAudio,
  useOscilloscope,
  usePlayer,
  useSpectrogram,
  useVuMeter,
} from '@nafr/echo-ui'
import type { Analyser, InputNode, Meter, Player } from 'tone'

export const PackageButton = Button
export const usePackageAudio = useFetchAudio

export const useTonePlayerContract = () => {
  const echoPlayer = usePlayer()
  const oscilloscope = useOscilloscope()
  const spectrogram = useSpectrogram()
  const vuMeter = useVuMeter({ value: [-60, -60] })
  const player: Player | null = echoPlayer.player.current
  const oscilloscopeNode: Analyser | null = oscilloscope.analyser.current
  const spectrogramNode: Analyser | null = spectrogram.analyser.current
  const meterNode: Meter | null = vuMeter.meter.current
  const chain: InputNode[] = []
  echoPlayer.init({} as AudioBuffer, chain)
  return { meterNode, oscilloscopeNode, player, spectrogramNode }
}
