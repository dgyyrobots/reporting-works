import request from '@/config/axios'

export interface WarehouseVO {
  id: number
  warehouseCode: string
  warehouseName: string
  location: string
  area: number
  charge: string
  enableFlag: string
  remark: string
  attr1: string
  attr2: string
  attr3: number
  attr4: number
  sendState: string
  sendCity: string
  sendDistrict: string
  sendStreet: string
  sendDetail: string
  sendName: string
  sendPhone: string
  sendMobile: string
}

// 查询仓库分页
export const getWarehousePage = async (params) => {
  return await request.get({ url: `/wms/warehouse/page`, params })
}

// 查询仓库详情
export const getWarehouse = async (id: number) => {
  return await request.get({ url: `/wms/warehouse/get?id=` + id })
}

// 新增仓库
export const createWarehouse = async (data: WarehouseVO) => {
  return await request.post({ url: `/wms/warehouse/create`, data })
}

// 修改仓库
export const updateWarehouse = async (data: WarehouseVO) => {
  return await request.put({ url: `/wms/warehouse/update`, data })
}

// 删除仓库
export const deleteWarehouse = async (id: number) => {
  return await request.delete({ url: `/wms/warehouse/delete?id=` + id })
}

// 导出仓库 Excel
export const exportWarehouse = async (params) => {
  return await request.download({ url: `/wms/warehouse/export-excel`, params })
}

// ==================== 子表（库区） ====================

// 获得库区分页
export const getStorageLocationPage = async (params) => {
  return await request.get({ url: `/wms/warehouse/storage-location/page`, params })
}
// 新增库区
export const createStorageLocation = async (data) => {
  return await request.post({ url: `/wms/warehouse/storage-location/create`, data })
}

// 修改库区
export const updateStorageLocation = async (data) => {
  return await request.put({ url: `/wms/warehouse/storage-location/update`, data })
}

// 删除库区
export const deleteStorageLocation = async (id: number) => {
  return await request.delete({ url: `/wms/warehouse/storage-location/delete?id=` + id })
}

// 获得库区
export const getStorageLocation = async (id: number) => {
  return await request.get({ url: `/wms/warehouse/storage-location/get?id=` + id })
}


// 查询仓库树形
export const getWarehouseList = async () => {
  return await request.get({ url: `/wms/warehouse/getTreeList` })
}
export const getTreeList = async () => {
  return await request.get({ url: `/wms/warehouse/getTreeList` })
}


// 获得库位分页
export const getStorageLocationPages = async (params) => {
  return await request.get({ url: `/wms/storage-area/page`, params })
}

// 新增库区
export const createStorageLocations = async (data) => {
  return await request.post({ url: `/wms/storage-area/create`, data })
}

// 修改库区
export const updateStorageLocations = async (data) => {
  return await request.put({ url: `/wms/storage-area/update`, data })
}


// 获得库区
export const getStorageLocations = async (id: number) => {
  return await request.get({ url: `/wms/storage-area/get?id=` + id })
}

// 删除库区
export const deleteStorageLocations = async (id: number) => {
  return await request.delete({ url: `/wms/storage-area/delete?id=` + id })
}