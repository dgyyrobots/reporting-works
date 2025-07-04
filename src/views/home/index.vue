<template>
  <div class="home">
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
        <!-- 添加切换设备按钮 -->
        <button class="switch-device-btn" @click="openDeviceDialog">
          <i class="switch-icon"></i>
          <span v-if="currentDevice.name">{{ currentDevice.name }} {{ currentDevice.number }}</span>
          <span v-else>选择设备</span>
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
      <button class="nav-btn red" @click="openProcessSelectDialog">任务单操作</button>
      <button class="nav-btn red">生产操作</button>
      <button class="nav-btn" @click="openTimeRegistration">计时登记</button>
      <button class="nav-btn">异常登记</button>
      <button class="nav-btn">质量管理</button>
      <button class="nav-btn" @click="openProductionReportDialog">生产日报</button>
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
          <StaffInfo ref="StaffInfoRef" v-if="currentDevice" :current-device="currentDevice" :current-workcenter="currentWorkcenter" />
        </div>
        <div class="left-box box-3">
          <EquipmentTime v-if="currentDevice" :current-device="currentDevice" :current-workcenter="currentWorkcenter" />
        </div>
      </div>

      <!-- 中间面板 -->
      <div class="panel center-panel">
        <div class="center-box box-1">
          <DashboardGauge v-if="currentDevice" :current-device="currentDevice" :current-workcenter="currentWorkcenter" />
        </div>
        <div class="center-box box-2">
          <CenterBottom v-if="currentDevice" :current-device="currentDevice" />
        </div>
      </div>

      <!-- 右侧面板 -->
      <div class="panel right-panel">
        <div class="right-box box-1">
          <TaskInfoBox v-if="currentDevice" :current-device="currentDevice" :current-workcenter="currentWorkcenter" />
        </div>
        <div class="right-box box-2">
          <EquipmentHistory v-if="currentDevice" :current-device="currentDevice" :current-workcenter="currentWorkcenter" />
        </div>
        <div class="right-box box-3">
          <LicenseHistory v-if="currentDevice" :current-device="currentDevice" :current-workcenter="currentWorkcenter" />
        </div>
      </div>
    </div>

    <!-- 添加ProcessSelect组件 -->
    <ProcessSelect v-if="currentDevice" ref="processSelectRef" :current-device="currentDevice" :current-workcenter="currentWorkcenter" />

    <TimeRegistration v-if="currentDevice" ref="timeRegistrationRef" :current-device="currentDevice" />

    <!-- 添加工作中心选择弹框 -->
    <el-dialog
      v-model="deviceDialogVisible"
      class="device-dialog"
      :close-on-click-modal="false"
      :modal-class="'cyber-modal'"
      :show-close="true"
      title="选择设备"
      width="80%"
    >
      <DeviceSelect :current-workcenter="currentWorkcenter" @select="handDeviceSelect" />
    </el-dialog>

    <ProductionReportDialog  :current-workcenter="currentWorkcenter"  :current-device="currentDevice" ref="productionReportDialogRef" />
  </div>


      
    <!-- 添加员工选择弹框 -->
    <el-dialog
      v-model="staffSelectDialogVisible"
      class="staff-select-dialog"
      :close-on-click-modal="false"
      :modal-class="'cyber-modal'"
      :show-close="true"
      title="是否将设备上工人员下工?"
      width="400px"
    >
      <div class="staff-select-content">
        <div class="shift-info">
          <el-radio v-model="selectedStaff" :label="selectedStaff">{{selectedStaff}}</el-radio>
        </div>
        <div class="staff-name" v-for="item in workStore.staffList" :key="item.id">{{ item.emp_name }}</div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelStaffSelect">取消</el-button>
          <el-button type="primary" @click="handleStaffSelect">确认</el-button>
        </div>
      </template>
    </el-dialog>

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
import DeviceSelect from './components/DeviceSelect.vue'
// 引入工序选择组件替代任务单操作组件
import ProcessSelect from './dialog/ProcessSelect.vue'
// import TaskOperation from './dialog/TaskOperation.vue'
import { useUserStore } from '/@/store/modules/user'
import { useWorkStore } from '/@/store/modules/work' // 引入 work store
import { removeToken } from '/@/utils/auth'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import ProductionReportDialog from './report/ProductionReportDialog.vue'
import { sendEndWork } from '@/api/mes/wk/index.ts'
import { getDeviceDetail } from '@/api/mes/wk/index.ts'
// 控制工序选择弹窗
const processSelectRef = ref(null)
const StaffInfoRef = ref(null)
// 打开工序选择弹窗
const openProcessSelectDialog = () => {
  processSelectRef.value?.openDialog()
}

const router = useRouter()
const currentDate = ref('')
const currentTime = ref('')
const currentWeekday = ref('')
const greeting = ref('')
const selectedStaff = ref('')
// 控制计时登记弹窗
const timeRegistrationRef = ref(null)
// const taskOperationRef = ref(null) // 已移除未使用变量

let timer = null
// 设备信息刷新定时器
let deviceRefreshTimer = null


const workStore = useWorkStore()
const userStore = useUserStore()
// 修改用户名变量
const userName = ref('用户')
// 添加工作中心相关变量
const currentWorkcenter = ref({})

// 添加工作中心相关变量
const currentDevice = ref({})

const deviceDialogVisible = ref(false)

const staffSelectDialogVisible = ref(false)

const productionReportDialogRef = ref(null)

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

// 初始化时间相关功能
const initTimeDisplay = () => {
  updateDateTime() // 初始化时间
  timer = setInterval(updateDateTime, 1000) // 每秒更新一次
}

// 获取用户信息
const initUserInfo = () => {
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
}

// 获取工作中心信息
const initWorkcenterInfo = () => {
  try {
    const workcenterStr = localStorage.getItem('selectedWorkcenter')
    if (workcenterStr) {
      currentWorkcenter.value = JSON.parse(workcenterStr)
    }
  } catch (error) {
    console.error('获取工作中心信息失败:', error)
  }
}

// 获取设备信息
const initDeviceInfo = () => {
  try {
    const deviceInfo = workStore.deviceInfo || JSON.parse(localStorage.getItem('selectedDevice'))
    if (deviceInfo) {
      currentDevice.value = deviceInfo
    } else {
      // 如果没有选择设备，自动打开设备选择弹框
      setTimeout(() => {
        openDeviceDialog()
      }, 500) // 延迟500ms打开，确保组件完全加载
    }
  } catch (error) {
    console.error('获取设备信息失败:', error)
    // 出错时也打开设备选择弹框
    setTimeout(() => {
      openDeviceDialog()
    }, 500)
  }
}

// 打开设备选择弹框
const openDeviceDialog = () => {
  deviceDialogVisible.value = true
}

// 设备选择
const handDeviceSelect = (device) => {
  currentDevice.value = device
  deviceDialogVisible.value = false


  // 存储选择的工作中心信息
  localStorage.setItem('selectedDevice', JSON.stringify(device))
  // 存储设备信息到store
  workStore.setDeviceInfo(device)
    
  // 重置任务信息，避免显示旧的任务信息
  workStore.resetTaskInfo()

  // 提示用户已切换工作中心
  ElMessage.success(`已切换设备: ${device.name}`)

  getDeviceDetailInfo(device.number)
}


// 打开计时登记弹窗
const openTimeRegistration = () => {
  timeRegistrationRef.value?.openDialog()
}

// 处理退出登录
const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      // 清除 token
      removeToken()

      // 清除 localStorage 中的缓存
      const keysToRemove = [
        'userInfo',
        'selectedWorkcenter',
        'selectedDevice',
        'loginInfo',
        'TASK_INFO', // 工作任务信息缓存
      ]

      keysToRemove.forEach((key) => {
        localStorage.removeItem(key)
      })

      // 重置用户状态
      userStore.resetState()

      // 提示用户
      ElMessage.success('已退出登录')

      // 跳转到登录页
      router.push('/login')
    })
    .catch(() => {
      // 用户取消退出
    })
}

// 打开生产日报对话框
const openProductionReportDialog = () => {
  // 获取员工列表
  const staffList = workStore.getStaffList

  // 如果员工列表为空，直接打开生产日报对话框
  if (!staffList || staffList.length === 0) {
    productionReportDialogRef.value?.openDialog()
  } else {
    // 否则打开员工选择弹框
    selectedStaff.value = staffList[0].classtype_name
    staffSelectDialogVisible.value = true
  }
}

// 取消员工选择
const cancelStaffSelect = () => {
  staffSelectDialogVisible.value = false
  productionReportDialogRef.value?.openDialog()
}

// 处理员工选择
const handleStaffSelect = () => {
  const staffList = workStore.getStaffList
  const params = {
    data: JSON.stringify(staffList),
  }
  sendEndWork(params).then((res) => {
    if(res.ret === 0){
      ElMessage.success(res.msg)
      // 刷新员工列表的数据
      StaffInfoRef.value?.initData()
      staffSelectDialogVisible.value = false
      productionReportDialogRef.value?.openDialog()
    }
  })
}
// 获取设备详情
const getDeviceDetailInfo = async (number) => {
  const deviceInfo = workStore.getDeviceInfo
    const deviceNumber = number || deviceInfo.number
    if(!deviceNumber) return
    const data = {
    filter: JSON.stringify([{ val: [{ name: 'number', val: deviceNumber, action: '=' }], relation: 'OR' }]),
      filter_detail: JSON.stringify({}),
      keyword_is_detail: 0,
      show_total: 1,
      page: 1,
      rows: 50,
    }
    getDeviceDetail(data).then((res) => {
      if (res && res.rows && res.rows.length > 0) {
        const jobbill_no = res.rows[0].jobbill_no
        if(deviceInfo.jobbill_no !== jobbill_no) {
          // 更新localStorage中的selectedDevice
          localStorage.setItem('selectedDevice', JSON.stringify(res.rows[0]))
          currentDevice.value = res.rows[0]
          workStore.setDeviceInfo(res.rows[0])
        }
      } else {
        workStore.resetTaskInfo()
      }
    })
 }


// 初始化应用
const initApp = () => {
  initTimeDisplay() // 更新时间
  initUserInfo()
  initWorkcenterInfo()
  initDeviceInfo()
}

// 设置设备信息刷新定时器
const setupDeviceRefreshTimer = () => {
  // 清除可能存在的旧定时器
  if (deviceRefreshTimer) {
    clearInterval(deviceRefreshTimer)
  }
  
  // 设置新的定时器，每5秒执行一次
  deviceRefreshTimer = setInterval(() => {
    if (currentDevice.value && currentDevice.value.number) {
      getDeviceDetailInfo()
    }
  }, 5000) // 5秒 = 5000毫秒
}

// 在组件挂载时初始化
onMounted(() => {
  initApp()

  getDeviceDetailInfo()
  // 设置设备信息刷新定时器
  setupDeviceRefreshTimer()
  
})

// 组件卸载前清理资源
onBeforeUnmount(() => {
  // 清除定时器
  if (timer) {
    clearInterval(timer)
    timer = null
  }

    
  // 清除设备信息刷新定时器
  if (deviceRefreshTimer) {
    clearInterval(deviceRefreshTimer)
    deviceRefreshTimer = null
  }
})
</script>

<style lang="scss" scoped>
.home {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background-image: linear-gradient(to bottom, rgba(0, 21, 41, 0.95), rgba(0, 21, 41, 0.85)), url('@/assets/bigscreen/big_bg1.jpeg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  // 添加全局光效
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 50% 10%, rgba(30, 207, 255, 0.15), transparent 60%);
    pointer-events: none;
    z-index: 1;
  }

  .header {
    height: 60px;
    display: grid;
    grid-template-columns: 1.5fr 1fr 1.5fr;
    align-items: center;
    background-image: url('@/assets/bigscreen/title3.png');
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
    border-bottom: 1px solid rgba(#40c4ff, 0.3);
    position: relative;
    z-index: 2;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);

    .left-info {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      color: #40c4ff;
      font-family: 'Digital-7', monospace;
      text-shadow: 0 0 10px rgba(#40c4ff, 0.5);
      padding-left: 20px;

      .date,
      .weekday,
      .time {
        background: rgba(0, 21, 41, 0.5);
        padding: 4px 8px;
        border-radius: 4px;
        border: 1px solid rgba(#40c4ff, 0.2);
      }
    }

    .title {
      text-align: center;
      font-weight: bold;
      color: #40c4ff;
      font-size: 28px;
      margin: 0;
      letter-spacing: 2px;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 100px;
        height: 2px;
        background: linear-gradient(to right, transparent, #40c4ff, transparent);
      }
    }

    .right-info {
      text-align: right;
      font-size: 16px;
      color: #40c4ff;
      padding-right: 24px;
      letter-spacing: 1px;
      display: flex;
      align-items: center;
      justify-content: flex-end;

      span {
        margin-right: 8px;
      }

      .switch-device-btn,
      .logout-btn {
        margin-left: 12px;
        background-color: rgba(0, 21, 41, 0.6);
        border: 1px solid #40c4ff;
        border-radius: 4px;
        color: #40c4ff;
        padding: 4px 12px;
        font-size: 14px;
        cursor: pointer;
        display: flex;
        align-items: center;
        transition: all 0.3s;
        box-shadow: 0 0 10px rgba(64, 196, 255, 0.2);

        &:hover {
          background-color: rgba(64, 196, 255, 0.2);
          box-shadow: 0 0 15px rgba(64, 196, 255, 0.4);
          transform: translateY(-2px);
        }

        .switch-icon,
        .logout-icon {
          display: inline-block;
          width: 14px;
          height: 14px;
          margin-right: 5px;
          filter: drop-shadow(0 0 2px rgba(64, 196, 255, 0.8));
        }
        .switch-icon {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2340c4ff'%3E%3Cpath d='M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z'/%3E%3C/svg%3E");
          background-size: cover;
        }

        .logout-icon {
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
    gap: 15px;
    padding: 12px 0;
    background-color: rgba(0, 0, 0, 0.3);
    position: relative;
    z-index: 2;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);

    .nav-btn {
      min-width: 100px;
      height: 36px;
      border: none;
      border-radius: 4px;
      background: linear-gradient(to bottom, #00d2ff, #00bcd4);
      color: white;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: all 0.5s;
      }

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);

        &::before {
          left: 100%;
        }
      }

      &:active {
        transform: translateY(-1px);
      }

      &.red {
        background: linear-gradient(to bottom, #ff7676, #ff5252);
      }
    }
  }

  /* 主内容区三栏布局 */
  .main-content {
    height: calc(100% - 116px);
    display: flex;
    gap: 8px;
    padding: 0px 10px 12px 12px;
    position: relative;
    z-index: 2;

    /* 面板通用样式 */
    .panel {
      border: none;
      padding: 0;
      background-color: rgba(0, 0, 0, 0.3);
      display: flex;
      flex-direction: column;
      gap: 8px;
      overflow: hidden;
    }

    /* 左侧面板 */
    .left-panel {
      width: 28%;
      .left-box {
        width: 100%;
        overflow: hidden;
        transition: all 0.3s;

        &:hover {
          box-shadow: 0 4px 12px rgba(64, 196, 255, 0.2);
          border-color: rgba(64, 196, 255, 0.3);
        }

        &.box-1 {
          height: calc((100% - 24px) * 0.28);
        }

        &.box-2 {
          height: calc((100% - 24px) * 0.36);
        }

        &.box-3 {
          height: calc((100% - 24px) * 0.36);
        }
      }
    }

    /* 中间面板 */
    .center-panel {
      width: 44%;

      .center-box {
        width: 100%;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

        transition: all 0.3s;

        &:hover {
          box-shadow: 0 4px 12px rgba(64, 196, 255, 0.2);
          border-color: rgba(64, 196, 255, 0.3);
        }

        &.box-1 {
          height: calc((100% - 12px) * 0.7);
          border: 1px solid rgba(64, 196, 255, 0.15);
          border-radius: 4px;
        }

        &.box-2 {
          height: calc((100% - 12px) * 0.3);
        }
      }
    }

    /* 右侧面板 */
    .right-panel {
      width: 28%;

      .right-box {
        width: 100%;
        overflow: hidden;
        transition: all 0.3s;

        &:hover {
          box-shadow: 0 4px 12px rgba(64, 196, 255, 0.2);
          border-color: rgba(64, 196, 255, 0.3);
        }

        &.box-1 {
          height: calc((100% - 24px) * 0.36);
        }

        &.box-2 {
          height: calc((100% - 24px) * 0.32);
        }

        &.box-3 {
          height: calc((100% - 24px) * 0.32);
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

/* 添加设备选择弹窗样式 */
:deep(.device-dialog) {
  .el-dialog {
    background-color: rgba(0, 21, 41, 0.9);
    border: 1px solid rgba(64, 196, 255, 0.4);
    border-radius: 8px;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(10px);

    .el-dialog__header {
      border-bottom: 1px solid rgba(64, 196, 255, 0.3);
      padding: 15px 20px;
      margin-right: 0;

      .el-dialog__title {
        color: #40c4ff;
        font-size: 18px;
        font-weight: bold;
        text-shadow: 0 0 10px rgba(64, 196, 255, 0.4);
      }

      .el-dialog__headerbtn {
        .el-dialog__close {
          color: #40c4ff;

          &:hover {
            color: #fff;
            transform: rotate(90deg);
            transition: all 0.3s;
          }
        }
      }
    }

    .el-dialog__body {
      padding: 20px;
      color: #fff;
      background-color: rgba(0, 21, 41, 0.7);
    }
  }
}

.task-operation-btn {
  background: linear-gradient(to bottom, #ffd54f, #ffc107);
  border: none;

  &:hover {
    background: linear-gradient(to bottom, #ffca28, #ffb300);
    box-shadow: 0 0 15px rgba(255, 193, 7, 0.5);
  }

  .action-icon {
    color: #fff;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
  }
}
</style>

<style lang="scss">
/* 全局样式，不使用scoped */
.cyber-modal {
  background-color: rgba(0, 21, 41, 0.85) !important;
  backdrop-filter: blur(8px) !important;
}

/* 强制覆盖Element Plus对话框样式 */
.el-overlay-dialog {
  .el-dialog.device-dialog {
    background-color: rgba(0, 21, 41, 0.9);
    border: 1px solid #1ecfff;
    border-radius: 8px;
    box-shadow: 0 0 30px rgba(30, 207, 255, 0.4);
    overflow: hidden;

    .el-dialog__body {
      padding: 20px !important;
      color: #fff !important;
    }

    .el-dialog__header {
      height: 50px !important;
      color: #1ecfff !important;
      background: linear-gradient(to right, rgba(0, 21, 41, 0.9), rgba(30, 207, 255, 0.1), rgba(0, 21, 41, 0.9));
      border-bottom: 1px solid rgba(30, 207, 255, 0.3);
      padding: 10px 20px !important;
      margin-right: 0 !important;

      .el-dialog__title {
        color: #1ecfff !important;
        font-size: 18px !important;
        font-weight: bold !important;
        text-shadow: 0 0 10px rgba(30, 207, 255, 0.5) !important;
        letter-spacing: 1px;
      }

      .el-dialog__headerbtn {
        top: 15px !important;

        .el-dialog__close {
          color: #1ecfff !important;
          transition: all 0.3s;

          &:hover {
            color: #fff !important;
            transform: rotate(90deg);
          }
        }
      }
    }
  }
}

/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 21, 41, 0.5);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(30, 207, 255, 0.5);
  border-radius: 4px;

  &:hover {
    background: rgba(30, 207, 255, 0.7);
  }
}

/* 添加全局卡片样式 */
.card-header {
  background: linear-gradient(to right, rgba(0, 21, 41, 0.9), rgba(30, 207, 255, 0.1), rgba(0, 21, 41, 0.9));
  border-bottom: 1px solid rgba(30, 207, 255, 0.3);
  padding: 8px 12px;
  font-size: 16px;
  color: #1ecfff;
  font-weight: bold;
  text-shadow: 0 0 8px rgba(30, 207, 255, 0.4);
  letter-spacing: 1px;
}

.card-content {
  padding: 12px;
  color: #fff;
}
.staff-select-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  
  .shift-info {
    margin-bottom: 15px;
    display: flex;
    justify-content: center;
    :deep(.el-radio__label) {
      color: #fff !important;
    }
    .el-radio {
      margin-right: 0;
    }
  }
  
  .staff-name {
    font-size: 16px;
    font-weight: bold;
    color: #1ecfff;
    margin-top: 10px;
    text-align: center;
  }
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 20px;
}
</style>
