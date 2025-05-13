import request from '@/config/axios'

export interface WarehouseVO {
    id: number
    warehouseId: number
    warehouseCode: string
    warehouseName: string
    locationId?: number
    locationCode?: string
    locationName?: string
    areaId?: number
    areaCode?: string
    areaName?: string
    status?: string
    remark?: string
    createTime?: string
    updateTime?: string
    children?: WarehouseVO[]
    wId?: number
    pId?: number
    pName?: string
    lId?: number
}

export interface QueryParams {
    pageNo?: number
    pageSize?: number
    warehouseCode?: string
    warehouseName?: string
    locationCode?: string
    locationName?: string
    areaCode?: string
    areaName?: string
    status?: string
    ids?: number[]
}

// 查询仓库设置列表
export const listWarehouse = async (query: QueryParams) => {
    return await request.get({ 
        url: '/wms/warehouse/page', 
        params: { ids: [] } 
    })
}

// 查询仓库设置列表
export const getWarehouseList = async (query: QueryParams) => {
    return await request.get({ 
        url: '/wms/warehouse/list', 
        params: query 
    })
}

// 获取仓库树形结构
export const getTreeList = async () => {
    return await request.get({ 
        url: '/wms/warehouse/getTreeList' 
    }).then(res => {
        res.data = (res.data || []).map((level1: WarehouseVO) => {
            if (level1.children) {
                level1.children = level1.children.map((level2: WarehouseVO) => {
                    if (level2.children) {
                        level2.children = level2.children.map((level3: WarehouseVO) => {
                            return {
                                ...level3,
                                pId: level3.id,
                                pName: level3.areaName,
                                lId: level3.locationId,
                                areaId: level3.id,
                            }
                        })
                    }
                    return {
                        ...level2,
                        wId: level2.warehouseId,
                        pId: level2.id,
                        pName: level2.locationName,
                        locationId: level2.id,
                    }
                })
            }
            return {
                ...level1,
                wId: level1.id,
                pId: level1.id,
                pName: level1.warehouseName,
                warehouseId: level1.id,
            }
        })
        return res
    })
}

// 查询仓库设置详细
export const getWarehouse = async (warehouseId: number) => {
    return await request.get({ 
        url: `/wms/warehouse/get?id=${warehouseId}` 
    })
}

// 新增仓库设置
export const addWarehouse = async (data: WarehouseVO) => {
    return await request.post({ 
        url: '/wms/warehouse/create', 
        data 
    })
}

// 修改仓库设置
export const updateWarehouse = async (data: WarehouseVO) => {
    return await request.put({ 
        url: '/wms/warehouse/update', 
        data 
    })
}

// 删除仓库设置
export const delWarehouse = async (warehouseId: number) => {
    return await request.delete({ 
        url: `/wms/warehouse/delete?id=${warehouseId}` 
    })
}