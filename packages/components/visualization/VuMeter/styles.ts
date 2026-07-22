import { tv } from 'tailwind-variants'

export const useStyle = tv({
  slots: {
    base: 'group flex',
    lumps: 'flex gap-1',
    lump: `
    bg-input 
    rounded-[2px] 
    transition-colors 
    duration-150
    data-[active=none]:bg-input
    data-[active=low]:bg-echo-meter-low
    data-[active=medium]:bg-echo-meter-medium
    data-[active=high]:bg-echo-meter-high
    dark:data-[active=low]:bg-echo-meter-dark-low
    dark:data-[active=medium]:bg-echo-meter-dark-medium
    dark:data-[active=high]:bg-echo-meter-dark-high`,
    axis: 'flex ml-2',
  },

  defaultVariants: {
    horizontal: false,
    isStereo: false,
    compact: false,
  },

  variants: {
    horizontal: {
      true: {
        base: 'flex-col',
        axis: 'ml-0',
      },
    },
    isStereo: { true: '' },
    compact: {
      true: {
        lumps: 'gap-0',
        lump: 'rounded-none',
      },
    },
  },

  compoundVariants: [
    {
      isStereo: false,
      horizontal: false,
      class: {
        lump: 'w-5 h-1.5',
      },
    },
    {
      isStereo: false,
      horizontal: true,
      class: {
        lump: 'w-1.5 h-4',
        axis: '-mt-2',
      },
    },
    {
      isStereo: true,
      horizontal: false,
      class: {
        lump: 'w-3 h-1.5',
      },
    },
    {
      isStereo: true,
      horizontal: true,
      class: {
        lump: 'w-1.5 h-2.5',
        axis: '-mt-3',
      },
    },
  ],
})
