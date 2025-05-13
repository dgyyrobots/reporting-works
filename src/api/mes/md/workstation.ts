import request from '@/config/axios'

export interface WorkstationVO {
    id: number
    workstationCode: string
    workstationName: string
    workstationAddress: string
    workshopId: number
    workshopCode: string
    workshopName: string
    processId: number
    processCode: string
    processName: string
    status: string
    remark: string
    createTime: string
    updateTime: string
}

export interface QueryParams {
    pageNo: number
    pageSize: number
    workstationCode?: string
    workstationName?: string
    workshopId?: number
    processId?: number
    status?: string
}

// 查询工作站列表
export const listWorkstation = async (params: QueryParams) => {
    return await request.get({ url: '/mes/md-workstation/page', params })
}

// 查询工作站详细
export const getWorkstation = async (workstationId: number) => {
    return await request.get({ url: `/mes/md-workstation/get?id=${workstationId}` })
}

// 新增工作站
export const addWorkstation = async (data: WorkstationVO) => {
    return await request.post({ url: '/mes/md-workstation/create', data })
}

// 修改工作站
export const updateWorkstation = async (data: WorkstationVO) => {
    return await request.put({ url: '/mes/md-workstation/update', data })
}

// 删除工作站
export const delWorkstation = async (workstationId: number) => {
    return await request.delete({ url: `/mes/md-workstation/delete?id=${workstationId}` })
} 