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
// 获取工单内容
export const getJobBillContent = async (data: any) => {
    return await request.postOriginal({
        url: '/erp/ajax/get_obj_view_list/view_type:32/view_key:hxzojdqt/object_key:bill_mes_rc_jobbill',
        data,
    })
}
// 2.获取工单实际开工时间和生产数量
export const getJobBillTimeAndNumber = async (data: any) => {
    return await request.postOriginal({
        url: '/erp/ajax/get_obj_view_list/context_company_id:102869/view_type:32/view_key:zlwumhtk/object_key:bill_mes_rc_wpentry/root_view_key:zlwumhtk',
        data,
    })
}

// 3.获取工单类型和计划开工时间
export const getJobBillTypeAndStartTime = async (data: any) => {
    return await request.postOriginal({
        url: '/erp/ajax/get_obj_view_list/context_company_id:102869/view_type:32/view_key:jbkbxpwi/object_key:bill_mes_work/root_view_key:jbkbxpwi',
        data,
    })
}