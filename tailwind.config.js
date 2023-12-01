/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--echo-border))',
        input: 'hsl(var(--echo-input))',
        ring: 'hsl(var(--echo-ring))',
        background: 'hsl(var(--echo-background))',
        foreground: 'hsl(var(--echo-foreground))',
        primary: {
          DEFAULT: 'hsl(var(--echo-primary))',
          foreground: 'hsl(var(--echo-primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--echo-secondary))',
          foreground: 'hsl(var(--echo-secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--echo-destructive))',
          foreground: 'hsl(var(--echo-destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--echo-muted))',
          foreground: 'hsl(var(--echo-muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--echo-accent))',
          foreground: 'hsl(var(--echo-accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--echo-popover))',
          foreground: 'hsl(var(--echo-popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--echo-card))',
          foreground: 'hsl(var(--echo-card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--echo-radius)',
        md: 'calc(var(--echo-radius) - 2px)',
        sm: 'calc(var(--echo-radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--echo-radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--echo-radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
}
