<template>
  <div class="home">
    <!-- 顶部标题 -->
    <div class="header">
      <div class="logo-container">
        <img alt="Logo" class="logo" src="@/assets/bigscreen/logo.png" />
      </div>
      <h1 class="title">生产实时监控平台</h1>
      <div class="time-container">
        <div class="time">
          <span style="margin-right: 10px">{{ currentDate }}</span>
          <span>{{ currentTime }}</span>
        </div>
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
        <div class="left-box box-1"></div>
        <div class="left-box box-2"></div>
        <div class="left-box box-3"></div>
      </div>

      <!-- 中间面板 -->
      <div class="panel center-panel">
        <div class="center-box box-1"></div>
        <div class="center-box box-2"></div>
      </div>

      <!-- 右侧面板 -->
      <div class="panel right-panel">
        <div class="right-box box-1"><TaskInfoBox /></div>
        <div class="right-box box-2"></div>
        <div class="right-box box-3"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import TaskInfoBox from './components/TaskInfoBox.vue'

const currentDate = ref('')
const currentTime = ref('')
let timer = null

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

// 更新日期和时间
const updateDateTime = () => {
  const now = new Date()
  currentDate.value = formatDate(now)
  currentTime.value = formatTime(now)
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
    grid-template-columns: 200px 1fr 200px;
    align-items: center;
    padding: 0;
    background-image: url('@/assets/bigscreen/title3.png');
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
    border-bottom: 1px solid rgba(#40c4ff, 0.2);
    .logo-container {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: 0 20px 0 0px;
      perspective: 1000px;

      .logo {
        height: 40px;
        width: auto;
        object-fit: contain;
        animation:
          logoFadeIn 1.5s ease-out,
          logoRepeat 11s 1.5s infinite;
        opacity: 0;
        transform: scale(0.8) rotateY(90deg);
        transform-style: preserve-3d;
        backface-visibility: visible;
        position: absolute;
        left: 12px;
        top: 6px;
      }
    }

    .title {
      text-align: center;
      font-weight: bold;
      text-shadow: 0 0 20px rgba(#40c4ff, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      margin: 0;
      color: #40c4ff;
      // padding-left: 120px;
    }

    .time-container {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      height: 100%;
      width: 200px;

      .time {
        font-size: 18px;
        color: #40c4ff;
        font-family: 'Digital-7', monospace;
        text-shadow: 0 0 10px rgba(#40c4ff, 0.5);
        line-height: 1.2;
        width: 100%;
      }

      .date {
        font-size: 16px;
        color: #8bb4f7;
        margin-top: 2px;
        line-height: 1.2;
        width: 100%;
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
      border-radius: 4px;
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
        border: 1px solid #00ff00; /* 绿色边框，便于区分 */
        border-radius: 4px;

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
        border: 1px solid #0000ff; /* 蓝色边框，便于区分 */
        border-radius: 4px;

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
        border: 1px solid #ffff00; /* 黄色边框，便于区分 */
        border-radius: 4px;

        &.box-1 {
          height: calc((100% - 16px) * 0.4); /* 总高度减去间隔后的40% */
        }

        &.box-2 {
          height: calc((100% - 16px) * 0.3); /* 总高度减去间隔后的30% */
        }

        &.box-3 {
          height: calc((100% - 16px) * 0.3); /* 总高度减去间隔后的30% */
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
