import { tv } from 'tailwind-variants'

export const useStyle = tv({
  slots: {
    base: `group inline-flex flex-col items-center`,
    button: `cursor-pointer bg-muted`,
    progress: `absolute
    top-0
    left-0
    right-full
    rounded-full
    w-full
    h-full`,
    trigger: `w-full
    h-full
    border-2
    border-transparent
    rounded-full 
    bg-button`,
    triggerPointer: `absolute 
    shadow-sm
    shadow-muted
    rounded-sm
    origin-bottom
    transition-[width]
    left-1/2 
    -translate-x-1/2`,
    topLabel: `text-muted-foreground select-none font-bold mb-1.5`,
    bottomLabel: `text-sm select-none text-opacity-80 mt-1.5 text-muted-foreground`,
  },

  defaultVariants: {
    isDragging: false,
    disabled: false,
  },

  variants: {
    isDragging: {
      true: {
        button: `cursor-grabbing`,
      },
    },
    disabled: {
      true: {
        button: `pointer-events-none`,
      },
    },
  },
})

export const knobGroupStyle = tv({
  base: `inline-flex gap-5`,
})
