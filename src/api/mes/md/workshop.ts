import request from '@/config/axios'

export interface WorkshopVO {
    id: number
    workshopCode: string
    workshopName: string
    workshopAddress: string
    status: string
    remark: string
    createTime: string
    updateTime: string
}

export interface QueryParams {
    pageNo: number
    pageSize: number
    workshopCode?: string
    workshopName?: string
    status?: string
}

// 查询车间列表
export const listWorkshop = async (params: QueryParams) => {
    return await request.get({ url: '/mes/md-workshop/page', params })
}

// 查询所有车间
export const listAllWorkshop = async () => {
    return await request.get({ url: '/mes/md-workshop/list-all-simple' })
}

// 查询车间详细
export const getWorkshop = async (workshopId: number) => {
    return await request.get({ url: `/mes/md-workshop/get?id=${workshopId}` })
}

// 新增车间
export const addWorkshop = async (data: WorkshopVO) => {
    return await request.post({ url: '/mes/md-workshop/create', data })
}

// 修改车间
export const updateWorkshop = async (data: WorkshopVO) => {
    return await request.put({ url: '/mes/md-workshop/update', data })
}

// 删除车间
export const delWorkshop = async (workshopId: number) => {
    return await request.delete({ url: `/mes/md-workshop/delete?id=${workshopId}` })
} 