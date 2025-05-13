import request from '@/config/axios'

export interface TemplateVO {
  id: number
  templateCode: string
  templateName: string
  qcTypes: string
  enableFlag: string
  remark: string
  attr1: string
  attr2: string
  attr3: number
  attr4: number
}

// 查询检测模板分页
export const getTemplatePage = async (params) => {
  //return await request.get({ url: `/qmcbasic/template/page`, params })
  return await request.get({ url: `/mes/qms/template/page`, params })
}

// 查询检测模板详情
export const getTemplate = async (id: number) => {
  //return await request.get({ url: `/qmcbasic/template/get?id=` + id })
  return await request.get({ url: `/mes/qms/template/get?id=` + id })
}

// 新增检测模板
export const createTemplate = async (data: TemplateVO) => {
  //return await request.post({ url: `/qmcbasic/template/create`, data })
  return await request.post({ url: `/mes/qms/template/create`, data })
}

// 修改检测模板
export const updateTemplate = async (data: TemplateVO) => {
  //return await request.put({ url: `/qmcbasic/template/update`, data })
  return await request.put({ url: `/mes/qms/template/update`, data })
}

// 删除检测模板
export const deleteTemplate = async (id: number) => {
  //return await request.delete({ url: `/qmcbasic/template/delete?id=` + id })
  return await request.delete({ url: `/mes/qms/template/delete?id=` + id })
}

// 导出检测模板 Excel
export const exportTemplate = async (params) => {
  //return await request.download({ url: `/qmcbasic/template/export-excel`, params })
  return await request.download({ url: `/mes/qms/template/export-excel`, params })
}

// ==================== 子表（检测模板项） ====================

// 获得检测模板项列表
export const getTemplateIndexListByTemplateId = async (templateId) => {
  return await request.get({ url: `/qmcbasic/template/template-index/list-by-template-id?templateId=` + templateId })
}

// ==================== 子表（检测模板产品） ====================

// 获得检测模板产品列表
export const getTemplateProductListByTemplateId = async (templateId) => {
  return await request.get({ url: `/qmcbasic/template/template-product/list-by-template-id?templateId=` + templateId })
}
