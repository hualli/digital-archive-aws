import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // Aquí definimos que @ apunta a la carpeta src
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})