import request from '@/config/axios'

export interface ProcessVO {
    id: number
    processCode: string
    processName: string
    processType: string
    processDesc: string
    status: string
    remark: string
    createTime: string
    updateTime: string
}

export interface QueryParams {
    pageNo: number
    pageSize: number
    processCode?: string
    processName?: string
    processType?: string
    status?: string
}

// 查询生产工序列表
export const listProcess = async (params: QueryParams) => {
    return await request.get({ url: '/mes/pro/cess/page', params })
}

// 查询所有有效生产工序
export const listAllProcess = async () => {
    return await request.get({ url: '/mes/pro/cess/list-all-simple' })
}

// 查询生产工序详细
export const getProcess = async (processId: number) => {
    return await request.get({ url: `/mes/pro/cess/get?id=${processId}` })
}

// 新增生产工序
export const addProcess = async (data: ProcessVO) => {
    return await request.post({ url: '/mes/pro/cess/create', data })
}

// 修改生产工序
export const updateProcess = async (data: ProcessVO) => {
    return await request.put({ url: '/mes/pro/cess/update', data })
}

// 删除生产工序
export const delProcess = async (processId: number) => {
    return await request.delete({ url: `/mes/pro/cess/delete?id=${processId}` })
}