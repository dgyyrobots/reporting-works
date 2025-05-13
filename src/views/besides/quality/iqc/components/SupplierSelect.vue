<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="90%">
    <!-- 列表 -->
    <ContentWrap>
      <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true" @current-change="handleCurrentChange">
        <el-table-column align="center" label="检测模板编号">
          <template #default="scope">
            <el-radio v-model="state.selectedItemId" :label="scope.row.id" @change="handleRowChange(scope.row)">{{ ''
            }}</el-radio>
          </template>
        </el-table-column>
        <el-table-column label="供应商id" align="center" prop="id" />
        <el-table-column label="供应商名称" align="center" prop="supplierName" />
        <el-table-column label="纳税人识别号" align="center" prop="supplierNo" />
        <el-table-column label="简称" align="center" prop="supplierShort" />
        <el-table-column label="logo" align="center" prop="logo" />
        <el-table-column label="邮箱" align="center" prop="supplierEmail" />
        <el-table-column label="电话" align="center" prop="supplierPhone" />
        <el-table-column label="qq" align="center" prop="supplierQq" />
        <el-table-column label="微信号" align="center" prop="supplierWeixin" />
        <el-table-column label="账户金额" align="center" prop="account" />
        <el-table-column label="已提现金额" align="center" prop="accountWithdraw" />
        <el-table-column label="提现中金额" align="center" prop="accountWithdrawApply" />
        <el-table-column label="分组名称" align="center" prop="groupName" />
        <el-table-column label="状态" align="center" prop="status">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column label="类别" align="center" prop="categoryId" />
        <el-table-column label="店铺类别" align="center" prop="categoryName" />
        <el-table-column label="过期时间" align="center" prop="expireTime" />
        <el-table-column label="开店费用" align="center" prop="openFee" />
        <el-table-column label="保证金" align="center" prop="bond" />
        <el-table-column label="联系人" align="center" prop="supplierContact" />
        <el-table-column label="省" align="center" prop="provinceName" />
        <el-table-column label="城市" align="center" prop="cityName" />
        <el-table-column label="区县" align="center" prop="districtName" />
        <el-table-column label="乡镇" align="center" prop="communityName" />
        <el-table-column label="创建时间" align="center" prop="createTime" :formatter="dateFormatter" width="180px" />
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button link type="primary" @click="openForm('update', scope.row.id)" v-hasPermi="['supplier::update']">
              编辑
            </el-button>
            <el-button link type="danger" @click="handleDelete(scope.row.id)" v-hasPermi="['supplier::delete']">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <Pagination
:total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
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
import * as Api from '@/api/supplier/supplier'
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
  dialogTitle.value = '供应商选择'
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