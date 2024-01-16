import { tv } from 'tailwind-variants'

export const useStyle = tv({
  slots: {
    base: `text-foreground
    flex
    justify-center
    rounded-lg
    bg-card`,
    canvas: `w-full
    h-full
    flex
    items-center`,
  },
})
