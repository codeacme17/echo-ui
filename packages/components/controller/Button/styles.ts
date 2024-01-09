import { tv } from 'tailwind-variants'

export const useStyle = tv({
  base: `bg-button
           text-foreground
           inline-flex
           justify-center
           items-center
           py-2
           px-4 
           transition-[color,background-color,box-shadow,border-color,transform]
           duration-200
           select-none
           active:scale-95
           disabled:cursor-not-allowed
           disabled:pointer-events-none 
           disabled:opacity-70`,

  defaultVariants: {
    toggled: false,
    size: 'md',
    radius: 'md',
  },

  variants: {
    toggled: {
      true: 'shadow-inner text-black bg-primary disabled:bg-muted',
    },
    size: {
      sm: 'text-sm py-1 px-2',
      md: 'text-base py-2 px-4',
      lg: 'text-lg py-3 px-6',
    },
    radius: {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    },
    isInGroup: {
      true: 'rounded-none',
    },
  },

  compoundVariants: [
    {
      isInGroup: true,
      class: 'first:rounded-l-none last:rounded-r-none',
    },
    {
      isInGroup: true,
      radius: 'sm',
      class: 'first:rounded-l-sm last:rounded-r-sm',
    },
    {
      isInGroup: true,
      radius: 'md',
      class: 'first:rounded-l-md last:rounded-r-md',
    },
    {
      isInGroup: true,
      radius: 'lg',
      class: 'first:rounded-l-lg last:rounded-r-lg',
    },
    {
      isInGroup: true,
      radius: 'full',
      class: 'first:rounded-l-full last:rounded-r-full',
    },
  ],
})

export const useGroupStyle = tv({
  base: `inline-flex flex-row border-border overflow-hidden`,
})
