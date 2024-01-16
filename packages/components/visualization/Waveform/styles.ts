import { tv } from 'tailwind-variants'

export const useStyle = tv({
  slots: {
    base: `text-foreground
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
