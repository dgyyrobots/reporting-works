import autoprefixer from 'autoprefixer'
import dayjs from 'dayjs'
import { basename, resolve } from 'path'
import type { ConfigEnv, UserConfig } from 'vite'
import { defineConfig, loadEnv } from 'vite'
import { dependencies, devDependencies, name, version } from './package.json'
import {
  assetsDir,
  base,
  chunkSizeWarningLimit,
  cssCodeSplit,
  exclude,
  https,
  include,
  minify,
  open,
  outDir,
  outputHash,
  port,
  reportCompressedSize,
} from '/@/config'
import { createVitePlugin, createWatch } from '/@vab/build'
import { cliConfig } from './src/config/cli.config'

const lastBuildTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
const info = { dependencies, devDependencies, lastBuildTime, name, version }

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  process.env['VITE_APP_UPDATE_TIME'] = info.lastBuildTime
  process.env['VITE_USER_NODE_ENV'] = mode
  const root = process.cwd()
  const env = loadEnv(mode, root)
  createWatch(env)
  console.log(info.lastBuildTime)

  return {
    base: cliConfig.base as string,
    root,
    server: {
      open,
      port,
      hmr: {
        overlay: true,
      },
      host: '0.0.0.0',
      warmup: {
        clientFiles: ['./index.html', './library/{components,layouts}/*', './src/{views,plugins}/*'],
      },
      https,
      proxy: {
        '/mes/OrderInProduction/getDeviceNumber': {
          target: 'http://192.168.127.8/', // 替换为实际的目标服务器地址
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/mes/, '')
        },
        '/zy': {
          target: 'http://192.168.127.17/', // 替换为实际的目标服务器地址
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/zy/, '')
        },
        '/mes': {
          target: 'http://192.168.127.17/', // 替换为实际的目标服务器地址
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/mes/, '')
        },
        '/erp': {
          target: 'http://192.168.127.17/', // 替换为实际的目标服务器地址
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/erp/, '')
        },
        '/apps': {
          target: 'http://192.168.127.17/', // 替换为实际的目标服务器地址
          changeOrigin: true,
          // 
        }
      },
    },
    resolve: {
      alias: {
        '~/': `${resolve(__dirname, '.')}/`,
        '/#/': `/${resolve(__dirname, 'src/types')}/`,
        '@/': `/${resolve(__dirname, 'src')}/`,
        '/@/': `/${resolve(__dirname, 'src')}/`,
        '/@vab/': `/${resolve(__dirname, 'library')}/`,
        '/@types/': `/${resolve(__dirname, 'src/types')}/`,
      },
    },
    optimizeDeps: {
      include,
      exclude,
    },
    build: {
      assetsDir: cliConfig.assetsDir as string,
      chunkSizeWarningLimit,
      cssCodeSplit,
      outDir,
      reportCompressedSize,
      rollupOptions: {
        onwarn: () => {
          return
        },
        output: {
          // 使用自定义静态资源输出路径
          assetFileNames: (assetInfo) => {
            const prefix = cliConfig.assetPathPrefix ? `${cliConfig.assetPathPrefix.replace(/^\//, '')}/` : '';
            const assetsDir = cliConfig.assetsDir as string;
            const info = assetInfo.name.split('.');
            const ext = info[info.length - 1];

            if (/\.(png|jpe?g|gif|svg|webp)$/.test(assetInfo.name)) {
              return `${prefix}${assetsDir}/img/[name]-[hash].[ext]`;
            }

            if (/\.(woff2?|eot|ttf|otf)$/.test(assetInfo.name)) {
              return `${prefix}${assetsDir}/fonts/[name]-[hash].[ext]`;
            }

            if (/\.(css)$/.test(assetInfo.name)) {
              return `${prefix}${assetsDir}/css/[name]-[hash].[ext]`;
            }

            return `${prefix}${assetsDir}/[ext]/[name]-[hash].[ext]`;
          },
          chunkFileNames: (chunkInfo) => {
            const prefix = cliConfig.assetPathPrefix ? `${cliConfig.assetPathPrefix.replace(/^\//, '')}/` : '';
            const assetsDir = cliConfig.assetsDir as string;
            return `${prefix}${assetsDir}/js/[name]-[hash].js`;
          },
          entryFileNames: (chunkInfo) => {
            const prefix = cliConfig.assetPathPrefix ? `${cliConfig.assetPathPrefix.replace(/^\//, '')}/` : '';
            const assetsDir = cliConfig.assetsDir as string;
            return `${prefix}${assetsDir}/js/[name]-[hash].js`;
          }
        },
      },
      minify,
      target: 'es2022',
      sourcemap: false,
    },
    css: {
      postcss: {
        plugins: [
          autoprefixer({ grid: true }) as any,
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule: { name: string; remove: () => void }) => {
                if (atRule.name === 'charset') atRule.remove()
              },
            },
          },
        ],
      },
      preprocessorOptions: {
        scss: {
          sassOptions: { outputStyle: 'expanded' },
          additionalData(content: string, loaderContext: string) {
            return ['variables.scss'].includes(basename(loaderContext)) ? content : `@use "~/library/styles/variables.scss" as *;${content}`
          },
        },
      },
      devSourcemap: true,
    },
    plugins: createVitePlugin(env),
    define: {
      'process.env': { ...process.env },
    },
  }
})
