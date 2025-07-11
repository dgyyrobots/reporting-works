<template>
  <BaseTable 
    v-model:tableData="tableData" 
    :emptyRowTemplate="emptyRowTemplate"
  >
    <el-table-column label="员工" prop="emp_name" min-width="140" align="center">
      <template #header>
        员工 <span class="required">*</span>
      </template>
      <template #default="{ row }">
        <div class="input-with-search">
          <el-input v-model="row.emp_name" placeholder="" readonly />
          <el-button class="search-btn" @click="handSearchPerson(row)"><Icon icon="svg-icon:search" /></el-button>
        </div>
      </template>
    </el-table-column>
    
    <el-table-column label="工号" prop="emp_number" min-width="100" align="center">
      <template #default="{ row }">
        <el-input v-model="row.emp_number" placeholder="" />
      </template>
    </el-table-column>
    
    <el-table-column label="员工分配比例" prop="employee_ratio" min-width="100" align="center">
      <template #default="{ row }">
        <el-input v-model="row.employee_ratio" placeholder="" />
      </template>
    </el-table-column>
    
    <el-table-column label="计件比例" prop="ratio_value" min-width="100" align="center">
      <template #default="{ row }">
        <el-input v-model="row.ratio_value" placeholder="" />
      </template>
    </el-table-column>
    
    <el-table-column label="上工时间" prop="start_date" min-width="190" align="center">
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
    
    <el-table-column label="下工时间" prop="end_date" min-width="190" align="center">
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
    
    <el-table-column label="时长" prop="total_time"  min-width="100" align="center">
      <template #default="{ row }">
        <el-input v-model="row.total_time" placeholder="" />
      </template>
    </el-table-column>
    
    <el-table-column label="放行时间" prop="release_time" min-width="100" align="center">
      <template #default="{ row }">
        <el-input v-model="row.release_time" placeholder="" />
      </template>
    </el-table-column>
    
    <el-table-column label="上工操作人" prop="start_operator_name" min-width="140" align="center">
      <template #default="{ row }">
        <div class="input-with-search">
          <el-input v-model="row.start_operator_name" placeholder="" readonly />
          <el-button class="search-btn" @click="handleSearchStartOperator(row)"><Icon icon="svg-icon:search" /></el-button>
        </div>
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
    
    <el-table-column label="下工操作人" prop="end_operator_name" min-width="140" align="center">
      <template #default="{ row }">
        <div class="input-with-search">
          <el-input v-model="row.end_operator_name" placeholder="" readonly />
          <el-button class="search-btn" @click="handleSearchEndOperator(row)"><Icon icon="svg-icon:search" /></el-button>
        </div>
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
    
    <el-table-column label="加班时间" prop="overtime" min-width="100" align="center">
      <template #default="{ row }">
        <el-input v-model="row.overtime" placeholder="" />
      </template>
    </el-table-column>
    
    <el-table-column label="设备时间" prop="device_time" min-width="100" align="center">
      <template #default="{ row }">
        <el-input v-model="row.device_time" placeholder="" />
      </template>
    </el-table-column>
  </BaseTable>
  
  <!-- 添加人员选择组件 -->
  <ChoosePerson ref="choosePersonRef" :isSingle="true" @confirm="handlePersonConfirm" @close="handlePersonClose" />
  <ChoosePersonWithCompany ref="choosePersonWithCompanyRef"  :isSingle="true" @confirm="handleOperatorConfirm" @close="handleOperatorClose" />
</template>

<script setup>
import { ref, computed } from 'vue'
import { Icon } from '/@/components/Icon'
import BaseTable from './components/BaseTable.vue'
import ChoosePerson from './components/ChoosePerson.vue'
import ChoosePersonWithCompany from './components/ChoosePersonWithCompany.vue'
// 空行模板
const emptyRowTemplate = {
    total_time: "",
		release_time: "",
		start_operator_name: "",
		start_operate_date: '',
		end_operator_name: "",
		end_operate_date: '',
		device_name: "",
		device_number: "",
		wp_class_id: "",
		wp_class_name: "",
		device_id: "",
		wp_class_number: "",
		wp_id: "",
		wp_number: "",
		wp_name: "",
		user_id: "",
		user_name: "",
		emp_id: "",
		wc_name: "",
		wc_number: "",
		wc_id: "",
		end_operator_id: "",
		start_operator_id: "",
		source_ids: "",
		overtime: "",
		device_time: ''
}

// 表格数据
const tableData = ref([{ ...emptyRowTemplate }])

// 人员选择组件引用
const choosePersonRef = ref(null)
const choosePersonWithCompanyRef = ref(null)
// 当前正在编辑的行
const currentEditingRow = ref(null)
const currentOperationType = ref('')

// 打开人员选择对话框
const handSearchPerson = (row) => {
  currentEditingRow.value = row
  currentOperationType.value = 'emp_name'
  choosePersonRef.value.open([], false) // 传递 isSingleMode: true
}

// 处理人员选择确认
const handlePersonConfirm = (selectedPerson) => {
  if (selectedPerson && selectedPerson.length > 0 && currentEditingRow.value) {
    const nameArr = []
    const numberArr = []
    const idArr = []
     selectedPerson.map(item=>{
        nameArr.push(item.name)
        numberArr.push(item.number)
        idArr.push(item.id)
      })
        currentEditingRow.value.emp_name = nameArr.join(',')
        currentEditingRow.value.emp_number = numberArr.join(',')
        currentEditingRow.value.emp_id = idArr.join(',')
  }
}




// 处理操作人选择确认
const handleOperatorConfirm = (selectedPerson) => {
  if (selectedPerson && selectedPerson.length > 0 && currentEditingRow.value) {
    // 根据当前操作类型设置不同的字段
    if (currentOperationType.value === 'startOperator') {
      currentEditingRow.value.start_operator_name = selectedPerson[0].fullname
      currentEditingRow.value.start_operator_id = selectedPerson[0].id
    } else if (currentOperationType.value === 'endOperator') {
      currentEditingRow.value.end_operator_name = selectedPerson[0].fullname
      currentEditingRow.value.end_operator_id = selectedPerson[0].id
    }
  }
}

// 打开上工操作人选择对话框
const handleSearchStartOperator = (row) => {
  currentEditingRow.value = row
  currentOperationType.value = 'startOperator'
  choosePersonWithCompanyRef.value.open([], true) // 传递 isSingleMode: true
}

// 打开下工操作人选择对话框
const handleSearchEndOperator = (row) => {
  currentEditingRow.value = row
  currentOperationType.value = 'endOperator'
  choosePersonWithCompanyRef.value.open([], true) // 传递 isSingleMode: true
}
// 处理人员选择关闭
const handlePersonClose = () => {
  currentEditingRow.value = null
}
// 处理操作人选择关闭
const handleOperatorClose = () => {
  currentEditingRow.value = null
  currentOperationType.value = ''
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