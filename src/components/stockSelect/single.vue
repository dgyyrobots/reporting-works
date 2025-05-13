<template>
  <el-dialog title="库存物资选择" v-model="showFlag" :modal="false" width="90%" center>
    <el-row :gutter="20">
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input v-model="itemTypeName" placeholder="请输入分类名称" clearable size="small" :prefix-icon="Search" style="margin-bottom: 20px" />
        </div>
        <div class="head-container">
          <el-tree :data="itemTypeOptions" :props="defaultProps" :expand-on-click-node="false" :filter-node-method="filterNode" ref="treeRef" default-expand-all @node-click="handleNodeClick" />
        </div>
      </el-col>
      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryFormRef" size="small" :inline="true" v-show="showSearch" label-width="90px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="物资编码" prop="itemCode">
                <el-input v-model="queryParams.itemCode" :disabled="itemFag" placeholder="请输入产品物料编码" clearable @keyup.enter="handleQuery" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="物资名称" prop="itemName">
                <el-input v-model="queryParams.itemName" placeholder="请输入产品物料名称" clearable @keyup.enter="handleQuery" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="批次号" prop="batchCode">
                <el-input v-model="queryParams.batchCode" placeholder="请输入批次号" clearable @keyup.enter="handleQuery" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="仓库名称" prop="warehouseName">
                <el-input v-model="queryParams.warehouseName" placeholder="请输入仓库名称" clearable @keyup.enter="handleQuery" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="供应商编号" prop="vendorCode">
                <el-input v-model="queryParams.vendorCode" placeholder="请输入供应商编号" clearable @keyup.enter="handleQuery" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="供应商名称" prop="vendorName">
                <el-input v-model="queryParams.vendorName" placeholder="请输入供应商名称" clearable @keyup.enter="handleQuery" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <el-button type="primary" :icon="Search" size="small" @click="handleQuery">搜索</el-button>
            <el-button :icon="Refresh" size="small" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="wmstockList" @current-change="handleCurrent" @row-dblclick="handleRowDbClick">
          <el-table-column width="55" align="center">
            <template #default="scope">
              <el-radio v-model="selectedId" :label="scope.row.id" @change="handleRowChange(scope.row)">{{ '' }}</el-radio>
            </template>
          </el-table-column>
          <el-table-column label="产品物料编码" width="120px" align="center" prop="itemCode" />
          <el-table-column label="产品物料名称" width="150px" align="center" prop="itemName" :show-overflow-tooltip="true" />
          <el-table-column label="规格型号" align="center" prop="specification" :show-overflow-tooltip="true" />
          <el-table-column label="单位" align="center" prop="unitOfMeasure" />
          <el-table-column label="入库批次号" width="100px" align="center" prop="batchCode" :show-overflow-tooltip="true" />
          <el-table-column label="仓库" align="center" prop="warehouseName" />
          <el-table-column label="库区" align="center" prop="locationName" />
          <el-table-column label="库位" align="center" prop="areaName" />
          <el-table-column label="供应商编号" width="100px" align="center" prop="vendorCode" />
          <el-table-column label="供应商名称" width="120px" align="center" prop="vendorName" :show-overflow-tooltip="true" />
          <el-table-column label="供应商简称" width="100px" align="center" prop="vendorNick" />
          <el-table-column label="生产工单号" width="150px" align="center" prop="workorderCode" />
          <el-table-column label="在库数量" align="center" prop="quantityOnhand" />
          <el-table-column label="库存有效期" align="center" prop="expireDate" width="180">
            <template #default="scope">
              <span>{{ formatDate(scope.row.expireDate,'YYYY-MM-DD') }}</span>
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize" @pagination="getList" />
      </el-col>
    </el-row>
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
import { listWmstock } from '@/api/mes/wm/wmstock'
import { treeselect } from '@/api/mes/md/itemtype'
import { formatDate } from '@/utils/formatTime'
import Pagination from '@/components/Pagination/index.vue'

// 组件名称
defineOptions({
  name: 'WmstockMultiSelect'
})

// 定义props
const props = defineProps<{
  vendorId?: number | null
  batchCode?: string | null
  warehouseId?: number | null
  warehouseCode?: string | null
  locationId?: number | null
  locationCode?: string | null
  areaId?: number | null
  areaCode?: string | null
  workorderId?: number | null
  itemId?: number | null
  itemCode?: string | null
}>()

// 响应式数据
const showFlag = ref(false)
const itemFag = ref(false)
const loading = ref(true)
const selectedId = ref<number | null>(null)
const selectedRow = ref<any>(null)
const single = ref(true)
const multiple = ref(true)
const showSearch = ref(true)
const itemTypeName = ref<string>()
const total = ref(0)
const itemTypeOptions = ref<any[]>([])
const wmstockList = ref<any[]>([])
const treeRef = ref()
const queryFormRef = ref()

// 树形配置
const defaultProps = {
  children: 'children',
  label: 'label'
}

// 查询参数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  itemTypeId: null,
  itemTypeName: null,
  itemId: props.itemId,
  itemCode: props.itemCode,
  itemName: null,
  specification: null,
  unitOfMeasure: null,
  batchCode: props.batchCode,
  warehouseId: props.warehouseId,
  warehouseCode: props.warehouseCode,
  warehouseName: null,
  locationId: props.locationId,
  locationCode: props.locationCode,
  locationName: null,
  areaId: props.areaId,
  areaCode: props.areaCode,
  areaName: null,
  vendorId: props.vendorId,
  vendorCode: null,
  vendorName: null,
  vendorNick: null,
  clientId: null,
  clientCode: null,
  clientName: null,
  workorderId: props.workorderId,
  quantityOnhand: null,
  expireDate: null
})

// 方法定义
const getList = async () => {
  loading.value = true
  try {
    const response = await listWmstock(queryParams)
    wmstockList.value = response.list
    total.value = response.total
  } finally {
    loading.value = false
  }
}

const getTreeselect = async () => {
  const response = await treeselect()
  itemTypeOptions.value = response
}

const filterNode = (value: string, data: any) => {
  if (!value) return true
  return data.label.indexOf(value) !== -1
}

const handleNodeClick = (data: any) => {
  queryParams.itemTypeId = data.itemTypeId
  handleQuery()
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
    selectedRow.value = row
  }
}

const handleRowDbClick = (row: any) => {
  if (row) {
    selectedRow.value = row
    emit('onSelected', selectedRow.value)
    showFlag.value = false
  }
}

const handleRowChange = (row: any) => {
  if (row) {
    selectedRow.value = row
  }
}

const confirmSelect = () => {
  if (!selectedId.value) {
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

// 定义事件
const emit = defineEmits(['onSelected'])

// 生命周期钩子
onMounted(() => {
  getList()
  getTreeselect()
})

// 暴露方法给父组件
defineExpose({
  showFlag
})
</script>

<style scoped>
.head-container {
  padding: 10px;
}
.dialog-footer {
  text-align: right;
}
</style>
