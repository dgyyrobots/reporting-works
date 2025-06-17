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
      
      <el-table-column label="员工" prop="employee" min-width="120" align="center">
        <template #header>
          员工 <span class="required">*</span>
        </template>
        <template #default="{ row }">
          <div class="input-with-search">
            <el-input v-model="row.employee" placeholder="" />
            <el-button class="search-btn"><Icon icon="svg-icon:search" /></el-button>
          </div>
        </template>
      </el-table-column>
      
      <el-table-column label="工号" prop="employeeId" min-width="80" align="center">
        <template #default="{ row }">
          <el-input v-model="row.employeeId" placeholder="" />
        </template>
      </el-table-column>
      
      <el-table-column label="员工分配比例" prop="allocation" min-width="100" align="center">
        <template #default="{ row }">
          <el-input v-model="row.allocation" placeholder="" />
        </template>
      </el-table-column>
      
      <el-table-column label="计件比例" prop="pieceRate" min-width="100" align="center">
        <template #default="{ row }">
          <el-input v-model="row.pieceRate" placeholder="" />
        </template>
      </el-table-column>
      
      <el-table-column label="上工时间" prop="startTime" min-width="150" align="center">
        <template #default="{ row }">
          <el-date-picker 
            v-model="row.startTime" 
            type="datetime" 
            placeholder=""
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm"
          />
        </template>
      </el-table-column>
      
      <el-table-column label="下工时间" prop="endTime" min-width="150" align="center">
        <template #default="{ row }">
          <el-date-picker 
            v-model="row.endTime" 
            type="datetime" 
            placeholder=""
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm"
          />
        </template>
      </el-table-column>
      
      <el-table-column label="时长" min-width="100" align="center">
        <template #default="{ row }">
          {{ calculateDuration(row.startTime, row.endTime) }}
        </template>
      </el-table-column>
      
      <el-table-column label="放行时间" prop="releaseTime" min-width="100" align="center">
        <template #default="{ row }">
          <el-input v-model="row.releaseTime" placeholder="" />
        </template>
      </el-table-column>
      
      <el-table-column label="上工操作人" prop="operation" min-width="100" align="center">
        <template #default="{ row }">
          <el-input v-model="row.operation" placeholder="" />
        </template>
      </el-table-column>
      
      <el-table-column label="上工操作时间" prop="operationTime" min-width="150" align="center">
        <template #default="{ row }">
          <el-input v-model="row.operationTime" placeholder="" />
        </template>
      </el-table-column>
      
      <el-table-column label="下工操作人" prop="endOperation" min-width="100" align="center">
        <template #default="{ row }">
          <el-input v-model="row.endOperation" placeholder="" />
        </template>
      </el-table-column>
      
      <el-table-column label="下工操作时间" prop="endOperationTime" min-width="150" align="center">
        <template #default="{ row }">
          <el-input v-model="row.endOperationTime" placeholder="" />
        </template>
      </el-table-column>
      
      <el-table-column label="加班时间" prop="overtimeHours" min-width="100" align="center">
        <template #default="{ row }">
          <el-input v-model="row.overtimeHours" placeholder="" />
        </template>
      </el-table-column>
      
      <el-table-column label="设备时间" prop="deviceHours" min-width="100" align="center">
        <template #default="{ row }">
          <el-input v-model="row.deviceHours" placeholder="" />
        </template>
      </el-table-column>
    </el-table>
    
    <div class="table-footer">
      <span class="footer-label">总计</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Icon } from '/@/components/Icon'

// 表格数据
const tableData = ref([
  {
    employee: '',
    employeeId: '',
    allocation: '',
    pieceRate: '',
    startTime: '',
    endTime: '',
    releaseTime: '',
    operation: '',
    operationTime: '',
    endOperation: '',
    endOperationTime: '',
    overtimeHours: '',
    deviceHours: ''
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

// 计算时长
const calculateDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return ''
  
  try {
    const start = new Date(startTime)
    const end = new Date(endTime)
    const diff = end - start
    
    if (diff < 0) return ''
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    return `${hours}小时${minutes}分钟`
  } catch (e) {
    return ''
  }
}

// 添加行
const handleAddRow = (index) => {
  tableData.value.splice(index + 1, 0, {
    employee: '',
    employeeId: '',
    allocation: '',
    pieceRate: '',
    startTime: '',
    endTime: '',
    releaseTime: '',
    operation: '',
    operationTime: '',
    endOperation: '',
    endOperationTime: '',
    overtimeHours: '',
    deviceHours: ''
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
:deep(.el-date-editor) {
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