import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    watch: {
      ignored: ["**/src-tauri/**"]
    }
  },
  plugins: [react()],
})
