import request from '/@/config/axios/index.ts'

// 定义接口类型
export interface OrderVO {
    id?: number
    orderNo?: string
    supplierId?: number
    supplierName?: string
    orderType?: number
    orderStatus?: number
    totalAmount?: number
    taxAmount?: number
    remark?: string
    createTime?: string
    updateTime?: string
    createBy?: string
    updateBy?: string
}

export interface OrderPageReqVO extends PageParam {
    orderNo?: string
    supplierId?: number
    supplierName?: string
    orderType?: number
    orderStatus?: number
    createTime?: string[]
}

// 创建采购订单
export const createOrder = (data: OrderVO) => {
    return request.post({ url: '/purchase/order/create', data })
}

// 更新采购订单
export const updateOrder = (data: OrderVO) => {
    return request.put({ url: '/purchase/order/update', data })
}

// 删除采购订单
export const deleteOrder = (id: number) => {
    return request.delete({ url: `/purchase/order/delete?id=${id}` })
}

// 获得采购订单
export const getOrder = (id: number) => {
    return request.get({ url: `/purchase/order/get?id=${id}` })
}

// 获得采购订单分页
export const getOrderPage = (params: OrderPageReqVO) => {
    return request.get({ url: '/purchase/order/page', params })
}

// 导出采购订单 Excel
export const exportOrderExcel = (params: OrderPageReqVO) => {
    return request.download({
        url: '/purchase/order/export-excel',
        params,
        responseType: 'blob'
    })
}