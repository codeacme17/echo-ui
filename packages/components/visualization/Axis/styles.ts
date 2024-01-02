import { tv } from 'tailwind-variants'

export const useStyle = tv({
  base: `w-full
  h-3
  text-muted
  overflow-visible
  select-none`,

  defaultVariants: {
    vertical: false,
  },

  variants: {
    vertical: {
      true: 'h-full w-3',
    },
  },
})
