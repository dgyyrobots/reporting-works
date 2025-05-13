<template>
  <Dialog
    title="来料检验单选择"
    v-model="Flag"
    v-model:visible="Flag"
    :modal="false"
    width="90%"
    center
  >
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="110px"
    >
      <el-form-item label="来料检验单编号" prop="iqcCode">
        <el-input
          v-model="queryParams.iqcCode"
          placeholder="请输入来料检验单编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="来料检验单名称" prop="iqcName">
        <el-input
          v-model="queryParams.iqcName"
          placeholder="请输入来料检验单名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="产品物料编码" prop="itemCode">
        <el-input
          v-model="queryParams.itemCode"
          placeholder="请输入产品物料编码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="产品物料名称" prop="itemName">
        <el-input
          v-model="queryParams.itemName"
          placeholder="请输入产品物料名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"> <Icon icon="ep:search" class="mr-5px" /> 搜索 </el-button>
        <el-button @click="resetQuery"> <Icon icon="ep:refresh" class="mr-5px" /> 重置 </el-button>
        <!-- <el-button type="primary" plain @click="openForm('create')" v-hasPermi="['qms:iqc:create']">
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['qms:iqc:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
        <el-button
          type="warning"
          plain
          @click="openDetailForm('detail', 'zhijian', currentRow.id)"
          :loading="exportLoading"
          v-hasPermi="['qms:iqc:update']"
        >
          <Icon icon="ep:notification" class="mr-5px" /> 审核
        </el-button> -->
      </el-form-item>
    </el-form>

    <!-- 列表 -->
    <el-table
      v-loading="loading"
      :data="list"
      :stripe="true"
      :show-overflow-tooltip="true"
      highlight-current-row
      @current-change="handleCurrentChange"
    >
      <el-table-column width="55" align="center">
        <template #default="scope">
          <el-radio
            v-model="selectedWorkstationId"
            :label="scope.row.id"
            @change="handleRowChange(scope.row)"
            >{{ '' }}</el-radio
          >
        </template>
      </el-table-column>
      <el-table-column label="来料检验单编号" align="center" prop="iqcCode" width="150"/>
      <el-table-column label="来料检验单名称" align="center" prop="iqcName" width="150" />
      <el-table-column label="单据状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.BPM_PROCESS_INSTANCE_RESULT" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="供应商编码" align="center" prop="vendorCode" />
      <el-table-column label="供应商名称" align="center" prop="vendorName" />
      <el-table-column label="供应商批次号" align="center" prop="vendorBatch" />
      <el-table-column label="产品物料编码" align="center" prop="itemCode" />
      <el-table-column label="产品物料名称" align="center" prop="itemName" />
      <el-table-column label="规格型号" align="center" prop="specification" />
      <el-table-column label="单位" align="center" prop="unitOfMeasure" />
      <el-table-column label="最低检测数" align="center" prop="quantityMinCheck" />
      <el-table-column label="最大不合格数" align="center" prop="quantityMaxUnqualified" />
      <el-table-column label="本次接收数量" align="center" prop="quantityRecived" />
      <el-table-column label="本次检测数量" align="center" prop="quantityCheck" />
      <el-table-column label="不合格数" align="center" prop="quantityUnqualified" />
      <el-table-column label="致命缺陷率" align="center" prop="crRate" />
      <el-table-column label="严重缺陷率" align="center" prop="majRate" />
      <el-table-column label="轻微缺陷率" align="center" prop="minRate" />
      <el-table-column label="致命缺陷数量" align="center" prop="crQuantity" />
      <el-table-column label="严重缺陷数量" align="center" prop="majQuantity" />
      <el-table-column label="轻微缺陷数量" align="center" prop="minQuantity" />
      <el-table-column label="检测结果" align="center" prop="checkResult" />
      <el-table-column
        label="来料日期"
        align="center"
        prop="reciveDate"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="检测日期"
        align="center"
        prop="inspectDate"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="检测人员" align="center" prop="inspector" />

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
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
      style="float: none; justify-content: flex-end"
    />

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirmSelect">确 定</el-button>
        <el-button @click="Flag = false">取 消</el-button>
      </div>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import * as Api from '@/api/iqc/iqc'
import Form from './Form.vue'
import LineList from './components/LineList.vue'

defineOptions({ name: 'Oqc' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  iqcCode: undefined,
  iqcName: undefined,
  itemCode: undefined,
  itemName: undefined,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await Api.getPage(queryParams)
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

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await Api.oqcdelete(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await Api.oqcexport(queryParams)
    download.excel(data, '出货检验.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 选中行操作 */
const currentRow = ref({}) // 选中行
const handleCurrentChange = (row) => {
  currentRow.value = row
  console.log(row)
}

/** 初始化 **/
onMounted(() => {
  console.log('onMounted,,,src/views/oqc/oqc/index.vue')
  getList()
})

//审批状态
function chengedisabled(status) {
  return status != 'APPROVING' ? false : true
}

import DetailForm from './components/DetailForm.vue'
const detailFormRef = ref() // 查看的表单
const openDetailForm = (type: string, id?: number) => {
  console.log(currentRow.value.id)
  detailFormRef.value.open(type, id)
}

let Flag = ref(false)
const showFlag = () => {
  Flag.value = true
  nextTick(() => {
    getList()
    getWorkshops()
    getProcess()
  })
}
defineExpose({ showFlag })

const selectedWorkstationId = ref()
const selectedRows = ref([])

// 单选选中数据
const handleRowChange = (row) => {
  if (row) {
    selectedRows.value = row
  }
}

const emit = defineEmits(['onSelected'])
const confirmSelect = () => {
  if (selectedWorkstationId.value == null || selectedWorkstationId.value == 0) {
    message.warning(t('请至少选择一条数据!'))
    return
  }
  emit('onSelected', selectedRows.value)
  Flag.value = false
}
</script>

<style></style>
