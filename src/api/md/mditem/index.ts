import request from '@/config/axios'
import bomVue from '@/views/common/md/mditem/components/bom.vue'

export interface ItemVO {
  id: number
  itemCode: string
  itemName: string
  specification: string
  unitOfMeasure: string
  itemOrProduct: string
  itemTypeId: number
  itemTypeCode: string
  itemTypeName: string
  enableFlag: string
  safeStockFlag: string
  minStock: number
  maxStock: number
  remark: string
  attr1: string
  attr2: string
  attr3: number
  attr4: number
  warehouseId: number
  warehouseCode: string
  warehouseName: string
  locationId: number
  locationCode: string
  locationName: string
  areaId: number
  areaCode: string
  areaName: string
  recptDate: Date
}
// 查询物料产品分页
export const getItemPage = async (params) => {
  //return await request.get({ url: `/md/com-com-md-item/page`, params })
  return await request.get({ url: `/mes/md-item/page`, params })
}

// 查询物料产品详情
export const getItem = async (id: number) => {
  // return await request.get({ url: `/md/com-com-md-item/get?id=` + id })
  return await request.get({ url: `/mes/md-item/get?id=` + id })
}

// 新增物料产品
export const createItem = async (data: ItemVO) => {
  //return await request.post({ url: `/md/com-com-md-item/create`, data })
  return await request.post({ url: `/mes/md-item/create`, data })
}

// 修改物料产品
export const updateItem = async (data: ItemVO) => {
  // return await request.put({ url: `/md/com-com-md-item/update`, data })
  return await request.put({ url: `/mes/md-item/update`, data })
}

// 删除物料产品
export const deleteItem = async (id: number) => {
  // return await request.delete({ url: `/md/com-com-md-item/delete?id=` + id })
  return await request.delete({ url: `/mes/md-item/delete?id=` + id })
}

// 导出物料产品 Excel
export const exportItem = async (params) => {
  return await request.download({ url: `/mes/md-item/export-excel`, params })
}

// ==================== 子表（产品SOP） ====================

// 获得产品SOP分页
export const getMdProductSopPage = async (params) => {
  return await request.get({ url: `/md/com-com-md-item/product-sop/page`, params })
}
// 新增产品SOP
export const createMdProductSop = async (data) => {
  return await request.post({ url: `/md/com-com-md-item/product-sop/create`, data })
}

// 修改产品SOP
export const updateMdProductSop = async (data) => {
  return await request.put({ url: `/md/com-com-md-item/product-sop/update`, data })
}

// 删除产品SOP
export const deleteMdProductSop = async (id: number) => {
  return await request.delete({ url: `/md/com-com-md-item/product-sop/delete?id=` + id })
}

// 获得产品SOP
export const getMdProductSop = async (id: number) => {
  return await request.get({ url: `/md/com-com-md-item/product-sop/get?id=` + id })
}

// bom

// 创建bom关系
export const createMdProductBom = async (data) => {
  // return await request.post({ url: `/md/com-com-md-item/product-bom/create`, data })
  return await request.post({ url: `/mes/md-product-bom/create`, data })
}
// 获得产品BOM分页
export const getMdProductBomPage = async (params) => {
  //return await request.get({ url: `/md/com-com-md-item/product-bom/page`, params })
  return await request.get({ url: `/mes/md-product-bom/page`, params })
}

// 修改产品BOM
export const updateMdProductBom = async (data) => {
  // return await request.put({ url: `/md/com-com-md-item/product-bom/update`, data })
  return await request.put({ url: `/mes/md-product-bom/update`, data })
}
// 获得产品BOM
// admin-api
export const getMdProductBom =  async (id: number) => {
  //return await request.get({ url: `/md/com-com-md-item/product-bom/get?id=` + id })
  return await request.get({ url: `/mes/md-product-bom/get?id=` + id })
}

// 获得产品BOM分页2.0 末端
export const getMdProductBomPage2 = async (params) => {
  return await request.get({ url: `/md/com-com-md-item/product-bom/listEndBom`, params })
}

// 计价
export const jijia = async (data) => {
  return await request.post({ url: `/md/com-com-md-item/product-bom/offerBom`, data })
}
// 删除产品BOM
export const deleteMdProductBom = async (id: number) => {
  // return await request.delete({ url: `/md/com-com-md-item/product-bom/delete?id=` + id })
  return await request.delete({ url: `/mes/md-product-bom/delete?id=` + id })
}
// ==================== add（产品SOP） ====================
// 更新工艺组成绑定bomId
// 请求参数接口
export interface GetMdProductBomParams {
  id: number;
  bomId: number;
}

export const bindBomId =async (data: GetMdProductBomParams) => {
  return await request.put({ url: `/mes/pro/route-process/updateBomId`, data })
}

// 修改工艺组成
export const updateRouteProcess = async (data) => {
  return await request.put({ url: `/mes/pro/route-process/update`, data })
}
// 修改工艺组成
export const updateRouteProcesss = async (data) => {
  return await request.put({ url: `/md/com-com-md-item/updateBom`, data })
}
// 获取绑定的工艺组成
export const updateRouteProcesssGet = async (data) => {
  //return await request.get({ url: `/md/com-com-md-item/product-bom/page`, data })
  return await request.get({ url: `/mes/md-product-bom/page`, data })
}
