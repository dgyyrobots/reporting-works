import request from '@/config/axios'

export interface UnitMeasureTypeVO {
  id: number
  measureTypeCode: string
  measureTypeName: string
  parentTypeId: number
  ancestors: string
  orderNum: number
  enableFlag: string
  remark: string
}

// 查询单位分类分页
export const getUnitMeasureTypePage = async (params) => {
  return await request.get({ url: `/md/unit-measure-type/page`, params })
}

// 查询单位分类详情
export const getUnitMeasureType = async (id: number) => {
  return await request.get({ url: `/md/unit-measure-type/get?id=` + id })
}

// 新增单位分类
export const createUnitMeasureType = async (data: UnitMeasureTypeVO) => {
  return await request.post({ url: `/md/unit-measure-type/create`, data })
}

// 修改单位分类
export const updateUnitMeasureType = async (data: UnitMeasureTypeVO) => {
  return await request.put({ url: `/md/unit-measure-type/update`, data })
}

// 删除单位分类
export const deleteUnitMeasureType = async (id: number) => {
  return await request.delete({ url: `/md/unit-measure-type/delete?id=` + id })
}

// 导出单位分类 Excel
export const exportUnitMeasureType = async (params) => {
  return await request.download({ url: `/md/unit-measure-type/export-excel`, params })
}

// ==================== 子表（单位） ====================

// 获得单位分页
export const getUnitMeasurePage = async (params) => {
  return await request.get({ url: `/md/unit-measure-type/unit-measure/page`, params })
}
// 新增单位
export const createUnitMeasure = async (data) => {
  return await request.post({ url: `/md/unit-measure-type/unit-measure/create`, data })
}

// 修改单位
export const updateUnitMeasure = async (data) => {
  return await request.put({ url: `/md/unit-measure-type/unit-measure/update`, data })
}

// 删除单位
export const deleteUnitMeasure = async (id: number) => {
  return await request.delete({ url: `/md/unit-measure-type/unit-measure/delete?id=` + id })
}

// 获得单位
export const getUnitMeasure = async (id: number) => {
  return await request.get({ url: `/md/unit-measure-type/unit-measure/get?id=` + id })
}