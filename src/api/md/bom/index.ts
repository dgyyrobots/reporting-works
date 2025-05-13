import request from '@/config/axios'
export interface BomVO {
    id: number
    productId: number
    productCode: string
    productName: string
    componentId: number
    componentCode: string
    componentName: string
    quantity: number
    unitOfMeasure: string
    remark: string
    createTime: string
    updateTime: string
}

export interface QueryParams {
    pageNo: number
    pageSize: number
    productCode?: string
    productName?: string
    componentCode?: string
    componentName?: string
}

// 查询产品BOM关系列表
export const listBom = async (params: QueryParams) => {
    return await request.get({ url: '/mes/md-product-bom/page', params })
}

// 查询产品BOM关系详细
export const getBom = async (bomId: number) => {
    return await request.get({ url: `/mes/md-product-bom/get?id=${bomId}` })
}

// 新增产品BOM关系
export const addBom = async (data: BomVO) => {
    return await request.post({ url: '/mes/md-product-bom/create', data })
}

// 修改产品BOM关系
export const updateBom = async (data: BomVO) => {
    return await request.put({ url: '/mes/md-product-bom/update', data })
}

// 删除产品BOM关系
export const delBom = async (bomId: number) => {
    return await request.delete({ url: `/mes/md-product-bom/delete?id=${bomId}` })
} 