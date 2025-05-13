import request from '@/config/axios'

export interface ProtaskVO {
    id: number
    taskCode: string
    taskName: string
    workorderId: number
    workorderCode: string
    workorderName: string
    processId: number
    processCode: string
    processName: string
    teamId: number
    teamCode: string
    teamName: string
    quantity: number
    quantityProduced: number
    quantityChanged: number
    startDate: string
    endDate: string
    status: string
    remark: string
    createTime: string
    updateTime: string
}

export interface QueryParams {
    pageNo: number
    pageSize: number
    taskCode?: string
    taskName?: string
    workorderCode?: string
    workorderName?: string
    processCode?: string
    processName?: string
    teamCode?: string
    teamName?: string
    status?: string
    startDate?: string
    endDate?: string
}

// 查询生产任务列表
export const listProtask = async (params: QueryParams) => {
    return await request.get({ url: '/mes/pro/task/page', params })
}

// 根据订单编码查询生产任务列表
export const listProtasks = async (params: QueryParams) => {
    return await request.get({ url: '/mes/pro/task/pageBySourceCode', params })
}

// 查询我的生产任务列表
export const getTaskPage = async (params: QueryParams) => {
    return await request.get({ url: '/mes/pro/task/get-my-task-page', params })
}

// 查询生产任务列表
export const listGanttTaskList = async (params: QueryParams) => {
    return await request.get({ url: '/mes/pro/task/listGanttTaskList', params })
}

// 查询生产任务详细
export const getProtask = async (taskId: number) => {
    return await request.get({ url: `/mes/pro/task/get?id=${taskId}` })
}

// 新增生产任务
export const addProtask = async (data: ProtaskVO) => {
    return await request.post({ url: '/mes/pro/task/create', data })
}

// 修改生产任务
export const updateProtask = async (data: ProtaskVO) => {
    return await request.put({ url: '/mes/pro/task/change', data })
}

// 删除生产任务
export const delProtask = async (taskId: number) => {
    return await request.delete({ url: `/mes/pro/task/delete?id=${taskId}` })
}

// 一键报工创建报工记录
export const create = async (data: any) => {
    return await request.post({ url: '/mes/pro/feedback/one-click-feedback-create', data })
}

// 一键报工
export const create2 = async (data: any) => {
    return await request.put({ url: '/mes/pro/feedback/one-click-create', data })
}

// 修改
export const updateTasks = async (data: ProtaskVO) => {
    return await request.put({ url: '/mes/pro/task/update', data })
}

// 打印状态修改
export const updateTasksPrint = async (data: { id: number } & Partial<ProtaskVO>) => {
    return await request.put({ url: `/mes/pro/task/update/${data.id}`, data })
}

// 排产
export const updateTeamById = async (data: { id: number; teamId: number }) => {
    return await request.put({ url: '/mes/pro/task/updateTeamById', data })
}