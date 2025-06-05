import { service } from './service'

import { setTenantId } from '/@/utils/auth.ts'

import { config } from './config'

import logo from '/@/assets/logo.png'
import icon from '/@/assets/icon.png'
import Cookies from 'js-cookie'  // 需要安装 js-cookie 依赖

const { default_headers } = config

// export const tenantPromise = (() => {
//   const website = location.host
//   // let tenant = service.get(`/system/tenant/get-by-website?website=${website}`)
//   let tenant = service.get(`/system/tenant/get-tenant-by-domain-name?domainName=${website}`)
//   //tenant = tenant && tenant.id ? tenant : {id: 1, name: '惠智造', icon: icon, systemLogo: logo}
//   tenant = tenant && tenant.id ? tenant : { id: 158, name: '江苏澳美', icon: icon, systemLogo: logo }
//   console.log("获取的租户信息: ", tenant);
//   setTenantId(tenant.id)

//   return tenant
// })()

const request = async (option: any) => {
  const { url, method, params, data, headersType, responseType, cookies, ...config } = option
  // await tenantPromise

  // 处理 Cookie
  const headers: Record<string, string> = {
    'Content-Type': headersType || default_headers,
  }

  // // 如果提供了 cookies 参数，将其添加到请求头
  // if (cookies && typeof cookies === 'object') {
  //   for (const [key, value] of Object.entries(cookies)) {
  //     Cookies.set(key, value as string)
  //   }
  // }

  // // 获取所有 Cookie 并添加到请求头
  // const allCookies = Cookies.get()
  // if (Object.keys(allCookies).length > 0) {
  //   headers['Cookie'] = Object.entries(allCookies)
  //     .map(([key, value]) => `${key}=${value}`)
  //     .join('; ')
  // }

  return service({
    url: url,
    method,
    params,
    data,
    ...config,
    responseType: responseType,
    headers,
  })
}
export default {
  request,
  get: async <T = any>(option: any) => {
    const res = await request({ method: 'GET', ...option })
    // return res.data as unknown as T
    // 判断存在res.data则返回res.data，否则返回res
    return (res && res.hasOwnProperty('data')) ? (res.data as unknown as T) : (res as unknown as T)
  },
  post: async <T = any>(option: any) => {
    const res = await request({ method: 'POST', ...option })
    return res.data as unknown as T
  },

  postOriginal: async (option: any) => {
    const res = await request({ method: 'POST', ...option })
    return res
  },

  delete: async <T = any>(option: any) => {
    const res = await request({ method: 'DELETE', ...option })
    return res.data as unknown as T
  },
  put: async <T = any>(option: any) => {
    const res = await request({ method: 'PUT', ...option })
    return res.data as unknown as T
  },
  download: async <T = any>(option: any) => {
    const res = await request({ method: 'GET', responseType: 'blob', ...option })
    return res as unknown as Promise<T>
  },
  upload: async <T = any>(option: any) => {
    option.headersType = 'multipart/form-data'
    const res = await request({ method: 'POST', ...option })
    return res as unknown as Promise<T>
  },
  // 新增 multipart/form-data 类型的 POST 请求方法
  postMultipart: async <T = any>(option: any) => {
    // 如果提供了 data 且是对象类型，将其转换为 FormData 格式

    console.log(option, 'option')
    const formData = new FormData();
    for (const key in option.data) {
      formData.append(key, option.data[key]);
    }
    option.data = formData;
    option.headersType = 'multipart/form-data';


    const res = await request({ method: 'POST', ...option });
    return res.data as unknown as T;
  },

  // 新增 multipart/form-data 类型的 POST 请求方法，返回原始响应
  postMultipartOriginal: async <T = any>(option: any) => {
    // 如果提供了 data 且是对象类型，将其转换为 FormData 格式

    const formData = new FormData();
    for (const key in option.data) {
      formData.append(key, option.data[key]);
    }
    option.data = formData;


    option.headersType = 'multipart/form-data';

    const res = await request({ method: 'POST', ...option });
    return res as unknown as T;
  },
}

// 添加设置 Cookie 的方法
export const setCookie = (name: string, value: string, options?: Cookies.CookieAttributes) => {
  Cookies.set(name, value, options)
}

export const getCookie = (name: string) => {
  return Cookies.get(name)
}

export const removeCookie = (name: string, options?: Cookies.CookieAttributes) => {
  Cookies.remove(name, options)
}
