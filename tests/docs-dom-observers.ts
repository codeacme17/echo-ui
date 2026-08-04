import { vi } from 'vitest'

export const stubDocsDomObservers = () => {
  vi.stubGlobal(
    'requestAnimationFrame',
    vi.fn(() => 1),
  )
  vi.stubGlobal('cancelAnimationFrame', vi.fn())
  vi.stubGlobal(
    'ResizeObserver',
    class {
      readonly callback: ResizeObserverCallback

      constructor(callback: ResizeObserverCallback) {
        this.callback = callback
      }

      disconnect() {}

      observe(target: Element) {
        this.callback(
          [
            {
              borderBoxSize: [],
              contentBoxSize: [],
              contentRect: {
                bottom: 160,
                height: 160,
                left: 0,
                right: 560,
                toJSON: () => ({}),
                top: 0,
                width: 560,
                x: 0,
                y: 0,
              },
              devicePixelContentBoxSize: [],
              target,
            },
          ],
          this as unknown as ResizeObserver,
        )
      }

      unobserve() {}
    },
  )
}

export const restoreDocsDomObservers = () => vi.unstubAllGlobals()
