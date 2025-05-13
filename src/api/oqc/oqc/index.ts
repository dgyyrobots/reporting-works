import request from '@/config/axios'

export interface VO {
  id: number
  sourceCode: string
  oqcCode: string
  oqcName: string
  templateId: number
  clientId: number
  clientCode: string
  clientName: string
  batchCode: string
  itemId: number
  itemCode: string
  itemName: string
  specification: string
  unitOfMeasure: string
  quantityMinCheck: number
  quantityMaxUnqualified: number
  quantityOut: number
  quantityCheck: number
  quantityUnqualified: number
  quantityQuanlified: number
  crRate: number
  majRate: number
  minRate: number
  crQuantity: number
  majQuantity: number
  minQuantity: number
  checkResult: string
  outDate: Date
  inspectDate: Date
  inspector: string
  status: string
  remark: string
  attr1: string
  attr2: string
  attr3: number
  attr4: number
}

//开启工作流
export const startBpm = async (params) => {
  //return await request.post({ url: `/oqc/startBpm`, params })
  return await request.post({ url: `/mes/qms/oqc/startBpm`, params })
}

// 查询出货检验分页
export const getPage = async (params) => {
  //return await request.get({ url: `/oqc/page`, params })
  return await request.get({ url: `/mes/qms/oqc/page`, params })
}

// 查询出货检验详情
export const get = async (id: number) => {
  //return await request.get({ url: `/oqc/get?id=` + id })
  return await request.get({ url: `/mes/qms/oqc/get?id=` + id })
}

// 新增出货检验
export const create = async (data: VO) => {
  //return await request.post({ url: `/oqc/create`, data })
  return await request.post({ url: `/mes/qms/oqc/create`, data })
}

// 修改出货检验
export const update = async (data: VO) => {
  //return await request.put({ url: `/oqc/update`, data })
  return await request.put({ url: `/mes/qms/oqc/update`, data })
}

// 删除出货检验
export const oqcdelete = async (id: number) => {
  //return await request.delete({ url: `/oqc/delete?id=` + id })
  return await request.delete({ url: `/mes/qms/oqc/delete?id=` + id })
}

// 导出出货检验 Excel
export const oqcexport = async (params) => {
  //return await request.download({ url: `/oqc/export-excel`, params })
  return await request.download({ url: `/mes/qms/oqc/export-excel`, params })
}

// ==================== 子表（出货检验单行） ====================

// 获得出货检验单行分页
export const getLinePage = async (params) => {
  //return await request.get({ url: `/oqc/line/page`, params })
  return await request.get({ url: `/mes/qms/oqc-line/page`, params })
}
// 新增出货检验单行
export const createLine = async (data) => {
  //return await request.post({ url: `/oqc/line/create`, data })
  return await request.post({ url: `/mes/qms/oqc-line/create`, data })
}

// 修改出货检验单行
export const updateLine = async (data) => {
  //return await request.put({ url: `/oqc/line/update`, data })
  return await request.put({ url: `/mes/qms/oqc-line/update`, data })
}

// 删除出货检验单行
export const deleteLine = async (id: number) => {
  //return await request.delete({ url: `/oqc/line/delete?id=` + id })
  return await request.delete({ url: `/mes/qms/oqc-line/delete?id=` + id })
}

// 获得出货检验单行
export const getLine = async (id: number) => {
  //return await request.get({ url: `/oqc/line/get?id=` + id })
  return await request.get({ url: `/mes/qms/oqc-line/get?id=` + id })
}
