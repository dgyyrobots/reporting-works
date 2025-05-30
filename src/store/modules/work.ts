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



const TASK_INFO_KEY = 'TASK_INFO'
const { wsCache } = useCache('localStorage')

export const useWorkStore = defineStore('work', {
    state: (): { taskInfo: TaskInfoType } => ({
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
    }),
    getters: {
        getTaskInfo: (state) => state.taskInfo,
    },
    actions: {
        setTaskInfo(info: Partial<TaskInfoType>) {
            this.taskInfo = { ...this.taskInfo, ...info }
            wsCache.set(TASK_INFO_KEY, this.taskInfo)
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
    },
})
