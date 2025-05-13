import request from '@/config/axios'

export interface IpqcVO {
  id: number
  ipqcCode: string
  ipqcName: string
  ipqcType: string
  templateId: number
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
  itemId: number
  itemCode: string
  itemName: string
  specification: string
  unitOfMeasure: string
  quantityCheck: number
  quantityUnqualified: number
  quantityQualified: number
  crRate: number
  majRate: number
  minRate: number
  crQuantity: number
  majQuantity: number
  minQuantity: number
  checkResult: string
  inspectDate: Date
  inspector: string
  status: string
  remark: string
  attr1: string
  attr2: string
  attr3: number
  attr4: number
}


//反审核
export const reCheck = async (data: IpqcVO) => {
  return await request.put({ url: `/ipqc/reCheck`, data })
}

//开启工作流
export const startBpm = async (data: IpqcVO) => {
  return await request.post({ url: `/ipqc/startBpm`, data })
}

// 查询过程检验分页
export const getIpqcPage = async (params) => {
  return await request.get({ url: `/ipqc/page`, params })
}

// 查询过程检验详情
export const getIpqc = async (id: number) => {
  return await request.get({ url: `/ipqc/get?id=` + id })
}

// 新增过程检验
export const createIpqc = async (data: IpqcVO) => {
  return await request.post({ url: `/ipqc/create`, data })
}

// 修改过程检验
export const updateIpqc = async (data: IpqcVO) => {
  return await request.put({ url: `/ipqc/update`, data })
}

// 删除过程检验
export const deleteIpqc = async (id: number) => {
  return await request.delete({ url: `/ipqc/delete?id=` + id })
}

// 导出过程检验 Excel
export const exportIpqc = async (params) => {
  return await request.download({ url: `/ipqc/export-excel`, params })
}

// ==================== 子表（过程检验单行） ====================

// 获得过程检验单行分页
export const getLinePage = async (params) => {
  return await request.get({ url: `/ipqc/line/page`, params })
}
// 新增过程检验单行
export const createLine = async (data) => {
  return await request.post({ url: `/ipqc/line/create`, data })
}

// 修改过程检验单行
export const updateLine = async (data) => {
  return await request.put({ url: `/ipqc/line/update`, data })
}

// 删除过程检验单行
export const deleteLine = async (id: number) => {
  return await request.delete({ url: `/ipqc/line/delete?id=` + id })
}

// 获得过程检验单行
export const getLine = async (id: number) => {
  return await request.get({ url: `/ipqc/line/get?id=` + id })
}