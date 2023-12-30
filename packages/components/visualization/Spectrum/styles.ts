import { tv } from 'tailwind-variants'

export const useStyle = tv({
  slots: {
    base: `w-auto
    h-auto
    text-foreground
    flex
    p-3
    justify-center
    rounded-lg
    bg-input`,
    chart: `w-full
    h-full
    flex
    items-center`,
  },
})
