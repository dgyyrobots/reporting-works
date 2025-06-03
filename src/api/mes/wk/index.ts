import request from '@/config/axios'

// 获取登录信息中的 stored_company
const getStoredCompany = () => {
    try {
        const loginInfo = localStorage.getItem('loginInfo')
        if (loginInfo) {
            const parsedInfo = JSON.parse(loginInfo)
            return parsedInfo.stored_company || '102869' // 默认值作为后备
        }
    } catch (error) {
        console.error('获取 stored_company 失败:', error)
    }
    return '102869' // 默认值
}

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
    const companyId = getStoredCompany()
    return await request.postOriginal({
        url: `/erp/ajax/get_obj_view_list/view_type:32/view_key:hygmqurg/object_key:base_mes_device/root_view_key:hygmqurg/context_company_id:${companyId}`,
        data,
    })
}

// 获取工作站下的加工内容 /工序
export const getWpCountData = async (data: any) => {
    return await request.post({
        url: '/mes/ajax/mes_jobbill/action:get_workcenter_wp_count',
        data,
    })
}

// 获取当前的上工人员信息
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
    const companyId = getStoredCompany()
    return await request.postOriginal({
        url: `/erp/ajax/get_obj_view_list/context_company_id:${companyId}/view_type:32/view_key:yxpciuyh/object_key:bill_mes_rc_wpentry/root_view_key:yxpciuyh`,
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

// 获取工单实际开工时间和生产数量
export const getJobBillTimeAndNumber = async (data: any) => {
    const companyId = getStoredCompany()
    return await request.postOriginal({
        url: `/erp/ajax/get_obj_view_list/context_company_id:${companyId}/view_type:32/view_key:zlwumhtk/object_key:bill_mes_rc_wpentry/root_view_key:zlwumhtk`,
        data,
    })
}

// 获取工单类型和计划开工时间
export const getJobBillTypeAndStartTime = async (data: any) => {
    const companyId = getStoredCompany()
    return await request.postOriginal({
        url: `/erp/ajax/get_obj_view_list/context_company_id:${companyId}/view_type:32/view_key:jbkbxpwi/object_key:bill_mes_work/root_view_key:jbkbxpwi`,
        data,
    })
}

// 获取实时生产产量
export const getCollectionQty = async (data: any) => {
    return await request.postOriginal({
        url: '/mes/ajax/mes_version_number_manage/action:get_collection_qty',
        data,
    })
}

// 获取当日设备计时列表-左下角设备计时
export const getDeviceRuntimeADay = async (data: any) => {
    const companyId = getStoredCompany()
    return await request.postOriginal({
        url: `/erp/ajax/get_obj_view_list/context_company_id:${companyId}/view_type:32/view_key:xfdxxdaa/object_key:bill_mes_device_collect_record_by_Manual/root_view_key:xfdxxdaa`,
        data,
    })
}

// 获取正在生产的版号列表
export const getPlateListData = async (data: any) => {
    const companyId = getStoredCompany()
    return await request.postOriginal({
        url: `/test/erp/ajax/get_obj_view_list/context_company_id:${companyId}/view_type:32/view_key:wcpvbyqq/object_key:bill_mes_version_number_manage/root_view_key:wcpvbyqq`,
        data,
    })
}

// 获取设备运行速度
export const getDeviceRunSpeedData = async (data: any) => {
    return await request.postOriginal({
        url: '/mes/ajax/mes_equipment_collect/action:device_collect_html',
        data,
    })
}

// 以下是从 version.ts 添加的接口

// 扫码上板
export const updateIsStart = async (data: any) => {
    return await request.postOriginal({
        url: '/mes/ajax/mes_version_number_manage/action:update_is_start',
        data,
    })
}

// 添加版号
export const updateVersionNumberManageEntryData = async (data: any) => {
    return await request.postOriginal({
        url: '/mes/ajax/mes_version_number_manage/action:update_version_number_manage_entry_data',
        data,
    })
}

// 员工切板
export const changeActiveRow = async (data: any) => {
    return await request.postOriginal({
        url: '/mes/ajax/mes_version_number_manage/action:change_active_row',
        data,
    })
}

// 员工结束采集
export const collectionFinish = async (data: any) => {
    return await request.postOriginal({
        url: '/mes/ajax/mes_version_number_manage/action:collection_finish',
        data,
    })
}

// 员工查询已经汇报的版号信息接口
// export const getReportedVersionInfo = async (data: any) => {
//     return await request.postOriginal({
//         url: '/erp/ajax/erp_view_api/view_key:skjsiwuz/data_id:294098',
//         data,
//     })
// }

// 员工汇报接口
export const reportVersion = async (data: any) => {
    return await request.postOriginal({
        url: '/mes/ajax/mes_version_number_manage/action:report',
        data,
    })
}
// 员工完工汇报接口
export const finishReportVersion = async (data: any) => {
    return await request.postOriginal({
        url: '/mes/ajax/mes_version_number_manage/action:finish_report',
        data,
    })
}



// 员工删除汇报接口
export const deleteJobbillReport = async (data: any) => {
    return await request.postOriginal({
        url: '/mes/ajax/mes_scheduling/action:delete_jobbill_report',
        data,
    })
}
//  解绑工单
export const getCleanDeviceBillData = async (data: any) => {
    return await request.postOriginal({
        url: '/mes/ajax/mes_version_number_manage/action:clean_device_jobbill',
        data,
    })
}
// 开工工单
export const getChangeDeviceBillData = async (data: any) => {
    return await request.postOriginal({
        url: '/mes/ajax/mes_jobbill/action:change_jobbill_status',
        data,
    })
}
// 扫码上版
export const addVersionByCode = async (data: any) => {
    return await request.postOriginal({
        url: '/mes/ajax/mes_version_number_manage/action:report',
        data,
    })
}
