/* eslint-disable prettier/prettier */
import { defineStore } from 'pinia'
import { useCache } from '@/hooks/web/useCache'

export interface TaskInfoType {
    rc_no: string
    rc_id: string
    wc_id: string
    order_no: string
    bill_no: string
    wp_name: string
    sku_name: string
    sku_no: string
    plan_start_time: string
    plan_end_time: string
    act_start_time: string
    act_end_time: string
    uqty: number
    exe_uqty: number
    unit: string
    overTime: string
    remainQty: number
    ud_102869_gdlx: string
    prodesc: string
}

// 定义缓存 key，如 TASK_INFO。
// 在 setTaskInfo 时写入缓存，在 resetTaskInfo 时清除缓存。
// 初始化 state 时尝试从缓存读取。



// 定义版号选择项接口
export interface LicenseCheckItem {
    id: string | number
    version_no: string
    selected: boolean
    [key: string]: any
}
// 定义员工信息接口
export interface StaffInfoItem {
    emp_name: string
    emp_number: string
    status_name: string
    classtype_name: string
    [key: string]: any
}
const TASK_INFO_KEY = 'TASK_INFO'
const { wsCache } = useCache('localStorage')

export const useWorkStore = defineStore('work', {
    state: (): {
        taskInfo: TaskInfoType,
        fleshTaskIndex: number,
        fleshLicenseIndex: number, // 新增fleshLicenseIndex状态
        licenseCheck: LicenseCheckItem[], // 所有版号数据
        licenseCheckSortByCollectDate: LicenseCheckItem[], // 这个数组存的是按collect_date排序后的数据
        selectedLicenseCheck: LicenseCheckItem[] // 新增：存储选中的版号数据
        staffList: StaffInfoItem[] // 新
    } => ({
        taskInfo: wsCache.get(TASK_INFO_KEY) || {
            rc_no: '',
            rc_id: '',
            wc_id: '',
            order_no: '',
            bill_no: '',
            wp_name: '',
            sku_name: '',
            sku_no: '',
            plan_start_time: '',
            plan_end_time: '',
            act_start_time: '',
            act_end_time: '',
            uqty: 0,
            exe_uqty: 0,
            unit: '',
            overTime: '',
            remainQty: 0,
            ud_102869_gdlx: '',
            prodesc: '',
        },
        fleshTaskIndex: 0, // 默认值为0，不从缓存读取 // 刷新任务单
        fleshLicenseIndex: 0, // 默认值为0，不从缓存读取 // 刷新版本
        licenseCheck: [], // 不需要缓存，初始为空数组
        licenseCheckSortByCollectDate: [], // 这个数组存的是按collect_date排序后的数据, 不需要缓存，初始为空数组
        selectedLicenseCheck: [], // 新增：存储选中的版号数据，初始为空数组
        staffList: [] // 初始化为空数组
    }),
    getters: {
        getTaskInfo: (state) => state.taskInfo,
        getFleshTaskIndex: (state) => state.fleshTaskIndex,
        getFleshLicenseIndex: (state) => state.fleshLicenseIndex, // 新增getter
        getLicenseCheck: (state) => state.licenseCheck, // 新增getter
        getSelectedLicenseCheck: (state) => state.selectedLicenseCheck, // 新增：获取选中的版号数据
        getStaffList: (state) => state.staffList // 新增：获取员工列表
    },
    actions: {
        setTaskInfo(info: Partial<TaskInfoType>) {
            this.taskInfo = { ...this.taskInfo, ...info }
            wsCache.set(TASK_INFO_KEY, this.taskInfo)
        },
        setStaffList(staffList: StaffInfoItem[]) {
            this.staffList = staffList
        },
        // 清空 taskInfo 并删除缓存
        resetTaskInfo() {
            this.taskInfo = {
                rc_no: '',
                rc_id: '',
                wc_id: '',
                order_no: '',
                bill_no: '',
                wp_name: '',
                sku_name: '',
                sku_no: '',
                plan_start_time: '',
                plan_end_time: '',
                act_start_time: '',
                act_end_time: '',
                uqty: 0,
                exe_uqty: 0,
                unit: '',
                overTime: '',
                remainQty: 0,
                ud_102869_gdlx: '',
                prodesc: '',
            }
            wsCache.delete(TASK_INFO_KEY)
        },
        // 更新 fleshTaskIndex
        updateTaskFleshIndex() {
            this.fleshTaskIndex += 1
        },

        // 更新 fleshLicenseIndex
        updateLicenseFleshIndex() {
            this.fleshLicenseIndex += 1
        },
        // 重置 fleshTaskIndex
        resetTaskFleshIndex() {
            this.fleshTaskIndex = 0
        },
        // 重置 fleshLicenseIndex
        resetLicenseFleshIndex() {
            this.fleshLicenseIndex = 0
        },

        // 设置版号选择项
        setLicenseCheck(items: LicenseCheckItem[]) {
            this.licenseCheck = items
            // 对数据按照collect_date进行排序后再赋值
            this.sortLicenseCheckByCollectDate(items)
            // 更新选中的版号数据
            this.updateSelectedLicenseCheck()
        },

        // 新增：根据collect_date对数组进行排序
        sortLicenseCheckByCollectDate(items: LicenseCheckItem[]) {
            // 创建一个新数组，避免直接修改原数组
            const sortedItems = [...items]

            // 根据collect_date进行排序，距离当前时间最近的排在前面
            sortedItems.sort((a, b) => {
                const dateA = a.collect_date ? new Date(parseInt(a.collect_date) * 1000).getTime() : 0
                const dateB = b.collect_date ? new Date(parseInt(b.collect_date) * 1000).getTime() : 0

                // 如果日期不存在，则排在后面
                if (!dateA && dateB) return 1
                if (dateA && !dateB) return -1
                if (!dateA && !dateB) return 0

                // 距离当前时间最近的排在前面（降序排列）
                return dateB - dateA
            })

            // 将排序后的数组赋值给licenseCheckSortByCollectDate
            this.licenseCheckSortByCollectDate = sortedItems
        },

        // 更新单个版号选择状态
        updateLicenseCheckItem(id: string | number, selected: boolean) {
            const item = this.licenseCheck.find(item => item.id === id)
            if (item) {
                item.selected = selected
                // 更新选中的版号数据
                this.updateSelectedLicenseCheck()
            }
        },

        // 更新所有版号选择状态
        updateAllLicenseCheck(selected: boolean) {
            this.licenseCheck.forEach(item => {
                item.selected = selected
            })
            // 更新选中的版号数据
            this.updateSelectedLicenseCheck()
        },

        // 清空版号选择项
        clearLicenseCheck() {
            this.licenseCheck = []
            this.selectedLicenseCheck = [] // 同时清空选中数据
        },

        // 新增：更新选中的版号数据
        updateSelectedLicenseCheck() {
            this.selectedLicenseCheck = this.licenseCheck.filter(item => item.selected)
        },

        // 新增：直接设置选中的版号数据
        setSelectedLicenseCheck(items: LicenseCheckItem[]) {
            this.selectedLicenseCheck = items
        },

        // 新增：清空选中的版号数据
        clearSelectedLicenseCheck() {
            this.selectedLicenseCheck = []
            // 同时更新licenseCheck中的选中状态
            this.licenseCheck.forEach(item => {
                item.selected = false
            })
        }
    },
})
