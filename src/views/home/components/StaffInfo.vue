<template>
  <Card class="StaffInfo" content-padding="6px 0" :title="title">
    <div class="staff-list">
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
          {{ row[3] }}
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup>
import Card from './Card.vue'
import { ref, onMounted, watch } from 'vue'
import { getCurrentWorker } from '@/api/mes/wk/index.ts'
import headSvg from '@/assets/bigscreen/head.svg'

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
const tableHeaders = ['姓名', '工号', '班次', '状态']
const tableData = ref([])
const title = ref('员工信息')

const initData = () => {
  const device = props.currentDevice
  const currentWorkcenter = props.currentWorkcenter
  const timestamp = new Date().getTime()
  const data = {
    wc_id: currentWorkcenter.id,
    bill_date: timestamp,
    status_id:0,
    device_id:device.id
  }
  getCurrentWorker(data).then((res) => {
    tableData.value = []
    res.map((item) => {
      const name = item.emp_name || '--'
      const number = item.emp_number || '--'
      const status = item.status_name || '--'
      const classtype_name = item.classtype_name || '--'
      tableData.value.push([name, number, classtype_name, status])
    })
  })
}
watch(() => props.currentDevice, (newDevice, oldDevice) => {
  if (newDevice && newDevice.id && newDevice.id !== oldDevice?.id) {
    initData()
  }
}, { deep: true })

// 同样监听 currentWorkcenter 变化
watch(() => props.currentWorkcenter, (newWorkcenter, oldWorkcenter) => {
  if (newWorkcenter && newWorkcenter.id && newWorkcenter.id !== oldWorkcenter?.id) {
    initData()
  }
}, { deep: true })


onMounted(() => {
  initData()
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
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 500;
    
    &.status-online {
      background: rgba(34, 204, 85, 0.2);
      color: #22cc55;
    }
    
    &.status-offline {
      background: rgba(153, 153, 153, 0.2);
      color: #999999;
    }
  }
}
</style>
