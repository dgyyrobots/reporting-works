import request from '/@/config/axios/index.ts'

export interface FeedbackVO {
  id: number
  feedbackType: string
  feedbackCode: string
  workstationCode: string
  workstationName: string
  workorderCode: string
  workorderName: string
  processCode: string
  processName: string
  taskCode: string
  itemCode: string
  itemName: string
  unitOfMeasure: string
  specification: string
  quantity: number
  quantityFeedback: number
  quantityQualified: number
  quantityUnquanlified: number
  userName: string
  nickName: string
  feedbackChannel: string
  feedbackTime: Date
  recordUser: string
  recordNick: string
  status: string
  remark: string
  attr1: string
  attr2: string
  attr3: number
  attr4: number
  reportFee: number
  payFee: number
}

// 查询生产任务分页
export const getTaskPage = async (params: any) => {
    //return await request.get({ url: `/protask/pro-task/page`, params })
  return await request.get({ url: `/mes/pro/task/page`, params })
}

// 查询生产任务详情
export const getTask = async (id: number) => {
    //return await request.get({ url: `/protask/pro-task/get?id=` + id })
  return await request.get({ url: `/mes/pro/task/get?id=` + id })
}
// 修改生产任务状态
export const updateTask = async (data:any) => {
    //return await request.put({ url: `protask/pro-task/change`, data })
  return await request.put({ url: `/mes/pro/task/change`, data })
}

  // 新增生产报工记录
export const createFeedback = async (data: FeedbackVO) => {
    return await request.post({ url: `/mes/pro/feedback/create`, data })
}

// 获得产品BOM分页
export const getMdProductBomPage = async (params) => {
  //return await request.get({ url: `/md/com-com-md-item/product-bom/page`, params })
  return await request.get({ url: `/mes/md-product-bom/page`, params })
}

// 获得产品SOP分页
export const getMdProductSopPage = async (params) => {
  //return await request.get({ url: `/md/com-com-md-item/product-sop/page`, params })
  return await request.get({ url: `/mes/md-product-sop/page`, params })
}

// 查询生产领料单头分页
export const getIssueHeaderPage = async (params) => {
  return await request.get({ url: `/wms/issue-header/page`, params })
}
// 获得生产领料单行分页
export const getIssueLinePage = async (params) => {
  return await request.get({ url: `/wms/issue-header/issue-line/page`, params })
}
// 查询生产报工记录分页
export const getFeedbackPage = async (params) => {
  return await request.get({ url: `/mes/pro/feedback/page`, params })
}

// 查询过程检验分页
export const getIpqcPage = async (params) => {
  return await request.get({ url: `/ipqc/page`, params })
}
// 获得过程检验单行分页
export const getLinePage = async (params) => {
  return await request.get({ url: `/ipqc/line/page`, params })
}
// 查询产品产出记录分页
export const getProductProducePage = async (params) => {
  return await request.get({ url: `/wms/product-produce/page`, params })
}
// 获得产品产出记录表行分页
export const getProductProduceLinePage = async (params) => {
  return await request.get({ url: `/wms/product-produce/product-produce-line/page`, params })
}
// 查询生产工单详情
export const getWorkorder = async (id: number) => {
  //return await request.get({ url: `/proworkorder/workorder/get?id=` + id })
  return await request.get({ url: `/mes/pro/workorder/get?id=` + id })
}
