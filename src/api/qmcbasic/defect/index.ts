import request from '@/config/axios'

export interface DefectVO {
  id: number
  defectCode: string
  defectName: string
  indexType: string
  defectLevel: string
  remark: string
  attr1: string
  attr2: string
  attr3: number
  attr4: number
}

// 查询常见缺陷分页
export const getDefectPage = async (params) => {
  return await request.get({ url: `/qmcbasic/defect/page`, params })
}

// 查询常见缺陷详情
export const getDefect = async (id: number) => {
  return await request.get({ url: `/qmcbasic/defect/get?id=` + id })
}

// 新增常见缺陷
export const createDefect = async (data: DefectVO) => {
  return await request.post({ url: `/qmcbasic/defect/create`, data })
}

// 修改常见缺陷
export const updateDefect = async (data: DefectVO) => {
  return await request.put({ url: `/qmcbasic/defect/update`, data })
}

// 删除常见缺陷
export const deleteDefect = async (id: number) => {
  return await request.delete({ url: `/qmcbasic/defect/delete?id=` + id })
}

// 导出常见缺陷 Excel
export const exportDefect = async (params) => {
  return await request.download({ url: `/qmcbasic/defect/export-excel`, params })
}