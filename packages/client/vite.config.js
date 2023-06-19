import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [react()],
  server : {
    
    port : 5179,
    proxy : {
      '/api': {
        target: 'http://localhost:3379',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    }
  }
})
