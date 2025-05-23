import { cloneDeep } from 'lodash-es'
import { defineStore } from 'pinia'
import store from '../index'
import { CACHE_KEY, useCache } from '/@/hooks/web/useCache'
import remainingRouter from '/@/router/modules/remaining'
import { flatMultiLevelRoutes, generateRoute } from '/@/utils/routerHelper'

const { wsCache } = useCache()

export interface PermissionState {
  routers: AppRouteRecordRaw[]
  addRouters: AppRouteRecordRaw[]
  menuTabRouters: AppRouteRecordRaw[]
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    routers: [],
    addRouters: [],
    menuTabRouters: [],
  }),
  getters: {
    getRouters(): AppRouteRecordRaw[] {
      return this.routers
    },
    getAddRouters(): AppRouteRecordRaw[] {
      return flatMultiLevelRoutes(cloneDeep(this.addRouters))
    },
    getMenuTabRouters(): AppRouteRecordRaw[] {
      return this.menuTabRouters
    },
  },
  actions: {
    async generateRoutes(): Promise<unknown> {
      return new Promise<void>((resolve) => {
        // 获得菜单列表，它在登录的时候，setUserInfoAction 方法中已经进行获取
        let res: AppCustomRouteRecordRaw[] = []
        if (wsCache.get(CACHE_KEY.ROLE_ROUTERS)) {
          res = wsCache.get(CACHE_KEY.ROLE_ROUTERS) as AppCustomRouteRecordRaw[]
        }
        const routerMap: AppRouteRecordRaw[] = generateRoute(res)
        // 动态路由，404一定要放到最后面
        this.addRouters = routerMap.concat([
          {
            path: '/application',
            name: 'Application',
            component: () => import('/@/views/index/application.vue'),
            meta: {
              title: '客户端',
            },
          },
          {
            path: '/:path(.*)*',
            redirect: '/404',
            name: '404Page',
            meta: {
              hidden: true,
              breadcrumb: false,
            },
            value: 404,
          },
        ])
        console.log(routerMap)
        // 渲染菜单的所有路由
        this.routers = cloneDeep(remainingRouter).concat(routerMap)
        resolve()
      })
    },
    setMenuTabRouters(routers: AppRouteRecordRaw[]): void {
      this.menuTabRouters = routers
    },
  },
})

export const usePermissionStoreWithOut = () => {
  return usePermissionStore(store)
}
