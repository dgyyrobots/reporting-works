import request from '@/config/axios'

export interface RtSalseVO {
  id: number
  rtCode: string
  rtName: string
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
  rtDate: Date
  rtReason: string
  status: string
  remark: string
  attr1: string
  attr2: string
  attr3: number
  attr4: number
}

// 查询产品销售退货单分页
export const getRtSalsePage = async (params) => {
  return await request.get({ url: `/wms/rt-salse/page`, params })
}

// 查询产品销售退货单详情
export const getRtSalse = async (id: number) => {
  return await request.get({ url: `/wms/rt-salse/get?id=` + id })
}

// 新增产品销售退货单
export const createRtSalse = async (data: RtSalseVO) => {
  return await request.post({ url: `/wms/rt-salse/create`, data })
}

// 修改产品销售退货单
export const updateRtSalse = async (data: RtSalseVO) => {
  return await request.put({ url: `/wms/rt-salse/update`, data })
}

// 删除产品销售退货单
export const deleteRtSalse = async (id: number) => {
  return await request.delete({ url: `/wms/rt-salse/delete?id=` + id })
}

// 导出产品销售退货单 Excel
export const exportRtSalse = async (params) => {
  return await request.download({ url: `/wms/rt-salse/export-excel`, params })
}

// ==================== 子表（产品销售退货行） ====================

// 获得产品销售退货行分页
export const getRtSalseLinePage = async (params) => {
  return await request.get({ url: `/wms/rt-salse/rt-salse-line/page`, params })
}
// 新增产品销售退货行
export const createRtSalseLine = async (data) => {
  return await request.post({ url: `/wms/rt-salse/rt-salse-line/create`, data })
}

// 修改产品销售退货行
export const updateRtSalseLine = async (data) => {
  return await request.put({ url: `/wms/rt-salse/rt-salse-line/update`, data })
}

// 删除产品销售退货行
export const deleteRtSalseLine = async (id: number) => {
  return await request.delete({ url: `/wms/rt-salse/rt-salse-line/delete?id=` + id })
}

// 获得产品销售退货行
export const getRtSalseLine = async (id: number) => {
  return await request.get({ url: `/wms/rt-salse/rt-salse-line/get?id=` + id })
}