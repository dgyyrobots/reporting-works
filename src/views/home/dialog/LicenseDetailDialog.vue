<template>
  <el-dialog
    v-model="dialogVisible"
    class="license-detail-dialog"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :modal-class="'cyber-modal'"
    title="生产版号明细"
    width="80%"
  >
    <div class="dialog-content">
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <span>加载中...</span>
      </div>
      <div v-else class="table-container">
        <div class="table-border-wrapper">
          <div v-if="tableData.length === 0" class="no-data">
            <Icon icon="svg-icon:empty-box" />
            暂无数据
          </div>
          <div v-else class="scroll-board">
            <table>
              <thead>
                <tr>
                  <th style="width: 60px">序号</th>
                  <th style="width: 40px">
                    <el-checkbox v-model="selectAll" @change="handleSelectAllChange" />
                  </th>
                  <th>版号</th>
                  <th style="width: 100px">采集数量</th>
                  <th style="width: 100px">状态</th>
                  <th style="width: 120px">过版纸数量</th>
                  <th style="width: 120px">剩余可报</th>
                  <th style="width: 100px">操作</th>
                  <th style="width: 150px">(大张)正报数量</th>
                  <th style="width: 150px">(大张)过版数量</th>
                  <th style="width: 180px">操作时间</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in tableData" :key="index">
                  <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                  <td>
                    <el-checkbox v-model="item.selected" @change="() => handleItemSelectChange(item)" />
                  </td>
                  <td>{{ item.version_no }}</td>
                  <td>{{ toInteger(item.collection_qty) }}</td>
                  <td>
                    <span :class="getStatusClass(item.status_id)">
                      {{ getStatusText(item.status_id) }}
                    </span>
                  </td>
                  <td>{{ toInteger(item.pass_qty) }}</td>
                  <td>{{ toInteger(item.no_okqty) }}</td>
                  <td>
                    <span class='del-span' @click.stop="confirmDelete(item)">
                        <Icon icon="svg-icon:del" />
                    </span>
                  </td>
                  <td>{{ toInteger(item.ok_qty) }}</td>
                  <td>{{ toInteger(item.pass_qty) }}</td>
                  <td>{{ formatDate(item.operate_date) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <div class="total-info">共 {{ total }} 条</div>
        <div class="page-size-selector">
          <span>{{ pageSize }}条/页</span>
          <Icon class="selector-icon" icon="svg-icon:arrow-down" />
          <div class="dropdown-menu">
            <div v-for="size in [10, 20, 50, 100]" :key="size" class="dropdown-item" @click="handleSizeChange(size)">{{ size }}条/页</div>
          </div>
        </div>
        <div class="pagination-btns">
          <div class="page-btn" :class="{ disabled: currentPage <= 1 }" @click="handlePrevPage">
            <Icon icon="svg-icon:arrow-left" />
          </div>
          <div
            v-for="page in pageDisplays"
            :key="page"
            class="page-btn"
            :class="{ active: page === currentPage }"
            @click="handleCurrentChange(page)"
          >
            {{ page }}
          </div>
          <div class="page-btn" :class="{ disabled: currentPage >= totalPages }" @click="handleNextPage">
            <Icon icon="svg-icon:arrow-right" />
          </div>
        </div>
        <div class="page-jumper">
          前往
          <input v-model.number="jumpPage" class="jumper-input" type="number" @keyup.enter="handleJumpPage" />
          页
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref, computed, watch } from 'vue'
import { getPlateListData, updateVersionNumberManageEntryData } from '@/api/mes/wk/index.ts'
import { Icon } from '/@/components/Icon'
import { useWorkStore } from '@/store/modules/work' // 导入store

const workStore = useWorkStore() // 使用store

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  deviceId: {
    type: [String, Number],
    default: '',
  },
  jobbillId: {
    type: [String, Number],
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const loading = ref(false)
const tableData = ref([])
// const selectAll = ref(false) // 新增全选
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const jumpPage = ref(1)

// 计算总页数
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

// 计算要显示的页码
const pageDisplays = computed(() => {
  const current = currentPage.value
  const maxPages = totalPages.value

  if (maxPages <= 7) {
    return Array.from({ length: maxPages }, (_, i) => i + 1)
  }

  if (current <= 4) {
    return [1, 2, 3, 4, 5, '...', maxPages]
  }

  if (current >= maxPages - 3) {
    return [1, '...', maxPages - 4, maxPages - 3, maxPages - 2, maxPages - 1, maxPages]
  }

  return [1, '...', current - 1, current, current + 1, '...', maxPages]
})

// 监听对话框显示状态变化
watch(dialogVisible, (newVal) => {
  if (newVal) {
    fetchData()
  }
})

// 监听 fleshLicenseIndex 变化
watch(() => workStore.getFleshLicenseIndex, (newVal) => {
  console.log('fleshLicenseIndex 变化:', newVal)
  if (newVal) {
    fetchData()
    workStore.setLicenseCheck([])
  }
})

// 获取状态文本
const getStatusText = (statusId) => {
  const statusMap = {
    0: '待采集',
    1: '采集中',
    2: '采集结束',
  }
  return statusMap[statusId] || '--'
}

// 获取状态样式类
const getStatusClass = (statusId) => {
  const statusClassMap = {
    0: 'status-waiting',
    1: 'status-collecting',
    2: 'status-completed',
  }
  return statusClassMap[statusId] || ''
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
    const seconds = String(date.getSeconds()).padStart(2, '0')

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  } catch (error) {
    console.error('日期格式化错误:', error)
    return timestamp
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

// 处理页码变化
const handleCurrentChange = (val) => {
  if (val === '...') return
  currentPage.value = val
  fetchData()
}

// 处理每页条数变化
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
  fetchData()
}

// 处理上一页
const handlePrevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchData()
  }
}

// 处理下一页
const handleNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchData()
  }
}

// 处理页码跳转
const handleJumpPage = () => {
  const page = jumpPage.value
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchData()
  } else {
    jumpPage.value = currentPage.value
  }
}

// 全选状态，直接使用本地数据计算，不依赖store
const selectAll = computed({
  get: () => {
    return tableData.value.length > 0 && tableData.value.every(item => item.selected)
  },
  set: (val) => {
    // 更新本地数据
    tableData.value.forEach(item => {
      item.selected = val
    })
    
    // 如果store方法存在，同步更新store
    if (typeof workStore.updateAllLicenseCheck === 'function') {
      workStore.updateAllLicenseCheck(val)
    }
  }
})

// 全选checkbox变化
const handleSelectAllChange = (val) => {
  // 直接设置计算属性的值，会触发set方法
  selectAll.value = val
}

// 单个checkbox变化
const handleItemSelectChange = (item) => {
  // 如果store方法存在，同步更新store
  if (typeof workStore.updateLicenseCheckItem === 'function') {
    workStore.updateLicenseCheckItem(item.id, item.selected)
  }
  
  // 手动检查是否需要更新全选状态
  const allSelected = tableData.value.length > 0 && tableData.value.every(i => i.selected)
  if (allSelected !== selectAll.value) {
    // 这里不会触发无限循环，因为只有在值不同时才会更新
    selectAll.value = allSelected
  }
}

// 获取数据
const fetchData = async () => {
  if (!props.deviceId || !props.jobbillId) {
    console.warn('缺少必要参数: deviceId 或 jobbillId')
    return
  }

  loading.value = true
  try {
    const params = {
      filter: [
        {
          val: [
            { name: 'device_id', val: props.deviceId, action: '=' },
            { name: 'jobbill_id', val: props.jobbillId, action: '=' },
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
      page: currentPage.value,
      rows: pageSize.value,
    }

    const res = await getPlateListData(params)

    if (res && res.rows && Array.isArray(res.rows)) {
      // 处理数据，与store中的数据同步选中状态
      tableData.value = res.rows.map((item) => {
        // 检查store中是否已有该项
        const storeItems = workStore.getLicenseCheck || []
        const existingItem = storeItems.find(storeItem => storeItem.id === item.id)
        return {
          ...item,
          selected: existingItem ? existingItem.selected : false,
        }
      })
      
      // 更新store中可能不存在的项
      if (typeof workStore.setLicenseCheck === 'function') {
        const storeItems = workStore.getLicenseCheck || []
        const newItems = tableData.value.filter(item => 
          !storeItems.some(storeItem => storeItem.id === item.id)
        )
        if (newItems.length > 0) {
          workStore.setLicenseCheck([...storeItems, ...newItems])
        }
      }
      
      total.value = res.total || 0
      jumpPage.value = currentPage.value
    } else {
      tableData.value = []
      total.value = 0
    }
  } catch (error) {
    console.error('获取生产版号明细数据失败:', error)
    tableData.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

const confirmDelete = async (item) => {
  try {
    await ElMessageBox.confirm(
      '是否确认删除该条数据？',
      '确认删除',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'cyber-confirm-box',
        confirmButtonClass: 'cyber-confirm-btn',
        cancelButtonClass: 'cyber-cancel-btn'
      }
    )
    
    // 用户点击了确认按钮，执行删除操作
    try {
      const params =  {
        id: item.id,
        is_delete: 1
       }
      const res = await updateVersionNumberManageEntryData(params)
      
      console.log('删除响应数据:', res)
      if (res && res.ret === 0) {
        ElMessage.success('删除成功')
        // 刷新列表
        fetchData()
      } else {
        ElMessage.error(res?.message || '删除失败')
      }
    } catch (error) {
      console.error('删除数据失败:', error)
      ElMessage.error('删除失败：' + (error.message || '未知错误'))
    }
  } catch (e) {
    // 用户取消了删除操作，不做任何处理
    console.log('用户取消了删除操作')
  }
}
</script>

<style lang="scss">
/* 全局样式，不使用scoped */
.cyber-modal {
  background-color: rgba(0, 21, 41, 0.85) !important;
  backdrop-filter: blur(5px);
}

/* 强制覆盖Element Plus对话框样式 */
.el-overlay-dialog {
  .el-dialog.license-detail-dialog {
    background-color: rgba(0, 21, 41, 0.85);
    border: 1px solid #1ecfff;
    border-radius: 2px;
    box-shadow: 0 0 20px rgba(30, 207, 255, 0.4);
    margin-top: 8vh !important; /* 确保优先级足够高 */

    .el-dialog__body {
      padding: 0 !important;
    }

    .el-dialog__header {
      height: 40px !important;
      color: #1ecfff !important;
      border-bottom: 1px solid rgba(30, 207, 255, 0.3);
      background: linear-gradient(90deg, #1573ce 0%, #0a2a50 100%);
      padding: 12px 20px;
      margin-right: 0;
    }

    .el-dialog__title {
      color: #fff !important;
      font-size: 16px;
      font-weight: 500;
      letter-spacing: 1px;
      text-shadow: 0 0 8px rgba(30, 207, 255, 0.5);
    }

    .el-dialog__headerbtn .el-dialog__close {
      color: #fff !important;

      &:hover {
        color: #4fdcff !important;
      }
    }

    .el-dialog__body {
      padding: 0 !important;
    }
  }
}
</style>

<style lang="scss" scoped>
.license-detail-dialog {
  :deep(.el-dialog__body) {
    max-height: calc(100vh - 200px);
    overflow: hidden;
    padding: 0 !important;
  }

  :deep(.el-dialog) {
    background-color: rgba(0, 21, 41, 0.85);
    border: 1px solid #1ecfff;
    border-radius: 2px;
    box-shadow: 0 0 20px rgba(30, 207, 255, 0.4);
    backdrop-filter: blur(5px);
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
  }

  .dialog-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 16px;
    box-sizing: border-box;
    overflow: hidden;
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 200px;
    color: #1ecfff;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(30, 207, 255, 0.2);
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

  .table-container {
    position: relative;
    overflow: hidden;
    flex: 1;
    min-height: 200px;
  }

  .table-border-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    border: 1px solid rgba(30, 207, 255, 0.5);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }

  .no-data {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: #86c9f2;
    gap: 10px;
    padding: 30px 0;
  }

  .scroll-board {
    width: 100%;
    height: 100%;
    overflow: auto;
    position: relative;
    flex: 1;

    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(30, 207, 255, 0.4);
      border-radius: 3px;
    }

    &::-webkit-scrollbar-track {
      background: rgba(13, 35, 65, 0.3);
    }

    table {
      width: 100%;
      border-collapse: collapse;

      th {
        padding: 10px 6px;
        text-align: center;
        font-size: 15px;
        color: #00bcd4;
        border-bottom: 1px solid rgba(0, 188, 212, 0.3);
        background-color: rgba(0, 21, 41, 0.95);
        position: sticky;
        top: 0;
        z-index: 1;
      }

      td {
        padding: 12px 6px;
        text-align: center;
        font-size: 15px;
        color: #86c9f2;
        border-bottom: 1px solid rgba(0, 161, 255, 0.2);
      }

      tr {
        transition: all 0.3s;
        background-color: transparent;

        &:nth-child(even) {
          background: rgba(#00a1ff, 0.05);
        }

        &:hover {
          background: rgba(#00a1ff, 0.15);
        }
      }
    }
  }

  .pagination-wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 10px 0;
    color: #1ecfff;
    font-size: 14px;
    flex-shrink: 0;
    height: 40px;
    margin-top: 15px;

    .total-info {
      margin-right: 15px;
    }

    .page-size-selector {
      position: relative;
      margin-right: 15px;
      padding: 4px 8px;
      border: 1px solid rgba(30, 207, 255, 0.4);
      border-radius: 2px;
      cursor: pointer;
      user-select: none;
      display: flex;
      align-items: center;

      .selector-icon {
        margin-left: 5px;
        font-size: 12px;
      }

      .dropdown-menu {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background-color: rgba(0, 21, 41, 0.95);
        border: 1px solid #1ecfff;
        border-top: none;
        z-index: 10;

        .dropdown-item {
          padding: 4px 8px;

          &:hover {
            background-color: rgba(30, 207, 255, 0.2);
          }
        }
      }

      &:hover .dropdown-menu {
        display: block;
      }
    }

    .pagination-btns {
      display: flex;
      margin-right: 15px;

      .page-btn {
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid rgba(30, 207, 255, 0.4);
        margin-right: 4px;
        cursor: pointer;
        user-select: none;
        border-radius: 2px;
        font-size: 13px;

        &:hover:not(.disabled) {
          background-color: rgba(30, 207, 255, 0.2);
        }

        &.active {
          background-color: rgba(30, 207, 255, 0.3);
          color: #fff;
        }

        &.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }
    }

    .page-jumper {
      display: flex;
      align-items: center;

      .jumper-input {
        width: 40px;
        height: 28px;
        margin: 0 5px;
        background-color: rgba(13, 35, 65, 0.7);
        border: 1px solid rgba(30, 207, 255, 0.4);
        color: #fff;
        text-align: center;
        outline: none;
        border-radius: 2px;

        &:focus {
          border-color: #1ecfff;
          box-shadow: 0 0 5px rgba(30, 207, 255, 0.5);
        }
      }
    }
  }

  .status-waiting {
    color: #ff9800;
  }

  .status-collecting {
    color: #2196f3;
  }

  .status-completed {
    color: #4caf50;
  }
}
.del-span {
    cursor: pointer;
    padding: 2px 4px;
}
</style>
