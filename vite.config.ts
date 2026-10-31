import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// base: o GitHub Pages serve o site em https://jppegarare.github.io/leonidaneon/
export default defineConfig({
  plugins: [react()],
  base: '/leonidaneon/',
})
