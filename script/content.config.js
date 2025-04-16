// content.js 专用配置
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: {
      input: resolve(__dirname, '../src/content.js'),
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
});
