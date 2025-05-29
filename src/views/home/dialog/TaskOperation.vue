<template>
  <el-dialog
    v-model="visible"
    class="task-operation-dialog"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :modal-class="'cyber-modal'"
    :top="'8vh'"
    width="1200px"
    @closed="handleClose"
  >
      <!-- 添加自定义标题插槽 -->
    <template #header>
      <div class="custom-dialog-header">
        <span class="el-dialog__title">{{ title }}</span>
        <span class="device-name" v-if="props.currentDevice && props.currentDevice.name">
         {{ props.currentDevice.name }} {{ props.currentDevice.number }}
        </span>
      </div>
    </template>
    <div class="dialog-content">
      <div class="search-bar">
        <el-input v-model="queryForm.keyword" class="cyber-input" placeholder="请输入任务单搜索">
          <template #prefix>
            <Icon class="search-icon" icon="svg-icon:search" />
          </template>
        </el-input>
        <el-button class="cyber-btn" @click="handSearch">查 询</el-button>
        <el-button class="cyber-btn secondary" @click="resetQuery">重 置</el-button>
      </div>

      <!-- 任务单列表表格 -->
      <div v-loading="tableLoading" class="table-container">
        <div class="table-border-wrapper">
          <div class="scroll-board">
            <table>
              <thead>
                <tr>
                  <th style="width: 50px;">选择</th>
                  <th>任务单号</th>
                  <th>工序</th>
                  <th>工序编码</th>
                  <th>物料名称</th>
                  <th>物料编号</th>
                  <th>规格型号</th>
                  <th>工艺描述</th>
                  <th>总派工数</th>
                  <th>已生产数</th>
                  <th>可生产数量</th>
                  <th>状态</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in taskList" :key="row.id" @click="handleSelectRow(row)">
                  <td @click.stop>
                    <el-checkbox v-model="row.selected" @change="(val) => handleCheckboxChange(val, row)" />
                  </td>
                  <td>{{ row.work_no }}</td>
                  <td>{{ row.wp_name }}</td>
                  <td>{{ row.wp_number }}</td>
                  <td>{{ row.sku_name }}</td>
                  <td>{{ row.sku_no }}</td>
                  <td>{{ row.specs }}</td>
                  <td>{{ row.prodesc }}</td>
                  <td>{{ row.total_count }}</td>
                  <td>{{ row.produced_count }}</td>
                  <td>{{ row.available_count }}</td>
                  <td>
                    <span :class="['status-tag', row.status === '已开工' ? 'in-progress' : 'complete']">
                      {{ row.status }}
                    </span>
                  </td>
                </tr>
                <tr v-if="taskList.length === 0">
                  <td class="empty-data" colspan="12">暂无数据</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 分页区域 -->
      <div class="pagination-wrapper">
        <div class="total-info">共 {{ total }} 条</div>
        <div class="page-size-selector">
          <span>{{ queryForm.pageSize }}条/页</span>
          <Icon class="selector-icon" icon="svg-icon:arrow-down" />
          <div class="dropdown-menu">
            <div v-for="size in [10, 20, 50, 100]" :key="size" class="dropdown-item" @click="handleSizeChange(size)">
              {{ size }}条/页
            </div>
          </div>
        </div>
        <div class="pagination-btns">
          <div class="page-btn" :class="{ disabled: queryForm.pageNo <= 1 }" @click="handlePrevPage">
            <Icon icon="svg-icon:arrow-left" />
          </div>
          <div
            v-for="page in pageDisplays"
            :key="page"
            class="page-btn"
            :class="{ active: page === queryForm.pageNo }"
            @click="handleCurrentChange(page)"
          >
            {{ page }}
          </div>
          <div class="page-btn" :class="{ disabled: queryForm.pageNo >= totalPages }" @click="handleNextPage">
            <Icon icon="svg-icon:arrow-right" />
          </div>
        </div>
        <div class="page-jumper">
          前往
          <input v-model.number="jumpPage" class="jumper-input" type="number" @keyup.enter="handleJumpPage" />
          页
        </div>
      </div>

      <!-- 任务单详情区域 -->
      <div class="task-detail" >
        <div class="detail-header">
          <h3>任务单详情</h3>
        </div>
        <div class="detail-content">
          <div class="detail-row">
            <div class="detail-item">
              <span class="label">任务单号：</span>
              <span class="value">{{ selectedRow?.work_no }}</span>
            </div>
            <div class="detail-item">
              <span class="label">派工单编号：</span>
              <span class="value">{{ selectedRow?.dispatch_no || 'ZYCS01-20231018_j07' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">原单编码：</span>
              <span class="value">{{ selectedRow?.original_no || '2312018' }}</span>
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-item">
              <span class="label">物料名称：</span>
              <span class="value">{{ selectedRow?.sku_name }}</span>
            </div>
            <div class="detail-item">
              <span class="label">物料编号：</span>
              <span class="value">{{ selectedRow?.sku_no || '101A0020208T1003' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">规格型号：</span>
              <span class="value">{{ selectedRow?.specs || '330*273mm' }}</span>
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-item">
              <span class="label">工作中心名称：</span>
              <span class="value">{{ selectedRow?.workcenter_name || '模切机组' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">工序名称：</span>
              <span class="value">{{ selectedRow?.wp_name }}</span>
            </div>
            <div class="detail-item">
              <span class="label">总派工数：</span>
              <span class="value">{{ selectedRow?.total_count || '327,443' }}</span>
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-item">
              <span class="label">已生产数：</span>
              <span class="value">{{ selectedRow?.produced_count || '1,309,740' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">数量(大张)：</span>
              <span class="value">{{ selectedRow?.large_count || '81,861' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">可生产数量(大张)：</span>
              <span class="value">{{ selectedRow?.available_large_count || '-245,574' }}</span>
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-item">
              <span class="label">合格数：</span>
              <span class="value">{{ selectedRow?.qualified_count || '1,309,740' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">不合格数量：</span>
              <span class="value">{{ selectedRow?.unqualified_count || '0' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">备注：</span>
              <span class="value">{{ selectedRow?.remark || '' }}</span>
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-item">
              <span class="label">样稿：</span>
              <span class="value">{{ selectedRow?.sample || '生产样' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">状态：</span>
              <span :class="['value', selectedRow?.status === '已开工' ? 'in-progress' : 'complete']">{{ selectedRow?.status }}</span>
            </div>
            <div class="detail-item">
              <span class="label">是否巡检：</span>
              <span class="value">{{ selectedRow?.is_inspect || '2' }}</span>
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-item">
              <span class="label">是否已经巡检：</span>
              <span class="value">{{ selectedRow?.is_inspected || '1' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">加工内容：</span>
              <span class="value">{{ selectedRow?.process_content || '模切 凹凸' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">批次码编号：</span>
              <span class="value">{{ selectedRow?.batch_no || '202312018' }}</span>
            </div>
          </div>
        </div>
        <div class="detail-footer">
          <el-button class="cyber-btn" @click="handleStartTask">开始任务</el-button>
          <el-button class="cyber-btn secondary" @click="handleEndTask">结束任务</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { Icon } from '/@/components/Icon'
import { getJobBillContent } from '@/api/mes/wk/index.ts'
import { ElMessageBox, ElMessage } from 'element-plus'

const props = defineProps({
  currentDevice: {
    type: Object,
    default: () => ({})
  },
})

// 控制对话框显示状态
const visible = ref(false)
const tableLoading = ref(false)
const total = ref(0)
const taskList = ref([])
const jumpPage = ref(1)
const title = ref('任务单操作')
// 当前选中的行
const selectedRow = ref({})

// 查询表单
const queryForm = reactive({
  pageNo: 1,
  pageSize: 10,
  keyword: '',
})

// 计算属性
const totalPages = computed(() => Math.ceil(total.value / queryForm.pageSize))

const pageDisplays = computed(() => {
  const current = queryForm.pageNo
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

// 选择行
const handleSelectRow = (row) => {
  // 如果点击的是当前已选中的行，则取消选择
  if (row.selected) {
    row.selected = false;
    selectedRow.value = null;
    return;
  }
  
  // 取消所有行的选中状态
  taskList.value.forEach(item => {
    item.selected = false;
  });
  
  // 选中当前行
  row.selected = true;
  selectedRow.value = row;
}

// 处理复选框变化事件
const handleCheckboxChange = (val, row) => {
  if (val) {
    // 取消其他行的选中状态
    taskList.value.forEach(item => {
      if (item.id !== row.id) {
        item.selected = false;
      }
    });
    selectedRow.value = row;
  } else {
    selectedRow.value = null;
  }
}

// 数据加载
const fetchData = async (filter) => {
  tableLoading.value = true

  try {
    // 调用API获取工单数据
    const data = {
      filter: filter || [],
      filter_detail:{},
      keyword_is_detail:0,
      show_total:1,
      page: queryForm.pageNo,
      rows: queryForm.pageSize,
    }
    const res = await getJobBillContent(data)
    
    if (res && res.rows) {
      // 处理API返回的数据
      const workOrders = res.rows.map(item => ({
        id: item.id,
        sku_name: item.sku_name,
        sku_no: item.sku_no,
        work_no: item.work_no || '--',
        wp_name: item.wp_name,
        wp_number: item.wp_number,
        prodesc: item.prodesc || '--',
        specs: item.specs || '--',
        total_count: item.total_count || 0,
        produced_count: item.produced_count || 0,
        available_count: item.available_count || 0,
        status: item.status || '已开工',
        selected: false,
        // 保存原始数据，以便后续使用
        rawData: item
      }))
      
      taskList.value = workOrders
      total.value = res.total || 0
    } else {
      taskList.value = []
      total.value = 0
    }
  } catch (error) {
    console.error('获取工单数据失败:', error)
    taskList.value = []
    total.value = 0
  } finally {
    tableLoading.value = false
    jumpPage.value = queryForm.pageNo
  }
}

const handSearch = () => {
  const work_no = queryForm.keyword
  const filter = [{"val":[{"name":"work_no","val":work_no,"action":"LIKE"}],"relation":"OR"}]
  fetchData(filter)
}

// 重置查询
const resetQuery = () => {
  queryForm.keyword = ''
  queryForm.pageNo = 1
  fetchData([])
}

// 分页处理
const handleCurrentChange = (val) => {
  if (val === '...') return
  queryForm.pageNo = val
  fetchData()
}

const handleSizeChange = (val) => {
  queryForm.pageSize = val
  queryForm.pageNo = 1
  fetchData()
}

const handlePrevPage = () => {
  if (queryForm.pageNo > 1) {
    queryForm.pageNo--
    fetchData()
  }
}

const handleNextPage = () => {
  if (queryForm.pageNo < totalPages.value) {
    queryForm.pageNo++
    fetchData()
  }
}

const handleJumpPage = () => {
  const page = jumpPage.value
  if (page >= 1 && page <= totalPages.value) {
    queryForm.pageNo = page
    fetchData()
  } else {
    jumpPage.value = queryForm.pageNo
  }
}

// 任务操作
const handleStartTask = () => {
  if (!selectedRow.value) {
    ElMessage.warning('请先选择一个任务单')
    return
  }
  
  ElMessageBox.confirm(
    `确认要开始任务 ${selectedRow.value.work_no} 吗？`,
    '开始任务',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'info',
      customClass: 'cyber-confirm-box',
      confirmButtonClass: 'cyber-confirm-btn',
      cancelButtonClass: 'cyber-cancel-btn',
      closeOnClickModal: false
    }
  )
  .then(() => {
    ElMessage.success('任务已开始')
    // 这里添加开始任务的API调用
  })
  .catch(() => {
    // 用户取消操作
  })
}

const handleEndTask = () => {
  if (!selectedRow.value) {
    ElMessage.warning('请先选择一个任务单')
    return
  }
  
  ElMessageBox.confirm(
    `确认要结束任务 ${selectedRow.value.work_no} 吗？`,
    '结束任务',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
      customClass: 'cyber-confirm-box',
      confirmButtonClass: 'cyber-confirm-btn',
      cancelButtonClass: 'cyber-cancel-btn',
      closeOnClickModal: false
    }
  )
  .then(() => {
    ElMessage.success('任务已结束')
    // 这里添加结束任务的API调用
  })
  .catch(() => {
    // 用户取消操作
  })
}

// 打开对话框的方法，将通过父组件调用
const openDialog = () => {
  visible.value = true
  fetchData()
}

const handleClose = () => {
  // 清理资源
  selectedRow.value = null
}

// 暴露方法给父组件
defineExpose({
  openDialog,
})

onMounted(() => {
  // 初始化数据

})
</script>

<style lang="scss">
/* 全局样式，不使用scoped */
.cyber-modal {
  background-color: rgba(0, 21, 41, 0.85) !important;
  backdrop-filter: blur(5px);
}

/* 强制覆盖Element Plus对话框样式 */
.el-overlay-dialog {
  .el-dialog.task-operation-dialog {
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
      padding: 0px 16px !important;
    }

    /* 添加自定义标题样式 */
    .custom-dialog-header {
      display: flex;
      align-items: center;
      .el-dialog__title {
        color: #1ecfff !important;
        font-weight: 500;
        letter-spacing: 1px;
        text-shadow: 0 0 8px rgba(30, 207, 255, 0.5);
        font-size: 16px;
      }
      
      .device-name {
        color: rgba(255, 255, 255, 0.7);
        font-size: 12px;
        margin-left: 8px;
        font-weight: normal;
        letter-spacing: 0;
        text-shadow: none;
      }
    }

    .el-dialog__headerbtn .el-dialog__close {
      color: #1ecfff !important;

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
.task-operation-dialog {
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

    .el-dialog__header {
      padding: 4px 16px;
      border-bottom: 1px solid rgba(30, 207, 255, 0.3);
      margin-right: 0;
    }

    .el-dialog__body {
      flex: 1;
      overflow: hidden;
    }

    .el-dialog__footer {
      padding: 10px 20px;
      border-top: 1px solid rgba(30, 207, 255, 0.3);
    }
  }

  .dialog-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 16px;
    box-sizing: border-box;
    overflow: hidden;
  }

  .search-bar {
    display: flex;
    gap: 10px;
    margin-bottom: 16px;
    flex-shrink: 0;

    .cyber-input {
      width: 300px;

      :deep(.el-input__wrapper) {
        background-color: rgba(13, 35, 65, 0.7);
        border: 1px solid #1ecfff;
        box-shadow: 0 0 8px rgba(30, 207, 255, 0.2);

        &.is-focus {
          box-shadow: 0 0 10px rgba(30, 207, 255, 0.4);
        }

        input {
          color: #eef1f2;
          background-color: transparent;

          &::placeholder {
            color: #8e9dab;
          }
        }
      }

      .search-icon {
        color: #1ecfff;
      }
    }
  }

  .table-container {
    position: relative;
    overflow: hidden;
    height: 300px;
    margin-bottom: 10px;

    .table-border-wrapper {
      width: 100%;
      height: 100%;
      position: relative;
      border: 1px solid rgba(30, 207, 255, 0.5);
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
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
        border: none;
        background-color: transparent;

        thead {
          position: sticky;
          top: 0;
          z-index: 15;

          &::after {
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            height: 1px;
            background-color: rgba(30, 207, 255, 0.5);
            z-index: 16;
          }

          &::before {
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            height: 1px;
            background-color: rgba(30, 207, 255, 0.5);
            z-index: 16;
          }

          tr {
            background-color: rgba(0, 21, 41, 0.95);
          }
        }

        th {
          padding: 8px 6px;
          text-align: center;
          font-size: 14px;
          color: #1ecfff;
          border: none;
          background-color: rgba(0, 21, 41, 0.95);
          font-weight: normal;
          position: sticky;
          top: 0;
          z-index: 10;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

          &:not(:last-child) {
            border-right: 1px solid rgba(30, 207, 255, 0.2);
          }
        }

        td {
          padding: 8px 6px;
          text-align: center;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.8);
          border: none;
          border-bottom: 1px solid rgba(0, 161, 255, 0.2);

          &:not(:last-child) {
            border-right: 1px solid rgba(30, 207, 255, 0.1);
          }
        }

        tr {
          transition: all 0.3s;

          &:nth-child(even) {
            background: rgba(13, 35, 65, 0.3);
          }

          &:hover {
            background: rgba(30, 207, 255, 0.1);
          }

          &.selected-row {
            background: rgba(30, 207, 255, 0.2) !important;
            td {
              color: #fff !important;
            }
          }
        }
        .in-progress {
            color: #22cc55;
        }
        .empty-data {
          padding: 30px 0;
          color: rgba(134, 201, 242, 0.6);
          font-size: 16px;
        }
      }
    }

    :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
      background-color: #1ecfff;
      border-color: #1ecfff;
    }

    :deep(.el-checkbox__inner) {
      background-color: rgba(30, 207, 255, 0.1);
      border-color: #1ecfff;
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
    margin-bottom: 10px;

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
          background-color: #1ecfff;
          color: #001529;
          font-weight: bold;
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
      font-size: 13px;

      .jumper-input {
        width: 36px;
        height: 24px;
        background-color: rgba(13, 35, 65, 0.7);
        border: 1px solid rgba(30, 207, 255, 0.4);
        color: #eef1f2;
        text-align: center;
        margin: 0 5px;
        border-radius: 2px;
        outline: none;

        &:focus {
          border-color: #1ecfff;
          box-shadow: 0 0 5px rgba(30, 207, 255, 0.3);
        }
      }
    }
  }

  .task-detail {
    border: 1px solid rgba(30, 207, 255, 0.5);
    border-radius: 2px;
    background-color: rgba(0, 21, 41, 0.5);
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .detail-header {
      padding: 8px 16px;
      border-bottom: 1px solid rgba(30, 207, 255, 0.3);
      background-color: rgba(0, 21, 41, 0.8);

      h3 {
        margin: 0;
        color: #1ecfff;
        font-size: 16px;
        font-weight: normal;
      }
    }

    .detail-content {
      padding: 16px;
      overflow-y: auto;
      flex: 1;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-thumb {
        background: rgba(30, 207, 255, 0.4);
        border-radius: 3px;
      }

      &::-webkit-scrollbar-track {
        background: rgba(13, 35, 65, 0.3);
      }

      .detail-row {
        display: flex;
        margin-bottom: 16px;
      }

      .detail-item {
        flex: 1;
        display: flex;
        align-items: center;

        .label {
          color: rgba(255, 255, 255, 0.7);
          width: 120px;
          text-align: right;
          padding-right: 10px;
          width: 140px;
        }

        .value {
          color: #1ecfff;
          flex: 1;
        }
        .in-progress {
            color: #22cc55;
        }
      }

      .detail-footer {
        width: 100%;
        background: pink;
        padding: 16px;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        gap: 12px;
        border-top: 1px solid rgba(30, 207, 255, 0.3);
      }
    }
  }
}

</style>