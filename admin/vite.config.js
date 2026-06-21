import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 後台 admin app 跑在 5174（與前台 5173 區隔）。base 相對路徑方便獨立部署。
export default defineConfig({
  plugins: [react()],
  base: './',
  server: { port: 5174 },
})
