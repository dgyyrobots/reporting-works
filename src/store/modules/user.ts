import { defineStore } from 'pinia'
import store from '../index'
import { getInfo, loginOut } from '/@/api/login'
import { CACHE_KEY, useCache } from '/@/hooks/web/useCache'
import { getAccessToken, removeToken, getLoginForm } from '/@/utils/auth'

const { wsCache } = useCache()

interface UserVO {
  id: number
  avatar: string
  nickname: string
}
interface UserInfoVO {
  permissions: string[]
  roles: string[]
  isSetUser: boolean
  user: UserVO
}

export const useUserStore = defineStore('user', {
  state: (): UserInfoVO => ({
    permissions: [],
    roles: [],
    isSetUser: false,
    user: {
      id: 0,
      avatar: '',
      nickname: '',
    },
  }),
  getters: {
    token(): string {
      return getAccessToken()
    },
    username(): string {
      return this.user.nickname
    },
    avatar(): string {
      return this.user.avatar
    },
    getToken(): string {
      return getAccessToken()
    },
    getUsername(): string {
      return this.user.nickname
    },
    getAvatar(): string {
      return this.user.avatar
    },
    getPermissions(): string[] {
      return this.permissions
    },
    getRoles(): string[] {
      return this.roles
    },
    getIsSetUser(): boolean {
      return this.isSetUser
    },
    getUser(): UserVO {
      return this.user
    },
  },
  actions: {
    async setUserInfoAction() {
      if (!getAccessToken()) {
        this.resetState()
        return null
      }
      let userInfo = wsCache.get(CACHE_KEY.USER)
      if (!userInfo) {
        userInfo = await getInfo()
      }
      // 因为不使用所以删除
      delete userInfo.permissions
      delete userInfo.menus
      this.permissions = userInfo.permissions
      this.roles = userInfo.roles
      this.user = userInfo.user
      this.isSetUser = true
      wsCache.set(CACHE_KEY.USER, userInfo)
      wsCache.set(CACHE_KEY.ROLE_ROUTERS, userInfo.menus)
    },
    async loginOut() {
      await loginOut()
      removeToken()

      // 获取登录表单信息，检查是否勾选了"记住我"
      const loginForm = getLoginForm()
      if (!loginForm || !loginForm.rememberMe) {
        // 如果没有登录表单信息或未勾选"记住我"，则清除所有缓存
        wsCache.clear()
      } else {
        // 如果勾选了"记住我"，则只保留登录表单信息
        const { clearExcept } = useCache()
        clearExcept([CACHE_KEY.LOGIN_FORM])
      }

      this.resetState()
    },
    resetState() {
      this.permissions = []
      this.roles = []
      this.isSetUser = false
      this.user = {
        id: 0,
        avatar: '',
        nickname: '',
      }
    },
  },
})

export const useUserStoreWithOut = () => {
  return useUserStore(store)
}
