import request from '@/config/axios'

export interface ItemConsumeVO {
  id: number
  workorderId: number
  workorderCode: string
  workorderName: string
  taskId: number
  taskCode: string
  taskName: string
  workstationId: number
  workstationCode: string
  workstationName: string
  processId: number
  processCode: string
  processName: string
  consumeDate: Date
  status: string
  remark: string
  attr1: string
  attr2: string
  attr3: number
  attr4: number
}

// 查询物料消耗记录分页
export const getItemConsumePage = async (params) => {
  return await request.get({ url: `/wms/item-consume/page`, params })
}

// 查询物料消耗记录详情
export const getItemConsume = async (id: number) => {
  return await request.get({ url: `/wms/item-consume/get?id=` + id })
}

// 新增物料消耗记录
export const createItemConsume = async (data: ItemConsumeVO) => {
  return await request.post({ url: `/wms/item-consume/create`, data })
}

// 修改物料消耗记录
export const updateItemConsume = async (data: ItemConsumeVO) => {
  return await request.put({ url: `/wms/item-consume/update`, data })
}

// 删除物料消耗记录
export const deleteItemConsume = async (id: number) => {
  return await request.delete({ url: `/wms/item-consume/delete?id=` + id })
}

// 导出物料消耗记录 Excel
export const exportItemConsume = async (params) => {
  return await request.download({ url: `/wms/item-consume/export-excel`, params })
}

// ==================== 子表（物料消耗记录行） ====================

// 获得物料消耗记录行分页
export const getItemConsumeLinePage = async (params) => {
  return await request.get({ url: `/wms/item-consume/item-consume-line/page`, params })
}
// 新增物料消耗记录行
export const createItemConsumeLine = async (data) => {
  return await request.post({ url: `/wms/item-consume/item-consume-line/create`, data })
}

// 修改物料消耗记录行
export const updateItemConsumeLine = async (data) => {
  return await request.put({ url: `/wms/item-consume/item-consume-line/update`, data })
}

// 删除物料消耗记录行
export const deleteItemConsumeLine = async (id: number) => {
  return await request.delete({ url: `/wms/item-consume/item-consume-line/delete?id=` + id })
}

// 获得物料消耗记录行
export const getItemConsumeLine = async (id: number) => {
  return await request.get({ url: `/wms/item-consume/item-consume-line/get?id=` + id })
}