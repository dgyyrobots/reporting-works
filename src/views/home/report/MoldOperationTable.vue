<template>
  <BaseTable 
    v-model:tableData="tableData" 
    :emptyRowTemplate="emptyRowTemplate"
  >
    <el-table-column label="工作内容" prop="work_content" min-width="150" align="center">
      <template #default="{ row }">
        <el-input v-model="row.work_content" placeholder="" />
      </template>
    </el-table-column>
    
    <el-table-column label="模具名称" prop="mould_name" min-width="150" align="center">
      <template #default="{ row }">
        <div class="input-with-search">
          <el-input v-model="row.mould_name" placeholder="" />
          <el-button class="search-btn"><Icon icon="svg-icon:search" /></el-button>
        </div>
      </template>
    </el-table-column>
    
    <el-table-column label="模具编号" prop="mould_no" min-width="120" align="center">
      <template #default="{ row }">
        <el-input v-model="row.mould_no" placeholder="" />
      </template>
    </el-table-column>
    
    <el-table-column label="模具型号" prop="mould_model" min-width="120" align="center">
      <template #default="{ row }">
        <el-input v-model="row.mould_model" placeholder="" />
      </template>
    </el-table-column>
    
    <el-table-column label="模具操作类型" prop="io_type_name" min-width="120" align="center">
      <template #default="{ row }">
        <el-select v-model="row.io_type_name" placeholder="请选择">
          <el-option label="领用" value="领用" />
          <el-option label="归还" value="归还" />
          <el-option label="维修" value="维修" />
          <el-option label="上模" value="上模" />
          <el-option label="下模" value="下模" />
          <el-option label="报废" value="报废" />
        </el-select>
      </template>
    </el-table-column>
    
    <el-table-column label="数量" prop="uqty" min-width="100" align="center">
      <template #default="{ row }">
        <el-input v-model="row.uqty"  />
      </template>
    </el-table-column>
    
    <el-table-column label="备注" prop="note" min-width="200" align="center">
      <template #default="{ row }">
        <el-input 
          v-model="row.note" 
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
  work_content: '',
  mould_name: '',
  mould_no: '',
  mould_model: '',
  io_type_name: '',
  uqty: null,
  note: ''
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