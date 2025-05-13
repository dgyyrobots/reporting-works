import request from '@/config/axios'

export interface StorageAreaVO {
  id: number
  areaCode: string
  areaName: string
  locationId: number
  area: number
  maxLoa: number
  positionX: number
  positionY: number
  positionZ: number
  enableFlag: string
  remark: string
  attr1: string
  attr2: string
  attr3: number
  attr4: number
}

// 查询库位分页
export const getStorageAreaPage = async (params) => {
  return await request.get({ url: `/wms/storage-area/page`, params })
}

// 查询库位详情
export const getStorageArea = async (id: number) => {
  return await request.get({ url: `/wms/storage-area/get?id=` + id })
}

// 新增库位
export const createStorageArea = async (data: StorageAreaVO) => {
  return await request.post({ url: `/wms/storage-area/create`, data })
}

// 修改库位
export const updateStorageArea = async (data: StorageAreaVO) => {
  return await request.put({ url: `/wms/storage-area/update`, data })
}

// 删除库位
export const deleteStorageArea = async (id: number) => {
  return await request.delete({ url: `/wms/storage-area/delete?id=` + id })
}

// 导出库位 Excel
export const exportStorageArea = async (params) => {
  return await request.download({ url: `/wms/storage-area/export-excel`, params })
}