import { tv } from 'tailwind-variants'

export const useStyle = tv({
  slots: {
    base: 'flex relative',
    lumps: 'flex gap-1',
    lump: `
    bg-input 
    rounded-[2px] 
    transition-colors 
    duration-150
    data-[active=none]:bg-input`,
    axis: 'flex',
  },

  defaultVariants: {
    horizontal: false,
    isStereo: false,
    compact: false,
  },

  variants: {
    horizontal: { true: '' },
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
        axis: 'ml-6',
      },
    },
    {
      isStereo: false,
      horizontal: true,
      class: {
        lump: 'w-1.5 h-4',
        axis: 'mt-3',
      },
    },
    {
      isStereo: true,
      horizontal: false,
      class: {
        lump: 'w-3 h-1.5',
        axis: 'ml-8',
      },
    },
    {
      isStereo: true,
      horizontal: true,
      class: {
        lump: 'w-1.5 h-2.5',
        axis: 'mt-3',
      },
    },
  ],
})
