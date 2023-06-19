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
        target: 'http://168.138.184.186:3089/',
        changeOrigin: true,
      },
    }
  }
})
