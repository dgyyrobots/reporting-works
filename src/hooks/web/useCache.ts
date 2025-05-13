/**
 * 配置浏览器本地存储的方式，可直接存储对象数组。
 */

import WebStorageCache from 'web-storage-cache'

type CacheType = 'localStorage' | 'sessionStorage'

export const CACHE_KEY = {
  IS_DARK: 'isDark',
  USER: 'user',
  LANG: 'lang',
  THEME: 'theme',
  LAYOUT: 'layout',
  ROLE_ROUTERS: 'roleRouters',
  DICT_CACHE: 'dictCache',
  FONT_SIZE: 'fontSize',
  LOGIN_FORM: 'LOGINFORM', // 添加登录表单的键
}

export const useCache = (type: CacheType = 'localStorage') => {
  const wsCache: WebStorageCache = new WebStorageCache({
    storage: type,
  })

  // 添加获取所有缓存键的方法
  const getKeys = (): string[] => {
    const keys: string[] = [];
    if (type === 'localStorage') {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) keys.push(key);
      }
    } else {
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key) keys.push(key);
      }
    }
    return keys;
  }

  // 添加选择性清除缓存的方法，保留指定的键
  const clearExcept = (exceptKeys: string[] = []) => {
    const keys = getKeys();
    keys.forEach(key => {
      if (!exceptKeys.includes(key)) {
        wsCache.delete(key);
      }
    });
  }

  return {
    wsCache,
    getKeys,
    clearExcept
  }
}
