<template>
  <el-dialog title="生产任务选择" v-model="showFlag" :modal="false" width="90%" center>
    <el-form :model="queryParams" ref="queryFormRef" :size="currentSize" :inline="true" v-show="showSearch" label-width="100px">
      <el-row>
        <el-col :span="7">
          <el-form-item label="所属工序" prop="processName">
            <el-select style="width:220px" v-model="queryParams.processId" placeholder="请选择工序">
              <el-option v-for="item in processOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="所属工作站" prop="workstationCode">
            <el-input v-model="queryParams.workstationCode" placeholder="请输入工作站编号" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="任务编号" prop="taskCode">
            <el-input v-model="queryParams.taskCode" placeholder="请输入生产任务编号" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-col>
        
        <el-col :span="5">
          <el-form-item>
            <el-button type="primary" :icon="Search" :size="currentSize" @click="handleQuery">搜索</el-button>
            <el-button :icon="Refresh" :size="currentSize" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-col>
   
      </el-row>

    </el-form>

    <el-table v-loading="loading" :size="currentSize" :data="protaskList" @current-change="handleCurrent" @row-dblclick="handleRowDbClick">
      <el-table-column width="55" align="center">
        <template #default="scope">
          <el-radio v-model="selectedTaskId" :label="scope.row.id" @change="handleRowChange(scope.row)">{{ '' }}</el-radio>
        </template>
      </el-table-column>
      <el-table-column label="任务编号" align="center" width="100px" prop="taskCode" :show-overflow-tooltip="true" />
      <el-table-column label="任务名称" align="center" width="120px" prop="taskName" :show-overflow-tooltip="true" />
      <el-table-column label="工作站编号" align="center" width="150px" prop="workstationCode" :show-overflow-tooltip="true" />
      <el-table-column label="工作站名称" align="center" width="150px" prop="workstationName" :show-overflow-tooltip="true" />
      <el-table-column label="排产数量" align="center" prop="quantity" />
      <el-table-column label="已生产数量" align="center" width="100px" prop="quantityProduced" />
      <el-table-column label="开始生产时间" align="center" prop="startTime" width="180">
        <template #default="scope">
          <span>{{ formatDate(scope.row.startTime, 'YYYY-MM-DD HH') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="生产时长" align="center" prop="duration" />
      <el-table-column label="预计完成时间" align="center" prop="endTime" width="180">
        <template #default="scope">
          <span>{{ formatDate(scope.row.endTime, 'YYYY-MM-DD HH') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="显示颜色" align="center" prop="colorCode">
        <template #default="scope">
          <el-color-picker v-model="scope.row.colorCode" disabled></el-color-picker>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100px" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button :size="currentSize" type="primary" link @click="handleUpdate(scope.row)" v-hasPermi="['pro:protask:edit']">修改</el-button>
          <el-button :size="currentSize" type="primary" link @click="handleDelete(scope.row)" v-hasPermi="['pro:protask:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize" @pagination="getList" />
    <template #footer>
      <div class="dialog-footer">
        <el-button  :size="currentSize" type="primary" @click="confirmSelect">确 定</el-button>
        <el-button  :size="currentSize" @click="showFlag = false">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted, watch, defineProps, defineEmits, computed } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import { listProtask } from '@/api/mes/pro/protask'
import { listAllProcess } from '@/api/mes/pro/process'
import WorkstationSelect from '@/components/workstationSelect/simpletableSingle.vue'
import { formatDate } from '@/utils/formatTime'
import { useAppStore } from '@/store/modules/app'

const props = defineProps({
  workorderId: {
    type: [Number, String],
    default: null
  },
  workorderCode: {
    type: String,
    default: null
  },
  processId: {
    type: [Number, String],
    default: null
  },
  processCode: {
    type: String,
    default: null
  },
  workstationId: {
    type: [Number, String],
    default: null
  },
  workstationCode: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['onSelected'])

// 应用状态
const appStore = useAppStore()
const currentSize = computed(() => appStore.currentSize === 'mini' ? 'small' : appStore.currentSize)

// 组件状态
const showFlag = ref(false)
const selectedTaskId = ref(undefined)
const selectedRow = ref(undefined)
const loading = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const showSearch = ref(true)
const total = ref(0)
const protaskList = ref([])
const title = ref('')
const open = ref(false)
const processOptions = ref([])
const queryFormRef = ref(null)

// 查询参数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  taskCode: null,
  taskName: null,
  workorderId: props.workorderId,
  workorderCode: null,
  workorderName: null,
  workstationId: null,
  workstationCode: null,
  workstationName: null,
  processId: props.processId,
  processCode: null,
  processName: null,
  itemId: null,
  itemCode: null,
  itemName: null,
  specification: null,
  unitOfMeasure: null,
  quantity: null,
  quantityProduced: null,
  quantityChanged: null,
  clientId: null,
  clientCode: null,
  clientName: null,
  clientNick: null,
  startTime: null,
  duration: null,
  endTime: null,
  colorCode: null,
  requestDate: null
})

// 表单参数
const form = reactive({})

// 表单校验
const rules = reactive({
  workstationId: [{ required: true, message: '工作站不能为空', trigger: 'blur' }],
  quantity: [{ required: true, message: '排产数量不能为空', trigger: 'blur' }],
  startTime: [{ required: true, message: '请选择开始生产日期', trigger: 'blur' }],
  duration: [{ required: true, message: '清输入估算的生产用时', trigger: 'blur' }]
})

// 监听props变化
watch(() => props.workorderId, (newVal) => {
  queryParams.workorderId = newVal
})

// 生命周期钩子
onMounted(() => {
  getList()
  getProcess()
})

// 方法
const getList = () => {
  loading.value = true
  listProtask(queryParams).then(response => {
    protaskList.value = response.list
    total.value = response.total
    loading.value = false
  }).catch(() => {
    loading.value = false
  })
}

const getProcess = () => {
  listAllProcess().then(response => {
    processOptions.value = response
  })
}

const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

const resetQuery = () => {
  if (queryFormRef.value) {
    queryFormRef.value.resetFields()
  }
  handleQuery()
}

const handleCurrent = (row) => {
  if (row) {
    selectedRow.value = row
  }
}

const handleRowDbClick = (row) => {
  if (row) {
    selectedRow.value = row
    emit('onSelected', selectedRow.value)
    showFlag.value = false
  }
}

const handleRowChange = (row) => {
  if (row) {
    selectedRow.value = row
  }
}

const confirmSelect = () => {
  if (selectedTaskId.value == null || selectedTaskId.value === 0) {
    ElNotification({
      title: '提示',
      type: 'warning',
      message: '请至少选择一条数据!'
    })
    return
  }
  emit('onSelected', selectedRow.value)
  showFlag.value = false
}

// 暴露给父组件的方法
defineExpose({
  showFlag,
  getList
})
</script>
