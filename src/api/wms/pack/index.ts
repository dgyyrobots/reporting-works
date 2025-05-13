import request from '@/config/axios'

export interface PackVO {
  id: number
  parentId: number
  ancestors: string
  packageCode: string
  barcodeId: number
  barcodeContent: string
  barcodeUrl: string
  packageDate: Date
  soCode: string
  invoiceCode: string
  clientId: number
  clientCode: string
  clientName: string
  clientNick: string
  packageLength: number
  packageWidth: number
  packageHeight: number
  sizeUnit: string
  netWeight: number
  crossWeight: number
  weightUnit: string
  inspector: string
  inspectorName: string
  status: string
  enableFlag: string
  remark: string
  attr1: string
  attr2: string
  attr3: number
  attr4: number
}

// 查询装箱单分页
export const getPackPage = async (params) => {
  return await request.get({ url: `/wms/pack/page`, params })
}

// 查询装箱单详情
export const getPack = async (id: number) => {
  return await request.get({ url: `/wms/pack/get?id=` + id })
}

// 新增装箱单
export const createPack = async (data: PackVO) => {
  return await request.post({ url: `/wms/pack/create`, data })
}

// 修改装箱单
export const updatePack = async (data: PackVO) => {
  return await request.put({ url: `/wms/pack/update`, data })
}

// 删除装箱单
export const deletePack = async (id: number) => {
  return await request.delete({ url: `/wms/pack/delete?id=` + id })
}

// 导出装箱单 Excel
export const exportPack = async (params) => {
  return await request.download({ url: `/wms/pack/export-excel`, params })
}

// ==================== 子表（装箱明细） ====================

// 获得装箱明细分页
export const getPackageLinePage = async (params) => {
  return await request.get({ url: `/wms/pack/package-line/page`, params })
}
// 新增装箱明细
export const createPackageLine = async (data) => {
  return await request.post({ url: `/wms/pack/package-line/create`, data })
}

// 修改装箱明细
export const updatePackageLine = async (data) => {
  return await request.put({ url: `/wms/pack/package-line/update`, data })
}

// 删除装箱明细
export const deletePackageLine = async (id: number) => {
  return await request.delete({ url: `/wms/pack/package-line/delete?id=` + id })
}

// 获得装箱明细
export const getPackageLine = async (id: number) => {
  return await request.get({ url: `/wms/pack/package-line/get?id=` + id })
}