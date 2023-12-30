import { tv } from 'tailwind-variants'

export const useStyle = tv({
  slots: {
    base: `relative
    overflow-hidden
    transition-[background-color,box-shadow]`,
    glass: `top-1/2
    left-1/2
    absolute
    rounded-full
    -translate-x-1/2
    -translate-y-1/2
    w-full
    h-full`,
  },
})
