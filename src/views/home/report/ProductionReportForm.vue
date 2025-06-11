<template>
  <div>
    <div class="report-form" v-show="isExpanded">
        <!-- 第一行: 3个item -->
        <div class="form-row">
        <div class="form-item" style="flex: 0 0 50%;">
            <label>单据日期:</label>
            <el-date-picker 
            v-model="formData.reportDate" 
            type="date" 
            placeholder="选择日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            />
        </div>
        <div class="form-item" style="flex: 0 0 25%;">
            <label>工作中心: <span class="required">*</span></label>
            <div class="input-with-search">
            <el-input v-model="formData.workCenter" placeholder="双张机组" />
            </div>
        </div>
        <div class="form-item" style="flex: 0 0 25%;">
            <label>工作中心编码:</label>
            <el-input v-model="formData.workCenterCode" placeholder="15" />
        </div>
        </div>
        
        <!-- 第二行: 4个item -->
        <div class="form-row">
        <div class="form-item" style="flex: 0 0 25%;">
            <label>工序: <span class="required">*</span></label>
            <div class="input-with-search">
            <el-select v-model="formData.process" placeholder="请选择">
                <el-option label="昆明" value="昆明" />
            </el-select>
            </div>
        </div>
        <div class="form-item" style="flex: 0 0 25%;">
            <label>工序编码:</label>
            <el-input v-model="formData.processCode" placeholder="012" />
        </div>
        <div class="form-item" style="flex: 0 0 25%;">
            <label>设备:</label>
            <div class="input-with-search">
            <el-input v-model="formData.equipment" placeholder="BOBST自动烫金机" />
            </div>
        </div>
        <div class="form-item" style="flex: 0 0 25%;">
            <label>设备编码:</label>
            <el-input v-model="formData.equipmentCode" placeholder="TD1#" />
        </div>
        </div>
        
        <!-- 第三行: 4个item -->
        <div class="form-row">
        <div class="form-item" style="flex: 0 0 25%;">
            <label>班次: <span class="required">*</span></label>
            <div class="input-with-search">
            <el-select v-model="formData.shift" placeholder="请选择">
                <el-option label="晚班" value="晚班" />
            </el-select>
            </div>
        </div>
        <div class="form-item" style="flex: 0 0 25%;">
            <label>班次编码:</label>
            <el-input v-model="formData.shiftCode" placeholder="002" />
        </div>
        <div class="form-item" style="flex: 0 0 25%;">
            <label>开始时间:</label>
            <el-date-picker 
            v-model="formData.startTime" 
            type="datetime" 
            placeholder="选择日期时间"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm"
            />
        </div>
        <div class="form-item" style="flex: 0 0 25%;">
            <label>结束时间:</label>
            <el-date-picker 
            v-model="formData.endTime" 
            type="datetime" 
            placeholder="选择日期时间"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm"
            />
        </div>
        </div>
        
        <!-- 第四行: 2个item -->
        <div class="form-row">
        <div class="form-item" style="flex: 0 0 50%;">
            <label>员工:</label>
            <div class="input-with-search">
            <el-input v-model="formData.employee" />
            <el-button class="search-btn"><el-icon><Search /></el-icon></el-button>
            </div>
        </div>
        <div class="form-item" style="flex: 0 0 50%;">
            <label>工号:</label>
            <el-input v-model="formData.employeeId" />
        </div>
        </div>
    </div>

    <div class="expand-collapse-bar" @click="toggleExpand">
      <span class="expand-text">{{ isExpanded ? '收起' : '展开' }}</span>
      <img v-if="isExpanded" src="@/icon/shouqi.svg" alt="收起" class="expand-icon" />
      <img v-else src="@/icon/zhankai.svg" alt="展开" class="expand-icon" />
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { Search } from '@element-plus/icons-vue'

const isExpanded = ref(true)
const formData = reactive({
  reportDate: new Date().toISOString().split('T')[0], // 今天日期
  workCenter: '双张机组',
  workCenterCode: '15',
  process: '昆明',
  processCode: '012',
  equipment: 'BOBST自动烫金机',
  equipmentCode: 'TD1#',
  shift: '晚班',
  shiftCode: '002',
  startTime: '2025-06-10 19:30',
  endTime: '2025-06-11 11:52',
  employee: '',
  employeeId: ''
})

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}
// 暴露表单数据给父组件
defineExpose({
  formData
})
</script>

<style lang="scss" scoped>
// 添加展开/收起按钮样式
.expand-collapse-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 0;
  background-color: rgba(0, 21, 41, 0.95);
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background-color: rgba(30, 207, 255, 0.1);
  }
  
  .expand-text {
    color: #1ecfff;
    font-size: 13px;
    margin-right: 5px;
  }
  
  .expand-icon {
    width: 14px;
    height: 14px;
  }
}
.report-form {
  display: flex;
  flex-direction: column;
  gap: 1px;
  border: 1px solid rgba(30, 207, 255, 0.5);
  background-color: rgba(30, 207, 255, 0.1);
}

.form-row {
  display: flex;
  border-bottom: 1px solid rgba(30, 207, 255, 0.5);
  
  &:last-child {
    border-bottom: none;
  }
}

.form-item {
  padding: 10px 15px;
  display: flex;
  align-items: center;
  border-right: 1px solid rgba(30, 207, 255, 0.5);
  background-color: rgba(0, 21, 41, 0.95);
  
  &:last-child {
    border-right: none;
  }
  
  label {
    width: 100px;
    color: #b6eaff;
    font-size: 14px;
    margin-right: 10px;
    white-space: nowrap;
  }
  
  .required {
    color: #ff5555;
    margin-left: 2px;
  }
}

.input-with-search {
  display: flex;
  flex: 1;
  
  .el-input {
    flex: 1;
  }
  
  .search-btn {
    margin-left: 5px;
    padding: 0 8px;
    background-color: transparent;
    border: 1px solid #1ecfff;
    color: #1ecfff;
    
    &:hover {
      background-color: rgba(30, 207, 255, 0.1);
    }
  }
}

:deep(.el-input__wrapper),
:deep(.el-select),
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
  }
}

:deep(.el-date-editor) {
  width: 100%;
}

:deep(.el-select) {
  width: 100%;
}

:deep(.el-button) {
  border-radius: 4px;
}
</style>