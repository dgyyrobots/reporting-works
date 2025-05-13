import request from '@/config/axios'

export interface AllocatedHeaderVO {
    id: number
    allocatedCode: string
    allocatedName: string
    allocatedDate: string
    status: string
    remark: string
    workorderCode: string
    taskCode: string
    bindWorkorder: boolean
    workorderId: number
    taskId: number
    clientCode: string
    warehouseId: number
}

export interface AllocatedLineVO {
    itemCode: string
    itemName: string
    quantityAllocated: number
    unitOfMeasure: string
    batchCode: string
    allocatedFlag: boolean
    warehouseName: string
    locationName: string
    areaName: string
}

export interface QueryParams {
    pageNo: number
    pageSize: number
    allocatedCode?: string
    allocatedName?: string
    workorderCode?: string
    warehouseName?: string
    allocatedDate?: string[]
}

// 创建调拨单头
export const createAllocatedHeader = async (data: AllocatedHeaderVO) => {
    return await request.post({ url: '/wms/allocated-header/create', data })
}

// 更新调拨单头
export const updateAllocatedHeader = async (data: AllocatedHeaderVO) => {
    return await request.put({ url: '/wms/allocated-header/update', data })
}

// 删除调拨单头
export const deleteAllocatedHeader = async (id: number) => {
    return await request.delete({ url: `/wms/allocated-header/delete?id=${id}` })
}

// 获得调拨单头
export const getAllocatedHeader = async (id: number) => {
    return await request.get({ url: `/wms/allocated-header/get?id=${id}` })
}

// 获得调拨单头分页
export const getAllocatedHeaderPage = async (params: QueryParams) => {
    return await request.get({ url: '/wms/allocated-header/page', params })
}

// 导出调拨单头 Excel
export const exportAllocatedHeaderExcel = async (params: QueryParams) => {
    return await request.download({ url: '/wms/allocated-header/export-excel', params })
}

// 获取Bom信息
export const initBomInfo = async (data: { workorderId: number }) => {
    return await request.post({ url: '/wms/allocated-header/initBom', data })
}

// 执行出库
export const execute = async (allocatedId: number) => {
    return await request.put({ url: `/wms/allocated-header/${allocatedId}` })
}

// 更新调拨单头
export const finshAllocatedHeader = async (id: number) => {
    return await request.get({ url: `/wms/allocated-header/finsh?id=${id}` })
}

// 绑定调拨信息
export const updateAllocatedLine = async (data: AllocatedLineVO[]) => {
    return await request.post({ url: '/wms/allocated-line/updateLine', data })
}

// 根据调拨单自动创建领料单
export const createIssue = async (id: number) => {
    return await request.get({ url: `/wms/allocated-header/createIssue?id=${id}` })
} 