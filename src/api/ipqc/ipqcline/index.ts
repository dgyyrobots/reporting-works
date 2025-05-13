import request from '@/config/axios'

export interface LineVO {
  id: number
  ipqcId: number
  indexId: number
  indexCode: string
  indexName: string
  indexType: string
  qcTool: string
  checkMethod: string
  standerVal: number
  unitOfMeasure: string
  thresholdMax: number
  thresholdMin: number
  crQuantity: number
  majQuantity: number
  minQuantity: number
  remark: string
  attr1: string
  attr2: string
  attr3: number
  attr4: number
}

// 查询过程检验单行分页
export const getLinePage = async (params) => {
  return await request.get({ url: `/ipqc/line/page`, params })
}

// 查询过程检验单行详情
export const getLine = async (id: number) => {
  return await request.get({ url: `/ipqc/line/get?id=` + id })
}

// 新增过程检验单行
export const createLine = async (data: LineVO) => {
  return await request.post({ url: `/ipqc/line/create`, data })
}

// 修改过程检验单行
export const updateLine = async (data: LineVO) => {
  return await request.put({ url: `/ipqc/line/update`, data })
}

// 删除过程检验单行
export const deleteLine = async (id: number) => {
  return await request.delete({ url: `/ipqc/line/delete?id=` + id })
}

// 导出过程检验单行 Excel
export const exportLine = async (params) => {
  return await request.download({ url: `/ipqc/line/export-excel`, params })
}