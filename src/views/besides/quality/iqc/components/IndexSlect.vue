<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="90%">
    <!-- 列表 -->
    <ContentWrap>
      <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true"
        @current-change="handleCurrentChange">
        <el-table-column align="center" label="检测模板编号">
          <template #default="scope">
            <el-radio v-model="state.selectedItemId" :label="scope.row.id" @change="handleRowChange(scope.row)">{{ ''
            }}</el-radio>
          </template>
        </el-table-column>
        <el-table-column label="检测项编码" align="center" prop="indexCode" />
        <el-table-column label="检测项名称" align="center" prop="indexName" />
        <el-table-column label="检测项类型" align="center" prop="indexType">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.MES_INDEX_TYPE" :value="scope.row.indexType" />
          </template>
        </el-table-column>
        <el-table-column label="检测工具" align="center" prop="qcTool" />
        <el-table-column label="检测要求" align="center" prop="checkMethod" />
        <el-table-column label="标准值" align="center" prop="standerVal" />
        <el-table-column label="单位" align="center" prop="unitOfMeasure" />
        <el-table-column label="误差上限" align="center" prop="thresholdMax" />
        <el-table-column label="误差下限" align="center" prop="thresholdMin" />
        <el-table-column label="说明图" align="center" prop="docUrl" />
        <el-table-column label="备注" align="center" prop="remark" />
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
import { dateFormatter } from '@/utils/formatTime'
import * as Api from '@/api/iqc/iqc'
import { DICT_TYPE, getStrDictOptions } from '@/utils/dict'
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

const templateId = ref()

import * as TemplateApi from '@/api/qmcbasic/template'
/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await TemplateApi.getTemplateIndexListByTemplateId(templateId.value)
    list.value = data
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
const open = async (iqcId: number) => {
  const item = await Api.get(iqcId)
  templateId.value = item.templateId

  dialogVisible.value = true
  dialogTitle.value = '检测项选择'
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
})
</script>