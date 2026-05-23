import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // split heavy deps into separate cached chunks for faster first load
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('@react-three') || id.includes('postprocessing')) return 'r3f'
          if (id.includes('/three/') || id.includes('three-stdlib')) return 'three'
          if (id.includes('gsap')) return 'gsap'
          if (id.includes('react') || id.includes('scheduler')) return 'react'
          return 'vendor'
        },
      },
    },
  },
})
