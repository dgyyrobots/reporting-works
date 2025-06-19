<template>
  <BaseTable 
    v-model:tableData="tableData" 
    :emptyRowTemplate="emptyRowTemplate"
  >
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
          <el-option label="领用" value="1" />
          <el-option label="归还" value="2" />
          <el-option label="维修" value="3" />
          <el-option label="上模" value="4" />
          <el-option label="下模" value="5" />
          <el-option label="报废" value="6" />
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
  </BaseTable>
</template>

<script setup>
import { ref } from 'vue'
import { Icon } from '/@/components/Icon'
import BaseTable from './components/BaseTable.vue'

// 空行模板
const emptyRowTemplate = {
  workContent: '',
  moldName: '',
  moldCode: '',
  moldModel: '',
  operationType: '',
  quantity: 0,
  remark: ''
}

// 表格数据
const tableData = ref([{ ...emptyRowTemplate }])

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