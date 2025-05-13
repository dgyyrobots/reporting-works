import request from '@/config/axios'

export interface TemplateIndexVO {
  id: number
  templateId: number
  indexId: number
  indexCode: string
  indexName: string
  indexType: string
  qcTool: string
  checkMethod: string
  standerVal: number
  unitOfMeasure: string
  thresholdMax: number
  thresholdMin: number
  docUrl: string
  remark: string
  attr1: string
  attr2: string
  attr3: number
  attr4: number
}

// 查询检测模板项分页
export const getTemplateIndexPage = async (params) => {
  return await request.get({ url: `/qmcbasic/template-index/page`, params })
}

// 查询检测模板项详情
export const getTemplateIndex = async (id: number) => {
  return await request.get({ url: `/qmcbasic/template-index/get?id=` + id })
}

// 新增检测模板项
export const createTemplateIndex = async (data: TemplateIndexVO) => {
  return await request.post({ url: `/qmcbasic/template-index/create`, data })
}

// 修改检测模板项
export const updateTemplateIndex = async (data: TemplateIndexVO) => {
  return await request.put({ url: `/qmcbasic/template-index/update`, data })
}

// 删除检测模板项
export const deleteTemplateIndex = async (id: number) => {
  return await request.delete({ url: `/qmcbasic/template-index/delete?id=` + id })
}

// 导出检测模板项 Excel
export const exportTemplateIndex = async (params) => {
  return await request.download({ url: `/qmcbasic/template-index/export-excel`, params })
}