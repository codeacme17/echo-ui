import { tv } from 'tailwind-variants'

export const useStyle = tv({
  slots: {
    base: `group
    inline-flex 
    items-center 
    cursor-pointer
    text-foreground
    select-none`,
    wrapper: `relative 
    inline-block 
    z-0`,
    button: `appearance-none 
    bg-button
    cursor-pointer
    rounded-md
    absolute
    w-full
    h-full
    cursor-pointer`,
    thumb: `bg-primary 
    opacity-0
    scale-0
    tansition-all
    rounded-sm
    w-2/3
    h-2/3
    absolute
    top-1/2
    left-1/2
    -translate-x-1/2
    -translate-y-1/2
    transition-[transform,opacity]`,
    label: `ml-2`,
  },

  defaultVariants: {
    checked: false,
    disabled: false,
    size: 'md',
  },

  variants: {
    checked: {
      true: {
        thumb: 'opacity-100 scale-100',
      },
    },
    disabled: {
      true: {
        base: 'opacity-70 pointer-events-none',
      },
    },
    size: {
      sm: {
        wrapper: 'w-4 h-4',
        label: 'text-sm',
      },
      md: {
        wrapper: 'w-5 h-5',
        label: 'text-base',
      },
      lg: {
        wrapper: 'w-6 h-6',
        label: 'text-lg',
      },
    },
  },

  compoundVariants: [
    {
      checked: true,
      disabled: true,
      class: {
        thumb: 'bg-muted',
      },
    },
  ],
})

export const checkboxGroupStyle = tv({
  base: `inline-flex gap-2`,
})
