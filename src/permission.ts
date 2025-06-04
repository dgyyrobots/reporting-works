import router from './router'
import { useNProgress } from '/@/hooks/web/useNProgress'
import { getAccessToken } from '/@/utils/auth'
import getPageTitle from '/@/utils/pageTitle'

const { start, done } = useNProgress()

// 路由不重定向白名单
const whiteList = ['/login', '/bigsceen', '/social-login', '/auth-redirect', '/bind', '/register', '/oauthLogin/gitee']

// 路由加载前
router.beforeEach(async (to, from, next) => {
  start()
  next()
  // if (getAccessToken()) {
  //   // 有token直接放行
  //   next()
  // } else {
  //   if (whiteList.indexOf(to.path) !== -1) {
  //     next()
  //   } else {
  //     next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
  //   }
  // }
})

router.afterEach((to) => {
  document.title = getPageTitle(to?.meta?.title as string)
  done() // 结束Progress
})
