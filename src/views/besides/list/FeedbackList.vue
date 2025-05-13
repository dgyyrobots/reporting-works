<template>


  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true">
      <!-- <el-table-column label="记录ID" align="center" prop="id" /> -->
      <!-- <el-table-column label="报工类型" align="center" prop="feedbackType" /> -->
      <!-- <el-table-column label="报工单编号" align="center" prop="feedbackCode" /> -->
      <!-- <el-table-column label="工作站编号" align="center" prop="workstationCode" /> -->
      <el-table-column label="生产任务编号" align="center" prop="taskCode" />
      <el-table-column label="工作站名称" align="center" prop="workstationName" />
      <el-table-column label="生产工单编号" align="center" prop="workorderCode" />
      <el-table-column label="生产工单名称" align="center" prop="workorderName" />
      <!-- <el-table-column label="工序编码" align="center" prop="processCode" /> -->
      <el-table-column label="工序名称" align="center" prop="processName" />

      <el-table-column label="产品物料编码" align="center" prop="itemCode" />
      <el-table-column label="产品物料名称" align="center" prop="itemName" />
      <!-- <el-table-column label="单位" align="center" prop="unitOfMeasure" /> -->
      <!-- <el-table-column label="规格型号" align="center" prop="specification" /> -->
      <el-table-column label="排产数量" align="center" prop="quantity" />
      <el-table-column label="本次报工数量" align="center" prop="quantityFeedback" />
      <el-table-column label="合格品数量" align="center" prop="quantityQualified" />
      <el-table-column label="不良品数量" align="center" prop="quantityUnquanlified" />
      <el-table-column label="报工用户名" align="center" prop="userName" />
      <el-table-column
        label="报工时间"
        align="center"
        prop="feedbackTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="记录人" align="center" prop="recordUser" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <!-- <el-table-column label="报工价格" align="center" prop="reportFee" /> -->
      <!-- <el-table-column label="实付价格" align="center" prop="payFee" /> -->
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  </template>
  
  <script setup lang="ts">
  import { dateFormatter } from '@/utils/formatTime'
  import * as ProductionApi from '/@/api/production/index'
  // import ItemForm from './ItemForm.vue'
  // import MdProductSopList from './components/MdProductSopList.vue'
  // import Tree from "./Tree.vue";
  defineOptions({ name: 'MdItem' })
  
  const message = useMessage() // 消息弹窗
  const { t } = useI18n() // 国际化
  
  const loading = ref(false) // 列表的加载中
  const list = ref([]) // 列表的数据
  const total = ref(0) // 列表的总页数
  const queryParams = reactive({
    itemTypeId: undefined,
    pageNo: 1,
    pageSize: 10,
    itemCode: undefined,
    itemName: undefined,
    itemTypeCode: undefined,
    enableFlag: undefined,
    warehouseCode: undefined,
    warehouseName: undefined,
    locationCode: undefined,
    locationName: undefined,
    areaCode: undefined,
    createTime: [],
    taskCode:null
  })
  const queryFormRef = ref() // 搜索的表单
  const exportLoading = ref(false) // 导出的加载中
  
  /** 查询列表 */
  const getList = async () => {
    loading.value = true
    try {
        const data = await ProductionApi.getFeedbackPage(queryParams)
      list.value = data.list
      total.value = data.total
    } finally {
      loading.value = false
    }
  }
  
  
  
  
  
  
  
  
  
  const props = defineProps<{
    taskCode: undefined // 物料产品ID（主表的关联字段）
  }>()
  // 新增物料
  //产品物料选择
  
  watch(
    () => props.taskCode,
    (val) => {
      if (!val) return
      queryParams.taskCode = val
      nextTick(() => {
        handleQuery()
      })
    },
    { immediate: true }
  )
  /** 搜索按钮操作 */
  const handleQuery = () => {
    queryParams.pageNo = 1
    getList()
  }
  
  
  
  /** 初始化 **/
  onMounted(() => {
    // getList()
  })
  </script>
  