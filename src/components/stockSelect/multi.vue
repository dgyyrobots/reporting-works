<template>
  <el-dialog title="物料选择" v-model="showFlag" :modal="false" width="92%" center>
    <el-row :gutter="14">
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input v-model="itemTypeName" placeholder="请输入分类名称" clearable ::size="currentSize" :prefix-icon="Search" style="margin-bottom: 20px" />
        </div>
        <div class="head-container">
          <el-tree :data="itemTypeOptions" :props="defaultProps" :expand-on-click-node="false" :filter-node-method="filterNode" ref="treeRef" default-expand-all @node-click="handleNodeClick" />
        </div>
      </el-col>
      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryFormRef" ::size="currentSize" :inline="true" v-show="showSearch">
          <el-form-item label="产品物料编码" prop="itemCode">
            <el-input v-model="queryParams.itemCode" placeholder="请输入产品物料编码" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="产品物料名称" prop="itemName">
            <el-input v-model="queryParams.itemName" placeholder="请输入产品物料名称" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="入库批次号" prop="batchCode">
            <el-input v-model="queryParams.batchCode" placeholder="请输入入库批次号" clearable @keyup.enter="handleQuery" />
          </el-form-item>

          <el-form-item label="仓库信息" prop="warehouse">
            <el-cascader v-model="queryParams.warehouse" :options="warehouseOptions" :props="warehouseProps" @change="handleWarehouseChanged"></el-cascader>
          </el-form-item>

          <el-form-item label="供应商编号" prop="vendorCode">
            <el-input v-model="queryParams.vendorCode" placeholder="请输入供应商编号" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="供应商名称" prop="vendorName">
            <el-input v-model="queryParams.vendorName" placeholder="请输入供应商名称" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="库存有效期" prop="expireDate">
            <el-date-picker clearable v-model="queryParams.expireDate" type="date" value-format="timestamp" placeholder="请选择库存有效期"> </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" ::size="currentSize" @click="handleQuery">搜索</el-button>
            <el-button :icon="Refresh" ::size="currentSize" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :size="currentSize" :data="wmstockList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
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
        <el-button :size="currentSize" type="primary" @click="confirmSelect">确 定</el-button>
        <el-button :size="currentSize" @click="showFlag = false">取 消</el-button>
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
import { getTreeList } from '@/api/mes/wm/warehouse'
import Pagination from '@/components/Pagination/index.vue'
import { formatDate } from '@/utils/formatTime'
import { useAppStore } from '@/store/modules/app'
 
 const appStore = useAppStore()
 const currentSize = computed(() => appStore.currentSize === 'mini' ? 'small' : appStore.currentSize)
// 组件名称
defineOptions({
  name: 'WmstockMultiSelect'
})

// 响应式数据
const showFlag = ref(false)
const loading = ref(true)
const ids = ref<number[]>([])
const selectedRows = ref<any[]>([])
const single = ref(true)
const multiple = ref(true)
const showSearch = ref(true)
const total = ref(0)
const itemTypeOptions = ref<any[]>([])
const wmstockList = ref<any[]>([])
const itemTypeName = ref<string>()
const treeRef = ref()
const queryFormRef = ref()

// 查询参数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  itemTypeId: null,
  itemId: null,
  itemCode: null,
  itemName: null,
  specification: null,
  unitOfMeasure: null,
  batchCode: null,
  warehouseId: null,
  warehouseCode: null,
  warehouseName: null,
  locationId: null,
  locationCode: null,
  locationName: null,
  areaId: null,
  areaCode: null,
  areaName: null,
  vendorId: null,
  vendorCode: null,
  vendorName: null,
  vendorNick: null,
  quantityOnhand: null,
  expireDate: null,
  warehouse: null
})

// 树形配置
const defaultProps = {
  children: 'children',
  label: 'label'
}

// 仓库数据
const warehouseOptions = ref<any[]>([])
const warehouseProps = {
  multiple: false,
  value: 'pId',
  label: 'pName'
}

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
  queryParams.itemTypeId = data.id
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

const handleSelectionChange = (selection: any[]) => {
  ids.value = selection.map(item => item.materialStockId)
  single.value = selection.length !== 1
  multiple.value = !selection.length
  selectedRows.value = selection
}

const confirmSelect = () => {
  if (!selectedRows.value.length) {
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

const getWarehouseList = async () => {
  const response = await getTreeList()
  warehouseOptions.value = response
  warehouseOptions.value.map(w => {
      w.pId = w.id
      w.pName = w.warehouseName
          w.children.map(l => {
            let lstr = JSON.stringify(l.children)
              .replace(/locationId/g, 'lId')
              .replace(/areaId/g, 'pId')
              .replace(/areaName/g, 'pName');
            l.children = JSON.parse(lstr);
          });

          let wstr = JSON.stringify(w.children)
            .replace(/warehouseId/g, 'wId')
            .replace(/locationId/g, 'pId')
            .replace(/locationName/g, 'pName');
          w.children = JSON.parse(wstr);
        });
}

const handleWarehouseChanged = (obj: any[]) => {
  if (obj) {
    queryParams.warehouseId = obj[0] // 仓库
    queryParams.locationId = obj[1] // 库区
    queryParams.areaId = obj[2] // 库位
  }
}

// 定义事件
const emit = defineEmits(['onSelected'])

// 生命周期钩子
onMounted(() => {
  getList()
  getTreeselect()
  getWarehouseList()
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