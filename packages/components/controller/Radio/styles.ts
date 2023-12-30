import { tv } from 'tailwind-variants'

export const radioStyle = tv({
  slots: {
    base: `group
    inline-flex 
    cursor-pointer 
    text-foreground
    items-center
    select-none`,
    button: `appearance-none 
    bg-button
    border-button
    cursor-pointer
    checked:bg-primary
    checked:disabled:bg-muted`,
    label: `ml-2`,
  },

  defaultVariants: {
    disabled: false,
    size: 'md',
  },

  variants: {
    size: {
      sm: {
        button: 'w-4 h-4 border-[3px]',
        label: 'text-sm',
      },
      md: {
        button: 'w-5 h-5 border-4',
        label: 'text-base',
      },
      lg: {
        button: 'w-6 h-6 border-[5px]',
        label: 'text-lg',
      },
    },
    disabled: {
      true: {
        base: 'opacity-70 pointer-events-none',
      },
    },
  },
})

export const radioGroupStyle = tv({
  base: `inline-flex gap-2`,
})
