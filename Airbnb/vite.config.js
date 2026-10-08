import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
    css: true,
    include: ['tests/**/*.test.{js,jsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      reportsDirectory: './coverage',
      all: true,
      include: [
        'src/utils/date.js',
        'src/context/**/*.jsx',
        'src/hooks/**/*.js',
        'src/components/booking/**/*.jsx',
        'src/components/ui/ExpandableText.jsx',
        'src/components/layout/Navbar.jsx',
      ],
      exclude: [
        'tests/**',
        '**/*.test.*',
      ],
      thresholds: {
        statements: 90,
        branches: 90,
        functions: 90,
        lines: 90,
      },
    },
  },
})
