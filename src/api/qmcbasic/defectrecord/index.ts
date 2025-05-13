import request from '@/config/axios'

export interface DefectRecordVO {
  id: number
  qcType: string
  qcId: number
  lineId: number
  defectName: string
  defectLevel: string
  defectQuantity: number
  remark: string
  attr1: string
  attr2: string
  attr3: number
  attr4: number
}

// 查询检验单记录分页
export const getDefectRecordPage = async (params) => {
  return await request.get({ url: `/qmcbasic/defect-record/page`, params })
}

// 查询检验单记录详情
export const getDefectRecord = async (id: number) => {
  return await request.get({ url: `/qmcbasic/defect-record/get?id=` + id })
}

// 新增检验单记录
export const createDefectRecord = async (data: DefectRecordVO) => {
  return await request.post({ url: `/qmcbasic/defect-record/create`, data })
}

// 修改检验单记录
export const updateDefectRecord = async (data: DefectRecordVO) => {
  return await request.put({ url: `/qmcbasic/defect-record/update`, data })
}

// 删除检验单记录
export const deleteDefectRecord = async (id: number) => {
  return await request.delete({ url: `/qmcbasic/defect-record/delete?id=` + id })
}

// 导出检验单记录 Excel
export const exportDefectRecord = async (params) => {
  return await request.download({ url: `/qmcbasic/defect-record/export-excel`, params })
}