import { defineConfig } from 'vite'
import { sassPlugin } from './plugins/sassPlugin'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [sassPlugin, vue()],
})
