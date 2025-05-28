<template>
  <Card class="task-info-box" title="任务单信息">
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <span>加载中...</span>
    </div>
    <div v-else class="info-list">
      <div class="row">
        <span class="label">生产工单：</span>
        <span class="value">{{ taskInfo.rc_no || '--' }}
          <span class="highlight">[{{ taskInfo.ud_102869_gdlx || '' }}]</span>
        </span>
        <!-- <span  class="normal">[{{ taskInfo.billNo || '--' }}]</span> -->

      </div>
      <div class="row">
        <span class="label">工&nbsp;&nbsp;&nbsp;&nbsp;序：</span>
        <span class="value">{{ taskInfo.wpName || '--' }} / {{ taskInfo.prodesc ||'--' }}</span>
        
      </div>
      <div class="row">
        <span class="label">产&nbsp;&nbsp;&nbsp;&nbsp;品：</span>
        <span class="value">{{ taskInfo.skuName || '--' }} 
          <span style="color:#ffe600">[{{ taskInfo.skuNo || '--' }}] </span>
        </span>
      </div>
      <div class="row">
        <span class="label">计划时间：</span>
        <span class="value">{{ taskInfo.plan_start_time || '--' }} —— {{ taskInfo.plan_end_time || '--' }}</span>
      </div>
      <div class="row">
        <span class="label">实际开始：</span>
        <span class="value">{{ taskInfo.act_start_time || '--' }} —— {{ taskInfo.act_end_time }}
            <span style="color:#ffe600;margin-left: 12px;">  [计划数量：{{ taskInfo.uqty || '0' }}{{ taskInfo.unit  }}]</span>
        </span>
      </div>
      <div class="row">
        <span class="label">超&nbsp;&nbsp;&nbsp;&nbsp;时：</span>
        <span class="value">{{ taskInfo.overTime || '0.00' }} (小时)</span>
      </div>
    </div>
    <div class="progress-row">
      <div class="progress-bar-bg">
        <div class="progress-bar" :style="{ width: `${progressPercent}%` }"></div>
      </div>
      <span class="progress-percent">{{ progressPercent }}%</span>
    </div>
    <div class="footer">
      <span class="done">
        已完成：
        <span class="done-num">{{ taskInfo.exe_uqty  }}</span>
        {{ taskInfo.unit || '-' }}
      </span>
      <span class="remain">
        未完成：
        <span class="remain-num">{{ taskInfo.remainQty || '0' }}</span>
        {{ taskInfo.unit || '-' }}
      </span>
    </div>
  </Card>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { getJobBillContent,getJobBillTimeAndNumber ,getJobBillTypeAndStartTime} from '@/api/mes/wk/index.ts'
import Card from './Card.vue'


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

// 响应式数据
const loading = ref(true)
const taskInfo = reactive({
  rc_no: '',
  rc_id:'',
  wc_id: '',
  order_no: '',
  billNo: '',
  wpName: '',
  skuName: '',
  skuNo: '',
  plan_start_time: '',
  plan_end_time: '',
  act_start_time:'',
  act_end_time:'',
  uqty: 0,
  exe_uqty:0,
  unit: '',
  overTime: '',
  remainQty: 0,
  ud_102869_gdlx:"",
  prodesc:''
})

// 计算完成百分比
const progressPercent = computed(() => {
  if (!taskInfo.uqty || taskInfo.uqty <= 0) return 0
  const percent = (taskInfo.exe_uqty / taskInfo.uqty) * 100
  return percent.toFixed(2)
})

// 获取任务单信息
const fetchTaskInfo = async () => {

  
  loading.value = true
  try {
    const activeJob = props.currentDevice.jobbill_no
    const wc_id = props.currentWorkcenter.id
    if (!activeJob) return
    const params= {
      filter: [{"val":[{"name":"wc_id","val":wc_id,"action":"="},{"name":"bill_no","val":activeJob,"action":"="}],"relation":"AND"}]
    }
    const res = await getJobBillContent(params)
    
    if (res && res.rows) {
      const data = res.rows[0]
      // 更新任务信息
      Object.assign(taskInfo, {
        rc_no: data.rc_no,
        rc_id: data.rc_id,
        wc_id: data.wc_id,
        order_no: data.order_no,
        wpName: data.wp_name || '',
        skuName: data.sku_name || '',
        skuNo: data.sku_no || '',
        uqty: data.plan_qty || 0,
        unit: data.unit,
        prodesc:data.prodesc,
        overTime: data.over_time || '0.00',
      })
    }
  } catch (error) {
    console.error('获取任务单信息失败:', error)
    loading.value = false
  } finally {
    loading.value = false
  }
}

const fetchTimeAndNumber = async () => {
  loading.value = true
  try {
    const rc_id = taskInfo.rc_id
    const params = {
      filter: [{"val":[{"name":"parentid","val":rc_id,"action":"="}],"relation":"OR"}],
      filter_detail:{},
      keyword_is_detail:0,
      show_total:1,
      page:1,
      rows:50
    }
    getJobBillTimeAndNumber(params).then(res => {
      let arr=[]
      res.rows.forEach(item => {
        if(item.wc_id == taskInfo.wc_id && item.order_no === taskInfo.order_no){
          arr.push(item)
        }
      });
      if(arr.length>0){
        taskInfo.act_start_time =formatDateTime (arr[0].act_start_time)
        taskInfo.act_end_time= formatDateTime (arr[0].act_end_time)
        taskInfo.uqty = toInteger (arr[0].uqty)
        taskInfo.exe_uqty = toInteger (arr[0].exe_uqty) 
        taskInfo. remainQty = (arr[0].uqty || 0) - (arr[0].exe_uqty || 0)
      }

      loading.value = false
    })
  } catch (error) {
    loading.value = false
    console.error('获取任务单信息失败:', error)
  }
}

// 格式化日期时间
const formatDateTime = (timestamp) => {
  if (!timestamp) return '--'
  
  try {
    const date = new Date(timestamp * 1000)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    
    return `${year}-${month}-${day} ${hours}:${minutes}`
  } catch (e) {
    return '--'
  }
}
// 将字符串或数字转换为整数
const toInteger = (value) => {
  if (value === null || value === undefined) return 0
  
  // 如果是字符串，先尝试转换为数字
  if (typeof value === 'string') {
    // 移除非数字字符（保留负号）
    const numStr = value.replace(/[^\d.-]/g, '')
    value = parseFloat(numStr)
  }
  
  // 如果转换后不是有效数字，返回0
  if (isNaN(value)) return 0
  
  // 返回整数部分
  return Math.floor(value)
}

const  fetchTypeAndStartTime = async () => {
  loading.value = true
  const activeJob = props.currentDevice.jobbill_no
  const params ={
      filter:[{"val":[{"name":"bill_no","val":activeJob ,"action":"LIKE"}],"relation":"OR"}],
      filter_detail:{},
      keyword_is_detail:0,
      sum_col:["uqty","exec_uqty"],
      show_total:1,
      page:1,
      rows:50
    }
    getJobBillTypeAndStartTime(params).then(res => {
      if (res && res.rows) {
      const data = res.rows[0]
      // data =  {
      //       "operator_name": "ERP",
      //       "operate_date": "1748143849",
      //       "all_pic_url": null,
      //       "bill_date": "1748102400",
      //       "bill_no": "ZYCS08-202505033",
      //       "sku_no": "101A0190201X0001",
      //       "sku_name": "玉溪（软阿诗玛）小盒（GD HT5.1版）",
      //       "plan_start_time": "1748102400",
      //       "plan_end_time": "1748102400",
      //       "json_values": "{\"ud_102869_source_bill_no\":\"CS2505009\",\"ud_102869_gdlx\":\"研发工单\",\"ud_102869_jhsl\":1200,\"ud_102869_xsddbhxc\":\"1\"}",
      //   }
      // 安全地解析JSON
     try {
        if (data.json_values) {
          const jsonValue = data.json_values
          const jsonObject = JSON.parse(jsonValue)
          if (jsonObject && jsonObject.ud_102869_gdlx) {
            taskInfo.ud_102869_gdlx = jsonObject.ud_102869_gdlx
          }
        }
        
        // 这些操作不依赖于JSON解析，可以单独执行
        if (data.plan_start_time) {
          taskInfo.plan_start_time = formatDateTime(data.plan_start_time)
        }
        if (data.plan_end_time) {
          taskInfo.plan_end_time = formatDateTime(data.plan_end_time)
        }
        
        // 计算超时时间
        taskInfo.overTime = calculateOvertime(
          taskInfo.plan_start_time, 
          taskInfo.plan_end_time, 
          taskInfo.act_start_time, 
          taskInfo.act_end_time
        )
      } catch (error) {
        console.error('解析JSON数据出错:', error)
      }
    }
  
      loading.value = false
    })




/**
 * 计算超时时间（实际时间 - 计划时间）
 * @param {string} planStartTime 计划开始时间
 * @param {string} planEndTime 计划结束时间
 * @param {string} actualStartTime 实际开始时间
 * @param {string} actualEndTime 实际结束时间
 * @returns {string} 超时时间（小时），保留2位小数
 */
const calculateOvertime = (planStartTime, planEndTime, actualStartTime, actualEndTime) => {
  // 如果任何一个参数为空，返回0
  if (!planStartTime || !planEndTime || !actualStartTime || !actualEndTime) {
    return '0.00'
  }
  
  try {
    // 将时间字符串转换为Date对象
    const parseDatetime = (dateTimeStr) => {
      const [datePart, timePart] = dateTimeStr.split(' ')
      const [year, month, day] = datePart.split('-').map(Number)
      const [hour, minute] = timePart.split(':').map(Number)
      return new Date(year, month - 1, day, hour, minute)
    }
    
    const planStart = parseDatetime(planStartTime)
    const planEnd = parseDatetime(planEndTime)
    const actualStart = parseDatetime(actualStartTime)
    const actualEnd = parseDatetime(actualEndTime)
    
    // 计算计划时间段和实际时间段的持续时间（毫秒）
    const planDuration = planEnd - planStart
    const actualDuration = actualEnd - actualStart
    
    // 计算超时时间（小时）
    const overtimeMs = actualDuration - planDuration
    const overtimeHours = overtimeMs / (1000 * 60 * 60)
    
    // 如果超时为负数，表示提前完成，返回0
    if (overtimeHours <= 0) {
      return '0.00'
    }
    
    // 返回超时时间，保留2位小数
    return overtimeHours.toFixed(2)
  } catch (e) {
    console.error('计算超时时间出错:', e)
    return '0.00'
  }
}

}
// 组件挂载时获取数据
onMounted( () => {
 nextTick( async() => {
  await fetchTaskInfo()
  await fetchTimeAndNumber() 
  fetchTypeAndStartTime()
 })
})

// 暴露刷新方法给父组件
defineExpose({
  refresh: fetchTaskInfo
})
</script>

<style scoped>
.task-info-box {
  width: 100%;
  height: 100%;
  /* background: rgba(10, 30, 60, 0.85); */
  box-sizing: border-box;
  color: #fff;
  display: flex;
  flex-direction: column;
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
  to { transform: rotate(360deg); }
}

/* 其余样式保持不变 */
.info-list {
  flex: 1;
  font-size: 14px;
}
.row {
  margin-bottom: 8px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;  /* 改为顶部对齐，更适合多行内容 */
}
.label {
  color: #b6eaff;
  min-width: 80px;
  display: inline-block;
}
.value {
  color: #fff;
  margin-right: 6px;
  word-break: break-word;  /* 允许在任意字符间换行 */
  white-space: normal;     /* 允许正常换行 */
  flex: 1;                 /* 让value占据剩余空间 */
  min-width: 0;            /* 防止flex项目溢出 */
}
.highlight {
  color: #ffe600;
  margin: 0 4px;
  word-break: break-word;  /* 允许在任意字符间换行 */
}
.normal {
  color: #b6eaff;
  margin-left: 4px;
  word-break: break-word;  /* 允许在任意字符间换行 */
}
.progress-row {
  display: flex;
  align-items: center;
  margin: 6px 0 2px 0;
}
.progress-bar-bg {
  flex: 1;
  height: 6px;
  background: #1ecfff33;
  margin-right: 8px;
  overflow: hidden;
}
.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #1ecfff 0%, #00eaff 100%);
}
.progress-percent {
  color: #1ecfff;
  font-size: 13px;
  min-width: 48px;
  text-align: right;
}
.footer {
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  margin-top: auto;
  padding-top: 8px;
}
.done {
  color: #1ecfff;
}
.done-num {
  color: #3fd0ff;
  font-weight: bold;
  font-size: 18px;
}
.remain {
  color: #ffe600;
}
.remain-num {
  color: #ffe600;
  font-weight: bold;
  font-size: 18px;
}
</style>
