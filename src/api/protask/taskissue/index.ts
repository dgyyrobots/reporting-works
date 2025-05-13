import request from '@/config/axios'

export interface TaskIssueVO {
  id: number
  taskId: number
  workorderId: number
  workstationId: number
  sourceDocId: number
  sourceDocType: string
  sourceDocCode: string
  batchCode: string
  sourceLineId: number
  itemId: number
  itemCode: string
  itemName: string
  specification: string
  unitOfMeasure: string
  quantityIssued: number
  quantityAvailable: number
  quantityUsed: number
  remark: string
}

// 查询生产任务投料分页
export const getTaskIssuePage = async (params) => {
  return await request.get({ url: `/protask/task-issue/page`, params })
}

// 查询生产任务投料详情
export const getTaskIssue = async (id: number) => {
  return await request.get({ url: `/protask/task-issue/get?id=` + id })
}

// 新增生产任务投料
export const createTaskIssue = async (data: TaskIssueVO) => {
  return await request.post({ url: `/protask/task-issue/create`, data })
}

// 修改生产任务投料
export const updateTaskIssue = async (data: TaskIssueVO) => {
  return await request.put({ url: `/protask/task-issue/update`, data })
}

// 删除生产任务投料
export const deleteTaskIssue = async (id: number) => {
  return await request.delete({ url: `/protask/task-issue/delete?id=` + id })
}

// 导出生产任务投料 Excel
export const exportTaskIssue = async (params) => {
  return await request.download({ url: `/protask/task-issue/export-excel`, params })
}