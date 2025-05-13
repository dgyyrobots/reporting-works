import request from '@/config/axios'

export interface TemplateProductVO {
  id: number
  templateId: number
  itemId: number
  itemCode: string
  itemName: string
  specification: string
  unitOfMeasure: string
  quantityCheck: number
  quantityUnqualified: number
  crRate: number
  majRate: number
  minRate: number
  remark: string
  attr1: string
  attr2: string
  attr3: number
  attr4: number
}

// 查询检测模板产品分页
export const getTemplateProductPage = async (params) => {
  return await request.get({ url: `/qmcbasic/template-product/page`, params })
}

// 查询检测模板产品详情
export const getTemplateProduct = async (id: number) => {
  return await request.get({ url: `/qmcbasic/template-product/get?id=` + id })
}

// 新增检测模板产品
export const createTemplateProduct = async (data: TemplateProductVO) => {
  return await request.post({ url: `/qmcbasic/template-product/create`, data })
}

// 修改检测模板产品
export const updateTemplateProduct = async (data: TemplateProductVO) => {
  return await request.put({ url: `/qmcbasic/template-product/update`, data })
}

// 删除检测模板产品
export const deleteTemplateProduct = async (id: number) => {
  return await request.delete({ url: `/qmcbasic/template-product/delete?id=` + id })
}

// 导出检测模板产品 Excel
export const exportTemplateProduct = async (params) => {
  return await request.download({ url: `/qmcbasic/template-product/export-excel`, params })
}