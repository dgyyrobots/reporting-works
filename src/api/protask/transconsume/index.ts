import request from '@/config/axios'

export interface TransConsumeVO {
  id: number
  transOrderId: number
  transOrderCode: string
  taskId: number
  workstationId: number
  processId: number
  workorderId: number
  batchCode: string
  sourceDocId: number
  sourceDocCode: string
  sourceDocType: string
  sourceLineId: number
  sourceBatchCode: string
  itemId: number
  itemCode: string
  itemName: string
  specification: string
  unitOfMeasure: string
  quantityConsumed: number
  consumeDate: Date
  remark: string
}

// 查询物料消耗记录分页
export const getTransConsumePage = async (params) => {
  return await request.get({ url: `/protask/trans-consume/page`, params })
}

// 查询物料消耗记录详情
export const getTransConsume = async (id: number) => {
  return await request.get({ url: `/protask/trans-consume/get?id=` + id })
}

// 新增物料消耗记录
export const createTransConsume = async (data: TransConsumeVO) => {
  return await request.post({ url: `/protask/trans-consume/create`, data })
}

// 修改物料消耗记录
export const updateTransConsume = async (data: TransConsumeVO) => {
  return await request.put({ url: `/protask/trans-consume/update`, data })
}

// 删除物料消耗记录
export const deleteTransConsume = async (id: number) => {
  return await request.delete({ url: `/protask/trans-consume/delete?id=` + id })
}

// 导出物料消耗记录 Excel
export const exportTransConsume = async (params) => {
  return await request.download({ url: `/protask/trans-consume/export-excel`, params })
}