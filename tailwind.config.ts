import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        tyre: {
          tread: '#0a0a0a',
          rim: '#1a1a1a'
        },
        compound: {
          soft: '#e10600',
          medium: '#ffdf00',
          hard: '#ffffff',
          inter: '#00a651',
          wet: '#00A3E0'
        }
      }
    },
  },
  plugins: [],
} satisfies Config

