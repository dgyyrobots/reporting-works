<template>
  <div class="report-table-container">
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      max-height="500"
      class="cyber-table"
      :header-cell-style="headerCellStyle"
      :cell-style="cellStyle"
    >
      <el-table-column type="index" label="序号" width="60" align="center" />
      
      <el-table-column label="配置" width="100" align="center">
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
      
      <el-table-column label="工作内容" prop="workContent" min-width="150" align="center">
        <template #default="{ row }">
          <el-input v-model="row.workContent" placeholder="" />
        </template>
      </el-table-column>
      
      <el-table-column label="模具名称" prop="moldName" min-width="150" align="center">
        <template #default="{ row }">
          <div class="input-with-search">
            <el-input v-model="row.moldName" placeholder="" />
            <el-button class="search-btn"><Icon icon="svg-icon:search" /></el-button>
          </div>
        </template>
      </el-table-column>
      
      <el-table-column label="模具编号" prop="moldCode" min-width="120" align="center">
        <template #default="{ row }">
          <el-input v-model="row.moldCode" placeholder="" />
        </template>
      </el-table-column>
      
      <el-table-column label="模具型号" prop="moldModel" min-width="120" align="center">
        <template #default="{ row }">
          <el-input v-model="row.moldModel" placeholder="" />
        </template>
      </el-table-column>
      
      <el-table-column label="模具操作类型" prop="operationType" min-width="120" align="center">
        <template #default="{ row }">
          <el-select v-model="row.operationType" placeholder="请选择">
            <el-option label="维修" value="repair" />
            <el-option label="保养" value="maintenance" />
            <el-option label="调试" value="debug" />
            <el-option label="更换" value="replace" />
          </el-select>
        </template>
      </el-table-column>
      
      <el-table-column label="数量" prop="quantity" min-width="100" align="center">
        <template #default="{ row }">
          <el-input-number v-model="row.quantity" :min="0" :precision="0" controls-position="right" />
        </template>
      </el-table-column>
      
      <el-table-column label="备注" prop="remark" min-width="200" align="center">
        <template #default="{ row }">
          <el-input 
            v-model="row.remark" 
            type="textarea" 
            :rows="2"
            placeholder="" 
          />
        </template>
      </el-table-column>
    </el-table>
    
    <div class="table-footer">
      <span class="footer-label">总计</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Icon } from '/@/components/Icon'

// 表格数据
const tableData = ref([
  {
    workContent: '',
    moldName: '',
    moldCode: '',
    moldModel: '',
    operationType: '',
    quantity: 0,
    remark: ''
  }
])

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
  tableData.value.splice(index + 1, 0, {
    workContent: '',
    moldName: '',
    moldCode: '',
    moldModel: '',
    operationType: '',
    quantity: 0,
    remark: ''
  })
}

// 删除行
const handleDeleteRow = (index) => {
  if (tableData.value.length > 1) {
    tableData.value.splice(index, 1)
  }
}

// 暴露表格数据给父组件
defineExpose({
  tableData
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

:deep(.el-select) {
  width: 100%;
}

:deep(.el-input-number) {
  width: 100%;
  
  .el-input-number__decrease,
  .el-input-number__increase {
    background-color: rgba(0, 21, 41, 0.7);
    color: #1ecfff;
    border-color: rgba(30, 207, 255, 0.5);
    
    &:hover {
      color: #fff;
      background-color: rgba(30, 207, 255, 0.2);
    }
  }
}

// 优化输入框样式，减小内边距
:deep(.el-input__wrapper) {
  padding: 0 8px;
}

// 优化下拉选择器样式
:deep(.el-select__popper) {
  background-color: rgba(0, 21, 41, 0.95) !important;
  border: 1px solid rgba(30, 207, 255, 0.5) !important;
  
  .el-select-dropdown__item {
    color: #fff;
    
    &.selected {
      color: #1ecfff;
      background-color: rgba(30, 207, 255, 0.1);
    }
    
    &:hover {
      background-color: rgba(30, 207, 255, 0.05);
    }
  }
}

// 优化文本域样式
:deep(.el-textarea__inner) {
  background-color: rgba(0, 21, 41, 0.5);
  border: 1px solid rgba(30, 207, 255, 0.5);
  color: #fff;
  
  &:focus {
    border-color: #1ecfff;
  }
}
</style>