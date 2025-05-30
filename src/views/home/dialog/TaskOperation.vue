<template>
  <el-dialog
    v-model="visible"
    class="task-operation-dialog"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :modal-class="'cyber-modal'"
    :top="'8vh'"
    width="1260px"
    @closed="handleClose"
  >
      <!-- 添加自定义标题插槽 -->
    <template #header>
      <div class="custom-dialog-header">
        <span class="el-dialog__title">{{ title }}</span>
        <span class="device-name" v-if="props.currentDevice && props.currentDevice.name">
         {{ props.currentDevice.name }} {{ props.currentDevice.number }} - {{ props.selectedProcess.name }}
        </span>
      </div>
    </template>
    <div class="dialog-content">
      <div class="search-bar">
        <el-input v-model="queryForm.keyword" class="cyber-input" placeholder="请输入任务单搜索">
          <template #prefix>
            <Icon class="search-icon" icon="svg-icon:search" />
          </template>
        </el-input>
        <el-button class="cyber-btn" @click="handSearch">查 询</el-button>
        <el-button class="cyber-btn secondary" @click="resetQuery">重 置</el-button>
      </div>

         <!-- 任务单卡片列表 -->
      <div v-loading="tableLoading" class="card-container">
        <div class="card-grid">
          <div 
            v-for="card in taskList" 
            :key="card.id" 
            class="task-card"
            :class="{ 'selected-card': card.selected }"
            @click="handleSelectRow(card)"
          >
            <div class="card-header">
              <el-checkbox 
                v-model="card.selected" 
                @change="(val) => handleCheckboxChange(val, card)"
                @click.stop
              />
              <span class="card-status" :class="card.status === '已开工' || card.status === '部分完工' ? 'in-progress' : 'complete'">
                {{ card.status }}
              </span>
            </div>
            <div class="card-body">
              <div class="card-item">
                <span class="card-label">派工单编号:</span>
                <span class="card-value">{{ card.dispatch_no || '--' }}</span>
              </div>
              <div class="card-item">
                <span class="card-label">物料名称:</span>
                <span class="card-value">{{ card.sku_name || '--' }}</span>
              </div>
              <div class="card-item">
                <span class="card-label">总派工数:</span>
                <span class="card-value">{{ formatNumber(card.total_count) || '0' }}</span>
              </div>
            </div>
          </div>
          <div v-if="taskList.length === 0" class="empty-data-card">
            暂无数据
          </div>
        </div>
      </div>



      <!-- 任务单详情区域 -->
      <div class="task-detail" >
        <div class="detail-header">
          <h3>任务单详情</h3>
        </div>
        <div class="detail-content">
          <div class="detail-row">
            <div class="detail-item">
              <span class="label">任务单号：</span>
              <span class="value">{{ selectedRow?.work_no }}</span>
            </div>
            <div class="detail-item">
              <span class="label">派工单编号：</span>
              <span class="value">{{ selectedRow?.dispatch_no || '' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">原单编码：</span>
              <span class="value">{{ selectedRow?.original_no || '' }}</span>
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-item">
              <span class="label">物料名称：</span>
              <span class="value">{{ selectedRow?.sku_name }}</span>
            </div>
            <div class="detail-item">
              <span class="label">物料编号：</span>
              <span class="value">{{ selectedRow?.sku_no || '' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">规格型号：</span>
              <span class="value">{{ selectedRow?.specs || '' }}</span>
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-item">
              <span class="label">工作中心名称：</span>
              <span class="value">{{ selectedRow?.workcenter_name || '' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">工序名称：</span>
              <span class="value">{{ selectedRow?.wp_name }}</span>
            </div>
            <div class="detail-item">
              <span class="label">总派工数：</span>
              <span class="value">{{ formatNumber(selectedRow?.total_count) || '' }}</span>
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-item">
              <span class="label">已生产数：</span>
              <span class="value">{{ formatNumber(selectedRow?.produced_count) || '' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">数量(大张)：</span>
              <span class="value">{{ formatNumber(selectedRow?.large_count) || '' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">可生产数量(大张)：</span>
              <span class="value">{{ formatNumber(selectedRow?.available_large_count) || '' }}</span>
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-item">
              <span class="label">合格数：</span>
              <span class="value">{{ formatNumber(selectedRow?.qualified_count) || '' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">不合格数量：</span>
              <span class="value">{{ formatNumber(selectedRow?.unqualified_count) || '' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">备注：</span>
              <span class="value">{{ selectedRow?.remark || '' }}</span>
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-item">
              <span class="label">样稿：</span>
              <span class="value">{{ selectedRow?.sample || '' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">状态：</span>
              <span :class="['value', selectedRow?.status === '已开工' ? 'in-progress' : 'complete']">{{ selectedRow?.status }}</span>
            </div>
            <div class="detail-item">
              <span class="label">是否巡检：</span>
              <span class="value">{{ selectedRow?.is_inspect || '' }}</span>
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-item">
              <span class="label">是否已经巡检：</span>
              <span class="value">{{ selectedRow?.is_inspected || '' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">加工内容：</span>
              <span class="value">{{ selectedRow?.process_content || '' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">批次码编号：</span>
              <span class="value">{{ selectedRow?.batch_no || '' }}</span>
            </div>
          </div>
        </div>
        <div class="detail-footer">
          <el-button class="cyber-btn" @click="handleStartTask">开工</el-button>
          <el-button class="cyber-btn secondary" @click="handleChangeTask">解绑工单</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { Icon } from '/@/components/Icon'
import { getJobBillContent } from '@/api/mes/wk/index.ts'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useWorkStore } from '@/store/modules/work.ts'

const props = defineProps({
  currentDevice: {
    type: Object,
    default: () => ({})
  },
  selectedProcess: {
    type: Object,
    default: null
  }
})

// 获取工作状态
const workStore = useWorkStore()
const currentTaskInfo = computed(() => workStore.getTaskInfo)

// 控制对话框显示状态
const visible = ref(false)
const tableLoading = ref(false)
const total = ref(0)
const taskList = ref([])
const jumpPage = ref(1)
const title = ref('任务单操作')
// 当前选中的行
const selectedRow = ref({})

// 查询表单
const queryForm = reactive({
  keyword: '',
})

// 选择行
const handleSelectRow = (row) => {
  // 如果点击的是当前已选中的行，则取消选择
  if (row.selected) {
    row.selected = false;
    selectedRow.value = null;
    return;
  }
  
  // 取消所有行的选中状态
  taskList.value.forEach(item => {
    item.selected = false;
  });
  
  // 选中当前行
  row.selected = true;
  selectedRow.value = row;
}

// 处理复选框变化事件
const handleCheckboxChange = (val, row) => {
  if (val) {
    // 取消其他行的选中状态
    taskList.value.forEach(item => {
      if (item.id !== row.id) {
        item.selected = false;
      }
    });
    selectedRow.value = row;
  } else {
    selectedRow.value = null;
  }
}

// 自动选中任务
const autoSelectTask = () => {
  if (taskList.value.length === 0) return;
  
  // 查找与当前任务bill_no匹配的任务
  console.log(currentTaskInfo.value,'currentTaskInfo.value')
  const currentRcNo = currentTaskInfo.value.bill_no;

  console.log('currentRcNo', currentRcNo);
  console.log('taskList.value',taskList.value);
  
  if (currentRcNo) {
    // 尝试查找匹配的任务
    const matchedTask = taskList.value.find(task => task.dispatch_no    === currentRcNo);
    
    if (matchedTask) {
      // 找到匹配的任务，选中它
      taskList.value.forEach(item => {
        item.selected = item.dispatch_no === currentRcNo;
      });
      selectedRow.value = matchedTask;
      return;
    }
  }
  
  // 如果没有匹配的任务或者没有当前任务，选中第一个任务
  taskList.value[0].selected = true;
  selectedRow.value = taskList.value[0];
}

// 数据加载
const fetchData = async (filter) => {
  tableLoading.value = true
  const wp_id = props.selectedProcess.id
  const wc_id = props.currentDevice.id
  const filterData = filter? filter : [{"val":[{"name":"wp_id","val": wp_id ,"action":"="},{"name":"wc_id","val":wc_id,"action":"="}],"relation":"AND"}]
  try {
    // 调用API获取工单数据
    const data = {
      filter:filterData  || [],
      filter_detail:{},
      keyword_is_detail:0,
      show_total:1,
    }
    const res = await getJobBillContent(data)
    
    if (res && res.rows) {
      // 处理API返回的数据，根据JobbillContentData的真实字段进行映射
      const workOrders = res.rows.map(item => ({
        id: item.id,
        sku_name: item.sku_name,
        sku_no: item.sku_no,
        work_no: item.work_no || '--',
        wp_name: item.wp_name,
        wp_number: item.wp_number,
        prodesc: item.prodesc || '',
        specs: item.product_detail || '', // 使用product_detail作为规格型号
        total_count: item.qty || 0, // 使用qty作为总派工数
        produced_count: item.exe_qty || 0, // 使用exe_qty作为已生产数
        available_count: item.subplusqty || 0, // 使用subplusqty作为可生产数量
        status: item.status_name || '',
        // 添加更多字段映射
        dispatch_no: item.bill_no, // 派工单编号
        original_no: item.ud_102869_source_bill_no, // 原单编码
        workcenter_name: item.wc_name, // 工作中心名称
        large_count: item.qty, // 数量(大张)
        available_large_count: item.subplusqty, // 可生产数量(大张)
        qualified_count: item.ok_qty || 0, // 合格数
        unqualified_count: item.no_okqty || 0, // 不合格数量
        remark: '', // 备注字段可能不存在
        sample: item.ud_102869_yg || '', // 样稿
        is_inspect: item.is_firstquality || '', // 是否巡检
        is_inspected: item.is_firstquality_finished || '', // 是否已经巡检
        process_content: item.prodesc || '', // 加工内容
        batch_no: item.ud_102869_pcm || '', // 批次码编号
        selected: false,
        // 保存原始数据，以便后续使用
        rawData: item
      }))
      
      taskList.value = workOrders
      total.value = res.total || 0
      
      // 数据加载完成后，自动选中任务
      autoSelectTask();
    } else {
      taskList.value = []
      total.value = 0
    }
  } catch (error) {
    console.error('获取工单数据失败:', error)
    taskList.value = []
    total.value = 0
  } finally {
    tableLoading.value = false
    jumpPage.value = queryForm.pageNo
  }
}

const handSearch = () => {
  const work_no = queryForm.keyword
  const wp_id = props.selectedProcess.id
  const wc_id = props.currentDevice.id
  const filter = [{"val":[{"name":"wp_id","val":wp_id,"action":"="},{"name":"wc_id","val":wc_id,"action":"="},{"name":"work_no","val":work_no,"action":"LIKE"}],"relation":"OR"}]
  fetchData(filter)
}

// 重置查询
const resetQuery = () => {
  queryForm.keyword = ''
  fetchData([])
}


// 任务操作
const handleStartTask = () => {
  if (!selectedRow.value) {
    ElMessage.warning('请先选择一个任务单')
    return
  }
  
  ElMessageBox.confirm(
    `确认要开工 ${selectedRow.value.work_no} 吗？`,
    '开工',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'info',
      customClass: 'cyber-confirm-box',
      confirmButtonClass: 'cyber-confirm-btn',
      cancelButtonClass: 'cyber-cancel-btn',
      closeOnClickModal: false
    }
  )
  .then(() => {
    ElMessage.success('任务已开始')
    // 这里添加开工的API调用
    
    // 更新工作状态
    workStore.setTaskInfo({
      bill_no: selectedRow.value.dispatch_no,
      wpName: selectedRow.value.wp_name,
      skuName: selectedRow.value.sku_name,
      skuNo: selectedRow.value.sku_no,
      uqty: selectedRow.value.total_count,
      exe_uqty: selectedRow.value.produced_count,
      remainQty: selectedRow.value.available_count,
      prodesc: selectedRow.value.process_content
    })
  })
  .catch(() => {
    // 用户取消操作
  })
}

const handleChangeTask = () => {
  if (!selectedRow.value) {
    ElMessage.warning('请先选择一个任务单')
    return
  }
  
  const device = props.currentDevice.name + (props.currentDevice.number || '')
  ElMessageBox.confirm(
    `确认设备【 ${device }】切单(派工单号：无)？`,
    '请确认',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
      customClass: 'cyber-confirm-box',
      confirmButtonClass: 'cyber-confirm-btn',
      cancelButtonClass: 'cyber-cancel-btn',
      closeOnClickModal: false
    }
  )
  .then(() => {
    ElMessage.success('操作成功!')
    // 这里添加结束任务的API调用
    
    // 重置工作状态
    workStore.resetTaskInfo()
  })
  .catch(() => {
    // 用户取消操作
  })
}

// 添加数字格式化函数
const formatNumber = (num) => {
  if (num === undefined || num === null) return '0'
  // 将字符串转为数字
  const number = Math.floor(num)
  if (isNaN(number)) return '0'
  
  // 格式化数字，添加千位分隔符
  return number.toLocaleString('zh-CN', { 
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
}

// 打开对话框的方法，将通过父组件调用
const openDialog = () => {
  visible.value = true
  fetchData()
}

const handleClose = () => {
  // 清理资源
  selectedRow.value = null
}

// 暴露方法给父组件
defineExpose({
  openDialog,
})

onMounted(() => {
  // 初始化数据
})
</script>

<style lang="scss">
/* 全局样式，不使用scoped */
.cyber-modal {
  background-color: rgba(0, 21, 41, 0.85) !important;
  backdrop-filter: blur(5px);
}

/* 强制覆盖Element Plus对话框样式 */
.el-overlay-dialog {
  .el-dialog.task-operation-dialog {
    background-color: rgba(0, 21, 41, 0.85);
    border: 1px solid #1ecfff;
    border-radius: 2px;
    box-shadow: 0 0 20px rgba(30, 207, 255, 0.4);
    margin-top: 6vh !important; /* 确保优先级足够高 */

    .el-dialog__body {
      padding: 0 !important;
    }

    .el-dialog__header {
      height: 40px !important;
      color: #1ecfff !important;
      border-bottom: 1px solid rgba(30, 207, 255, 0.3);
      padding: 0px 16px !important;
    }

    /* 添加自定义标题样式 */
    .custom-dialog-header {
      display: flex;
      align-items: center;
      .el-dialog__title {
        color: #1ecfff !important;
        font-weight: 500;
        letter-spacing: 1px;
        text-shadow: 0 0 8px rgba(30, 207, 255, 0.5);
        font-size: 16px;
      }
      
      .device-name {
        color: rgba(255, 255, 255, 0.7);
        font-size: 12px;
        margin-left: 8px;
        font-weight: normal;
        letter-spacing: 0;
        text-shadow: none;
      }
    }

    .el-dialog__headerbtn .el-dialog__close {
      color: #1ecfff !important;

      &:hover {
        color: #4fdcff !important;
      }
    }

    .el-dialog__body {
      padding: 0 !important;
    }
  }
}
</style>

<style lang="scss" scoped>
.task-operation-dialog {
  :deep(.el-dialog__body) {
    max-height: calc(100vh - 200px);
    overflow: hidden;
    padding: 0 !important;
  }

  :deep(.el-dialog) {
    background-color: rgba(0, 21, 41, 0.85);
    border: 1px solid #1ecfff;
    border-radius: 2px;
    box-shadow: 0 0 20px rgba(30, 207, 255, 0.4);
    backdrop-filter: blur(5px);
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    margin: 0 auto;

    .el-dialog__header {
      padding: 4px 16px;
      border-bottom: 1px solid rgba(30, 207, 255, 0.3);
      margin-right: 0;
    }

    .el-dialog__body {
      flex: 1;
      overflow: hidden;
    }

    .el-dialog__footer {
      padding: 10px 20px;
      border-top: 1px solid rgba(30, 207, 255, 0.3);
    }
  }

  .dialog-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 6px;
    box-sizing: border-box;
    overflow: hidden;
  }

  .search-bar {
    display: flex;
    gap: 10px;
    margin-bottom: 16px;
    flex-shrink: 0;

    .cyber-input {
      width: 300px;

      :deep(.el-input__wrapper) {
        background-color: rgba(13, 35, 65, 0.7);
        border: 1px solid #1ecfff;
        box-shadow: 0 0 8px rgba(30, 207, 255, 0.2);

        &.is-focus {
          box-shadow: 0 0 10px rgba(30, 207, 255, 0.4);
        }

        input {
          color: #eef1f2;
          background-color: transparent;

          &::placeholder {
            color: #8e9dab;
          }
        }
      }

      .search-icon {
        color: #1ecfff;
      }
    }
  }
// 添加卡片视图的样式
.card-container {
  position: relative;
  overflow: auto;
  height: 350px;
  margin-bottom: 10px;
  border: 1px solid rgba(30, 207, 255, 0.5);
  box-sizing: border-box;
  
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(30, 207, 255, 0.4);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(13, 35, 65, 0.3);
  }
}

  .card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  padding: 16px;
}
.task-card {
  background-color: rgba(0, 21, 41, 0.7);
  border: 1px solid rgba(30, 207, 255, 0.3);
  border-radius: 4px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    background-color: rgba(30, 207, 255, 0.1);
    border-color: rgba(30, 207, 255, 0.6);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  &.selected-card {
    background-color: rgba(30, 207, 255, 0.2);
    border-color: #1ecfff;
    box-shadow: 0 0 10px rgba(30, 207, 255, 0.3);
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background-color: #1ecfff;
      box-shadow: 0 0 8px rgba(30, 207, 255, 0.8);
    }
  }
}

.card-item {
  display: flex;
  align-items: center;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(30, 207, 255, 0.2);
}

.card-status {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  background-color: rgba(0, 21, 41, 0.5);
  
  &.in-progress {
    color: #22cc55;
    border: 1px solid rgba(34, 204, 85, 0.5);
  }
  
  &.complete {
    color: #1ecfff;
    border: 1px solid rgba(30, 207, 255, 0.5);
  }
}

.card-label {
  color: rgba(255, 255, 255, 0.7);
  width: 90px;
  font-size: 13px;
}

.card-value {
  color: #1ecfff;
  font-size: 14px;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

  .empty-data-card {
  grid-column: 1 / -1;
  padding: 40px;
  text-align: center;
  color: rgba(134, 201, 242, 0.6);
  font-size: 16px;
  background-color: rgba(0, 21, 41, 0.3);
  border: 1px dashed rgba(30, 207, 255, 0.3);
  border-radius: 4px;
}



  .task-detail {
    border: 1px solid rgba(30, 207, 255, 0.5);
    border-radius: 2px;
    background-color: rgba(0, 21, 41, 0.5);
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .detail-header {
      padding: 8px 16px;
      border-bottom: 1px solid rgba(30, 207, 255, 0.3);
      background-color: rgba(0, 21, 41, 0.8);

      h3 {
        margin: 0;
        color: #1ecfff;
        font-size: 16px;
        font-weight: normal;
      }
    }

    .detail-content {
      padding:12px 16px;
      overflow-y: auto;
      flex: 1;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-thumb {
        background: rgba(30, 207, 255, 0.4);
        border-radius: 3px;
      }

      &::-webkit-scrollbar-track {
        background: rgba(13, 35, 65, 0.3);
      }

      .detail-row {
        display: flex;
        margin-bottom: 16px;
      }

      .detail-item {
        flex: 1;
        display: flex;
        align-items: center;

        .label {
          color: rgba(255, 255, 255, 0.7);
          width: 120px;
          text-align: right;
          padding-right: 10px;
          width: 140px;
        }

        .value {
          color: #1ecfff;
          flex: 1;
        }
        .in-progress {
            color: #22cc55;
        }
      }


    }
    .detail-footer {
        width: 100%;
        padding: 16px;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        gap: 12px;
        border-top: 1px solid rgba(30, 207, 255, 0.3);
      }
  }
}

</style>