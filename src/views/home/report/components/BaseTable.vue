<template>
  <div class="report-table-container">
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      :max-height="maxHeight"
      class="cyber-table"
      :header-cell-style="headerCellStyle"
      :cell-style="cellStyle"
    >
      <el-table-column type="index" label="序号" width="60" align="center" />
      
      <el-table-column v-if="showConfigColumn" label="配置" width="100" align="center">
        <template #header>
          <el-tooltip content="配置" placement="top">
            <span> <Icon icon="svg-icon:set" :style="{ color: '#1ecfff' }" /><span style="margin-left: 4px;">配置</span></span>
          </el-tooltip>
        </template>
        <template #default="{ $index }">
          <div class="action-buttons">
            <button class="action-btn add-btn" @click="handleAddRow($index)">+</button>
            <button class="action-btn delete-btn" @click="handleDeleteRow($index)">-</button>
          </div>
        </template>
      </el-table-column>
      
      <!-- 动态插槽，用于插入自定义列 -->
      <slot></slot>
    </el-table>
    
    <div class="table-footer">
      <span class="footer-label">{{ footerText }}</span>
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Icon } from '/@/components/Icon'

const props = defineProps({
  tableData: {
    type: Array,
    required: true
  },
  maxHeight: {
    type: [String, Number],
    default: 500
  },
  showConfigColumn: {
    type: Boolean,
    default: true
  },
  footerText: {
    type: String,
    default: '总计'
  },
  emptyRowTemplate: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:tableData', 'add-row', 'delete-row'])

// 表头样式
const headerCellStyle = {
  backgroundColor: 'rgba(30, 207, 255, 0.1)',
  color: '#b6eaff',
  borderColor: 'rgba(30, 207, 255, 0.5)',
  fontWeight: '500',
  padding: '8px 6px',
  fontSize: '14px'
}

// 单元格样式
const cellStyle = {
  backgroundColor: 'rgba(0, 21, 41, 0.95)',
  borderColor: 'rgba(30, 207, 255, 0.5)',
  color: '#fff',
  padding: '4px 6px'
}

// 添加行
const handleAddRow = (index) => {
  const newData = [...props.tableData]
  newData.splice(index + 1, 0, { ...props.emptyRowTemplate })
  emit('update:tableData', newData)
  emit('add-row', index + 1)
}

// 删除行
const handleDeleteRow = (index) => {
  if (props.tableData.length > 1) {
    const newData = [...props.tableData]
    newData.splice(index, 1)
    emit('update:tableData', newData)
    emit('delete-row', index)
  }
}

// 暴露方法给父组件
defineExpose({
  handleAddRow,
  handleDeleteRow
})
</script>

<style lang="scss" scoped>
.report-table-container {
  margin-top: 20px;
  width: 100%;
}

.cyber-table {
  --el-table-border-color: rgba(30, 207, 255, 0.5);
  --el-table-header-bg-color: rgba(30, 207, 255, 0.1);
  --el-table-bg-color: rgba(0, 21, 41, 0.95);
  --el-table-tr-bg-color: rgba(0, 21, 41, 0.95);
  --el-table-row-hover-bg-color: rgba(30, 207, 255, 0.05);
  --el-table-header-text-color: #b6eaff;
  --el-table-text-color: #fff;
  
  // 修复表格边框样式
  :deep(.el-table__inner-wrapper) {
    border: 1px solid rgba(30, 207, 255, 0.5);
  }
  
  :deep(.el-table__border-left-patch) {
    background-color: rgba(30, 207, 255, 0.1);
  }
  
  :deep(.el-table__cell) {
    background-color: transparent;
  }
  
  :deep(.el-table__header) {
    border-bottom: 2px solid rgba(30, 207, 255, 0.8);
  }
}

.table-footer {
  display: flex;
  align-items: center;
  height: 40px;
  background-color: rgba(30, 207, 255, 0.1);
  border: 1px solid rgba(30, 207, 255, 0.5);
  border-top: none;
  padding: 0 20px;
  
  .footer-label {
    color: #b6eaff;
    font-weight: 500;
    font-size: 14px;
  }
}

.required {
  color: #ff5555;
  margin-left: 2px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 4px;
}

.action-btn {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(10, 30, 60, 0.18);
  border: 1px solid #1ecfff;
  color: #1ecfff;
  font-size: 16px;
  border-radius: 3px;
  cursor: pointer;
  padding: 0;
  
  &:hover {
    background-color: rgba(30, 207, 255, 0.1);
    box-shadow: 0 0 5px rgba(30, 207, 255, 0.5);
  }
}

.add-btn {
  color: #22e222;
  border-color: #22e222;
  
  &:hover {
    box-shadow: 0 0 5px rgba(34, 226, 34, 0.5);
  }
}

.delete-btn {
  color: #ff5555;
  border-color: #ff5555;
  
  &:hover {
    box-shadow: 0 0 5px rgba(255, 85, 85, 0.5);
  }
}

.input-with-search {
  display: flex;
  align-items: center;
  
  .el-input {
    flex: 1;
  }
  
  .search-btn {
    margin-left: 5px;
    padding: 0 8px;
    background-color: transparent;
    border: 1px solid #1ecfff;
    color: #1ecfff;
    height: 32px;
    
    &:hover {
      background-color: rgba(30, 207, 255, 0.1);
    }
  }
}

:deep(.el-input__wrapper),
:deep(.el-select),
:deep(.el-date-editor),
:deep(.el-input-number) {
  background-color: rgba(0, 21, 41, 0.5);
  border: 1px solid rgba(30, 207, 255, 0.5);
  box-shadow: none !important;
  
  &.is-focus {
    border-color: #1ecfff;
  }
  
  .el-input__inner {
    color: #fff;
    height: 32px;
    font-size: 14px;
  }
}

:deep(.el-date-editor) {
  width: 100%;
}

// 优化输入框样式，减小内边距
:deep(.el-input__wrapper) {
  padding: 0 8px;
}

// 优化日期选择器样式
:deep(.el-date-editor.el-input) {
  width: 100%;
  .el-input__wrapper {
    padding-right: 25px;
  }
}
</style>