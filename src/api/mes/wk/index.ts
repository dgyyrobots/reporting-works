import request from '@/config/axios'

export interface WorkcenterVo {
    action?: string
}

// 获取设备工作站
export const getWorkcenterList = async (data: any) => {
    return await request.post({
        url: '/mes/ajax/mes_bs_workcenter',
        data,
    })
}
// 获取工作站下的设备列表
export const getWorkcenterDeviceList = async (data: any) => {
    return await request.postOriginal({
        url: '/erp/ajax/get_obj_view_list/view_type:32/view_key:hygmqurg/object_key:base_mes_device/root_view_key:hygmqurg',
        data,
    })
}
// 获取工作站下的加工内容
export const getWorkcenterProcessList = async (data: any) => {
    return await request.post({
        url: '/mes/ajax/mes_jobbill/action:get_workcenter_wp_count',
        data,
    })
}

//  获取当前的上工人员信息

export const getCurrentWorker = async (data: any) => {
    return await request.post({
        url: '/mes/ajax/mes_jobbill/action:get_worktime_wc_data',
        data,
    })
}