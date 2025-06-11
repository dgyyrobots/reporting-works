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

    </div>
    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, defineExpose } from 'vue'
const visible = ref(false)


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
  // 提交逻辑后续补充
  closeDialog()
}
defineExpose({ openDialog, closeDialog })
</script>

<style scoped>
.production-report-dialog >>> .el-dialog {
  background: rgba(0, 21, 41, 0.95);
  border: 1px solid #1ecfff;
  border-radius: 8px;
  box-shadow: 0 0 30px rgba(30, 207, 255, 0.4);
}
.dialog-content {
  min-height: 400px;
  /* 可根据实际内容调整 */
}


</style>
