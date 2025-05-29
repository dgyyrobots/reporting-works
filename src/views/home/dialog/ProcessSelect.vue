<template>
  <el-dialog
    v-model="visible"
    class="process-select-dialog"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :modal-class="'cyber-modal'"
    title="选择工序"
    :top="'15vh'"
    width="800px"
    @closed="handleClose"
  >
    <template #header>
      <div class="custom-dialog-header">
        <span class="el-dialog__title">选择工序</span>
        <span class="device-name" v-if="props.currentDevice && props.currentDevice.name">
          - {{ props.currentDevice.name }} {{ props.currentDevice.number }}
        </span>
      </div>
    </template>
    
    <div class="dialog-content">
      <div class="process-grid">
        <div 
          v-for="process in processList" 
          :key="process.key" 
          class="process-item"
          @click="selectProcess(process)"
        >
          <div class="process-icon">
            <Icon icon="svg-icon:process-flow" />
            <span v-if="process.count > 0" class="badge">{{ process.count }}</span>
          </div>
          <div class="process-name">{{ process.name }}</div>
        </div>
      </div>
    </div>
  </el-dialog>

  <!-- 引入任务单操作组件 -->
  <TaskOperation 
    ref="taskOperationRef" 
    :currentDevice="props.currentDevice" 
    :selectedProcess="selectedProcess"
  />
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Icon } from '/@/components/Icon'
import TaskOperation from './TaskOperation.vue'

const props = defineProps({
  currentDevice: {
    type: Object,
    default: () => ({})
  },
})

// 控制对话框显示状态
const visible = ref(false)
const selectedProcess = ref(null)
const taskOperationRef = ref(null)

// 工序列表数据
const processList = ref([
  { key: 'mqat', name: '模切凹凸', count: 9 },
  { key: 'mq', name: '模切', count: 8 },
  { key: 'yw', name: '压纹', count: 2 },
  { key: 'at', name: '凹凸', count: 1 }
])

// 打开对话框
const openDialog = () => {
  visible.value = true
}

// 关闭对话框
const handleClose = () => {
  visible.value = false
  selectedProcess.value = null
}

// 选择工序
const selectProcess = (process) => {
  selectedProcess.value = process
  // 打开任务单操作组件
  taskOperationRef.value?.openDialog(process)
}

// 暴露方法给父组件
defineExpose({
  openDialog
})
</script>

<style lang="scss">
/* 全局样式，不使用scoped */
.cyber-modal {
  background-color: rgba(0, 21, 41, 0.85) !important;
  backdrop-filter: blur(5px);
}

/* 强制覆盖Element Plus对话框样式 */
.el-overlay-dialog {
  .el-dialog.process-select-dialog {
    background-color: rgba(0, 21, 41, 0.85);
    border: 1px solid #1ecfff;
    border-radius: 2px;
    box-shadow: 0 0 20px rgba(30, 207, 255, 0.4);
    margin-top: 15vh !important; /* 确保优先级足够高 */

    .el-dialog__body {
      padding: 0 !important;
    }

    .el-dialog__header {
      height: 40px !important;
      color: #1ecfff !important;
      border-bottom: 1px solid rgba(30, 207, 255, 0.3);
      padding: 0px 16px !important;
    }

    /* 添加自定义标题样式 */
    .custom-dialog-header {
      display: flex;
      align-items: center;
      .el-dialog__title {
        color: #1ecfff !important;
        font-weight: 500;
        letter-spacing: 1px;
        text-shadow: 0 0 8px rgba(30, 207, 255, 0.5);
        font-size: 16px;
      }
      
      .device-name {
        color: rgba(255, 255, 255, 0.7);
        font-size: 12px;
        margin-left: 8px;
        font-weight: normal;
        letter-spacing: 0;
        text-shadow: none;
      }
    }

    .el-dialog__headerbtn .el-dialog__close {
      color: #1ecfff !important;

      &:hover {
        color: #4fdcff !important;
      }
    }

    .el-dialog__body {
      padding: 0 !important;
    }
  }
}
</style>

<style lang="scss" scoped>
.process-select-dialog {
  :deep(.el-dialog__body) {
    max-height: calc(100vh - 200px);
    overflow: hidden;
    padding: 0 !important;
  }

  :deep(.el-dialog) {
    background-color: rgba(0, 21, 41, 0.85);
    border: 1px solid #1ecfff;
    border-radius: 2px;
    box-shadow: 0 0 20px rgba(30, 207, 255, 0.4);
    backdrop-filter: blur(5px);
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    margin: 0 auto;

    .el-dialog__header {
      padding: 4px 16px;
      border-bottom: 1px solid rgba(30, 207, 255, 0.3);
      margin-right: 0;
    }

    .el-dialog__body {
      flex: 1;
      overflow: hidden;
    }
  }

  .dialog-content {
    padding: 30px;
    
    .process-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 30px;
      
      .process-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: rgba(0, 21, 41, 0.5);
        border: 1px solid rgba(30, 207, 255, 0.3);
        border-radius: 8px;
        padding: 30px 20px;
        cursor: pointer;
        transition: all 0.3s;
        position: relative;
        height: 140px;
        
        &:hover {
          background-color: rgba(30, 207, 255, 0.1);
          border-color: rgba(30, 207, 255, 0.8);
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        
        .process-icon {
          font-size: 50px;
          color: #1ecfff;
          margin-bottom: 15px;
          position: relative;
          text-shadow: 0 0 10px rgba(30, 207, 255, 0.5);
          
          .badge {
            position: absolute;
            top: -10px;
            right: -10px;
            background-color: #ff5252;
            color: white;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
          }
        }
        
        .process-name {
          color: #ffffff;
          font-size: 16px;
          text-align: center;
          letter-spacing: 1px;
        }
      }
    }
  }
}

:deep(.custom-dialog-header) {
  display: flex;
  align-items: center;
  
  .el-dialog__title {
    color: #1ecfff !important;
    font-weight: 500;
    letter-spacing: 1px;
    text-shadow: 0 0 8px rgba(30, 207, 255, 0.5);
    font-size: 16px;
  }
  
  .device-name {
    color: rgba(255, 255, 255, 0.7);
    font-size: 12px;
    margin-left: 8px;
    font-weight: normal;
    letter-spacing: 0;
    text-shadow: none;
  }
}
</style>