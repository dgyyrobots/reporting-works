import request from '@/config/axios'

export interface AllocatedRecordVO {
    id?: number
    headerId?: number
    itemId?: number
    itemCode?: string
    itemName?: string
    quantityAllocated?: number
    unitOfMeasure?: string
    batchCode?: string
    allocatedFlag?: boolean
    warehouseId?: number
    warehouseName?: string
    locationId?: number
    locationName?: string
    areaId?: number
    areaName?: string
    status?: string
    remark?: string
    createTime?: string
    updateTime?: string
}

export interface QueryParams {
    pageNo?: number
    pageSize?: number
    headerId?: number
    itemCode?: string
    itemName?: string
    batchCode?: string
    status?: string
}

// 创建调拨单身记录
export const createAllocatedRecord = async (data: AllocatedRecordVO) => {
    return await request.post({
        url: '/wms/allocated-record/create',
        data
    })
}

// 更新调拨单身记录
export const updateAllocatedRecord = async (data: AllocatedRecordVO) => {
    return await request.put({
        url: '/wms/allocated-record/update',
        data
    })
}

// 删除调拨单身记录
export const deleteAllocatedRecord = async (id: number) => {
    return await request.delete({
        url: `/wms/allocated-record/delete?id=${id}`
    })
}

// 获得调拨单身记录
export const getAllocatedRecord = async (id: number) => {
    return await request.get({
        url: `/wms/allocated-record/get?id=${id}`
    })
}

// 获得调拨单身记录
export const getAllocatedRecordByHeaderId = async (id: number) => {
    return await request.get({
        url: `/wms/allocated-record/getByHeaderId?id=${id}`
    })
}

// 获得调拨单身记录分页
export const getAllocatedRecordPage = async (query: QueryParams) => {
    return await request.get({
        url: '/wms/allocated-record/page',
        params: query
    })
}

// 导出调拨单身记录 Excel
export const exportAllocatedRecordExcel = async (query: QueryParams) => {
    return await request.download({
        url: '/wms/allocated-record/export-excel',
        params: query
    })
}