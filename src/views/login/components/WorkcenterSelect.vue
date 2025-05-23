<template>
  <div class="workcenter-select-container">
    <div class="workcenter-title">欢迎您{{ userName }} , 请选择现场工作台</div>
    <div class="workcenter-grid">
      <el-empty v-if="!loading && workcenterList.length === 0" description="暂无现场工作台数据" />
      <el-skeleton v-else-if="loading" :rows="4" animated />
      <div 
        v-else
        v-for="item in workcenterList" 
        :key="item.id" 
        class="workcenter-item"
        @click="selectWorkcenter(item)"
      >
        <div class="workcenter-icon">
          <img :src="workcenterIcon" alt="现场工作台图标" />
        </div>
        <div class="workcenter-name">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import workcenterIcon from '/@/assets/workcenter/workcenter_icon.png'
import { getWorkcenterList } from '@/api/mes/wk/index.ts'

defineOptions({
  name: 'WorkcenterSelect',
})

// 定义props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

// 定义事件
const emit = defineEmits(['select', 'cancel'])

// 获取用户名
const userName = ref('用户')
// 添加loading状态
const loading = ref(false)

onMounted(() => {
  try {
    const userInfoStr = localStorage.getItem('userInfo')
    if (userInfoStr) {
      const userInfo = JSON.parse(userInfoStr)
      // 根据实际接口返回的字段调整
      userName.value = userInfo.fullname  || '用户'
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
  initData()
})

const initData = () => {
  loading.value = true // 开始加载
  const data = {
    action: 'get_can_view_workercenter',
  }
  getWorkcenterList(data).then((res) => {
    console.log(res, 'dddddddddd')
    workcenterList.value = res
  }).catch((error) => {
    console.error('获取现场工作台列表失败:', error) 
  }).finally(() => {
    loading.value = false // 结束加载
  })
}

// 现场工作台数据
const workcenterList = ref([])

// 选择现场工作台
const selectWorkcenter = (item) => {
  emit('select', item)
}
</script>

<style lang="scss" scoped>
.workcenter-select-container {
  padding: 0px 12px 12px 12px;
  
  .workcenter-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .workcenter-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    min-height: 200px;
    
    .workcenter-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: #fff;
      border-radius: 8px;
      padding: 15px;
      cursor: pointer;
      transition: all 0.3s;
      border: 1px solid #eee;
      
      &:hover {
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        transform: translateY(-3px);
        border-color: var(--el-color-primary);
      }
      
      .workcenter-icon {
        width: 60px;
        height: 60px;
        margin-bottom: 10px;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
      
      .workcenter-name {
        font-size: 14px;
        text-align: center;
        word-break: break-all;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }
  }
}
</style>