<template>
  <div class="choose-select-num">
    <div class="form-container">
      <div class="form-item">
        <div class="form-label">状态：</div>
        <el-select v-model="formData.status" class="full-width" placeholder="请选择状态">
          <el-option label="结束采集" value="2" />
          <el-option label="待采集" value="0" />
        </el-select>
      </div>
      <div class="form-item">
        <div class="form-label">数量：</div>
        <el-input v-model="formData.collection_qty" class="full-width" placeholder="请输入数量" type="number" />
      </div>
    </div>
    <div class="form-footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm">确认</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, defineEmits, defineProps } from 'vue'
import { ElMessage } from 'element-plus'
import { updateVersionNumberManageEntryData } from '@/api/mes/wk/index.ts'

const emit = defineEmits(['cancel', 'confirm'])

const props = defineProps({
  // 可以传入初始值
  // 传入其他参数
  params: {
    type: Object,
    default: () => ({
      work_no: 'ZYCS01-202503012',
      bill_no: 'ZYCS01-202503012_j05',
      order_no: '80',
      workbill_no: 'ZYCS01-202503012_b01',
      wc_id: '118',
      wc_number: '08',
      work_id: '2270',
      wp_number: '017',
      rc_no: 'ZYCS01-202503012_r01',
      device_id: '66',
      jobbill_id: '8543',
      wp_order_no: '80',
    }),
  },
})



const formData = reactive({
  status: '2',
  collection_qty: '0',
})

// 取消操作
const cancel = () => {
    emit('close')
}

// 确认操作
const confirm = async () => {
  try {
    // 构建请求参数
    const requestParams = {
      ...props.params,
      status_id: formData.status,
      collection_qty: formData.collection_qty,
      collection_uqty: 0,
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
