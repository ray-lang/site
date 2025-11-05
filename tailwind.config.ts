import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/app/**/*.{ts,tsx,md,mdx}',
    './src/components/**/*.{ts,tsx}',
    './content/**/*.{md,mdx}'
  ],
  theme: { extend: {} },
  plugins: []
} satisfies Config
