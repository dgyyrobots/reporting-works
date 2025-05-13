import type { RouteRecordRaw } from 'vue-router'
import router from './router'
import { isRelogin } from '/@/config/axios/service'
import { useNProgress } from '/@/hooks/web/useNProgress'
import { useDictStoreWithOut } from '/@/store/modules/dict'
import { usePermissionStoreWithOut } from '/@/store/modules/permission'
import { useUserStoreWithOut } from '/@/store/modules/user'
import { getAccessToken } from '/@/utils/auth'
import getPageTitle from '/@/utils/pageTitle'

const { start, done } = useNProgress()

// 路由不重定向白名单
const whiteList = ['/login', '/social-login', '/auth-redirect', '/bind', '/register', '/oauthLogin/gitee']

// 路由加载前
router.beforeEach(async (to, from, next) => {
  start()
  if (getAccessToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      // 获取所有字典
      const dictStore = useDictStoreWithOut()
      const userStore = useUserStoreWithOut()
      const permissionStore = usePermissionStoreWithOut()
      if (!dictStore.getIsSetDict) {
        console.log(1)
        await dictStore.setDictMap()
      }
      if (!userStore.getIsSetUser) {
        console.log(2)
        isRelogin.show = true
        await userStore.setUserInfoAction()
        isRelogin.show = false
        // 后端过滤菜单
        await permissionStore.generateRoutes()
        permissionStore.getAddRouters.forEach((route) => {
          router.addRoute(route as unknown as RouteRecordRaw) // 动态添加可访问路由表
        })
        const redirectPath = from.query.redirect || to.path
        const redirect = decodeURIComponent(redirectPath as string)
        const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect }
        next(nextData)
      } else {
        console.log(3)
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
    }
  }
})

router.afterEach((to) => {
  document.title = getPageTitle(to?.meta?.title as string)
  done() // 结束Progress
})
