import request from '@/config/axios'

export interface LineVO {
  id: number
  iqcId: number
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

// 查询来料检验单行分页
export const getLinePage = async (params) => {
  return await request.get({ url: `/iqc/line/page`, params })
}

// 查询来料检验单行详情
export const getLine = async (id: number) => {
  return await request.get({ url: `/iqc/line/get?id=` + id })
}

// 新增来料检验单行
export const createLine = async (data: LineVO) => {
  return await request.post({ url: `/iqc/line/create`, data })
}

// 修改来料检验单行
export const updateLine = async (data: LineVO) => {
  return await request.put({ url: `/iqc/line/update`, data })
}

// 删除来料检验单行
export const deleteLine = async (id: number) => {
  return await request.delete({ url: `/iqc/line/delete?id=` + id })
}

// 导出来料检验单行 Excel
export const exportLine = async (params) => {
  return await request.download({ url: `/iqc/line/export-excel`, params })
}