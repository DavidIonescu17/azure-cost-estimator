import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/pricing': {
        target: 'https://prices.azure.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/pricing/, '/api/retail/prices'),
      }
    }
  }
})
