import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { CssSyntaxError } from 'postcss'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],

  test: {
    global: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
  },
})
