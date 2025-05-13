import request from '@/config/axios'

export interface StockTakingVO {
  id: number
  takingCode: string
  takingName: string
  takingDate: Date
  userName: string
  nickName: string
  takingType: string
  warehouseId: number
  warehouseCode: string
  warehouseName: string
  status: string
  remark: string
  attr1: string
  attr2: string
  attr3: number
  attr4: number
}

// 查询库存盘点记录分页
export const getStockTakingPage = async (params) => {
  return await request.get({ url: `/wms/stock-taking/page`, params })
}

// 查询库存盘点记录详情
export const getStockTaking = async (id: number) => {
  return await request.get({ url: `/wms/stock-taking/get?id=` + id })
}

// 新增库存盘点记录
export const createStockTaking = async (data: StockTakingVO) => {
  return await request.post({ url: `/wms/stock-taking/create`, data })
}

// 修改库存盘点记录
export const updateStockTaking = async (data: StockTakingVO) => {
  return await request.put({ url: `/wms/stock-taking/update`, data })
}

// 删除库存盘点记录
export const deleteStockTaking = async (id: number) => {
  return await request.delete({ url: `/wms/stock-taking/delete?id=` + id })
}

// 导出库存盘点记录 Excel
export const exportStockTaking = async (params) => {
  return await request.download({ url: `/wms/stock-taking/export-excel`, params })
}

// ==================== 子表（库存盘点明细） ====================

// 获得库存盘点明细分页
export const getStockTakingLinePage = async (params) => {
  return await request.get({ url: `/wms/stock-taking/stock-taking-line/page`, params })
}
// 新增库存盘点明细
export const createStockTakingLine = async (data) => {
  return await request.post({ url: `/wms/stock-taking/stock-taking-line/create`, data })
}

// 修改库存盘点明细
export const updateStockTakingLine = async (data) => {
  return await request.put({ url: `/wms/stock-taking/stock-taking-line/update`, data })
}

// 删除库存盘点明细
export const deleteStockTakingLine = async (id: number) => {
  return await request.delete({ url: `/wms/stock-taking/stock-taking-line/delete?id=` + id })
}

// 获得库存盘点明细
export const getStockTakingLine = async (id: number) => {
  return await request.get({ url: `/wms/stock-taking/stock-taking-line/get?id=` + id })
}

// ==================== 子表（库存盘点结果） ====================

// 获得库存盘点结果分页
export const getStockTakingResultPage = async (params) => {
  return await request.get({ url: `/wms/stock-taking/stock-taking-result/page`, params })
}
// 新增库存盘点结果
export const createStockTakingResult = async (data) => {
  return await request.post({ url: `/wms/stock-taking/stock-taking-result/create`, data })
}

// 修改库存盘点结果
export const updateStockTakingResult = async (data) => {
  return await request.put({ url: `/wms/stock-taking/stock-taking-result/update`, data })
}

// 删除库存盘点结果
export const deleteStockTakingResult = async (id: number) => {
  return await request.delete({ url: `/wms/stock-taking/stock-taking-result/delete?id=` + id })
}

// 获得库存盘点结果
export const getStockTakingResult = async (id: number) => {
  return await request.get({ url: `/wms/stock-taking/stock-taking-result/get?id=` + id })
}