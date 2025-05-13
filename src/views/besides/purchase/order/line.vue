<template>
  <div class="app-container">
    <el-table v-loading="loading" :size="currentSize"  :data="list" @selection-change="handleSelectionChange">
      <el-table-column label="单据编码" align="center" prop="id"/>
      <el-table-column :show-overflow-tooltip="true" label="采购单号" width="220" align="center" prop="poNo"/>
      <el-table-column :show-overflow-tooltip="true" label="商品编号" width="220" align="center" prop="goodsNumber"/>
      <el-table-column :show-overflow-tooltip="true" label="商品名称" width="230" align="center" prop="goodsName"/>
      <el-table-column :show-overflow-tooltip="true" label="商品规格" width="150" align="center" prop="goodsSpecs"/>
      <el-table-column label="商品单位" align="center" prop="company"/>
      <el-table-column label="采购数量" align="center" width="110" prop="quantity"/>
      <el-table-column label="收货数量" align="center" width="110" prop="receiveNum"/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template #default="scope">
          <span>{{ formatDate(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入库状态" prop="status" width="80">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PURCHASE_STATUS" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" v-if="optType != 'view'" width="100px" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button :size="currentSize" type="text"  @click="handleUpdate(scope.row)" v-if="optType != 'view'" v-hasPermi="['purchase:goods:update']">修改 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :size="currentSize" v-show="total > 0" :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <el-dialog :title="title" v-model="open" width="90%" v-dialogDrag append-to-body>
      <el-form :size="currentSize"  ref="formRef" :model="form" :rules="rules">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="采购单号" prop="poNo">
              <el-input disabled v-model="form.poNo" placeholder="请输入采购单号"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品编号" prop="goodsNumber">
              <el-input disabled v-model="form.goodsNumber" placeholder="请输入商品编号"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="商品名称" prop="goodsName">
              <el-input disabled v-model="form.goodsName" placeholder="请输入商品名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品规格" prop="goodsSpecs">
              <el-input disabled v-model="form.goodsSpecs" placeholder="请输入商品规格"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="商品单位" prop="company">
              <el-input disabled v-model="form.company" placeholder="请输入商品单位"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购数量" prop="quantity">
              <el-input disabled v-model="form.quantity" placeholder="请输入采购数量"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="收货数量" prop="receiveNum">
              <el-input v-model="form.receiveNum" placeholder="请输入收货数量"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收货单位" width="100%" prop="receiveNum">
              <el-select filterable clearable @focus="$event.target.blur()"  v-model="form.unitOfMeasure" placeholder="请选择">
                <el-option
                  v-for="unit in unitOptions"
                  :key="unit.measureCode"
                  :label="unit.measureName"
                  :value="unit.measureCode">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :size="currentSize" type="primary" @click="submitForm">确 定</el-button>
          <el-button :size="currentSize"  @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup >
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import StockSelect from '@/components/stockSelect/single.vue'
import { updateGoods, deleteGoods, getGoods, getGoodsPage } from '@/api/purchase/goods'
import { listAllUnitmeasure } from "@/api/md/unitmeasure"
import { formatDate } from '/@/utils/formatTime'
import { DICT_TYPE } from '@/utils/dict'
import { useAppStore } from '@/store/modules/app'




// 定义 props
const props = defineProps({
  optType: {
    type: String,
    default: null
  },
  purchaseId: {
    type: [String, Number],
    default: null
  },
  warehouseId: {
    type: [String, Number],
    default: null
  },
  locationId: {
    type: [String, Number],
    default: null
  },
  areaId: {
    type: [String, Number],
    default: null
  }
})
const appStore = useAppStore()
const currentSize = computed(() => appStore.currentSize === 'mini' ? 'small' : appStore.currentSize)
// 响应式数据
const loading = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const showSearch = ref(true)
const total = ref(0)
const list = ref([])
const title = ref('')
const open = ref(false)
const selectedRows = ref([])
const unitOptions = ref([])

// 表单引用
const formRef = ref()
const stockSelectRef = ref()

// 查询参数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  purchaseId: props.purchaseId,
  goodsNumber: null,
  goodsName: null,
  goodsSpecs: null,
  company: null,
  monovalent: null,
  quantity: null,
  taxes: null,
  total: null,
  categoryName: null,
  brandName: null,
  createTime: [],
})

// 表单参数
const form = reactive({
  id: null,
  issueId: null,
  itemId: null,
  itemCode: null,
  itemName: null,
  specification: null,
  unitOfMeasure: null,
  quantityIssued: null,
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
  remark: null,
  attr1: null,
  attr2: null,
  attr3: null,
  attr4: null,
  createBy: null,
  createTime: null,
  updateBy: null,
  updateTime: null,
})

// 表单校验规则
const rules = reactive({
  itemId: [{ required: true, message: '产品物料不能为空', trigger: 'blur' }],
  quantityIssued: [{ required: true, message: '领料数量不能为空', trigger: 'blur' }],
})

// 方法定义
const getList = async () => {
  loading.value = true
  try {
    const response = await getGoodsPage(queryParams)
    list.value = response.list
    total.value = response.total
  } finally {
    loading.value = false
  }
}

const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

const resetQuery = () => {
  formRef.value?.resetFields()
  handleQuery()
}

const cancel = () => {
  open.value = false
  reset()
}

const reset = () => {
  Object.assign(form, {
    id: null,
    issueId: null,
    itemId: null,
    itemCode: null,
    itemName: null,
    specification: null,
    unitOfMeasure: null,
    quantityIssued: null,
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
    remark: null,
    attr1: null,
    attr2: null,
    attr3: null,
    attr4: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
  })
  formRef.value?.resetFields()
}

const handleSelectionChange = (selection) => {
  selectedRows.value = selection
  ids.value = selection.map(item => item.id)
  single.value = selection.length !== 1
  multiple.value = !selection.length
}

const handleUpdate = async (row) => {
  reset()
  const id = row.id || ids.value
  console.log(row)
  
  // 追加校验, 禁止修改已入库的单据
  if (row.status === 2) {
    ElMessage.error('该单据已入库，禁止修改！')
    return
  }

  try {
    const response = await listAllUnitmeasure()
    unitOptions.value = response

    const goodsResponse = await getGoods(id)
    Object.assign(form, goodsResponse)
    open.value = true
    title.value = '修改采购商品明细'
  } catch (error) {
    console.error('获取数据失败:', error)
  }
}

const submitForm = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    if (form.id != null) {
      await updateGoods(form)
      ElMessage.success('修改成功')
      open.value = false
      getList()
    }
  } catch (error) {
    console.error('提交失败:', error)
  }
}

const handleDelete = async (row) => {
  const id = row.id
  try {
    await ElMessageBox.confirm('是否确认删除采购商品明细编号为"' + id + '"的数据项?')
    await deleteGoods(id)
    getList()
    ElMessage.success('删除成功')
  } catch (error) {
    console.error('删除失败:', error)
  }
}

const handleSelectStock = () => {
  stockSelectRef.value.showFlag = true
  stockSelectRef.value.getList()
}

const onStockSelected = (obj) => {
  if (obj != undefined && obj != null) {
    Object.assign(form, {
      materialStockId: obj.id,
      itemId: obj.itemId,
      itemCode: obj.itemCode,
      itemName: obj.itemName,
      specification: obj.specification,
      unitOfMeasure: obj.unitOfMeasure,
      batchCode: obj.batchCode,
      warehouseId: obj.warehouseId,
      warehouseCode: obj.warehouseCode,
      warehouseName: obj.warehouseName,
      locationId: obj.locationId,
      locationCode: obj.locationCode,
      locationName: obj.locationName,
      areaId: obj.areaId,
      areaCode: obj.areaCode,
      areaName: obj.areaName,
      quantityIssued: obj.quantityOnhand,
      quantityMax: obj.quantityOnhand,
    })
  }
}

// 生命周期钩子
onMounted(() => {
  getList()
})
</script>