<template>
  <BaseTable 
    :tableData="tableData" 
    :emptyRowTemplate="emptyRowTemplate"
    @add-row="handleAddRow"
    @delete-row="handleDeleteRow"
  >
    <el-table-column label="类型" prop="type" min-width="100" align="center">
      <template #default="{ row }">
        <el-input v-model="row.type" placeholder="" />
      </template>
    </el-table-column>
    
    <el-table-column label="开始时间" prop="startTime" min-width="150" align="center">
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
    
    <el-table-column label="结束时间" prop="endTime" min-width="150" align="center">
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
    
    <el-table-column label="时长(小时)" min-width="100" align="center">
      <template #default="{ row }">
        {{ calculateDuration(row.startTime, row.endTime) }}
      </template>
    </el-table-column>
    
    <el-table-column label="工单号" prop="workOrderNo" min-width="120" align="center">
      <template #default="{ row }">
        <div class="input-with-search">
          <el-input v-model="row.workOrderNo" placeholder="" />
          <el-button class="search-btn"><Icon icon="svg-icon:search" /></el-button>
        </div>
      </template>
    </el-table-column>
    
    <el-table-column label="工单编码" prop="workOrderCode" min-width="120" align="center">
      <template #default="{ row }">
        <el-input v-model="row.workOrderCode" placeholder="" />
      </template>
    </el-table-column>
    
    <el-table-column label="物料名称" prop="materialName" min-width="150" align="center">
      <template #default="{ row }">
        <el-input v-model="row.materialName" placeholder="" />
      </template>
    </el-table-column>
    
    <el-table-column label="物料编码" prop="materialCode" min-width="120" align="center">
      <template #default="{ row }">
        <el-input v-model="row.materialCode" placeholder="" />
      </template>
    </el-table-column>
    
    <el-table-column label="工艺描述" prop="processDescription" min-width="200" align="center">
      <template #default="{ row }">
        <el-input 
          v-model="row.processDescription" 
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
  type: '',
  startTime: '',
  endTime: '',
  workOrderNo: '',
  workOrderCode: '',
  materialName: '',
  materialCode: '',
  processDescription: ''
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

// 计算时长（小时）
const calculateDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return ''
  
  try {
    const start = new Date(startTime)
    const end = new Date(endTime)
    const diff = end - start
    
    if (diff < 0) return ''
    
    // 转换为小时，保留两位小数
    const hours = (diff / (1000 * 60 * 60)).toFixed(2)
    
    return hours
  } catch (e) {
    return ''
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
</style>