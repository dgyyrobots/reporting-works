<template>
  <el-dialog title="工作站选择" v-model="showFlag" :modal="false" width="90%" center>
    <el-form :model="queryParams" ref="queryFormRef" size="small" :inline="true" v-show="showSearch" label-width="90px">
      <el-row>
        <el-col :span="7">
          <el-form-item label="工作站编号" prop="workstationCode">
            <el-input v-model="queryParams.workstationCode" placeholder="请输入工作站编号" clearable
              @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="所属工序" prop="processName">
            <el-select v-model="queryParams.processId" placeholder="请选择工序">
              <el-option v-for="item in processOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="所在车间" prop="workshopName">
            <el-select v-model="queryParams.workshopId" placeholder="请选择车间">
              <el-option v-for="item in workshopOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item>
            <el-button type="primary" :icon="Search" size="small" @click="handleQuery">搜索</el-button>
            <el-button :icon="Refresh" size="small" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24"> </el-col>
      </el-row>
    </el-form>

    <el-table v-loading="loading" :data="workstationList" @current-change="handleCurrent"
      @row-dblclick="handleRowDbClick">
      <el-table-column width="55" align="center">
        <template #default="scope">
          <el-radio v-model="selectedWorkstationId" :label="scope.row.id" @change="handleRowChange(scope.row)">{{ ''
          }}</el-radio>
        </template>
      </el-table-column>
      <el-table-column label="工作站编号" align="center" prop="workstationCode"> </el-table-column>
      <el-table-column label="工作站名称" align="center" prop="workstationName" />
      <el-table-column label="工作站地点" align="center" prop="workstationAddress" />
      <el-table-column label="所在车间名称" align="center" prop="workshopName" />
      <el-table-column label="所属工序" align="center" prop="processName" />
      <el-table-column label="备注" align="center" prop="remark" />
    </el-table>
    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
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
import { listWorkstation } from '@/api/mes/md/workstation'
import { listAllProcess } from '@/api/mes/pro/process'
import { listAllWorkshop } from '@/api/mes/md/workshop'
import Pagination from '@/components/Pagination/index.vue'

// 组件名称
defineOptions({
  name: 'WorkstationSelect'
})

// 定义props
const props = defineProps<{
  processId?: number // 外部传入的工序过滤条件
}>()

// 响应式数据
const showFlag = ref(false)
const loading = ref(true)
const selectedWorkstationId = ref<number>()
const selectedRows = ref<any[]>([])
const single = ref(true)
const multiple = ref(true)
const showSearch = ref(true)
const total = ref(0)
const workstationList = ref<any[]>([])
const workshopOptions = ref<any[]>([])
const processOptions = ref<any[]>([])
const queryFormRef = ref()

// 查询参数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  workstationCode: null,
  workstationName: null,
  workstationAddress: null,
  workshopId: null,
  workshopCode: null,
  workshopName: null,
  processId: props.processId,
  processCode: null,
  processName: null,
  enableFlag: null
})

// 表单参数
const form = reactive({
  workstationId: null,
  workstationCode: null,
  workstationName: null,
  workstationAddress: null,
  workshopId: null,
  workshopCode: null,
  workshopName: null,
  processId: null,
  processCode: null,
  processName: null,
  enableFlag: 'Y',
  remark: null,
  createBy: null,
  createTime: null,
  updateBy: null,
  updateTime: null
})

// 方法定义
const getList = async () => {
  loading.value = true
  try {
    const response = await listWorkstation(queryParams)
    workstationList.value = response.list
    total.value = response.total
  } finally {
    loading.value = false
  }
}

const getWorkshops = async () => {
  const response = await listAllWorkshop()
  workshopOptions.value = response
}

const getProcess = async () => {
  const response = await listAllProcess()
  processOptions.value = response
}

const cancel = () => {
  reset()
}

const reset = () => {
  Object.assign(form, {
    workstationId: null,
    workstationCode: null,
    workstationName: null,
    workstationAddress: null,
    workshopId: null,
    workshopCode: null,
    workshopName: null,
    processId: null,
    processCode: null,
    processName: null,
    enableFlag: 'Y',
    remark: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  })
  queryFormRef.value?.resetFields()
}

const handleQuery = () => {
  queryParams.pageNo = 1
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
  if (!selectedWorkstationId.value) {
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
  getWorkshops()
  getProcess()
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
