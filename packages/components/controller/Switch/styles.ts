import { tv } from 'tailwind-variants'

export const useStyle = tv({
  slots: {
    base: `group
    text-accent-foreground
    inline-flex
    items-center
    cursor-pointer
    select-none`,
    button: `rounded-full
    bg-input
    overflow-hidden
    inline-flex
    w-12
    h-6
    relative
    items-center
    border-transparent
    duration-200
    transition-[background-color]
    disabled:bg-muted`,
    thumb: `w-3
    h-3
    left-2
    block
    shadow-sm
    shadow-accent-foreground
    rounded-full
    absolute
    bg-button-foreground
    transition-[left,background-color]`,
    label: `inline-block ml-2`,
  },

  defaultVariants: {
    disabled: false,
    toggled: false,
    size: 'md',
  },

  variants: {
    size: {
      sm: { button: 'w-12 h-6', thumb: 'w-3 h-3', label: 'text-sm' },
      md: { button: 'w-14 h-8', thumb: 'w-4 h-4', label: 'text-base' },
      lg: { button: 'w-16 h-10', thumb: 'w-5 h-5', label: 'text-lg' },
    },
    disabled: {
      true: {
        base: `pointer-events-none opacity-70`,
        thumb: `bg-input shadow-none`,
      },
    },
    toggled: {
      true: {
        button: `bg-primary`,
        thumb: `bg-gray-950 shadow-gray-950`,
      },
    },
  },
})
