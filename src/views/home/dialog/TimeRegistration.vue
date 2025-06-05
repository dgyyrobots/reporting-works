<template>
  <el-dialog
    v-model="visible"
    class="time-registration-dialog"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :modal-class="'cyber-modal'"
    title="计时登记"
    :top="'8vh'"
    width="1200px"
    @closed="handleClose"
  >
    <div class="dialog-content">
      <div class="search-bar">
        <el-input v-model="queryForm.keyword" class="cyber-input"  placeholder="请输入任务单搜索">
          <template #prefix>
            <Icon class="search-icon" icon="svg-icon:search" />
          </template>
        </el-input>
        <el-button class="cyber-btn" @click="handSearch">查 询</el-button>
        <el-button class="cyber-btn secondary" @click="resetQuery">重 置</el-button>
      </div>

      <!-- 新增的上方表格 -->
      <div v-loading="topTableLoading" class="table-container upper-table">
        <div class="table-border-wrapper">
          <div class="scroll-board">
            <table>
              <thead>
                <tr>
                  <th style="width: 50px;">选择</th>
                  <th>任务单号</th>
                  <th>工序</th>
                  <th>工序编码</th>
                  <th>物料名称</th>
                  <th>物料编号</th>
                  <th>工艺描述</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in topList" :key="row.id" @click="handleSelectRow(row)">
                  <td>
                    <el-checkbox v-model="row.selected" @change="(val) => handleCheckboxChange(val, row)" />
                  </td>
                  <td>{{ row.work_no }}</td>
                  <td>{{ row.wp_name }}</td>
                  <td>{{ row.wp_number }}</td>
                  <td>{{ row.sku_name }}</td>
                  <td>{{ row.sku_no }}</td>
                  <td>{{ row.prodesc }}</td>
                </tr>
                <tr v-if="topList.length === 0">
                  <td class="empty-data" colspan="6">暂无数据</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 上方表格的分页区域 -->
      <div class="pagination-wrapper top-pagination">
        <div class="total-info">共 {{ topTotal }} 条</div>
        <div class="page-size-selector">
          <span>{{ topQueryForm.pageSize }}条/页</span>
          <Icon class="selector-icon" icon="svg-icon:arrow-down" />
          <div class="dropdown-menu">
            <div v-for="size in [10, 20, 50, 100]" :key="size" class="dropdown-item" @click="handleTopSizeChange(size)">
              {{ size }}条/页
            </div>
          </div>
        </div>
        <div class="pagination-btns">
          <div class="page-btn" :class="{ disabled: topQueryForm.pageNo <= 1 }" @click="handleTopPrevPage">
            <Icon icon="svg-icon:arrow-left" />
          </div>
          <div
            v-for="page in topPageDisplays"
            :key="page"
            class="page-btn"
            :class="{ active: page === topQueryForm.pageNo }"
            @click="handleTopCurrentChange(page)"
          >
            {{ page }}
          </div>
          <div class="page-btn" :class="{ disabled: topQueryForm.pageNo >= topTotalPages }" @click="handleTopNextPage">
            <Icon icon="svg-icon:arrow-right" />
          </div>
        </div>
        <div class="page-jumper">
          前往
          <input v-model.number="topJumpPage" class="jumper-input" type="number" @keyup.enter="handleTopJumpPage" />
          页
        </div>
      </div>

      <div class="table-divider"></div>

      <!-- 原有的下方表格，移除了分页功能 -->
      <div v-loading="listLoading" class="table-container bottom-table">
        <div class="table-border-wrapper">
          <div class="scroll-board">
            <table>
              <thead>
                <tr>
                  <th>名称</th>
                  <th>设备</th>
                  <th>班次</th>
                  <th>操作</th>
                  <th>开始时间</th>
                  <th>结束时间</th>
                  <th>时长</th>
                  <th>工单号</th>
                  <th>工序</th>
                  <th>工序编码</th>
                  <th>物料</th>
                  <th>物料编码</th>
                  <th>工艺描述</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in list" :key="row.id">
                  <td>{{ row.type_name }}</td>
                  <td>{{ row.device_name }}</td>
                  <td>{{ row.banci_name  }}</td>
                  <td class="action-buttons">
                    <div :class="['action-btn', row.startTime ? '' : 'start-active']" @click="handleStartAction(row)">开始</div>
                    <div :class="['action-btn end-btn', row.startTime ? 'end-active' : '']" @click="handleEndAction(row)">结束</div>
                  </td>
                  <td>{{ row.startTime || '-' }}</td>
                  <td>{{ row.endTime || '-' }}</td>
                  <td>{{ row.duration || '-' }}</td>
                  <td>{{ row.work_no || '-' }}</td>
                  <td>{{ row.wp_name || '-' }}</td>
                  <td>{{ row.wp_number || '-' }}</td>
                  <!-- <td>{{ row.sku_name || '' }}</td>
                  <td>{{ row.sku_number || '-' }}</td>
                  <td>{{ row.prodesc || '-' }}</td> -->
                  <td>{{ '' }}</td>
                  <td>{{ '' }}</td>
                  <td>{{ '' }}</td>
                </tr>
                <tr v-if="list.length === 0">
                  <td class="empty-data" colspan="13">暂无数据</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { Icon } from '/@/components/Icon'
import {  getRunningBanciDevice, getRunningBanCiWorkOrder,getDeviceStartData } from '@/api/mes/wk/index.ts'
import { ElMessageBox, ElMessage, } from 'element-plus'

const props = defineProps({
currentDevice: {
  type: Object,
  default: () => ({})
},
})

// 控制对话框显示状态
const visible = ref(false)
const listLoading = ref(false)
const total = ref(0)
const list = ref([])
// 添加计时器引用
const timerRef = ref(null)
// 上方表格的数据和状态
const topTableLoading = ref(false)
const topTotal = ref(0)
const topList = ref([])
const topJumpPage = ref(1)
// 当前选中的行
const selectedRow = ref(null)

// 上方表格查询表单
const topQueryForm = reactive({
  pageNo: 1,
  pageSize: 10,
  keyword: '',
})

// 下方表格查询表单
const queryForm = reactive({
  pageNo: 1,
  pageSize: 10,
  keyword: '',
})

// 计算属性 - 上方表格
const topTotalPages = computed(() => Math.ceil(topTotal.value / topQueryForm.pageSize))

// 只保留上方表格的分页计算
const topPageDisplays = computed(() => {
  const current = topQueryForm.pageNo
  const maxPages = topTotalPages.value

  if (maxPages <= 7) {
    return Array.from({ length: maxPages }, (_, i) => i + 1)
  }

  if (current <= 4) {
    return [1, 2, 3, 4, 5, '...', maxPages]
  }

  if (current >= maxPages - 3) {
    return [1, '...', maxPages - 4, maxPages - 3, maxPages - 2, maxPages - 1, maxPages]
  }

  return [1, '...', current - 1, current, current + 1, '...', maxPages]
})



// 操作按钮的处理
const handleStartAction = (row) => {
  if(row.start_time){
    return
  }
  // 创建确认对话框
  ElMessageBox.confirm(
    `【现在的时间是 (${row.banci_name}),确认要开始计时工作吗】`,
    '请确认开始',
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
    // 用户点击确认后的操作
    const row_data = JSON.parse(JSON.stringify(row))
    const user = JSON.parse(localStorage.getItem('userInfo'))
    delete row_data.startTime
    delete row_data.endTime
    delete row_data.duration
    const data = {
     'data[]': row_data ,
      user_id: user.userId,
      user_name: user.fullname,
      device_id: props.currentDevice.id,
    }
    getDeviceStartData (data).then((res)=>{
      if(res.ret===0) {
        ElMessage.success(('操作成功!'))
        // row.startTime = formatDateTime(new Date())
        // row.endTime = ''
        // row.duration = '00:00:00'
        fetchData()
            // 确保计时器已启动
        if (!timerRef.value) {
          timerRef.value = setInterval(updateDurations, 1000)
        }
      }
    })
  })
  .catch(() => {
    // 用户点击取消或关闭对话框
    console.log('取消开始计时')
  })
}

const handleEndAction = (row) => {
  if(!row.start_time) {
    ElMessage.error('该类型还未开始计时，请按【开始】')
    return
  }
    const row_data = JSON.parse(JSON.stringify(row))
    const user = JSON.parse(localStorage.getItem('userInfo'))
    delete row_data.startTime
    delete row_data.endTime
    delete row_data.duration
    const data = {
     'data[]': row_data ,
      user_id: user.userId,
      user_name: user.fullname,
      device_id: props.currentDevice.id,
    }
    getDeviceStartData (data).then((res)=>{
      if(res.ret===0) {
        ElMessage.success(('操作成功!'))
        // row.startTime = ''
        // row.endTime = ''
        // row.duration = ''
        fetchData()
      }
    })
}

// 选择上方表格行
const handleSelectRow = (row) => {
  // 可以在这里添加选择行的逻辑
}
// 处理行点击事件
const handleRowClick = (row) => {
  // 如果点击的是当前已选中的行，则取消选择
  if (row.selected) {
    row.selected = false;
    selectedRow.value = null;
    return;
  }
  
  // 取消所有行的选中状态
  topList.value.forEach(item => {
    item.selected = false;
  });
  
  // 选中当前行
  row.selected = true;
  selectedRow.value = row;
  
  // 调用原有的选择行逻辑
  handleSelectRow(row);
}
// 处理复选框变化事件
const handleCheckboxChange = (val, row) => {
  if (val) {
    // 取消其他行的选中状态
    topList.value.forEach(item => {
      if (item.id !== row.id) {
        item.selected = false;
      }
    });
    selectedRow.value = row;
  } else {
    selectedRow.value = null;
  }
}
// 格式化日期时间
const formatDateTime = (date) => {
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${hours}:${minutes}:${seconds}`
}
// 将时间戳转换为时间格式 (HH:MM:SS)
const formatTimestamp = (timestamp) => {
  if (!timestamp) return '-'
  
  // 检查时间戳长度，如果是13位则直接使用，如果是10位则需要乘以1000
  const time = timestamp.toString().length === 10 ? timestamp * 1000 : timestamp
  
  const date = new Date(time)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  
  return `${hours}:${minutes}:${seconds}`
}

// 上方表格数据加载
const fetchTopData = async (filter) => {
  topTableLoading.value = true

  try {
    // 调用API获取工单数据
    const data = {
      filter: JSON.stringify(filter) || [],
      filter_detail:JSON.stringify({}),
      keyword_is_detail:0,
      show_total:1,
      page:topQueryForm.pageNo,
      rows:topQueryForm.pageSize,
    }
    const res = await getRunningBanCiWorkOrder(data)
    
    if (res && res.rows) {
      // 处理API返回的数据
      const workOrders = res.rows.map(item => ({
        id: item.id,
        sku_name:item.sku_name,
        sku_no:item.sku_no,
        work_no: item.work_no || '--',
        wp_name: item.wp_name,
        wp_number:item.wp_number,
        prodesc: item.prodesc || '--',
        selected: false,
        // 保存原始数据，以便后续使用
        rawData: item
      }))
      
      topList.value = workOrders
      topTotal.value = res.total || 0
    } else {
      topList.value = []
      topTotal.value = 0
    }
  } catch (error) {
    console.error('获取工单数据失败:', error)
    topList.value = []
    topTotal.value = 0
  } finally {
    topTableLoading.value = false
    topJumpPage.value = topQueryForm.pageNo
  }
}
// 模拟下方表格数据加载
const fetchData = async () => {
  listLoading.value = true
  const data = {
  rows:3,
  _device_id:props.currentDevice.id
  }
  getRunningBanciDevice(data).then((res)=>{
    res.map((item)=>{
      item.startTime = item.start_time ? formatTimestamp(item.start_time) : ''
      item.endTime = item.end_time ? formatTimestamp(item.end_time) : ''
    })
    list.value = res
    listLoading.value = false

    // 检查是否有进行中的任务，如果有则启动计时器
    const hasRunningTasks =  list.value.some(item => item.startTime)
    if (hasRunningTasks && !timerRef.value) {
      timerRef.value = setInterval(updateDurations, 1000)
    }

  }).catch((err)=>{
    listLoading.value = false
  })
}

const handSearch = () => {
  const work_no = queryForm.keyword
  const filter = [{"val":[{"name":"work_no","val":work_no,"action":"LIKE"}],"relation":"OR"}]
  fetchTopData(filter)
}
// 重置查询
const resetQuery = () => {
  queryForm.keyword = ''
  queryForm.pageNo = 1
  topQueryForm.keyword = ''
  topQueryForm.pageNo = 1
  fetchTopData([])
  fetchData()
}

// 分页处理 - 上方表格
const handleTopCurrentChange = (val) => {
  if (val === '...') return
  topQueryForm.pageNo = val
  fetchTopData()
}

const handleTopSizeChange = (val) => {
  topQueryForm.pageSize = val
  topQueryForm.pageNo = 1
  fetchTopData()
}

const handleTopPrevPage = () => {
  if (topQueryForm.pageNo > 1) {
    topQueryForm.pageNo--
    fetchTopData()
  }
}

const handleTopNextPage = () => {
  if (topQueryForm.pageNo < topTotalPages.value) {
    topQueryForm.pageNo++
    fetchTopData()
  }
}

const handleTopJumpPage = () => {
  const page = topJumpPage.value
  if (page >= 1 && page <= topTotalPages.value) {
    topQueryForm.pageNo = page
    fetchTopData()
  } else {
    topJumpPage.value = topQueryForm.pageNo
  }
}


// 打开对话框的方法，将通过父组件调用
const openDialog = () => {
  visible.value = true
  fetchTopData()
  fetchData()
}

// 计算时长
const calculateDuration = (startTime) => {
  if (!startTime || startTime === '-') return '-'
  // 解析开始时间
  const [hours, minutes, seconds] = startTime.split(':').map(Number)
  const startDate = new Date()
  startDate.setHours(hours, minutes, seconds, 0)
  // 计算时间差
  const now = new Date()
  const durationMs = now - startDate
  // 格式化时长
  const durationHours = Math.floor(durationMs / (1000 * 60 * 60))
  const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))
  const durationSeconds = Math.floor((durationMs % (1000 * 60)) / 1000)
  return `${String(durationHours).padStart(2, '0')}:${String(durationMinutes).padStart(2, '0')}:${String(durationSeconds).padStart(2, '0')}`
}

// 更新所有进行中任务的时长
const updateDurations = () => {
  list.value.forEach(row => {
    if (row.startTime) {
      row.duration = calculateDuration(row.startTime)
    }
  })
}
const handleClose = () => {
  if (timerRef.value) {
    clearInterval(timerRef.value)
    timerRef.value = null
  }
}
// 暴露方法给父组件
defineExpose({
  openDialog,
})
onBeforeUnmount(() => {
  if (timerRef.value) {
    clearInterval(timerRef.value)
    timerRef.value = null
  }
})
onMounted(() => {
  fetchTopData()
  fetchData()
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
  .el-dialog.time-registration-dialog {
    background-color: rgba(0, 21, 41, 0.85);
    border: 1px solid #1ecfff;
    border-radius: 2px;
    box-shadow: 0 0 20px rgba(30, 207, 255, 0.4);
    margin-top: 8vh !important; /* 确保优先级足够高 */

    .el-dialog__body {
      padding: 0 !important;
    }

    .el-dialog__header {
      height: 40px !important;
      color: #1ecfff !important;
      border-bottom: 1px solid rgba(30, 207, 255, 0.3);
    }

    .el-dialog__title {
      color: #1ecfff !important;
      font-weight: 500;
      letter-spacing: 1px;
      text-shadow: 0 0 8px rgba(30, 207, 255, 0.5);
      font-size: 16px;
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

/* 修改loading样式 */
.el-loading-mask {
  background-color: rgba(0, 21, 41, 0.7) !important;

  .el-loading-spinner {
    .circular {
      .path {
        stroke: #1ecfff !important;
      }
    }

    .el-loading-text {
      color: #1ecfff !important;
    }
  }
}
</style>

<style lang="scss" scoped>
.time-registration-dialog {
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

  :deep(.el-dialog__headerbtn) {
    top: 12px;
    right: 16px;
  }

  :deep(.el-dialog__headerbtn .el-dialog__close) {
    /* 移除这里的颜色设置，改为全局样式 */
  }

  :deep(.el-loading-mask) {
    background-color: rgba(0, 21, 41, 0.7) !important;
  }

  :deep(.el-loading-spinner .circular .path) {
    stroke: #1ecfff !important;
  }

  :deep(.el-loading-spinner .el-loading-text) {
    color: #1ecfff !important;
  }

  .dialog-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 16px;
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

  .table-divider {
    height: 1px;
    background: rgba(30, 207, 255, 0.3);
    margin: 10px 0 15px;
    width: 100%;
  }

  .table-container {
    position: relative;
    overflow: hidden;

    &.upper-table {
      height: 200px;
      margin-bottom: 10px;
      position: relative;
      z-index: 2;
    }

    &.bottom-table {
      flex: 1;
      min-height: 200px;
      position: relative;
      z-index: 1;
    }

    .table-border-wrapper {
      width: 100%;
      height: 100%;
      position: relative;
      border: 1px solid rgba(30, 207, 255, 0.5);
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
    }

    .scroll-board {
      width: 100%;
      height: 100%;
      overflow: auto;
      position: relative;
      flex: 1;

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

      table {
        width: 100%;
        border-collapse: collapse;
        border: none;
        background-color: transparent;

        thead {
          position: sticky;
          top: 0;
          z-index: 15;

          &::after {
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            height: 1px;
            background-color: rgba(30, 207, 255, 0.5);
            z-index: 16;
          }

          &::before {
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            height: 1px;
            background-color: rgba(30, 207, 255, 0.5);
            z-index: 16;
          }

          tr {
              background-color: rgba(0, 21, 41, 0.95);
              &.selected-row {
              background: rgba(30, 207, 255, 0.2) !important;
              td {
                color: #fff !important;
              }
            }
            &:hover {
            background: rgba(30, 207, 255, 0.1);
             }
          }
        }

        th {
          padding: 8px 6px;
          text-align: center;
          font-size: 14px;
          color: #1ecfff;
          border: none;
          background-color: rgba(0, 21, 41, 0.95);
          font-weight: normal;
          position: sticky;
          top: 0;
          z-index: 10;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

          &:not(:last-child) {
            border-right: 1px solid rgba(30, 207, 255, 0.2);
          }
        }

        td {
          padding: 8px 6px;
          text-align: center;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.8);
          border: none;
          border-bottom: 1px solid rgba(0, 161, 255, 0.2);

          &:not(:last-child) {
            border-right: 1px solid rgba(30, 207, 255, 0.1);
          }
        }

        tr {
          transition: all 0.3s;

          &:nth-child(even) {
            background: rgba(13, 35, 65, 0.3);
          }

          &:hover {
            background: rgba(30, 207, 255, 0.1);
          }
        }

        .empty-data {
          padding: 30px 0;
          color: rgba(134, 201, 242, 0.6);
          font-size: 16px;
        }
      }
    }

    :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
      background-color: #1ecfff;
      border-color: #1ecfff;
    }

    :deep(.el-checkbox__inner) {
      background-color: rgba(30, 207, 255, 0.1);
      border-color: #1ecfff;
    }
  }

  .pagination-wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 10px 0;
    color: #1ecfff;
    font-size: 14px;
    flex-shrink: 0;
    height: 40px;

    &.top-pagination {
      margin-bottom: 5px;
    }

    .total-info {
      margin-right: 15px;
    }

    .page-size-selector {
      position: relative;
      margin-right: 15px;
      padding: 4px 8px;
      border: 1px solid rgba(30, 207, 255, 0.4);
      border-radius: 2px;
      cursor: pointer;
      user-select: none;
      display: flex;
      align-items: center;

      .selector-icon {
        margin-left: 5px;
        font-size: 12px;
      }

      .dropdown-menu {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background-color: rgba(0, 21, 41, 0.95);
        border: 1px solid #1ecfff;
        border-top: none;
        z-index: 10;

        .dropdown-item {
          padding: 4px 8px;

          &:hover {
            background-color: rgba(30, 207, 255, 0.2);
          }
        }
      }

      &:hover .dropdown-menu {
        display: block;
      }
    }

    .pagination-btns {
      display: flex;
      margin-right: 15px;

      .page-btn {
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid rgba(30, 207, 255, 0.4);
        margin-right: 4px;
        cursor: pointer;
        user-select: none;
        border-radius: 2px;
        font-size: 13px;

        &:hover:not(.disabled) {
          background-color: rgba(30, 207, 255, 0.2);
        }

        &.active {
          background-color: #1ecfff;
          color: #001529;
          font-weight: bold;
        }

        &.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }
    }

    .page-jumper {
      display: flex;
      align-items: center;
      font-size: 13px;

      .jumper-input {
        width: 36px;
        height: 24px;
        background-color: rgba(13, 35, 65, 0.7);
        border: 1px solid rgba(30, 207, 255, 0.4);
        color: #eef1f2;
        text-align: center;
        margin: 0 5px;
        border-radius: 2px;
        outline: none;

        &:focus {
          border-color: #1ecfff;
          box-shadow: 0 0 5px rgba(30, 207, 255, 0.3);
        }
      }
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }

  .status-tag {
    display: inline-block;
    padding: 2px 6px;
    border-radius: 2px;
    color: #eef1f2;
    font-size: 12px;

    &.complete {
      background-color: rgba(103, 194, 58, 0.8);
    }

    &.in-progress {
      background-color: rgba(255, 153, 0, 0.8);
    }
  }

  .cyber-btn {
    background-color: rgba(30, 207, 255, 0.2);
    border: 1px solid #1ecfff;
    color: #1ecfff;
    box-shadow: 0 0 8px rgba(30, 207, 255, 0.2);
    border-radius: 2px;
    height: 32px;
    padding: 0 16px;

    &:hover {
      background-color: rgba(30, 207, 255, 0.3);
      box-shadow: 0 0 12px rgba(30, 207, 255, 0.4);
    }

    &.secondary {
      background-color: rgba(30, 207, 255, 0.05);
      border: 1px solid rgba(30, 207, 255, 0.5);
      color: #1ecfff;

      &:hover {
        background-color: rgba(30, 207, 255, 0.15);
      }
    }
  }

  .cyber-link {
    color: #1ecfff;
    cursor: pointer;
    margin: 0 4px;
    text-decoration: none;
    font-size: 14px;

    &:hover {
      text-shadow: 0 0 8px rgba(30, 207, 255, 0.8);
    }

    &.danger {
      color: #ff5252;

      &:hover {
        text-shadow: 0 0 8px rgba(255, 82, 82, 0.8);
      }
    }
  }

  .action-buttons {
    display: flex;
    justify-content: center;
    gap: 6px;

    .action-btn {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #fff;
      font-size: 14px;
      background-color: #666;
      transition: all 0.3s;

      &:hover {
        filter: brightness(1.2);
      }

      &.start-active {
        background-color: #009900;
      }

      &.end-active {
        background-color: #ff0000;
      }
    }

    .end-btn {
      background-color: #666;
    }
  }
}
</style>
