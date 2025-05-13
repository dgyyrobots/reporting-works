import request from '@/config/axios'

export interface LineVO {
  id: number
  oqcId: number
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

// 查询出货检验单行分页
export const getLinePage = async (params) => {
  return await request.get({ url: `/oqc/line/page`, params })
}

// 查询出货检验单行详情
export const getLine = async (id: number) => {
  return await request.get({ url: `/oqc/line/get?id=` + id })
}

// 新增出货检验单行
export const createLine = async (data: LineVO) => {
  return await request.post({ url: `/oqc/line/create`, data })
}

// 修改出货检验单行
export const updateLine = async (data: LineVO) => {
  return await request.put({ url: `/oqc/line/update`, data })
}

// 删除出货检验单行
export const deleteLine = async (id: number) => {
  return await request.delete({ url: `/oqc/line/delete?id=` + id })
}

// 导出出货检验单行 Excel
export const exportLine = async (params) => {
  return await request.download({ url: `/oqc/line/export-excel`, params })
}