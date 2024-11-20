// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/nombre-del-subdirectorio/', // Cambia según tu despliegue
  plugins: [vue()],
})
