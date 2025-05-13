<template>
    <div class="app-container">
      <!-- 搜索工作栏 -->
      <el-form :model="queryParams" ref="queryFormRef" :size="currentSize" :inline="true" v-show="showSearch" >
  
        <el-form-item label="采购单号" prop="poNo">
          <el-input v-model="queryParams.poNo" placeholder="请输入采购单号" clearable @keyup.enter="handleQuery"/>
        </el-form-item>
  
        <el-form-item label="商品编号" prop="goodsNumber">
          <el-input v-model="queryParams.goodsNumber" placeholder="请输入商品编号" clearable @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item label="商品名称" prop="goodsName">
          <el-input v-model="queryParams.goodsName" placeholder="请输入商品名称" clearable @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item label="供应商名称" prop="vendorName">
        <el-input v-model="queryParams.vendorName" placeholder="请输入" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleQuery">搜索</el-button>
          <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
  
      <!-- 操作工具栏 -->
      <el-row :gutter="10" class="mb8">
        <!--      <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" :size="currentSize" @click="handleAdd" v-hasPermi="['purchase:goods:create']">新增</el-button>
              </el-col>-->
  
          <el-col :span="1.5">
            <el-button type="primary" plain :icon="Printer" :size="currentSize" :disabled="multiple" @click="batchPrint" v-hasPermi="['purchase:goods:print']">批量打印</el-button>
          </el-col>

          <el-col :span="1.5">
            <el-button type="primary" plain :icon="Printer" :size="currentSize" :disabled="single" @click="printTitle" v-hasPermi="['purchase:goods:print']">单据打印</el-button>
          </el-col>

          <el-col :span="1.5">
            <el-button type="warning" plain :icon="Box" :size="currentSize" @click="warehousing" v-hasPermi="['purchase:goods:warehousing']">一键入库</el-button>
          </el-col>

          <el-col :span="1.5">
            <el-button type="warning" plain :icon="Download" :size="currentSize" @click="handleExport" :loading="exportLoading" v-hasPermi="['purchase:goods:export']">导出</el-button>
          </el-col>
          <el-col :span="1.5">
             <el-button type="primary" plain :icon="Edit" :size="currentSize"  @click="receive" v-hasPermi="['purchase:goods:split']">收货</el-button>
         </el-col>
          <el-col :span="1.5">
            <el-button type="primary" plain  :icon="SuccessFilled" :size="currentSize" :disabled="single" @click="split" v-hasPermi="['purchase:goods:split']">拆分</el-button>
          </el-col>
  
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>
  
      <!-- 列表 -->
      <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange" :size="currentSize"  ref="multipleTableRef" @row-click="handleRowClick">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column label="单据编码" align="center" prop="id"/>
        <el-table-column label="采购单号" align="center" prop="poNo"/>
        <el-table-column label="商品编号" align="center" prop="goodsNumber"/>
        <el-table-column :show-overflow-tooltip="true" label="商品名称" align="center" prop="goodsName"/>
        <el-table-column :show-overflow-tooltip="true" label="商品规格" align="center" prop="goodsSpecs"/>
        <el-table-column label="供应商编号" align="center" prop="vendorCode"/>
        <el-table-column label="供应商名称" align="center" prop="vendorName"/>
        <el-table-column label="商品单位" align="center" prop="company"/>
        <el-table-column label="采购数量" align="center" prop="quantity"/>
        <el-table-column label="收货数量" align="center" prop="receiveNum"/>
        <el-table-column label="创建时间" align="center" prop="createTime" width="180" :formatter="dateFormatter" >
          <template #default="scope">
            <span>{{ formatDate(scope.row.createTime,'YYYY-MM-DD HH:mm') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="入库状态" prop="status" width="80">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.PURCHASE_STATUS" :value="scope.row.status"/>
          </template>
        </el-table-column>
        <el-table-column  width="150" fixed="right"  label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button :size="currentSize" type="text" @click.stop="handleUpdate(scope.row)" v-hasPermi="['purchase:goods:update']">修改</el-button>
            <el-button :size="currentSize" type="text" @click.stop="handleDelete(scope.row)" v-hasPermi="['purchase:goods:delete']">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <pagination size="currentSize" v-show="total > 0" :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize" @pagination="getList"/>
  
      <el-dialog :title="title" v-model="open" width="65%" v-dialogDrag append-to-body>
        <el-form ref="formRef" :model="form" :rules="rules" :size="currentSize">
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
              <el-form-item label="收货单位" >
                <el-select filterable clearable   @focus="$event.target.blur()"  v-model="form.unitOfMeasure" width="100%" placeholder="请选择">
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
            <el-button :size="currentSize" @click="cancel">取 消</el-button>
          </div>
        </template>
      </el-dialog>
  
      <!--  一键入库  -->
      <el-dialog :title="title" v-model="wareOpen" width="75%" v-dialogDrag append-to-body>
        <el-form ref="wareFormRef" :model="wareForm" :rules="rules" :size="currentSize">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="采购单号" prop="poNo">
                <el-input v-model="wareForm.poNo" placeholder="请输入采购单号" @blur="handleBlur" @input="handleInput"/>
                <input ref="scannerInput" v-model="scanData" placeholder="请输入"  style="position: absolute; opacity: 0; width: 0; height: 0; z-index: -1; -webkit-user-select: none;" inputmode="none" autofocus />
                <span>支持扫码枪扫描, 无法扫码时点击重置按钮</span>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <!-- <el-button type="primary" round @click="">摄像头</el-button> -->
              <el-button type="primary" round @click="handResetPoNo">重置</el-button>
            </el-col>
  
            <el-col :span="12">
              <el-form-item label="仓库信息" prop="goodsNumber">
                <el-cascader v-model="wareForm.wareHouse" :options="warehouseOptions" :props="warehouseProps" @change="handleWarehouseChanged"></el-cascader>
              </el-form-item>
            </el-col>
          </el-row>
  
          <!-- 设置el-table的高度 -->
          <el-table v-loading="loading" :data="wareList" height="500" :size="currentSize">
            <el-table-column label="商品编号" align="center" prop="goodsNumber"/>
            <el-table-column label="商品名称" align="center" prop="goodsName"/>
            <el-table-column label="商品规格" align="center" prop="goodsSpecs"/>
            <el-table-column label="供应商编号" align="center" prop="vendorCode"/>
            <el-table-column label="商品单位" align="center" prop="company"/>
            <el-table-column label="采购数量" align="center" prop="quantity"/>
            <el-table-column label="收货数量" align="center" prop="receiveNum"/>
            <el-table-column label="创建时间" align="center" prop="createTime">
              <template #default="scope">
                <span>{{ parseTime(scope.row.createTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="入库状态" prop="status" width="80">
              <template #default="scope">
                <dict-tag :type="DICT_TYPE.PURCHASE_STATUS" :value="scope.row.status"/>
              </template>
            </el-table-column>
          </el-table>
  
        </el-form>
        <div>
          <video ref="videoCameraRef" style="display: none;"></video>
        </div>
        <template #footer>
          <div class="dialog-footer">
            <el-button :size="currentSize" type="primary" @click="submitWareForm">确 定</el-button>
            <el-button :size="currentSize" @click="cancel">取 消</el-button>
          </div>
        </template>
      </el-dialog>
  

  
      <!-- 拆分弹出框 -->
      <el-dialog :title="'拆分详情'" v-model="splitDialogVisible" width="90%" v-dialogDrag append-to-body>
        <el-form ref="splitFormRef" :model="splitForm" :size="currentSize">
  
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="采购单号" prop="poNo">
                <el-input disabled v-model="splitForm.poNo" placeholder="请输入采购单号"/>
              </el-form-item>
            </el-col>
  
            <el-col :span="12">
              <el-form-item label="商品编号" prop="goodsNumber">
                <el-input disabled v-model="splitForm.goodsNumber" placeholder="请输入商品编号"/>
              </el-form-item>
            </el-col>
          </el-row>
  
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="入库数量" prop="quantity">
                <el-input disabled v-model="splitForm.receiveNum" placeholder="请输入采购数量"/>
              </el-form-item>
            </el-col>
  
            <el-col :span="12">
              <el-form-item label="入库单位" prop="unitOfMeasure">
                <el-input disabled v-model="splitForm.unitOfMeasure" placeholder="请输入采购数量"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
  
  
        <div style="text-align: right; margin-top: 20px;">
          <el-button :size="currentSize" type="primary" @click="conditionSplit">按条件拆分</el-button>
          <el-button :size="currentSize" type="primary" @click="addSplitDetailByCount">按数量拆分</el-button>
  
          <el-button :size="currentSize" type="primary" @click="addSplitDetail">新增</el-button>
        </div>
        <!-- 拆分表格 -->
        <el-table :data="splitDetails" style="width: 100%;" max-height="400" :size="currentSize">
  
          <el-table-column prop="index" label="序号" width="60"/>
          <el-table-column prop="poNo" label="采购单号" width="180"/>
          <el-table-column prop="goodsNumber" label="物料料号" width="180"/>
          <el-table-column prop="unitOfMeasure" label="物料单位" width="180"/>
          <el-table-column prop="quantity" label="数量">
            <template #default="scope">
              <el-input v-model="scope.row.quantity" type="number" placeholder="请输入数量"/>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="scope">
              <el-button :size="currentSize" type="text" icon="el-icon-delete" @click="removeSplitDetail(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
  
  
        <template #footer>
          <div class="dialog-footer">
            <el-button  :size="currentSize" @click="cancel">取消</el-button>
            <el-button :size="currentSize" type="primary" @click="submitSplit">确定拆分</el-button>
          </div>
        </template>
      </el-dialog>
  
      <!-- 按条件拆分弹出框 -->
      <el-dialog :title="'按条件拆分'" v-model="splitConditionDialogVisible" width="50%" v-dialogDrag append-to-body>
        <el-form ref="splitConditionFormRef" :model="splitConditionForm" :size="currentSize">
          <el-form-item label="拆分条数">
            <el-input v-model="splitConditionForm.splitCount" type="number" step="1" placeholder="请输入拆分条数"/>
          </el-form-item>
  
          <el-form-item label="拆分数量">
            <el-input v-model="splitConditionForm.splitQuantity" type="number" step="0.001" placeholder="请输入拆分数量"/>
          </el-form-item>
  
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="cancelSplit" :size="currentSize">取消</el-button>
            <el-button type="primary" @click="confirmConditionSplit" :size="currentSize">确定</el-button>
          </div>
        </template>
      </el-dialog>
  
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed, onMounted, watch } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { Printer, Box, Download, SuccessFilled,Search,Refresh,Edit } from '@element-plus/icons-vue'
  import { createGoods, updateGoods, deleteGoods, getGoods, getGoodsPage, getAllGoods, exportGoodsExcel, updateReceiveStatus, startWareHousing, splitGoods, getPurchaseBarCode, checkConfig, batchUpdateReceiveStatus,receiving } from '@/api/purchase/goods'

  import '@/utils/CLodopfuncs2.js'
  import { formatDate } from '/@/utils/formatTime'
  import { listAllUnitmeasure } from '@/api/md/unitmeasure'
  import { getTreeList } from '@/api/wms/warehouse'
  import { DICT_TYPE } from '@/utils/dict'
  import { useAppStore } from '@/store/modules/app'
 import download from '~/library/plugins/download'
  const appStore = useAppStore()
  const currentSize = computed(() => appStore.currentSize==='mini'?  'small' : appStore.currentSize)

  const scanData = ref(null)
  const scannerInput= ref(null)
  // 响应式数据
  const loading = ref(true)
  const exportLoading = ref(false)
  const showSearch = ref(true)
  const total = ref(0)
  const list = ref([])
  const wareList = ref([])
  const title = ref('')
  const single = ref(true)
  const multiple = ref(true)
  const open = ref(false)
  const wareOpen = ref(false)
  const unitOptions = ref([])
  const selectedRows = ref([])
  const index = ref(1)
  const splitDialogVisible = ref(false)
  const splitConditionDialogVisible = ref(false)
  
  // 表单引用
  const queryFormRef = ref(null)
  const formRef = ref(null)
  const wareFormRef = ref(null)
  const splitFormRef = ref(null)
  const splitConditionFormRef = ref(null)
  const multipleTableRef = ref(null)
  const videoCameraRef = ref(null)
  
  // 查询参数
  const queryParams = reactive({
    pageNo: 1,
    pageSize: 10,
    purchaseId: null,
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
  const form = reactive({})
  const wareForm = reactive({})
  const splitForm = reactive({
    poNo: '',
    goodsNumber: '',
    receiveNum: '',
    unitOfMeasure: ''
  })
  const splitDetails = ref([])
  const splitConditionForm = reactive({
    splitQuantity: '',
    splitCount: ''
  })
  
  // 仓库数据
  const warehouseOptions = ref([])
  const warehouseProps = {
    multiple: false,
    value: 'pId',
    label: 'pName',
  }
  
  // 表单校验规则
  const rules = {
    poNo: [{required: true, message: '采购单号不能为空', trigger: 'blur'}],
    goodsNumber: [{required: true, message: '商品编号不能为空', trigger: 'blur'}],
    company: [{required: true, message: '商品单位不能为空', trigger: 'blur'}],
    quantity: [{required: true, message: '采购数量不能为空', trigger: 'blur'}],
    receiveNum: [{required: true, message: '收货数量不能为空', trigger: 'blur'}],
    unitOfMeasure: [{required: true, message: '收货单位不能为空', trigger: 'blur'}]
  }
  
  // 计算属性
  const canSplit = computed(() => {
    return selectedRows.value.length > 0
  })
  const handResetPoNo = () => {
    wareForm.poNo = ''
    scanData.value = null
    refocusScanner()
  }
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
    list.value = []
    total.value = 0
    getList()
  }
  
  const resetQuery = () => {
    queryFormRef.value?.resetFields()
      // 手动重置查询参数
    Object.assign(queryParams, {
      pageNo: 1,
      pageSize: 10,
      poNo: undefined,
      goodsNumber: undefined,
      goodsName: undefined,
      goodsSpecs: undefined,
      company: undefined,
      monovalent: undefined,
      quantity: undefined,
      taxes: undefined,
      total: undefined,
      categoryName: undefined,
      brandName: undefined,
      createTime: []
    })
    handleQuery()
  }
  
  const handleSelectionChange = (selection) => {
    selectedRows.value = selection
    single.value = selection.length !== 1
    multiple.value = !selection.length
  }
  
  const handleRowClick = (row) => {
    multipleTableRef.value?.toggleRowSelection(row)
  }
  
  const cancel = () => {
    open.value = false
    wareOpen.value = false
    wareList.value = []
    splitDialogVisible.value = false
    index.value = 1
    reset()
  }
  
  const reset = () => {
    Object.assign(form, {
      id: undefined,
      purchaseId: undefined,
      goodsNumber: undefined,
      goodsName: undefined,
      goodsSpecs: undefined,
      company: undefined,
      monovalent: undefined,
      quantity: undefined,
      taxes: undefined,
      total: undefined,
      categoryName: undefined,
      brandName: undefined,
    })
    
    Object.assign(wareForm, {
      id: undefined,
      purchaseId: undefined,
      goodsNumber: undefined,
      goodsName: undefined,
      goodsSpecs: undefined,
      company: undefined,
      monovalent: undefined,
      quantity: undefined,
      taxes: undefined,
      total: undefined,
      categoryName: undefined,
      brandName: undefined,
    })

    formRef.value?.resetFields()
    wareFormRef.value?.resetFields()
  }
  const refocusScanner = () => {
  if (wareOpen.value && scannerInput.value) {
    nextTick(() => {
      scannerInput.value.focus()
      isFocused.value = true
    })
  }
}
  // 生命周期钩子
  onMounted(() => {
    getList()
    getWarehouseList()

    window.addEventListener("keydown", handleKeyDown);

    // 添加全局点击事件监听器
    document.addEventListener('click', () => {
      if (wareOpen.value) {
        refocusScanner()
      }
    });
    nextTick(() => {
    setTimeout(refocusScanner, 500)
  })
  })

  onUnmounted(() => {
    remove_keydownlistener();
  });

const remove_keydownlistener = () => {
  window.removeEventListener("keydown", handleKeyDown, false);
};
  
  // 监听器
  // watch(() => wareForm.poNo, (newVal) => {
  //   if (typeof newVal === 'string' && newVal.includes('{') && newVal.includes('}')) {
  //     console.log('输入内容包含完整的 "{" 和 "}"')
  //     try {
  //       const data = JSON.parse(newVal)
  //       if (data && data.po_no) {
  //         wareForm.poNo = data.po_no
  //         handleBlur()
  //       }
  //     } catch (error) {
  //       ElMessage.error('扫描结果不是有效的 JSON 字符串')
  //     }
  //   }
  // })
  // watch(() => scanData.value, (newVal) => {
  //   if (typeof newVal === 'string' && newVal.includes('{') && newVal.includes('}')) {
  //     console.log('输入内容包含完整的 "{" 和 "}"')
  //     try {
  //       const data = JSON.parse(newVal)
  //       if (data && data.po_no) {
  //         wareForm.poNo = data.po_no
  //         handleBlur()
  //       }
  //     } catch (error) {
  //       ElMessage.error('扫描结果不是有效的 JSON 字符串')
  //     }
  //   }  else if(typeof(newVal)==='object' && newVal.po_no){
  //     wareForm.poNo = newVal.po_no
  //     handleBlur()
  //     }  else {
  //       console.log('输入内容不包含完整的 "{" 和 "}"');
  //     }
  // })
  

  // 添加对话框显示状态的监听
watch(() => wareOpen.value, (newVal) => {
  if (newVal) {
    // 对话框打开后，等待DOM渲染完成并设置焦点
    nextTick(() => {
      // 使用多个延时尝试获取焦点，增加成功率
      setTimeout(() => {
        if (scannerInput.value) {
          scannerInput.value.focus();
          console.log('设置焦点成功');
        }
      }, 300);
    });
  }else {
    wareForm.poNo = null
  }
});


const handleKeyDown = (e) => {
  if(!e.target.value) return;
  const keyCode = e.keyCode;
  if (keyCode === 13) {

    scanData.value = e.target.value;
    var newVal  =  scanData.value 

    if (typeof newVal === 'string' && newVal.includes('{') && newVal.includes('}')) {

      // 开始基于当前的内容追加产品入库

      // 替换中文引号为英文引号，并解析 JSON
      newVal = newVal.replace(/"/g, '"').replace(/"/g, '"').replace(/：/g, ':').replace(/，/g, ',');
      console.log(newVal,'newVal 111');
      // 移除零宽度非换行空格字符
      newVal = newVal.replace(/\uFEFF/g, '');

    
      newVal = parseFirstJsonStr( newVal );

      // 直接解析 JSON 字符串

      const data = JSON.parse(newVal);
      try {
        if (data && data.po_no) {
          scanData.value  = null
          wareForm.poNo = data.po_no
          handleBlur()
          refocusScanner()
        }
      } catch (error) {
        ElMessage.error('扫描结果不是有效的 JSON 字符串')
      }
    }  else if(typeof(newVal)==='object' && newVal.po_no){
      wareForm.poNo = newVal.po_no
      scanData.value  = null
      handleBlur()
      refocusScanner()
      }  else {
        console.log('输入内容不包含完整的 "{" 和 "}"');
      }


  }
};
function parseFirstJsonStr(str) {
    let braceCount = 0;
    let inString = false;
    let escape = false;

    for (let i = 0; i < str.length; i++) {
        const char = str[i];

        if (escape) {
            escape = false;
            continue;
        }

        if (char === '\\') {
            escape = true;
            continue;
        }

        if (char === '"') {
            inString = !inString;
        }

        if (!inString) {
            if (char === '{') braceCount++;
            else if (char === '}') {
                braceCount--;
                if (braceCount === 0) {
                    const jsonStr = str.slice(0, i + 1);
                    try {
                        return jsonStr
                    } catch (e) {
                        throw new Error('Invalid JSON object');
                    }
                }
            }
        }
    }

    throw new Error('No valid JSON object found');
}
  // 新增按钮操作
  const handleAdd = () => {
    reset()
    open.value = true
    title.value = '添加采购商品明细'
  }
  // 修改按钮操作
  const handleUpdate = async (row) => {
    reset()
    const id = row.id || selectedRows.value[0].id

    // 追加校验, 禁止修改已入库的单据
    if (row.status != 0) {
      ElMessage.error('该单据已入库，禁止修改！')
      return
    }

    try {
      const response = await listAllUnitmeasure()
      unitOptions.value = response
      const goodsResponse = await getGoods(id)

      // 使用空值合并运算符简化条件判断
      goodsResponse.unitOfMeasure = goodsResponse.unitOfMeasure || goodsResponse.company

      // 新增：自动填充收货数量和单位
      if (!form.receiveNum) {
          form.receiveNum = form.quantity; // 采购数量 -> 收货数量
          form.unitOfMeasure = form.company; // 商品单位 -> 收货单位
        }
      Object.assign(form, goodsResponse)
      open.value = true
      title.value = '修改采购商品明细'
    } catch (error) {
      console.error('获取数据失败:', error)
    }
  }
  
  // 提交按钮
  const submitForm = async () => {
    if (!formRef.value) return
    
    try {
      await formRef.value.validate()
      if (form.id != null) {
        await updateGoods(form)
        ElMessage.success('收货成功')
      } else {
        await createGoods(form)
        ElMessage.success('新增成功')
      }
      open.value = false
      getList()
    } catch (error) {
      console.error('提交失败:', error)
    }
  }
  
  // 删除按钮操作
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
  
  // 导出按钮操作
  const handleExport = async () => {
    const params = { ...queryParams }
    delete params.pageNo
    delete params.pageSize
    
    try {
      await ElMessageBox.confirm('是否确认导出所有采购商品明细数据项?')
      exportLoading.value = true
      const response = await exportGoodsExcel(params)

      console.log('response', response)
      // 假设有一个下载工具函数

      download.excel(response, '采购商品明细.xls')
      ElMessage.success('导出成功')
    } catch (error) {
      console.error('导出失败:', error)
    } finally {
      exportLoading.value = false
    }
  }
  
  // 单据打印
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
        LODOP.ADD_PRINT_TEXT(245, 120, 280, 35, obj.receiveNum + obj.unitOfMeasure)

        LODOP.ADD_PRINT_TEXT(290, 15, 120, 35, "批次号:")
        LODOP.ADD_PRINT_TEXT(290, 120, 280, 35, obj.batchCode)

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
  
  // 批量打印
  const batchPrint = async () => {
    try {
      // 校验当前所选项的收货数量与收货单位是否填写
      for (let i = 0; i < selectedRows.value.length; i++) {
        if (!selectedRows.value[i].receiveNum) {
          ElMessage.error('请先确认第' + (i + 1) + '行的收货数量')
          return
        }
        if (!selectedRows.value[i].unitOfMeasure) {
          ElMessage.error('请先确认第' + (i + 1) + '行的收货单位')
          return
        }
        if (selectedRows[i].status === 0) {
          ElMessage.error('请先对第' + (i + 1) + '行的物料进行收货');
          return;
        }
      }

      await ElMessageBox.confirm('确认批量打印？')
      LODOP.PRINT_INITA(0, 0, 150, 100)
      LODOP.SET_PRINT_PAGESIZE(2, "", "", "热敏纸")

      for (const queryId of selectedRows.value.map(row => row.id)) {
        const response = await getGoods(queryId)
        const obj = response
        
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
        LODOP.ADD_PRINT_TEXT(245, 120, 280, 35, obj.receiveNum + obj.unitOfMeasure)

        LODOP.ADD_PRINT_TEXT(290, 15, 120, 35, "批次号:")
        LODOP.ADD_PRINT_TEXT(290, 120, 280, 35, obj.batchCode)

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

      await updateStatus()
    } catch (error) {
      console.error('批量打印失败:', error)
    }
  }
  
  // 打印完成后，修改当前行的状态
  const updateStatus = async () => {
    try {
      await updateReceiveStatus(selectedRows.value)
      ElMessage.success('打印成功')
      getList()
    } catch (error) {
      console.error('更新状态失败:', error)
    }
  }

  const batchUpdateStatus = async (poNo) => {
    try {
      await batchUpdateReceiveStatus(poNo)
      ElMessage.success('打印成功')
      getList()
    } catch (error) {
      console.error('批量更新状态失败:', error)
    }
  }

  // 初始化仓库数据
  const getWarehouseList = async () => {
    try {
      const response = await getTreeList()
      warehouseOptions.value = response
      warehouseOptions.value.map(w => {
      w.pId = w.id
      w.pName = w.warehouseName
      w.children.map(l => {
        l.pId = l.id
        l.pName = l.locationName
        l.children.map(a => {
          a.pId = a.id
          a.pName = a.areaName
        });
      });
     });
    } catch (error) {
      console.error('获取仓库列表失败:', error)
    }
  }

  // 选择默认的仓库、库区、库位
  const handleWarehouseChanged = (obj) => {
    if (obj != null) {
      wareForm.warehouseId = obj[0]
      wareForm.locationId = obj[1]
      wareForm.areaId = obj[2]
    }
  }

  // 开始入库
  const warehousing = () => {
    wareOpen.value = true
    title.value = '一键入库'
  }

  // 确定入库
  const submitWareForm = async () => {
    try {
      // 校验当前的采购单号的内容是否都已打印的条码
      for (const item of wareList.value) {
        if (item.status === 0) {
          ElMessage.error('存在未打印的单据, 物料号: ' + item.goodsNumber + '，请先打印条码!')
          return
        }
      }
      
      if (!wareForm.wareHouse) {
        ElMessage.error('请选择要入库的位置!')
        return
      }

      const obj = {
        'poNo': wareForm.poNo,
        'warehouseId': wareForm.warehouseId,
        'locationId': wareForm.locationId,
        'areaId': wareForm.areaId,
      }

      loading.value = true
      const response = await startWareHousing(obj)
      
      if (response !== "success") {
        ElMessage.error("入库失败, 请联系系统管理员, 问题如下: " + response)
        return
      }

      wareOpen.value = false
      getList()
      wareForm.poNo = ''
      wareList.value = []
      ElMessage.success('入库成功')
    } catch (error) {
      console.error('入库失败:', error)
    } finally {
      loading.value = false
    }
  }

  // 处理输入框失焦事件
  const handleBlur = async () => {
    if (!wareForm.poNo) {
      return
    }

    // if (wareForm.poNo && (wareForm.poNo.includes('{') || wareForm.poNo.includes('[') || wareForm.poNo.includes('}') || wareForm.poNo.includes(']')) && !wareForm.poNo.includes('"')) {
    //   wareForm.poNo = wareForm.poNo.trim()
    //   let formattedData = wareForm.poNo
    //     .replace(/\s*[:]\s*/g, ':')
    //     .replace(/\s*,\s*/g, ',')
    //     .replace(/\s*{\s*/g, '{')
    //     .replace(/\s*}\s*/g, '}')
    //     .replace(/\s*\[\s*/g, '[')
    //     .replace(/\s*\]\s*/g, ']')
    //     .replace(/([a-zA-Z0-9_]+)(?=\s*[:])/g, '"$1"')
    //     .replace(/(:\s*)([a-zA-Z\u4e00-\u9fa5_-]+)(?=\s*,|\s*\})/g, '$1"$2"')
    //     .replace(/(:\s*)([A-Za-z0-9-]+)(?=\s*,|\s*\})/g, '$1"$2"')

    //   try {
    //     const parsedData = JSON.parse(formattedData)
    //     const data = JSON.stringify(parsedData, null, 2)
    //     const transedData = JSON.parse(data)
    //     if (transedData) {
    //       wareForm.poNo = transedData.po_no
    //     }
    //   } catch (error) {
    //     ElMessage.error('扫描结果不是有效的 JSON 字符串')
    //   }
    // }

    loading.value = true
    try {
      const response = await getAllGoods(wareForm)
      wareList.value = response
    } finally {
      loading.value = false
    }
  }

  // 处理输入事件
  const handleInput = (inputValue) => {
    // 更新 scanResult
    scanResult.value = inputValue
  }

  // 显示拆分弹出框
  const split = () => {
    if (selectedRows.value.length === 0) {
      ElMessage.warning('请选择至少一项进行拆分')
      return
    }
    if (!selectedRows.value[0].receiveNum) {
      ElMessage.warning('请先填写收货数量')
      return
    }

    Object.assign(splitForm, {
      id: selectedRows.value[0].id,
      poNo: selectedRows.value[0].poNo,
      goodsNumber: selectedRows.value[0].goodsNumber,
      receiveNum: selectedRows.value[0].receiveNum,
      unitOfMeasure: selectedRows.value[0].unitOfMeasure
    })

    splitDetails.value = selectedRows.value.map(row => ({
      index: index.value,
      poNo: row.poNo,
      goodsNumber: row.goodsNumber,
      unitOfMeasure: row.unitOfMeasure,
      quantity: ''
    }))

    splitDialogVisible.value = true
  }

  // 新增拆分行
  const addSplitDetail = () => {
    const receiveNum = parseFloat(splitForm.receiveNum)
    const totalQuantity = splitDetails.value.reduce((sum, detail) => {
      return sum + (parseFloat(detail.quantity) || 0)
    }, 0)

    if (totalQuantity >= receiveNum) {
      ElMessage.error('拆分数量总和不能超过采购数量')
      return
    }

    index.value += 1
    const newRow = {
      index: index.value,
      poNo: splitForm.poNo,
      goodsNumber: splitForm.goodsNumber,
      unitOfMeasure: splitForm.unitOfMeasure,
      quantity: ''
    }
    splitDetails.value.push(newRow)
  }

  // 基于当前的采购数量追加拆分行
  const addSplitDetailByCount = async () => {
    try {
      await ElMessageBox.confirm('是否基于当前采购数量' + splitForm.receiveNum + '追加拆分行?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })

      const receiveNum = parseFloat(splitForm.receiveNum)
      const finList = []
      let maxCount = 0

      for (let i = 0; i < receiveNum; i++) {
        finList.push({
          index: i + 1,
          poNo: splitForm.poNo,
          goodsNumber: splitForm.goodsNumber,
          unitOfMeasure: splitForm.unitOfMeasure,
          quantity: 1
        })
        maxCount++
      }

      index.value = maxCount + 1
      splitDetails.value = finList
    } catch (error) {
      // 用户取消操作
    }
  }

  // 删除拆分行
  const removeSplitDetail = (index) => {
    splitDetails.value.splice(index, 1)
    splitDetails.value.forEach((item, idx) => {
      item.index = idx + 1
    })

    if (splitDetails.value.length > 0) {
      index.value = Math.max(...splitDetails.value.map(item => item.index))
    } else {
      index.value = 0
    }
  }

  // 提交拆分
  const submitSplit = async () => {
    const totalQuantity = splitDetails.value.reduce((sum, detail) => {
      return sum + (parseFloat(detail.quantity) || 0)
    }, 0).toFixed(4)

    if (parseFloat(totalQuantity) > parseFloat(splitForm.receiveNum)) {
      ElMessage.error('拆分数量总和不能超过采购数量')
      return
    }

    for (const detail of splitDetails.value) {
      if (!detail.quantity || parseFloat(detail.quantity) === 0) {
        ElMessage.error('拆分行的数量禁止为空或0')
        return
      }
    }

    const obj = {
      'id': splitForm.id,
      'poNo': splitForm.poNo,
      'goodsNumber': splitForm.goodsNumber,
      'splitDetails': splitDetails.value
    }

    loading.value = true
    try {
      await splitGoods(obj)
      splitDialogVisible.value = false
      getList()
      index.value = 1
      ElMessage.success('拆分成功')
    } catch (error) {
      console.error('拆分失败:', error)
    } finally {
      loading.value = false
    }
  }

  // 显示按条件拆分弹出框
  const conditionSplit = () => {
    if (selectedRows.value.length === 0) {
      ElMessage.warning('请选择至少一项进行拆分')
      return
    }
    if (!selectedRows.value[0].receiveNum) {
      ElMessage.warning('请先填写收货数量')
      return
    }
    splitConditionDialogVisible.value = true
  }

  // 确认按条件拆分
  const confirmConditionSplit = () => {
    if (!splitConditionForm.splitQuantity || !splitConditionForm.splitCount) {
      ElMessage.error('拆分数量和拆分个数不能为空')
      return
    }

    const splitQuantity = parseFloat(splitConditionForm.splitQuantity)
    const splitCount = parseInt(splitConditionForm.splitCount, 10)

    if (splitQuantity * splitCount > selectedRows.value[0].receiveNum) {
      ElMessage.error('拆分数量乘以拆分个数不能大于当前的入库数量')
      return
    }

    splitDetails.value = []
    for (let i = 0; i < splitCount; i++) {
      splitDetails.value.push({
        index: i + 1,
        poNo: selectedRows.value[0].poNo,
        goodsNumber: selectedRows.value[0].goodsNumber,
        unitOfMeasure: selectedRows.value[0].unitOfMeasure,
        quantity: splitQuantity
      })
    }

    index.value = splitDetails.value.length + 1
    splitConditionDialogVisible.value = false
    splitDialogVisible.value = true
    splitConditionForm.splitQuantity = ''
    splitConditionForm.splitCount = ''
  }

  const cancelSplit = () => {
    splitConditionDialogVisible.value = false
    splitConditionForm.splitQuantity = ''
    splitConditionForm.splitCount = ''
  }

  
  // 收货
  const receive = () => {
    if (selectedRows.value.length === 0) {
      ElMessage.warning('请选择至少一项进行收货')
      return
    }
    
    for (let i = 0; i < selectedRows.value.length; i++) {
      if (!selectedRows.value[i].receiveNum) {
        ElMessage.warning(`请先填写第${i + 1}行收货数量!`)
        return
      }
    }

    // 先收货再拆分
    // 允许用户跨采购单进行收货, 卡控仅允许选中相同的供应商信息
    /* let poNo = selectedRows.value[0].poNo;
    for (let i = 0; i < selectedRows.value.length; i++) {
      if (selectedRows.value[i].poNo !== poNo) {
        ElMessage.error('请选择相同的采购单进行收货');
        return;
      }
    } */

    // 调用后台收货接口
    const obj = {
      'list': selectedRows.value,
    }

    ElMessageBox.confirm('确定收货吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      loading.value = true
      receiving(obj).then(response => {
        if (response !== "success") {
          ElMessage.error(`收货失败, 请联系系统管理员, 问题如下: ${response}`)
          return
        }
        loading.value = false
        getList()
        index.value = 1
        ElMessage.success('收货成功')
      }).catch(error => {
        console.error('收货操作失败:', error)
        ElMessage.error('收货操作失败，请稍后重试')
      }).finally(() => {
        loading.value = false
      })
    }).catch(() => {
      // 用户取消操作
    })
  }
  
  // ... 其他代码 ...
</script>
  

<style lang="scss" scoped>

</style>
