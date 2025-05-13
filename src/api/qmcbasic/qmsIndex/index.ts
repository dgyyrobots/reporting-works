import request from '@/config/axios'

export interface qmsIndexVO {
  id: number
  indexCode: string
  indexName: string
  indexType: string
  qcTool: string
  remark: string
  attr1: string
  attr2: string
  attr3: number
  attr4: number
}

// 查询检测项分页
export const getqmsIndexPage = async (params) => {
  return await request.get({ url: `/qmcbasic/qms-index/page`, params })
}

// 查询检测项详情
export const getqmsIndex = async (id: number) => {
  return await request.get({ url: `/qmcbasic/qms-index/get?id=` + id })
}

// 新增检测项
export const createqmsIndex = async (data: qmsIndexVO) => {
  return await request.post({ url: `/qmcbasic/qms-index/create`, data })
}

// 修改检测项
export const updateqmsIndex = async (data: qmsIndexVO) => {
  return await request.put({ url: `/qmcbasic/qms-index/update`, data })
}

// 删除检测项
export const deleteqmsIndex = async (id: number) => {
  return await request.delete({ url: `/qmcbasic/qms-index/delete?id=` + id })
}

// 导出检测项 Excel
export const exportqmsIndex = async (params) => {
  return await request.download({ url: `/qmcbasic/qms-index/export-excel`, params })
}