<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="110px">
      <el-form-item label="订单编号" prop="sourceCode">
        <el-input
v-model="queryParams.sourceCode" placeholder="请输入订单编号" clearable @keyup.enter="handleQuery"
          class="!w-240px" />
      </el-form-item>
      <el-form-item label="出货检验单编号" prop="oqcCode">
        <el-input
v-model="queryParams.oqcCode" placeholder="请输入出货检验单编号" clearable @keyup.enter="handleQuery"
          class="!w-240px" />
      </el-form-item>
      <el-form-item label="出货检验单名称" prop="oqcName">
        <el-input
v-model="queryParams.oqcName" placeholder="请输入出货检验单名称" clearable @keyup.enter="handleQuery"
          class="!w-240px" />
      </el-form-item>
      <el-form-item label="单据状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择单据状态" clearable class="!w-240px">
          <el-option
v-for="dict in getStrDictOptions(DICT_TYPE.BPM_PROCESS_INSTANCE_RESULT)" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
v-model="queryParams.createTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
          start-placeholder="开始日期" end-placeholder="结束日期" :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px" />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
        <el-button type="primary" plain @click="openForm('create')" v-hasPermi="['oqc::create']">
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button type="success" plain @click="handleExport" :loading="exportLoading" v-hasPermi="['oqc::export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
        <el-button
type="warning" plain @click="openDetailForm('detail', 'zhijian', currentRow.id)"
          :loading="exportLoading" v-hasPermi="['oqc::export']">
          <Icon icon="ep:notification" class="mr-5px" /> 审核
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table
v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true" highlight-current-row
      @current-change="handleCurrentChange">
      <!-- <el-table-column label="订单编号" align="center" prop="sourceCode" width="150px"/> -->
      <el-table-column label="出货检验单编号" align="center" prop="oqcCode" width="150">
        <template #default="scope">
          <el-button
link type="primary" @click="openDetailForm('detail', 'chakan', scope.row.id)"
            v-hasPermi="['oqc::create']">
            {{ scope.row.oqcCode }}
          </el-button>
        </template>
      </el-table-column>

      <el-table-column label="出货检验单名称" align="center" prop="oqcName" width="150" />
      <el-table-column label="单据状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.BPM_PROCESS_INSTANCE_RESULT" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="客户编码" align="center" prop="clientCode" />
      <el-table-column label="客户名称" align="center" prop="clientName" />
      <el-table-column label="批次号" align="center" prop="batchCode" />
      <el-table-column label="产品物料编码" align="center" prop="itemCode" />
      <el-table-column label="产品物料名称" align="center" prop="itemName" />
      <el-table-column label="规格型号" align="center" prop="specification" />
      <el-table-column label="单位" align="center" prop="unitOfMeasure" />
      <el-table-column label="最低检测数" align="center" prop="quantityMinCheck" />
      <el-table-column label="最大不合格数" align="center" prop="quantityMaxUnqualified" />
      <el-table-column label="发货数量" align="center" prop="quantityOut" />
      <el-table-column label="本次检测数量" align="center" prop="quantityCheck" />
      <el-table-column label="不合格数" align="center" prop="quantityUnqualified" />
      <el-table-column label="合格数量" align="center" prop="quantityQuanlified" />
      <el-table-column label="致命缺陷率" align="center" prop="crRate" />
      <el-table-column label="严重缺陷率" align="center" prop="majRate" />
      <el-table-column label="轻微缺陷率" align="center" prop="minRate" />
      <el-table-column label="致命缺陷数量" align="center" prop="crQuantity" />
      <el-table-column label="严重缺陷数量" align="center" prop="majQuantity" />
      <el-table-column label="轻微缺陷数量" align="center" prop="minQuantity" />
      <el-table-column label="检测结果" align="center" prop="checkResult" />
      <el-table-column label="出货日期" align="center" prop="outDate" :formatter="dateFormatter" width="180px" />
      <el-table-column label="检测日期" align="center" prop="inspectDate" :formatter="dateFormatter" width="180px" />
      <el-table-column label="检测人员" align="center" prop="inspector" />

      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="创建时间" align="center" prop="createTime" :formatter="dateFormatter" width="180px" />
      <!-- <el-table-column label="操作" align="center" fixed="right" width="100">
        <template #default="scope">
          <el-button link type="primary" @click="openForm('update', scope.row.id)" v-hasPermi="['oqc::update']">
            编辑
          </el-button>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" align="center" fixed="right" width="250">
        <template #default="scope">
          <el-button
type="warning" link @click="showpost(scope.row)" :loading="exportLoading"
            v-hasPermi="['oqc::update']" v-if="showbutton(scope.row.status)">
            提交审核
          </el-button>
          <el-button
link type="primary" @click="openForm('update', scope.row.id)" v-hasPermi="['oqc::update']"
            v-if="showbutton(scope.row.status)">
            编辑
          </el-button>
          <el-button
link type="danger" @click="handleDelete(scope.row.id)" v-hasPermi="['oqc::delete']"
            v-if="showbutton(scope.row.status)">
            删除
          </el-button>
          <el-button
type="warning" plain @click="openDetailForm('detail', 'zhijian', scope.row.id)"
            :loading="exportLoading" v-hasPermi="['oqc::export']" v-if="showcheck(scope.row.status)">
            <Icon icon="ep:notification" class="mr-5px" /> 审核
          </el-button>
          <el-button
type="warning" plain @click="openDetailForm('detail', 'zhijian', scope.row.id)"
            :loading="exportLoading" v-hasPermi="['oqc::export']" v-if="showuncheck(scope.row.status)">
            <Icon icon="ep:notification" class="mr-5px" /> 反审核
          </el-button>
          <el-button
            link
            type="primary"
            @click="baobiao(scope.row)"
          >
            报表
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
:total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 子表的列表 -->
  <ContentWrap>
    <el-tabs model-value="line">
      <el-tab-pane label="出货检验单行" name="line">
        <LineList :oqc-id="currentRow.id" />
      </el-tab-pane>
    </el-tabs>
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <Form ref="formRef" @success="getList" />
  <StateMent ref='StateMentRef' type='qms_oqc'  />
  <!-- 表单弹窗：查看 -->
  <DetailForm ref="detailFormRef" @success="getList" />

  <el-dialog v-model="centerDialogVisible" title="系统提示" width="30%" center>
    <span>
      确认提交审核？
    </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="postval()">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
  
</template>

<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import * as Api from '@/api/oqc/oqc'
import Form from './Form.vue'
import LineList from './components/LineList.vue'
const StateMentRef=ref()
const baobiao=(row)=>{
  StateMentRef.value.showFlag(row)
}
defineOptions({ name: 'Oqc' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  sourceCode: undefined,
  oqcCode: undefined,
  oqcName: undefined,
  status: undefined,
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
  } catch { }
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
  // console.log(row)
}

/** 初始化 **/
onMounted(() => {
  console.log('onMounted,,,src/views/oqc/oqc/index.vue')
  getList()
})

//查看详情页
import DetailForm from './components/DetailForm.vue'
const detailFormRef = ref() // 查看的表单
const openDetailForm = (type: string, way: string, id?: number) => {
  // console.log(currentRow.value.id,way)
  detailFormRef.value.open(type, way, id)
}

//按钮切换  审核|编辑删除
const showbutton = (status) => {
  // console.log(status,status=='APPROVING')
  if (status == '0') return true
  else return false
}
const showcheck = (status) => {
  // console.log(status,status=='APPROVING')
  if (status == '1') return true
  else return false
}
const showuncheck = (status) => {
  // console.log(status,status=='APPROVING')
  if (status == '2') return true
  else return false
}


//审核提交
const postCheck = (row) => {
  row.status = '1'
  // 校验表单
  console.log(row)
  submit(row)
}
const submit = async (row) => {
  // 提交请求
  loading.value = true
  try {
    const data = row as unknown as Api.VO
    console.log('data',data)
      await Api.update(data)
      message.success(t('common.updateSuccess'))
    // 发送操作成功的事件
  } finally {
    getList()
    loading.value = false
  }
}

const postdata=ref()
const centerDialogVisible = ref(false)
const showpost=(row)=>{
  centerDialogVisible.value=true
  postdata.value=row
}
const postval=()=>{
  postCheck(postdata.value)
  centerDialogVisible.value=false
}
</script>