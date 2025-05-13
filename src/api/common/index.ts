import request from '/@/config/axios'

export interface ExpressCompanyTemplateVO {
  companyId: number
  companyName: string
  logo: string
  url: string
  sort: number
  expressNo: string
  expressNoKd100: string
  expressNoCainiao: string
  contentJson: string
  backgroundImage: string
  fontSize: number
  width: number
  height: number
  scale: number
  isElectronicsheet: number
  printStyle: string
}

// 通过按钮获取编号。
export const getAutocode = async (code) => {
  return await request.request({ url: `/common/autocode/get/`+code,methods:'get' })
}


// 导出物流公司 Excel
export const exportExpressCompanyTemplate = async (params) => {
  return await request.download({ url: `/companyLogistics/express-company-template/export-excel`, params })
}
