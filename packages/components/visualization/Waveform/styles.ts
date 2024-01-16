import { tv } from 'tailwind-variants'

export const useStyle = tv({
  slots: {
    base: `text-foreground
    relative
    w-full
    h-full
    flex
    justify-center
    rounded-lg
    bg-card`,

    svg: `w-full
    absolute
    top-0
    left-0
    h-full
    flex
    items-center`,
  },
})
