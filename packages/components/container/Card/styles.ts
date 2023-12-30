import { tv } from 'tailwind-variants'

export const useStyle = tv({
  slots: {
    base: `bg-card
    rounded-lg
    border-2
    border-border
    text-foreground
    transition-[border-color]`,
    header: `text-foreground
    p-2
    border-b
    border-border
    font-bold
    text-lg
    flex
    items-center`,
    body: `w-full
    px-4
    py-2`,
  },

  defaultVariants: {
    toggled: false,
  },

  variants: {
    toggled: {
      true: {
        base: 'border-primary',
      },
    },
  },
})
