import { tv } from 'tailwind-variants'

export const useStyle = tv({
  slots: {
    base: `text-foreground
    flex
    justify-center
    rounded-lg
    bg-card`,
    chart: `w-full
    h-full
    flex
    items-center`,
  },
})
