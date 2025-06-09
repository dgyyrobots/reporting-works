<template>
  <div class="choose-select-num">
    <div class="form-container">
      <div class="form-item">
        <div class="form-label">状态：</div>
        <el-select v-model="formData.status_id" class="full-width" placeholder="请选择状态" @change="handleStatusChange">
          <el-option label="结束采集" value="2" />
          <el-option label="待采集" value="0" />
        </el-select>
      </div>
      <div class="form-item">
        <div class="form-label">数量：</div>
        <el-input 
          v-model="formData.collection_qty" 
          class="full-width" 
          placeholder="请输入数量" 
          type="number" 
          :disabled="formData.status_id === '0'"
        />
      </div>
    </div>
    <div class="form-footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm">确认</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, defineEmits, defineProps, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { updateVersionNumberManageEntryData } from '@/api/mes/wk/index.ts'
import { useWorkStore } from '@/store/modules/work.ts'
const emit = defineEmits(['cancel', 'confirm'])

const props = defineProps({
  // 可以传入初始值
  // 传入其他参数
  params: {
    type: Object,
    default: () => ({}),
  },
})


const workStore = useWorkStore()

const formData = reactive({
  status_id: '2',
  collection_qty: '0',
})

// 处理状态变化
const handleStatusChange = (value) => {
  if (value === '0') {
    formData.collection_qty = '0'
  }
}

// 监听状态变化，当选择"待采集"时，自动将数量设为0
watch(() => formData.status_id, (newStatus) => {
  if (newStatus === '0') {
    formData.collection_qty = '0'
  }
})

// 取消操作
const cancel = () => {
    emit('close')
}

// 确认操作
const confirm = async () => {
  try {
    // 从workStore获取taskInfo
    const taskInfo = workStore.getTaskInfo || workStore.taskInfo || {}

    
    // 构建请求参数，合并taskInfo、props.params和formData
    const requestParams = {
      // 从taskInfo中获取必要参数
  
      // 表单数据
      ...taskInfo,
      status_id: formData.status_id,
      collection_qty: formData.collection_qty,
      collection_uqty: formData.collection_qty,
    }

    // 调用接口
    const res = await updateVersionNumberManageEntryData(requestParams)

    if (res && res.ret === 0) {
      ElMessage.success('操作成功')
      emit('confirm', {
        success: true,
        data: formData,
      })
      emit('close')
      // 重置工作状态
      workStore.updateLicenseFleshIndex()
    } else {
      ElMessage.error(res?.message || '操作失败')
      emit('confirm', {
        success: false,
        error: res?.message || '操作失败',
      })
    }
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error(`操作失败: ${error.message || '未知错误'}`)
    emit('confirm', {
      success: false,
      error: error.message || '未知错误',
    })
  }
}
</script>

<style lang="scss" scoped>
.choose-select-num {
  width: 100%;
  min-width: 260px; /* 新增，保证弹窗有宽度 */

  .form-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 20px;
    min-width: 220px; /* 新增，保证内容区有宽度 */
  }

  .form-item {
    display: flex;
    align-items: center;

    .form-label {
      width: 60px;
      font-size: 14px;
    }

    .full-width {
      flex: 1;
    }
  }

  .form-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
  }
}







</style>
