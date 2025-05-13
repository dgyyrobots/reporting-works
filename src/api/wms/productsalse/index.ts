import request from '@/config/axios'

export interface ProductSalseVO {
  id: number
  salseCode: string
  salseName: string
  oqcId: number
  oqcCode: string
  soCode: string
  clientId: number
  clientCode: string
  clientName: string
  clientNick: string
  warehouseId: number
  warehouseCode: string
  warehouseName: string
  locationId: number
  locationCode: string
  locationName: string
  areaId: number
  areaCode: string
  areaName: string
  salseDate: Date
  status: string
  remark: string
  attr1: string
  attr2: string
  attr3: number
  attr4: number
}

// 查询销售出库单分页
export const getProductSalsePage = async (params) => {
  return await request.get({ url: `/wms/product-salse/page`, params })
}

// 查询销售出库单详情
export const getProductSalse = async (id: number) => {
  return await request.get({ url: `/wms/product-salse/get?id=` + id })
}

// 新增销售出库单
export const createProductSalse = async (data: ProductSalseVO) => {
  return await request.post({ url: `/wms/product-salse/create`, data })
}

// 修改销售出库单
export const updateProductSalse = async (data: ProductSalseVO) => {
  return await request.put({ url: `/wms/product-salse/update`, data })
}

// 删除销售出库单
export const deleteProductSalse = async (id: number) => {
  return await request.delete({ url: `/wms/product-salse/delete?id=` + id })
}

// 导出销售出库单 Excel
export const exportProductSalse = async (params) => {
  return await request.download({ url: `/wms/product-salse/export-excel`, params })
}

// ==================== 子表（产品销售出库行） ====================

// 获得产品销售出库行列表
export const getProductSalseLineListBySalseId = async (salseId) => {
  return await request.get({ url: `/wms/product-salse/product-salse-line/list-by-salse-id?salseId=` + salseId })
}