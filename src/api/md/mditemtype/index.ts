import request from '@/config/axios'

export interface ItemTypeVO {
  id: number
  itemTypeCode: string
  itemTypeName: string
  parentTypeId: number
  ancestors: string
  itemOrProduct: string
  orderNum: number
  enableFlag: string
  remark: string
  attr1: string
  attr2: string
  attr3: number
  attr4: number
}

// 查询物料分类列表
export const getItemTypeList = async (params) => {
  //return await request.get({ url: `/md/item-type/list`, params })
  return await request.get({ url: `/mes/md-item-type/page`, params })
}

// 查询物料分类详情
export const getItemType = async (id: number) => {
  //return await request.get({ url: `/md/item-type/get?id=` + id })
  return await request.get({ url: `/mes/md-item-type/get?id=` + id })
}

// 新增物料分类
export const createItemType = async (data: ItemTypeVO) => {
  //return await request.post({ url: `/md/item-type/create`, data })
  return await request.post({ url: `/mes/md-item-type/create`, data })}

// 修改物料分类
export const updateItemType = async (data: ItemTypeVO) => {
  //return await request.put({ url: `/md/item-type/update`, data })
  return await request.put({ url: `/mes/md-item-type/update`, data })
}

// 删除物料分类
export const deleteItemType = async (id: number) => {
  //return await request.delete({ url: `/md/item-type/delete?id=` + id })
  return await request.delete({ url: `/mes/md-item-type/delete?id=` + id })
}

// 导出物料分类 Excel
export const exportItemType = async (params) => {
  //return await request.download({ url: `/md/item-type/export-excel`, params })
  return await request.download({ url: `/mes/md-item-type/export-excel`, params })
}
