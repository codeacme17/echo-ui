import { tv } from 'tailwind-variants'

export const useStyle = tv({
  slots: {
    base: `text-foreground
    h-full
    w-full
    flex
    justify-center
    rounded-lg
    bg-card`,

    svg: `w-full
    h-full
    flex
    items-center`,
  },
})
