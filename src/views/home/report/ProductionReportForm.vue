<template>
  <div>
    <div class="report-form" v-show="isExpanded">
        <!-- 第一行: 3个item -->
        <div class="form-row">
        <div class="form-item" style="flex: 0 0 50%;">
            <label>单据日期:</label>
            <el-date-picker 
            v-model="formData.reportDate" 
            type="date" 
            placeholder="选择日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            />
        </div>
        <div class="form-item" style="flex: 0 0 25%;">
            <label>工作中心: <span class="required">*</span></label>
            <div class="input-with-search">
            <el-input v-model="formData.wc_name" placeholder="请输入" />
            </div>
        </div>
        <div class="form-item" style="flex: 0 0 25%;">
            <label>工作中心编码:</label>
            <el-input v-model="formData.wc_number" placeholder="请输入" />
        </div>
        </div>
        
        <!-- 第二行: 4个item -->
        <div class="form-row">
        <div class="form-item" style="flex: 0 0 25%;">
            <label>工序: <span class="required">*</span></label>
            <div class="input-with-search">
            <el-select v-model="formData.wp_name" filterable  placeholder="请选择">
                <el-option v-for="(item,i) in processList" :key="item.id" :label="item.name" :value="item.name" />
            </el-select>
            </div>
        </div>
        <div class="form-item" style="flex: 0 0 25%;">
            <label>工序编码:</label>
            <el-input v-model="formData.wp_number" placeholder="请输入" />
        </div>
        <div class="form-item" style="flex: 0 0 25%;">
            <label>设备:</label>
            <div class="input-with-search">
            <el-select v-model="formData.device_number" filterable  placeholder="请选择">
                <el-option v-for="(item,i) in deviceList" :key="item.id" :label="item.name" :value="item.number" />
            </el-select>
            <!-- <el-input v-model="formData.device_name" placeholder="请输入" /> -->
            </div>
        </div>
        <div class="form-item" style="flex: 0 0 25%;">
            <label>设备编码:</label>
            <el-input v-model="formData.device_number" placeholder="请输入" />
        </div>
        </div>
        
        <!-- 第三行: 4个item -->
        <div class="form-row">
        <div class="form-item" style="flex: 0 0 25%;">
            <label>班次: <span class="required">*</span></label>
            <div class="input-with-search">
            <el-select v-model="formData.shiftCode" placeholder="请选择">
                <el-option label="白班" value="001" />
                <el-option label="晚班" value="002" />
            </el-select>
            </div>
        </div>
        <div class="form-item" style="flex: 0 0 25%;">
            <label>班次编码:</label>
            <el-input v-model="formData.shiftCode" placeholder="请输入" />
        </div>
        <div class="form-item" style="flex: 0 0 25%;">
            <label>开始时间:</label>
            <el-date-picker 
            v-model="formData.startTime" 
            type="datetime" 
            placeholder="选择日期时间"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm"
            />
        </div>
        <div class="form-item" style="flex: 0 0 25%;">
            <label>结束时间:</label>
            <el-date-picker 
            v-model="formData.endTime" 
            type="datetime" 
            placeholder="选择日期时间"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm"
            />
        </div>
        </div>
        
        <!-- 第四行: 2个item -->
        <div class="form-row">
        <div class="form-item" style="flex: 0 0 50%;" @click="handSearchPerson">
            <label>员工:</label>
            <div class="input-with-search">
            <el-input v-model="formData.employee" readonly placeholder="请选择" />
            <el-button class="search-btn" @click="handSearchPerson"><el-icon><Search /></el-icon></el-button>
            </div>
        </div>
        <div class="form-item" style="flex: 0 0 50%;">
            <label>工号:</label>
            <el-input v-model="formData.employeeId"  placeholder="请输入" />
        </div>
        </div>
    </div>

    <div class="expand-collapse-bar" @click="toggleExpand">
      <span class="expand-text">{{ isExpanded ? '收起' : '展开' }}</span>
      <img v-if="isExpanded" src="@/icon/shouqi.svg" alt="收起" class="expand-icon" />
      <img v-else src="@/icon/zhankai.svg" alt="展开" class="expand-icon" />
    </div>
    <ChoosePerson ref="choosePersonRef" @confirm="handlePersonConfirm" @close="handlePersonClose" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch,defineProps } from 'vue'
import { Search } from '@element-plus/icons-vue'
import ChoosePerson from './components/ChoosePerson.vue'
import {getAllProcess } from '@/api/mes/wk/index.ts'
import { useWorkStore } from '@/store/modules/work'
import { getWorkcenterDeviceList } from '@/api/mes/wk/index.ts'
// 定义props
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
const workStore = useWorkStore()
const isExpanded = ref(true)
const choosePersonRef = ref(null)
const processList = ref([])
const deviceList = ref([])
const formData = reactive({
  reportDate: new Date().toISOString().split('T')[0], // 今天日期
  wc_name: '',
  wc_number: '',
  wp_name: '',
  wp_number: '',
  device_name: '',
  device_number: '',
  shiftName: '',
  shiftCode: '',
  startTime: '',
  endTime: '',
  employee: '',
  employeeId: ''
})

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}
const handSearchPerson = () => {
  choosePersonRef.value.open()
}
const handlePersonConfirm = (selectedPerson) => {
  if(selectedPerson.length>0){
    let nameArr = []
    let idArr = []
    selectedPerson.map(item=>{
      nameArr.push(item.name)
      idArr.push(item.id)
    })
    formData.employee = nameArr.join(',')
    formData.employeeId = idArr.join(',')
  }
}
const initProcessList = async () => {
  const params = {
    _: Date.now()
  }
  const res = await getAllProcess(params)

  processList.value = res

  const storeTaskInfo = workStore.getTaskInfo

  processList.value.map(item=>{
    if(item.name == storeTaskInfo.wp_name){
      formData.wp_name = item.name 
      formData.wp_number = item.number
    }
  })
}
const initData = () => {
  const storeTaskInfo = workStore.getTaskInfo 
  formData.wc_name =props.currentWorkcenter.name ||  storeTaskInfo.wc_name
  formData.wc_number =props.currentWorkcenter.number ||  storeTaskInfo.wc_number
  const deviceName = storeTaskInfo.company_name && storeTaskInfo.company_name.length > 0? storeTaskInfo.company_name[0].name : ''
  formData.device_name = props.currentDevice.name || deviceName 
  const deviceNumber = storeTaskInfo.company_name && storeTaskInfo.company_name.length > 0? storeTaskInfo.company_name[0].number : ''
  formData.device_number = props.currentDevice.number ||deviceNumber
  
  // 获取当前班次信息
  const shiftInfo = getShiftDateRange()
  formData.shiftName = shiftInfo.shiftName
  formData.shiftCode = shiftInfo.shiftName === '白班' ? '001' : '002'
  
  // 获取当前时间
  const now = new Date()
  const currentTime = formatDateTime(now)
  
  // 根据班次设置开始和结束时间
  if (shiftInfo.shiftName === '白班') {
    // 白班: 当天 7:30 到当前时间
    const today = formatDate(now)
    formData.startTime = `${today} 07:30`
    formData.endTime = currentTime
  } else {
    // 晚班: 昨天 19:30 到当前时间
    const yesterday = new Date(now)
    yesterday.setDate(now.getDate() - 1)
    const yesterdayStr = formatDate(yesterday)
    formData.startTime = `${yesterdayStr} 19:30`
    formData.endTime = currentTime
  }


}

// 格式化日期为 YYYY-MM-DD
const formatDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 格式化日期时间为 YYYY-MM-DD HH:mm
const formatDateTime = (date) => {
  const dateStr = formatDate(date)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${dateStr} ${hours}:${minutes}`
}

// 判断班次并返回日期范围
const getShiftDateRange = () => {
  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  
  // 判断是否是白班（7:30 - 19:30）
  const isDayShift = (currentHour > 7 || (currentHour === 7 && currentMinute >= 30)) && 
                     (currentHour < 19 || (currentHour === 19 && currentMinute < 30))
  
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

const initDevice = () => {
  // 实际API调用示例
  const wc_id = props.currentWorkcenter.id
  const data = {
    filter: JSON.stringify([{"val":[{"name":"status_id","val":"1,2,3","action":"IN"},{"name":"wc_id","val":wc_id,"action":"="}],"relation":"AND"}]),
  }
  getWorkcenterDeviceList(data).then((res) => {
    deviceList.value = res.rows
  })
  
}
const refreshAllData = () => {
  initDevice()
  initData()
  initProcessList() 
}
// 监听 workStore.getTaskInfo 的变化

watch(() => workStore.getTaskInfo, (newTaskInfo, oldTaskInfo) => {
  if (newTaskInfo && JSON.stringify(newTaskInfo) !== JSON.stringify(oldTaskInfo)) {
    refreshAllData()
  }
}, { deep: true })

watch(() => props.currentDevice, (newDevice, oldDevice) => {
  // 检查设备是否变化且有效
  if (newDevice) {
    initData()
  }
}, { deep: true })
// 添加对班次变化的监听
watch(() => formData.shiftCode, (newShiftCode) => {
// 获取当前时间
const now = new Date()
const currentTime = formatDateTime(now)

// 根据班次设置开始和结束时间
if (newShiftCode === '001') {
// 白班: 当天 7:30 到当前时间
  const today = formatDate(now)
  formData.startTime = `${today} 07:30`
  formData.endTime = currentTime
  formData.shiftCode = '001'
  } else {
  // 晚班: 昨天 19:30 到当前时间
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  const yesterdayStr = formatDate(yesterday)
  formData.startTime = `${yesterdayStr} 19:30`
  formData.endTime = currentTime
  formData.shiftCode = '002'
  }
})
onMounted(() => {
  refreshAllData()
})

// 暴露表单数据给父组件
defineExpose({
  formData
})

</script>

<style lang="scss" scoped>
// 添加展开/收起按钮样式
.expand-collapse-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 0;
  background-color: rgba(0, 21, 41, 0.95);
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background-color: rgba(30, 207, 255, 0.1);
  }
  
  .expand-text {
    color: #1ecfff;
    font-size: 13px;
    margin-right: 5px;
  }
  
  .expand-icon {
    width: 14px;
    height: 14px;
  }
}
.report-form {
  display: flex;
  flex-direction: column;
  gap: 1px;
  border: 1px solid rgba(30, 207, 255, 0.5);
  background-color: rgba(30, 207, 255, 0.1);
}

.form-row {
  display: flex;
  border-bottom: 1px solid rgba(30, 207, 255, 0.5);
  
  &:last-child {
    border-bottom: none;
  }
}

.form-item {
  padding: 10px 15px;
  display: flex;
  align-items: center;
  border-right: 1px solid rgba(30, 207, 255, 0.5);
  background-color: rgba(0, 21, 41, 0.95);
  
  &:last-child {
    border-right: none;
  }
  
  label {
    width: 100px;
    color: #b6eaff;
    font-size: 14px;
    margin-right: 10px;
    white-space: nowrap;
  }
  
  .required {
    color: #ff5555;
    margin-left: 2px;
  }
}

.input-with-search {
  display: flex;
  flex: 1;
  
  .el-input {
    flex: 1;
  }
  
  .search-btn {
    margin-left: 5px;
    padding: 0 8px;
    background-color: transparent;
    border: 1px solid #1ecfff;
    color: #1ecfff;
    
    &:hover {
      background-color: rgba(30, 207, 255, 0.1);
    }
  }
}

:deep(.el-input__wrapper),
:deep(.el-select),
:deep(.el-date-editor) {
  background-color: rgba(0, 21, 41, 0.5);
  border: none !important; // 移除边框
  box-shadow: none !important;
  
  &.is-focus {
    border: none !important; // 确保聚焦时也没有边框
  }
  
  .el-input__inner {
    color: #fff;
    border: none!important; // 移除边框
    height: 32px;
  }
}

:deep(.el-date-editor) {
  width: 100%;
}

:deep(.el-select) {
  width: 100%;
  
  .el-select__tags,
  .el-select-dropdown__item {
    color: #b6eaff;
  }
  
  .el-select-dropdown__item.hover, 
  .el-select-dropdown__item:hover {
    background-color: rgba(30, 207, 255, 0.1);
  }
  
  .el-select-dropdown__item.selected {
    color: #1ecfff;
    background-color: rgba(30, 207, 255, 0.2);
  }
  
  // 确保select内部的输入框也没有边框
  .el-input__wrapper {
    box-shadow: none !important;
    border: none !important;
  }
  
  // 修改select显示的文字颜色
  .el-input__inner {
    color: #fff !important;
  }
}

// 添加下拉菜单样式
:deep(.el-popper) {
  background-color: rgba(0, 21, 41, 0.95) !important;
  border: 1px solid rgba(30, 207, 255, 0.5) !important;
  
  .el-select-dropdown__list {
    padding: 4px 0;
  }
  
  .el-popper__arrow::before {
    background-color: rgba(0, 21, 41, 0.95) !important;
    border-color: rgba(30, 207, 255, 0.5) !important;
  }
}

:deep(.el-button) {
  border-radius: 4px;
}
</style>

<!-- 添加全局样式 -->
<style lang="scss">
/* 下拉菜单样式覆盖 */
.report-form {
  // 确保所有输入框和选择框没有边框和阴影
  .el-input__wrapper,
  .el-select .el-input__wrapper,
  .el-date-editor .el-input__wrapper {
    box-shadow: none !important;
    border: none !important;
    background-color: rgba(0, 21, 41, 0.5) !important;
  }
  
  // 处理选择框的特殊样式
  .el-select__wrapper {
    background: #00162a !important;
    border: none !important;
    box-shadow: none !important;
  }
  
  // 确保选择框中的文字为白色
  .el-select__selection {
    color: #fff !important;
  }
  
  // 添加这个样式确保下拉框中显示的文字为白色
  .el-select .el-input__inner {
    color: #fff !important;
  }
  .el-select__selected-item {
    color: #fff!important;
  }
}
</style>