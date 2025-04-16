// 构建脚本 - 分别构建主配置和 content.js
import { build } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// ES Module equivalent for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const watch = process.argv.includes('--watch');

async function buildExtension() {
  try {
    console.log('🏗 Building main files (popup + background)...');
    await build({
      build: {
        watch: watch ? {} : undefined,
      },
    });

    console.log('📦 Building content.js (bundled)...');
    // 创建 content.js 的配置
    const contentConfig = {
      build: {
        watch: watch ? {} : undefined,
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
    };

    await build(contentConfig);

    console.log('✅ All builds completed!');
  } catch (err) {
    console.error('❌ Build failed:', err);
    process.exit(1);
  }
}

buildExtension();
