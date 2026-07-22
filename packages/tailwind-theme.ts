export const theme = {
  extend: {
    colors: {
      input: 'var(--echo-input)',
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
      muted: {
        DEFAULT: 'var(--echo-muted)',
        foreground: 'var(--echo-muted-foreground)',
      },
      accent: {
        DEFAULT: 'var(--echo-accent)',
        foreground: 'var(--echo-accent-foreground)',
      },
      card: {
        DEFAULT: 'var(--echo-card)',
        foreground: 'var(--echo-card-foreground)',
      },
      'echo-gray-950': 'var(--echo-gray-950)',
      'echo-meter-low': 'var(--echo-meter-low)',
      'echo-meter-medium': 'var(--echo-meter-medium)',
      'echo-meter-high': 'var(--echo-meter-high)',
      'echo-meter-dark-low': 'var(--echo-meter-dark-low)',
      'echo-meter-dark-medium': 'var(--echo-meter-dark-medium)',
      'echo-meter-dark-high': 'var(--echo-meter-dark-high)',
    },
    borderRadius: {
      lg: 'var(--echo-radius)',
      md: 'calc(var(--echo-radius) - 2px)',
      sm: 'calc(var(--echo-radius) - 4px)',
      'echo-full': 'var(--echo-radius-full)',
    },
  },
}
