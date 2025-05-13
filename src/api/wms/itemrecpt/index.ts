import request from '@/config/axios'

export interface ItemRecptVO {
  id: number
  recptCode: string
  recptName: string
  iqcId: number
  iqcCode: string
  poCode: string
  vendorId: number
  vendorCode: string
  vendorName: string
  vendorNick: string
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

// 查询物料入库单分页
export const getItemRecptPage = async (params) => {
  return await request.get({ url: `/wms/item-recpt/page`, params })
}

// 查询物料入库单详情
export const getItemRecpt = async (id: number) => {
  return await request.get({ url: `/wms/item-recpt/get?id=` + id })
}

// 新增物料入库单
export const createItemRecpt = async (data: ItemRecptVO) => {
  return await request.post({ url: `/wms/item-recpt/create`, data })
}

// 修改物料入库单
export const updateItemRecpt = async (data: ItemRecptVO) => {
  return await request.put({ url: `/wms/item-recpt/update`, data })
}

// 删除物料入库单
export const deleteItemRecpt = async (id: number) => {
  return await request.delete({ url: `/wms/item-recpt/delete?id=` + id })
}

// 导出物料入库单 Excel
export const exportItemRecpt = async (params) => {
  return await request.download({ url: `/wms/item-recpt/export-excel`, params })
}

// ==================== 子表（物料入库单行） ====================

// 获得物料入库单行列表
export const getItemRecptLineListByRecptId = async (recptId) => {
  return await request.get({ url: `/wms/item-recpt/item-recpt-line/list-by-recpt-id?recptId=` + recptId })
}
