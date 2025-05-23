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
    base,
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
        // '/mes': {
        //   target: 'http://192.168.127.17',
        //   changeOrigin: true,
        //   bypass: function (req, res, proxyOptions) {
        //     // 如果是mock环境，不进行代理
        //     const useMock = mode === 'development' && env.VITE_USE_MOCK === 'true'
        //     if (useMock) {
        //       return req.url
        //     }
        //   },
        // },
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
      assetsDir,
      chunkSizeWarningLimit,
      cssCodeSplit,
      outDir,
      reportCompressedSize,
      rollupOptions: {
        onwarn: () => {
          return
        },
        output: {
          chunkFileNames: outputHash ? 'static/js/[name]-[hash].js' : 'static/js/[name].js',
          entryFileNames: outputHash ? 'static/js/[name]-[hash].js' : 'static/js/[name].js',
          assetFileNames: outputHash ? 'static/[ext]/[name]-[hash].[ext]' : 'static/[ext]/[name].[ext]',
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
