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
      <select v-model="row.io_type_name" class="custom-select">
        <option value="">请选择</option>
        <option value="领用">领用</option>
        <option value="归还">归还</option>
        <option value="维修">维修</option>
        <option value="上模">上模</option>
        <option value="下模">下模</option>
        <option value="报废">报废</option>
      </select>
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
/* 添加普通select的样式 */
.custom-select {
  width: 100%;
  height: 32px;
  background-color: transparent;
  border: 1px solid #1ecfff;
  border-radius: 4px;
  color: #fff;
  padding: 0 8px;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%231ecfff' d='M6 8.825L1.175 4 2.05 3.125 6 7.075 9.95 3.125 10.825 4z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  cursor: pointer;
}

.custom-select:focus {
  box-shadow: 0 0 0 1px #1ecfff;
}

.custom-select option {
  background-color: rgba(0, 21, 41, 0.95);
  color: #fff;
}
</style>