// library/build/mock/index.ts
import { viteMockServe } from 'vite-plugin-mock'

export function createMock(localEnabled = true, prodEnabled = false) {
  return viteMockServe({
    mockPath: 'mock',
    localEnabled, // 开发环境启用
    prodEnabled, // 生产环境是否启用
    supportTs: true,
    // 仅在开发环境下注入代码
    ...(localEnabled
      ? {
        injectCode: `
        import { setupProdMockServer } from '../mock';
        setupProdMockServer();
      `,
        injectFile: 'src/main.ts', // 指定要注入的入口文件
      }
      : {}),
    logger: true,
  })
}
