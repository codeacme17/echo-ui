import { tv } from 'tailwind-variants'

export const useStyle = tv({
  slots: {
    base: 'group flex relative',
    lumps: 'flex gap-1',
    lump: `
    bg-input 
    rounded-[2px] 
    transition-colors 
    duration-150
    data-[active=none]:bg-input
    data-[active=low]:bg-amber-500
    data-[active=medium]:bg-amber-400
    data-[active=high]:bg-amber-200
    dark:data-[active=low]:bg-amber-600
    dark:data-[active=medium]:bg-amber-500
    dark:data-[active=high]:bg-amber-300`,
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
