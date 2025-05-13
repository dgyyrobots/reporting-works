import request from '@/config/axios'

export interface IssueHeaderVO {
  id: number
  issueCode: string
  issueName: string
  workstationId: number
  workstationCode: string
  workstationName: string
  workorderId: number
  workorderCode: string
  taskId: number
  taskCode: string
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
  issueDate: Date
  status: string
  remark: string
  attr1: string
  attr2: string
  attr3: number
  attr4: number
}

// 查询生产领料单头分页
export const getIssueHeaderPage = async (params) => {
  return await request.get({ url: `/wms/issue-header/page`, params })
}

// 查询生产领料单头详情
export const getIssueHeader = async (id: number) => {
  return await request.get({ url: `/wms/issue-header/get?id=` + id })
}

// 新增生产领料单头
export const createIssueHeader = async (data: IssueHeaderVO) => {
  return await request.post({ url: `/wms/issue-header/create`, data })
}

// 修改生产领料单头
export const updateIssueHeader = async (data: IssueHeaderVO) => {
  return await request.put({ url: `/wms/issue-header/update`, data })
}

// 删除生产领料单头
export const deleteIssueHeader = async (id: number) => {
  return await request.delete({ url: `/wms/issue-header/delete?id=` + id })
}

// 导出生产领料单头 Excel
export const exportIssueHeader = async (params) => {
  return await request.download({ url: `/wms/issue-header/export-excel`, params })
}

// ==================== 子表（生产领料单行） ====================

// 获得生产领料单行分页
export const getIssueLinePage = async (params) => {
  return await request.get({ url: `/wms/issue-header/issue-line/page`, params })
}
// 新增生产领料单行
export const createIssueLine = async (data) => {
  return await request.post({ url: `/wms/issue-header/issue-line/create`, data })
}

// 修改生产领料单行
export const updateIssueLine = async (data) => {
  return await request.put({ url: `/wms/issue-header/issue-line/update`, data })
}

// 删除生产领料单行
export const deleteIssueLine = async (id: number) => {
  return await request.delete({ url: `/wms/issue-header/issue-line/delete?id=` + id })
}

// 获得生产领料单行
export const getIssueLine = async (id: number) => {
  return await request.get({ url: `/wms/issue-header/issue-line/get?id=` + id })
}