import request from '@/config/axios'

export interface ItemTypeVO {
    id: number
    itemTypeCode: string
    itemTypeName: string
    parentId: number
    ancestors: string
    itemTypeDesc: string
    status: string
    remark: string
    createTime: string
    updateTime: string
}

export interface QueryParams {
    pageNo: number
    pageSize: number
    itemTypeCode?: string
    itemTypeName?: string
    parentId?: number
    status?: string
}

// 查询物料类型列表
export const listItemType = async (params: QueryParams) => {
    return await request.get({ url: '/mes/md-item-type/page', params })
}

// 查询物料类型树形列表
export const treeItemType = async (params: QueryParams) => {
    return await request.get({ url: '/mes/md-item-type/list-all', params })
}

// 查询物料类型列表（排除节点）
export const listItemTypeExcludeChild = async (itemTypeId: number) => {
    return await request.get({ url: `/mes/md-item-type/list/exclude/${itemTypeId}` })
}

// 查询物料类型详细
export const getItemType = async (itemTypeId: number) => {
    return await request.get({ url: `/mes/md-item-type/get?id=${itemTypeId}` })
}

// 查询物料类型下拉树结构
export const treeselect = async () => {
    return await request.get({ url: '/mes/md-item-type/treeselect' })
}

// 新增物料类型
export const addItemType = async (data: ItemTypeVO) => {
    return await request.post({ url: '/mes/md-item-type/create', data })
}

// 修改物料类型
export const updateItemType = async (data: ItemTypeVO) => {
    return await request.put({ url: '/mes/md-item-type/update', data })
}

// 删除物料类型
export const delItemType = async (itemTypeId: number) => {
    return await request.delete({ url: `/mes/md-item-type/delete?id=${itemTypeId}` })
} 