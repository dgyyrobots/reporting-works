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
        <span>{{ username }}</span>
      </div>
    </div>

    <!-- 按钮导航栏 -->
    <div class="button-nav">
      <button class="nav-btn">上机登记</button>
      <button class="nav-btn red">任务单操作</button>
      <button class="nav-btn red">生产操作</button>
      <button class="nav-btn">计时登记</button>
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
import { useUserStore } from '/@/store/modules/user'
import { storeToRefs } from 'pinia'

const currentDate = ref('')
const currentTime = ref('')
const currentWeekday = ref('')
const greeting = ref('')
let timer = null

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
      span {
        margin-right: 8px;
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
    gap: 8px;
    padding: 6px;

    /* 面板通用样式 */
    .panel {
      border: none; /* 移除红色边框 */
      padding: 0;
      background-color: rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
      gap: 8px; /* y轴间隔8px */
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
