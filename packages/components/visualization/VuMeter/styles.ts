import { tv } from 'tailwind-variants'

export const useStyle = tv({
  slots: {
    base: 'flex relative',
    lumps: 'flex gap-1',
    lump: `w-2 
    h-1.5 
    bg-input 
    rounded-[2px] 
    transition-colors 
    duration-150
    data-[active=none]:bg-input`,
  },

  defaultVariants: {
    vertical: true,
  },

  variants: {
    vertical: {
      true: {
        lump: 'w-3 h-1.5',
      },
    },
  },
})
