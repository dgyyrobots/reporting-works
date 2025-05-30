<template>
  <Card class="LicenseHistory" content-padding="6px 0" :show-empty="!loading && tableData.length === 0" title="生产版号">
    <template #titleRight>
      <button class="detail-btn" @click="showDetailDialog">查看明细</button>
    </template>
    <div class="scroll-board">
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <span>加载中...</span>
      </div>
      <table v-else-if="tableData.length > 0">
        <thead>
          <tr>
            <th style="width: 40px"></th>
            <th style="width: 40px">
              <el-checkbox v-model="selectAll" @change="handleSelectAllChange" />
            </th>
            <th>版号</th>
            <th>采集数量</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in tableData" :key="index">
            <td>{{ index + 1 }}</td>
            <td>
              <el-checkbox v-model="item.selected" @change="() => handleItemSelectChange(item)" />
            </td>
            <td>{{ formatVersionNo(item.version_no) }}</td>
            <td>{{ toInteger(item.collection_qty) }}</td>
            <td>
              <span>{{ getStatusText(item.status_id) }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </Card>
  
  <!-- 明细弹框 -->
  <LicenseDetailDialog 
    v-model="detailDialogVisible" 
    :device-id="props.currentDevice.id" 
    :jobbill-id="jobbill_id"
  />
</template>

<script setup>
import Card from './Card.vue'
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { getPlateListData, getJobBillContent } from '@/api/mes/wk/index.ts'
import LicenseDetailDialog from '../dialog/LicenseDetailDialog.vue'
import { useWorkStore } from '@/store/modules/work' // 导入store

const workStore = useWorkStore() // 使用store
const loading = ref(false)
const tableData = ref([])
const originalData = ref([]) // 存储原始数据
const jobbill_id = ref('') // 添加 jobbill_id 引用
const detailDialogVisible = ref(false) // 明细弹框显示状态

// 全选状态，使用计算属性从store获取
const selectAll = computed({
  get: () => {
    const licenseCheck = workStore.getLicenseCheck
    return licenseCheck.length > 0 && licenseCheck.every(item => item.selected)
  },
  set: (val) => {
    workStore.updateAllLicenseCheck(val)
  }
})

// 表头定义 - 修改为只保留需要的列
const tableHeaders = ['序号', '选择', '版号', '采集数量', '状态']

// 定义props
const props = defineProps({
  currentWorkcenter: {
    type: Object,
    default: () => ({}),
  },
  currentDevice: {
    type: Object,
    default: () => ({}),
  },
})

// 显示明细弹框
const showDetailDialog = () => {
  detailDialogVisible.value = true
}

// 处理全选变化
const handleSelectAllChange = (val) => {
  workStore.updateAllLicenseCheck(val)
}

// 处理单个选择变化
const handleItemSelectChange = (item) => {
  workStore.updateLicenseCheckItem(item.id, item.selected)
}

// 获取工单ID
const get_jobbill_id = async () => {
  const activeJob = props.currentDevice.jobbill_no
  const wc_id = props.currentWorkcenter.id
  if (!activeJob) return

  const params = {
    filter: [
      {
        val: [
          { name: 'wc_id', val: wc_id, action: '=' },
          { name: 'bill_no', val: activeJob, action: '=' },
        ],
        relation: 'AND',
      },
    ],
  }

  try {
    const res = await getJobBillContent(params)
    if (res && res.rows && res.rows.length > 0) {
      jobbill_id.value = res.rows[0].id
    }
  } catch (error) {
    console.error('获取工单ID失败:', error)
  }
}

// 格式化版号
const formatVersionNo = (versionNo) => {
  if (!versionNo) return '--'
  return versionNo
}

// 格式化日期
const formatDate = (timestamp) => {
  if (!timestamp) return '--'

  try {
    const date = new Date(parseInt(timestamp) * 1000)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${year}-${month}-${day} ${hours}:${minutes}`
  } catch (error) {
    console.error('日期格式化错误:', error)
    return timestamp
  }
}

// 获取状态文本
const getStatusText = (statusId) => {
  const statusMap = {
    0: '待采集',
    1: '采集中',
    2: '采集结束',
  }
  return statusMap[statusId] || '--'
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

// 获取数据
const fetchData = async () => {
  loading.value = true
  try {
    // 确保有 jobbill_id 和 device_id
    if (!jobbill_id.value || !props.currentDevice.id) {
      console.warn('缺少必要参数: jobbill_id 或 device_id')
      tableData.value = []
      originalData.value = []
      return
    }

    const params = {
      filter: [
        {
          val: [
            { name: 'device_id', val: props.currentDevice.id, action: '=' },
            { name: 'jobbill_id', val: jobbill_id.value, action: '=' },
          ],
          relation: 'AND',
        },
      ],
      filter_detail: {},
      other_params: { structure: 'entry1' },
      keyword_is_detail: '0',
      sum_col: [
        'collection_uqty',
        'collection_qty',
        'pass_uqty',
        'pass_qty',
        'ok_uqty',
        'ok_qty',
        'no_ok_uqty',
        'no_okqty',
        'scrap_uqty',
        'scrap_qty',
        'loss_uqty',
        'loss_qty',
      ],
      sum_col_type: '1',
      sort: 'status_id,operate_date',
      order: 'asc,asc',
      show_total: '1',
      page: 1,
      rows: 50,
    }

    const res = await getPlateListData(params)

    console.log('获取生产版号数据:', res)
    if (res && res.rows && Array.isArray(res.rows)) {
      // 为每一行数据添加selected属性
      const processedData = res.rows.map((item) => {
        // 检查store中是否已有该项
        const existingItem = workStore.getLicenseCheck && workStore.getLicenseCheck.find 
          ? workStore.getLicenseCheck.find(storeItem => storeItem.id === item.id)
          : null
        return {
          ...item,
          selected: existingItem ? existingItem.selected : false,
        }
      })
      
      // 更新store中的licenseCheck - 添加防御性检查
      if (typeof workStore.setLicenseCheck === 'function') {
        workStore.setLicenseCheck(processedData)
      } else {
        console.error('workStore.setLicenseCheck 不是一个函数')
        // 如果方法不存在，直接设置本地数据
        tableData.value = processedData
        originalData.value = processedData
        return
      }
      
      originalData.value = processedData // 保存原始数据
      tableData.value = processedData
    } else {
      originalData.value = []
      tableData.value = []
      if (typeof workStore.clearLicenseCheck === 'function') {
        workStore.clearLicenseCheck()
      }
    }
  } catch (error) {
    console.error('获取生产版号数据失败:', error)
    originalData.value = []
    tableData.value = []
    if (typeof workStore.clearLicenseCheck === 'function') {
      workStore.clearLicenseCheck()
    }
  } finally {
    loading.value = false
  }
}
// 监听 fleshLicenseIndex 变化
watch(() => workStore.getFleshLicenseIndex, (newVal) => {
  if (newVal) {
    nextTick(async () => {
      // 如果 jobbill_id 不存在，先获取它
      if (!jobbill_id.value) {
        await get_jobbill_id()
      }
      fetchData()
      workStore.setLicenseCheck([])
    })
  }
})

onMounted(() => {
  nextTick(async () => {
    await get_jobbill_id()
    fetchData()
  })
})
</script>

<style lang="scss" scoped>
.LicenseHistory {
  width: 100%;
  height: 100%;
  /* background: rgba(10, 30, 60, 0.85); */
  box-sizing: border-box;
  color: #fff;
  display: flex;
  flex-direction: column;

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
    to {
      transform: rotate(360deg);
    }
  }
}

.detail-btn {
  background-color: #00bcd4;
    color: #fff;
    border: none;
    padding: 4px 15px;
    border-radius: 2px;
    cursor: pointer;
    font-size: 14px;

    &:hover {
      background-color: #19b8e6;
    }
}

.scroll-board {
  height: 100%;
  overflow: auto;

  table {
    width: 100%;
    border-collapse: collapse;

    th {
      padding: 6px 6px; // 行高变小
      text-align: center;
      font-size: 15px;
      color: #00bcd4;
      border-bottom: 1px solid rgba(0, 188, 212, 0.3);
    }

    td {
      padding: 8px 6px; // 行高变小
      text-align: center;
      font-size: 15px;
      color: #86c9f2;
      border-bottom: 1px solid rgba(0, 161, 255, 0.2);
    }

    tr {
      transition: all 0.3s;

      &:nth-child(even) {
        background: rgba(#00a1ff, 0.05);
      }

      &:hover {
        background: rgba(#00a1ff, 0.15);
      }
    }
  }
}
</style>
