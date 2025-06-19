<template>
  <BaseTable 
    v-model:tableData="tableData" 
    :emptyRowTemplate="emptyRowTemplate"
  >
    <el-table-column label="员工" prop="employee" min-width="140" align="center">
      <template #header>
        员工 <span class="required">*</span>
      </template>
      <template #default="{ row }">
        <div class="input-with-search">
          <el-input v-model="row.employee" placeholder="" readonly />
          <el-button class="search-btn" @click="handSearchPerson(row)"><Icon icon="svg-icon:search" /></el-button>
        </div>
      </template>
    </el-table-column>
    
    <el-table-column label="工号" prop="employeeId" min-width="100" align="center">
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
    
    <el-table-column label="上工时间" prop="startTime" min-width="190" align="center">
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
    
    <el-table-column label="下工时间" prop="endTime" min-width="190" align="center">
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
    
    <el-table-column label="上工操作人" prop="start_operator_name" min-width="100" align="center">
      <template #default="{ row }">
        <el-input v-model="row.start_operator_name" placeholder="" />
      </template>
    </el-table-column>
    
    <el-table-column label="上工操作时间" prop="start_operate_date" min-width="190" align="center">
      <template #default="{ row }">
        <el-date-picker 
          v-model="row.start_operate_date"
          type="datetime" 
          placeholder=""
          format="YYYY-MM-DD HH:mm"
          value-format="YYYY-MM-DD HH:mm"
        />
      </template>
    </el-table-column>
    
    <el-table-column label="下工操作人" prop="end_operator_name" min-width="100" align="center">
      <template #default="{ row }">
        <el-input v-model="row.end_operator_name" placeholder="" />
      </template>
    </el-table-column>
    
    <el-table-column label="下工操作时间" prop="end_operate_date" min-width="190" align="center">
      <template #default="{ row }">
        <el-date-picker 
          v-model="row.end_operate_date"
          type="datetime" 
          placeholder=""
          format="YYYY-MM-DD HH:mm"
          value-format="YYYY-MM-DD HH:mm"
        />
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
  </BaseTable>
  
  <!-- 添加人员选择组件 -->
  <ChoosePerson ref="choosePersonRef" @confirm="handlePersonConfirm" @close="handlePersonClose" />
</template>

<script setup>
import { ref, computed } from 'vue'
import { Icon } from '/@/components/Icon'
import BaseTable from './components/BaseTable.vue'
import ChoosePerson from './components/ChoosePerson.vue'

// 空行模板
const emptyRowTemplate = {
  employee: '',
  employeeId: '',
  allocation: '',
  pieceRate: '',
  startTime: '',
  endTime: '',
  releaseTime: '',
  start_operator_name: '',
  start_operate_date: '',
  end_operator_name: '',
  end_operate_date: '',
  overtimeHours: '',
  deviceHours: ''
}

// 表格数据
const tableData = ref([{ ...emptyRowTemplate }])

// 人员选择组件引用
const choosePersonRef = ref(null)
// 当前正在编辑的行
const currentEditingRow = ref(null)

// 打开人员选择对话框
const handSearchPerson = (row) => {
  currentEditingRow.value = row
  choosePersonRef.value.open([], true) // 传递 isSingleMode: true
}

// 处理人员选择确认
const handlePersonConfirm = (selectedPerson) => {
  if (selectedPerson && selectedPerson.length > 0 && currentEditingRow.value) {
    // 设置员工姓名和工号
    currentEditingRow.value.employee = selectedPerson[0].name
    currentEditingRow.value.employeeId = selectedPerson[0].id
  }
}

// 处理人员选择关闭
const handlePersonClose = () => {
  currentEditingRow.value = null
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

// 暴露表格数据给父组件
defineExpose({
  tableData
})
</script>

<style lang="scss" scoped>
.required {
  color: #ff5555;
  margin-left: 2px;
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
</style>