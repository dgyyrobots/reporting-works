import request from '@/config/axios'

export interface ProTaskVO {
  id: number
  taskCode: string
  taskName: string
  workorderId: number
  workorderCode: string
  workorderName: string
  workstationId: number
  workstationCode: string
  workstationName: string
  processId: number
  processCode: string
  processName: string
  itemId: number
  itemCode: string
  itemName: string
  specification: string
  unitOfMeasure: string
  quantity: number
  quantityProduced: number
  quantityQuanlify: number
  quantityUnquanlify: number
  quantityChanged: number
  clientId: number
  clientCode: string
  clientName: string
  clientNick: string
  startTime: Date
  duration: number
  endTime: Date
  colorCode: string
  requestDate: Date
  status: string
  remark: string
}

// 查询生产任务分页
export const getProTaskPage = async (params) => {
  return await request.get({ url: `/protask/pro-task/page`, params })
}

// 查询生产任务详情
export const getProTask = async (id: number) => {
  return await request.get({ url: `/protask/pro-task/get?id=` + id })
}

// 新增生产任务
export const createProTask = async (data: ProTaskVO) => {
  return await request.post({ url: `/protask/pro-task/create`, data })
}

// 修改生产任务
export const updateProTask = async (data: ProTaskVO) => {
  return await request.put({ url: `/protask/pro-task/update`, data })
}

// 删除生产任务
export const deleteProTask = async (id: number) => {
  return await request.delete({ url: `/protask/pro-task/delete?id=` + id })
}

// 导出生产任务 Excel
export const exportProTask = async (params) => {
  return await request.download({ url: `/protask/pro-task/export-excel`, params })
}

// ==================== 子表（生产任务投料） ====================

// 获得生产任务投料分页
export const getTaskIssuePage = async (params) => {
  return await request.get({ url: `/protask/pro-task/task-issue/page`, params })
}
// 新增生产任务投料
export const createTaskIssue = async (data) => {
  return await request.post({ url: `/protask/pro-task/task-issue/create`, data })
}

// 修改生产任务投料
export const updateTaskIssue = async (data) => {
  return await request.put({ url: `/protask/pro-task/task-issue/update`, data })
}

// 删除生产任务投料
export const deleteTaskIssue = async (id: number) => {
  return await request.delete({ url: `/protask/pro-task/task-issue/delete?id=` + id })
}

// 获得生产任务投料
export const getTaskIssue = async (id: number) => {
  return await request.get({ url: `/protask/pro-task/task-issue/get?id=` + id })
}

// ==================== 子表（物料消耗记录） ====================

// 获得物料消耗记录分页
export const getTransConsumePage = async (params) => {
  return await request.get({ url: `/protask/pro-task/trans-consume/page`, params })
}
// 新增物料消耗记录
export const createTransConsume = async (data) => {
  return await request.post({ url: `/protask/pro-task/trans-consume/create`, data })
}

// 修改物料消耗记录
export const updateTransConsume = async (data) => {
  return await request.put({ url: `/protask/pro-task/trans-consume/update`, data })
}

// 删除物料消耗记录
export const deleteTransConsume = async (id: number) => {
  return await request.delete({ url: `/protask/pro-task/trans-consume/delete?id=` + id })
}

// 获得物料消耗记录
export const getTransConsume = async (id: number) => {
  return await request.get({ url: `/protask/pro-task/trans-consume/get?id=` + id })
}

// ==================== 子表（生产流转单） ====================

// 获得生产流转单分页
export const getTransOrderPage = async (params) => {
  return await request.get({ url: `/protask/pro-task/trans-order/page`, params })
}
// 新增生产流转单
export const createTransOrder = async (data) => {
  return await request.post({ url: `/protask/pro-task/trans-order/create`, data })
}

// 修改生产流转单
export const updateTransOrder = async (data) => {
  return await request.put({ url: `/protask/pro-task/trans-order/update`, data })
}

// 删除生产流转单
export const deleteTransOrder = async (id: number) => {
  return await request.delete({ url: `/protask/pro-task/trans-order/delete?id=` + id })
}

// 获得生产流转单
export const getTransOrder = async (id: number) => {
  return await request.get({ url: `/protask/pro-task/trans-order/get?id=` + id })
}