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

// 获取设备计时的原因
export const getRunningBanciDevice = async (data: any) => {
    return await request.post({
        url: '/mes/ajax/mes_data_html_json/action:get_running_banci_device',
        data,
    })
}

// 设备计时的工单
export const getRunningBanCiWorkOrder = async (data: any) => {
    return await request.postOriginal({
        url: '/erp/ajax/get_obj_view_list/context_company_id:102869/view_type:32/view_key:yxpciuyh/object_key:bill_mes_rc_wpentry/root_view_key:yxpciuyh',
        data,
    })
}
// 设备记时开始 结束
export const getDeviceStartData = async (data: any) => {
    return await request.postOriginal({
        url: '/mes/ajax/mes_data_html_json/action:save_device_start_data',
        data,
    })
}
