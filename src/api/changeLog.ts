import request from '/@/config/axios'

export const getList = () => {
  return request.get({
    // 正式项目请移除或更换为真实地址
    url: 'https://api.vuejs-core.cn/getShopChangeLog',
  })
}
