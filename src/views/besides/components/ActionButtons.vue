<template>
    <ContentWrap class="action-buttons">
      <el-button-group class="button-group" size="large">
        <el-button type="warning" @click="$emit('action', 4)">任务领取</el-button>
        <el-button type="primary" @click="$emit('action', 5)">上料扫码</el-button>
        <el-button 
          type="danger" 
          @click="$emit('action', status !== 'STARTED' ? 1 : 3)"
        >
          {{ status !== 'STARTED' ? '开工' : '完工' }}
        </el-button>
        <el-button type="warning" @click="$emit('action', 6)">产出</el-button>
        <el-button type="danger" @click="$emit('action', 7)">检验记录</el-button>
        <el-button type="success" @click="$emit('action', 2)">报工</el-button>
      </el-button-group>
    </ContentWrap>
</template>
  
  <script setup lang="ts">
  defineProps({
    status: String
  })
  
  defineEmits(['action'])
  </script>
  
  <style lang="scss" scoped>
  .action-buttons {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    // background: white;

    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
    white-space: nowrap;
    max-width: 90vw;
    z-index: 999;
    padding-bottom: 12px;
  
    .button-group {
      display: flex;
      flex-wrap: nowrap;
      
      :deep(.el-button) {
        flex-shrink: 0;
        min-width: max-content;
      }
    }
  
    &::-webkit-scrollbar {
      height: 6px;
    }
  
    &::-webkit-scrollbar-thumb {
      background: var(--el-border-color-darker);
      border-radius: 3px;
    }
  }
  </style>