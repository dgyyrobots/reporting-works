<template>
  <el-dialog title="工单选择" v-model="showFlag" :modal="false" width="90%" center>
    <el-form :model="queryParams" ref="queryFormRef" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="工单编码" prop="workorderCode">
        <el-input v-model="queryParams.workorderCode" placeholder="请输入工单编码" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="工单名称" prop="workorderName">
        <el-input v-model="queryParams.workorderName" placeholder="请输入工单名称" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="产品编号" prop="productCode">
        <el-input v-model="queryParams.productCode" placeholder="请输入产品编号" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="产品名称" prop="productName">
        <el-input v-model="queryParams.productName" placeholder="请输入产品名称" clearable @keyup.enter="handleQuery" />
      </el-form-item>

      <el-form-item label="客户名称" prop="clientName">
        <el-input v-model="queryParams.clientName" placeholder="请输入客户名称" clearable @keyup.enter="handleQuery" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :icon="Search" size="small" @click="handleQuery">搜索</el-button>
        <el-button :icon="Refresh" size="small" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="workorderList" @current-change="handleCurrent" @row-dblclick="handleRowDbClick">
      <el-table-column width="55" align="center">
        <template #default="scope">
          <el-radio v-model="selectedWorkorderId" :label="scope.row.id" @change="handleRowChange(scope.row)">{{ '' }}</el-radio>
        </template>
      </el-table-column>
      <el-table-column label="工单编码" width="180" prop="workorderCode"> </el-table-column>
      <el-table-column label="工单名称" width="200" align="center" prop="workorderName" :show-overflow-tooltip="true" />
      <el-table-column label="工单来源" align="center" prop="orderSource">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.MES_WORKORDER_SOURCETYPE" :value="scope.row.orderSource"/>
        </template>
      </el-table-column>
      <el-table-column label="订单编号" width="140" align="center" prop="sourceCode" />
      <el-table-column label="产品编号" width="120" align="center" prop="productCode" />
      <el-table-column label="产品名称" width="200" align="center" prop="productName" :show-overflow-tooltip="true" />
      <el-table-column label="规格型号" align="center" prop="productSpc" :show-overflow-tooltip="true" />
      <el-table-column label="单位" align="center" prop="unitOfMeasure" />
      <el-table-column label="工单数量" align="center" prop="quantity" />
      <el-table-column label="客户编码" align="center" prop="clientCode" />
      <el-table-column label="客户名称" align="center" prop="clientName" :show-overflow-tooltip="true" />
      <el-table-column label="需求日期" align="center" prop="requestDate" width="180">
        <template #default="scope">
          <span>{{ formatDate(scope.row.requestDate,'YYYY-MM-DD') }}</span>
        </template>
      </el-table-column>
    </el-table>
    <Pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize" @pagination="getList" />
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirmSelect">确 定</el-button>
        <el-button @click="showFlag = false">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Search, Refresh } from '@element-plus/icons-vue'
import { ElNotification } from 'element-plus'
import { listWorkorder } from '@/api/mes/pro/workorder'

import Pagination from '@/components/Pagination/index.vue'
import { formatDate } from '@/utils/formatTime'
import { DICT_TYPE } from '@/utils/dict'


// 组件名称
defineOptions({
  name: 'WorkOrderSelectSingle'
})

// 响应式数据
const showFlag = ref(false)
const loading = ref(true)
const selectedWorkorderId = ref<number>()
const selectedRows = ref<any[]>([])
const single = ref(true)
const multiple = ref(true)
const showSearch = ref(true)
const total = ref(0)
const workorderList = ref<any[]>([])
const queryFormRef = ref()

// 查询参数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  workorderCode: null,
  workorderName: null,
  orderSource: null,
  sourceCode: null,
  productId: null,
  productCode: null,
  productName: null,
  productSpc: null,
  unitOfMeasure: null,
  quantity: null,
  quantityProduced: null,
  quantityChanged: null,
  quantityScheduled: null,
  clientId: null,
  clientCode: null,
  clientName: null,
  requestDate: null,
  parentId: null,
  ancestors: null,
  status: 'CONFIRMED'
})

// 方法定义
const getList = async () => {
  loading.value = true
  try {
    const response = await listWorkorder(queryParams)
    workorderList.value = response.list
    total.value = response.total
  } finally {
    loading.value = false
  }
}

const handleQuery = () => {
  getList()
}

const resetQuery = () => {
  queryFormRef.value?.resetFields()
  handleQuery()
}

const handleCurrent = (row: any) => {
  if (row) {
    selectedRows.value = row
  }
}

const handleRowChange = (row: any) => {
  if (row) {
    selectedRows.value = row
  }
}

const handleRowDbClick = (row: any) => {
  if (row) {
    selectedRows.value = row
    emit('onSelected', selectedRows.value)
    showFlag.value = false
  }
}

const confirmSelect = () => {
  if (!selectedWorkorderId.value) {
    ElNotification({
      title: '提示',
      type: 'warning',
      message: '请至少选择一条数据!'
    })
    return
  }
  emit('onSelected', selectedRows.value)
  showFlag.value = false
}

// 定义事件
const emit = defineEmits(['onSelected'])

// 生命周期钩子
onMounted(() => {
  getList()
})

// 暴露方法给父组件
defineExpose({
  showFlag
})
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>
