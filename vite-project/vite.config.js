import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [VantResolver()],
    }),
    AutoImport({
      resolvers: [VantResolver()],
    }),
  ],
  server: {
    port: 5173,
    // 核心配置：代理跨域
    proxy: {
      // 只要前端请求以 /api 开头，就转发给后端 3000 端口
      '/api': {
        target: 'http://localhost:3000', // 你的 Node.js 后端地址
        changeOrigin: true, // 修改请求头中的 Host，伪造同源
        // ⚠️ 注意：这里不要加 rewrite，因为你的后端路径本身就是 /api/products
      }
    }
  }
})