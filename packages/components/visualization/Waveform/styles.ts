import { tv } from 'tailwind-variants'

export const useStyle = tv({
  slots: {
    base: `text-foreground
    relative
    w-full
    h-full
    flex
    justify-center
    rounded-md
    bg-card`,

    svg: `w-full
    cursor-pointer
    absolute
    top-0
    left-0
    h-full
    flex
    items-center`,

    cursor: `h-full
    absolute
    top-1/2
    transform
    -translate-y-1/2
    z-10
    transition-[background-color]
    cursor-pointer`,

    label: `absolute 
    left-2.5 
    top-2 
    text-primary 
    text-sm`,
  },
})
