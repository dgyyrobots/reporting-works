<template>
  <el-dialog
    v-model="visible"
    title="请扫描条码"
    width="600px"
    :close-on-click-modal="false"
    class="scan-barcode-dialog"
    :before-close="handleClose"
  >
    <div class="dialog-content">
      <div class="form-item">
        <div class="label">条码编号：</div>
        <div class="input-with-search">
          <!-- <el-input v-model="barcodeInput" placeholder="输入条形码查询" />
          <el-button class="search-btn" @click="openMaterialSelect"><Icon icon="svg-icon:search" /></el-button> -->
          <SearchSelectInput 
          v-model="selectedMaterial"
          placeholder=""
          :showText="false"
          @select="handleMaterialSelect"
        />
        </div>
      </div>
      
      <div class="form-item">
        <div class="label">数量：</div>
        <el-input v-model="quantity" type="number" placeholder="1" />
      </div>
      
      <div class="form-item">
        <div class="label">名称：</div>
        <div class="value">{{ materialName }}</div>
      </div>
    </div>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleConfirm" class="confirm-btn">确定</el-button>
        <el-button @click="handleClose">关闭</el-button>
      </div>
    </template>
  </el-dialog>
  
  <!-- 添加物料选择对话框 -->
  <MaterialSelectDialog ref="materialSelectDialogRef" @chooseRow="chooseRow" />
</template>

<script setup>
import { ref } from 'vue'
import { Icon } from '/@/components/Icon'
import MaterialSelectDialog from './MaterialSelectDialog.vue'
import SearchSelectInput from '../components/SearchSelectInput.vue'


const emit = defineEmits(['addMaterialName'])

const visible = ref(false)
const barcodeInput = ref('')
const quantity = ref('1')
const materialName = ref('')
const materialSelectDialogRef = ref(null)
const rowData = ref(null)

// 打开对话框
const open = () => {
  visible.value = true
  barcodeInput.value = ''
  quantity.value = '1'
  materialName.value = ''
}



const handleMaterialSelect = (row) => {
  // 这里可以进行其他操作
  materialName.value = row.name
  rowData.value = row
}
// 关闭对话框
const handleClose = () => {
  visible.value = false
}

// 确认选择
const handleConfirm = async() => {
  // 这里可以添加确认逻辑
 await  emit('addMaterialName', rowData.value)
  handleClose()
}

// 打开物料选择对话框
const openMaterialSelect = () => {
  materialSelectDialogRef.value.open()
}
const chooseRow = (row) => {
  rowData.value = row
  materialName.value = row.name
  
}

// 暴露方法给父组件
defineExpose({
  open
})
</script>

<style lang="scss" scoped>
.scan-barcode-dialog {
  :deep(.el-dialog__header) {
    background-color: rgba(30, 207, 255, 0.1);
    margin: 0;
    padding: 15px 20px;
    border-bottom: 1px solid rgba(30, 207, 255, 0.5);
    
    .el-dialog__title {
      color: #b6eaff;
      font-size: 16px;
      font-weight: 500;
    }
    
    .el-dialog__headerbtn {
      top: 15px;
      
      .el-dialog__close {
        color: #b6eaff;
      }
    }
  }
  
  :deep(.el-dialog__body) {
    background-color: rgba(0, 21, 41, 0.95);
    padding: 30px 20px; // 增加上边距
    color: #fff;
  }
  
  :deep(.el-dialog__footer) {
    background-color: rgba(0, 21, 41, 0.95);
    padding: 10px 20px 20px;
    border-top: none;
  }
}

.dialog-content {
   padding-top: 40px;
  .form-item {
    display: flex;
    align-items: center;
    margin-bottom: 20px; // 增加间距
    
    .label {
      width: 100px; // 调整宽度使标签对齐
      display: inline-block;
      text-align: right; // 改为右对齐
      padding-right: 15px; // 增加右侧间距
      color: #b6eaff;
      flex-shrink: 0; // 防止标签宽度被压缩
    }
    
    .value {
      flex: 1;
      color: #fff;
    }
    
    // 添加输入框样式
    .el-input {
      width: 100%;
    }
  }
}

.input-with-search {
  display: flex;
  align-items: center;
  flex: 1;
  width: 100%; // 确保宽度一致
  
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

.dialog-footer {
  display: flex;
  justify-content: center;
  .el-button {
    background-color: #b6eaff;
    border-color: #b6eaff;
    color: #001529;
    padding: 8px 20px;
    
    &:hover {
      background-color: #b6eaff;
      border-color: #b6eaff;
    }
  }
  .confirm-btn {
    background-color: #1ecfff;
    border-color: #1ecfff;
    color: #001529;
    padding: 8px 20px;
    
    &:hover {
      background-color: #33d4ff;
      border-color: #33d4ff;
    }
  }

}
</style>