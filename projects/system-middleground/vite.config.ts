import * as path from 'path';
import { defineConfig, Plugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import legacy from '@vitejs/plugin-legacy';
import { setNodeEnv } from "./src/utils/env";
import { vitePluginStore } from "./src/utils/store";
import { vitePluginLocales } from "./src/utils/i18n";
import { vitePluginMock } from "./src/utils/mock";
import { vitePluginIconSvg } from "./src/components/IconSvg/plugin";
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';


// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {

  // 自定义设置 nodejs .env
  setNodeEnv(mode);

  // 开发服务器端口
  const port: number = parseInt(process.env.APP_PORT || '3000');

  // 插件
  const plugins: (Plugin | Plugin[])[] = [
    vue(),
    vitePluginStore(),
    vitePluginLocales(),
    vitePluginIconSvg(),
    Components({
      resolvers: [VantResolver()],
    }),
  ]

  // vitePluginMock
  mode === 'development' && process.env.APP_MOCK === 'true' && plugins.push(vitePluginMock());

  // @vitejs/plugin-legacy
  command === 'build' && plugins.push(legacy());

  return {
    base: '/',
    plugins,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      host: true,
      port,
      proxy: {
        // "/api": {
        //   target: "http://101.33.215.224",
        //   changeOrigin: true,
        //   rewrite: (path) => path.replace(/^\/api/, '')
        // },
        // "/release": {
        //   target: "http://101.33.215.224",
        //   changeOrigin: true,
        //   rewrite: (path) => path.replace(/^\/release/, '')
        // },
        // "/prod": {
        //   target: "http://101.33.215.224",
        //   changeOrigin: true,
        //   rewrite: (path) => path.replace(/^\/prod/, '')
        // },
      }
    }
  }
})
