<template>
  <div class="home">
    <!-- 顶部标题 -->
    <div class="header">
      <div class="left-info">
        <span class="date">{{ currentDate }}</span>
        <span class="weekday">{{ currentWeekday }}</span>
        <span class="time">{{ currentTime }}</span>
      </div>
      <h1 class="title">车间报工系统</h1>
      <div class="right-info">
        <span>{{ greeting }}</span>
        <span>欢迎您,</span>
        <span>{{ userName }}</span>
        <!-- 添加切换现场工作台按钮 -->
        <button class="switch-workcenter-btn" @click="openWorkcenterDialog">
          <i class="switch-icon"></i>
          {{ currentWorkcenter.name || '选择现场工作台' }}
        </button>
        <button class="logout-btn" @click="handleLogout">
          <i class="logout-icon"></i>
          退出登录
        </button>
      </div>
    </div>

    <!-- 按钮导航栏 -->
    <div class="button-nav">
      <button class="nav-btn">上机登记</button>
      <button class="nav-btn red">任务单操作</button>
      <button class="nav-btn red">生产操作</button>
      <button class="nav-btn" @click="openTimeRegistration">计时登记</button>
      <button class="nav-btn">异常登记</button>
      <button class="nav-btn">质量管理</button>
      <button class="nav-btn">设备管理</button>
      <button class="nav-btn">其他操作</button>
      <button class="nav-btn">帮助</button>
    </div>

    <!-- 主要内容区 -->
    <div class="main-content">
      <!-- 左侧面板 -->
      <div class="panel left-panel">
        <div class="left-box box-1">
          <PayInfo />
        </div>
        <div class="left-box box-2">
          <StaffInfo />
        </div>
        <div class="left-box box-3">
          <EquipmentTime />
        </div>
      </div>

      <!-- 中间面板 -->
      <div class="panel center-panel">
        <div class="center-box box-1">
          <DashboardGauge />
        </div>
        <div class="center-box box-2">
          <CenterBottom />
        </div>
      </div>

      <!-- 右侧面板 -->
      <div class="panel right-panel">
        <div class="right-box box-1">
          <TaskInfoBox />
        </div>
        <div class="right-box box-2">
          <EquipmentHistory />
        </div>
        <div class="right-box box-3">
          <LicenseHistory />
        </div>
      </div>
    </div>

    <!-- 对话框组件 -->
    <TimeRegistration ref="timeRegistrationRef" />
        
    <!-- 添加工作中心选择弹框 -->
    <el-dialog
      v-model="workcenterDialogVisible"
      title="切换现场工作台"
      width="80%"
      :close-on-click-modal="false"
      :show-close="true"
    >
      <workcenter-select @select="handleWorkcenterSelect" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import TaskInfoBox from './components/TaskInfoBox.vue'
import DashboardGauge from './components/DashboardGauge.vue'
import EquipmentHistory from './components/EquipmentHistory.vue'
import LicenseHistory from './components/LicenseHistory.vue'
import EquipmentTime from './components/EquipmentTime.vue'
import PayInfo from './components/PayInfo.vue'
import StaffInfo from './components/StaffInfo.vue'
import CenterBottom from './components/CenterBottom.vue'
import TimeRegistration from './dialog/TimeRegistration.vue'
import WorkcenterSelect from '../login/components/WorkcenterSelect.vue'
import { useUserStore } from '/@/store/modules/user'
import { storeToRefs } from 'pinia'
import { removeToken } from '/@/utils/auth'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const currentDate = ref('')
const currentTime = ref('')
const currentWeekday = ref('')
const greeting = ref('')
let timer = null

// 修改用户名变量
const userName = ref('用户')
// 添加工作中心相关变量
const currentWorkcenter = ref({})
const workcenterDialogVisible = ref(false)

// 在组件挂载时获取用户信息和工作中心信息
onMounted(() => {
  updateDateTime() // 初始化时间
  timer = setInterval(updateDateTime, 1000) // 每秒更新一次
  
  // 获取用户信息
  try {
    const userInfoStr = localStorage.getItem('userInfo')
    if (userInfoStr) {
      const userInfo = JSON.parse(userInfoStr)
      // 使用与WorkcenterSelect.vue相同的字段
      userName.value = userInfo.fullname || '用户'
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
  
  // 获取当前选中的工作中心
  try {
    const workcenterStr = localStorage.getItem('selectedWorkcenter')
    if (workcenterStr) {
      currentWorkcenter.value = JSON.parse(workcenterStr)
    }
  } catch (error) {
    console.error('获取工作中心信息失败:', error)
  }
})

// 打开工作中心选择弹框
const openWorkcenterDialog = () => {
  workcenterDialogVisible.value = true
}

// 处理工作中心选择
const handleWorkcenterSelect = (workcenter) => {
  currentWorkcenter.value = workcenter
  workcenterDialogVisible.value = false
  
  // 存储选择的工作中心信息
  localStorage.setItem('selectedWorkcenter', JSON.stringify(workcenter))
  
  // 提示用户已切换工作中心
  ElMessage.success(`已切换到现场工作台: ${workcenter.name}`)
}

const userStore = useUserStore()
const { username } = storeToRefs(userStore)

// 格式化日期为 YYYY-MM-DD 格式
const formatDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 格式化时间为 HH:MM:SS 格式
const formatTime = (date) => {
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

const getWeekday = (date) => {
  const weekArr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  return weekArr[date.getDay()]
}

function getGreeting(hour) {
  if (hour < 6) return '凌晨好!'
  if (hour < 9) return '早上好!'
  if (hour < 12) return '上午好!'
  if (hour < 14) return '中午好!'
  if (hour < 18) return '下午好!'
  return '晚上好!'
}

// 更新日期和时间
const updateDateTime = () => {
  const now = new Date()
  currentDate.value = formatDate(now)
  currentTime.value = formatTime(now)
  currentWeekday.value = getWeekday(now)
  greeting.value = getGreeting(now.getHours())
}

onMounted(() => {
  updateDateTime() // 初始化时间
  timer = setInterval(updateDateTime, 1000) // 每秒更新一次
})

onBeforeUnmount(() => {
  // 清除定时器
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})

// 控制计时登记弹窗
const timeRegistrationRef = ref(null)

const openTimeRegistration = () => {
  timeRegistrationRef.value?.openDialog()
}

// 退出登录
const handleLogout = () => {
  // 清除token
  removeToken()
  // 返回登录页
  router.push('/login')
}
</script>

<style lang="scss" scoped>
.home {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background-image: url('@/assets/bigscreen/big_bg1.jpeg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: rgba(#001529, 0.9);

  .header {
    height: 60px;
    display: grid;
    grid-template-columns: 1.5fr 1fr 1.5fr;
    align-items: center;
    background-image: url('@/assets/bigscreen/title3.png');
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
    border-bottom: 1px solid rgba(#40c4ff, 0.2);

    .left-info {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      color: #40c4ff;
      font-family: 'Digital-7', monospace;
      text-shadow: 0 0 10px rgba(#40c4ff, 0.5);
      padding-left: 12px;
    }

    .title {
      text-align: center;
      font-weight: bold;
      text-shadow: 0 0 20px rgba(#40c4ff, 0.5);
      color: #40c4ff;
      font-size: 28px;
      margin: 0;
    }

    .right-info {
      text-align: right;
      font-size: 16px;
      color: #00bcd4;
      text-shadow: 0 0 8px #ffe60055;
      padding-right: 24px;
      letter-spacing: 1px;
      display: flex;
      align-items: center;
      justify-content: flex-end;

      span {
        margin-right: 8px;
      }

      // 添加切换工作中心按钮样式
      .switch-workcenter-btn {
        margin-left: 12px;
        background-color: transparent;
        border: 1px solid #40c4ff;
        border-radius: 4px;
        color: #40c4ff;
        padding: 2px 10px;
        font-size: 14px;
        cursor: pointer;
        display: flex;
        align-items: center;
        transition: all 0.3s;
        max-width: 180px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        &:hover {
          background-color: rgba(255, 235, 59, 0.2);
          box-shadow: 0 0 8px rgba(64, 196, 255, 0.5);
        }

        .switch-icon {
          display: inline-block;
          width: 14px;
          height: 14px;
          margin-right: 5px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2340c4ff'%3E%3Cpath d='M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z'/%3E%3C/svg%3E");
          background-size: cover;
        }
      }
      .logout-btn {
        margin-left: 12px;
        background-color: transparent;
        border: 1px solid #40c4ff;
        border-radius: 4px;
        color: #40c4ff;
        padding: 2px 10px;
        font-size: 14px;
        cursor: pointer;
        display: flex;
        align-items: center;
        transition: all 0.3s;

        &:hover {
          background-color: rgba(64, 196, 255, 0.2);
          box-shadow: 0 0 8px rgba(64, 196, 255, 0.5);
        }

        .logout-icon {
          display: inline-block;
          width: 14px;
          height: 14px;
          margin-right: 5px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2340c4ff'%3E%3Cpath d='M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z'/%3E%3C/svg%3E");
          background-size: cover;
        }
      }
    }
  }

  /* 按钮导航样式 */
  .button-nav {
    display: flex;
    justify-content: center;
    gap: 12px;
    padding: 10px 0;
    background-color: rgba(0, 0, 0, 0.2);

    .nav-btn {
      min-width: 90px;
      height: 36px;
      border: none;
      border-radius: 4px;
      background-color: #00bcd4; /* 默认蓝绿色按钮 */
      color: white;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      }

      &.red {
        background-color: #ff5252; /* 红色按钮 */
      }
    }
  }

  /* 主内容区三栏布局 */
  .main-content {
    height: calc(100% - 110px); /* 调整高度，考虑按钮导航的高度 */
    display: flex;
    gap: 10px;
    padding: 6px 12px 12px 12px;

    /* 面板通用样式 */
    .panel {
      border: none; /* 移除红色边框 */
      padding: 0;
      background-color: rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
      gap: 10px; /* y轴间隔8px */
    }

    /* 左侧面板 */
    .left-panel {
      width: 28%;

      .left-box {
        width: 100%;

        &.box-1 {
          height: calc((100% - 16px) * 0.28);
        }

        &.box-2 {
          height: calc((100% - 16px) * 0.36);
        }

        &.box-3 {
          height: calc((100% - 16px) * 0.36);
        }
      }
    }

    /* 中间面板 */
    .center-panel {
      width: 44%;

      .center-box {
        width: 100%;
        &.box-1 {
          height: calc((100% - 8px) * 0.7); /* 总高度减去间隔后的70% */
        }

        &.box-2 {
          height: calc((100% - 8px) * 0.3); /* 总高度减去间隔后的30% */
        }
      }
    }

    /* 右侧面板 */
    .right-panel {
      width: 28%;

      .right-box {
        width: 100%;

        &.box-1 {
          height: calc((100% - 16px) * 0.36); /* 总高度减去间隔后的40% */
        }

        &.box-2 {
          height: calc((100% - 16px) * 0.32); /* 总高度减去间隔后的30% */
        }

        &.box-3 {
          height: calc((100% - 16px) * 0.32); /* 总高度减去间隔后的30% */
        }
      }
    }
  }
}

/* 添加动画 */
@keyframes logoFadeIn {
  0% {
    opacity: 0;
    transform: scale(0.8) rotateY(90deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotateY(0deg);
  }
}

@keyframes logoRepeat {
  0%,
  100% {
    transform: scale(1) rotateY(0deg);
  }
  50% {
    transform: scale(1.05) rotateY(10deg);
  }
}
</style>
