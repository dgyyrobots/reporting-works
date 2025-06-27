<template>
  <Card class="StaffInfo" content-padding="6px 0" :title="title" :show-empty="!loading && (!tableData.length || tableData.length === 0)">
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <span>加载中...</span>
    </div>
    <div v-else-if="tableData.length > 0" class="staff-list">
      <div v-for="(row, index) in tableData" :key="index" class="staff-item">
        <div class="avatar">
          <img :src="headSvg" alt="头像" />
        </div>
        <div class="info">
          <div class="name">{{ row[0] }}</div>
          <div class="details">
            <span class="number">{{ row[1] }}</span>
            <span class="shift">{{ row[2] }}</span>
          </div>
        </div>
        <div 
          class="status" 
          :class="{
            'status-online': row[3] === '上工',
            'status-offline': row[3] !== '上工',
          }"
        >
          <span class="status-dot"></span>
          {{ row[3] }}
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup>
import Card from './Card.vue'
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { getCurrentWorker } from '@/api/mes/wk/index.ts'
import headSvg from '@/assets/bigscreen/head.svg'
import { useWorkStore } from '@/store/modules/work' // 导入store
// 定义props
const props = defineProps({
  currentWorkcenter: {
    type: Object,
    default: () => ({})
  },
  currentDevice: {
    type: Object,
    default: () => ({})
  },
})
const workStore = useWorkStore() // 使用store
const tableData = ref([])
const title = ref('员工信息')
// 添加定时器变量
let dataRefreshTimer = null
// 添加加载状态
const loading = ref(false)

// 设置定时刷新数据
const setupDataRefreshTimer = () => {
  // 清除可能存在的旧定时器
  if (dataRefreshTimer) {
    clearInterval(dataRefreshTimer)
  }
  
  // 设置新的定时器，每2小时执行一次
  dataRefreshTimer = setInterval(() => {
    console.log('定时刷新员工信息数据')
    if (props.currentDevice && props.currentDevice.id && 
        props.currentWorkcenter && props.currentWorkcenter.id) {
      initData()
    }
  }, 0.5 * 60 * 60 * 1000) // 0.5小时 = 0.5 * 60 * 60 * 1000毫秒
}

const initData = () => {
  // 显示加载状态
  loading.value = true
  
  const device = props.currentDevice
  const currentWorkcenter = props.currentWorkcenter
  
  // 添加有效性检查
  if (!device || !device.id || !currentWorkcenter || !currentWorkcenter.id) {
    console.warn('设备ID或工作中心ID不存在，无法获取员工信息')
    loading.value = false
    return
  }
  
  const timestamp = new Date().getTime()
  const data = {
    wc_id: currentWorkcenter.id,
    bill_date: timestamp,
    status_id: 0,
    device_id: device.id
  }
  
  getCurrentWorker(data).then((res) => {
    tableData.value = []
    const staffList = []
    if (res && Array.isArray(res)) {
      res.map((item) => {
        const name = item.emp_name || '--'
        const number = item.emp_number || '--'
        const status = item.status_name || '--'
        const classtype_name = item.classtype_name || '--'
        tableData.value.push([name, number, classtype_name, status])
        staffList.push({
          emp_name: item.emp_name,
          emp_number: item.emp_number,
          status_name: item.status_name,
          classtype_name: item.classtype_name,
          // 保存其他可能需要的字段
          ...item
        })
      })
    }
    workStore.setStaffList(staffList)
    loading.value = false
  }).catch(error => {
    console.error('获取员工信息失败:', error)
    tableData.value = []
    workStore.setStaffList([])
    loading.value = false
  })
}

// 修改 watch 逻辑，确保只有当设备和工作中心都有效时才请求数据
watch(() => [props.currentDevice, props.currentWorkcenter], ([newDevice, newWorkcenter]) => {
  if (newDevice && newDevice.id && newWorkcenter && newWorkcenter.id) {
    initData()
    // 设备或工作中心变化时重新设置定时器
    setupDataRefreshTimer()
  }
}, { deep: true, immediate: true })

// 组件挂载时初始化定时器
onMounted(() => {
  if (props.currentDevice && props.currentDevice.id && 
      props.currentWorkcenter && props.currentWorkcenter.id) {
    setupDataRefreshTimer()
  }
})

// 组件卸载时清除定时器
onUnmounted(() => {
  if (dataRefreshTimer) {
    clearInterval(dataRefreshTimer)
    dataRefreshTimer = null
  }
})
</script>

<style lang="scss" scoped>
.StaffInfo {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  color: #fff;
  display: flex;
  flex-direction: column;

  .staff-list {
    height: 100%;
    overflow-y: auto;
    padding: 10px;
    
    &::-webkit-scrollbar {
      width: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
      background-color: rgba(0, 188, 212, 0.5);
      border-radius: 4px;
    }
  }

  .staff-item {
    display: flex;
    align-items: center;
    padding: 12px 10px;
    margin-bottom: 10px;
    background: rgba(0, 161, 255, 0.15);
    border-radius: 8px;
    transition: all 0.3s;
    
    &:hover {
      background: rgba(0, 161, 255, 0.45);
    }
    
    &:nth-child(even) {
      background: rgba(10, 30, 60, 0.4);
    }
  }
  
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 12px;
    background: rgba(0, 188, 212, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  .info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    
    .name {
      font-size: 16px;
      font-weight: 500;
      color: #fff;
      margin-bottom: 4px;
    }
    
    .details {
      display: flex;
      font-size: 13px;
      color: #86c9f2;
      
      .number {
        margin-right: 12px;
      }
      
      .shift {
        color: #00bcd4;
      }
    }
  }
  
  .status {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 500;
    padding-right: 14px;
    
    .status-dot {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      margin-right: 5px;
    }
    
    &.status-online {
      color: #22cc55;
      
      .status-dot {
        background-color: #22cc55;
        box-shadow: 0 0 4px #22cc55;
      }
    }
    
    &.status-offline {
      color: #999999;
      
      .status-dot {
        background-color: #999999;
      }
    }
  }
  
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
    to {
      transform: rotate(360deg);
    }
  }
}
</style>
