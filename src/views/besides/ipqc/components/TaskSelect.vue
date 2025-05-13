<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="90%">
    <!-- 列表 -->
    <ContentWrap>
      <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true" highlight-current-row
        @current-change="handleCurrentChange">
        <el-table-column align="center" label="检测模板编号">
          <template #default="scope">
            <el-radio v-model="state.selectedItemId" :label="scope.row.id" @change="handleRowChange(scope.row)">{{ ''
            }}</el-radio>
          </template>
        </el-table-column>
        <!-- <el-table-column label="任务ID" align="center" prop="id" /> -->
        <el-table-column label="任务编号" align="center" prop="taskCode" />
        <el-table-column label="任务名称" align="center" prop="taskName" />
        <el-table-column label="生产工单编号" align="center" prop="workorderCode" />
        <el-table-column label="工单名称" align="center" prop="workorderName" />
        <!-- <el-table-column label="工序编码" align="center" prop="processCode" /> -->
        <el-table-column label="工序名称" align="center" prop="processName" />
        <el-table-column label="产品物料编码" align="center" prop="itemCode" />
        <el-table-column label="产品物料名称" align="center" prop="itemName" />
        <!-- <el-table-column label="规格型号" align="center" prop="specification" /> -->
        <!-- <el-table-column label="单位" align="center" prop="unitOfMeasure" /> -->
        <el-table-column label="排产数量" align="center" prop="quantity" />
        <el-table-column label="已生产数量" align="center" prop="quantityProduced" />
        <el-table-column label="合格品数量" align="center" prop="quantityQuanlify" />
        <el-table-column label="不良品数量" align="center" prop="quantityUnquanlify" />
        <el-table-column label="调整数量" align="center" prop="quantityChanged" />
        <el-table-column label="客户名称" align="center" prop="clientName" />
        <el-table-column label="开始生产时间" align="center" prop="startTime" :formatter="dateFormatter" width="180px" />
        <el-table-column label="生产时长" align="center" prop="duration" />
        <el-table-column label="完成生产时间" align="center" prop="endTime" :formatter="dateFormatter" width="180px" />
        <!-- <el-table-column label="甘特图显示颜色" align="center" prop="colorCode" /> -->
        <el-table-column label="需求日期" align="center" prop="requestDate" :formatter="dateFormatter" width="180px" />
        <el-table-column label="生产状态" align="center" prop="status">
          <template #default="scope">
            <dict-tag :type="'mes_pro_task_status'" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" :formatter="dateFormatter" width="180px" />
      </el-table>
      <!-- 分页 -->
      <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
        @pagination="getList" />
    </ContentWrap>
    <template #footer>
      <el-button @click="onSelectedTask" type="primary">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { dateFormatter } from '/@/utils/formatTime'
import * as TaskApi from '/@/api/protask/task'
import { DICT_TYPE, getStrDictOptions } from '/@/utils/dict'
defineOptions({ name: 'Task' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  taskCode: undefined,
  taskName: undefined,
  workorderCode: undefined,
  workorderName: undefined,
  workstationCode: undefined,
  workstationName: undefined,
  processCode: undefined,
  processName: undefined,
  itemCode: undefined,
  itemName: undefined,
  specification: undefined,
  clientCode: undefined,
  clientName: undefined,
  clientNick: undefined,
  status: undefined,
  createTime: []
})

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await TaskApi.getTaskPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 选中行操作 */
const currentRow = ref({}) // 选中行
const handleCurrentChange = (row) => {
  currentRow.value = row
}
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
/** 打开弹窗 */
const open = async () => {
  dialogVisible.value = true
  dialogTitle.value = '工单选择'
  // 修改时，设置数据
  loading.value = true
  try {
    getList()
  } finally {
    loading.value = false
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const state = reactive({
  loading: false,
  showFlag: false,
  // 选中数组
  selectedItemId: undefined,
  selectedRows: undefined
})

// 单选选中数据
const handleRowChange = (row) => {
  if (row) {
    state.selectedRows = row;
  }
}

const emit = defineEmits(['onSelected'])
const onSelectedTask = async () => {
  if (state.selectedItemId == null || state.selectedItemId == 0) {
    message.warning(t('请至少选择一条数据!'))
    return;
  }
  emit('onSelected', state.selectedRows);
  dialogVisible.value = false;
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>