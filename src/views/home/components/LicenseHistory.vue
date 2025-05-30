<template>
  <Card class="LicenseHistory" content-padding="6px 0" :show-empty="!loading && tableData.length === 0" title="生产版号">
    <template #titleRight>
      <div class="search-container">
        <div class="input-wrapper">
          <input v-model="searchKeyword" class="search-input" placeholder="请输入版号" type="text" />
          <span v-if="searchKeyword" class="clear-btn" @click="clearSearch">×</span>
        </div>
        <button class="search-btn" @click="handleSearch">查询</button>
      </div>
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
              <el-checkbox v-model="item.selected" @change="handleItemSelectChange" />
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
</template>

<script setup>
import Card from './Card.vue'
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { getPlateListData, getJobBillContent } from '@/api/mes/wk/index.ts'

const searchKeyword = ref('')
const loading = ref(false)
const tableData = ref([])
const originalData = ref([]) // 存储原始数据
const jobbill_id = ref('') // 添加 jobbill_id 引用
const selectAll = ref(false) // 全选状态

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

// 处理全选变化
const handleSelectAllChange = (val) => {
  tableData.value.forEach((item) => {
    item.selected = val
  })
}

// 处理单个选择变化
const handleItemSelectChange = () => {
  // 检查是否所有项都被选中
  selectAll.value = tableData.value.length > 0 && tableData.value.every((item) => item.selected)
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

// 根据搜索关键词过滤数据
const filteredTableData = computed(() => {
  if (!searchKeyword.value) {
    return originalData.value
  }

  const keyword = searchKeyword.value.toLowerCase().trim()
  return originalData.value.filter((item) => {
    // 检查版号是否包含关键词
    return item.version_no && item.version_no.toLowerCase().includes(keyword)
  })
})

// 清除搜索
const clearSearch = () => {
  searchKeyword.value = ''
  // 不需要重新请求数据，直接使用原始数据
}

// 处理搜索
const handleSearch = () => {
  // 前端搜索，不需要请求后端
  tableData.value = filteredTableData.value
}

// 格式化版号，只保留最后三位流水号
const formatVersionNo = (versionNo) => {
  if (!versionNo) return '--'

  // 如果版号长度大于3，只保留最后三位
  // if (versionNo.length > 3) {
  //   return '...' + versionNo.slice(-3)
  // }
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
      rows: 100,
    }

    // 如果有搜索关键词，添加到参数中
    if (searchKeyword.value) {
      params.keyword = searchKeyword.value
    }

    const res = await getPlateListData(params)

    console.log('获取生产版号数据:', res)
    if (res && res.rows && Array.isArray(res.rows)) {
      // 为每一行数据添加selected属性
      const processedData = res.rows.map((item) => ({
        ...item,
        selected: false,
      }))
      originalData.value = processedData // 保存原始数据
      tableData.value = processedData
    } else {
      originalData.value = []
      tableData.value = []
    }
  } catch (error) {
    console.error('获取生产版号数据失败:', error)
    originalData.value = []
    tableData.value = []
  } finally {
    loading.value = false
  }
}

// 监听搜索关键词变化，实时过滤数据
watch(searchKeyword, (newValue) => {
  tableData.value = filteredTableData.value
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

.search-container {
  display: flex;
  align-items: center;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  margin-right: 8px;
}

.search-input {
  height: 28px;
  width: 160px;
  background: rgba(10, 42, 80, 0.5);
  border: 1px solid rgba(33, 158, 252, 0.6);
  border-radius: 4px;
  color: #fff;
  padding: 0 30px 0 10px;
  outline: none;
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
}

.clear-btn {
  position: absolute;
  right: 8px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 18px;
  line-height: 18px;
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    color: #fff;
  }
}

.search-btn {
  height: 28px;
  background: linear-gradient(180deg, #1573ce 0%, #0a2a50 100%);
  border: 1px solid #219efc;
  border-radius: 4px;
  color: #fff;
  padding: 0 12px;
  cursor: pointer;
  &:hover {
    background: linear-gradient(180deg, #1e85e2 0%, #0c315e 100%);
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
