<template>
  <el-dialog
    v-model="dialogVisible"
    title="表体配置"
    width="800px"
    :close-on-click-modal="false"
    class="table-config-dialog"
  >
    <div class="config-container">
      <!-- 表体高度设置 -->
      <div class="config-section">
        <div class="section-title">表体高度</div>
        <div class="height-setting">
          <div class="label">表体高度</div>
          <el-select v-model="tableHeight" class="height-select">
            <el-option label="0" value="0" />
            <el-option label="100" value="100" />
            <el-option label="200" value="200" />
            <el-option label="300" value="300" />
            <el-option label="400" value="400" />
            <el-option label="500" value="500" />
            <el-option label="600" value="600" />
          </el-select>
          <span class="hint">(为0表示自适应高度)</span>
        </div>
      </div>

      <!-- 列宽配置 -->
      <div class="config-section">
        <div class="section-title">列宽配置</div>
        <div class="column-config">
          <el-table 
            :data="columnSettings" 
            border 
            style="width: 100%" 
            class="config-table"
            row-key="name"
          >
            <el-table-column prop="name" label="字段名称" min-width="150" />
            <el-table-column label="列宽" min-width="150">
              <template #default="{ row }">
                <el-input v-model="row.width" type="number" />
              </template>
            </el-table-column>

            <el-table-column width="120" label="排序">
              <template #default="{ row }">
                <div class="drag-handle">
                  <el-icon><Menu /></el-icon>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button @click="handleReset">重置</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, defineEmits, defineExpose, onMounted, nextTick } from 'vue'
import { Menu } from '@element-plus/icons-vue'
import Sortable from 'sortablejs'

const emit = defineEmits(['confirm', 'cancel'])
const dialogVisible = ref(false)
const tableHeight = ref('0')

// 列配置数据
const columnSettings = ref([])

// 原始配置备份，用于重置
const originalSettings = ref([])
const originalHeight = ref('0')

// 初始化拖拽排序
const initSortable = () => {
  nextTick(() => {
    const tbody = document.querySelector('.config-table .el-table__body tbody')
    if (tbody) {
      Sortable.create(tbody, {
        handle: '.drag-handle',
        animation: 150,
        onEnd({ newIndex, oldIndex }) {
          // 获取拖动的元素
          const currRow = columnSettings.value.splice(oldIndex, 1)[0]
          // 插入到新位置
          columnSettings.value.splice(newIndex, 0, currRow)
          
          // 更新排序字段
          columnSettings.value.forEach((item, index) => {
            item.order = String(index + 1)
          })
        }
      })
    }
  })
}

// 打开对话框
const open = (config = null) => {
  if (config) {
    // 如果传入了配置，则使用传入的配置
    if (config.height) tableHeight.value = config.height
    if (config.columns && config.columns.length > 0) {
      columnSettings.value = JSON.parse(JSON.stringify(config.columns))
      // 更新原始配置备份
      originalSettings.value = JSON.parse(JSON.stringify(config.columns))
    }
    originalHeight.value = tableHeight.value
  }
  dialogVisible.value = true
  
  // 初始化拖拽排序
  initSortable()
}

// 取消
const handleCancel = () => {
  dialogVisible.value = false
  emit('cancel')
}

// 重置
const handleReset = () => {
  columnSettings.value = JSON.parse(JSON.stringify(originalSettings.value))
  tableHeight.value = originalHeight.value
}

// 确认
const handleConfirm = () => {
  const config = {
    height: tableHeight.value,
    columns: columnSettings.value
  }
  emit('confirm', config)
  dialogVisible.value = false
}

// 暴露方法
defineExpose({
  open
})
</script>

<style lang="scss" scoped>
.config-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.config-section {
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 15px;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 15px;
  color: #1ecfff;
  position: relative;
  padding-left: 10px;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 16px;
    background-color: #1ecfff;
    border-radius: 2px;
  }
}

.height-setting {
  display: flex;
  align-items: center;
  
  .label {
    width: 80px;
    color: #b6eaff;
  }
  
  .height-select {
    width: 120px;
    margin-right: 10px;
  }
  
  .hint {
    color: #909399;
    font-size: 14px;
  }
}

.column-config {
  margin-top: 10px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

:deep(.el-dialog) {
  background-color: rgba(0, 21, 41, 0.95);
  border: 1px solid rgba(30, 207, 255, 0.5);
  
  .el-dialog__header {
    border-bottom: 1px solid rgba(30, 207, 255, 0.5);
    margin-right: 0;
    padding: 15px 20px;
    
    .el-dialog__title {
      color: #1ecfff;
      font-size: 16px;
      font-weight: 500;
    }
    
    .el-dialog__headerbtn {
      .el-dialog__close {
        color: #1ecfff;
      }
    }
  }
  
  .el-dialog__body {
    padding: 20px;
    color: #b6eaff;
  }
  
  .el-dialog__footer {
    border-top: 1px solid rgba(30, 207, 255, 0.5);
    padding: 15px 20px;
  }
}

:deep(.el-input__wrapper),
:deep(.el-select) {
  background-color: rgba(0, 21, 41, 0.5);
  border: 1px solid rgba(30, 207, 255, 0.5);
  box-shadow: none !important;
  
  &.is-focus {
    border-color: #1ecfff;
  }
  
  .el-input__inner {
    color: #fff;
    height: 32px;
  }
}

:deep(.el-select) {
  width: 100%;
}

:deep(.el-button) {
  border-radius: 4px;
  
  &.el-button--primary {
    background-color: #1ecfff;
    border-color: #1ecfff;
    
    &:hover {
      background-color: rgba(30, 207, 255, 0.8);
      border-color: rgba(30, 207, 255, 0.8);
    }
  }
  
  &:not(.el-button--primary) {
    background-color: transparent;
    border: 1px solid #1ecfff;
    color: #1ecfff;
    
    &:hover {
      background-color: rgba(30, 207, 255, 0.1);
    }
  }
}

:deep(.config-table) {
  --el-table-border-color: rgba(30, 207, 255, 0.5);
  --el-table-header-bg-color: rgba(30, 207, 255, 0.1);
  --el-table-bg-color: rgba(0, 21, 41, 0.95);
  --el-table-tr-bg-color: rgba(0, 21, 41, 0.95);
  --el-table-row-hover-bg-color: rgba(30, 207, 255, 0.05);
  --el-table-header-text-color: #b6eaff;
  --el-table-text-color: #fff;
  
  .el-table__inner-wrapper {
    border: 1px solid rgba(30, 207, 255, 0.5);
  }
  
  .el-table__cell {
    background-color: transparent;
  }
}

.drag-handle {
  cursor: move;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #1ecfff;
  
  &:hover {
    color: #fff;
  }
}

// 拖拽时的样式
:deep(.sortable-ghost) {
  opacity: 0.5;
  background-color: rgba(30, 207, 255, 0.2) !important;
}

:deep(.sortable-chosen) {
  background-color: rgba(30, 207, 255, 0.1) !important;
}

:deep(.sortable-drag) {
  opacity: 0.8;
  background-color: rgba(0, 21, 41, 0.95) !important;
}
</style>