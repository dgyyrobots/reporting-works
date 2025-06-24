<template>
  <Card 
    class="EquipmentHistory" 
    :title="'设备运行历史'" 
    :subtitle="dateSubtitle">
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <span>加载中...</span>
    </div>
    <div v-if="!list.length && !loading" class="no-data">
        <Icon icon="svg-icon:empty-box" />
        暂无数据
      </div>
    <div ref="chartRef" class="chart-container"></div>
  </Card>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import Card from './Card.vue'
import { Icon } from '/@/components/Icon'
import { getDeviceOutput } from '@/api/mes/wk/index.ts'

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

const chartRef = ref(null)
const list = ref([])
let chart = null
let dataRefreshTimer = null // 添加定时器变量
const loading = ref(false) // 添加加载状态

// 处理接口返回的数据，转换为图表所需格式
const processChartData = (data) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return {
      xAxisData: [],
      quantityData: [],
      speedData: []
    }
  }

  // 按createTime排序，从新到旧
  data.sort((a, b) => b.createTime - a.createTime)
  
  // 提取x轴数据（时间）
  const times = [...new Set(data.map(item => item.createTime))].sort((a, b) => b - a)
  // 修改这里，只显示时间部分（小时:分钟）
  const xAxisData = times.map(time => formatTimeOnly(time))
  
  // 提取数量和平均速度数据
  const quantityData = []
  const speedData = []
  
  times.forEach(time => {
    // 查找对应时间的数量数据
    const quantityItem = data.find(item => item.createTime === time && item.item === '数量')
    if (quantityItem && quantityItem.value) {
      // 添加错误处理，确保解析结果是有效数字
      const parsedValue = parseFloat(quantityItem.value)
      quantityData.push(isNaN(parsedValue) ? 0 : parsedValue)
    } else {
      quantityData.push(0)
    }
    
    // 查找对应时间的平均速度数据
    const speedItem = data.find(item => item.createTime === time && item.item === '平均速度')
    if (speedItem && speedItem.value) {
      // 添加错误处理，确保解析结果是有效数字
      const parsedValue = parseFloat(speedItem.value)
      speedData.push(isNaN(parsedValue) ? 0 : parsedValue)
    } else {
      speedData.push(0)
    }
  })
  
  return {
    xAxisData,
    quantityData,
    speedData
  }
}

const initChart = (chartData) => {
  if (chartRef.value) {
    if (!chart) {
      chart = echarts.init(chartRef.value)
    }
    
    // 计算数量的最大值，用于设置y轴范围和背景条
    const maxQuantity = Math.max(...chartData.quantityData, 1) // 至少为1，避免为0
    const yMaxQuantity = Math.ceil(maxQuantity / 1000) * 1000 // 向上取整到最近的1000
    
    // 计算速度的最大值，用于设置右侧y轴范围
    const maxSpeed = Math.max(...chartData.speedData, 1) // 至少为1，避免为0
    const yMaxSpeed = Math.ceil(maxSpeed / 1000) * 1000 // 向上取整到最近的1000
    
    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        top: '15%',
        left: '5%',
        right: '5%',
        bottom: '5%', // 增加底部空间以容纳旋转的时间标签
        containLabel: true,
      },
      legend: {
        show:false,
        data: ['数量', '平均速度'],
        textStyle: {
          color: '#fff'
        },
        right: '5%',
        top: '2%'
      },
      xAxis: {
        type: 'category',
        data: chartData.xAxisData,
        axisLine: {
          lineStyle: {
            color: '#0B3E5E',
          },
        },
        axisLabel: {
          color: '#fff',
          fontSize: 12,
          rotate: 45,  // 旋转角度
          margin: 14,  // 增加标签与轴线的距离
          interval: 0  // 强制显示所有标签
        },
      },
      series: [
        {
          name: '数量',
          type: 'bar',
          stack: 'total',
          label: {
            show: true,
            color: '#fff',
            position: 'top',
            distance: 10,
            fontSize: 12,
            formatter: '{c}',
          },
          data: chartData.quantityData,
          itemStyle: {
            borderRadius: 5,
            color: '#00D8FF',
          },
          barWidth: '20%',
        },
        {
          name: '背景',
          type: 'bar',
          barGap: '-100%',
          barWidth: '20%',
          itemStyle: {
            borderRadius: 5,
            color: 'rgba(230, 247, 255, 0.3)',
          },
          z: -12,
          data: Array(chartData.xAxisData.length).fill(yMaxQuantity),
          silent: true,
          tooltip: {
            show: false
          }
        },
        {
          name: '平均速度',
          type: 'line',
          smooth: true,
          showAllSymbol: true,
          symbol: 'emptyCircle',
          symbolSize: 8,
          yAxisIndex: 1,
          itemStyle: {
            color: '#1890FF',
          },
          data: chartData.speedData,
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '数量',
          min: 0,
          max: yMaxQuantity,
          interval: yMaxQuantity / 4,
          axisLine: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(11, 62, 94, 0.3)',
              type: 'dashed',
            },
          },
          axisLabel: {
            color: '#fff',
            fontSize: 12,
          },
        },
        {
          type: 'value',
          name: '平均速度',
          nameLocation: 'end',
          nameGap: 15,
          nameTextStyle: {
            color: '#fff',
            fontSize: 12,
            padding: [0, 0, 0, 0],
          },
          min: 0,
          max: yMaxSpeed,
          interval: yMaxSpeed / 5,
          axisLine: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            color: '#fff',
            fontSize: 12,
          },
        },
      ],
    }
    chart.setOption(option)
  }
}

const handleResize = () => {
  chart?.resize()
}

// 添加一个新函数，只格式化时间部分
const formatTimeOnly = (timestamp) => {
  if (!timestamp) return '--'

  try {
    const date = new Date(timestamp * 1000)
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${hours}:${minutes}`
  } catch (e) {
    return '--'
  }
}

// 保留原有的完整日期时间格式化函数
const formatDateTime = (timestamp) => {
  if (!timestamp) return '--'

  try {
    const date = new Date(timestamp * 1000)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${year}-${month}-${day} ${hours}:${minutes}`
  } catch (e) {
    return '--'
  }
}



// 添加一个响应式变量用于存储日期副标题
const dateSubtitle = ref('')

// 修改initData函数，提取日期信息并更新副标题
const initData = () => {
  // 显示加载状态
  loading.value = true
  dateSubtitle.value = '' // 重置副标题
  
  // 检查 currentDevice 是否有效
  if (!props.currentDevice || !props.currentDevice.number) {
    console.warn('当前设备信息不完整，无法获取设备运行历史')
    loading.value = false
    return
  }
  
  const params = {
    deviceNumber: props.currentDevice.number,
  }
  
  getDeviceOutput(params).then((res) => {
    if (res && Array.isArray(res) && res.length > 0) {
      // 从数据中提取日期信息
      const firstItem = res[0]
      if (firstItem && firstItem.createTime) {
        // 提取日期部分
        const date = new Date(firstItem.createTime * 1000)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const dateStr = `${year}-${month}-${day}`
        
        // 更新副标题
        dateSubtitle.value = `(${dateStr})`
      }

      // 这里的处理可能有问题，不应该直接修改原始时间戳
      res.forEach(item => {
        if (item.createTime) {
          // 不要在这里格式化时间，保留原始时间戳用于排序
          // item.createTime = formatDateTime(item.createTime)
        }
      })

      console.log(res,'rrrrrrrrrr')
      
      list.value = res
      
      // 处理数据并更新图表
      const chartData = processChartData(res)
      initChart(chartData)
    } else {
      // 没有数据时显示空图表
      list.value = []
      initChart({
        xAxisData: [],
        quantityData: [],
        speedData: []
      })
    }
    loading.value = false
  }).catch(error => {
    console.error('获取设备输出数据失败:', error)
    // 错误时显示空图表
    list.value = []
    initChart({
      xAxisData: [],
      quantityData: [],
      speedData: []
    })
    loading.value = false
  })
}

// 设置定时刷新数据
const setupDataRefreshTimer = () => {
  // 清除可能存在的旧定时器
  if (dataRefreshTimer) {
    clearInterval(dataRefreshTimer)
  }
  
  // 设置新的定时器，每30分钟执行一次
  dataRefreshTimer = setInterval(() => {
    if (props.currentDevice && props.currentDevice.number) {
      initData()
    }
  }, 30 * 60 * 1000) // 30分钟 = 30 * 60 * 1000毫秒
}

// 监听设备变化，当设备信息有效时再请求数据
watch(() => props.currentDevice, (newDevice) => {
  if (newDevice && newDevice.number) {
    initData()
    // 设备变化时重新设置定时器
    setupDataRefreshTimer()
  }
}, { deep: true, immediate: true })

onMounted(() => {
  // 初始化空图表
  initChart({
    xAxisData: [],
    quantityData: [],
    speedData: []
  })
  
  window.addEventListener('resize', handleResize)
  
  // 如果设备信息已经有效，则请求数据
  if (props.currentDevice && props.currentDevice.number) {
    setTimeout(() => {
      initData()
      // 初始化定时器
      setupDataRefreshTimer()
    }, 200)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chart?.dispose()
  
  // 组件卸载时清除定时器
  if (dataRefreshTimer) {
    clearInterval(dataRefreshTimer)
    dataRefreshTimer = null
  }
})
</script>

<style lang="scss" scoped>
.EquipmentHistory {
  width: 100%;
  height: 100%;
  /* background: rgba(10, 30, 60, 0.85); */
  box-sizing: border-box;
  color: #fff;
  display: flex;
  flex-direction: column;
  position: relative;
  .no-data {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: #999;
    gap: 10px;
  }
  .chart-container {
    width: 100%;
    height: 100%;
    position: relative;
  }
  
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: calc(100% + 40px);
    background:#091326;
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
    to {
      transform: rotate(360deg);
    }
  }
}

</style>
