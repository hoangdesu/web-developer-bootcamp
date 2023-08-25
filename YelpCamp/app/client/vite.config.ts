import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/v1": {
        target: "http://localhost:3001",
        // target: 'https://yelp-camp-api.onrender.com/',
        changeOrigin: true,
        secure: false
      }
    }
  },
  // base: '/web-developer-bootcamp/'
})
