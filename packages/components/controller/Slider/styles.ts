import { tv } from 'tailwind-variants'

export const sliderStyle = tv({
  slots: {
    base: `group
    text-foreground
    w-full
    h-2
    cursor-pointer
    bg-input
    rounded-sm`,
    progress: `absolute
    bg-primary
    rounded-md
    h-full
    w-full`,
    thumb: `w-2
    h-5
    bg-accent-foreground
    rounded-sm`,
    thumbLabel: `px-1.5 
    py-1
    opacity-0
    text-accent
    bg-accent-foreground
    rounded-md
    mb-1
    duration-150
    delay-75
    scale-0
    text-xs
    text-center`,
  },

  defaultVariants: {
    vertical: false,
    disabled: false,
    isDragging: false,
    bilateral: false,
    prohibitInteraction: false,
    hideThumbLabel: false,
  },

  variants: {
    vertical: {
      true: {
        base: `w-2 h-full`,
        thumb: `w-5 h-2`,
        thumbLabel: `mb-0 ml-2`,
      },
    },
    disabled: {
      true: {
        base: `pointer-events-none opacity-70`,
        progress: `bg-muted`,
      },
    },
    isDragging: {
      true: {
        base: `cursor-grabbing`,
      },
    },
    bilateral: {
      true: {
        base: 'rounded-none',
      },
    },
    prohibitInteraction: {
      true: {
        base: 'cursor-auto',
      },
    },
    hideThumbLabel: {
      true: {
        thumbLabel: 'opacity-0 scale-0',
      },
    },
  },

  compoundVariants: [
    {
      hideThumbLabel: false,
      isDragging: true,
      class: {
        thumbLabel: 'scale-100 opacity-100',
      },
    },
  ],
})
