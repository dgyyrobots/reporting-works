<template>
  <el-dialog
    v-model="visible"
    class="production-report-dialog"
    :close-on-click-modal="false"
    :modal-class="'cyber-modal'"
    :show-close="true"
    title="新增生产日报表"
    width="90%"
  >
    <div class="dialog-content">
      <ProductionReportForm ref="formRef" />
    </div>
    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, defineExpose } from 'vue'
import ProductionReportForm from './ProductionReportForm.vue'

const visible = ref(false)
const formRef = ref(null)

function openDialog() {
  visible.value = true
}

function closeDialog() {
  visible.value = false
}

function handleCancel() {
  closeDialog()
}

function handleSubmit() {
  // 获取表单数据
  const formData = formRef.value?.formData
  console.log('提交的表单数据:', formData)
  // 提交逻辑后续补充
  closeDialog()
}

defineExpose({ openDialog, closeDialog })
</script>

<style lang="scss" scoped>
.production-report-dialog :deep(.el-dialog) {
  background: rgba(0, 21, 41, 0.95);
  border: 1px solid #1ecfff;
  border-radius: 8px;
  box-shadow: 0 0 30px rgba(30, 207, 255, 0.4);
}

.dialog-content {
  min-height: 400px;
  padding: 20px;
  color: #fff;
}

:deep(.el-dialog__header) {
  margin-right: 0;
  border-bottom: 1px solid rgba(30, 207, 255, 0.3);
  background: linear-gradient(90deg, #1573ce 0%, #0a2a50 100%);
  padding: 15px 20px;
}

:deep(.el-dialog__title) {
  color: #fff;
  font-size: 16px;
  font-weight: 500;
}

:deep(.el-dialog__headerbtn) {
  top: 15px;
  
  .el-dialog__close {
    color: #fff;
  }
}

:deep(.el-dialog__footer) {
  border-top: 1px solid rgba(30, 207, 255, 0.3);
  padding: 15px 20px;
}
</style>
