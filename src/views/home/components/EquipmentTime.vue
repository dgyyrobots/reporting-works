<template>
  <Card class="EquipmentTime" content-padding="6px 0" title="设备计时" :showEmpty="!loading && tableData.length === 0">
    <template #titleRight>
      <button class="query-btn" @click="showDetailDialog">查看明细</button>
    </template>
    <div class="scroll-board">
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <span>加载中...</span>
      </div>
      <table v-else-if="tableData.length > 0">
        <thead>
          <tr>
            <th v-for="(header, index) in tableHeaders" :key="index">{{ header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in tableData" :key="index" :class="{ warning: row.type_name === '设备维修' }">
            <td>{{ row.wp_name }}</td>
            <td>{{ row.work_no || '--' }}</td>
            <td>{{ row.type_name }}</td>
            <td>{{ row.totle_time }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- 详情弹框 -->
    <el-dialog
      v-model="dialogVisible"
      class="time-detail-dialog"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :modal-class="'cyber-modal'"
      title="设备计时详情"
      :top="'8vh'"
      width="1200px"
    >
      <div class="dialog-content">
        <div v-loading="detailLoading" class="table-container">
          <div class="table-border-wrapper">
            <div v-if="!detailLoading && detailTableData.length === 0" class="no-data">
              <Icon icon="svg-icon:empty-box" />
              暂无数据
            </div>
            <div v-else class="scroll-board">
              <table>
                <thead>
                  <tr>
                    <th v-for="(header, index) in detailTableHeaders" :key="index">{{ header }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, index) in detailTableData" :key="index" :class="{ warning: row.type_name === '设备维修' }">
                    <td>{{ row.device_name }}</td>
                    <td>{{ row.wp_name }}</td>
                    <td>{{ row.wc_name }}</td>
                    <td>{{ row.banci_name }}</td>
                    <td>{{ row.type_name }}</td>
                    <td>{{ formatTimestamp(row.start_date) }}</td>
                    <td>{{ formatTimestamp(row.end_date) }}</td>
                    <td>{{ row.totle_time }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </Card>
</template>

<script setup>
import Card from './Card.vue'
import { ref, onMounted, watch } from 'vue'
import { getDeviceRuntimeADay } from '@/api/mes/wk/index.ts'
import { Icon } from '/@/components/Icon'
import { ElMessage} from 'element-plus'
// 定义props接收设备和工作中心信息
const props = defineProps({
  currentDevice: {
    type: Object,
    default: () => ({})
  },
  currentWorkcenter: {
    type: Object,
    default: () => ({})
  },
})

const tableHeaders = ['工序', '工单', '类型', '时长']
const tableData = ref([])
const loading = ref(false)

// 详情弹框相关
const dialogVisible = ref(false)
const detailLoading = ref(false)
const detailTableHeaders = ['设备名称', '工序名称', '工作中心名称', '班次名称', '类型名称', '开始时间', '结束时间', '时长']
const detailTableData = ref([])

// 显示详情弹框
const showDetailDialog = async () => {
 // 确保有数据才打开弹框
 if (tableData.value && tableData.value.length > 0) {
    dialogVisible.value = true
    detailLoading.value = true
    
    // 使用已获取的数据
    detailTableData.value = tableData.value
    
    // 短暂延迟以显示加载效果
    setTimeout(() => {
      detailLoading.value = false
    }, 300)
  } else {
    // 如果没有数据，可以考虑显示一个提示
    ElMessage.error('暂无数据~')
  }
}


// 格式化时间戳为可读时间
const formatTimestamp = (timestamp) => {
  if (!timestamp || timestamp === '') return '--'
  
  const date = new Date(parseInt(timestamp) * 1000)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

// 获取设备运行时间数据
const fetchDeviceRuntime = async () => {
  // 检查设备信息是否完整
  if (!props.currentDevice || !props.currentDevice.number) {
    console.warn('设备信息不完整，无法获取设备运行时间')
    return
  }
  
  loading.value = true
  const getShiftDateRangeResult = getShiftDateRange()
  try {
    const device_number = props.currentDevice.number
    const params = {
      // device_id: device.id,
      filter:JSON.stringify([{"val":[{"name":"device_number","val":device_number,"action":"="}],"relation":"OR"},{"val":[{"name":"bill_date","val":{"range":"custom","start":getShiftDateRangeResult.start,"end":getShiftDateRangeResult.end},"action":"date_range"}],"relation":"OR"}]),
      filter_detail:JSON.stringify({}),
      keyword_is_detail:0,
      show_total:1,
      page:1,
      rows:50
    }
    
    const res = await getDeviceRuntimeADay(params)
    
    if (res && res.rows && Array.isArray(res.rows)) {
      // 直接使用返回的数据结构
      tableData.value = res.rows
    } else {
      tableData.value = []
    }
  } catch (error) {
    console.error('获取设备运行时间失败:', error)
    tableData.value = []
  } finally {
    loading.value = false
  }
}



// 判断班次并返回日期范围
const getShiftDateRange = () => {
  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  
  // 判断是否是白班（8:30 - 20:30）
  const isDayShift = (currentHour > 8 || (currentHour === 8 && currentMinute >= 30)) && 
                     (currentHour < 20 || (currentHour === 20 && currentMinute < 30))
  
  // 获取当前日期的年月日字符串
  const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  
  const today = formatDate(now)
  
  // 获取明天的日期
  const tomorrow = new Date(now)
  tomorrow.setDate(now.getDate() + 1)
  const tomorrowStr = formatDate(tomorrow)
  
  // 如果是白班，返回今天的开始和结束日期
  // 如果是晚班，返回今天的开始日期和明天的结束日期
  return {
    isDay: isDayShift,
    shiftName: isDayShift ? '白班' : '晚班',
    start: today,
    end: isDayShift ? today : tomorrowStr
  }
}
// 添加对 currentDevice 的监听
watch(() => props.currentDevice, (newDevice, oldDevice) => {
  // 检查设备是否变化且有效
  if (newDevice && newDevice.number && 
      (!oldDevice || newDevice.number !== oldDevice.number)) {
    console.log('设备变化，重新获取数据:', newDevice.name || newDevice.number)
    fetchDeviceRuntime()
  }
}, { deep: true })

onMounted(() => {
  nextTick(async () => {
    fetchDeviceRuntime()
  })
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
  .el-dialog.time-detail-dialog {
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
      background: linear-gradient(90deg, #1573ce 0%, #0a2a50 100%);
      padding: 12px 20px;
      margin-right: 0;
    }

    .el-dialog__title {
      color: #fff !important;
      font-size: 16px;
      font-weight: 500;
      letter-spacing: 1px;
      text-shadow: 0 0 8px rgba(30, 207, 255, 0.5);
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
.EquipmentTime {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  color: #fff;
  display: flex;
  flex-direction: column;
  
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100px;
    color: #1ecfff;
  }

  .loading-spinner {
    width: 30px;
    height: 30px;
    border: 3px solid rgba(30, 207, 255, 0.3);
    border-radius: 50%;
    border-top-color: #1ecfff;
    animation: spin 1s linear infinite;
    margin-bottom: 10px;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .scroll-board {
    height: 100%;
    overflow: auto;

    table {
      width: 100%;
      border-collapse: collapse;

      th {
        padding: 10px 6px;
        text-align: center;
        font-size: 15px;
        color: #00bcd4;
        border-bottom: 1px solid rgba(0, 188, 212, 0.3);
      }

      td {
        padding: 12px 6px;
        text-align: center;
        font-size: 15px;
        color: #86c9f2;
        border-bottom: 1px solid rgba(0, 161, 255, 0.2);
      }

      tr {
        transition: all 0.3s;

        &:nth-child(even) {
          background: rgba(#00a1ff, 0.05);
        }

        &.warning {
          background: rgba(#ffb74d, 0.1);

          td {
            color: #ffb74d;
          }
        }

        &:hover {
          background: rgba(#00a1ff, 0.15);
        }
      }
    }
  }
  
  .query-btn {
    background-color: #00bcd4;
    color: #fff;
    border: none;
    padding: 4px 15px;
    border-radius: 2px;
    cursor: pointer;
    font-size: 14px;

    &:hover {
      background-color: #19b8e6;
    }
  }
  .no-data {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: #86c9f2;
    gap: 10px;
    padding: 30px 0;
  }
}

// 弹框样式
.time-detail-dialog {
  :deep(.el-dialog__header) {
    background: linear-gradient(90deg, rgba(0, 161, 255, 0.1), rgba(0, 161, 255, 0.3));
    padding: 15px 20px;
    margin-right: 0;
    
    .el-dialog__title {
      color: #00bcd4;
      font-size: 18px;
      font-weight: 500;
    }
    
    .el-dialog__headerbtn {
      top: 15px;
      right: 20px;
      
      .el-dialog__close {
        color: #00bcd4;
      }
    }
  }
  
  :deep(.el-dialog__body) {
    background-color: rgba(10, 20, 40, 0.95);
    padding: 20px;
  }
  
  .dialog-content {
    min-height: 260px;
    .table-container {
      margin-top: 15px;
      
      .table-border-wrapper {
        border: 1px solid rgba(0, 161, 255, 0.3);
        border-radius: 4px;
        overflow: hidden;
      }
      
      .empty-data {
        padding: 30px 0;
        text-align: center;
        color: #86c9f2;
      }
    }
  }
}
</style>
