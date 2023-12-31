import { tv } from 'tailwind-variants'

export const useStyle = tv({
  base: `inline-block 
          px-3 
          py-2 
          border
          border-input
          bg-input
          select-none
          text-foreground
          rounded-md 
          shadow-sm 
          outline-none
          transition-[border]
          placeholder-muted
          appearance-textfield
          focus:ring-primary
          focus:border-primary
          disabled:pointer-events-none
          disabled:opacity-70
          [&::-webkit-inner-spin-button]:appearance-none
          [&::-webkit-outer-spin-button]:m-0
          [&::-webkit-inner-spin-button]:appearance-none
          [&::-webkit-outer-spin-button]:m-0`,

  defaultVariants: {
    size: 'md',
    radius: 'md',
    isDragging: false,
    bilateral: false,
  },

  variants: {
    size: {
      sm: 'text-sm py-1 px-2',
      md: 'text-base py-2 px-4',
      lg: 'text-lg py-3 px-6',
    },
    radius: {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    },
    isDragging: {
      true: `cursor-ns-resize 
              [&::selection]:bg-transparent 
              [&::selection]:transition-colors`,
    },
    bilateral: {
      true: `text-center`,
    },
  },
})
