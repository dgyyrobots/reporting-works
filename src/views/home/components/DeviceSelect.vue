<template>
  <div class="device-select-container">
    <div class="device-title">欢迎您{{ userName }} , 请选择设备</div>
    <div class="device-grid">
      <el-empty v-if="!loading && deviceList.length === 0" description="暂无设备数据" />
      <el-skeleton v-else-if="loading" :rows="4" animated />
      <div 
        v-else
        v-for="item in deviceList" 
        :key="item.id" 
        class="device-item"
        @click="selectDevice(item)"
      >
        <div class="device-icon">
          <img :src="deviceIcon" alt="设备图标" />
        </div>
        <div class="device-name">{{ item.name }}</div>
        <div class="device-name">{{ item.number }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import deviceIcon from '/@/assets/workcenter/workcenter_icon.png'

import { getWorkcenterDeviceList } from '@/api/mes/wk/index.ts'

defineOptions({
  name: 'DeviceSelect',
})

// 定义props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  currentWorkcenter: {
    type: Object,
    default: () => ({})
  },
})

// 定义事件
const emit = defineEmits(['select', 'cancel'])

// 获取用户名
const userName = ref('用户')
// 添加loading状态
const loading = ref(false)

onMounted(() => {
  nextTick( async() => {
    try {
    const userInfoStr = localStorage.getItem('userInfo')
    if (userInfoStr) {
      const userInfo = JSON.parse(userInfoStr)
      // 根据实际接口返回的字段调整
      userName.value = userInfo.fullname || '用户'
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
  initData()
  })
})

const initData = () => {
  loading.value = true // 开始加载
  // 实际API调用示例
  const wc_id = props.currentWorkcenter.id
  const data = {
    filter: JSON.stringify([{"val":[{"name":"status_id","val":"1,2,3","action":"IN"},{"name":"wc_id","val":wc_id,"action":"="}],"relation":"AND"}]),
  }
  getWorkcenterDeviceList(data).then((res) => {
    deviceList.value = res.rows
    loading.value = false 
  }).catch((error) => {
    loading.value = false 
  }).finally(() => {
    loading.value = false // 结束加载
  })
  
}

// 设备数据
const deviceList = ref([])

// 选择设备
const selectDevice = (item) => {
  emit('select', item)
}
</script>

<style lang="scss" scoped>
.device-select-container {
  padding: 12px;
  background-color: rgba(0, 21, 41, 0.5);
  border-radius: 8px;
  
  .device-title {
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 20px;
    text-align: center;
    color: #40c4ff;
    text-shadow: 0 0 10px rgba(64, 196, 255, 0.5);
  }
  
  .device-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 16px;
    min-height: 200px;
    position: relative; /* 添加相对定位 */
    
    .device-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: rgba(0, 21, 41, 0.7);
      border-radius: 8px;
      padding: 15px;
      cursor: pointer;
      transition: all 0.3s;
      border: 1px solid rgba(64, 196, 255, 0.3);
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
      
      &:hover {
        box-shadow: 0 0 15px rgba(64, 196, 255, 0.5);
        transform: translateY(-3px);
        border-color: #40c4ff;
        background-color: rgba(0, 21, 41, 0.8);
      }
      
      .device-icon {
        width: 60px;
        height: 60px;
        margin-bottom: 10px;
        background-color: rgba(64, 196, 255, 0.1);
        border-radius: 50%;
        padding: 8px;
        border: 1px solid rgba(64, 196, 255, 0.2);
        box-shadow: 0 0 10px rgba(64, 196, 255, 0.2);
        
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 0 2px rgba(64, 196, 255, 0.5));
        }
      }
      
      .device-name {
        font-size: 16px;
        text-align: center;
        word-break: break-all;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        color: #fff;
        margin-top: 8px;
        text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
      }
    }
  }
}

// 修改Element Plus组件样式以匹配主题
:deep(.el-empty) {
  padding: 40px 0;
  position: absolute; /* 使用绝对定位 */
  top: 50%; /* 垂直居中 */
  left: 50%; /* 水平居中 */
  transform: translate(-50%, -50%); /* 精确居中 */
  width: 100%; /* 确保宽度占满 */
  
  .el-empty__image {
    opacity: 0.7;
    margin: 0 auto; /* 确保图片居中 */
  }
  
  .el-empty__description {
    color: #40c4ff;
    text-align: center; /* 确保文字居中 */
  }
}

:deep(.el-skeleton) {
  --el-skeleton-color: rgba(64, 196, 255, 0.1);
  --el-skeleton-to-color: rgba(64, 196, 255, 0.3);
}
</style>