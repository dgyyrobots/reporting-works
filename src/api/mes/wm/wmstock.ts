import request from '@/config/axios'

export interface WmstockVO {
    id: number
    materialStockId: number
    itemId: number
    itemCode: string
    itemName: string
    specification: string
    unitOfMeasure: string
    batchCode: string
    warehouseId: number
    warehouseCode: string
    warehouseName: string
    locationId: number
    locationCode: string
    locationName: string
    areaId: number
    areaCode: string
    areaName: string
    vendorId: number
    vendorCode: string
    vendorName: string
    vendorNick: string
    quantityOnhand: number
    expireDate: string
    status: string
    remark: string
    createTime: string
    updateTime: string
}

export interface QueryParams {
    pageNo: number
    pageSize: number
    itemCode?: string
    itemName?: string
    batchCode?: string
    warehouseId?: number
    warehouseCode?: string
    warehouseName?: string
    locationId?: number
    locationCode?: string
    locationName?: string
    areaId?: number
    areaCode?: string
    areaName?: string
    vendorId?: number
    vendorCode?: string
    vendorName?: string
    vendorNick?: string
    quantityOnhand?: number
    expireDate?: string
    status?: string
}

// 查询库存记录列表
export const listWmstock = async (params: QueryParams) => {
    return await request.get({ url: '/mes/wms/material-stock/page', params })
}

// 查询库存记录详细
export const getWmstock = async (materialStockId: number) => {
    return await request.get({ url: `/mes/wms/material-stock/get?id=${materialStockId}` })
}

// 新增库存记录
export const addWmstock = async (data: WmstockVO) => {
    return await request.post({ url: '/mes/wms/material-stock/create', data })
}

// 修改库存记录
export const updateWmstock = async (data: WmstockVO) => {
    return await request.put({ url: '/mes/wms/material-stock/update', data })
}

// 删除库存记录
export const delWmstock = async (materialStockId: number) => {
    return await request.delete({ url: `/mes/wms/material-stock/delete?id=${materialStockId}` })
} 