import request from '@/config/axios'

export interface BarcodeVO {
  id: number
  barcodeFormart: string
  barcodeType: string
  barcodeContent: string
  bussinessId: number
  bussinessCode: string
  bussinessName: string
  barcodeUrl: string
  enableFlag: string
  remark: string
  attr1: string
  attr2: string
  attr3: number
  attr4: number
}

// 查询条码清单分页
export const getBarcodePage = async (params) => {
  return await request.get({ url: `/wms/barcode/page`, params })
}

// 查询条码清单详情
export const getBarcode = async (id: number) => {
  return await request.get({ url: `/wms/barcode/get?id=` + id })
}

// 新增条码清单
export const createBarcode = async (data: BarcodeVO) => {
  return await request.post({ url: `/wms/barcode/create`, data })
}

// 修改条码清单
export const updateBarcode = async (data: BarcodeVO) => {
  return await request.put({ url: `/wms/barcode/update`, data })
}

// 删除条码清单
export const deleteBarcode = async (id: number) => {
  return await request.delete({ url: `/wms/barcode/delete?id=` + id })
}

// 导出条码清单 Excel
export const exportBarcode = async (params) => {
  return await request.download({ url: `/wms/barcode/export-excel`, params })
}