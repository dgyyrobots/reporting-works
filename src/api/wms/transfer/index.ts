import request from '@/config/axios'

export interface TransferVO {
  id: number
  transferCode: string
  transferName: string
  transferType: string
  destination: string
  carrier: string
  bookingNote: string
  receiver: string
  receiverNick: string
  fromWarehouseId: number
  fromWarehouseCode: string
  fromWarehouseName: string
  toWarehouseId: number
  toWarehouseCode: string
  toWarehouseName: string
  transferDate: Date
  status: string
  remark: string
  attr1: string
  attr2: string
  attr3: number
  attr4: number
}

// 查询转移单分页
export const getTransferPage = async (params) => {
  return await request.get({ url: `/wms/transfer/page`, params })
}

// 查询转移单详情
export const getTransfer = async (id: number) => {
  return await request.get({ url: `/wms/transfer/get?id=` + id })
}

// 新增转移单
export const createTransfer = async (data: TransferVO) => {
  return await request.post({ url: `/wms/transfer/create`, data })
}

// 修改转移单
export const updateTransfer = async (data: TransferVO) => {
  return await request.put({ url: `/wms/transfer/update`, data })
}

// 删除转移单
export const deleteTransfer = async (id: number) => {
  return await request.delete({ url: `/wms/transfer/delete?id=` + id })
}

// 导出转移单 Excel
export const exportTransfer = async (params) => {
  return await request.download({ url: `/wms/transfer/export-excel`, params })
}

// ==================== 子表（转移单行） ====================

// 获得转移单行分页
export const getTransferLinePage = async (params) => {
  return await request.get({ url: `/wms/transfer/transfer-line/page`, params })
}
// 新增转移单行
export const createTransferLine = async (data) => {
  return await request.post({ url: `/wms/transfer/transfer-line/create`, data })
}

// 修改转移单行
export const updateTransferLine = async (data) => {
  return await request.put({ url: `/wms/transfer/transfer-line/update`, data })
}

// 删除转移单行
export const deleteTransferLine = async (id: number) => {
  return await request.delete({ url: `/wms/transfer/transfer-line/delete?id=` + id })
}

// 获得转移单行
export const getTransferLine = async (id: number) => {
  return await request.get({ url: `/wms/transfer/transfer-line/get?id=` + id })
}