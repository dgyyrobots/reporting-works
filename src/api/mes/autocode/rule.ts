import request from '@/config/axios'

export interface RuleVO {
    id?: number
    ruleCode?: string
    ruleName?: string
    ruleValue?: string
    maxLength?: number
    isPadded?: boolean
    paddedChar?: string
    paddedMethod?: string
    status?: string
    remark?: string
    createTime?: string
    updateTime?: string
}

export interface QueryParams {
    pageNo?: number
    pageSize?: number
    ruleCode?: string
    ruleName?: string
    status?: string
}

// 生成编码
export const genCode = async (ruleCode: string) => {
    return await request.get({
        url: `/mes/autocode/get/${ruleCode}`,
    })
}

// 查询规则列表
export const listRule = async (query: QueryParams) => {
    return await request.get({
        url: '/mes/auto-code-rule/list',
        params: query
    })
}

// 查询规则详细
export const getRule = async (ruleId: number) => {
    return await request.get({
        url: `/mes/auto-code-rule/${ruleId}`
    })
}

// 新增规则
export const addRule = async (data: RuleVO) => {
    return await request.post({
        url: '/mes/auto-code-rule',
        data
    })
}

// 修改规则
export const updateRule = async (data: RuleVO) => {
    return await request.put({
        url: '/mes/auto-code-rule',
        data
    })
}

// 删除规则
export const delRule = async (ruleId: number) => {
    return await request.delete({
        url: `/mes/auto-code-rule/${ruleId}`
    })
}