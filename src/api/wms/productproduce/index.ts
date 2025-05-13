import request from '/@/config/axios'

export interface ProductProduceVO {
  id: number
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
  produceDate: Date
  status: string
  remark: string
  attr1: string
  attr2: string
  attr3: number
  attr4: number
  orderSource: string
}

// 查询产品产出记录分页
export const getProductProducePage = async (params) => {
  return await request.get({ url: `/wms/product-produce/page`, params })
}

// 查询产品产出记录详情
export const getProductProduce = async (id: number) => {
  return await request.get({ url: `/wms/product-produce/get?id=` + id })
}

// 新增产品产出记录
export const createProductProduce = async (data: ProductProduceVO) => {
  return await request.post({ url: `/wms/product-produce/create`, data })
}

// 修改产品产出记录
export const updateProductProduce = async (data: ProductProduceVO) => {
  return await request.put({ url: `/wms/product-produce/update`, data })
}

// 删除产品产出记录
export const deleteProductProduce = async (id: number) => {
  return await request.delete({ url: `/wms/product-produce/delete?id=` + id })
}

// 导出产品产出记录 Excel
export const exportProductProduce = async (params) => {
  return await request.download({ url: `/wms/product-produce/export-excel`, params })
}

// ==================== 子表（产品产出记录表行） ====================

// 获得产品产出记录表行分页
export const getProductProduceLinePage = async (params) => {
  return await request.get({ url: `/wms/product-produce/product-produce-line/page`, params })
}
// 新增产品产出记录表行
export const createProductProduceLine = async (data) => {
  return await request.post({ url: `/wms/product-produce/product-produce-line/create`, data })
}

// 修改产品产出记录表行
export const updateProductProduceLine = async (data) => {
  return await request.put({ url: `/wms/product-produce/product-produce-line/update`, data })
}

// 删除产品产出记录表行
export const deleteProductProduceLine = async (id: number) => {
  return await request.delete({ url: `/wms/product-produce/product-produce-line/delete?id=` + id })
}

// 获得产品产出记录表行
export const getProductProduceLine = async (id: number) => {
  return await request.get({ url: `/wms/product-produce/product-produce-line/get?id=` + id })
}