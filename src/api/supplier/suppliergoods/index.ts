import request from '@/config/axios'

export interface GoodsVO {
  id: number
  goodsName: string
  goodsClass: number
  goodsClassName: string
  goodsAttrClass: number
  goodsAttrName: string
  categoryId: string
  categoryName: string
  goodsImage: string
  goodsContent: string
  isOwn: number
  price: number
  marketPrice: number
  costPrice: number
  goodsStock: number
  goodsStockAlarm: number
  isVirtual: number
  virtualIndate: number
  isFreeShipping: number
  shippingTemplate: number
  goodsSpecFormat: string
  goodsAttrFormat: string
  introduction: string
  keywords: string
  unit: string
  videoUrl: string
  evaluateChaping: number
  isFenxiao: boolean
  fenxiaoType: boolean
  siteId: number
  skuId: number
  minPrice: number
  maxPrice: number
  minNum: number
  categoryJson: string
  timerOn: number
  timerOff: number
  status: string
  processInstanceId: string
  supplierId: number
}

// 查询供应商商品分页
export const getGoodsPage = async (params) => {
  return await request.get({ url: `/supplier/goods/page`, params })
}

// 查询供应商商品详情
export const getGoods = async (id: number) => {
  return await request.get({ url: `/supplier/goods/get?id=` + id })
}

// 新增供应商商品
export const createGoods = async (data: GoodsVO) => {
  return await request.post({ url: `/supplier/goods/create`, data })
}

// 修改供应商商品
export const updateGoods = async (data: GoodsVO) => {
  return await request.put({ url: `/supplier/goods/update`, data })
}

// 删除供应商商品
export const deleteGoods = async (id: number) => {
  return await request.delete({ url: `/supplier/goods/delete?id=` + id })
}

// 导出供应商商品 Excel
export const exportGoods = async (params) => {
  return await request.download({ url: `/supplier/goods/export-excel`, params })
}