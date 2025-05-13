import { service } from './service'

import { setTenantId } from '/@/utils/auth.ts'

import { config } from './config'

import logo from '/@/assets/logo.png'
import icon from '/@/assets/icon.png'

const { default_headers } = config

export const tenantPromise = (() => {
  const website = location.host
  // let tenant = service.get(`/system/tenant/get-by-website?website=${website}`)
  let tenant = service.get(`/system/tenant/get-tenant-by-domain-name?domainName=${website}`)
  //tenant = tenant && tenant.id ? tenant : {id: 1, name: '惠智造', icon: icon, systemLogo: logo}
  tenant = tenant && tenant.id ? tenant : { id: 158, name: '江苏澳美', icon: icon, systemLogo: logo }
  console.log("获取的租户信息: ", tenant);
  setTenantId(tenant.id)

  return tenant
})()

const request = async (option: any) => {
  const { url, method, params, data, headersType, responseType, ...config } = option
  await tenantPromise
  return service({
    url: url,
    method,
    params,
    data,
    ...config,
    responseType: responseType,
    headers: {
      'Content-Type': headersType || default_headers,
    },
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
}
