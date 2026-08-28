import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        // Dependencies change far less often than our own code. Splitting
        // them into their own chunk means a content edit only invalidates
        // the small app bundle in the visitor's cache, not React as well.
        // Vite 8 runs Rolldown, which requires the function form here.
        manualChunks(id) {
          if (id.includes('node_modules')) return 'vendor'
        },
      },
    },
  },
})
