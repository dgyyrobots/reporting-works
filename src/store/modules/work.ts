/* eslint-disable prettier/prettier */
import { defineStore } from 'pinia'

export interface TaskInfoType {
    rc_no: string
    rc_id: string
    wc_id: string
    order_no: string
    billNo: string
    wpName: string
    skuName: string
    skuNo: string
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

export const useWorkStore = defineStore('work', {
    state: (): { taskInfo: TaskInfoType } => ({
        taskInfo: {
            rc_no: '',
            rc_id: '',
            wc_id: '',
            order_no: '',
            billNo: '',
            wpName: '',
            skuName: '',
            skuNo: '',
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
        },
        resetTaskInfo() {
            this.taskInfo = {
                rc_no: '',
                rc_id: '',
                wc_id: '',
                order_no: '',
                billNo: '',
                wpName: '',
                skuName: '',
                skuNo: '',
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
        },
    },
})
