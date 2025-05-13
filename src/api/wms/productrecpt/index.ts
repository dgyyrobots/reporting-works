import request from '@/config/axios'

export interface ProductRecptVO {
  id: number
  recptCode: string
  recptName: string
  workorderId: number
  workorderCode: string
  workorderName: string
  itemId: number
  itemCode: string
  itemName: string
  specification: string
  unitOfMeasure: string
  warehouseId: number
  warehouseCode: string
  warehouseName: string
  locationId: number
  locationCode: string
  locationName: string
  areaId: number
  areaCode: string
  areaName: string
  recptDate: Date
  status: string
  remark: string
  attr1: string
  attr2: string
  attr3: number
  attr4: number
}

// 查询产品入库录分页
export const getProductRecptPage = async (params) => {
  return await request.get({ url: `/wms/product-recpt/page`, params })
}

// 查询产品入库录详情
export const getProductRecpt = async (id: number) => {
  return await request.get({ url: `/wms/product-recpt/get?id=` + id })
}

// 新增产品入库录
export const createProductRecpt = async (data: ProductRecptVO) => {
  return await request.post({ url: `/wms/product-recpt/create`, data })
}

// 修改产品入库录
export const updateProductRecpt = async (data: ProductRecptVO) => {
  return await request.put({ url: `/wms/product-recpt/update`, data })
}

// 删除产品入库录
export const deleteProductRecpt = async (id: number) => {
  return await request.delete({ url: `/wms/product-recpt/delete?id=` + id })
}

// 导出产品入库录 Excel
export const exportProductRecpt = async (params) => {
  return await request.download({ url: `/wms/product-recpt/export-excel`, params })
}

// ==================== 子表（产品入库记录表行） ====================

// 获得产品入库记录表行分页
export const getProductRecptLinePage = async (params) => {
  return await request.get({ url: `/wms/product-recpt/product-recpt-line/page`, params })
}
// 新增产品入库记录表行
export const createProductRecptLine = async (data) => {
  return await request.post({ url: `/wms/product-recpt/product-recpt-line/create`, data })
}

// 修改产品入库记录表行
export const updateProductRecptLine = async (data) => {
  return await request.put({ url: `/wms/product-recpt/product-recpt-line/update`, data })
}

// 删除产品入库记录表行
export const deleteProductRecptLine = async (id: number) => {
  return await request.delete({ url: `/wms/product-recpt/product-recpt-line/delete?id=` + id })
}

// 获得产品入库记录表行
export const getProductRecptLine = async (id: number) => {
  return await request.get({ url: `/wms/product-recpt/product-recpt-line/get?id=` + id })
}