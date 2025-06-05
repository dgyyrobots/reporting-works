<template>
  <div class="dashboard-gauge">
    <div ref="gaugeRef" class="gauge-echart"></div>
    <!-- 文本和按钮叠加层 -->
    <div class="gauge-overlay">
      <div class="detail-text">{{currentDevice.name}} {{ currentDevice.number }}</div>
      <!-- <div class="detail-button">当前产量清零</div> -->
      <div class="target-text">
        <el-icon class="no-inherit" color="#ff5555">
          <Bell />
        </el-icon>
        <span>预警数量： 3000</span>
      </div>
    </div>
    <!-- 左上 -->
    <div class="gauge-label gauge-label-topleft">
      <div class="gauge-value yellow">{{ noOkQty }}</div>
      <div class="gauge-desc">不合格品数量</div>
      <svg class="gauge-fold-line" height="24" width="80">
        <polyline points="0,6 40,6 70,22" style="fill: none; stroke: #1ecfff; stroke-width: 2" />
      </svg>
    </div>
    <!-- 左下 -->
    <div class="gauge-label gauge-label-bottomleft">
      <div class="gauge-value yellow">{{ currentSpeed }}</div>
      <div class="gauge-desc">当前速度</div>
      <svg class="gauge-fold-line" height="24" width="80">
        <polyline points="0,18 40,18 70,2" style="fill: none; stroke: #1ecfff; stroke-width: 2" />
      </svg>
    </div>
    <!-- 右上 -->
    <div class="gauge-label gauge-label-topright">
      <div class="gauge-value yellow">0</div>
      <div class="gauge-desc">测试纸产量</div>
      <svg class="gauge-fold-line" height="24" width="80">
        <polyline points="80,6 40,6 10,22" style="fill: none; stroke: #1ecfff; stroke-width: 2" />
      </svg>
    </div>
    <!-- 右下 -->
    <div class="gauge-label gauge-label-bottomright">
      <div class="gauge-value yellow">{{ passUqty }}</div>
      <div class="gauge-desc">过版数量</div>
      <svg class="gauge-fold-line" height="24" width="80">
        <polyline points="80,18 40,18 10,2" style="fill: none; stroke: #1ecfff; stroke-width: 2" />
      </svg>
    </div>
    <!-- 顶部左侧：顺产换板 + el-switch -->
    <div class="top-abs top-left">
      <span class="switch-label">顺序换板：</span>
      <el-switch
        v-model="switchValue"
        active-color="#22e222"
        inactive-color="#444"
        size="small"
        style="--el-switch-on-color: #22e222; --el-switch-off-color: #444"
      />
    </div>
    <!-- 顶部右侧：黄色圆点 + 空转 -->
    <div class="top-abs top-right">
      <span class="dot"></span>
      <span class="dot-label">空转</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import { ElSwitch } from 'element-plus'
import { Bell } from '@element-plus/icons-vue'
import { getCollectionQty } from '@/api/mes/wk/index.ts'
import { getJobBillContent,getDeviceRunSpeedData} from '@/api/mes/wk/index.ts'
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

const gaugeRef = ref(null)
const jobbill_id = ref('')
let chart = null
const switchValue = ref(true)
// 添加当版产量的响应式数据
const collectionQty = ref(0)
// 不合格品数量
const noOkQty = ref(0)
// 当前速度
const currentSpeed = ref(0)
// 过版数量
const passUqty = ref(0)

const initChart = () => {
  // 即使没有数据也显示仪表盘，使用默认值0
  const displayValue = collectionQty.value || 0
  console.log(displayValue, 'displayValue')
  
  const newData = {
    value: displayValue, // 使用响应式数据，如果为空则显示0
    name: '当版产量',
    max: 100,
  }
  
  // 如果chart已经存在，先销毁
  if (chart) {
    chart.dispose()
  }
  
  chart = echarts.init(gaugeRef.value)
  const option = {
    title: [
      {
        text: newData.name,
        x: '50%',
        y: '32%',
        textAlign: 'center',
        textStyle: {
          fontWeight: 'normal',
          fontSize: '16',
          fontFamily: 'SourceHanSansCN-Medium',
          color: '#ffff99',
        },
      },
      {
        text: newData.value.toString(),
        x: '50%',
        y: '42%',
        textAlign: 'center',
        textStyle: {
          fontWeight: 'normal',
          fontSize: '40',
          fontFamily: 'Digital-7',
          color: '#ffffff',
        },
      },
    ],
    angleAxis: {
      show: false,
      max: (newData.max * 360) / 270,
      type: 'value',
      startAngle: 225,
      splitLine: {
        show: false,
      },
    },
    barMaxWidth: 18,
    radiusAxis: {
      show: false,
      type: 'category',
    },
    polar: {
      center: ['50%', '50%'],
      radius: '120%',
    },
    series: [
      // 最外层圆环形
      {
        type: 'gauge',
        radius: '84%',
        center: ['50%', '50%'],
        splitNumber: 10,
        max: 100,
        startAngle: 225,
        endAngle: -45,
        z: 99,
        axisLine: {
          lineStyle: {
            width: 1,
            color: [[1, 'rgba(255,255,255,0)']],
          },
          detail: {
            formatter: '{value}',
          },
          data: [
            {
              value: 50,
              name: 'SCORE',
            },
          ],
        },
        axisTick: {
          show: true,
          splitNumber: 5,
          lineStyle: {
            color: 'rgba(203, 126, 210, 1)',
            width: 1,
          },
          length: 20,
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        pointer: {
          show: false,
        },
        title: {
          show: false,
        },
      },
      {
        type: 'bar',
        data: [
          {
            value: 85, // 展示85%的进度
          },
        ],
        itemStyle: {
          borderRadius: '90%',
          opacity: 1,
          color: {
            type: 'linear',
            x: 1,
            y: 0,
            x2: 0,
            y2: 0,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(211, 210, 253, 0.2)',
              },
              {
                offset: 1,
                color: 'rgba(248, 190, 249, 1)',
              },
            ],
            global: false,
          },
        },
        barGap: '-100%',
        coordinateSystem: 'polar',
        roundCap: true,
        z: 3,
      },
      {
        type: 'bar',
        data: [
          {
            value: newData.max,
            itemStyle: {
              color: 'rgba(223, 210, 252, 1)',
              opacity: 0.2,
              borderWidth: 0,
            },
          },
        ],
        barGap: '-100%',
        coordinateSystem: 'polar',
        roundCap: true,
        z: 6,
      },
      {
        name: '数量',
        type: 'pie',
        animation: false,
        hoverAnimation: false,
        clockwise: false,
        radius: '50%',
        center: ['50%', '50%'],
        data: [10],
        itemStyle: {
          normal: {
            color: 'rgba(101, 106, 197, 0.5)',
          },
        },
        label: {
          normal: {
            show: false,
          },
          emphasis: {
            show: false,
            textStyle: {
              fontSize: '14',
            },
          },
        },
        labelLine: {
          normal: {
            show: false,
          },
        },
      },
      {
        name: '数量',
        type: 'pie',
        z: -1,
        animation: false,
        hoverAnimation: false,
        clockwise: false,
        radius: '90%',
        center: ['50%', '50%'],
        data: [10],
        itemStyle: {
          normal: {
            color: 'rgba(101, 106, 197, 0.3)',
          },
        },
        label: {
          normal: {
            show: false,
          },
          emphasis: {
            show: false,
            textStyle: {
              fontSize: '14',
            },
          },
        },
        labelLine: {
          normal: {
            show: false,
          },
        },
      },
      {
        name: '数量',
        type: 'pie',
        z: -1,
        animation: false,
        hoverAnimation: false,
        clockwise: false,
        radius: '100%',
        center: ['50%', '50%'],
        data: [10],
        itemStyle: {
          normal: {
            color: 'rgba(101, 106, 197, 0.2)',
          },
        },
        label: {
          normal: {
            show: false,
          },
          emphasis: {
            show: false,
            textStyle: {
              fontSize: '14',
            },
          },
        },
        labelLine: {
          normal: {
            show: false,
          },
        },
      },
    ],
  }

  chart.setOption(option)
}

const get_jobbill_id = async () => {
  try {
    const activeJob = props.currentDevice.jobbill_no
    const wc_id = props.currentWorkcenter.id
    
    if (!activeJob || !wc_id) {
      console.warn('缺少必要参数，无法获取jobbill_id')
      jobbill_id.value = ''
      return false
    }
    
    const params = {
      filter: [{"val":[{"name":"wc_id","val":wc_id,"action":"="},{"name":"bill_no","val":activeJob,"action":"="}],"relation":"AND"}]
    }
    
    const res = await getJobBillContent(params)
    
    if (res && res.rows && res.rows.length > 0 && res.rows[0].id) {
      jobbill_id.value = res.rows[0].id
      return true
    } else {
      console.warn('未找到匹配的jobbill_id')
      jobbill_id.value = ''
      return false
    }
  } catch (error) {
    console.error('获取jobbill_id失败:', error)
    jobbill_id.value = ''
    return false
  }
}
const initCollectionQty = async () => {
  try {
    // 如果没有jobbill_id，使用默认值
    if (!jobbill_id.value) {
      console.warn('没有获取到jobbill_id，使用默认值')
      collectionQty.value = 0
      noOkQty.value = 0
      passUqty.value = 0
      // 即使没有数据也初始化图表
      initChart()
      return
    }
    
    const res = await getCollectionQty({
      jobbill_id: jobbill_id.value,
      device_id: props.currentDevice.id,
    })
    
    // 从接口获取当版产量数据并赋值
    if (res && res.data && res.data[0]) {
      // 获取当版产量
      if (res.data[0].collection_qty) {
        collectionQty.value = toInteger(res.data[0].collection_qty) || 0
      } else {
        collectionQty.value = 0
      }
      
      // 获取不合格品数量
      if (res.data[0].no_okqty !== undefined) {
        noOkQty.value = toInteger(res.data[0].no_okqty) || 0
      } else {
        noOkQty.value = 0
      }
      
      // 过版数量
      if (res.data[0].pass_uqty !== undefined) {
        passUqty.value = toInteger(res.data[0].pass_uqty) || 0
      } else {
        passUqty.value = 0
      }
    } else {
      // 如果没有数据，设置默认值
      collectionQty.value = 0
      noOkQty.value = 0
      passUqty.value = 0
    }
    
    // 无论是否有数据，都初始化图表
    initChart()
  } catch (error) {
    console.error('获取当版产量数据失败:', error)
    // 发生错误时，设置默认值并初始化图表
    collectionQty.value = 0
    noOkQty.value = 0
    passUqty.value = 0
    initChart()
  }
}

// 将字符串或数字转换为整数
const toInteger = (value) => {
  if (value === null || value === undefined) return ''
  
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
// 获取设备运行速度
const getDeviceSpeed = async () => {

  const loginInfo= JSON.parse(localStorage.getItem('loginInfo'))

  try {
    if (!props.currentDevice.id) {
      console.warn('缺少设备ID，无法获取设备速度')
      return
    }
    
    const params = {
      sel_device_no:props.currentDevice.number,
      sel_device_item:'速度',
      working_date_day: getCurrentDate(),
      sel_device_time:0,
      sel_device_time_text:'1M',
      my_company_id:loginInfo.stored_company,
      page:1,
      rows:100,
    }
    
    const res = await getDeviceRunSpeedData(params)
    
    if (res && res.rows && Array.isArray(res.rows) && res.rows.length > 0) {
      // 获取列表第一行的速度数据
      const speedData = res.rows[0]
      currentSpeed.value = toInteger(speedData.speed) || 0
    } else {
      // 如果列表为空，速度为0
      currentSpeed.value = 0
    }
  } catch (error) {
    console.error('获取设备速度数据失败:', error)
    currentSpeed.value = 0
  }
}
// 获取当前日期的函数，格式为 YYYY-MM-DD
const getCurrentDate = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

onMounted( () => {

  nextTick( async() => {
    await  get_jobbill_id()
    initCollectionQty()
    getDeviceSpeed()
  })
})

onBeforeUnmount(() => {
  if (chart) {
    chart.dispose()
  }
})
</script>

<style scoped>
.dashboard-gauge {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.gauge-echart {
  width: 600px;
  height: 460px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}
.gauge-overlay {
  position: absolute;
  width: 300px;
  height: 200px;
  left: 50%;
  top: 60%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  z-index: 4;
  pointer-events: none;
}
.detail-text {
  color: #bbbbff;
  font-size: 14px;
  background-color: rgba(30, 144, 255, 0.1);
  padding: 5px 10px;
  border-radius: 2px;
  border: 1px solid #3a7afe;
  margin-top: 75px;
}
.detail-button {
  color: #ffffff;
  font-size: 14px;
  background-color: #6583fd;
  padding: 6px 15px;
  border-radius: 3px;
  cursor: pointer;
  pointer-events: auto;
  margin-top: 5px;
}
.target-text {
  color: #ff5555;
  font-size: 14px;
  background-color: #4a4d90;
  padding: 5px 10px;
  border-radius: 2px;
  border: 1px solid #9eadfb;
  margin-top: 5px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.gauge-label {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 3;
}
.gauge-label .gauge-value {
  color: #ffe600;
  font-size: 32px;
  font-weight: bold;
  text-shadow: 0 0 8px #ffe60088;
}
.gauge-label .gauge-desc {
  color: #1ecfff;
  font-size: 16px;
  margin-bottom: 2px;
}
.gauge-label .gauge-line {
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, #1ecfff 60%, #1ecfff00 100%);
  margin-top: 2px;
}
.gauge-label .gauge-line.right {
  background: linear-gradient(270deg, #1ecfff 60%, #1ecfff00 100%);
}
.gauge-label-topleft {
  left: 68px;
  top: 60px;
  align-items: flex-start;
}
.gauge-label-bottomleft {
  left: 68px;
  bottom: 60px;
  align-items: flex-start;
}
.gauge-label-topright {
  right: 68px;
  top: 60px;
  align-items: flex-end;
}
.gauge-label-bottomright {
  right: 68px;
  bottom: 60px;
  align-items: flex-end;
}
.top-abs {
  position: absolute;
  top: 10px;
  z-index: 10;
  display: flex;
  align-items: center;
}
.top-left {
  left: 18px;
}
.top-right {
  right: 32px;
}
.switch-label {
  color: #fff;
  font-size: 15px;
  margin-right: 6px;
  letter-spacing: 1px;
  text-shadow: 0 0 4px #000;
}
.dot {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #ffe600;

  box-shadow: 0 0 8px #ffe60088;
}
.dot-label {
  color: #ffe600;
  font-size: 16px;
  font-weight: 600;
  margin-left: 16px;
  letter-spacing: 1px;
  text-shadow: 0 0 4px #000;
}
</style>
