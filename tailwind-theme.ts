export const theme = {
  container: {
    center: true,
    padding: '2rem',
    screens: {
      '2xl': '1400px',
    },
  },
  extend: {
    colors: {
      input: 'var(--echo-input)',
      ring: 'hsl(var(--echo-ring))',
      background: 'var(--echo-background)',
      foreground: 'var(--echo-foreground)',
      border: {
        DEFAULT: 'var(--echo-border)',
        foreground: 'var(--echo-border-foreground)',
      },
      button: {
        DEFAULT: 'var(--echo-button)',
        foreground: 'var(--echo-button-foreground)',
      },
      primary: {
        DEFAULT: 'var(--echo-primary)',
        foreground: 'var(--echo-primary-foreground)',
      },
      secondary: {
        DEFAULT: 'var(--echo-secondary)',
        foreground: 'var(--echo-secondary-foreground)',
      },
      destructive: {
        DEFAULT: 'hsl(var(--echo-destructive))',
        foreground: 'hsl(var(--echo-destructive-foreground))',
      },
      muted: {
        DEFAULT: 'var(--echo-muted)',
        foreground: 'var(--echo-muted-foreground)',
      },
      accent: {
        DEFAULT: 'var(--echo-accent)',
        foreground: 'var(--echo-accent-foreground)',
      },
      popover: {
        DEFAULT: 'hsl(var(--echo-popover))',
        foreground: 'hsl(var(--echo-popover-foreground))',
      },
      card: {
        DEFAULT: 'var(--echo-card)',
        foreground: 'var(--echo-card-foreground)',
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
        to: {
          height: 'var(--echo-radix-accordion-content-height)',
        },
      },
      'accordion-up': {
        from: {
          height: 'var(--echo-radix-accordion-content-height)',
        },
        to: { height: 0 },
      },
    },
    animation: {
      'accordion-down': 'accordion-down 0.2s ease-out',
      'accordion-up': 'accordion-up 0.2s ease-out',
    },
  },
}
