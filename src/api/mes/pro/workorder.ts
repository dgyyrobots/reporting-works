import request from '@/config/axios'

export interface WorkorderVO {
    id: number
    workorderCode: string
    workorderName: string
    orderSource: string
    sourceCode: string
    productId: number
    productCode: string
    productName: string
    productSpc: string
    unitOfMeasure: string
    quantity: number
    quantityProduced: number
    quantityChanged: number
    quantityScheduled: number
    clientId: number
    clientCode: string
    clientName: string
    requestDate: string
    parentId: number
    ancestors: string
    status: string
    remark: string
    createTime: string
    updateTime: string
}

export interface QueryParams {
    pageNo: number
    pageSize: number
    workorderCode?: string
    workorderName?: string
    orderSource?: string
    sourceCode?: string
    productId?: number
    productCode?: string
    productName?: string
    productSpc?: string
    unitOfMeasure?: string
    quantity?: number
    quantityProduced?: number
    quantityChanged?: number
    quantityScheduled?: number
    clientId?: number
    clientCode?: string
    clientName?: string
    requestDate?: string
    parentId?: number
    ancestors?: string
    status?: string
}

// 查询生产工单列表
export const listWorkorder = async (params: QueryParams) => {
    return await request.get({ url: '/mes/pro/workorder/page', params })
}

// 查询所有生产工单
export const getWorkorderList = async (params: QueryParams) => {
    return await request.get({ url: '/mes/pro/workorder/list-all', params })
}

// 查询生产工单详细
export const getWorkorder = async (workorderId: number) => {
    return await request.get({ url: `/mes/pro/workorder/get?id=${workorderId}` })
}

// 新增生产工单
export const addWorkorder = async (data: WorkorderVO) => {
    return await request.post({ url: '/mes/pro/workorder/create', data })
}

// 修改生产工单
export const updateWorkorder = async (data: WorkorderVO) => {
    return await request.put({ url: '/mes/pro/workorder/update', data })
}

// 删除生产工单
export const delWorkorder = async (workorderId: number) => {
    return await request.delete({ url: `/mes/pro/workorder/delete?id=${workorderId}` })
}

// 查询物料依赖列表
export const listItems = async (params: QueryParams) => {
    return await request.get({ url: '/mes/md-item/get-item-request', params })
}

// 获得销售的物料明细分页
export const mixinItems = async (params: QueryParams) => {
    return await request.get({ url: '/trade/mixin-order-item/page', params })
}

// 修改工单附件信息
export const updateWorkorderAdjuncts = async (data: any) => {
    return await request.put({ url: '/mes/pro/workorder/updateAdjuncts', data })
} 