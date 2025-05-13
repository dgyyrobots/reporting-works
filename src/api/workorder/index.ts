import request from '@/config/axios'

export interface WorkorderVO {
  id: number
  workorderCode: string
  workorderName: string
  orderSource: string
  sourceCode: string
  productId: number
  productCode: string
  productName: string
  productSpc: string
  unitOfMeasure: string
  quantity: number
  quantityProduced: number
  quantityChanged: number
  quantityScheduled: number
  clientId: number
  clientCode: string
  clientName: string
  batchCode: string
  requestDate: Date
  parentId: number
  ancestors: string
  status: string
  remark: string
  mixinOrderId: number
  adjuncts: string
  isOut: boolean
}

// 查询生产工单分页
export const getWorkorderPage = async (params) => {
  //return await request.get({ url: `/proworkorder/workorder/page`, params })
  return await request.get({ url: `/mes/pro/workorder/page`, params })
}

// 查询生产工单详情
export const getWorkorder = async (id: number) => {
  //return await request.get({ url: `/proworkorder/workorder/get?id=` + id })
  return await request.get({ url: `/mes/pro/workorder/get?id=` + id })
}

// 新增生产工单
export const createWorkorder = async (data: WorkorderVO) => {
  //return await request.post({ url: `/proworkorder/workorder/create`, data })
  return await request.post({ url: `/mes/pro/workorder/create`, data })}

// 修改生产工单
export const updateWorkorder = async (data: WorkorderVO) => {
  //return await request.put({ url: `/proworkorder/workorder/update`, data })
  return await request.put({ url: `/mes/pro/workorder/update`, data })
}

// 删除生产工单
export const deleteWorkorder = async (id: number) => {
  //return await request.delete({ url: `/proworkorder/workorder/delete?id=` + id })
  return await request.delete({ url: `/mes/pro/workorder/delete?id=` + id })
}

// 导出生产工单 Excel
export const exportWorkorder = async (params) => {
  //return await request.download({ url: `/proworkorder/workorder/export-excel`, params })
  return await request.download({ url: `/mes/pro/workorder/export-excel`, params })
}

// ==================== 子表（生产工单BOM组成） ====================

// 获得生产工单BOM组成分页
export const getWorkorderBomPage = async (params) => {
  return await request.get({ url: `/mes/pro/workorder-bom/page`, params })
}
// 新增生产工单BOM组成
export const createWorkorderBom = async (data) => {
  return await request.post({ url: `/mes/pro/workorder-bom/create`, data })
}

// 修改生产工单BOM组成
export const updateWorkorderBom = async (data) => {
  return await request.put({ url: `/mes/pro/workorder-bom/update`, data })
}

// 删除生产工单BOM组成
export const deleteWorkorderBom = async (id: number) => {
  return await request.delete({ url: `/mes/pro/workorder-bom/delete?id=` + id })
}

// 获得生产工单BOM组成
export const getWorkorderBom = async (id: number) => {
  return await request.get({ url: `/mes/pro/workorder-bom/get?id=` + id })
}
