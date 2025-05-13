import request from '@/config/axios'

export interface VO {
  id: number
  iqcCode: string
  iqcName: string
  templateId: number
  vendorId: number
  vendorCode: string
  vendorName: string
  vendorNick: string
  vendorBatch: string
  itemId: number
  itemCode: string
  itemName: string
  specification: string
  unitOfMeasure: string
  quantityMinCheck: number
  quantityMaxUnqualified: number
  quantityRecived: number
  quantityCheck: number
  quantityUnqualified: number
  crRate: number
  majRate: number
  minRate: number
  crQuantity: number
  majQuantity: number
  minQuantity: number
  checkResult: string
  reciveDate: Date
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
export const reCheck = async (data: VO) => {
  return await request.put({ url: `/iqc/reCheck`, data })
}

//开启工作流
export const startBpm = async (data: VO) => {
  return await request.post({ url: `/iqc/startBpm`, data })
}

// 查询来料检验分页
export const getPage = async (params) => {
  //return await request.get({ url: `/iqc/page`, params })
  return await request.get({ url: `mes/qms/iqc/page`, params })
}

// 查询来料检验详情
export const get = async (id: number) => {
  //return await request.get({ url: `/iqc/get?id=` + id })
  return await request.get({ url: `mes/qms/iqc/get?id=` + id })
}

// 新增来料检验
export const create = async (data: VO) => {
  //return await request.post({ url: `/iqc/create`, data })
  return await request.post({ url: `/mes/qms/iqc/create`, data })
}

// 修改来料检验
export const update = async (data: VO) => {
  //return await request.put({ url: `/iqc/update`, data })
  return await request.put({ url: `/mes/qms/iqc/update`, data })
}

// 删除来料检验
export const Adelete = async (id: number) => {
  //return await request.delete({ url: `/iqc/delete?id=` + id })
  return await request.delete({ url: `/mes/qms/iqc/delete?id=` + id })
}

// 导出来料检验 Excel
export const Aexport = async (params) => {
  //return await request.download({ url: `/iqc/export-excel`, params })
  return await request.download({ url: `/mes/qms/iqc/export-excel`, params })
}

// ==================== 子表（来料检验单行） ====================

// 获得来料检验单行分页
export const getLinePage = async (params) => {
  //return await request.get({ url: `/iqc/line/page`, params })
  return await request.get({ url: `/mes/qms/iqc-line/page`, params })
}
// 新增来料检验单行
export const createLine = async (data) => {
  //return await request.post({ url: `/iqc/line/create`, data })
  return await request.post({ url: `/mes/qms/iqc-line/create`, data })

}

// 修改来料检验单行
export const updateLine = async (data) => {
  //return await request.put({ url: `/iqc/line/update`, data })
  return await request.put({ url: `/mes/qms/iqc-line/update`, data })
}

// 删除来料检验单行
export const deleteLine = async (id: number) => {
  //return await request.delete({ url: `/iqc/line/delete?id=` + id })
  return await request.delete({ url: `/mes/qms/iqc-line/delete?id=` + id })
}

// 获得来料检验单行
export const getLine = async (id: number) => {
  //return await request.get({ url: `/iqc/line/get?id=` + id })
  return await request.get({ url: `/mes/qms/iqc-line/get?id=` + id })
}
