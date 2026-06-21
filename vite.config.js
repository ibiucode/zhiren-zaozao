import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base 設為相對路徑，搭配 HashRouter 可直接部署到 GitHub Pages（不需知道 repo 名稱、不會 refresh 404）。
export default defineConfig({
  plugins: [react()],
  base: './',
})
