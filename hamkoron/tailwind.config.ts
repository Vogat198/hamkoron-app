import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        olive: '#4F7D1F',
        'olive-light': '#6BA32A',
        orange: '#F4A100',
        graphite: '#1F1F1F',
      },
    },
  },
  plugins: [],
}
export default config
