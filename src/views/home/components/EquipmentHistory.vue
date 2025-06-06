<template>
  <Card class="EquipmentHistory" title="设备运行历史">
    <div v-if="list.length>0" ref="chartRef" class="chart-container"></div>
     <div v-else class="no-data">
        <Icon icon="svg-icon:empty-box" />
        暂无数据
      </div>
  </Card>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import Card from './Card.vue'
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

// 处理接口返回的数据，转换为图表所需格式
const processChartData = (data) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return {
      xAxisData: [],
      quantityData: [],
      speedData: []
    }
  }

  // 按start排序
  data.sort((a, b) => a.start - b.start)
  
  // 提取x轴数据（小时）
  const hours = [...new Set(data.map(item => item.start))].sort((a, b) => a - b)
  const xAxisData = hours.map(hour => `第${hour}小时`)
  
  // 提取数量和平均速度数据
  const quantityData = []
  const speedData = []
  
  hours.forEach(hour => {
    // 查找对应小时的数量数据
    const quantityItem = data.find(item => item.start === hour && item.item === '数量')
    if (quantityItem) {
      quantityData.push(parseFloat(quantityItem.value))
    } else {
      quantityData.push(0)
    }
    
    // 查找对应小时的平均速度数据
    const speedItem = data.find(item => item.start === hour && item.item === '平均速度')
    if (speedItem) {
      speedData.push(parseFloat(speedItem.value))
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
        bottom: '5%',
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
          rotate: 45,  // 添加旋转角度
          margin: 10   // 增加标签与轴线
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

const initData = () => {
  // 检查 currentDevice 是否有效
  if (!props.currentDevice || !props.currentDevice.number) {
    console.warn('当前设备信息不完整，无法获取设备运行历史')
    return
  }
  
  const params = {
    deviceNumber: props.currentDevice.number,
  }
  
  getDeviceOutput(params).then((res) => {
    if (res && Array.isArray(res) && res.length > 0) {
      // 处理时间格式
      res.forEach(item => {
        if (item.createTime) {
          item.createTime = formatDateTime(item.createTime)
        }
      })
      
      list.value = res
      
      // 处理数据并更新图表
      const chartData = processChartData(res)
      initChart(chartData)
    } else {
      // 没有数据时显示空图表
      initChart({
        xAxisData: [],
        quantityData: [],
        speedData: []
      })
    }
  }).catch(error => {
    console.error('获取设备输出数据失败:', error)
    // 错误时显示空图表
    initChart({
      xAxisData: [],
      quantityData: [],
      speedData: []
    })
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
    console.log('定时刷新设备运行历史数据')
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
  .chart-container {
    width: 100%;
    height: 100%;
    position: relative;
  }
  .no-data {
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
}

</style>
