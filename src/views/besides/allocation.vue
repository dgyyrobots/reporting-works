<template>
  <div class="app-container">
    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" :size="currentSize" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="调拨单号" prop="allocatedCode">
        <el-input v-model="queryParams.allocatedCode" placeholder="请输入调拨单编号" clearable @keyup.enter="handleQuery"/>
      </el-form-item>
      <el-form-item label="调拨单名称" prop="allocatedName">
        <el-input v-model="queryParams.allocatedName" placeholder="请输入调拨单名称" clearable @keyup.enter="handleQuery"/>
      </el-form-item>
      <el-form-item label="工单编码" prop="workorderCode">
        <el-input v-model="queryParams.workorderCode" placeholder="请输入生产工单编码" clearable @keyup.enter="handleQuery"/>
      </el-form-item>

      <el-form-item label="仓库名称" prop="warehouseName">
        <el-input v-model="queryParams.warehouseName" placeholder="请输入仓库名称" clearable @keyup.enter="handleQuery"/>
      </el-form-item>

      <el-form-item label="调拨日期" prop="allocatedDate">
          <el-date-picker
          v-model="queryParams.allocatedDate"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleQuery">搜索</el-button>
        <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作工具栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary"  :icon="Plus" :size="currentSize" @click="handleAdd"
                   v-hasPermi="['wms:allocated-header:create']">新增
        </el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="warning" plain :icon="Download" :size="currentSize" @click="handleExport" :loading="exportLoading"
                   v-hasPermi="['wms:allocated-header:export']">导出
        </el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="success" plain :icon="Edit" :size="currentSize" @click="handleFinsh" :disabled="single"
                   v-hasPermi="['wms:allocated-header:finsh']">完成
        </el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button plain :icon="Edit" :size="currentSize" @click="handleIssue" :disabled="single"
                   v-hasPermi="['wms:allocated-header:createIssue']">生成领料单
        </el-button>
      </el-col>
    </el-row>
    <div class="table-container"  ref="tableContainerRef" >
    <!-- 列表 -->
      <el-table v-loading="loading"  ref="multipleTableRef" :height="tableHeight" :data="list" :size="currentSize" class="touch-scroll-table" @selection-change="handleSelectionChange"   @row-click="handleRowClick">
        <el-table-column type="selection" width="55" align="center" v-if="!isExecuteDetail" />
        <el-table-column label="调拨单编号" align="center" prop="allocatedCode"/>
        <el-table-column label="调拨单名称" align="center" prop="allocatedName"/>
        <el-table-column label="生产工单" align="center" prop="workorderCode"/>
        <el-table-column label="调拨日期" align="center" prop="allocatedDate">
          <template #default="scope">
            <span>{{ formatDate(scope.row.allocatedDate,'YYYY-MM-DD') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单据状态" align="center" prop="status">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.MES_ALLOCATED_STATUS" :value="scope.row.status"/>
          </template>
        </el-table-column>

        <el-table-column label="操作" fixed="right" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button :size="currentSize" type="text"  v-if="scope.row.status != 'FINISHED'" @click="handleExecute(scope.row)" v-hasPermi="['wms:allocated-header:allocated']">执行领出</el-button>
            <el-button :size="currentSize" type="text"  @click="handleUpdate(scope.row)"
                      v-hasPermi="['wms:allocated-header:update']">修改
            </el-button>
            <el-button :size="currentSize" type="text"  @click="handleDelete(scope.row)"
                      v-hasPermi="['wms:allocated-header:delete']">删除
            </el-button>
            <el-button :size="currentSize" type="text"  @click="handleExecuteDetail(scope.row)" v-hasPermi="['wms:allocated-header:allocated']">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
        @pagination="getList"/> 
      </div>

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" v-model="open" width="90%" v-dialogDrag append-to-body>
      <el-form ref="formRef" :size="currentSize" :model="form" :rules="rules" >
        <el-row>
          <el-col :span="8">
            <el-form-item label="调拨单编号" prop="allocatedCode">
              <el-input :disabled="isEdit" v-model="form.allocatedCode" placeholder="请输入调拨单编号"/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item >
              <el-switch v-model="autoGenFlag" active-color="#13ce66" active-text="自动生成" @change="handleAutoGenChange" v-if="optType != 'view' && form.status == 'PREPARE'"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="调拨单名称" prop="allocatedName">
              <el-input disabled v-model="form.allocatedName" placeholder="请输入调拨单名称"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="调拨日期" prop="allocatedDate">
              <el-date-picker clearable v-model="form.allocatedDate" type="date"     @change="handAllocatedDateChangeForm" placeholder="选择调拨日期"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="领料仓库">
              <el-cascader
                v-model="warehouseInfo"
                :options="warehouseOptions"
                :props="warehouseProps"
                placeholder="请选择"
                @change="handleWarehouseChanged"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单据状态" prop="status">
              <el-select v-model="form.status" disabled>
                <el-option v-for="dict in DICT_TYPE.MES_ALLOCATED_STATUS" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="2"></el-col>
          <el-col :span="6">
            <el-form-item label-width="80">
              <el-switch style="margin-left: 10%;" v-model="form.bindWorkorder" active-color="#13ce66" inactive-text="绑定工单" @change="handleBindWorkorderChange" v-if="optType != 'view' && form.status == 'PREPARE'"></el-switch>
            </el-form-item>
          </el-col>

          <el-col :span="8" v-if="form && form.bindWorkorder">
            <el-form-item label="生产工单" prop="workorderCode">
              <el-input v-model="form.workorderCode" placeholder="请选择生产工单">
                <template #append>
                  <el-button :icon="Search" @click="handleWorkorderSelect"></el-button>
                </template>
              </el-input>
            </el-form-item>
            <WorkorderSelect ref="woSelectRef" @onSelected="onWorkorderSelected"></WorkorderSelect>
          </el-col>

          <el-col :span="8" v-if="form && form.bindWorkorder">
            <el-form-item label="生产任务" prop="taskCode">
              <el-input v-model="form.taskCode" placeholder="请选择生产任务">
                <template #append>
                  <el-button :icon="Search" @click="handleTaskSelect"></el-button>
                </template>
              </el-input>
            </el-form-item>
            <ProtaskSelect ref="taskSelectRef" :workorderId="form.workorderId" @onSelected="onTaskSelected"></ProtaskSelect>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入内容"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div v-if="form && form.bindWorkorder">
      <el-divider content-position="center">物料信息</el-divider>
      <el-card shadow="always" class="box-card">

        <el-table v-loading="bomLoadding" :size="currentSize" max-height="300" :data="bomList" @selection-change="handleBomSelectionChange">
          <el-table-column type="selection" width="65" align="center"/>
          <el-table-column label="物料编码" align="center" prop="itemCode"/>
          <el-table-column label="物料名称" :show-overflow-tooltip="true" align="center" prop="itemName"/>
          <el-table-column width="210" label="需求数量" align="center" prop="quantityAllocated"/>
          <el-table-column width="80" label="单位" align="center" prop="unitOfMeasure"/>
        </el-table>

      </el-card>

      <el-divider content-position="center">调拨信息</el-divider>
      <el-card shadow="always" class="box-card">
  
        <el-table v-loading="bomLoadding" :size="currentSize" max-height="300" :data="allocatedList" row-key="itemCode">
          <el-table-column  label="物料编码" :show-overflow-tooltip="true" align="center" prop="itemCode"/>
          <el-table-column  label="物料名称" :show-overflow-tooltip="true" align="center" prop="itemName"/>
          <el-table-column width="220" label="调拨数量" align="center" prop="quantityAllocated">

            <template #default="scope">
              <el-input
                v-model="scope.row.quantityAllocated"
                type="number"
                placeholder="请输入数量"
                @blur="handleQuantityChange(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column width="80" label="单位" align="center" prop="unitOfMeasure"/>
        </el-table>

      </el-card>

      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button :size="currentSize" type="primary" @click="submitForm">确 定</el-button>
          <el-button :size="currentSize" @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 执行出库对话框 -->
    <el-dialog :title="isExecuteDetail?'详情':'执行出库'"  class="execute-dialog" v-model="executeDialogVisible" width="92%" v-dialogDrag append-to-body>
      <el-form :size="currentSize" ref="executeFormRef" :model="executeForm" label-width="100px">

        <el-row>
          <el-col :span="8">
            <el-form-item label="调拨单编号" prop="allocatedCode">
              <el-input v-model="executeForm.allocatedCode" disabled placeholder="请输入调拨单编号"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="调拨单名称" prop="allocatedName">
              <el-input v-model="executeForm.allocatedName" disabled placeholder="请输入调拨单名称"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="调拨日期" prop="allocatedDate">
              <el-date-picker clearable v-model="executeForm.allocatedDate" disabled type="date"  @change="handAllocatedDateChangeExecuteForm" placeholder="选择调拨日期"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="领料仓库">
              <el-cascader disabled v-model="warehouseInfo" :options="warehouseOptions" :props="warehouseProps" @change="handleWarehouseChanged"></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单据状态" prop="status">
              <el-select disabled v-model="executeForm.status">
                <el-option v-for="dict in DICT_TYPE.MES_ALLOCATED_STATUS" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row v-if="executeForm.bindWorkorder">

          <el-col :span="8">
            <el-form-item label="生产工单" prop="workorderCode">
              <el-input disabled v-model="executeForm.workorderCode" placeholder="请选择生产工单">
                <template #append>
                  <el-button disabled :icon="Search" @click="handleWorkorderSelect"></el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="生产任务" prop="taskCode">
              <el-input disabled v-model="executeForm.taskCode" placeholder="请选择生产任务">
                <template #append>
                  <el-button disabled :icon="Search" @click="handleTaskSelect"></el-button>
                </template>
              </el-input>
            </el-form-item>
            <ProtaskSelect ref="taskSelectRef" :workorderId="executeForm.workorderId" @onSelected="onExecuteTaskSelected"></ProtaskSelect>
          </el-col>

          <el-col :span="8">
            <el-form-item label="客户编号">
              <el-input disabled v-model="executeForm.clientCode" placeholder="请选择生产工单"></el-input>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input disabled v-model="executeForm.remark" placeholder="请输入内容"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider v-if="executeForm.bindWorkorder" content-position="center">BOM信息</el-divider>
    
        <el-table :size="currentSize" v-if="executeForm.bindWorkorder" v-loading="bomLoadding" max-height="200" :data="bomList" style="width: 100%">
          <el-table-column label="物料编码" :show-overflow-tooltip="true" align="center" prop="itemCode"/>
          <el-table-column label="物料名称" :show-overflow-tooltip="true" align="center" prop="itemName"/>
          <el-table-column  label="需求数量" align="center" prop="quantityAllocated"/>
          <el-table-column width="80" label="单位" align="center" prop="unitOfMeasure"/>
        </el-table>

        <el-divider content-position="center">调拨信息</el-divider>

        <el-row :gutter="10" v-if="!isExecuteDetail">
          <el-col :span="8">
            <el-form-item label="单据信息" prop="purchaseId">
              <el-input  readonly v-model="purchaseId" placeholder="请输入"/>
              <input ref="scannerInput" v-model="scanData" placeholder="请输入" style="position: absolute; opacity: 0; width: 1; height: 1; z-index: -1; -webkit-user-select: none" inputmode="none" autofocus />
              <span>支持扫码枪扫描, 无法扫码时点击重置按钮</span>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <!-- <el-button type="primary" round @click="">摄像头</el-button> -->
            <el-button type="primary" round @click="handResetPurchaseId">重置</el-button>
          </el-col>
          <el-col :span="2.5">
            <el-button type="primary" style="margin-right: 10px;" :icon="Plus" :size="currentSize" @click="allocatedHandleAdd">新增</el-button>
          </el-col>

          <el-col :span="2.5">
            <el-button type="primary" style="margin-right: 10px;" :icon="Plus" :size="currentSize" v-hasPermi="['wms:allocated-header:batchAdd']" @click="allocatedHandleBatchAdd">批量新增</el-button>
          </el-col>
          <StockSelect ref="stockSelectRef" @onSelected="onStockSelected"></StockSelect>

          <el-col :span="2.5">
            <el-button type="danger"  :icon="Delete" :size="currentSize" :disabled="allocatedSingle" @click="allocatedHandleDelete">删除</el-button>
          </el-col>
        </el-row>
        <el-table :size="currentSize" v-loading="loading" :data="allocatedList" @selection-change="allocatedHandleSelectionChange">
          <el-table-column type="selection" width="55" align="center" v-if="!isExecuteDetail" />
          <el-table-column label="序号" width="55" align="center">
            <template #default="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column  label="物料编码" :show-overflow-tooltip="true" align="center" prop="itemCode"/>
          <el-table-column  label="物料名称" :show-overflow-tooltip="true" align="center" prop="itemName"/>
          <el-table-column  label="调拨数量" :show-overflow-tooltip="true"  align="center" prop="quantityAllocated"/>
          <el-table-column width="70" label="单位" align="center" prop="unitOfMeasure"/>
          <el-table-column label="批次号"  :show-overflow-tooltip="true" align="center" prop="batchCode"/>
          <el-table-column label="调拨标识" :show-overflow-tooltip="true" width="90"  align="center" prop="allocatedFlag"/>
          <el-table-column label="仓库名称"  :show-overflow-tooltip="true" align="center" prop="warehouseName"/>
          <el-table-column label="库区名称" :show-overflow-tooltip="true" align="center" prop="locationName"/>
          <el-table-column label="库位名称"  :show-overflow-tooltip="true" align="center" prop="areaName"/>
        </el-table>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button :size="currentSize" @click="cancel">取 消</el-button>
          <el-button :size="currentSize" v-if="!isExecuteDetail"  type="primary" @click="executeAllocated">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue';
import {createAllocatedHeader, updateAllocatedHeader, deleteAllocatedHeader, getAllocatedHeader, getAllocatedHeaderPage, exportAllocatedHeaderExcel, initBomInfo, execute, finshAllocatedHeader , updateAllocatedLine, createIssue} from "@/api/wms/allocatedHeader";
import {genCode} from '@/api/mes/autocode/rule';
  import { Search, Refresh, Plus, Download, Edit, Delete } from '@element-plus/icons-vue'
import WorkorderSelect from '@/components/workorderSelect/single.vue';
import {getTreeList} from '@/api/mes/wm/warehouse';
import {getStockInfoByPurchaseId} from "@/api/purchase/goods";
import ProtaskSelect from '@/components/TaskSelect/taskSelectSingle.vue';
import {getAllocatedRecordByHeaderId} from  "@/api/wms/allocatedRecord";
import StockSelect from '@/components/stockSelect/multi.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { formatDate } from '/@/utils/formatTime'
import { DICT_TYPE } from '@/utils/dict'
import { CACHE_KEY, useCache } from '/@/hooks/web/useCache'
import download from '~/library/plugins/download'
import { useAppStore } from '@/store/modules/app'
import { useRoute } from 'vue-router'

const appStore = useAppStore()
const currentSize = computed(() => appStore.currentSize === 'mini' ? 'small' : appStore.currentSize)
// 组件引用
const queryForm = ref(null);
const formRef = ref(null)
const route = useRoute();
const form = ref({
  id: null,
  allocatedCode: null,
  allocatedName: null,
  workstationId: null,
  workstationCode: null,
  workstationName: null,
  workorderId: null,
  workorderCode: null,
  taskId: null,
  taskCode: null,
  clientId: null,
  clientCode: null,
  clientName: null,
  clientNick: null,
  warehouseId: null,
  warehouseCode: null,
  warehouseName: null,
  locationId: null,
  locationCode: null,
  locationName: null,
  areaId: null,
  areaCode: null,
  areaName: null,
  allocatedDate: null,
  status: 'PREPARE',
  remark: null,
  bindWorkorder: false, // 默认不绑
});
const executeForm = ref({
  bindWorkorder: false,
  status: '',
  allocatedDate: null,
  workorderCode: '',
  taskCode: '',
  clientCode: '',
  remark: '',
  workorderId: null,
  taskId: null
});
// 添加表格容器引用
const tableContainerRef = ref(null);
// 添加表格高度响应式变量
const tableHeight = ref(500); // 默认高度

const executeFormRef = ref(null)
const woSelectRef = ref(null);
const taskSelectRef = ref(null);
const stockSelectRef = ref(null);

// 基础数据
const autoGenFlag = ref(false);
const optType = ref(undefined);
const warehouseInfo = ref([]);
const warehouseOptions = ref([]);
const warehouseProps = reactive({
  multiple: false,
  value: 'pId',
  label: 'pName',
});

const loading = ref(true);
const bomLoadding = ref(false);
// 选中数组
const ids = ref([]);
const allocatedIds = ref([]);
// 非单个禁用
const single = ref(true);
const allocatedSingle = ref(true);
// 非多个禁用
const multiple = ref(true);
const allocatedMultiple = ref(true);
// 导出遮罩层
const exportLoading = ref(false);
// 显示搜索条件
const showSearch = ref(true);
// 总条数
const total = ref(0);
// 调拨单头列表
const list = ref([]);
// 弹出层标题
const title = ref("");
// 是否显示弹出层
const open = ref(false);
// 查询参数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 20,
  allocatedCode: null,
  allocatedName: null,
  workstationId: null,
  workstationCode: null,
  workstationName: null,
  workorderId: null,
  workorderCode: null,
  taskId: null,
  taskCode: null,
  clientId: null,
  clientCode: null,
  clientName: null,
  clientNick: null,
  warehouseId: null,
  warehouseCode: null,
  warehouseName: null,
  locationId: null,
  locationCode: null,
  locationName: null,
  areaId: null,
  areaCode: null,
  areaName: null,
  allocatedDate: [],
  status: null,
  remark: null,
  createTime: [],
  bindWorkorder: null, // 默认不绑定工单
});
const multipleTableRef = ref(null);

// 表单参数


const bomList = ref([]); // 存储工单BOM信息
const allocatedList = ref([]); // 存储调拨信息

// 表单校验
const rules = reactive({
  allocatedCode: [{required: true, message: "调拨单编号不能为空", trigger: "blur"}],
  warehouseId: [{required: true, message: '请指定调入仓库', trigger: 'blur'}],
  locationId: [{required: true, message: '请指定调入库区', trigger: 'blur'}],
  areaId: [{required: true, message: '请指定调入库位', trigger: 'blur'}],
  workorderCode: [], // 改为动态规格
  taskCode: [],
});

const executeDialogVisible = ref(false);
// 是不是执行出库的详情
const isExecuteDetail = ref(false);

const scannerInput =ref(null)
const scanData = ref(null)

const executeFormData = reactive({});
const purchaseId = ref(null);

// 计算属性
const isEdit = computed(() => {
  return optType.value === 'edit';
});



// 生命周期钩子
onMounted(() => {
  getList();
  getWarehouseList();
  // console.log('开始监测');
  window.addEventListener("keydown", handleKeyDown);

  // 添加全局点击事件监听器
  document.addEventListener('click', handleDocumentClick);

  nextTick(() => {
    setTimeout(() => {
      scannerInput.value && scannerInput.value.focus();
    },1000);
  });
  // 添加窗口大小变化监听
  window.addEventListener('resize', calculateTableHeight);
  // 初始计算表格高度
  calculateTableHeight();

});

onUnmounted(() => {
  remove_keydownlistener();
    // 移除窗口大小变化监听
  window.removeEventListener('resize', calculateTableHeight);
});
// 监听路由变化重新计算高度
watch(() => route.path, () => {
  nextTick(() => {
    calculateTableHeight();
  });
});



// 添加对话框显示状态的监听
watch(() => executeDialogVisible.value, (newVal) => {

  if (newVal) {
    // 对话框打开后，等待DOM渲染完成并设置焦点
    nextTick(() => {
      refocusScanner()
    });
  }else {
    purchaseId.value = null
  }
});


const handAllocatedDateChangeForm = (value) => {
  if (value) {
   form.value.allocatedDate =  new Date(value).getTime()
 } else if (value === null) {
   form.value.allocatedDate =  null
  }
};

const handAllocatedDateChangeExecuteForm = (value) => {
  if (value) {
   executeForm.value.allocatedDate =  new Date(value).getTime()
 } else if (value === null) {
   executeForm.value.allocatedDate =  null
  }
};


const remove_keydownlistener = () => {
  window.removeEventListener("keydown", handleKeyDown, false);
    // 移除点击事件监听器
  document.removeEventListener('click', handleDocumentClick);
};

const handleDocumentClick = () => {
  if (executeDialogVisible.value && scannerInput.value) {
    refocusScanner();
  }
}
const handleKeyDown = (e) => {
  const keyCode = e.keyCode;


  if (keyCode === 13) {

    if(!e.target.value) return;
    scanData.value = e.target.value;
    var newVal  =  scanData.value 

    if (typeof newVal  === 'string' && newVal.includes('{') && newVal.includes('}')) {


      let type = '';
      // 开始基于当前的内容追加产品入库

      // 替换中文引号为英文引号，并解析 JSON
      newVal = newVal.replace(/"/g, '"').replace(/"/g, '"').replace(/：/g, ':').replace(/，/g, ',');
      console.log(newVal,'newVal 111');
      // 移除零宽度非换行空格字符
      newVal = newVal.replace(/\uFEFF/g, '');

      try{
        newVal = parseFirstJsonStr( newVal );
        // 直接解析 JSON 字符串
        const data = JSON.parse(newVal);
        // 检查是否包含 id 属性
        if (data) {
          purchaseId.value = data.id;
          scanData.value  = null
          type = data.type;
          refocusScanner()
        }
        handleBlur(type);
      } catch (error) {
        console.log('输入内容不包含完整的 "{" 和 "}"');
      } 
    }
    else if(typeof(newVal)==='object' && newVal.id){
      let type = '';
      purchaseId.value = newVal.id;
      type = newVal.type;
      scanData.value  = null
      refocusScanner()
      handleBlur(type);
      }
      else {
      console.log('输入内容不包含完整的 "{" 和 "}"');
      }

  }
};

// 计算表格高度的方法
const calculateTableHeight = () => {
  nextTick(() => {
    if (!tableContainerRef.value) return;
    
    // 获取视窗高度
    const windowHeight = window.innerHeight;
    // 获取表格容器到顶部的距离
    const containerTop = tableContainerRef.value.getBoundingClientRect().top;


    // 底部预留空间（分页等）
    const bottomReserved = 100;
    
    // 计算表格可用高度
    const availableHeight = windowHeight - containerTop - bottomReserved;


    // 设置最小高度
    tableHeight.value = Math.max(300, availableHeight);

  });
};
const handResetPurchaseId = () => {
  purchaseId.value = null;
  scanData.value = null
  refocusScanner()
};
  
const handleSelectionChange = (selection) => {
    ids.value = selection.map(item => item.id);
    single.value = selection.length !== 1
    multiple.value = !selection.length
}
const handleRowClick = (row) => {
  multipleTableRef.value?.toggleRowSelection(row)
};

// 返回{"id":4324,"type":"purchase","po_no":"AMCG83-241122002"}{"id":11,"type":"feedback"} ,只需要第一个
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
// 添加一个重新获取焦点的方法
const refocusScanner = () => {
  if (executeDialogVisible.value && scannerInput.value) {
    nextTick(() => {
      setTimeout(() => {
        scannerInput.value && scannerInput.value.focus();
      }, 300);
    });
  }
};
// 方法
const getList = () => {
  loading.value = true;
  // 执行查询
  getAllocatedHeaderPage(queryParams).then(response => {
    list.value = response.list;
    total.value = response.total;
    loading.value = false;
  });
};

const getWarehouseList = () => {
  getTreeList().then(response => {
    warehouseOptions.value = response;
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
  });
};

const cancel = () => {
  open.value = false;
  bomList.value = []; // 清空BOM信息
  allocatedList.value = []; // 清空调拨信息
  executeDialogVisible.value = false;
  reset();
};

const reset = () => {
  Object.assign(form.value, {
    id: null,
    allocatedCode: null,
    allocatedName: null,
    workstationId: null,
    workstationCode: null,
    workstationName: null,
    workorderId: null,
    workorderCode: null,
    taskId: null,
    taskCode: null,
    clientId: null,
    clientCode: null,
    clientName: null,
    clientNick: null,
    warehouseId: null,
    warehouseCode: null,
    warehouseName: null,
    locationId: null,
    locationCode: null,
    locationName: null,
    areaId: null,
    areaCode: null,
    areaName: null,
    allocatedDate: null,
    status: 'PREPARE',
    remark: null,
    bomList: [],
  });

    // 添加对 executeForm.value 的重置
  Object.assign(executeForm.value, {
    id: null,
    allocatedCode: null,
    allocatedName: null,
    workstationId: null,
    workstationCode: null,
    workstationName: null,
    workorderId: null,
    workorderCode: null,
    taskId: null,
    taskCode: null,
    clientId: null,
    clientCode: null,
    clientName: null,
    clientNick: null,
    warehouseId: null,
    warehouseCode: null,
    warehouseName: null,
    locationId: null,
    locationCode: null,
    locationName: null,
    areaId: null,
    areaCode: null,
    areaName: null,
    allocatedDate: null,
    status: 'PREPARE',
    remark: null,
    bindWorkorder: false,
  });
    // 重置 executeFormData
  Object.keys(executeFormData).forEach(key => {
    delete executeFormData[key];
  });
  autoGenFlag.value = false;
  bomList.value = [];
  warehouseInfo.value = []; // 重置领料仓库信息
  if (formRef.value) {
    formRef.value.resetFields();
  }
  if (executeFormRef.value) {
    executeFormRef.value.resetFields();
  }
};

const handleQuery = () => {
  queryParams.pageNo = 1;
  getList();
};

const resetQuery = () => {
  if (queryForm.value) {
    queryForm.value.resetFields();
  }
  handleQuery();
};



const handleAdd = () => {
  reset();
  open.value = true;
  title.value = "添加调拨单";
  optType.value = 'add';
  warehouseInfo.value = [];
};

const handleUpdate = (row) => {
  reset();
  const id = row.id;
  getAllocatedHeader(id).then(response => {
    Object.assign(form.value, response);
    form.value.bindWorkorder = form.value.bindWorkorder === "true";

    // 设置领料仓库信息
    warehouseInfo.value = [
      response.warehouseId,
      response.locationId,
      response.areaId
    ];
    bomList.value = response.bomList; // 获取BOM信息
    allocatedList.value = []; // 清空调拨信息
    open.value = true;
    title.value = "修改调拨单";
    optType.value = 'edit';
  });
};

const submitForm = () => {
  formRef.value.validate(valid => {
    if (!valid) {
      return;
    }
    if(!form.value.bindWorkorder){
      form.value.bindWorkorder = false;
    }
    if(form.value.warehouseId == null || form.value.locationId == null || form.value.areaId == null){
      ElMessage.error("请选择调拨仓库、库区、库位信息！");
      return;
    }
    if (allocatedList.value.length === 0 && form.value.bindWorkorder === true) {
      ElMessage.error("请选择需要调拨的BOM信息");
      return;
    }
    form.value.bomList = allocatedList.value.map(item => ({
      ...item, quantityAllocated: parseFloat(item.quantityAllocated)
    }));

    // 修改的提交

    if (form.value.id != null) {
    
      updateAllocatedHeader(form.value).then(response => {
        ElMessage.success("修改成功");
        open.value = false;
        getList();
      });

      return;
    }
    form.value.bomList = allocatedList.value; // 追加选中的需要调拨的Bom信息

    // 添加的提交
    createAllocatedHeader(form.value).then(response => {
      ElMessage.success("新增成功");
      open.value = false;
      getList();
    });
  });
};

const handleDelete = (row) => {
  const id = row.id;
  ElMessageBox.confirm('是否确认删除调拨单头编号为"' + id + '"的数据项?').then(() => {
    return deleteAllocatedHeader(id);
  }).then(() => {
    getList();
    ElMessage.success("删除成功");
  }).catch(() => {});
};

const handleExport = () => {
  // 处理查询参数
  let params = {...queryParams};
  params.pageNo = undefined;
  params.pageSize = undefined;
  ElMessageBox.confirm('是否确认导出所有调拨单头数据项?').then(() => {
    exportLoading.value = true;
    return exportAllocatedHeaderExcel(params);
  }).then(response => {
    // 假设有一个全局的下载方法
    download.excel(response, '调拨单头.xls');
    ElMessage.success('导出成功')
    exportLoading.value = false;
  }).catch(() => {});
};

const handleWarehouseChanged = (value) => {
  if (value !== null) {
    form.value.warehouseId = value[0]; // 仓库
    form.value.locationId = value[1]; // 库区
    form.value.areaId = value[2]; // 库位
  } else {
    form.value.warehouseId = null;
    form.value.locationId = null;
    form.value.areaId = null;
  }
};

const handleWorkorderSelect = () => {
  if (woSelectRef.value) {
    woSelectRef.value.showFlag = true;
  } else {
    ElMessage.warning('工单选择组件未加载完成，请稍后再试');
  }
};

const onWorkorderSelected = (row) => {
  if (row != undefined && row != null) {
    form.value.workorderId = row.id;
    form.value.workorderCode = row.workorderCode;
    form.value.workorderName = row.workorderName;
    form.value.clientId = row.clientId;
    form.value.clientCode = row.clientCode;
    form.value.clientName = row.clientName;
  }
  bomLoadding.value = true;
  // 追加工单BOM信息
  initBomInfo(form.value.workorderCode).then(response => {
    bomList.value = response;
    bomLoadding.value = false;
  });
};

const handleAutoGenChange = (autoGenFlag) => {
  if (autoGenFlag) {
    loading.value = true;
    genCode('ALLOCATED_CODE').then(response => {
      form.value.allocatedCode = response;
      loading.value = false;
    });
  } else {
    form.value.allocatedCode = null;
  }
};

const handleFinsh = (row) => {
  reset();
  const allocatedId = row.id || ids.value;

  loading.value = true;
  // 完成
  finshAllocatedHeader(allocatedId).then(response => {
    ElMessage.success("成功");
    open.value = false;
    loading.value = false;
    getList();
  }).catch(() => {
    loading.value = false;
    getList();
  });
};

const handleBomSelectionChange = (selection) => {
  allocatedList.value = selection.map(item => ({ ...item }));
};

const handleExecute = (row) => {
  openExecuteDialog(row.id, false);
};

const handleExecuteDetail = (row) => {
  openExecuteDialog(row.id, true);
};

const openExecuteDialog = (allocatedId, isDetail) => {
  // isExecuteDetail  是不是详情按钮
  executeFormData.id = allocatedId; // 传递需要执行出库的调拨单ID
  nextTick(() => {
    if (executeFormRef.value) {
      executeFormRef.value.resetFields(); // 重置表单
    }
  });
  getAllocatedHeader(allocatedId).then(response => {
    Object.assign(executeFormData, response);
    executeFormData.bindWorkorder = executeFormData.bindWorkorder === "true";

    // 设置领料仓库信息
    warehouseInfo.value = [
      response.warehouseId,
      response.locationId,
      response.areaId
    ];
    warehouseInfo.value[0] = response.warehouseId;
    warehouseInfo.value[1] = response.locationId;
    warehouseInfo.value[2] = response.areaId;
    bomList.value = response.bomList; // 获取BOM信息
  });

  // 渲染调拨单单身记录
  getAllocatedRecordByHeaderId(allocatedId).then(response => {
    allocatedList.value = response;
  });
  isExecuteDetail.value =  isDetail;
  executeDialogVisible.value = true; // 控制弹出框显示
};

const allocatedHandleAdd = () => {
  if (!purchaseId.value) {
    ElMessage.error('请扫描正确的单据信息!');
    return;
  }
  
  handleBlur();
};

const allocatedHandleBatchAdd = () => {
  if (stockSelectRef.value) {
    stockSelectRef.value.showFlag = true;
    stockSelectRef.value.getList();
  } else {
    ElMessage.warning('库存选择组件未加载完成，请稍后再试');
  }
};

const allocatedHandleDelete = () => {
  const ids = allocatedIds.value;
  // 将allocatedList中的列表进行循环,若行Id等于当前选中的ids则进行删除
  allocatedList.value = allocatedList.value.filter(item => !ids.includes(item.id));
};

const allocatedHandleSelectionChange = (selection) => {
  allocatedIds.value = selection.map(item => item.id);
  allocatedSingle.value = selection.length !== 1;
  allocatedMultiple.value = !selection.length;
};

const handleBlur = (type) => {
  let finType = '';
  if(type){
    finType = type;
  }
  if(!warehouseInfo.value || 
     !Array.isArray(warehouseInfo.value) || 
     warehouseInfo.value.length < 3 || 
     !warehouseInfo.value[0] || 
     !warehouseInfo.value[1] || 
     !warehouseInfo.value[2]) {
    ElMessage.error('请选择调拨仓库、库区、库位信息！');
    return;
  }
  if (!purchaseId.value) {
    ElMessage.error('请输入或扫描单据信息!');
    return;
  }

   // 优化 parseInt 处理，添加错误检查
   const parsedId = parseInt(purchaseId.value);
  if (isNaN(parsedId)) {
    ElMessage.error('单据ID格式不正确，请重新输入或扫描!');
    return;
  }

  let obj = {
    'id': parsedId, // 使用已验证的数字
    'type': finType,
    'method': 'allocated',
    'warehouseId': warehouseInfo.value[0],
    'locationId': warehouseInfo.value[1],
    'areaId': warehouseInfo.value[2]
  }

  loading.value = true;
  getStockInfoByPurchaseId(obj).then(response => {
    loading.value = false;
    // purchaseId.value = null;
    let obj = response;
    obj.quantityAllocated = obj.quantityOnhand

    //this.allocatedList.push(obj);
    const isItemCodeExists = allocatedList.value.some(item => item.itemCode === obj.itemCode && item.batchCode === obj.batchCode);
    // 如果物料Id不存在，则添加到this.allocatedList
    if (!isItemCodeExists) {
      ElMessage.success("新增成功");
      allocatedList.value.push(obj);
    } else {
      ElMessage.error(`物料唯一码已存在，请勿添加重复项。`);
    }
  });
};

const executeAllocated = async () => {

  let obj = {
    "headerId": executeFormData.id,
    "bomList": allocatedList.value
  }
  loading.value = true;
  try {
    await updateAllocatedLine(obj);
  
    
    await execute(executeFormData.id);
    loading.value = false;
    getList();
    ElMessage.success('出库成功');
    executeDialogVisible.value = false;
  } catch (error) {
    ElMessage.error('操作失败');
    loading.value = false;
  }
};

const handleQuantityChange = (row) => {
  const quantity = parseFloat(row.quantityAllocated);
  if (isNaN(quantity) || quantity <= 0) {
    ElMessage.error('调拨数量必须为大于0的正数');
    // 重置输入框的值
    row.quantityAllocated = ''; // 或者设置为上一次的有效值
    return;
  }
  // 找到对应的索引并更新数据
  const index = allocatedList.value.findIndex(item => item.itemCode === row.itemCode);
  if (index !== -1) {
    allocatedList.value[index] = { ...allocatedList.value[index], quantityAllocated: quantity };
  }
};

const handleTaskSelect = () => {
  if (taskSelectRef.value) {
    taskSelectRef.value.showFlag = true;
    taskSelectRef.value.getList();
  } else {
    ElMessage.warning('任务选择组件未加载完成，请稍后再试');
  }
};

const onTaskSelected = (row) => {
  if (row != undefined && row != null) {
    form.value.taskId = row.id;
    form.value.taskCode = row.taskCode;
    form.value.taskName = row.taskName;
    form.value.workstationId = row.workstationId;
    form.value.workstationCode = row.workstationCode;
    form.value.workstationName = row.workstationName;
    form.value.processId = row.processId;
    form.value.processCode = row.processCode;
    form.value.processName = row.processName;
  }
};

const onExecuteTaskSelected = (row) => {
  if (row != undefined && row != null) {
    executeFormData.taskId = row.id;
    executeFormData.taskCode = row.taskCode;
    executeFormData.taskName = row.taskName;
    executeFormData.workstationId = row.workstationId;
    executeFormData.workstationCode = row.workstationCode;
    executeFormData.workstationName = row.workstationName;
    executeFormData.processId = row.processId;
    executeFormData.processCode = row.processCode;
    executeFormData.processName = row.processName;
  }
};

const onStockSelected = (row) => {
  if (row != undefined && row != null) {
    for (let i = 0; i < row.length; i++) {
      let obj = row[i];
      obj.quantityAllocated = obj.quantityOnhand
      const isItemCodeExists = allocatedList.value.some(item => item.itemCode === obj.itemCode && item.batchCode === obj.batchCode);
      // 如果物料Id不存在，则添加到this.allocatedList
      if (!isItemCodeExists) {
        allocatedList.value.push(obj);
      } else {
        ElMessage.error(`物料唯一码已存在，请勿添加重复项。`);
      }
    }
  }
};

const handleBindWorkorderChange = (value) => {
  form.value.bindWorkorder = value;
  // 触发重新校验
  if (formRef.value) {
    formRef.value.validate();
  }
};

const handleIssue = () => {
  // 确认执行吗?
  ElMessageBox.confirm('确认生成领料单吗?').then(() => {
    loading.value = true;
    const allocatedId = ids.value;
    createIssue(allocatedId).then(() => {
      loading.value = false;
      getList();
      ElMessage.success('领料单创建成功');
      executeDialogVisible.value = false;
    }).catch(error => {
      ElMessage.error('领料单创建失败');
      loading.value = false;
    });
  }).catch(() => {
    ElMessage.info('已取消');
  });
};


// 暴露给模板使用的方法和变量
defineExpose({
  queryParams,
  showSearch,
  loading,
  list,
  total,
  single,
  multiple,
  exportLoading,
  handleQuery,
  resetQuery,

  handleAdd,
  handleUpdate,
  handleDelete,
  handleExport,
  handleFinsh,
  handleIssue,
  handleExecute,
  
  // 表单相关
  form,
  rules,
  autoGenFlag,
  optType,
  warehouseInfo,
  warehouseOptions,
  warehouseProps,
  bomList,
  allocatedList,
  bomLoadding,
  open,
  title,
  isEdit,
  handleAutoGenChange,
  handleWarehouseChanged,
  handleWorkorderSelect,
  handleTaskSelect,
  handleBindWorkorderChange,
  handleBomSelectionChange,
  handleQuantityChange,
  submitForm,
  cancel,
  
  // 执行出库相关
  executeDialogVisible,
  executeForm: executeFormData,
  purchaseId,
  allocatedSingle,
  allocatedHandleAdd,
  allocatedHandleBatchAdd,
  allocatedHandleDelete,
  allocatedHandleSelectionChange,
  executeAllocated,
});
</script>
<style>
/* 注意：移除 scoped 属性，使样式全局生效 */
.execute-dialog .el-dialog__body {
  padding: 12px 0 !important;
}
</style>
<style lang="scss" scoped>
// 保留基础布局样式
.mb8 {
  margin-bottom: 8px;
}

.box-card {
  margin-bottom: 20px;
}

.dialog-footer {
  text-align: right;
}

// 保留必要的深度选择器样式
:deep(.el-form-item__label) {
  font-weight: bold;
}

:deep(.el-table) {
  margin-top: 15px;
}

:deep(.el-pagination) {
  margin-top: 20px;
  text-align: right;
}

:deep(.el-dialog__body) {
  padding: 20px 40px;
}

:deep(.el-dialog__footer) {
  padding: 20px 40px;
  border-top: 1px solid #dcdfe6;
}

:deep(.el-divider__text) {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}

// 保留宽度相关样式
:deep(.el-cascader),
:deep(.el-input-number),
:deep(.el-date-editor),
:deep(.el-select) {
  width: 100%;
}

// 保留表格样式
// :deep(.el-table .cell) {
//   white-space: nowrap;
//   overflow: hidden;
//   text-overflow: ellipsis;
// }

:deep(.el-table th) {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: bold;
}

:deep(.el-table td) {
  padding: 8px 0;
}

</style>