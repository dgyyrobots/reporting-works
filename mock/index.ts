import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer'

// 直接导入所有controller模块
import * as workcenter from './controller/workcenter'
import * as login from './controller/login'
import * as bill from './controller/bill'

// 可以根据需要继续添加其他controller

// 创建模块数组
const mockModules: any[] = [
  ...((workcenter as any).default || []),
  ...((login as any).default || []),
  ...((bill as any).default || []),

  // 可以根据需要继续添加其他controller
]

export const setupProdMockServer = () => {
  createProdMockServer(mockModules)
}
