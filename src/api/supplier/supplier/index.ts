import request from '@/config/axios'

export interface VO {
  id: number
  supplierName: string
  supplierNo: string
  supplierShort: string
  logo: string
  desc: string
  keywords: string
  supplierAddress: string
  supplierEmail: string
  supplierPhone: string
  supplierQq: string
  supplierWeixin: string
  account: number
  accountWithdraw: number
  accountWithdrawApply: number
  username: string
  settlementBankAccountName: string
  settlementBankAccountNumber: string
  settlementBankName: string
  settlementBankAddress: string
  groupId: number
  groupName: string
  status: number
  categoryId: number
  categoryName: string
  expireTime: number
  certId: number
  openFee: number
  supplyDesccredit: number
  supplyServicecredit: number
  supplyDeliverycredit: number
  bond: number
  supplierContact: string
  province: number
  provinceName: string
  city: number
  cityName: string
  district: number
  districtName: string
  community: number
  communityName: string
  address: string
  fullAddress: string
  endTime: number
  longitude: string
  latitude: string
}

// 查询账户档案分页
export const getPage = async (params) => {
  //return await request.get({ url: `/supplier/page`, params })
  return await request.get({ url: `/mes/md-vendor/page`, params })
}

// 查询账户档案详情
export const get = async (id: number) => {
  //return await request.get({ url: `/supplier/get?id=` + id })
  return await request.get({ url: `/mes/md-vendor/get?id=` + id })
}

// 新增账户档案
export const create = async (data: VO) => {
  //return await request.post({ url: `/supplier/create`, data })
  return await request.post({ url: `/mes/md-vendor/create`, data })
}

// 修改账户档案
export const update = async (data: VO) => {
  //return await request.put({ url: `/supplier/update`, data })
  return await request.put({ url: `/mes/md-vendor/update`, data })
}

// 删除账户档案
export const accountdelete = async (id: number) => {
  //return await request.delete({ url: `/supplier/delete?id=` + id })
  return await request.delete({ url: `/mes/md-vendor/delete?id=` + id })
}

// 导出账户档案 Excel
export const accountexport = async (params) => {
  //return await request.download({ url: `/supplier/export-excel`, params })
  return await request.download({ url: `/mes/md-vendor/export-excel`, params })
}
