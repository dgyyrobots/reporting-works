<template>
  <div class="app-container">
    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryFormRef" :size="currentSize" :inline="true" v-show="showSearch">
      <el-form-item label="采购单号" prop="poNo">
        <el-input v-model="queryParams.poNo" placeholder="请输入采购单号" clearable @keyup.enter="handleQuery" />
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
        <el-button type="primary" :icon="Search"  @click="handleQuery">搜索</el-button>
        <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作工具栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain :icon="Printer" :size="currentSize" :disabled="single" @click="printTitle" v-hasPermi="['purchase:goods:print']">单据打印</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :size="currentSize" :data="list" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="采购单号" align="center" prop="poNo" />
      <el-table-column label="备注" align="center" prop="remarks" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template #default="scope">
          <span>{{ formatDate(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button :size="currentSize" type="text"  @click="handleUpdate(scope.row)"
            v-hasPermi="['purchase:order:update']">修改</el-button>
          <el-button :size="currentSize" type="text"  @click="handleDelete(scope.row)"
            v-hasPermi="['purchase:order:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination size="currentSize" v-show="total > 0" :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" v-model="open" width="90%" v-dialogDrag append-to-body>
      <el-form ref="formRef" :model="form" :rules="rules" :size="currentSize" >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="采购单号" prop="poNo">
              <el-input disabled v-model="form.poNo" placeholder="请输入采购单号"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="备注" prop="remarks">
              <el-input v-model="form.remarks" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-divider v-if="form.id != null" content-position="center">采购明细</el-divider>
      <el-card shadow="always" v-if="form.id != null" class="box-card">
        <GoodsLine ref="lineRef" :purchaseId="form.id" :optType="optType"></GoodsLine>
      </el-card>

      <template #footer>
        <div class="dialog-footer">
          <el-button :size="currentSize" type="primary" @click="submitForm">确 定</el-button>
          <el-button :size="currentSize" @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Printer,Search,Refresh } from '@element-plus/icons-vue'
import { createOrder, updateOrder, deleteOrder, getOrder, getOrderPage, exportOrderExcel } from '@/api/purchase/order'
import GoodsLine from "@/views/besides/purchase/order/line.vue"
import { checkConfig } from "@/api/purchase/goods"
import '@/utils/CLodopfuncs2.js'
import { formatDate } from '/@/utils/formatTime'
import { useAppStore } from '@/store/modules/app'

const appStore = useAppStore()
const currentSize = computed(() => appStore.getBreadcrumb)

// 响应式数据
const loading = ref(true)
const exportLoading = ref(false)
const showSearch = ref(true)
const total = ref(0)
const list = ref([])
const title = ref('')
const single = ref(true)
const multiple = ref(true)
const open = ref(false)
const optType = ref('')

// 表单引用
const queryFormRef = ref()
const formRef = ref()
const lineRef = ref()

// 查询参数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  supplierId: null,
  supplierContact: null,
  supplierPhone: null,
  purchaseAmount: null,
  poNo: null,
  paymentType: null,
  returnGoods: null,
  processType: null,
  remarks: null,
  createTime: [],
})

// 表单参数
const form = reactive({
  supplierId: undefined,
  supplierContact: undefined,
  supplierPhone: undefined,
  purchaseAmount: undefined,
  id: undefined,
  poNo: undefined,
  paymentType: undefined,
  returnGoods: undefined,
  processType: undefined,
  remarks: undefined,
})

// 表单校验规则
const rules = reactive({})

// 方法定义
const getList = async () => {
  loading.value = true
  try {
    const response = await getOrderPage(queryParams)
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
  queryFormRef.value?.resetFields()
  handleQuery()
}

const cancel = () => {
  open.value = false
  reset()
}

const reset = () => {
  Object.assign(form, {
    supplierId: undefined,
    supplierContact: undefined,
    supplierPhone: undefined,
    purchaseAmount: undefined,
    id: undefined,
    poNo: undefined,
    paymentType: undefined,
    returnGoods: undefined,
    processType: undefined,
    remarks: undefined,
  })
  formRef.value?.resetFields()
}

const handleUpdate = async (row) => {
  reset()
  const id = row.id
  try {
    const response = await getOrder(id)
    Object.assign(form, response)
    open.value = true
    title.value = '修改采购订单'
    optType.value = 'edit'
  } catch (error) {
    console.error('获取数据失败:', error)
  }
}

const submitForm = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    if (form.id != null) {
      await updateOrder(form)
      ElMessage.success('修改成功')
    } else {
      await createOrder(form)
      ElMessage.success('新增成功')
    }
    open.value = false
    getList()
  } catch (error) {
    console.error('提交失败:', error)
  }
}

const handleDelete = async (row) => {
  const id = row.id
  try {
    await ElMessageBox.confirm('是否确认删除采购订单编号为"' + id + '"的数据项?')
    await deleteOrder(id)
    getList()
    ElMessage.success('删除成功')
  } catch (error) {
    console.error('删除失败:', error)
  }
}

const handleExport = async () => {
  const params = { ...queryParams }
  delete params.pageNo
  delete params.pageSize
  
  try {
    await ElMessageBox.confirm('是否确认导出所有采购订单数据项?')
    exportLoading.value = true
    const response = await exportOrderExcel(params)
    // 假设有一个下载工具函数
    downloadExcel(response, '采购订单.xls')
  } catch (error) {
    console.error('导出失败:', error)
  } finally {
    exportLoading.value = false
  }
}

const handleSelectionChange = (selection) => {
  selectedRows.value = selection
  single.value = selection.length !== 1
  multiple.value = !selection.length
}

const printTitle = async () => {
  try {
    const result = await checkConfig(selectedRows.value[0].poNo)
    if (!result) {
      ElMessage.error('采购单: ' + selectedRows.value[0].poNo + '存在未配置单位与收货数量的明细信息，请先配置后打印！')
      return
    }
    if (!Array.isArray(result.data)) {
      console.error("结果不是一个数组: ", result)
      return
    }

    await ElMessageBox.confirm('确认打印？')
    console.log("开始循环: " + result)

    LODOP.PRINT_INITA(0, 0, 150, 100)
    LODOP.SET_PRINT_PAGESIZE(2, "", "", "热敏纸")

    for (const obj of result.data) {
      console.log("数据解析: ", obj)
      LODOP.NEWPAGE()
      LODOP.ADD_PRINT_RECT(8, 5, 150 * 3.71 - 10, 100 * 3.71 - 10, 0, 1)

      LODOP.SET_PRINT_STYLE("FontSize", 18)
      LODOP.SET_PRINT_STYLE("FontName", "Microsoft YaHei")
      LODOP.SET_PRINT_STYLE("Bold", 1)
      LODOP.SET_PRINT_STYLE("Horient", 2)
      LODOP.ADD_PRINT_TEXT(13, 0, 150, 30, "入库单标签")

      LODOP.SET_PRINT_STYLE("FontSize", 14)
      LODOP.SET_PRINT_STYLE("Bold", 0)
      LODOP.SET_PRINT_STYLE("Horient", 0)

      LODOP.ADD_PRINT_TEXT(65, 15, 120, 35, "条码编号:")
      LODOP.ADD_PRINT_TEXT(65, 120, 280, 35, obj.id)

      LODOP.ADD_PRINT_TEXT(110, 15, 120, 35, "采购料号:")
      LODOP.ADD_PRINT_TEXT(110, 120, 280, 35, obj.goodsNumber)

      LODOP.ADD_PRINT_TEXT(155, 15, 120, 35, "物料名称:")
      LODOP.ADD_PRINT_TEXT(155, 120, 280, 35, obj.goodsName + obj.goodsSpecs)

      LODOP.ADD_PRINT_TEXT(200, 15, 120, 35, "采购单号:")
      LODOP.ADD_PRINT_TEXT(200, 120, 280, 35, obj.poNo)

      LODOP.ADD_PRINT_TEXT(245, 15, 120, 35, "收货数量:")
      LODOP.ADD_PRINT_TEXT(245, 120, 280, 35, obj.receiveNum)

      LODOP.ADD_PRINT_TEXT(290, 15, 120, 35, "收货单位:")
      LODOP.ADD_PRINT_TEXT(290, 120, 280, 35, obj.unitOfMeasure)

      LODOP.ADD_PRINT_TEXT(335, 15, 120, 35, "收货日期:")
      const receiveTime = new Date(obj.receiveTime).toISOString().slice(0, 19).replace('T', ' ')
      LODOP.ADD_PRINT_TEXT(335, 120, 280, 35, receiveTime)
      
      const jsonQc = {
        "id": obj.id,
        "type": "purchase",
        "po_no": obj.poNo,
      }
      LODOP.ADD_PRINT_BARCODE(220, 390, 170, 170, "QRCode", JSON.stringify(jsonQc))
    }
    
    LODOP.SET_PRINT_MODE('AUTO_CLOSE_PREWINDOW', 1)
    LODOP.PREVIEW()

    await batchUpdateStatus(selectedRows.value[0].poNo)
  } catch (error) {
    console.error('打印失败:', error)
  }
}

// 生命周期钩子
onMounted(() => {
  getList()
})
</script>