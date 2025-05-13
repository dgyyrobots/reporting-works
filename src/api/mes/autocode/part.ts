import request from '@/config/axios'

export interface PartVO {
    id?: number
    ruleId?: number
    partType?: string
    partValue?: string
    partLength?: number
    orderNum?: number
    status?: string
    remark?: string
    createTime?: string
    updateTime?: string
}

export interface QueryParams {
    pageNo?: number
    pageSize?: number
    ruleId?: number
    partType?: string
    status?: string
}

// 查询规则组成
export const listPart = async (query: QueryParams) => {
    return await request.get({
        url: '/mes/auto-code-part/list',
        params: query
    })
}

// 查询规则组成详细
export const getPart = async (partId: number) => {
    return await request.get({
        url: `/mes/auto-code-part/${partId}`
    })
}

// 新增规则组成
export const addPart = async (data: PartVO) => {
    return await request.post({
        url: '/mes/auto-code-part',
        data
    })
}

// 修改规则组成
export const updatePart = async (data: PartVO) => {
    return await request.put({
        url: '/mes/auto-code-part',
        data
    })
}

// 删除规则组成
export const delPart = async (partIds: string) => {
    return await request.delete({
        url: `/mes/auto-code-part/${partIds}`
    })
}