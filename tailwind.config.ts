import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: 'var(--paper)',
        panel: 'var(--panel)',
        ink: 'var(--ink)',
        accent: 'var(--accent)'
      },
      borderColor: {
        hairline: 'var(--hairline)'
      },
      letterSpacing: {
        editorial: '0.05em'
      }
    }
  },
  plugins: []
} satisfies Config;
