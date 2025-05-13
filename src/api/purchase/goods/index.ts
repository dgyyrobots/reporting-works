import request from '/@/config/axios/index.ts'

// 定义接口类型
export interface GoodsVO {
    id?: number
    purchaseId?: number
    goodsNumber?: string
    goodsName?: string
    goodsSpecs?: string
    company?: string
    monovalent?: number
    quantity?: number
    taxes?: number
    total?: number
    categoryName?: string
    brandName?: string
    poNo?: string
    receiveNum?: number
    unitOfMeasure?: string
    status?: number
    createTime?: string
    batchCode?: string
}

export interface GoodsPageReqVO extends PageParam {
    purchaseId?: number
    goodsNumber?: string
    goodsName?: string
    goodsSpecs?: string
    company?: string
    monovalent?: number
    quantity?: number
    taxes?: number
    total?: number
    categoryName?: string
    brandName?: string
    createTime?: string[]
}

export interface SplitDetailVO {
    index: number
    poNo: string
    goodsNumber: string
    unitOfMeasure: string
    quantity: number
}

export interface SplitGoodsVO {
    id: number
    poNo: string
    goodsNumber: string
    splitDetails: SplitDetailVO[]
}

export interface WareHousingVO {
    poNo: string
    warehouseId: number
    locationId: number
    areaId: number
}

// 创建采购商品明细
export const createGoods = (data: GoodsVO) => {
    return request.post({ url: '/purchase/goods/create', data })
}

// 更新采购商品明细
export const updateGoods = (data: GoodsVO) => {
    return request.put({ url: '/purchase/goods/update', data })
}

// 删除采购商品明细
export const deleteGoods = (id: number) => {
    return request.delete({ url: `/purchase/goods/delete?id=${id}` })
}

// 获得采购商品明细
export const getGoods = (id: number) => {
    return request.get({ url: `/purchase/goods/get?id=${id}` })
}

// 获得采购商品明细分页
export const getGoodsPage = (params: GoodsPageReqVO) => {
    return request.get({ url: '/purchase/goods/page', params })
}

// 获得采购商品明细分页
export const getAllGoods = (params: GoodsPageReqVO) => {
    return request.get({ url: '/purchase/goods/allList', params })
}

// 导出采购商品明细 Excel
export const exportGoodsExcel = (params: GoodsPageReqVO) => {
    return request.download({
        url: '/purchase/goods/export-excel',
        params,
        responseType: 'blob'
    })
}

// 更新采购商品状态
export const updateReceiveStatus = (data: GoodsVO[]) => {
    return request.put({ url: '/purchase/goods/updateReceiveStatus', data })
}

// 批量更新采购商品状态
export const batchUpdateReceiveStatus = (poNo: string) => {
    return request.put({ url: '/purchase/goods/batchUpdateReceiveStatus', data: { poNo } })
}

// 开始入库
export const startWareHousing = (data: WareHousingVO) => {
    return request.post({ url: '/purchase/goods/wareHousing', data })
}

// 根据采购单号获取对应的库存信息
export const getStockInfoByPurchaseId = (params: { purchaseId: number }) => {
    return request.post({ url: '/purchase/goods/getStockByPurchaseId', data: params })
}

// 拆分入库
export const splitGoods = (data: SplitGoodsVO) => {
    return request.post({ url: '/purchase/goods/splitGoods', data })
}

// 根据选中行单身Id获取条码渲染内容
export const getPurchaseBarCode = (id: number) => {
    return request.get({ url: `/purchase/goods/getPurchaseBarCode?id=${id}` })
}

// 校验明细是否配置
export const checkConfig = (poNo: string) => {
    return request.get({ url: `/purchase/goods/checkConfig?poNo=${poNo}` })
}

// 开始收货

export const receiving = (data: GoodsVO[]) => {
    return request.post({ url: '/purchase/goods/receiving', data })
}

