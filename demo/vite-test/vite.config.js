import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig(() => {
  const plugins = [
    vue()
  ]

  return {
    plugins,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
