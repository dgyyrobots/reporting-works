<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="90%">
    <ContentWrap>
      <!-- 搜索工作栏 -->
      <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="110px">
        <el-form-item label="检测模板编号" prop="templateCode">
          <el-input v-model="queryParams.templateCode" placeholder="请输入检测模板编号" clearable @keyup.enter="handleQuery"
            class="!w-240px" />
        </el-form-item>
        <el-form-item label="检测模板名称" prop="templateName">
          <el-input v-model="queryParams.templateName" placeholder="请输入检测模板名称" clearable @keyup.enter="handleQuery"
            class="!w-240px" />
        </el-form-item>
        <!-- <el-form-item label="检测种类" prop="qcTypes">
          <el-select v-model="queryParams.qcTypes" placeholder="请选择检测种类" clearable class="!w-240px" disabled="true">
            <el-option v-for="dict in getStrDictOptions(DICT_TYPE.MES_QC_TYPE)" :key="dict.value" :label="dict.label"
              :value="dict.value" />
          </el-select>
        </el-form-item> -->
        <el-form-item label="是否启用" prop="enableFlag">
          <el-select v-model="queryParams.enableFlag" placeholder="请选择是否启用" clearable class="!w-240px">
            <el-option v-for="dict in getStrDictOptions(DICT_TYPE.INFRA_BOOLEAN_STRING)" :key="dict.value"
              :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime">
          <el-date-picker v-model="queryParams.createTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
            start-placeholder="开始日期" end-placeholder="结束日期"
            :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-240px" />
        </el-form-item>
        <el-form-item>
          <el-button @click="handleQuery">
            <Icon icon="ep:search" class="mr-5px" /> 搜索
          </el-button>
          <el-button @click="resetQuery">
            <Icon icon="ep:refresh" class="mr-5px" /> 重置
          </el-button>
          <el-button type="primary" plain @click="openForm('create')" v-hasPermi="['qmcbasic:template:create']">
            <Icon icon="ep:plus" class="mr-5px" /> 新增
          </el-button>
          <!-- <el-button type="success" plain @click="handleExport" :loading="exportLoading"
            v-hasPermi="['qmcbasic:template:export']">
            <Icon icon="ep:download" class="mr-5px" /> 导出
          </el-button> -->
        </el-form-item>
      </el-form>
    </ContentWrap>
    <!-- 列表 -->
    <ContentWrap>
      <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
        <el-table-column align="center" label="检测模板编号">
          <template #default="scope">
            <el-radio v-model="state.selectedItemId" :label="scope.row.id" @change="handleRowChange(scope.row)">{{ ''
            }}</el-radio>
          </template>
        </el-table-column>
        <!-- 子表的列表 -->
        <el-table-column type="expand">
          <template #default="scope">
            <el-tabs model-value="templateIndex">
              <el-tab-pane label="检测模板项" name="templateIndex">
                <TemplateIndexList :template-id="scope.row.id" />
              </el-tab-pane>
              <el-tab-pane label="检测模板产品" name="templateProduct">
                <TemplateProductList :template-id="scope.row.id" />
              </el-tab-pane>
            </el-tabs>
          </template>
        </el-table-column>
        <el-table-column label="检测模板编号" align="center" prop="templateCode" />
        <el-table-column label="检测模板名称" align="center" prop="templateName" />
        <el-table-column label="检测种类" align="center" prop="qcTypes">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.MES_QC_TYPE" :value="scope.row.qcTypes" />
          </template>
        </el-table-column>
        <el-table-column label="是否启用" align="center" prop="enableFlag">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.INFRA_BOOLEAN_STRING" :value="scope.row.enableFlag" />
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="创建时间" align="center" prop="createTime" :formatter="dateFormatter" width="180px" />
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button link type="primary" @click="openForm('update', scope.row.id)"
              v-hasPermi="['qmcbasic:template:update']">
              编辑
            </el-button>
            <el-button link type="danger" @click="handleDelete(scope.row.id)" v-hasPermi="['qmcbasic:template:delete']">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
        @pagination="getList" />
    </ContentWrap>
    <template #footer>
      <el-button @click="onSelectedTemplate" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
    <!-- 表单弹窗：添加/修改 -->
    <TemplateForm ref="formRef" @success="getList" />
    <TemplateSelect ref="template" @on-selected="onSelectedTemplate" />
  </Dialog>
</template>

<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import * as TemplateApi from '@/api/qmcbasic/template'
import TemplateForm from '../../template/TemplateForm.vue'
import TemplateIndexList from '../../template/components/TemplateIndexList.vue'
import TemplateProductList from '../../template/components/TemplateProductList.vue'

defineOptions({ name: 'Template' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  templateCode: undefined,
  templateName: undefined,
  qcTypes: 'OQC',
  enableFlag: undefined,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await TemplateApi.getTemplatePage(queryParams)
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
    await TemplateApi.deleteTemplate(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch { }
}

// /** 导出按钮操作 */
// const handleExport = async () => {
//   try {
//     // 导出的二次确认
//     await message.exportConfirm()
//     // 发起导出
//     exportLoading.value = true
//     const data = await TemplateApi.exportTemplate(queryParams)
//     download.excel(data, '检测模板.xls')
//   } catch {
//   } finally {
//     exportLoading.value = false
//   }
// }

/** 初始化 **/
onMounted(() => {
  getList()
})


const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
// const formType = ref('') // 表单的类型：create - 新增；update - 修改
/** 打开弹窗 */
const open = async () => {
  dialogVisible.value = true
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗


import * as TempApi from '@/api/qmcbasic/template'
import * as ProApi from '@/api/qmcbasic/template'
const emit = defineEmits(['onSelected'])
const onSelectedTemplate = async() => {
  if (state.selectedItemId == null || state.selectedItemId == 0) {
    message.warning(t('请至少选择一条数据!'))
    return;
  }
  loading.value = true
  try {
    // state.selectedTmp = await TempApi.getTemplateIndexListByTemplateId(state.selectedItemId)
    state.selectedPro = await ProApi.getTemplateProductListByTemplateId(state.selectedItemId)
    // state.selectedTmp = state.selectedTmp[0]
  } finally {
    loading.value = false
  }
  emit('onSelected', state);
  dialogVisible.value = false;
}

const state = reactive({
  loading: false,
  showFlag: false,
  // 选中数组
  selectedItemId: undefined,
  selectedRows: undefined,
  selectedTmp: undefined,
  selectedPro: undefined,
  // 非单个禁用
  single: true,
  // 非多个禁用
  multiple: true,
  // 显示搜索条件
  showSearch: true,
  // 总条数
  total: 0,
  // 物料产品表格数据
  itemList: [],
  // 部门树选项
  itemTypeOptions: undefined,
  // 部门名称
  itemTypeName: undefined,
  defaultProps: {
    children: 'children',
    label: 'label',
  },
  // 查询参数
  queryParams: {
    pageNo: 1,
    pageSize: 10,
    itemCode: undefined,
    itemName: undefined,
    itemTypeId: 0,
  },
  // 列信息
  columns: [
    { key: 0, label: `物料/产品编码`, visible: true },
    { key: 1, label: `物料/产品名称`, visible: true },
    { key: 2, label: `规格型号`, visible: true },
    { key: 3, label: `单位`, visible: true },
    { key: 4, label: `物料/产品`, visible: true },
    { key: 5, label: `物料分类`, visible: true },
    { key: 6, label: `创建时间`, visible: true },
  ],
})
// 单选选中数据
const handleRowChange = (row) => {
  if (row) {
    state.selectedRows = row;
    // console.log(row)
  }
}
</script>