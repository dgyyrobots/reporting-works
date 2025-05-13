import request from '@/config/axios'

export interface RtIssueVO {
  id: number
  rtCode: string
  rtName: string
  workorderId: number
  workorderCode: string
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
  status: string
  remark: string
  attr1: string
  attr2: string
  attr3: number
  attr4: number
}

// 查询生产退料单头分页
export const getRtIssuePage = async (params) => {
  return await request.get({ url: `/wms/rt-issue/page`, params })
}

// 查询生产退料单头详情
export const getRtIssue = async (id: number) => {
  return await request.get({ url: `/wms/rt-issue/get?id=` + id })
}

// 新增生产退料单头
export const createRtIssue = async (data: RtIssueVO) => {
  return await request.post({ url: `/wms/rt-issue/create`, data })
}

// 修改生产退料单头
export const updateRtIssue = async (data: RtIssueVO) => {
  return await request.put({ url: `/wms/rt-issue/update`, data })
}

// 删除生产退料单头
export const deleteRtIssue = async (id: number) => {
  return await request.delete({ url: `/wms/rt-issue/delete?id=` + id })
}

// 导出生产退料单头 Excel
export const exportRtIssue = async (params) => {
  return await request.download({ url: `/wms/rt-issue/export-excel`, params })
}

// ==================== 子表（生产退料单行） ====================

// 获得生产退料单行分页
export const getRtIssueLinePage = async (params) => {
  return await request.get({ url: `/wms/rt-issue/rt-issue-line/page`, params })
}
// 新增生产退料单行
export const createRtIssueLine = async (data) => {
  return await request.post({ url: `/wms/rt-issue/rt-issue-line/create`, data })
}

// 修改生产退料单行
export const updateRtIssueLine = async (data) => {
  return await request.put({ url: `/wms/rt-issue/rt-issue-line/update`, data })
}

// 删除生产退料单行
export const deleteRtIssueLine = async (id: number) => {
  return await request.delete({ url: `/wms/rt-issue/rt-issue-line/delete?id=` + id })
}

// 获得生产退料单行
export const getRtIssueLine = async (id: number) => {
  return await request.get({ url: `/wms/rt-issue/rt-issue-line/get?id=` + id })
}