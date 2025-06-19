<template>
  <BaseTable 
    v-model:tableData="tableData" 
    :emptyRowTemplate="emptyRowTemplate"
    @add-row="handleAddRow"
    @delete-row="handleDeleteRow"
  >
    <el-table-column label="流转卡编码" prop="cardCode" min-width="120" align="center">
      <template #default="{ row }">
        <div class="input-with-search">
          <el-input v-model="row.cardCode" placeholder="" />
          <el-button class="search-btn"><Icon icon="svg-icon:search" /></el-button>
        </div>
      </template>
    </el-table-column>
    
    <el-table-column label="物料名称" prop="materialName" min-width="150" align="center">
      <template #header>
        <div class="column-header-with-icon">
          <span>物料名称</span>
          <span @click="openScanDialog"><Icon icon="svg-icon:scan" class="expand-icon" /></span>     
        </div>
      </template>
      <template #default="{ row ,$index}">
        <div class="input-with-search">
          <el-input v-model="row.materialName" placeholder="请输入物料名称或编码" />
          <el-button class="search-btn" @click="handMore($index)"> <el-icon><More /></el-icon></el-button>
        </div>
      </template>
    </el-table-column>
    
    <!-- 其他列保持不变 -->
    <el-table-column label="汇报数量" prop="reportQuantity" min-width="100" align="center">
      <template #default="{ row }">
        <el-input v-model="row.reportQuantity" placeholder="" />
      </template>
    </el-table-column>
    
    <!-- ... 其他列 ... -->
    <el-table-column label="合格数量" prop="qualifiedQuantity" min-width="100" align="center">
      <template #default="{ row }">
        <el-input v-model="row.qualifiedQuantity" placeholder="" />
      </template>
    </el-table-column>
    
    <el-table-column label="制程废品" prop="processWaste" min-width="100" align="center">
      <template #default="{ row }">
        <el-input v-model="row.processWaste" placeholder="" />
      </template>
    </el-table-column>
    
    <el-table-column label="过版纸数量" prop="paperQuantity" min-width="120" align="center">
      <template #default="{ row }">
        <el-input v-model="row.paperQuantity" placeholder="" />
      </template>
    </el-table-column>
    
    <el-table-column label="无形损耗数量" prop="invisibleLoss" min-width="120" align="center">
      <template #default="{ row }">
        <el-input v-model="row.invisibleLoss" placeholder="" />
      </template>
    </el-table-column>
    
    <el-table-column label="定额数量" prop="quotaQuantity" min-width="100" align="center">
      <template #default="{ row }">
        <el-input v-model="row.quotaQuantity" placeholder="" />
      </template>
    </el-table-column>
    
    <el-table-column label="计件定额" prop="pieceQuota" min-width="100" align="center">
      <template #default="{ row }">
        <el-input v-model="row.pieceQuota" placeholder="" />
      </template>
    </el-table-column>
    
    <el-table-column label="计件系数" prop="pieceCoefficient" min-width="100" align="center">
      <template #default="{ row }">
        <el-input v-model="row.pieceCoefficient" placeholder="" />
      </template>
    </el-table-column>
    
    <el-table-column label="机台系数" prop="machineCoefficient" min-width="100" align="center">
      <template #default="{ row }">
        <el-input v-model="row.machineCoefficient" placeholder="" />
      </template>
    </el-table-column>
    
    <el-table-column label="物料编号" prop="materialCode" min-width="120" align="center">
      <template #default="{ row }">
        <el-input v-model="row.materialCode" placeholder="" />
      </template>
    </el-table-column>
    
    <el-table-column label="工序序号" prop="processSequence" min-width="100" align="center">
      <template #default="{ row }">
        <el-input v-model="row.processSequence" placeholder="" />
      </template>
    </el-table-column>
    
    <el-table-column label="新版次数" prop="newVersionCount" min-width="100" align="center">
      <template #default="{ row }">
        <el-input v-model="row.newVersionCount" placeholder="" />
      </template>
    </el-table-column>
    
    <el-table-column label="旧版次数" prop="oldVersionCount" min-width="100" align="center">
      <template #default="{ row }">
        <el-input v-model="row.oldVersionCount" placeholder="" />
      </template>
    </el-table-column>
    
    <el-table-column label="磨刀次数" prop="knifeGrindingCount" min-width="100" align="center">
      <template #default="{ row }">
        <el-input v-model="row.knifeGrindingCount" placeholder="" />
      </template>
    </el-table-column>
  </BaseTable>
    <!-- 添加扫码对话框组件 -->
  <ScanBarcodeDialog ref="scanBarcodeDialogRef" @addMaterialName="addMaterialName" />
  <MaterialSelectDialog ref="materialSelectDialogRef" @chooseRow="handleChooseMaterial" />
</template>

<script setup>
import { ref } from 'vue'
import { Icon } from '/@/components/Icon'
import { More, Close } from '@element-plus/icons-vue'
import BaseTable from './components/BaseTable.vue'
import ScanBarcodeDialog from './components/ScanBarcodeDialog.vue'
import MaterialSelectDialog from './components/MaterialSelectDialog.vue'

// 空行模板
const emptyRowTemplate = {
  cardCode: '',
  materialName: '',
  reportQuantity: '',
  qualifiedQuantity: '',
  processWaste: '',
  paperQuantity: '',
  invisibleLoss: '',
  quotaQuantity: '',
  pieceQuota: '',
  pieceCoefficient: '',
  machineCoefficient: '',
  materialCode: '',
  processSequence: '',
  newVersionCount: '',
  oldVersionCount: '',
  knifeGrindingCount: ''
}
const materialSelectDialogRef = ref(null)
const materialSelectDialogChooseIndex = ref(null)
// 表格数据
const tableData = ref([{ ...emptyRowTemplate }])

// 添加行处理函数
const handleAddRow = (index) => {
  // 这里可以添加其他逻辑，但不要再操作tableData
  console.log('行已添加，索引:', index)
}

// 删除行处理函数
const handleDeleteRow = (index) => {
 // 这里可以添加其他逻辑，但不要再操作tableData
 console.log('行已删除，索引:', index)
}

// 扫码对话框引用
const scanBarcodeDialogRef = ref(null)

// 打开扫码对话框
const openScanDialog = () => {
  scanBarcodeDialogRef.value.open()
}

const addMaterialName = (data) => {
  tableData.value.push({materialName:data.name,materialCode:data.number})
}

const handMore = (index) => {
  materialSelectDialogChooseIndex.value = index
  materialSelectDialogRef.value.open()
}

// 处理选择物料
const handleChooseMaterial = (material) => {
  if (material) {
      tableData.value[materialSelectDialogChooseIndex.value].materialName = material.name || ''
      tableData.value[materialSelectDialogChooseIndex.value].materialCode = material.number || ''
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

// 添加列标题样式
.column-header-with-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  
  span {
    display: flex;
    align-items: center;
  }
  
  .expand-icon {
    margin-left: 5px;
    color: #1ecfff;
    font-size: 16px;
    cursor: pointer;
  }
}

// 添加下拉菜单样式
:deep(.el-popper) {
  background-color: rgba(0, 21, 41, 0.95) !important;
  border: 1px solid rgba(30, 207, 255, 0.5) !important;
  
  .el-select-dropdown__list {
    padding: 4px 0;
  }
  
  .el-select-dropdown__item {
    color: #b6eaff !important;
  }
  
  .el-select-dropdown__item.hover, 
  .el-select-dropdown__item:hover {
    background-color: rgba(30, 207, 255, 0.1) !important;
  }
  
  .el-select-dropdown__item.selected {
    color: #1ecfff !important;
    background-color: rgba(30, 207, 255, 0.2) !important;
  }
  
  .el-popper__arrow::before {
    background-color: rgba(0, 21, 41, 0.95) !important;
    border-color: rgba(30, 207, 255, 0.5) !important;
  }
}
</style>

