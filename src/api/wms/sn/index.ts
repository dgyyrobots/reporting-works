import request from '@/config/axios'

export interface SnVO {
  id: number
  snCode: string
  itemId: number
  itemCode: string
  itemName: string
  specification: string
  unitOfMeasure: string
  batchCode: string
  remark: string
  attr1: string
  attr2: string
  attr3: number
  attr4: number
  genDate: Date
}

// 查询SN码分页
export const getSnPage = async (params) => {
  return await request.get({ url: `/wms/sn/page`, params })
}

// 查询SN码详情
export const getSn = async (id: number) => {
  return await request.get({ url: `/wms/sn/get?id=` + id })
}

// 新增SN码
export const createSn = async (data: SnVO) => {
  return await request.post({ url: `/wms/sn/create`, data })
}

// 修改SN码
export const updateSn = async (data: SnVO) => {
  return await request.put({ url: `/wms/sn/update`, data })
}

// 删除SN码
export const deleteSn = async (id: number) => {
  return await request.delete({ url: `/wms/sn/delete?id=` + id })
}

// 导出SN码 Excel
export const exportSn = async (params) => {
  return await request.download({ url: `/wms/sn/export-excel`, params })
}