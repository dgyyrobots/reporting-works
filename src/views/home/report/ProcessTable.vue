<template>
  <BaseTable 
    :tableData="tableData" 
    :emptyRowTemplate="emptyRowTemplate"
    @add-row="handleAddRow"
    @delete-row="handleDeleteRow"
  >
    <el-table-column label="类型" prop="type_name" min-width="100" align="center">
      <template #default="{ row }">
        <el-input v-model="row.type_name" placeholder="" />
      </template>
    </el-table-column>
    
    <el-table-column label="开始时间" prop="start_date" min-width="190" align="center">
      <template #default="{ row }">
        <el-date-picker 
          v-model="row.start_date" 
          type="datetime" 
          placeholder=""
          format="YYYY-MM-DD HH:mm"
          value-format="YYYY-MM-DD HH:mm"
          @change="() => handleTimeChange(row)"
        />
      </template>
    </el-table-column>
    
    <el-table-column label="结束时间" prop="end_date" min-width="190" align="center">
      <template #default="{ row }">
        <el-date-picker 
          v-model="row.end_date" 
          type="datetime" 
          placeholder=""
          format="YYYY-MM-DD HH:mm"
          value-format="YYYY-MM-DD HH:mm"
          @change="() => handleTimeChange(row)"
        />
      </template>
    </el-table-column>
    
    <el-table-column label="时长(小时)" min-width="100" align="center">
      <template #default="{ row }">
        <el-input v-model="row.total_time" placeholder="" />
      </template>
    </el-table-column>
    
    <el-table-column label="工单号" prop="note" min-width="120" align="center">
      <template #default="{ row }">
        <el-input v-model="row.note" placeholder="" />
      </template>
    </el-table-column>
    
    <el-table-column label="工单编码" prop="work_no" min-width="120" align="center">
      <template #default="{ row }">
        <el-input v-model="row.work_no" placeholder="" />
      </template>
    </el-table-column>
    
    <el-table-column label="物料名称" prop="sku_name" min-width="150" align="center">
      <template #default="{ row }">
        <el-input v-model="row.sku_name" placeholder="" />
      </template>
    </el-table-column>
    
    <el-table-column label="物料编码" prop="sku_no" min-width="120" align="center">
      <template #default="{ row }">
        <el-input v-model="row.sku_no" placeholder="" />
      </template>
    </el-table-column>
    
    <el-table-column label="工艺描述" prop="prodesc" min-width="200" align="center">
      <template #default="{ row }">
        <el-input 
          v-model="row.prodesc" 
          type="textarea" 
          :rows="2"
          placeholder="" 
        />
      </template>
    </el-table-column>
  </BaseTable>
</template>

<script setup>
import { ref } from 'vue'
import { Icon } from '/@/components/Icon'
import BaseTable from './components/BaseTable.vue'

// 空行模板
const emptyRowTemplate = {
  type_name: '',
  start_date: '',
  end_date: '',
  note: '',
  work_no: '',
  sku_name: '',
  sku_no: '',
  prodesc: ''
}

// 表格数据
const tableData = ref([{ ...emptyRowTemplate }])

// 添加行处理函数
const handleAddRow = (index) => {
  const newData = [...tableData.value]
  newData.splice(index, 0, { ...emptyRowTemplate })
  tableData.value = newData
}

// 删除行处理函数
const handleDeleteRow = (index) => {
  if (tableData.value.length > 1) {
    const newData = [...tableData.value]
    newData.splice(index, 1)
    tableData.value = newData
  }
}

// 处理时间变化，自动计算时长
const handleTimeChange = (row) => {
  if (row.start_date && row.end_date) {
    try {
      const start = new Date(row.start_date)
      const end = new Date(row.end_date)
      const diffMs = end - start
      
      if (diffMs < 0) {
        row.total_time = ''
        return
      }
      
      // 计算小时数，保留两位小数
      const hours = (diffMs / (1000 * 60 * 60)).toFixed(2)
      row.total_time = hours
    } catch (e) {
      console.error('计算时长出错:', e)
      row.total_time = ''
    }
  } else {
    row.total_time = ''
  }
}
// 暴露表格数据给父组件
defineExpose({
  tableData
})
</script>

<style lang="scss" scoped>
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

:deep(.el-textarea) {
  .el-textarea__inner {
    background-color: transparent;
    border-color: #1ecfff;
    color: #fff;
    box-shadow: 0 0 0 1px #0f7294 inset;
    
    &:focus { 
      box-shadow: 0 0 0 1px #1ecfff inset;
    }
  }
}
</style>