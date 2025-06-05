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
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import Card from './Card.vue'
import { getDeviceOutput } from '@/api/mes/wk/index.ts'
// 这里可以接收props或后续做数据对接

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
const  list = ref([])
let chart = null


const initChart = () => {
  if (chartRef.value) {
    chart = echarts.init(chartRef.value)
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
      xAxis: {
        type: 'category',
        data: ['设备1', '设备2', '设备3', '设备4', '设备5'],
        axisLine: {
          lineStyle: {
            color: '#0B3E5E',
          },
        },
        axisLabel: {
          color: '#fff',
          fontSize: 12,
        },
      },
      series: [
        {
          name: '运行时间',
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
          data: [390, 134, 201, 102, 220],
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
          data: [400, 400, 400, 400, 400],
        },
        {
          name: '运行效率',
          type: 'line',
          smooth: true,
          showAllSymbol: true,
          symbol: 'emptyCircle',
          symbolSize: 8,
          yAxisIndex: 1,
          itemStyle: {
            color: '#1890FF',
          },
          data: [85, 92, 78, 88, 95],
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '运行时间',
          min: 0,
          max: 400,
          interval: 100,
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
          name: '效率(%)',
          nameLocation: 'end',
          nameGap: 15,
          nameTextStyle: {
            color: '#fff',
            fontSize: 12,
            padding: [0, 0, 0, 0],
          },
          min: 0,
          max: 100,
          interval: 20,
          axisLine: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            color: '#fff',
            fontSize: 12,
            formatter: '{value}%',
          },
        },
      ],
    }
    chart.setOption(option)
    window.addEventListener('resize', handleResize)
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
    const seconds = String(date.getSeconds()).padStart(2, '0')

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
    deviceNumber: 'TJ01#',
  }
  getDeviceOutput(params).then((res) => {
    if(res && Array.isArray(res) && res.length > 0){
      res.forEach(item => {
        item.createTime = formatDateTime(item.createTime)
      })
      list.value = res
    }
  }).catch(error => {
    // 添加错误处理
    console.error('获取设备输出数据失败:', error)
  })
}


// 监听设备变化，当设备信息有效时再请求数据
watch(() => props.currentDevice, (newDevice) => {
  if (newDevice && newDevice.number) {
    initData()
  }
}, { deep: true, immediate: true })

onMounted(() => {
  initChart()
  // 移除这里的 initData() 调用，改为通过 watch 触发
  setTimeout(() => {
    initData()
  }, 200);
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chart?.dispose()
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
