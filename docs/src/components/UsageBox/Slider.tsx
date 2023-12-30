import React from 'react'
import * as Tone from 'tone'
import { Slider, Button } from 'echo-ui'
import { Play, Square } from 'lucide-react'
import { UsageBox } from '.'

export const Default = () => {
  const scope = { Slider }
  const code = `<Slider />`

  return <UsageBox code={code} scope={scope} classNames={{ preview: 'p-0 px-5 py-10' }} />
}

export const Disabled = () => {
  const scope = { Slider }
  const code = `<Slider disabled value={30}/>`

  return <UsageBox code={code} scope={scope} classNames={{ preview: 'p-0 px-5 py-10' }} />
}

export const Vertical = () => {
  const scope = { Slider }
  const code = `<Slider vertical className='h-80'/>`

  return (
    <UsageBox
      code={code}
      scope={scope}
      classNames={{ preview: 'flex justify-center p-0 py-5 pl-10' }}
    />
  )
}

export const Bilateral = () => {
  const scope = { Slider }
  const code = `<Slider bilateral value={50}/>`

  return <UsageBox code={code} scope={scope} classNames={{ preview: 'p-0 px-5 py-10' }} />
}

export const Axis = () => {
  const scope = { Slider }
  const code = `<Slider axis/>`

  return <UsageBox code={code} scope={scope} classNames={{ preview: 'p-0 px-7 pt-10 pb-12' }} />
}

export const Step = () => {
  const scope = { Slider }
  const code = `<Slider step={10}/>`
  return <UsageBox code={code} scope={scope} classNames={{ preview: 'p-0 px-5 py-10' }} />
}

const UncontrolledSlider = () => {
  const url = 'https://codeacme17.github.io/1llest-waveform-vue/audios/loop-1.mp3'
  const [value, setValue] = React.useState<number>(0)
  const [player, setPlayer] = React.useState<Tone.Player | null>(null)
  const [isPlay, setIsPlay] = React.useState(false)
  const [meter] = React.useState<Tone.Meter>(new Tone.Meter())

  const handlePlay = () => {
    setIsPlay(!isPlay)
    if (!player) return
    player.volume.value = 5

    if (player.state === 'started') {
      player.stop()
      return
    }

    player.start()
    player.connect(meter)
    getDB()
  }

  React.useEffect(() => {
    const player = new Tone.Player(url).toDestination()
    setPlayer(player)

    return () => {
      player.stop()
      player.disconnect()
    }
  }, [])

  const getDB = () => {
    if (player?.state === 'stopped') {
      setValue(-60)
      return
    }
    setValue(meter.getValue() as number)
    requestAnimationFrame(getDB)
  }

  return (
    <section className="flex flex-col items-center">
      <Button onClick={handlePlay} disabled={!player} toggled={isPlay} className="mb-5 px-4">
        {isPlay ? (
          <Square className="w-4 h-4 fill-current" />
        ) : (
          <Play className="w-4 h-4 fill-current" />
        )}
      </Button>

      <div className="h-80">
        <Slider
          className="w-2"
          hideThumb
          prohibitInteraction
          vertical
          axis
          min={-60}
          max={10}
          value={value}
        />
      </div>
    </section>
  )
}

export const Uncontrolled = () => {
  const scope = { UncontrolledSlider, Tone, Button, Play, Square }
  const code = `<UncontrolledSlider />`

  return (
    <UsageBox code={code} scope={scope} type="link" classNames={{ preview: 'p-0 px-5 py-10' }} />
  )
}
