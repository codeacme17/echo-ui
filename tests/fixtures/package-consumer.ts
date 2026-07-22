import { Button, useFetchAudio, usePlayer } from '@nafr/echo-ui'
import type { InputNode, Player } from 'tone'

export const PackageButton = Button
export const usePackageAudio = useFetchAudio

export const useTonePlayerContract = () => {
  const echoPlayer = usePlayer()
  const player: Player | null = echoPlayer.player.current
  const chain: InputNode[] = []
  echoPlayer.init({} as AudioBuffer, chain)
  return player
}
