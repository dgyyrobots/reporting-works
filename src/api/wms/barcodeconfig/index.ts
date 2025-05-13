import request from '@/config/axios'

export interface BarcodeConfigVO {
  id: number
  barcodeFormart: string
  barcodeType: string
  contentFormart: string
  contentExample: string
  autoGenFlag: string
  defaultTemplate: string
  enableFlag: string
  remark: string
  attr1: string
  attr2: string
  attr3: number
  attr4: number
}

// 查询条码配置分页
export const getBarcodeConfigPage = async (params) => {
  return await request.get({ url: `/wms/barcode-config/page`, params })
}

// 查询条码配置详情
export const getBarcodeConfig = async (id: number) => {
  return await request.get({ url: `/wms/barcode-config/get?id=` + id })
}

// 新增条码配置
export const createBarcodeConfig = async (data: BarcodeConfigVO) => {
  return await request.post({ url: `/wms/barcode-config/create`, data })
}

// 修改条码配置
export const updateBarcodeConfig = async (data: BarcodeConfigVO) => {
  return await request.put({ url: `/wms/barcode-config/update`, data })
}

// 删除条码配置
export const deleteBarcodeConfig = async (id: number) => {
  return await request.delete({ url: `/wms/barcode-config/delete?id=` + id })
}

// 导出条码配置 Excel
export const exportBarcodeConfig = async (params) => {
  return await request.download({ url: `/wms/barcode-config/export-excel`, params })
}