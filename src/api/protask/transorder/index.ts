import request from '@/config/axios'

export interface TransOrderVO {
  id: number
  transOrderCode: string
  taskId: number
  taskCode: string
  workstationId: number
  workstationCode: string
  workstationName: string
  processId: number
  processCode: string
  processName: string
  workorderId: number
  workorderCode: string
  workorderName: string
  batchCode: string
  itemId: number
  itemCode: string
  itemName: string
  specification: string
  unitOfMeasure: string
  barcodeUrl: string
  quantityTransfered: number
  produceDate: Date
  remark: string
  attr1: string
  attr2: string
  attr3: number
  attr4: number
}

// 查询生产流转单分页
export const getTransOrderPage = async (params) => {
  return await request.get({ url: `/protask/trans-order/page`, params })
}

// 查询生产流转单详情
export const getTransOrder = async (id: number) => {
  return await request.get({ url: `/protask/trans-order/get?id=` + id })
}

// 新增生产流转单
export const createTransOrder = async (data: TransOrderVO) => {
  return await request.post({ url: `/protask/trans-order/create`, data })
}

// 修改生产流转单
export const updateTransOrder = async (data: TransOrderVO) => {
  return await request.put({ url: `/protask/trans-order/update`, data })
}

// 删除生产流转单
export const deleteTransOrder = async (id: number) => {
  return await request.delete({ url: `/protask/trans-order/delete?id=` + id })
}

// 导出生产流转单 Excel
export const exportTransOrder = async (params) => {
  return await request.download({ url: `/protask/trans-order/export-excel`, params })
}