<template>
    <!-- 列表 -->
    <ContentWrap>
        <el-table v-loading="loading" :data="list" :stripe="true" >
      <el-table-column label="检测项编码" align="center" prop="indexCode" />
      <el-table-column label="检测项名称" align="center" prop="indexName" />
      <el-table-column label="检测项类型" align="center" prop="indexType">
        <template #default="scope">
          <dict-tag :type="'mes_index_type'" :value="scope.row.indexType" />
        </template>
      </el-table-column>
      <el-table-column label="检测工具" align="center" prop="qcTool" />
      <el-table-column label="检测要求" align="center" prop="checkMethod" />
      <el-table-column label="标准值" align="center" prop="standerVal" />
      <el-table-column label="单位" align="center" prop="unitOfMeasure" />
      <el-table-column label="误差上限" align="center" prop="thresholdMax" />
      <el-table-column label="误差下限" align="center" prop="thresholdMin" />
      <el-table-column label="致命缺陷数量" align="center" prop="crQuantity" />
      <el-table-column label="严重缺陷数量" align="center" prop="majQuantity" />
      <el-table-column label="轻微缺陷数量" align="center" prop="minQuantity" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
    </el-table>
      <!-- 分页 -->
      <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
        @pagination="getList" />
    </ContentWrap>
  </template>
  <script setup lang="ts">
  import { DICT_TYPE, getDictLabel, getDictObj, getStrDictOptions } from '/@/utils/dict'
  import { dateFormatter } from '@/utils/formatTime'
  import * as ProductionApi from '/@/api/production/index'
  
  
  
  const props = defineProps<{
    taskCode: undefined // 领料单ID（主表的关联字段）
  }>()
  const loading = ref(false) // 列表的加载中
  const list = ref([]) // 列表的数据
  const total = ref(0) // 列表的总页数
  const queryParams = reactive({
    pageNo: 1,
    pageSize: 10,
    ipqcId: undefined
  })
  
  /** 监听主表的关联字段的变化，加载对应的子表数据 */
  watch(
    () => props.taskCode,
    async (val) => {
      let data = await ProductionApi.getIpqcPage({ taskCode: props.taskCode })
      if (data.list && data.list.length) {
        queryParams.ipqcId = data.list[0].id
        handleQuery()
      }else{
            list.value = []
            total.value =0
        }
    },
    { immediate: false }
  )
  
  /** 查询列表 */
  const getList = async () => {
    loading.value = true
    try {
      const data = await ProductionApi.getLinePage(queryParams)
      list.value = data.list
      total.value = data.total
    } finally {
      loading.value = false
    }
  }
  
  /** 搜索按钮操作 */
  const handleQuery = () => {
    queryParams.pageNo = 1
    getList()
  }
  
  
  
  
  </script>