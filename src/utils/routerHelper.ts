import { cloneDeep, omit } from 'lodash-es'
import type { RouteLocationNormalized, RouteRecordNormalized, Router } from 'vue-router'
import { RouteRecordRaw, createRouter, createWebHashHistory } from 'vue-router'
import { isUrl } from '/@/utils/is'
import Layout from '/@vab/layouts/index.vue'

const modules = import.meta.glob('../views/**/*.{vue,tsx}')

export { Layout }





/**
 * 注册一个异步组件
 * @param componentPath 例:/bpm/oa/leave/detail
 */
export const registerComponent = (componentPath: string) => {
  for (const item in modules) {
    if (item.includes(componentPath)) {
      // 使用异步组件的方式来动态加载组件
      // @ts-ignore
      return defineAsyncComponent(modules[item])
    }
  }
}

export const getParentLayout = () => {
  return () =>
    new Promise((resolve) => {
      resolve({
        name: 'ParentLayout',
      })
    })
}

// 按照路由中meta下的rank等级升序来排序路由
export const ascending = (arr: any[]) => {
  arr.forEach((v) => {
    if (v?.meta?.rank === null) v.meta.rank = undefined
    if (v?.meta?.rank === 0) {
      if (v.name !== 'home' && v.path !== '/') {
        console.warn('rank only the home page can be 0')
      }
    }
  })
  return arr.sort((a: { meta: { rank: number } }, b: { meta: { rank: number } }) => {
    return a?.meta?.rank - b?.meta?.rank
  })
}

export const getRawRoute = (route: RouteLocationNormalized): RouteLocationNormalized => {
  if (!route) return route
  const { matched, ...opt } = route
  return {
    ...opt,
    matched: (matched
      ? matched.map((item) => ({
          meta: item.meta,
          name: item.name,
          path: item.path,
        }))
      : undefined) as RouteRecordNormalized[],
  }
}

let routeIndex = 0
// 用于存储已使用的路由名称
const usedRouteNames = new Set<string>()
// 生成随机字符串
const generateRandomString = () => Math.random().toString(36).substring(2, 8)
// 获取唯一的路由名称
const getUniqueRouteName = (name: string): string => {
  let uniqueName = name
  while (usedRouteNames.has(uniqueName)) {
    uniqueName = `${name}-${generateRandomString()}`
  }
  usedRouteNames.add(uniqueName)
  return uniqueName
}
// 后端控制路由生成
export const generateRoute = (routes: AppCustomRouteRecordRaw[]): AppRouteRecordRaw[] => {
  const res: AppRouteRecordRaw[] = []
  const modulesRoutesKeys = Object.keys(modules)

  // // 重置已使用的路由名称集合
  // usedRouteNames.clear()

  for (const route of routes) {
    const meta = {
      title: route.name,
      icon: route.icon,
      hidden: !route.visible,
      noCache: !route.keepAlive,
      alwaysShow: route.children && route.children.length === 1 && (route.alwaysShow !== undefined ? route.alwaysShow : true),
    }
    // 路由地址转首字母大写驼峰，作为路由名称，适配keepAlive
    let data: AppRouteRecordRaw = {
      path: route.path,
      name: getUniqueRouteName(route.componentName && route.componentName.length > 0 ? route.componentName : toCamelCase(route.path, true)),
      redirect: route.redirect,
      meta: meta,
    }
    //处理顶级非目录路由
    if (!route.children && route.parentId == 0 && route.component) {
      data.component = Layout
      data.meta = {}
      data.name = getUniqueRouteName(`${toCamelCase(route.path, true)}Parent`)
      data.redirect = ''
      meta.alwaysShow = true
      const childrenData: AppRouteRecordRaw = {
        path: '',
        name: route.componentName && route.componentName.length > 0 ? route.componentName : toCamelCase(route.path, true),
        redirect: route.redirect,
        meta: meta,
      }
      const index = route?.component
        ? modulesRoutesKeys.findIndex((ev) => ev.includes(route.component))
        : modulesRoutesKeys.findIndex((ev) => ev.includes(route.path))
      childrenData.component = modules[modulesRoutesKeys[index]]
      data.children = [childrenData]
    } else {
      // 目录
      if (route.children) {
        data.component = Layout
        data.redirect = getRedirect(route.path, route.children)
        // 外链
      } else if (isUrl(route.path)) {
        data = {
          path: '/external-link',
          component: Layout,
          meta: {
            name: route.name,
          },
          children: [data],
        } as AppRouteRecordRaw
        // 菜单
      } else {
        // 对后端传component组件路径和不传做兼容（如果后端传component组件路径，那么path可以随便写，如果不传，component组件路径会根path保持一致）
        const index = route?.component
          ? modulesRoutesKeys.findIndex((ev) => ev.includes(route.component))
          : modulesRoutesKeys.findIndex((ev) => ev.includes(route.path))
        data.component = modules[modulesRoutesKeys[index]]
      }
      if (route.children) {
        data.children = generateRoute(route.children)
      }
    }
    data.name = data.name || getUniqueRouteName(`route-${routeIndex++}`)
    res.push(data as AppRouteRecordRaw)
  }
  return res
}
export const getRedirect = (parentPath: string, children?: AppCustomRouteRecordRaw[]): string => {
  if (!children || children.length == 0) {
    return parentPath
  }
  const path = generateRoutePath(parentPath, children[0].path)
  // 递归子节点
  if (children[0].children) return getRedirect(path, children[0].children)
  return path
}
export const generateRoutePath = (parentPath: string, path: string) => {
  if (parentPath.endsWith('/')) {
    parentPath = parentPath.slice(0, -1) // 移除默认的 /
  }
  if (!path.startsWith('/')) {
    path = `/${path}`
  }
  return parentPath + path
}
export const pathResolve = (parentPath: string, path: string) => {
  if (isUrl(path)) return path
  const childPath = path.startsWith('/') || !path ? path : `/${path}`
  return `${parentPath}${childPath}`.replace(/\/\//g, '/')
}

// 路由降级
export const flatMultiLevelRoutes = (routes: AppRouteRecordRaw[]) => {
  const modules: AppRouteRecordRaw[] = cloneDeep(routes)
  for (let index = 0; index < modules.length; index++) {
    const route = modules[index]
    if (!isMultipleRoute(route)) {
      continue
    }
    promoteRouteLevel(route)
  }
  return modules
}

// 层级是否大于2
const isMultipleRoute = (route: AppRouteRecordRaw) => {
  if (!route || !Reflect.has(route, 'children') || !route.children?.length) {
    return false
  }

  const children = route.children

  let flag = false
  for (let index = 0; index < children.length; index++) {
    const child = children[index]
    if (child.children?.length) {
      flag = true
      break
    }
  }
  return flag
}

// 生成二级路由
const promoteRouteLevel = (route: AppRouteRecordRaw) => {
  let router: Router | null = createRouter({
    routes: [route as RouteRecordRaw],
    history: createWebHashHistory(),
  })

  const routes = router.getRoutes()
  addToChildren(routes, route.children || [], route)
  router = null

  route.children = route.children?.map((item) => omit(item, 'children'))
}

// 添加所有子菜单
const addToChildren = (routes: RouteRecordNormalized[], children: AppRouteRecordRaw[], routeModule: AppRouteRecordRaw) => {
  for (let index = 0; index < children.length; index++) {
    const child = children[index]
    const route = routes.find((item) => item.name === child.name)
    if (!route) {
      continue
    }
    routeModule.children = routeModule.children || []
    if (!routeModule.children.find((item) => item.name === route.name)) {
      routeModule.children?.push(route as unknown as AppRouteRecordRaw)
    }
    if (child.children?.length) {
      addToChildren(routes, child.children, routeModule)
    }
  }
}
const toCamelCase = (str: string, upperCaseFirst: boolean) => {
  str = (str || '')
    .replace(/-(.)/g, function (group1: string) {
      return group1.toUpperCase()
    })
    .replace(/-/g, '')

  if (upperCaseFirst && str) {
    str = str.charAt(0).toUpperCase() + str.slice(1)
  }

  return str
}
