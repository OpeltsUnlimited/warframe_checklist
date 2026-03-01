import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: './', // relative asset path, schould work lokally and on ghpages?
  plugins: [react()],
})