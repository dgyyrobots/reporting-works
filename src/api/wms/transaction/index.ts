import request from '@/config/axios'

export interface TransactionVO {
  id: number
  transactionType: string
  itemId: number
  itemCode: string
  itemName: string
  specification: string
  unitOfMeasure: string
  batchCode: string
  warehouseId: number
  warehouseCode: string
  warehouseName: string
  locationId: number
  locationCode: string
  locationName: string
  areaId: number
  areaCode: string
  areaName: string
  vendorId: number
  vendorCode: string
  vendorName: string
  vendorNick: string
  sourceDocType: string
  sourceDocId: number
  sourceDocCode: string
  sourceDocLineId: number
  materialStockId: number
  transactionFlag: number
  transactionQuantity: number
  transactionDate: Date
  relatedTransactionId: number
  erpDate: Date
  workorderId: number
  workorderCode: string
  recptDate: Date
  expireDate: Date
  attr1: string
  attr2: string
  attr3: number
  attr4: number
  storageCheckFlag: boolean
}

// 查询库存事务分页
export const getTransactionPage = async (params) => {
  return await request.get({ url: `/wms/transaction/page`, params })
}

// 查询库存事务详情
export const getTransaction = async (id: number) => {
  return await request.get({ url: `/wms/transaction/get?id=` + id })
}

// 新增库存事务
export const createTransaction = async (data: TransactionVO) => {
  return await request.post({ url: `/wms/transaction/create`, data })
}

// 修改库存事务
export const updateTransaction = async (data: TransactionVO) => {
  return await request.put({ url: `/wms/transaction/update`, data })
}

// 删除库存事务
export const deleteTransaction = async (id: number) => {
  return await request.delete({ url: `/wms/transaction/delete?id=` + id })
}

// 导出库存事务 Excel
export const exportTransaction = async (params) => {
  return await request.download({ url: `/wms/transaction/export-excel`, params })
}