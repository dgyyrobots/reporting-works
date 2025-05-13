import request from '@/config/axios'

export interface RtVendorVO {
  id: number
  rtCode: string
  rtName: string
  poCode: string
  vendorId: number
  vendorCode: string
  vendorName: string
  vendorNick: string
  batchCode: string
  rtDate: Date
  status: string
  remark: string
  attr1: string
  attr2: string
  attr3: number
  attr4: number
}

// 查询供应商退货分页
export const getRtVendorPage = async (params) => {
  return await request.get({ url: `/wms/rt-vendor/page`, params })
}

// 查询供应商退货详情
export const getRtVendor = async (id: number) => {
  return await request.get({ url: `/wms/rt-vendor/get?id=` + id })
}

// 新增供应商退货
export const createRtVendor = async (data: RtVendorVO) => {
  return await request.post({ url: `/wms/rt-vendor/create`, data })
}

// 修改供应商退货
export const updateRtVendor = async (data: RtVendorVO) => {
  return await request.put({ url: `/wms/rt-vendor/update`, data })
}

// 删除供应商退货
export const deleteRtVendor = async (id: number) => {
  return await request.delete({ url: `/wms/rt-vendor/delete?id=` + id })
}

// 导出供应商退货 Excel
export const exportRtVendor = async (params) => {
  return await request.download({ url: `/wms/rt-vendor/export-excel`, params })
}

// ==================== 子表（供应商退货行） ====================

// 获得供应商退货行分页
export const getRtVendorLinePage = async (params) => {
  return await request.get({ url: `/wms/rt-vendor/rt-vendor-line/page`, params })
}
// 新增供应商退货行
export const createRtVendorLine = async (data) => {
  return await request.post({ url: `/wms/rt-vendor/rt-vendor-line/create`, data })
}

// 修改供应商退货行
export const updateRtVendorLine = async (data) => {
  return await request.put({ url: `/wms/rt-vendor/rt-vendor-line/update`, data })
}

// 删除供应商退货行
export const deleteRtVendorLine = async (id: number) => {
  return await request.delete({ url: `/wms/rt-vendor/rt-vendor-line/delete?id=` + id })
}

// 获得供应商退货行
export const getRtVendorLine = async (id: number) => {
  return await request.get({ url: `/wms/rt-vendor/rt-vendor-line/get?id=` + id })
}