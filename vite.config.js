import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// 主配置（popup.html + background.js）
const mainConfig = defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'popup.html'),
        background: resolve(__dirname, 'src/background.js'),
      },
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      },
    },
  },
})

// content.js 配置（内联所有依赖）
const contentConfig = defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: {
      input: resolve(__dirname, 'src/content.js'),
      output: {
        entryFileNames: 'content.js',
        format: 'iife',
        inlineDynamicImports: true, // 强制打包成单文件
      },
    },
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
  },
})

// 默认导出主配置（兼容 `vite build` 直接运行）
export default mainConfig
