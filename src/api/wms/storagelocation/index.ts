import request from '@/config/axios'

export interface StorageLocationVO {
  id: number
  locationCode: string
  locationName: string
  warehouseId: number
  area: number
  areaFlag: string
  remark: string
  attr1: string
  attr2: string
  attr3: number
  attr4: number
}

// 查询库区分页
export const getStorageLocationPage = async (params) => {
  return await request.get({ url: `/wms/storage-location/page`, params })
}

// 查询库区详情
export const getStorageLocation = async (id: number) => {
  return await request.get({ url: `/wms/storage-location/get?id=` + id })
}

// 新增库区
export const createStorageLocation = async (data: StorageLocationVO) => {
  return await request.post({ url: `/wms/storage-location/create`, data })
}

// 修改库区
export const updateStorageLocation = async (data: StorageLocationVO) => {
  return await request.put({ url: `/wms/storage-location/update`, data })
}

// 删除库区
export const deleteStorageLocation = async (id: number) => {
  return await request.delete({ url: `/wms/storage-location/delete?id=` + id })
}

// 导出库区 Excel
export const exportStorageLocation = async (params) => {
  return await request.download({ url: `/wms/storage-location/export-excel`, params })
}

// ==================== 子表（库位） ====================

// 获得库位分页
export const getStorageAreaPage = async (params) => {
  return await request.get({ url: `/wms/storage-location/storage-area/page`, params })
}
// 新增库位
export const createStorageArea = async (data) => {
  return await request.post({ url: `/wms/storage-location/storage-area/create`, data })
}

// 修改库位
export const updateStorageArea = async (data) => {
  return await request.put({ url: `/wms/storage-location/storage-area/update`, data })
}

// 删除库位
export const deleteStorageArea = async (id: number) => {
  return await request.delete({ url: `/wms/storage-location/storage-area/delete?id=` + id })
}

// 获得库位
export const getStorageArea = async (id: number) => {
  return await request.get({ url: `/wms/storage-location/storage-area/get?id=` + id })
}