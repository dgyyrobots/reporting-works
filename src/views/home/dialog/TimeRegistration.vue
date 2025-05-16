<template>
  <el-dialog
    v-model="visible"
    class="time-registration-dialog"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :modal-class="'cyber-modal'"
    title="计时登记"
    :top="'8vh'"
    width="1200px"
  >
    <div class="dialog-content">
      <div class="search-bar">
        <el-input v-model="queryForm.keyword" class="cyber-input" clearable placeholder="请输入关键词搜索">
          <template #prefix>
            <Icon class="search-icon" icon="svg-icon:search" />
          </template>
        </el-input>
        <el-button class="cyber-btn" @click="fetchData">查 询</el-button>
        <el-button class="cyber-btn secondary" @click="resetQuery">重 置</el-button>
      </div>

      <div v-loading="listLoading" class="table-container">
        <div class="scroll-board">
          <table>
            <thead>
              <tr>
                <th width="40">
                  <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange" />
                </th>
                <th width="60">序号</th>
                <th>工单号</th>
                <th>作业员</th>
                <th>开始时间</th>
                <th>结束时间</th>
                <th>时长</th>
                <th width="80">状态</th>
                <th width="120">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in list" :key="row.id">
                <td>
                  <el-checkbox v-model="row.checked" @change="handleRowCheckChange" />
                </td>
                <td>{{ index + 1 + (queryForm.pageNo - 1) * queryForm.pageSize }}</td>
                <td>{{ row.workNo }}</td>
                <td>{{ row.operator }}</td>
                <td>{{ row.startTime }}</td>
                <td>{{ row.endTime }}</td>
                <td>{{ row.duration }}</td>
                <td>
                  <div :class="['status-tag', row.status === '完成' ? 'complete' : 'in-progress']">
                    {{ row.status }}
                  </div>
                </td>
                <td>
                  <span class="cyber-link" @click="handleEdit(row)">编辑</span>
                  <span class="cyber-link danger" @click="handleDelete(row)">删除</span>
                </td>
              </tr>
              <tr v-if="list.length === 0">
                <td class="empty-data" colspan="9">暂无数据</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 分页区域 -->
      <div class="pagination-wrapper">
        <div class="total-info">共 {{ total }} 条</div>
        <div class="page-size-selector">
          <span>{{ queryForm.pageSize }}条/页</span>
          <Icon class="selector-icon" icon="svg-icon:arrow-down" />
          <div class="dropdown-menu">
            <div v-for="size in [10, 20, 50, 100]" :key="size" class="dropdown-item" @click="handleSizeChange(size)">{{ size }}条/页</div>
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
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button class="cyber-btn secondary" @click="visible = false">取 消</el-button>
        <el-button class="cyber-btn" @click="handleConfirm">确 认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { Icon } from '/@/components/Icon'

// 控制对话框显示状态
const visible = ref(false)
const listLoading = ref(false)
const total = ref(0)
const list = ref([])
const selectedRows = ref([])
const jumpPage = ref(1)
const checkAll = ref(false)
const isIndeterminate = ref(false)

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

// 全选/反选处理
const handleCheckAllChange = (val) => {
  list.value.forEach((row) => {
    row.checked = val
  })
  isIndeterminate.value = false
  updateSelectedRows()
}

const handleRowCheckChange = () => {
  const checkedCount = list.value.filter((row) => row.checked).length
  checkAll.value = checkedCount === list.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < list.value.length
  updateSelectedRows()
}

const updateSelectedRows = () => {
  selectedRows.value = list.value.filter((row) => row.checked)
}

// 监听list变化，更新全选状态
watch(
  list,
  () => {
    handleRowCheckChange()
  },
  { deep: true }
)

// 模拟数据加载
const fetchData = async () => {
  listLoading.value = true

  // 这里应替换为实际的API调用
  setTimeout(() => {
    // 模拟数据
    const mockData = Array.from({ length: 20 }).map((_, index) => ({
      id: index + 1,
      workNo: `WO-${2023}${String(index + 1).padStart(4, '0')}`,
      operator: `操作员${(index % 5) + 1}`,
      startTime: '2023-12-08 08:30:00',
      endTime: '2023-12-08 17:30:00',
      duration: 540,
      status: index % 3 === 0 ? '进行中' : '完成',
      checked: false,
    }))

    list.value = mockData.slice((queryForm.pageNo - 1) * queryForm.pageSize, queryForm.pageNo * queryForm.pageSize)
    total.value = mockData.length
    listLoading.value = false
    jumpPage.value = queryForm.pageNo
  }, 500)
}

// 重置查询
const resetQuery = () => {
  queryForm.keyword = ''
  queryForm.pageNo = 1
  fetchData()
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

// 编辑行
const handleEdit = (row) => {
  console.log('编辑', row)
  // 实现编辑逻辑
}

// 删除行
const handleDelete = (row) => {
  console.log('删除', row)
  // 实现删除逻辑
}

// 确认操作
const handleConfirm = () => {
  console.log('确认', selectedRows.value)
  visible.value = false
}

// 打开对话框的方法，将通过父组件调用
const openDialog = () => {
  visible.value = true
  fetchData()
}

// 暴露方法给父组件
defineExpose({
  openDialog,
})

onMounted(() => {
  fetchData()
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
  .el-dialog.time-registration-dialog {
    background-color: rgba(0, 21, 41, 0.85);
    border: 1px solid #1ecfff;
    border-radius: 2px;
    box-shadow: 0 0 20px rgba(30, 207, 255, 0.4);
    margin-top: 8vh !important; /* 确保优先级足够高 */

    .el-dialog__header {
      height: 40px !important;
      color: #1ecfff !important;
      border-bottom: 1px solid rgba(30, 207, 255, 0.3);
    }

    .el-dialog__title {
      color: #1ecfff !important;
      font-weight: 500;
      letter-spacing: 1px;
      text-shadow: 0 0 8px rgba(30, 207, 255, 0.5);
      font-size: 16px;
    }

    .el-dialog__headerbtn .el-dialog__close {
      color: #1ecfff !important;

      &:hover {
        color: #4fdcff !important;
      }
    }
  }
}

/* 修改loading样式 */
.el-loading-mask {
  background-color: rgba(0, 21, 41, 0.7) !important;

  .el-loading-spinner {
    .circular {
      .path {
        stroke: #1ecfff !important;
      }
    }

    .el-loading-text {
      color: #1ecfff !important;
    }
  }
}
</style>

<style lang="scss" scoped>
.time-registration-dialog {
  :deep(.el-dialog__body) {
    padding: 0;
    max-height: calc(100vh - 200px);
    overflow: hidden;
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

  :deep(.el-dialog__headerbtn) {
    top: 12px;
    right: 16px;
  }

  :deep(.el-dialog__headerbtn .el-dialog__close) {
    /* 移除这里的颜色设置，改为全局样式 */
  }

  :deep(.el-loading-mask) {
    background-color: rgba(0, 21, 41, 0.7) !important;
  }

  :deep(.el-loading-spinner .circular .path) {
    stroke: #1ecfff !important;
  }

  :deep(.el-loading-spinner .el-loading-text) {
    color: #1ecfff !important;
  }

  .dialog-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 0px;
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
    flex: 1;
    overflow: hidden;
    min-height: 200px;

    .scroll-board {
      width: 100%;
      height: 100%;
      overflow: auto;

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
        border: 1px solid rgba(30, 207, 255, 0.3);

        th {
          padding: 8px 6px;
          text-align: center;
          font-size: 14px;
          color: #1ecfff;
          border-bottom: 1px solid rgba(30, 207, 255, 0.5);
          background-color: rgba(30, 207, 255, 0.1);
          font-weight: normal;
          position: sticky;
          top: 0;
          z-index: 1;
        }

        td {
          padding: 8px 6px;
          text-align: center;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
          border-bottom: 1px solid rgba(0, 161, 255, 0.2);
        }

        tr {
          transition: all 0.3s;

          &:nth-child(even) {
            background: rgba(13, 35, 65, 0.3);
          }

          &:hover {
            background: rgba(30, 207, 255, 0.1);
          }
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
    padding: 10px 0 0;
    color: #1ecfff;
    font-size: 14px;
    flex-shrink: 0;
    height: 40px;

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

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }

  .status-tag {
    display: inline-block;
    padding: 2px 6px;
    border-radius: 2px;
    color: #eef1f2;
    font-size: 12px;

    &.complete {
      background-color: rgba(103, 194, 58, 0.8);
    }

    &.in-progress {
      background-color: rgba(255, 153, 0, 0.8);
    }
  }

  .cyber-btn {
    background-color: rgba(30, 207, 255, 0.2);
    border: 1px solid #1ecfff;
    color: #1ecfff;
    box-shadow: 0 0 8px rgba(30, 207, 255, 0.2);
    border-radius: 2px;
    height: 32px;
    padding: 0 16px;

    &:hover {
      background-color: rgba(30, 207, 255, 0.3);
      box-shadow: 0 0 12px rgba(30, 207, 255, 0.4);
    }

    &.secondary {
      background-color: rgba(30, 207, 255, 0.05);
      border: 1px solid rgba(30, 207, 255, 0.5);
      color: #1ecfff;

      &:hover {
        background-color: rgba(30, 207, 255, 0.15);
      }
    }
  }

  .cyber-link {
    color: #1ecfff;
    cursor: pointer;
    margin: 0 4px;
    text-decoration: none;
    font-size: 14px;

    &:hover {
      text-shadow: 0 0 8px rgba(30, 207, 255, 0.8);
    }

    &.danger {
      color: #ff5252;

      &:hover {
        text-shadow: 0 0 8px rgba(255, 82, 82, 0.8);
      }
    }
  }
}
</style>
