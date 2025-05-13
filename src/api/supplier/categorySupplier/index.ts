import request from '@/config/axios'

export interface CategorySupplierVO {
  id: number
  categoryName: string
  baozhengMoney: number
  sort: number
  status: string
  processInstanceId: string
}

// 查询行业分类分页
export const getCategorySupplierPage = async (params) => {
  return await request.get({ url: `/supplier/category-supplier/page`, params })
}

// 查询行业分类详情
export const getCategorySupplier = async (id: number) => {
  return await request.get({ url: `/supplier/category-supplier/get?id=` + id })
}

// 新增行业分类
export const createCategorySupplier = async (data: CategorySupplierVO) => {
  return await request.post({ url: `/supplier/category-supplier/create`, data })
}

// 修改行业分类
export const updateCategorySupplier = async (data: CategorySupplierVO) => {
  return await request.put({ url: `/supplier/category-supplier/update`, data })
}

// 删除行业分类
export const deleteCategorySupplier = async (id: number) => {
  return await request.delete({ url: `/supplier/category-supplier/delete?id=` + id })
}

// 导出行业分类 Excel
export const exportCategorySupplier = async (params) => {
  return await request.download({ url: `/supplier/category-supplier/export-excel`, params })
}