import request from '@/config/axios'

export interface MaterialStockVO {
  id: number
  itemTypeId: number
  itemId: number
  itemCode: string
  itemName: string
  specification: string
  unitOfMeasure: string
  batchCode: string
  warehouseId: number
  warehouseCode: string
  warehouseName: string
  locationId: number
  locationCode: string
  locationName: string
  areaId: number
  areaCode: string
  areaName: string
  vendorId: number
  vendorCode: string
  vendorName: string
  vendorNick: string
  quantityOnhand: number
  workorderId: number
  workorderCode: string
  recptDate: Date
  expireDate: Date
  attr1: string
  attr2: string
  attr3: number
  attr4: number
}

// 查询库存记录分页
export const getMaterialStockPage = async (params) => {
  return await request.get({ url: `/wms/material-stock/page`, params })
}

// 查询库存记录详情
export const getMaterialStock = async (id: number) => {
  return await request.get({ url: `/wms/material-stock/get?id=` + id })
}

// 新增库存记录
export const createMaterialStock = async (data: MaterialStockVO) => {
  return await request.post({ url: `/wms/material-stock/create`, data })
}

// 修改库存记录
export const updateMaterialStock = async (data: MaterialStockVO) => {
  return await request.put({ url: `/wms/material-stock/update`, data })
}

// 删除库存记录
export const deleteMaterialStock = async (id: number) => {
  return await request.delete({ url: `/wms/material-stock/delete?id=` + id })
}

// 导出库存记录 Excel
export const exportMaterialStock = async (params) => {
  return await request.download({ url: `/wms/material-stock/export-excel`, params })
}