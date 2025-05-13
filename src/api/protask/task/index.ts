import request from '@/config/axios'

export interface TaskVO {
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
export const getTaskPage = async (params) => {
  //return await request.get({ url: `/protask/pro-task/page`, params })
  return await request.get({ url: `/mes/pro/task/page`, params })
}

// 查询生产任务详情
export const getTask = async (id: number) => {
  //return await request.get({ url: `/protask/pro-task/get?id=` + id })
  return await request.get({ url: `/mes/pro/task/get?id=` + id })
}

// 新增生产任务
export const createTask = async (data: TaskVO) => {
  //return await request.post({ url: `/protask/pro-task/create`, data })
  return await request.post({ url: `/mes/pro/task/create`, data })
}
// 获取甘特图数据
export const getListGanttTaskList = async (data: TaskVO) => {
  //return await request.get({ url: `protask/pro-task/listGanttTaskList` })
  return await request.get({ url: `/mes/pro/task/listGanttTaskList` })
}

// 修改生产任务
export const updateTask = async (data: TaskVO) => {
  //return await request.put({ url: `/protask/pro-task/update`, data })
  return await request.put({ url: `/mes/pro/task/update`, data })
}

// 删除生产任务
export const deleteTask = async (id: number) => {
  //return await request.delete({ url: `/protask/pro-task/delete?id=` + id })
  return await request.delete({ url: `/mes/pro/task/delete?id=` + id })
}

// 导出生产任务 Excel
export const exportTask = async (params) => {
  //return await request.download({ url: `/protask/pro-task/export-excel`, params })
  return await request.download({ url: `/mes/pro/task/export-excel`, params })
}

// ==================== 子表（生产任务投料） ====================

// 获得生产任务投料分页
export const getTaskIssuePage = async (params) => {
  return await request.get({ url: `/mes/pro/task-issue/page`, params })
}
// 新增生产任务投料
export const createTaskIssue = async (data) => {
  return await request.post({ url: `/mes/pro/task-issue/create`, data })
}

// 修改生产任务投料
export const updateTaskIssue = async (data) => {
  return await request.put({ url: `/mes/pro/task-issue/update`, data })
}

// 删除生产任务投料
export const deleteTaskIssue = async (id: number) => {
  return await request.delete({ url: `/mes/pro/task-issue/delete?id=` + id })
}

// 获得生产任务投料
export const getTaskIssue = async (id: number) => {
  return await request.get({ url: `/mes/pro/task-issue/get?id=` + id })
}

// ==================== 子表（物料消耗记录） ====================

// 获得物料消耗记录分页
export const getTransConsumePage = async (params) => {
  return await request.get({ url: `/mes/pro/trans-consume/page`, params })
}
// 新增物料消耗记录
export const createTransConsume = async (data) => {
  return await request.post({ url: `/mes/pro/trans-consume/create`, data })
}

// 修改物料消耗记录
export const updateTransConsume = async (data) => {
  return await request.put({ url: `/mes/pro/trans-consume/update`, data })
}

// 删除物料消耗记录
export const deleteTransConsume = async (id: number) => {
  return await request.delete({ url: `/mes/pro/trans-consume/delete?id=` + id })
}

// 获得物料消耗记录
export const getTransConsume = async (id: number) => {
  return await request.get({ url: `/mes/pro/trans-consume/get?id=` + id })
}

// ==================== 子表（生产流转单） ====================

// 获得生产流转单分页
export const getTransOrderPage = async (params) => {
  return await request.get({ url: `/mes/pro/trans-order/page`, params })
}
// 新增生产流转单
export const createTransOrder = async (data) => {
  return await request.post({ url: `/mes/pro/trans-order/create`, data })
}

// 修改生产流转单
export const updateTransOrder = async (data) => {
  return await request.put({ url: `/mes/pro/trans-order/update`, data })
}

// 删除生产流转单
export const deleteTransOrder = async (id: number) => {
  return await request.delete({ url: `/mes/pro/trans-order/delete?id=` + id })
}

// 获得生产流转单
export const getTransOrder = async (id: number) => {
  return await request.get({ url: `/mes/pro/trans-order/get?id=` + id })
}


// 查询产品的工艺组成列表
export const listProductprocess = async (productId: number) => {
  return await request.get({ url: '/mes/pro/route-process/listProductProcess/' + productId})
}
